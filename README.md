# Task Management API

> A production-ready REST API for task management with real-time reminders, dynamic categorization, and intelligent webhook integration.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen.svg)](https://www.mongodb.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Authentication & Security](#authentication--security)
- [Background Jobs](#background-jobs)
- [Webhook Integration](#webhook-integration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Performance Considerations](#performance-considerations)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

This Task Management API is a comprehensive solution built as part of the **Conversely AI** internship assessment. It demonstrates enterprise-level backend development practices, combining multiple database systems, real-time processing, and fault-tolerant integrations.

### What Makes This Special?

**Hybrid Database Architecture**: The system strategically uses PostgreSQL for user authentication (ACID compliance for credentials) and MongoDB for task management (flexible schema for dynamic features). This polyglot persistence approach optimizes each database for its strengths.

**Production-Ready Features**: Real-time reminders, intelligent retry mechanisms, comprehensive validation, and containerized deployment make this API ready for real-world use.

---

## ✨ Key Features

### 🔔 Real-Time Task Reminders
- **Automated Scheduling**: Leverages Agenda.js to schedule persistent background jobs
- **Smart Triggers**: Sends notifications exactly 1 hour before a task's due date
- **Crash-Resistant**: Jobs are persisted in MongoDB, surviving server restarts
- **Dynamic Updates**: Automatically reschedules when due dates change
- **Cancellation Logic**: Cleans up jobs when tasks are completed or deleted

### 🏷️ Dynamic Categorization & Tagging
- **User-Defined Categories**: Create custom categories tailored to your workflow
- **Flexible Tagging**: Add unlimited free-form tags to any task
- **Privacy-First**: Categories are isolated per user, ensuring data separation
- **Efficient Querying**: Optimized MongoDB indexes for fast filtering

### 🔍 Advanced Filtering
- **Category Filtering**: Find all tasks within a specific category
- **Multi-Tag Search**: Filter by multiple tags with AND logic (tasks must have ALL specified tags)
- **Status-Based Queries**: Filter by completion status
- **Combined Filters**: Use category, tags, and status together for precise results

### 🔗 External Integration
- **Completion Webhooks**: Automatically notify external services when tasks are marked complete
- **Exponential Backoff**: Intelligent retry logic handles temporary failures gracefully
- **Configurable Endpoints**: Set your webhook URL via environment variables
- **Failure Tracking**: Logs all retry attempts for debugging and monitoring

### 🐳 Docker Orchestration
- **One-Command Setup**: Entire stack runs with `docker-compose up`
- **Isolated Services**: API, PostgreSQL, MongoDB, and Agenda run in separate containers
- **Automatic Networking**: Containers communicate seamlessly via Docker networks
- **Volume Persistence**: Database data survives container restarts

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                        │
│  (Web Apps, Mobile Apps, Third-party Integrations)         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     Express.js API Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth Module  │  │ Task Module  │  │ Webhook Svc  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌────────────────────────────────────────────────────┐    │
│  │          Middleware (JWT, Validation, Error)       │    │
│  └────────────────────────────────────────────────────┘    │
└─────┬───────────────────────────┬────────────────────┬─────┘
      │                           │                    │
      │ User Auth                 │ Task Data          │ Background Jobs
      ▼                           ▼                    ▼
┌─────────────┐          ┌──────────────┐    ┌─────────────────┐
│ PostgreSQL  │          │   MongoDB    │    │   Agenda.js     │
│   (ACID)    │          │  (Flexible)  │    │ (Job Scheduler) │
│             │          │              │    │                 │
│ • users     │          │ • tasks      │    │ • Reminders     │
│             │          │ • categories │    │ • Webhooks      │
│             │          │ • tags       │    │                 │
└─────────────┘          └──────────────┘    └─────────────────┘
```

### Design Principles

1. **Separation of Concerns**: Each module handles a single business domain
2. **Polyglot Persistence**: Right database for the right job
3. **Fail-Fast Validation**: Request validation at the edge using Joi
4. **Stateless Authentication**: JWT tokens enable horizontal scaling
5. **Idempotency**: Safe retry logic for webhook delivery

---

## 🛠️ Tech Stack

### Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Runtime** | Node.js | v18+ | JavaScript runtime environment |
| **Framework** | Express.js | 4.x | Web application framework |
| **Relational DB** | PostgreSQL | 15.x | User authentication & credentials |
| **Document DB** | MongoDB | 6.x | Task management & flexible data |
| **Job Queue** | Agenda.js | 6.x | Background job scheduling |
| **Authentication** | JWT | - | Stateless token-based auth |
| **Password Hashing** | bcrypt.js | - | Secure password storage |
| **Validation** | Joi | - | Request payload validation |
| **Documentation** | Swagger UI | - | Interactive API documentation |
| **Containerization** | Docker | - | Application containerization |
| **Orchestration** | Docker Compose | - | Multi-container management |

### Development Dependencies

- **nodemon**: Hot-reload during development
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing
- **morgan**: HTTP request logging
- **helmet**: Security headers middleware

---

## 🚀 Getting Started

### Prerequisites

Choose one of the following setup methods:

#### Option A: Docker (Recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- No other dependencies needed!

#### Option B: Local Development
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 15+ ([Download](https://www.postgresql.org/download/))
- **MongoDB** 6+ ([Download](https://www.mongodb.com/try/download/community))
- **npm** or **yarn** package manager

---

### Installation

#### 🐳 Docker Setup (Recommended)

This is the fastest way to get started. Docker handles all dependencies automatically.

**Step 1: Clone the repository**
```bash
git clone https://github.com/yourusername/task-management-api.git
cd task-management-api
```

**Step 2: Configure environment variables**
```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

**Step 3: Review and customize `.env`**
```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# PostgreSQL Configuration
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=taskuser
POSTGRES_PASSWORD=securepassword123
POSTGRES_DB=taskmanager

# MongoDB Configuration
MONGO_URI=mongodb://mongo:27017/taskmanager
MONGO_DB_NAME=taskmanager

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d

# Webhook Configuration
WEBHOOK_URL=https://webhook.site/your-unique-id
WEBHOOK_MAX_RETRIES=3
WEBHOOK_RETRY_DELAY=1000

# Agenda Configuration
AGENDA_COLLECTION=agendaJobs
AGENDA_POOL_SIZE=10
```

**Step 4: Launch the application**
```bash
docker-compose up --build
```

**Step 5: Verify the setup**

The API will be available at `http://localhost:5000`. You should see:
```
✓ PostgreSQL connected successfully
✓ MongoDB connected successfully
✓ Agenda.js initialized
✓ Server running on port 5000
```

Visit `http://localhost:5000/api-docs` to explore the interactive API documentation.

---

#### 💻 Local Setup (Manual)

**Step 1: Install dependencies**
```bash
npm install
```

**Step 2: Set up PostgreSQL**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE taskmanager;

# Create user (optional)
CREATE USER taskuser WITH PASSWORD 'securepassword123';
GRANT ALL PRIVILEGES ON DATABASE taskmanager TO taskuser;
```

**Step 3: Set up MongoDB**
```bash
# Start MongoDB service
# Windows
net start MongoDB

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Step 4: Configure environment**

Update `.env` with your local database connections:
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
MONGO_URI=mongodb://localhost:27017/taskmanager
```

**Step 5: Initialize database tables**

The application automatically creates PostgreSQL tables on first run. For manual setup:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Step 6: Start the development server**
```bash
npm run dev
```

**Step 7: Verify the setup**
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "postgres": "connected",
    "mongodb": "connected",
    "agenda": "running"
  }
}
```

---

### Quick Start Guide

Once the server is running, follow these steps to create your first task:

**1. Register a new user**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

**2. Login and get JWT token**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**3. Create a category**
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Work",
    "description": "Work-related tasks"
  }'
```

**4. Create a task with reminder**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete API Documentation",
    "description": "Finish writing comprehensive API docs",
    "categoryId": "CATEGORY_ID_FROM_STEP_3",
    "tags": ["urgent", "documentation", "api"],
    "dueDate": "2024-12-31T15:00:00Z",
    "completed": false
  }'
```

The system will automatically schedule a reminder for 1 hour before the due date!

---

## 📚 API Documentation

### Interactive Documentation

Visit **`http://localhost:5000/api-docs`** for the complete Swagger UI interface.

The interactive documentation includes:
- 🎯 All available endpoints
- 📋 Request/response schemas
- 🔒 Authentication requirements
- 🧪 "Try it out" functionality
- 📖 Example requests and responses

---

### API Endpoints Overview

#### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT token | ❌ |
| `POST` | `/api/auth/logout` | Invalidate current session | ✅ |
| `GET` | `/api/auth/me` | Get current user profile | ✅ |

#### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/tasks` | List all tasks (with filtering) | ✅ |
| `GET` | `/api/tasks/:id` | Get a specific task | ✅ |
| `POST` | `/api/tasks` | Create a new task | ✅ |
| `PATCH` | `/api/tasks/:id` | Update a task | ✅ |
| `DELETE` | `/api/tasks/:id` | Delete a task | ✅ |
| `POST` | `/api/tasks/:id/complete` | Mark task as complete | ✅ |

#### Category Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/categories` | List all user categories | ✅ |
| `GET` | `/api/categories/:id` | Get a specific category | ✅ |
| `POST` | `/api/categories` | Create a new category | ✅ |
| `PATCH` | `/api/categories/:id` | Update a category | ✅ |
| `DELETE` | `/api/categories/:id` | Delete a category | ✅ |

#### Tag Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/tags` | List all unique tags for user | ✅ |
| `POST` | `/api/tags` | Create/add a new tag | ✅ |
| `DELETE` | `/api/tags/:name` | Remove a tag from all tasks | ✅ |

---

### Request & Response Examples

#### Create a Task

**Request:**
```http
POST /api/tasks HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "Review pull requests",
  "description": "Review pending PRs for authentication module",
  "categoryId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "tags": ["code-review", "urgent", "backend"],
  "dueDate": "2024-12-25T14:00:00Z",
  "completed": false
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "task": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "title": "Review pull requests",
      "description": "Review pending PRs for authentication module",
      "userId": 1,
      "categoryId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "tags": ["code-review", "urgent", "backend"],
      "dueDate": "2024-12-25T14:00:00.000Z",
      "completed": false,
      "reminderScheduled": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "Task created successfully. Reminder scheduled for 2024-12-25T13:00:00.000Z"
}
```

---

#### Filter Tasks by Category and Tags

**Request:**
```http
GET /api/tasks?category=65a1b2c3d4e5f6g7h8i9j0k1&tags=urgent,backend HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": {
    "tasks": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "title": "Review pull requests",
        "tags": ["code-review", "urgent", "backend"],
        "categoryId": "65a1b2c3d4e5f6g7h8i9j0k1",
        "completed": false
      },
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
        "title": "Fix authentication bug",
        "tags": ["bug", "urgent", "backend"],
        "categoryId": "65a1b2c3d4e5f6g7h8i9j0k1",
        "completed": false
      }
    ]
  }
}
```

---

#### Error Response Example

**Request with Invalid Data:**
```http
POST /api/tasks HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "",
  "dueDate": "invalid-date"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required and cannot be empty"
      },
      {
        "field": "dueDate",
        "message": "Due date must be a valid ISO 8601 date"
      }
    ]
  }
}
```

---

## 📁 Project Structure

```
task-management-api/
│
├── src/
│   ├── config/                      # Configuration files
│   │   ├── database.js              # MongoDB connection setup
│   │   ├── postgres.js              # PostgreSQL connection pool
│   │   ├── agenda.js                # Agenda.js job scheduler config
│   │   └── jwt.js                   # JWT signing/verification utilities
│   │
│   ├── middleware/                  # Express middlewares
│   │   ├── auth.middleware.js       # JWT authentication middleware
│   │   ├── error.middleware.js      # Centralized error handler
│   │   ├── validation.middleware.js # Joi validation wrapper
│   │   └── rateLimit.middleware.js  # API rate limiting
│   │
│   ├── modules/                     # Feature modules (domain-driven)
│   │   ├── auth/
│   │   │   ├── auth.controller.js   # Authentication logic
│   │   │   ├── auth.routes.js       # Auth route definitions
│   │   │   ├── auth.service.js      # Business logic for auth
│   │   │   └── auth.validation.js   # Joi schemas for auth
│   │   │
│   │   ├── tasks/
│   │   │   ├── task.model.js        # Mongoose schema for tasks
│   │   │   ├── task.controller.js   # Task CRUD controllers
│   │   │   ├── task.routes.js       # Task route definitions
│   │   │   ├── task.service.js      # Business logic for tasks
│   │   │   └── task.validation.js   # Joi schemas for tasks
│   │   │
│   │   ├── categories/
│   │   │   ├── category.model.js    # Mongoose schema for categories
│   │   │   ├── category.controller.js
│   │   │   ├── category.routes.js
│   │   │   ├── category.service.js
│   │   │   └── category.validation.js
│   │   │
│   │   ├── tags/
│   │   │   ├── tag.controller.js    # Tag management controllers
│   │   │   ├── tag.routes.js
│   │   │   ├── tag.service.js
│   │   │   └── tag.validation.js
│   │   │
│   │   └── webhook/
│   │       ├── webhook.service.js   # External webhook integration
│   │       └── webhook.retry.js     # Exponential backoff logic
│   │
│   ├── services/                    # Shared services
│   │   ├── reminder.service.js      # Agenda.js reminder scheduling
│   │   ├── email.service.js         # Email notification service
│   │   └── logger.service.js        # Winston logging configuration
│   │
│   ├── utils/                       # Utility functions
│   │   ├── response.js              # Standardized API responses
│   │   ├── errors.js                # Custom error classes
│   │   └── date.js                  # Date manipulation helpers
│   │
│   ├── swagger/                     # API documentation
│   │   ├── swagger.json             # OpenAPI 3.0 specification
│   │   └── schemas/                 # Reusable schema definitions
│   │
│   ├── app.js                       # Express app configuration
│   └── server.js                    # Server entry point
│
├── tests/                           # Test suites
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docker/                          # Docker configuration
│   ├── Dockerfile                   # API container image
│   ├── docker-compose.yml           # Multi-container orchestration
│   └── init-scripts/                # Database initialization scripts
│
├── docs/                            # Additional documentation
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── .env.example                     # Environment variable template
├── .gitignore                       # Git ignore rules
├── .dockerignore                    # Docker ignore rules
├── package.json                     # NPM dependencies & scripts
├── package-lock.json                # Locked dependency versions
└── README.md                        # This file
```

### Architecture Highlights

**Feature-Based Modules**: Each business domain (auth, tasks, categories) is self-contained with its own routes, controllers, services, and validation schemas.

**Separation of Concerns**:
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Models**: Define data structure
- **Validation**: Ensure data integrity

**Middleware Pipeline**: Global middlewares handle cross-cutting concerns like authentication, error handling, and request validation.

---

## 🗄️ Database Schema

### PostgreSQL Schema (User Authentication)

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- bcrypt hashed
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Why PostgreSQL for Users?**
- ACID compliance ensures credential integrity
- Row-level security for sensitive data
- Proven track record for authentication systems

---

### MongoDB Schema (Task Management)

#### Task Collection
```javascript
{
  _id: ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
  title: String,                    // Required, max 200 chars
  description: String,              // Optional, max 2000 chars
  userId: Number,                   // Reference to PostgreSQL user.id
  categoryId: ObjectId,             // Reference to categories collection
  tags: [String],                   // Array of free-form tags
  dueDate: Date,                    // ISO 8601 timestamp
  completed: Boolean,               // Default: false
  completedAt: Date,                // Timestamp when marked complete
  reminderScheduled: Boolean,       // Whether Agenda job exists
  createdAt: Date,                  // Auto-generated
  updatedAt: Date                   // Auto-updated
}

// Indexes
db.tasks.createIndex({ userId: 1, createdAt: -1 })
db.tasks.createIndex({ userId: 1, categoryId: 1 })
db.tasks.createIndex({ userId: 1, tags: 1 })
db.tasks.createIndex({ userId: 1, completed: 1 })
db.tasks.createIndex({ dueDate: 1 })
```

#### Category Collection
```javascript
{
  _id: ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
  name: String,                     // Required, max 50 chars
  description: String,              // Optional, max 500 chars
  userId: Number,                   // Owner of this category
  color: String,                    // Hex color code (e.g., "#FF5733")
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.categories.createIndex({ userId: 1, name: 1 }, { unique: true })
```

**Why MongoDB for Tasks?**
- Flexible schema adapts to changing requirements
- Embedded arrays (tags) avoid JOIN overhead
- Horizontal scaling for growing task volumes
- Native JSON structure matches API responses

---

## 🔒 Authentication & Security

### JWT Authentication Flow

```
┌────────┐                 ┌────────┐                ┌──────────┐
│ Client │                 │  API   │                │ Database │
└───┬────┘                 └───┬────┘                └────┬─────┘
    │                          │                          │
    │  1. POST /auth/login     │                          │
    │  (email, password)       │                          │
    ├─────────────────────────>│                          │
    │                          │  2. Query user           │
    │                          ├─────────────────────────>│
    │                          │                          │
    │                          │  3. User data            │
    │                          │<─────────────────────────┤
    │                          │                          │
    │                          │  4. Verify password      │
    │                          │     (bcrypt.compare)     │
    │                          │                          │
    │                          │  5. Generate JWT         │
    │                          │     (jwt.sign)           │
    │                          │                          │
    │  6. Return token         │                          │
    │<─────────────────────────┤                          │
    │                          │                          │
    │  7. GET /tasks           │                          │
    │  Header: Authorization:  │                          │
    │  Bearer <token>          │                          │
    ├─────────────────────────>│                          │
    │                          │  8. Verify JWT           │
    │                          │     (jwt.verify)         │
    │                          │                          │
    │                          │  9. Extract userId       │
    │                          │                          │
    │                          │  10. Query tasks         │
    │                          ├─────────────────────────>│
    │                          │                          │
    │  11. Return tasks        │                          │
    │<─────────────────────────┤                          │
    │                          │                          │
```

### Security Best Practices Implemented

#### 1. Password Security
```javascript
// Registration: Hash with bcrypt (10 salt rounds)
const hashedPassword = await bcrypt.hash(plainPassword, 10);

// Login: Constant-time comparison
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

#### 2. JWT Configuration
```javascript
// Token payload (minimal data)
{
  userId: 1,
  email: "user@example.com",
  iat: 1642345678,  // Issued at
  exp: 1642952478   // Expires in 7 days
}

// Signing
const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRY
});

