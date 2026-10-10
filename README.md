# Research Opportunity Portal

A university full-stack web application designed for students and faculty to discover, publish, and manage academic research opportunities across university departments.

GitHub Repository: https://github.com/ArifAli8866/research-opportunity-platform

---

## Tech Stack

- **Backend**: Node.js & Express.js
- **Database**: MySQL (utilizing `mysql2/promise` connection pooling with parameterized SQL queries)
- **Frontend**: Plain HTML5, CSS3, Bootstrap 5 (via CDN), Bootstrap Icons, and vanilla JavaScript using the modern `fetch` API (no React, no bundlers, zero build steps)
- **Static Hosting**: Express serves the `frontend/` directory statically so the entire application runs with a single command on `http://localhost:3000`
- **Testing & API Tooling**: Bruno Collection (`postman/ResearchPortalAPI/`) and Postman Collection (`postman/ResearchPortal.postman_collection.json`)

---

## Features

- **Dynamic Opportunities Feed**: Displays research positions in responsive cards with real-time status badges (green for `Open`, grey for `Closed`).
- **Comprehensive Details Modal**: View all listing fields (title, faculty, department, research area, required skills, positions, deadline, description, timestamps).
- **Listing Creation**: Add new opportunities with rigorous client-side and server-side validation.
- **In-Place Editing**: Edit any field of existing opportunities with pre-filled inputs.
- **Quick Close Action**: Close recruitment for opportunities with one click (PUT `status = "Closed"`).
- **Permanent Deletion**: Delete listings with a confirmation safeguard modal.
- **Robust Feedback & XSS Safety**: Floating Bootstrap alerts for success notifications and detailed API validation error arrays. All dynamic content is escaped prior to DOM insertion to prevent Cross-Site Scripting (XSS).

---

## Folder Structure

```text
research-opportunity-portal/
├── backend/
│   ├── .env.example              # Template environment configuration
│   ├── package.json              # Backend dependencies and scripts
│   ├── server.js                 # Express server entry point & static asset hosting
│   └── src/
│       ├── config/
│       │   └── db.js             # mysql2 promise pool connection configuration
│       ├── controllers/
│       │   └── opportunityController.js # Route handler functions & DB queries
│       ├── middleware/
│       │   ├── errorHandler.js   # 404 API route & global 500 error handlers
│       │   └── validateOpportunity.js # Input validation middleware
│       └── routes/
│           └── opportunityRoutes.js # Express router for /api/opportunities
├── database/
│   └── schema.sql                # MySQL schema (database and opportunities table)
├── frontend/
│   ├── css/
│   │   └── style.css             # Custom styling for cards, badges, and alerts
│   ├── js/
│   │   └── app.js                # Vanilla JavaScript application & fetch logic
│   └── index.html                # Main application view with Bootstrap 5
├── postman/
│   ├── ResearchPortal.postman_collection.json # Postman collection backup
│   └── ResearchPortalAPI/        # Bruno collection
│       ├── bruno.json
│       ├── environments/
│       │   └── Local.bru
│       ├── 01-create-opportunity-1.bru
│       ├── 02-create-opportunity-2.bru
│       ├── 03-create-opportunity-3.bru
│       ├── 04-get-all-opportunities.bru
│       ├── 05-get-one-opportunity.bru
│       ├── 06-update-opportunity.bru
│       ├── 07-close-opportunity.bru
│       ├── 08-delete-opportunity.bru
│       ├── 09-get-deleted-opportunity.bru
│       └── 10-create-with-invalid-data.bru
├── .env.example                  # Root template environment configuration
├── .gitignore                    # Excludes node_modules, .env, and logs
├── package.json                  # Root npm configuration (runs backend server)
└── README.md                     # Documentation and setup instructions
```

---

## Prerequisites

Before setting up the project on Linux, ensure you have the following installed:

1. **Node.js** (v18.0.0 or higher recommended)
   ```bash
   node -v
   npm -v
   ```
2. **MySQL Server** (v8.0 or higher recommended)
   ```bash
   mysql --version
   ```

---

## Step-by-Step Setup Guide (Linux)

### 1. Clone the Repository
```bash
git clone https://github.com/ArifAli8866/research-opportunity-platform.git
cd research-opportunity-platform
```

### 2. Initialize the MySQL Database
Import the schema into your MySQL server:
```bash
mysql -u root -p < database/schema.sql
```
*(Enter your MySQL root password when prompted. This creates the `research_portal` database and the `opportunities` table).*

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
```
Edit `.env` (or `backend/.env`) with your MySQL credentials:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=research_portal
```

### 4. Install Dependencies
Install the required npm packages (`express`, `mysql2`, `cors`, `dotenv`):
```bash
npm install
```

### 5. Start the Application
Run the start command:
```bash
npm start
```
For development with automatic file restart:
```bash
npm run dev
```

