import pandas as pd
import numpy as np
import re
from sqlalchemy import create_engine

DESCENT_MAPPING = {
    'A': 'Other Asian',
    'B': 'Black',
    'C': 'Chinese',
    'D': 'Cambodian',
    'F': 'Filipino',
    'G': 'Guamanian',
    'H': 'Hispanic/Latin/Mexican',
    'I': 'American Indian/Alaskan Native',
    'J': 'Japanese',
    'K': 'Korean',
    'L': 'Laotian',
    'O': 'Other',
    'P': 'Pacific Islander',
    'S': 'Samoan',
    'U': 'Hawaiian',
    'V': 'Vietnamese',
    'W': 'White',
    'X': 'Unknown',
    'Z': 'Asian Indian'
}

MO_CODE_TYPE_MAPPING = {
    'General MO': 'General',
    'Suspicious Activity MO (SAR Use Only)': 'Suspicious Activity',
    'Traffic Collision MO (CAD Use Only)': 'Traffic Collision'
}


# ---- Load and Tranform crimes ---- #
crimes_df = pd.read_csv('crimes.csv')

# Rename columns
crimes_df = crimes_df.rename(columns={
    'Crm Cd': 'crime_code',
    'Part 1-2': 'crime_part',
    'Crm Cd Desc': 'description',
})

# Drop duplicates and na
crimes_df[['crime_code']].dropna().drop_duplicates()

# Remove special characters from descriptions
crimes_df['description'] = crimes_df['description'].apply(lambda x: x.replace('"', ''))


# ---- Load and Tranform mo_codes ---- #
mo_codes_df = pd.read_csv('mo_codes.csv')

# Remove trailing spaces from mo_code descriptions
mo_codes_df['description'] = mo_codes_df['description'].str.strip()

# Replace mo_code_type with more succint versions
mo_codes_df['mo_type'] = mo_codes_df['mo_type'].map(MO_CODE_TYPE_MAPPING)


# ---- Load and Tranform crime_data ---- #
crimes_reported_df = pd.read_csv('crime_data.csv')

# Rename Columns
crimes_reported_df = crimes_reported_df.rename(columns={
    'DR_NO': 'report_number',
    'Date Rptd': 'date_reported',
    'DATE OCC': 'date_occurred',
    'TIME OCC': 'time_occurred',
    'AREA': 'area_code',
    'AREA NAME': 'area',
    'Rpt Dist No' : 'reporting_district_number',
    'Part 1-2': 'crime_part',
    'Crm Cd'  : 'crime_code',
    'Crm Cd Desc' : 'crime_description',
    'Mocodes' : 'mo_codes',
    'Vict Age': 'victim_age',
    'Vict Sex': 'victim_sex',
    'Vict Descent': 'victim_descent',
    'Premis Cd': 'premise_code',
    'Premis Desc' : 'premise',
    'Weapon Used Cd'  : 'weapon_code',
    'Weapon Desc' : 'weapon',
    'Status'  : 'status_code',
    'Status Desc' : 'status',
    'Crm Cd 1': 'crime_1',
    'Crm Cd 2': 'crime_2',
    'Crm Cd 3': 'crime_3',
    'Crm Cd 4': 'crime_4',
    'LOCATION': 'location',
    'Cross Street': 'cross_street',
    'LAT' : 'latitude',
    'LON' : 'longitude',
})

# Replace victim_age ≤ 0 with None
crimes_reported_df['victim_age'] = crimes_reported_df['victim_age'].apply(lambda x: None if x <= 0 else x)

# Replace victim sex and descent unknowns with None
crimes_reported_df['victim_sex'] = crimes_reported_df['victim_sex'].replace('X', None).replace('H', None)
crimes_reported_df['victim_descent'] = crimes_reported_df['victim_descent'].replace('X', None)

# Replace victim descent code with description
crimes_reported_df['victim_descent'] = crimes_reported_df['victim_descent'].map(DESCENT_MAPPING)

# Remove extra spaces from location and cross_street
crimes_reported_df['location'] = crimes_reported_df['location'].str.strip()
crimes_reported_df['cross_street'] = crimes_reported_df['cross_street'].str.strip()

# Replace 0 lat/lon with None
crimes_reported_df['latitude'] = crimes_reported_df['latitude'].apply(lambda x: None if x == 0 else x)
crimes_reported_df['longitude'] = crimes_reported_df['longitude'].apply(lambda x: None if x == 0 else x)

# Convert date_reported column into date
crimes_reported_df['date_reported'] = pd.to_datetime(crimes_reported_df['date_reported'], format="%m/%d/%Y %I:%M:%S %p").dt.date

# Convert date_occurred to datetime and add time_occurred from 24-hour military time
crimes_reported_df['date_occurred'] = pd.to_datetime(
    crimes_reported_df['date_occurred'],
    format='%m/%d/%Y %I:%M:%S %p',
    errors='coerce'  # handles invalid formats
)

def combine_datetime(row):
    try:
        if pd.isna(row['date_occurred']) or pd.isna(row['time_occurred']):
            return None
        # Ensure time is zero-padded (e.g., 145 -> 0145)
        time_str = str(int(row['time_occurred'])).zfill(4)
        datetime_str = f"{row['date_occurred'].strftime('%Y-%m-%d')} {time_str[:2]}:{time_str[2:]}"
        return pd.to_datetime(datetime_str, format='%Y-%m-%d %H:%M')
    except:
        return None

