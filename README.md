# Task Management API

## About This Project
This is a Task Management REST API built as part of my internship assessment. 
I chose to use PostgreSQL for user data because it's more suitable for 
authentication/authorization, while MongoDB is perfect for tasks because of its flexible schema.

## Tech Stack
Node.js, Express.js, PostgreSQL (for users), MongoDB (for tasks), JWT for authentication.

## Setup & Run

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- MongoDB

### Steps

1. Install dependencies:
```bash
npm install
```

2. Setup Environment Variables:
Copy `.env.example` to `.env` and fill in your database credentials:
```bash
copy .env.example .env
```
Make sure `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `MONGO_URI` are correct for your local setup.

3. Create the PostgreSQL Database:
Connect to your PostgreSQL server and create the database you specified in `.env` (e.g. `taskmanager`).
(The tables will be created automatically when the server starts).

4. Start the server:
```bash
npm run dev
```

5. View Documentation:
Open `http://localhost:5000/api-docs` in your browser.

## API Documentation

I have set up Swagger UI for testing the API. You can access it at `GET /api-docs`.

### Authentication
You need to authenticate to use the task routes.
1. `POST /api/auth/register` to create an account
2. `POST /api/auth/login` to get a JWT token
3. Click "Authorize" in Swagger UI and enter `Bearer <your_token>`

### Task Routes
- `POST /api/tasks` - Create a task
- `GET /api/tasks` - Get all your tasks
- `GET /api/tasks/:id` - Get a single task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

Note: You can only access tasks that belong to your user account.

## Folder Structure & Design Decisions

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
