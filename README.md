# Society Event Management System API

The **Society Event Management System API** is a backend service designed to support the **BIIT Societies Events Requisition System**. Built with **Node.js** and **Express**, this API enables secure and efficient communication between the frontend and the database for managing student society events at **BIIT**.

---

## Features

* **Role-Based Authentication**: Role-based authorization.
* **Event Management**: Create, update, delete, and fetch event details.
* **User Management**: Registration, login, and profile management.
* **Approval Workflow**: Manage event approval processes across different roles.
* **Database Integration**: Uses SQL Server for data storage and retrieval.

---

## Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MSSQL

---

## Pre-Requisites

1. **Create the Database**

   * Open SQL Server and create a new database.
   * Database name should match `DB_NAME` in the `.env` file (e.g., `SEMS`).

2. **Create Tables**

   * Use the table structures listed in [SEMSDatabaseTable.txt](https://github.com/qais001-pr/society-event-management-system-server/blob/main/docs/SEMSDatabaseTable.txt) to create tables in your database.

3. **Configure .env File**

   * Update your `.env` with database credentials:

     ```env
     DB_NAME=db_name
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_HOST=localhost
     DB_PORT=1433
     ```

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/qais001-pr/society-event-management-system-server.git
   cd society-event-management-system-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the server:

   ```bash
   npm start
   ```

---

## Notes

* Ensure the database is running before starting the API.
* API endpoints connect using `.env` credentials.