crimes_reported_df['datetime_occurred'] = crimes_reported_df.apply(combine_datetime, axis=1)

# Replace all NaN values with None
crimes_reported_df = crimes_reported_df.replace({np.nan: None})


# ---- Create and populate dataframes for crime-report and mo_code-report relations ---- #
report_crimes_data = []
report_mo_codes_data = []

# Loop through each row in crimes_reported_df and add a new values into report_crimes_data and report_mo_code_data
for _, row in crimes_reported_df.iterrows():
    report_number = row['report_number']
    
    # Add crime-report relations
    for order, column in enumerate(['crime_1', 'crime_2', 'crime_3', 'crime_4'], start=1):
        crime_code = row.get(column)
        if pd.notnull(crime_code):
            report_crimes_data.append({
                'report_number': report_number,
                'crime_order': order,
                'crime_code': int(crime_code),
            })

    # Add mo_code-report relations
    if not row['mo_codes']: continue
    mo_codes = row['mo_codes'].split(' ')

    for mo_code in mo_codes:
        report_mo_codes_data.append({
            'report_number': report_number,
            'mo_code': mo_code
        })


# Create dataframes from report_crimes_data and report_mo_codes_data with all collected rows
report_crimes_df = pd.DataFrame(report_crimes_data)
report_mo_codes_df = pd.DataFrame(report_mo_codes_data)

# Remove report_crimes rows that include crime_codes not present in the crimes table
report_crimes_df = report_crimes_df[report_crimes_df['crime_code'].isin(crimes_df['crime_code'])]


# ---- Create and populate dataframe of unique locations ---- #
# Create a new dataframe that only includes necessary location information
location_columns = ['location', 'cross_street', 'latitude', 'longitude']
locations_df = crimes_reported_df[location_columns].copy()

# Join same streets with different formats together (eg: FIGUEROA AND FIGUEROA ST) and remove long spaces
street_suffixes = ['ST', 'AVE', 'BLVD', 'RD', 'DR', 'CT', 'PL', 'WAY', 'LN', 'TER', 'CIR', 'HWY', 'PKWY']   # List of common street suffixes to remove

def normalize_street_name(s):
    if pd.isna(s):
        return s
    # Uppercase and remove punctuation
    s = re.sub(r'[^\w\s]', '', s.upper())
    # Collapse multiple spaces
    s = re.sub(r'\s+', ' ', s).strip()
    # Remove suffix if present at end
    for suffix in street_suffixes:
        s = re.sub(rf'\b{suffix}$', '', s).strip()
    return s

# Apply to both columns in both dataframes (useful to join later on location_id)
locations_df['location'] = locations_df['location'].apply(normalize_street_name)
locations_df['cross_street'] = locations_df['cross_street'].apply(normalize_street_name)
crimes_reported_df['location'] = crimes_reported_df['location'].apply(normalize_street_name)
crimes_reported_df['cross_street'] = crimes_reported_df['cross_street'].apply(normalize_street_name)

# Drop duplicates and rows with no location data
locations_df = locations_df.dropna(subset=['location', 'latitude', 'longitude'])
locations_df = locations_df.drop_duplicates().reset_index(drop=True)

# Add an autoincrementing location_id
locations_df.insert(0, 'location_id', range(1, len(locations_df) + 1))

# Add the location ID back to crimes_reported_df by merging crimes_reported_df with locations_df on location_columns
crimes_reported_df = crimes_reported_df.merge(
    locations_df,
    on=location_columns,
    how='left'
)


# ---- Drop unwanted columns from crimes_reported_df ---- #
cols_to_drop = [
    'date_occurred',
    'time_occurred',
    'area_code',
    'area',
    'crime_part',
    'crime_code',
    'crime_description',
    'mo_codes',
    'premise_code',
    'weapon_code',
    'status_code',
    'crime_1',
    'crime_2',
    'crime_3',
    'crime_4',
    'location',
    'cross_street',
    'latitude',
    'longitude',
]
crimes_reported_df.drop(columns=cols_to_drop, inplace=True, errors='ignore')



# ---- Create a database connection with SQLAlchemy using root user ---- #
engine = create_engine('mysql+mysqlconnector://admin:admin_password@localhost:3306/lapd_crimes')


# ---- Insert into crimes table ---- #
crimes_df.to_sql('crimes', engine, if_exists='append', index=False)

# ---- Insert into mo_codes table ---- #
mo_codes_df.to_sql('mo_codes', engine, if_exists='append', index=False)

# ---- Insert into locations table ---- #
locations_df.to_sql('locations', engine, if_exists='append', index=False)

# ---- Insert into crimes_reported table ---- #
crimes_reported_df.to_sql('crimes_reported', engine, if_exists='append', index=False)

# ---- Insert into report_crimes table ---- #
report_crimes_df.to_sql('report_crimes', engine, if_exists='append', index=False)

# ---- Insert into report_mo_codes table ---- #
report_mo_codes_df.to_sql('report_mo_codes', engine, if_exists='append', index=False)