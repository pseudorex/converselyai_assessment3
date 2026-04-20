# Task Management API: Detailed Documentation

This document provides a comprehensive technical reference for all available API endpoints, authentication mechanisms, and background service logic.

**Base URL**: `http://localhost:5000`

---

## 1. Authentication

Authentication is handled via **JSON Web Tokens (JWT)**.
1.  **Register/Login** to obtain a token.
2.  Include the token in the `Authorization` header for all protected requests:
    `Authorization: Bearer <your_jwt_token>`

### Register User
- **Endpoint**: `POST /api/auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response (201)**: `{ "status": "success", "message": "User registered", "data": { "user": { "id": 1, "email": "..." } } }`

### Login
- **Endpoint**: `POST /api/auth/login`
- **Body**: `{ "email": "...", "password": "..." }`
- **Response (200)**: `{ "status": "success", "token": "..." }`

---

## 2. Task Management

### Create Task
- **Endpoint**: `POST /api/tasks`
- **Body**:
  ```json
  {
    "title": "Fix bug #104",
    "description": "Critical error in login flow",
    "dueDate": "2024-05-20T10:00:00Z",
    "status": "pending",
    "category": "661f1c2e8a1b2c3d4e5f6789",
    "tags": ["Bug", "High Priority"]
  }
  ```
- **Logic**: Schedules a **Reminder Job** if `dueDate` is provided. If `status` is `completed`, triggers a **Webhook Job**.

### Update Task
- **Endpoint**: `PATCH /api/tasks/:id`
- **Body**: Partial updates allowed (e.g., `{ "status": "completed" }`).
- **Logic**: 
  - If `dueDate` changes: Old reminder cancelled, new one scheduled.
  - If `status` becomes `completed`: Triggers Webhook delivery.

### List Tasks (with Filtering)
- **Endpoint**: `GET /api/tasks`
- **Query Parameters**:
  - `category`: Filter by Category ID.
  - `tags`: Comma-separated list (e.g., `?tags=Urgent,Work`). Matches tasks containing *all* listed tags.

---

## 3. Categories & Tags

### Categories
- `POST /api/categories`: `{ "name": "Work" }`
- `GET /api/categories`: Returns all categories.
- `PATCH /api/categories/:id`: `{ "name": "New Name" }`
- `DELETE /api/categories/:id`: Removes the category.

### Tags
- `POST /api/tags`: `{ "name": "Urgent" }`
- `GET /api/tags`: Returns all unique tags created by the user.

---

## 4. Background Job Logic

### Task Reminders (Agenda.js)
- **Lead Time**: 1 Hour.
- **Behavior**: If a task has a `dueDate`, a job is scheduled for exactly 60 minutes before that time.
- **Notification**: The system currently logs the notification to the console and `reminders.log`, and sends a POST request to `REMINDER_WEBHOOK_URL` if configured.

### Webhook & Retry Logic
- **Trigger**: Any task status change to `completed`.
- **Payload**:
  ```json
  {
    "id": "task_id",
    "title": "task_title",
    "completionDate": "timestamp",
    "userId": 1
  }
  ```
- **Retry Strategy**: 
  - **Count**: 3 Retries.
  - **Backoff**: Exponential (Internal 1s, 2s, 4s).
  - **Cleanup**: Jobs that exceed max retries are logged as failures for manual audit.

---

## 5. Webhook Testing Receiver
A built-in dummy receiver is available at `POST /api/webhook/receive` to verify that your scheduled webhooks are firing correctly. It simply logs the incoming payload.
