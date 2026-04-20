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
The application follows a **feature-based (modular) architecture** under the `src` directory:

- `src/config/`: Database connection logic (MongoDB, PostgreSQL) and Agenda/JWT configurations.
- `src/middleware/`: Global middlewares (auth protection, centralised error handling, validation).
- `src/services/`: Cross-cutting business logic (e.g., `reminder.service.js`).
- `src/modules/`: Business domains, isolated by feature (auth, tasks, categories, tags, webhook).
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
| **Tasks** | Delete | `DELETE /api/tasks/:id` |
| **Categories** | List / Create | `GET/POST /api/categories` |
| **Categories** | Edit / Delete | `PATCH/DELETE /api/categories/:id` |
| **Tags** | List / Create | `GET/POST /api/tags` |

---

## Technical Design & Architectural Choices

### 1. Task Categorization
- **Choice**: **User-Defined Dynamic Categories**.
- **Justification**: Unlike fixed enums (e.g., "Work," "Personal"), dynamic categories allow users to tailor the system to their unique workflows. By creating a dedicated `Category` model, we enable powerful filtering and organization that can scale as the user's needs grow.
- **Implementation**: Managed as a separate MongoDB collection with a `userId` field to ensure isolation and privacy.

### 2. Tag Management
- **Choice**: **Free-form Text Tags (Array Implementation)**.
- **Justification**: Tags are inherently fluid. Using a string array within the `Task` document allows for lightning-fast tagging without the overhead of relational join tables. It supports complex queries like "find tasks that have *all* of these specific tags" using MongoDB’s `$all` operator.
- **Implementation**: Stored directly on the Task document for performance, validated via Joi to ensure trimming and consistency.

### 3. Reminder Scheduling
- **Choice**: **Agenda.js (MongoDB-backed Queue)**.
- **Justification**: Real-time reminders require persistence. If the server crashes, in-memory timers (`setTimeout`) would be lost. Agenda.js ensures that every reminder is stored in the database and will be processed even after a service restart.
- **Logic**: Reminders are scheduled **1 hour before** the task's `dueDate`. The system intelligently cancels and reschedules jobs if the `dueDate` is updated or the task is completed early.

### 4. Webhook Retry Logic
- **Choice**: **Exponential Backoff Strategy**.
- **Justification**: External services (like analytics webhooks) are notoriously unreliable. A "retry immediately" strategy often fails if the external service is experiencing a short outage.
- **Strategy**: 
    - **Max Retries**: 3.
    - **Backoff**: Wait time doubles after each failure (1s, 2s, 4s).
    - **Benefit**: This minimizes server load during outages and increases the probability of successful delivery once the recipient service recovers.