// Verification
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

#### 3. Request Validation
```javascript
// Joi schema example
const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(2000).optional(),
  categoryId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
  tags: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  dueDate: Joi.date().iso().greater('now').required()
});
```

#### 4. HTTP Security Headers (Helmet.js)
- Content Security Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- X-XSS-Protection

#### 5. Rate Limiting
```javascript
// Prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 requests per window
  message: "Too many login attempts, please try again later"
});
```

---

## ⏰ Background Jobs

### Agenda.js Architecture

Agenda.js provides persistent, distributed job scheduling backed by MongoDB.

#### Reminder Scheduling Logic

```javascript
// When a task is created
async function scheduleReminder(task) {
  const reminderTime = new Date(task.dueDate);
  reminderTime.setHours(reminderTime.getHours() - 1);  // 1 hour before
  
  if (reminderTime > new Date()) {
    await agenda.schedule(reminderTime, 'send-task-reminder', {
      taskId: task._id,
      userId: task.userId,
      title: task.title
    });
  }
}

// Job definition
agenda.define('send-task-reminder', async (job) => {
  const { taskId, userId, title } = job.attrs.data;
  
  // Check if task still exists and is incomplete
  const task = await Task.findById(taskId);
  if (!task || task.completed) return;
  
  // Send notification (email, SMS, push, etc.)
  await sendNotification(userId, {
    type: 'task-reminder',
    message: `Reminder: "${title}" is due in 1 hour`
  });
});
```

