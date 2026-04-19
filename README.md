# Task Management API: Conversely AI Assessment

## About This Project
This is a comprehensive Task Management REST API built for the Conversely AI internship assessment. The system is designed with a **hybrid database architecture**: **PostgreSQL** handles user authentication and ACID-compliant credentials, while **MongoDB** manages task data, leveraging its flexible schema for dynamic categorization, tagging, and background jobs.

## Key Features
- **Real-time Task Reminders**: Automatically schedules reminders using Agenda.js. Notifications are triggered 1 hour before a task's due date.
- **Dynamic Categorization & Tags**: Users can create their own categories and add multiple free-form tags to any task.
- **Task Filtering**: Advanced filtering by category ID and multiple tags (matches tasks encompassing all provided tags).
- **Simulated External Integration**: Webhooks are automatically sent to a configurable external service when a task is completed, featuring **exponential backoff retry logic**.
- **Docker Orchestration**: The entire stack (API, PostgreSQL, MongoDB, Agenda) is containerised for instant setup.

## Tech Stack
- **Languages/Frameworks**: Node.js, Express.js
- **Databases**: PostgreSQL (Users), MongoDB (Tasks & Jobs)
- **Security**: JWT Authentication, bcrypt.js hashing
- **Background Jobs**: Agenda.js (v6+)
- **Validation**: Joi (Request payload validation)
- **Documentation**: Swagger UI & Markdown

---

## How to Set Up and Run

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Recommended)
- OR **Node.js (v18+)**, **PostgreSQL**, and **MongoDB** installed locally.

### Step-by-Step Execution

#### Option A: Using Docker (Fastest)
1.  **Configure `.env`**: Copy `.env.example` to `.env`.
    ```bash
    copy .env.example .env
    ```
2.  **Spin up the stack**:
    ```bash
    docker-compose up --build
    ```
    *This automatically configures the API, PostgreSQL, and MongoDB containers to work together.*

#### Option B: Local Setup (Manual)
1.  **Install dependencies**: `npm install`
2.  **Configure `.env`**: Ensure `POSTGRES_PASSWORD` and `MONGO_URI` point to your local services.
3.  **Database Initialisation**: Create a database named `taskmanager` in PostgreSQL.
4.  **Run Dev Server**: `npm run dev`

---

## Folder Structure
The application follows a **feature-based (modular) architecture** under the `src` directory, ensuring high cohesion and scalability:

- `src/config/`: Database connection logic (MongoDB, PostgreSQL) and Agenda/JWT configurations.
- `src/middleware/`: Global middlewares (auth protection, centralized error handling, Joi validation).
- `src/services/`: Cross-cutting business logic (e.g., `reminder.service.js` for scheduling logic).
- `src/modules/`: Business domains, isolated by feature:
  - `auth/`: User registration, login, and profile management.
  - `tasks/`: Core CRUD operations, filtering, and status updates.
  - `categories/`: Dynamic category management.
  - `tags/`: Free-form tag management.
  - `webhook/`: Simulated external receiver for testing notifications.
- `src/swagger/`: Swagger/OpenAPI specifications.
- `app.js` / `server.js`: Entry points for Express configuration and server initiation.

---

## API Documentation

### Interactive Documentation
Once the server is running, visit:
**`http://localhost:5000/api-docs`**

### Quick Route Overview

| Domain | Action | Endpoint |
| :--- | :--- | :--- |
| **Auth** | Register | `POST /api/auth/register` |
| **Auth** | Login | `POST /api/auth/login` |
| **Tasks** | List/Filter | `GET /api/tasks?category=ID&tags=work,urgent` |
| **Tasks** | Create | `POST /api/tasks` |
| **Tasks** | Update | `PATCH /api/tasks/:id` |
| **Categories** | List | `GET /api/categories` |
| **Categories** | Create | `POST /api/categories` |
| **Tags** | List | `GET /api/tags` |
| **Webhook** | Receive | `POST /api/webhook/receive` (Testing endpoint) |

---

## Design Decisions

1.  **Polyglot Persistence**: PostgreSQL handles `User` accounts for robust security and ACID compliance. MongoDB handles `Tasks` to allow for a flexible document schema where tags and categories can evolve without strict migration overhead.
2.  **Feature-Based Modules**: Organizing by domain (e.g., `auth`, `tasks`) rather than by role (e.g., `controllers`, `routes`) keeps code related to a single feature tightly coupled, which scales significantly better.
3.  **Agenda.js for Reliability**: We use a database-backed queue (Agenda) for task reminders. This ensures that scheduled notifications persist through server restarts, unlike in-memory `setTimeout` solutions.
4.  **Exponential Backoff Retry**: Webhook deliveries use a strategy of 3 retries with doubling wait times to ensure reliability against intermittent network instability.
5.  **Centralised Error Handling**: A universal wrapper ensures all exceptions are caught and returned in a consistent, clean JSON format for the frontend.