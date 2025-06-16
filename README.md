# Databases and Advanced Data Techniques

## Data
All files used to clean the data, and create and populate the database is stored within the data directory.

### Create the database, users and tables
1. Install and configure the MySQL client if it's not already installed.
2. Run `mysql -u root -p` to connect to the MySQL server as the root user.
2. Run `source data/create_database.sql` from the command line to create the database, users and tables.

### Populate the tables in the database
1. From the project's root directory, go into the data directory by running `cd data`.
2. Create a virtual environment using the command `python -m venv .venv`.
3. Activate the virtual environment with `source .venv/bin/activate`.
4. Install dependencies by running `pip install -r requirements.txt`.
5. Run `python clean_and_load.py` to clean the data and populate the database.

## Web Application
The web application has been built taking into consideration a node version of 18.20 or higher and is composed of a backend and frontend that must be run simultaneously in order to communicate with each other.

### Backend
**Stack:**
- Node.js
- Express
- MySQL

**Run the backend**
1. From the project's root directory, go into the app backend directory by running `cd app/backend`.
2. Install backend dependencies running `npm install`.
3. Run the server with `node server.js`

### Frontend
**Stack:**
 - React
 - Vite
 - Radix UI
 - Tailwind

**Run the frontend**
1. From the project's root directory, go into the app frontend directory by running `cd app/frontend`.
2. Install backend dependencies running `npm install`.
3. Build the application with `npm run build`.
4. Start the application using `npm run dev`.