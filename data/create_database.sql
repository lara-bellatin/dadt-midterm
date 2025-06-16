-- Create database
CREATE DATABASE lapd_crimes;
USE lapd_crimes;

-- Create admin user with all privileges
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin_password';
GRANT ALL ON lapd_crimes.* TO 'admin'@'localhost';

-- Create webapp user with reading privileges only
CREATE USER 'webapp'@'localhost' IDENTIFIED BY 'webapp_password';
GRANT SELECT ON lapd_crimes.* TO 'webapp'@'localhost';

FLUSH PRIVILEGES;

-- Create tables
CREATE TABLE crimes(
  crime_code INT NOT NULL,
  description VARCHAR(56) NOT NULL,
  crime_part INT NOT NULL,
  PRIMARY KEY (crime_code),
  CONSTRAINT crime_part_chk CHECK (crime_part IN (1, 2))
);

CREATE TABLE mo_codes(
  mo_code INT NOT NULL,
  mo_type VARCHAR(19) NOT NULL,
  description VARCHAR(87) NOT NULL,
  PRIMARY KEY (mo_code),
  CONSTRAINT mo_type_chk CHECK (mo_type IN ('General', 'Suspicious Activity', 'Traffic Collision'))
);

CREATE TABLE locations(
  location_id INT NOT NULL AUTO_INCREMENT,
  location VARCHAR(29) NOT NULL,
  longitude NUMERIC,
  latitude NUMERIC,
  cross_street VARCHAR(20),
  PRIMARY KEY (location_id)
);

CREATE TABLE crimes_reported(
  report_number INT NOT NULL,
  reporting_district_number INT NOT NULL,
  date_reported DATE NOT NULL,
  datetime_occurred DATETIME NOT NULL,
  status VARCHAR(12) NOT NULL,
  location_id INT,
  victim_age INT,
  victim_sex VARCHAR(1),
  victim_descent VARCHAR(30),
  premise VARCHAR(57),
  weapon VARCHAR(46),
  PRIMARY KEY (report_number),
  FOREIGN KEY (location_id) REFERENCES locations(location_id),
  CONSTRAINT status_chk CHECK (status IN ('Invest Cont', 'Adult Other', 'Adult Arrest', 'Juv Other', 'Juv Arrest')),
  CONSTRAINT victim_sex_chk CHECK (victim_sex IN ('M', 'F')),
  CONSTRAINT victim_age_chk CHECK (victim_age > 0)
);

CREATE TABLE report_crimes(
  crime_order INT NOT NULL,
  crime_code INT NOT NULL,
  report_number INT NOT NULL,
  PRIMARY KEY (report_number, crime_order),
  FOREIGN KEY (crime_code) REFERENCES crimes(crime_code),
  FOREIGN KEY (report_number) REFERENCES crimes_reported(report_number),
  CONSTRAINT crime_order_chk CHECK (crime_order IN (1, 2, 3, 4))
);

CREATE TABLE report_mo_codes(
  mo_code INT NOT NULL,
  report_number INT NOT NULL,
  PRIMARY KEY (report_number, mo_code),
  FOREIGN KEY (mo_code) REFERENCES mo_codes(mo_code),
  FOREIGN KEY (report_number) REFERENCES crimes_reported(report_number)
);