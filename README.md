# Task Handler - Project Management Application

A full-stack project management application built with Node.js, React, and PostgreSQL. It supports role-based access control for three user types (Admin, Project Manager, Developer), real-time notifications via WebSockets, and a clean, minimal UI.

---

## Overview

This application was built as part of an assignment to demonstrate a production-style backend and frontend working together. The key features include:

- JWT authentication with HTTP-only cookies
- Role-based access control on both the server and client side
- Real-time task updates and notifications using Socket.io
- Full CRUD for projects, tasks, clients, and users
- Activity logging that tracks every task status change
- A database seeder for quick local setup

---

## Tech Stack

**Backend**
- Node.js with Express
- PostgreSQL with the `pg` library
- Socket.io for WebSocket connections
- JSON Web Tokens for authentication
- Bcrypt for password hashing
- Joi for request validation

**Frontend**
- React 19 with Vite
- Zustand for global state management
- Axios for HTTP requests
- React Router DOM for client-side routing
- React Hot Toast for notifications
- Socket.io Client for real-time updates
- Lucide React for icons

---

## Project Structure

```
assignment1/
├── Backend/
│   └── src/
│       ├── controllers/
│       ├── data/
│       │   ├── schema.sql
│       │   └── seeder.js
│       ├── middleware/
│       ├── routes/
│       ├── socket/
│       └── index.js
└── Frontend/
    └── src/
        ├── components/
        ├── lib/
        ├── pages/
        └── store/
```

---

## Prerequisites

Make sure you have the following installed before running this project:

- Node.js (v18 or later)
- PostgreSQL (v14 or later)
- npm

---

## Setup and Installation

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd assignment1
```

### Step 2: Configure the Backend Environment

Navigate into the Backend directory and create a `.env` file if one does not already exist. The file should contain the following variables:

```
PORT=30001
USER=postgres
HOST=localhost
DATABASE=your_database_name
DBPORT=5432
PASSWORD=your_postgres_password
JWT_SECRET=your_jwt_secret_key
```

Replace the values with your actual PostgreSQL credentials. The `JWT_SECRET` can be any long, random string.

### Step 3: Install Backend Dependencies

```bash
cd Backend
npm install
```

### Step 4: Set Up the Database

Make sure your PostgreSQL server is running and your database already exists. If it does not exist, create it first:

```bash
psql -U postgres -c "CREATE DATABASE your_database_name;"
```

Then run the seeder to create all the tables and populate the database with test data:

```bash
npm run seed
```

This will create all the required tables from `schema.sql` and insert the following test accounts (all with the password `password123`):

| Username | Role |
|---|---|
| admin_user | Admin |
| project_manager | Project Manager |
| dev_user | Developer |

It will also insert two sample clients, two sample projects, and three sample tasks so the application has data to display immediately.

### Step 5: Start the Backend Server

```bash
npm run dev
```

The backend server will start on `http://localhost:30001`. It runs using `nodemon` so any changes you make will automatically restart the server.

### Step 6: Install Frontend Dependencies

Open a new terminal window, navigate into the Frontend directory, and install dependencies:

```bash
cd Frontend
npm install
```

### Step 7: Start the Frontend Development Server

```bash
npm run dev
```

The React application will be available at `http://localhost:5173` by default (Vite's default port).

---

## Running the Full Application

You need two terminal windows running simultaneously:

- Terminal 1: Backend server running from the `Backend/` directory.
- Terminal 2: Frontend dev server running from the `Frontend/` directory.

Once both are running, open `http://localhost:5173` in your browser and log in with one of the seeded accounts.

---

## Role Permissions

| Feature | Admin | Project Manager | Developer |
|---|---|---|---|
| View all projects | Yes | Own projects only | No |
| Create / edit projects | Yes | Yes | No |
| Create / assign tasks | Yes | Yes | No |
| View assigned tasks | Yes | Yes | Yes |
| Update task status | Yes | Yes | Yes |
| Manage clients | Yes | Yes | No |
| View activity feed | Yes | Yes (own projects) | Yes (own tasks) |
| View notifications | Yes | Yes | Yes |

---

## API Endpoints

**Authentication**
- `POST /api/users/register` - Register a new user (Admin only)
- `POST /api/users/login` - Log in and receive a JWT cookie
- `POST /api/users/logout` - Invalidate the session
- `GET /api/users/profile` - Get the currently authenticated user

**Projects**
- `GET /api/projects` - List all projects (filtered by role)
- `POST /api/projects` - Create a project
- `PATCH /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

**Tasks**
- `GET /api/tasks` - List all tasks (filtered by role)
- `POST /api/tasks` - Create a task
- `PATCH /api/tasks/:id` - Update a task
- `PATCH /api/tasks/:id/status` - Update task status only
- `DELETE /api/tasks/:id` - Delete a task

**Clients**
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create a client
- `PATCH /api/clients/:id` - Update a client
- `DELETE /api/clients/:id` - Delete a client

**Notifications**
- `GET /api/notifications` - Get notifications for the current user
- `PATCH /api/notifications/:id/read` - Mark a notification as read
- `PATCH /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete a notification

**Activity**
- `GET /api/activity` - Get the task activity feed (filtered by role)

**Dashboard**
- `GET /api/dashboard` - Get summary metrics for the current user

---

## Real-Time Features

When a task status is updated, the server broadcasts a WebSocket event to all relevant connected clients. The frontend listens for these events and updates the UI and notification dropdown instantly without requiring a page reload.

---

## Seeding the Database Again

If you want to reset the database to a clean state at any point, simply run:

```bash
cd Backend
npm run seed
```

This will drop all existing records and re-insert the default test data.
