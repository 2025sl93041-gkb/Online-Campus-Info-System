# Online Campus Info System - Complete User Help Guide

## Table of Contents
1. [What is this Project?](#what-is-this-project)
2. [How to Set Up and Run](#how-to-set-up-and-run)
3. [User Roles Explained](#user-roles-explained)
4. [Module-by-Module Guide](#module-by-module-guide)
5. [Navigation Map](#navigation-map)
6. [Step-by-Step Workflows](#step-by-step-workflows)
7. [API Reference](#api-reference)
8. [Troubleshooting](#troubleshooting)

---

## What is this Project?

The **Online Campus Info System** is a web application that helps:
- **Students** find colleges, view courses/facilities, apply for admission, ask queries, and give feedback
- **College Admins** upload and manage college information, and review student applications
- **Counsellors** respond to student queries and provide guidance

It's built with:
- **Frontend:** React JS (runs on http://localhost:5173)
- **Backend:** Spring Boot (runs on http://localhost:8080)
- **Database:** MySQL

---

## How to Set Up and Run

### Prerequisites
- Java JDK 17 (install via `brew install openjdk@17`)
- Node.js 18+ (install via `brew install node`)
- MySQL 8+ (install via `brew install mysql`)
- Maven (install via `brew install maven`)

### Step 1: Clone the Repository
```bash
git clone https://github.com/2025sl93041-gkb/Online-Campus-Info-System.git
cd Online-Campus-Info-System
```

### Step 2: Set Up MySQL Database
```bash
mysql -u root -p
```
Then run:
```sql
CREATE DATABASE campus_info_db;
```

### Step 3: Configure Backend
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 4: Run the Backend
```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
cd backend
mvn spring-boot:run
```
Wait until you see: `Started OnlineCampusInfoApplication`

### Step 5: Run the Frontend
Open a new terminal:
```bash
cd frontend
npm install    # Only first time
npm run dev
```

### Step 6: Open in Browser
Go to: **http://localhost:5173**

---

## User Roles Explained

| Role | Who are they? | What can they do? |
|------|--------------|-------------------|
| **STUDENT** | Aspiring students looking for colleges | Browse colleges, apply, raise queries, give feedback, view reports |
| **ADMIN** | College authorities | Add/edit colleges, manage courses/facilities, review applications |
| **COUNSELLOR** | Advisors/counsellors | View and respond to student queries |

---

## Module-by-Module Guide

### Module 1: Registration & Login

**What it does:** Allows users to create an account and log in.

**How to use:**
1. Click **Register** in the top navigation
2. Fill in: Name, Email, Password, Phone, Role
3. Select your role (Student/Admin/Counsellor)
4. Click **Register**
5. You'll be automatically logged in and redirected to your dashboard

**To Login:**
1. Click **Login** in the top navigation
2. Enter your email and password
3. Click **Login**
4. You'll be redirected based on your role

---

### Module 2: College Data Management (Admin Only)

**What it does:** Admins can add, edit, and delete college information.

**How to use:**
1. Login as **ADMIN**
2. Go to Dashboard → Click **Manage Colleges** (or navigate to `/admin/colleges`)
3. Click **+ Add College**
4. Fill in the college details:
   - College Name (required)
   - City, State, Location
   - Description
   - Established Year, Student Strength
   - Website, Contact Email, Phone
5. Click **Create College**
6. To **Edit**: Click the "Edit" button on any college card
7. To **Delete**: Click the "Delete" button

**Adding Courses (via API):**
- POST `/api/colleges/{collegeId}/courses` with course details

**Adding Facilities (via API):**
- POST `/api/colleges/{collegeId}/facilities` with facility details

---

### Module 3: Browse & View Colleges (Everyone)

**What it does:** Anyone can browse and search for colleges.

**How to use:**
1. Click **Colleges** in the top navigation (or go to `/colleges`)
2. Use the **search bar** to filter by name, city, or state
3. Each college card shows: name, location, rating, establishment year
4. Click **View Details** to see:
   - Full description
   - Courses with fees, duration, seats, eligibility
   - Facilities (labs, library, sports, etc.)
   - Contact information
   - Student feedback

---

### Module 4: Apply to College (Student Only)

**What it does:** Students can submit admission applications.

**How to use:**
1. Login as **STUDENT**
2. Browse colleges → Click **View Details** on a college
3. Click **Apply to this College**
4. Fill the application form:
   - Select a Course from dropdown
   - Name, Email, Phone (auto-filled from profile)
   - Qualification (e.g., "12th Standard")
   - Percentage/CGPA
   - Address
   - Statement of Purpose
5. Click **Submit Application**
6. Track your application at `/student/applications`

**Application Statuses:**
- 🟡 **PENDING** - Just submitted
- 🔵 **UNDER_REVIEW** - Admin is reviewing
- 🟢 **ACCEPTED** - Congratulations!
- 🔴 **REJECTED** - Not selected

---

### Module 5: Review Applications (Admin Only)

**What it does:** College admins review and accept/reject student applications.

**How to use:**
1. Login as **ADMIN**
2. Go to Dashboard → **View Applications** (or `/admin/applications`)
3. Select your college from the dropdown
4. View all applications with student details
5. For pending applications, you can:
   - Click **Mark Under Review** - to indicate you're reviewing
   - Click **Accept** - to accept the student
   - Click **Reject** - to reject the application

---

### Module 6: Raise Queries (Student Only)

**What it does:** Students can ask questions to counsellors.

**How to use:**
1. Login as **STUDENT**
2. Go to Dashboard → **Raise Query** (or `/student/raise-query`)
3. Fill in:
   - Related College (optional - select from dropdown)
   - Subject (brief title of your question)
   - Message (detailed question)
4. Click **Submit Query**
5. The system automatically assigns a counsellor
6. View your queries and responses at `/student/queries`
7. Once resolved, you can **Close** the query

---

### Module 7: Respond to Queries (Counsellor Only)

**What it does:** Counsellors view and respond to student queries.

**How to use:**
1. Login as **COUNSELLOR**
2. Go to Dashboard → **View Queries** (or `/counsellor/queries`)
3. You'll see all queries assigned to you
4. For open queries, click **Respond**
5. Type your response in the text area
6. Click **Submit Response**
7. The query status changes to RESOLVED

---

### Module 8: Give Feedback (Student Only)

**What it does:** Students rate colleges and counsellors.

**How to use:**
1. Login as **STUDENT**
2. Go to Dashboard → **Feedback** (or `/student/feedback`)
3. Select Feedback Type:
   - **College Feedback** - Rate a college
   - **Counsellor Feedback** - Rate a counsellor
4. Select the college/counsellor from dropdown
5. Click the stars to set rating (1-5)
6. Add comments (optional)
7. Click **Submit Feedback**

---

### Module 9: Reports & Comparison (All Authenticated Users)

**What it does:** View analytics, compare colleges, and see counsellor performance.

**How to use:**
1. Login (any role)
2. Navigate to `/reports`
3. You'll see three sections:

**Overall Statistics:**
- Total colleges, students, applications
- Accepted/Pending/Rejected counts
- Open/Resolved queries

**College Feedback Comparison:**
- Table ranked by average rating
- Bar chart visualization
- Shows: rating, total feedbacks, total applications per college

**Counsellor Performance:**
- Table showing each counsellor's rating
- Total feedbacks received
- Total queries handled

---

## Navigation Map

### For Students:
```
Home → Register/Login → Student Dashboard
                              |
                              ├── Browse Colleges → College Detail → Apply
                              ├── My Applications (track status)
                              ├── Raise Query
                              ├── My Queries (view responses)
                              ├── Give Feedback
                              └── Reports
```

### For Admins:
```
Home → Register/Login → Admin Dashboard
                              |
                              ├── Manage Colleges (add/edit/delete)
                              ├── View Applications (accept/reject)
                              └── Reports
```

### For Counsellors:
```
Home → Register/Login → Counsellor Dashboard
                              |
                              ├── View Queries (respond to students)
                              └── Reports
```

---

## Step-by-Step Workflows

### Workflow 1: Student Finds and Applies to a College

1. Student registers with role "STUDENT"
2. Browses colleges at `/colleges`
3. Searches for colleges in their preferred city
4. Clicks "View Details" on a college
5. Reviews courses, fees, facilities, eligibility
6. Clicks "Apply to this College"
7. Fills application form and submits
8. Tracks application at "My Applications"
9. Receives ACCEPTED/REJECTED status

### Workflow 2: Admin Manages College and Reviews Applications

1. Admin registers with role "ADMIN"
2. Goes to "Manage Colleges"
3. Clicks "+ Add College" and fills details
4. Adds courses and facilities via API
5. Goes to "View Applications"
6. Reviews student applications
7. Accepts or rejects applications

### Workflow 3: Student Gets Counselling

1. Student has a question about admission
2. Goes to "Raise Query"
3. Selects related college, writes subject and message
4. System auto-assigns a counsellor
5. Counsellor logs in, sees the query
6. Counsellor writes response
7. Student sees the response in "My Queries"
8. Student closes the query
9. Student rates the counsellor via "Feedback"

### Workflow 4: Comparing Colleges via Reports

1. Any user logs in
2. Navigates to "Reports"
3. Views college comparison table (sorted by rating)
4. Checks bar chart for visual comparison
5. Decides which college to apply to based on data

---

## API Reference (Quick)

### Authentication
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get current profile |

### Colleges
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/colleges | List all colleges |
| GET | /api/colleges/{id} | Get college details |
| GET | /api/colleges/search?q=term | Search colleges |
| POST | /api/colleges | Create college (ADMIN) |
| PUT | /api/colleges/{id} | Update college (ADMIN) |
| DELETE | /api/colleges/{id} | Delete college (ADMIN) |

### Applications
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/applications | Submit application (STUDENT) |
| GET | /api/applications/my | My applications (STUDENT) |
| GET | /api/applications/college/{id} | College applications (ADMIN) |
| PUT | /api/applications/{id}/status | Update status (ADMIN) |

### Queries
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/queries | Raise query (STUDENT) |
| GET | /api/queries/my | My queries (STUDENT) |
| GET | /api/queries/assigned | Assigned queries (COUNSELLOR) |
| PUT | /api/queries/{id}/respond | Respond (COUNSELLOR) |
| PUT | /api/queries/{id}/close | Close query (STUDENT) |

### Feedback
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/feedbacks | Submit feedback (STUDENT) |
| GET | /api/feedbacks/college/{id} | College feedbacks |
| GET | /api/feedbacks/counsellor/{id} | Counsellor feedbacks |

### Reports
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/reports/college-comparison | College ratings comparison |
| GET | /api/reports/counsellor-performance | Counsellor stats |
| GET | /api/reports/application-stats | Overall statistics |

---

## Troubleshooting

### "Backend won't start"
- Make sure MySQL is running: `mysql -u root -p`
- Check database exists: `SHOW DATABASES;` should show `campus_info_db`
- Check `application.properties` has correct MySQL username/password

### "Frontend shows blank page"
- Make sure backend is running first (port 8080)
- Check browser console for errors
- Try: `cd frontend && rm -rf node_modules && npm install && npm run dev`

### "Login fails"
- Make sure you registered first
- Check email and password are correct
- Password must be at least 6 characters

### "Unauthorized error"
- Your login session may have expired (24 hours)
- Log out and log in again

### "Can't compile backend (Lombok error)"
- Use JDK 17: `export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home`
- Then: `mvn clean compile`

### "CORS error in browser"
- Make sure backend is running on port 8080
- Frontend must be on port 5173 or 3000

---

## Project Structure Overview

```
Online-Campus-Info-System/
├── docs/                    # Documentation
├── backend/                 # Spring Boot (Java)
│   ├── src/main/java/com/onlinecampusinfo/
│   │   ├── controller/     # REST API endpoints
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Database access
│   │   ├── model/          # Database entities
│   │   ├── dto/            # Request/Response objects
│   │   ├── security/       # JWT authentication
│   │   ├── config/         # App configuration
│   │   └── exception/      # Error handling
│   └── src/main/resources/
│       └── application.properties
└── frontend/                # React (JavaScript)
    └── src/
        ├── api/             # API call functions
        ├── components/      # Reusable UI components
        ├── context/         # Auth state management
        ├── pages/           # Page components
        │   ├── student/     # Student pages
        │   ├── admin/       # Admin pages
        │   └── counsellor/  # Counsellor pages
        ├── App.jsx          # Routing
        └── App.css          # Styling