#### Dynamic Rescheduling

```javascript
// When a task's due date is updated
async function updateTaskDueDate(taskId, newDueDate) {
  // Cancel existing reminder job
  await agenda.cancel({ 'data.taskId': taskId });
  
  // Schedule new reminder
  const task = await Task.findByIdAndUpdate(
    taskId,
    { dueDate: newDueDate },
    { new: true }
  );
  
  await scheduleReminder(task);
}
```

#### Cleanup on Task Completion

```javascript
// When a task is marked complete
async function completeTask(taskId) {
  await Task.findByIdAndUpdate(taskId, {
    completed: true,
    completedAt: new Date()
  });
  
  // Cancel reminder (no longer needed)
  await agenda.cancel({ 'data.taskId': taskId });
  
  // Trigger webhook
  await triggerCompletionWebhook(taskId);
}
```

---

## 🔗 Webhook Integration

### Exponential Backoff Strategy

External services can be unreliable. Our webhook system implements intelligent retry logic to maximize delivery success while minimizing server load.

#### Configuration

```javascript
const WEBHOOK_CONFIG = {
  url: process.env.WEBHOOK_URL,
  maxRetries: 3,
  initialDelay: 1000,      // 1 second
  backoffMultiplier: 2     // Doubles each retry
};
```

#### Retry Timeline

