# Task Management API

## About This Project
This is a Task Management REST API built as part of my internship assessment. 
I chose to use PostgreSQL for user data because it's more suitable for 
authentication/authorization, while MongoDB is perfect for tasks because of its flexible schema.

## Tech Stack
Node.js, Express.js, PostgreSQL (for users), MongoDB (for tasks), JWT for authentication.

## How to Set Up and Run the Application Locally (Including Database Setup)

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18+): [Download & Install](https://nodejs.org/)
- **PostgreSQL**: [Download & Install](https://www.postgresql.org/download/windows/). During installation, remember the password you set for the default `postgres` user.
- **MongoDB**: [Download & Install Community Server](https://www.mongodb.com/try/download/community). It is also recommended to install MongoDB Compass for a GUI.

### Step-by-Step Execution

**1. Install project dependencies:**
Open terminal in the project directory and run:
```bash
npm install
```

**2. Configure Environment Variables:**
You need an environment file to store your database credentials. 
Copy the `.env.example` file and rename it to `.env`:
```bash
copy .env.example .env
```
Open the `.env` file in your code editor. Make sure `POSTGRES_PASSWORD` matches the one you set when installing PostgreSQL, and check that `MONGO_URI` is correct for your local setup.

**3. Create the PostgreSQL Database:**
Before starting the application, you need to initialize the PostgreSQL database.
1. Open **pgAdmin** (which installs alongside PostgreSQL) or the `psql` command-line tool.
2. Login with your `postgres` user.
3. Right-click Databases -> Create -> Database... and name it `taskmanager` (or whatever name you set for `POSTGRES_DB` in your `.env` file).
*Note: You do not need to manually create the tables. The tables will be synced and created automatically by Sequelize/TypeORM when the server starts.*

**4. Start the Application Server:**
Ensure the MongoDB and PostgreSQL services are running natively in the background on your PC. Then, start the development server:
```bash
npm run dev
```

**5. View Documentation:**
Open `http://localhost:5000/api-docs` in your browser.

## API Documentation

I have provided two ways to view the API documentation for this assessment:

**1. Swagger UI (Interactive Viewer):**
You can access the auto-generated live Swagger documentation at `GET /api-docs` when the server is running. This acts as both documentation and an interactive testing client.

**2. Detailed Plain-Text Documentation:**
For a comprehensive breakdown of all endpoints, complete with JSON payload examples, headers, and expected response objects, please read the dedicated [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) file included in this repository.

### Quick Route Overview

**Authentication Endpoints:**
- `POST /api/auth/register` - Create an account
- `POST /api/auth/login` - Get a JWT token

**Task Endpoints (Requires Auth Token):**
- `POST /api/tasks` - Create a task
- `GET /api/tasks` - Get all your tasks
- `GET /api/tasks/:id` - Get a single task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Explanation of Chosen Folder Structure and Design Decisions

### Folder Structure
The application follows a feature-based (modular) architecture under the `src` directory:
- `src/config/`: Contains database connections (MongoDB, PostgreSQL) and environment config details like JWT secrets.
- `src/middleware/`: Application-level middlewares for cross-cutting concerns (e.g., JWT authentication `auth.middleware.js`, centralized error handler `error.middleware.js`, payload validation `validate.js`).
- `src/modules/`: The core business domains of the application, completely isolated by feature:
  - `auth/`: Contains routes, controllers, and validation for user registration and login.
  - `tasks/`: Contains routes, controllers, Mongoose models, and validation logic for CRUD operations on tasks.
- `src/swagger/`: Defines the Swagger API documentation configuration.
- `app.js` / `server.js`: Main Express application configuration and server startup entry point.

### Design Decisions
- **Polyglot Persistence (Dual Databases)**: PostgreSQL is used for the `User` accounts due to its robust relational properties and ACID compliance, which are optimal for handling authentication, credentials, and potential future relational data (e.g., teams, roles). MongoDB is used for `Tasks` because of its document-based flexible schema. This allows tasks to easily evolve (e.g., adding arbitrary tags, comments, subtasks without strict migrations).
- **Feature-Based Modules**: Organizing by feature/domain (`auth/`, `tasks/`) instead of by role (`controllers/`, `routes/`) scales much better in microservice-like environments. It keeps all code related to a single domain tightly coupled and coherent.
- **Centralized Error Handling**: A universal error handling middleware is employed to catch all application exceptions. It intercepts them and ensures the client always receives a clean, standardized JSON error format.
- **Request Validation Middleware**: Utilizing data validation (e.g., Joi) directly inside the route layer (using a validation middleware helper) keeps the controllers clean and ensures only perfectly formed data reaches the database.