### 6. Open the Application
Navigate your browser to:
**[http://localhost:3000](http://localhost:3000)**

---

## API Documentation

Base URL: `http://localhost:3000/api/opportunities`

| Method | Endpoint | Description | Expected Status |
|---|---|---|---|
| `POST` | `/api/opportunities` | Create a new research opportunity listing | `201 Created` / `400 Bad Request` |
| `GET` | `/api/opportunities` | Retrieve all research opportunities | `200 OK` |
| `GET` | `/api/opportunities/:id` | Retrieve a single opportunity by ID | `200 OK` / `404 Not Found` |
| `PUT` | `/api/opportunities/:id` | Update an existing opportunity (fields or status) | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/opportunities/:id` | Delete an opportunity listing | `200 OK` / `404 Not Found` |

---

### Request & Response Examples

#### 1. Create Opportunity (`POST /api/opportunities`)
**Request Body:**
```json
{
  "title": "Deep Learning for Autonomous Robotics",
  "description": "Investigate reinforcement learning and visual perception algorithms for autonomous drone navigation in unstructured environments.",
  "research_area": "Artificial Intelligence & Robotics",
  "faculty_name": "Dr. Sarah Mitchell",
  "department": "Department of Computer Science",
  "required_skills": "Python, PyTorch, ROS, OpenCV, Git",
  "positions": 2,
  "deadline": "2026-11-30"
}
```
**Response (`201 Created`):**
```json
{
  "id": 1,
  "title": "Deep Learning for Autonomous Robotics",
  "description": "Investigate reinforcement learning and visual perception algorithms for autonomous drone navigation in unstructured environments.",
  "research_area": "Artificial Intelligence & Robotics",
  "faculty_name": "Dr. Sarah Mitchell",
  "department": "Department of Computer Science",
  "required_skills": "Python, PyTorch, ROS, OpenCV, Git",
  "positions": 2,
  "deadline": "2026-11-30",
  "status": "Open",
  "created_at": "2026-10-10T16:20:00.000Z"
}
```

#### 2. Get All Opportunities (`GET /api/opportunities`)
**Response (`200 OK`):**
```json
[
  {
    "id": 1,
    "title": "Deep Learning for Autonomous Robotics",
    "description": "Investigate reinforcement learning...",
    "research_area": "Artificial Intelligence & Robotics",
    "faculty_name": "Dr. Sarah Mitchell",
    "department": "Department of Computer Science",
    "required_skills": "Python, PyTorch, ROS, OpenCV, Git",
    "positions": 2,
    "deadline": "2026-11-30",
    "status": "Open",
    "created_at": "2026-10-10T16:20:00.000Z"
  }
]
```

#### 3. Get One Opportunity (`GET /api/opportunities/:id`)
**Response (`200 OK`):**
```json
{
  "id": 1,
  "title": "Deep Learning for Autonomous Robotics",
  "description": "Investigate reinforcement learning...",
  "research_area": "Artificial Intelligence & Robotics",
  "faculty_name": "Dr. Sarah Mitchell",
  "department": "Department of Computer Science",
  "required_skills": "Python, PyTorch, ROS, OpenCV, Git",
  "positions": 2,
  "deadline": "2026-11-30",
  "status": "Open",
  "created_at": "2026-10-10T16:20:00.000Z"
}
```
**Response (`404 Not Found`):**
```json
{
  "error": "Opportunity not found"
}
```

#### 4. Update Opportunity (`PUT /api/opportunities/:id`)
**Request Body:**
```json
{
  "title": "Deep Learning & Vision Transformers for Robotics",
  "positions": 4,
  "status": "Closed"
}
```
**Response (`200 OK`):**
```json
{
  "id": 1,
  "title": "Deep Learning & Vision Transformers for Robotics",
  "description": "Investigate reinforcement learning...",
  "research_area": "Artificial Intelligence & Robotics",
  "faculty_name": "Dr. Sarah Mitchell",
  "department": "Department of Computer Science",
  "required_skills": "Python, PyTorch, ROS, OpenCV, Git",
  "positions": 4,
  "deadline": "2026-11-30",
  "status": "Closed",
  "created_at": "2026-10-10T16:20:00.000Z"
}
```

#### 5. Delete Opportunity (`DELETE /api/opportunities/:id`)
**Response (`200 OK`):**
```json
{
  "message": "Opportunity deleted successfully"
}
```

#### 6. Validation Error Example (`400 Bad Request`)
**Request Body:**
```json
{
  "title": "",
  "positions": -1,
  "deadline": "not-a-date"
}
```
**Response (`400 Bad Request`):**
```json
{
  "error": "Validation failed",
  "details": [
    "title is required and cannot be empty",
    "description is required and cannot be empty",
    "research_area is required and cannot be empty",
    "faculty_name is required and cannot be empty",
    "department is required and cannot be empty",
    "required_skills is required and cannot be empty",
    "positions is required and must be a positive integer greater than 0",
    "deadline is required and must be a valid date in YYYY-MM-DD format"
  ]
}
```

---

## API Testing with Bruno & Postman

### Running the Bruno Collection (Recommended)
1. Install and launch [Bruno](https://www.usebruno.com/).
2. Click **Open Collection** and select the folder `postman/ResearchPortalAPI/`.
3. In the environment dropdown in the top-right, select **Local** (`baseUrl = http://localhost:3000`).
4. Execute the requests sequentially in runner mode or individually:
   1. `Create Opportunity #1` (201)
   2. `Create Opportunity #2` (201)
   3. `Create Opportunity #3` (201)
   4. `Get All Opportunities` (200)
   5. `Get One Opportunity (id 1)` (200)
   6. `Update Opportunity` (200)
   7. `Close Opportunity` (200)
   8. `Delete Opportunity` (200)
   9. `Get Deleted Opportunity` (404)
   10. `Create with Invalid Data` (400)

### Running the Postman Collection
1. Launch Postman.
2. Click **Import** and select `postman/ResearchPortal.postman_collection.json`.
3. The collection includes predefined tests and assertions matching expected status codes (201, 200, 404, 400).
4. Run the collection using the Postman Collection Runner.