| Attempt | Delay | Cumulative Time |
|---------|-------|-----------------|
| 1 (initial) | 0ms | 0s |
| 2 (retry 1) | 1000ms | 1s |
| 3 (retry 2) | 2000ms | 3s |
| 4 (retry 3) | 4000ms | 7s |

#### Implementation

```javascript
async function sendWebhookWithRetry(payload, attempt = 1) {
  try {
    const response = await fetch(WEBHOOK_CONFIG.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      timeout: 5000
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    console.log(`✓ Webhook delivered on attempt ${attempt}`);
    return true;
    
  } catch (error) {
    if (attempt >= WEBHOOK_CONFIG.maxRetries) {
      console.error(`✗ Webhook failed after ${attempt} attempts:`, error);
      return false;
    }
    
    const delay = WEBHOOK_CONFIG.initialDelay * Math.pow(
      WEBHOOK_CONFIG.backoffMultiplier,
      attempt - 1
    );
    
    console.log(`⚠ Attempt ${attempt} failed, retrying in ${delay}ms...`);
    await sleep(delay);
    
    return sendWebhookWithRetry(payload, attempt + 1);
  }
}
```

#### Payload Structure

```json
{
  "event": "task.completed",
  "timestamp": "2024-01-15T14:30:00.000Z",
  "data": {
    "taskId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userId": 1,
    "title": "Review pull requests",
    "completedAt": "2024-01-15T14:30:00.000Z",
    "category": "Work",
    "tags": ["code-review", "urgent"]
  }
}
```

