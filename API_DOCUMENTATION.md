# Task Management API - Detailed Documentation

**Base URL**: `http://localhost:5000`

---

## 1. Authentication Endpoints

### Register a User
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Auth required:** No
- **Description:** Creates a new user account.

**Request Body:**
```json
{
  "email": "alice@example.com",
  "password": "secretpassword123"
}
```

**Success Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "alice@example.com"
  }
}
```

### Log In
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Auth required:** No
- **Description:** Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "alice@example.com",
  "password": "secretpassword123"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

### Get Profile
- **URL:** `/api/auth/profile`
- **Method:** `GET`
- **Auth required:** Yes (Bearer Token)
- **Description:** Retrieves the authenticated user's details.

**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "email": "alice@example.com"
}
```

---

## 2. Task Endpoints

*Note: All task endpoints require the `Authorization: Bearer <your_jwt_token>` header.*

### Create Task
- **URL:** `/api/tasks`
- **Method:** `POST`
- **Description:** Creates a new task for the authenticated user.

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "dueDate": "2025-12-31",
  "status": "pending"
}
```

**Success Response (201 Created):**
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "661f1c2e8a1b2c3d4e5f6789",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "dueDate": "2025-12-31T00:00:00.000Z",
    "status": "pending",
    "userId": 1,
    "createdAt": "2024-04-18T10:00:00.000Z",
    "updatedAt": "2024-04-18T10:00:00.000Z"
  }
}
```

### Get All Tasks
- **URL:** `/api/tasks`
- **Method:** `GET`
- **Description:** Retrieves all tasks belonging to the current user.

**Success Response (200 OK):**
```json
{
  "tasks": [
    {
      "_id": "661f1c2e8a1b2c3d4e5f6789",
      "title": "Buy groceries",
      "status": "pending",
      "userId": 1
    }
  ]
}
```

### Get Single Task
- **URL:** `/api/tasks/:id`
- **Method:** `GET`
- **Description:** Retrieves a specific task by its MongoDB ObjectId.

**Success Response (200 OK):**
```json
{
  "task": {
    "_id": "661f1c2e8a1b2c3d4e5f6789",
    "title": "Buy groceries",
    "status": "pending"
  }
}
```

### Update Task
- **URL:** `/api/tasks/:id`
- **Method:** `PATCH`
- **Description:** Partially updates an existing task. You only need to send the fields you want to change.

**Request Body:**
```json
{
  "status": "completed"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Task updated successfully",
  "task": {
    "_id": "661f1c2e8a1b2c3d4e5f6789",
    "title": "Buy groceries",
    "status": "completed"
  }
}
```

### Delete Task
- **URL:** `/api/tasks/:id`
- **Method:** `DELETE`
- **Description:** Deletes a task.

**Success Response (200 OK):**
```json
{
  "message": "Task deleted successfully"
}
```

---
**Common Error Responses:**
- `400 Bad Request`: When required fields are missing or invalid (Joi validation error).
- `401 Unauthorized`: When the Bearer token is missing, expired, or invalid.
- `403 Forbidden`: When you try to access or modify a task that belongs to another user ID.
- `404 Not Found`: When the requested resource does not exist.
