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
  "status": "pending",
  "category": "661f1c2e8a1b2c3d4e5f6789",
  "tags": ["Work", "Urgent"]
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
    "category": "661f1c2e8a1b2c3d4e5f6789",
    "tags": ["Work", "Urgent"],
    "userId": 1,
    "createdAt": "2024-04-18T10:00:00.000Z",
    "updatedAt": "2024-04-18T10:00:00.000Z"
  }
}
```

### Get All Tasks
- **URL:** `/api/tasks`
- **Method:** `GET`
- **Description:** Retrieves all tasks belonging to the current user. Filters are supported via query parameters.
- **Query Parameters (Optional):**
  - `?category=<categoryId>` - Filter tasks by category ID.
  - `?tags=urgent,work` - Filter tasks that encompass all specified tags.

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

### Category Endpoints

#### Create Category
- **URL:** `/api/categories`
- **Method:** `POST`
- **Description:** Adds a new category for the authenticated user.

**Request Body:**
```json
{
  "name": "Work"
}
```

#### Get Categories
- **URL:** `/api/categories`
- **Method:** `GET`
- **Description:** Retrieves all categories belonging to the authenticated user.

#### Update Category
- **URL:** `/api/categories/:id`
- **Method:** `PATCH`
- **Description:** Rename a category.

#### Delete Category
- **URL:** `/api/categories/:id`
- **Method:** `DELETE`
- **Description:** Deletes a category owned by the authenticated user.

### Tag Endpoints

#### Create Tag
- **URL:** `/api/tags`
- **Method:** `POST`
- **Description:** Creates a free-form tag for the authenticated user.

**Request Body:**
```json
{
  "name": "Urgent"
}
```

#### Get Tags
- **URL:** `/api/tags`
- **Method:** `GET`
- **Description:** Retrieves all tags belonging to the authenticated user.

#### Update Tag
- **URL:** `/api/tags/:id`
- **Method:** `PATCH`
- **Description:** Rename an existing tag.

#### Delete Tag
- **URL:** `/api/tags/:id`
- **Method:** `DELETE`
- **Description:** Deletes a tag owned by the authenticated user.

### Webhook Receiver
- **URL:** `/api/webhook/receive`
- **Method:** `POST`
- **Description:** Simulated external analytics webhook endpoint. The API will send completed task payloads here when `WEBHOOK_URL` is configured to point at this receiver.

**Request Body:**
```json
{
  "id": "661f1c2e8a1b2c3d4e5f6789",
  "title": "Buy groceries",
  "completionDate": "2024-04-18T11:00:00.000Z",
  "userId": 1
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

---

## 3. Category Endpoints

*Note: All category endpoints require the `Authorization: Bearer <your_jwt_token>` header.*

### Create Category
- **URL:** `/api/categories`
- **Method:** `POST`
- **Description:** Creates a new category for the authenticated user.

**Request Body:**
```json
{
  "name": "Work Projects"
}
```

### Get All Categories
- **URL:** `/api/categories`
- **Method:** `GET`
- **Description:** Retrieves all categories associated with the current user.

### Update Category
- **URL:** `/api/categories/:id`
- **Method:** `PATCH`
- **Description:** Edits the name of an existing category.

### Delete Category
- **URL:** `/api/categories/:id`
- **Method:** `DELETE`
- **Description:** Deletes a specific category.

---

## 4. Background Services (Webhooks & Scheduling)

- **Reminders Schedule:** The platform creates a scheduled job whenever a task receives a `dueDate`. One hour prior to expiration, a server-side notification trigger prints reminder context in the terminal log arrays.
- **Completion Webhooks:** Tasks achieving `status=completed` transmit their payload to a simulated external server endpoint. This uses Node queuing (Agenda) with integrated retry mechanisms upon HTTP 5xx failures.