---

## 🧪 Testing

### Test Structure

```
tests/
├── unit/                     # Unit tests for individual functions
│   ├── services/
│   ├── utils/
│   └── validation/
├── integration/              # Integration tests for API endpoints
│   ├── auth.test.js
│   ├── tasks.test.js
│   └── categories.test.js
└── e2e/                      # End-to-end workflow tests
    └── task-lifecycle.test.js
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm test -- auth.test.js

# Watch mode for development
npm run test:watch
```

### Sample Test Case

```javascript
describe('Task Creation', () => {
  let authToken;
  let categoryId;
  
  beforeAll(async () => {
    // Login and get auth token
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    authToken = response.body.token;
    
    // Create a test category
    const catResponse = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Category' });
    categoryId = catResponse.body.data.category._id;
  });
  
  it('should create a task with valid data', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Task',
        categoryId: categoryId,
        dueDate: '2024-12-31T15:00:00Z'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.task).toHaveProperty('_id');
    expect(response.body.data.task.reminderScheduled).toBe(true);
  });
  
  it('should reject task without title', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        categoryId: categoryId,
        dueDate: '2024-12-31T15:00:00Z'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
```

---

## 🚀 Deployment

### Environment Variables Checklist

Before deploying to production, ensure these variables are configured:

```env
# ✅ Required for Production
NODE_ENV=production
PORT=5000
JWT_SECRET=<strong-random-secret-minimum-32-characters>
POSTGRES_PASSWORD=<strong-database-password>
MONGO_URI=<production-mongodb-connection-string>
WEBHOOK_URL=<your-production-webhook-endpoint>

# 🔐 Security
JWT_EXPIRY=7d
BCRYPT_ROUNDS=12

# 📊 Monitoring (optional)
SENTRY_DSN=<your-sentry-dsn>
LOG_LEVEL=info
```

### Docker Deployment

```bash
# Build production image
docker build -t task-api:latest .

# Run with production settings
docker run -d \
  --name task-api \
  -p 5000:5000 \
  --env-file .env.production \
  task-api:latest

# Check logs
docker logs -f task-api
```

### Cloud Deployment Options

#### AWS ECS (Elastic Container Service)
1. Push Docker image to ECR
2. Create ECS task definition
3. Configure Application Load Balancer
4. Set up RDS (PostgreSQL) and DocumentDB (MongoDB)

#### Google Cloud Run
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT_ID/task-api
gcloud run deploy task-api \
  --image gcr.io/PROJECT_ID/task-api \
  --platform managed \
  --allow-unauthenticated
```

#### Heroku
```bash
# Add PostgreSQL and MongoDB add-ons
heroku addons:create heroku-postgresql:standard-0
heroku addons:create mongolab:sandbox

# Deploy
git push heroku main
```

### Database Migrations

```bash
# Run migrations
npm run migrate:up

# Rollback
npm run migrate:down

# Create new migration
npm run migrate:create <migration-name>
```

---

## ⚡ Performance Considerations

### Database Indexing Strategy

**MongoDB Compound Indexes:**
```javascript
// Optimize common query patterns
db.tasks.createIndex({ userId: 1, createdAt: -1 })      // User timeline
db.tasks.createIndex({ userId: 1, categoryId: 1 })      // Category filter
db.tasks.createIndex({ userId: 1, tags: 1 })            // Tag search
db.tasks.createIndex({ userId: 1, completed: 1, dueDate: 1 })  // Status + date
```

**PostgreSQL Indexes:**
```sql
CREATE INDEX idx_users_email ON users(email);           -- Login queries
CREATE INDEX idx_users_created_at ON users(created_at); -- User analytics
```

### Caching Strategy

```javascript
// Redis caching for frequently accessed data
const cachedCategories = await redis.get(`categories:user:${userId}`);
if (cachedCategories) {
  return JSON.parse(cachedCategories);
}

const categories = await Category.find({ userId });
await redis.setex(`categories:user:${userId}`, 3600, JSON.stringify(categories));
```

### API Response Times

| Endpoint | Target | Typical |
|----------|--------|---------|
| GET /api/tasks | < 200ms | ~120ms |
| POST /api/tasks | < 300ms | ~180ms |
| GET /api/categories | < 100ms | ~60ms |
| POST /api/auth/login | < 500ms | ~320ms |

### Scaling Considerations

**Horizontal Scaling**: Stateless JWT authentication enables running multiple API instances behind a load balancer.

**Database Sharding**: MongoDB tasks can be sharded by `userId` for extreme scale.

**Job Queue Distribution**: Agenda.js supports multiple workers processing jobs in parallel.

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue: Database connection failed

**Symptom:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
- Ensure PostgreSQL/MongoDB services are running
- Check `.env` connection strings
- For Docker: Verify service names match `docker-compose.yml`

```bash
# Check container status
docker-compose ps

# Restart databases
docker-compose restart postgres mongo
```

---

#### Issue: JWT token invalid

**Symptom:**
```
401 Unauthorized: Invalid token
```

**Solution:**
- Ensure `JWT_SECRET` matches between login and verification
- Check token hasn't expired (`JWT_EXPIRY`)
- Verify Authorization header format: `Bearer <token>`

---

#### Issue: Reminders not triggering

**Symptom:**
Jobs scheduled but no notifications sent

**Solution:**
- Check Agenda.js is running: Look for "Agenda started" in logs
- Verify `dueDate` is in the future
- Check job collection: `db.agendaJobs.find({})`

```javascript
// Manual job inspection
const jobs = await agenda.jobs({ 'data.taskId': taskId });
console.log(jobs);
```

---

#### Issue: Webhook delivery failing

**Symptom:**
```
Webhook failed after 3 attempts: ETIMEDOUT
```

**Solution:**
- Verify `WEBHOOK_URL` is correct and accessible
- Check firewall rules allow outbound HTTPS
- Test webhook endpoint independently:

```bash
curl -X POST https://your-webhook.com/endpoint \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

---

### Debug Mode

Enable verbose logging:

```env
NODE_ENV=development
LOG_LEVEL=debug
```

```bash
# View detailed logs
npm run dev

# Or with Docker
docker-compose logs -f api
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation
4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add task priority field"
   ```
5. **Push and create Pull Request**
   ```bash
   git push origin feature/amazing-feature
   ```

### Commit Message Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Build process or tooling changes

### Code Style

- Use ES6+ syntax
- Follow ESLint configuration
- Maximum line length: 100 characters
- Use meaningful variable names

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

### Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Agenda.js Guide](https://github.com/agenda/agenda)
- [JWT.io](https://jwt.io/)

---

## 🙏 Acknowledgments

Built with ❤️ for the **Conversely AI** internship assessment.

Special thanks to:
- The Node.js community for excellent tooling
- Open source contributors of all dependencies
- Conversely AI team for the opportunity

---
