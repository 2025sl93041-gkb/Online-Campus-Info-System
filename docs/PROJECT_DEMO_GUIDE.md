# 🎓 Online Campus Info System - Complete Demo Guide

## Quick Overview
**What is it?** A full-stack web app for students to explore colleges, apply, raise queries to college-assigned counsellors, and provide feedback.

**Tech Stack:**
- **Backend:** Java 17/21 + Spring Boot 3.4 + MySQL + JWT
- **Frontend:** React 19 + Vite + React Router + Axios

---

## 1. PROJECT STRUCTURE

```
OnlineCampusInfo/
├── backend/                    # Spring Boot (Java)
│   ├── src/main/java/com/onlinecampusinfo/
│   │   ├── controller/         # REST API endpoints
│   │   ├── service/            # Business logic
│   │   ├── repository/         # Database access (JPA)
│   │   ├── model/              # Entity classes
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── security/           # JWT & Security
│   │   └── config/             # Configuration
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/                   # React (Vite)
    └── src/
        ├── api/                # Axios API calls
        ├── components/         # Reusable components (FeedbackModal, etc.)
        ├── context/            # AuthContext (state)
        └── pages/              # Page components
```

---

## 2. USER ROLES & FEATURES

| Feature | STUDENT | ADMIN | COUNSELLOR |
|---------|:-------:|:-----:|:----------:|
| Browse colleges (with images) | ✅ | ✅ | ✅ |
| Apply to colleges | ✅ | ❌ | ❌ |
| Raise queries (per college) | ✅ | ❌ | ❌ |
| Give college feedback | ✅ | ❌ | ❌ |
| Rate counsellor (modal UI) | ✅ | ❌ | ❌ |
| Manage colleges (CRUD + images) | ❌ | ✅ | ❌ |
| Manage Counsellors (assign to colleges) | ❌ | ✅ | ❌ |
| View applications (with filters) | ❌ | ✅ | ❌ |
| Approve/reject applications | ❌ | ✅ | ❌ |
| Respond to queries (only assigned colleges) | ❌ | ❌ | ✅ |
| View own performance metrics | ❌ | ❌ | ✅ |
| College comparison & reviews | ✅ | ✅ | ✅ |
| Counsellor performance reports | ❌ | ✅ | ❌ |
| System statistics | ❌ | ✅ | ❌ |

---

## 3. BACKEND ARCHITECTURE

### Layers
```
Controller → Service → Repository → Database
    ↑           ↑           ↑
   REST      Business    JPA/Hibernate
   APIs       Logic
```

### Controllers (8)
- AuthController, CollegeController, ApplicationController, QueryController
- FeedbackController, FileController, ReportController, CounsellorAssignmentController

### Services (6)
- AuthService, CollegeService, ApplicationService, QueryService
- FeedbackService, CounsellorAssignmentService

### Repositories (9) - All extend `JpaRepository<Entity, Long>`
- UserRepository, CollegeRepository, CourseRepository, FacilityRepository
- ApplicationRepository, QueryRepository, FeedbackRepository
- CounsellorAssignmentRepository, CounsellorPerformanceRepository

### Entities (10)
| Entity | Purpose |
|--------|---------|
| User | Users with roles (STUDENT/ADMIN/COUNSELLOR) |
| College | College info (name, city, etc.) |
| Course | Courses offered by colleges |
| Facility | College facilities (lab, library, etc.) |
| CollegeImage | Uploaded college images |
| Application | Student applications |
| Query | Student queries (linked to college) |
| Feedback | Ratings & comments (college or counsellor) |
| CounsellorAssignment | Counsellor↔College mapping |
| CounsellorPerformance | Immutable resolved-query history log |

### Enums
```
UserRole: STUDENT, ADMIN, COUNSELLOR
ApplicationStatus: PENDING, UNDER_REVIEW, ACCEPTED, REJECTED, WITHDRAWN
QueryStatus: OPEN, IN_PROGRESS, RESOLVED, CLOSED
FeedbackType: COLLEGE, COUNSELLOR
FacilityType: LIBRARY, LAB, HOSTEL, SPORTS, CAFETERIA, WIFI, TRANSPORT
```

---

## 4. SECURITY & JWT AUTHENTICATION

### How JWT Works
```
1. User logs in with email/password
2. Server validates credentials
3. Server generates JWT token (contains user id, email, role)
4. Client stores token in localStorage
5. Client sends token in Authorization header for every request
6. Server validates token before processing request
```

### Security Classes
- **JwtTokenProvider** - Generates & validates JWT tokens
- **JwtAuthenticationFilter** - Intercepts requests, extracts & validates JWT
- **JwtAuthenticationEntryPoint** - Handles unauthorized access (401)
- **CustomUserDetailsService** - Loads user from database
- **SecurityConfig** - Configures security rules

### SecurityConfig Rules
```
Public:
  /api/auth/**           → permitAll
  GET /api/colleges/**   → permitAll
  GET /api/files/**      → permitAll

All others:
  Require valid JWT token
```

### Role-Based Authorization (multi-layer)
1. JWT authentication verifies user identity
2. `@PreAuthorize("hasRole('STUDENT')")` on controllers checks role
3. Service-layer checks (e.g., counsellor assigned to college)
4. Frontend `ProtectedRoute` for client-side guards

---

## 5. FRONTEND ARCHITECTURE

### Key Files
- `App.jsx` - All routes
- `AuthContext.jsx` - Global auth state
- `axiosConfig.js` - HTTP client with interceptors
- `components/common/FeedbackModal.jsx` - Reusable modal with star rating
- `components/common/ProtectedRoute.jsx` - Route guard

### Routing (App.jsx)
```
Public:
  /                     → HomePage
  /login, /register     → Auth pages
  /colleges             → BrowseColleges
  /colleges/:id         → CollegeDetailPage (with image gallery)

Student (Protected):
  /student/dashboard, /student/apply/:id, /student/applications
  /student/raise-query, /student/queries (modal feedback), /student/feedback

Admin (Protected):
  /admin/dashboard, /admin/colleges
  /admin/counsellors    (assignment UI)
  /admin/applications   (all + filters)

Counsellor (Protected):
  /counsellor/dashboard, /counsellor/queries (filtered by assigned colleges)
  /counsellor/feedback

Reports (role-based content):
  /reports
```

### AuthContext
Provides globally: `user`, `token`, `login()`, `logout()`, `isAuthenticated()`, `hasRole()`

### Axios Interceptors
- Request: Adds `Authorization: Bearer <token>` to every request
- Response: Clears localStorage on 401 errors

---

## 6. API ENDPOINTS

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login, get JWT |

### Colleges
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/colleges` | List colleges (with thumbnailUrl) |
| GET | `/api/colleges/{id}` | College details (with images[]) |
| POST | `/api/colleges` | Create college (Admin) |
| PUT | `/api/colleges/{id}` | Update (Admin) |
| DELETE | `/api/colleges/{id}` | Delete (Admin) |
| POST | `/api/files/upload` | Upload image (Admin) |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Submit (Student) |
| GET | `/api/applications/my` | My applications (Student) |
| GET | `/api/applications/all?collegeId=X` | All apps + filter (Admin) |
| PUT | `/api/applications/{id}/status` | Update status (Admin) |
| DELETE | `/api/applications/{id}` | Withdraw (Student) |

### Queries
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/queries` | Raise query (auto-routed) |
| GET | `/api/queries/my` | My queries (Student) |
| GET | `/api/queries/assigned` | Filtered by my colleges (Counsellor) |
| PUT | `/api/queries/{id}/respond` | Respond (assigned counsellor only) |
| DELETE | `/api/queries/{id}` | Delete (Student) |

### Feedbacks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/feedbacks` | Submit (Student) |
| GET | `/api/feedbacks/college/{id}` | Public college feedbacks |
| GET | `/api/feedbacks/my-received` | My received feedback (Counsellor) |

### Counsellor Assignments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/counsellor-assignments/counsellors` | All with assignments (Admin) |
| POST | `/api/counsellor-assignments` | Assign (Admin) |
| DELETE | `/api/counsellor-assignments?counsellorId=X&collegeId=Y` | Unassign (Admin) |
| GET | `/api/counsellor-assignments/my` | My assignments (Counsellor) |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/college-comparison` | College ratings |
| GET | `/api/reports/college-feedbacks` | Reviews with comments |
| GET | `/api/reports/counsellor-performance` | All counsellors (Admin) |
| GET | `/api/reports/my-performance?counsellorId=X` | Self-view (Counsellor) |
| GET | `/api/reports/application-stats` | System stats (Admin) |

---

## 7. KEY BUSINESS LOGIC

### Query Routing (College-Based)
When a student raises a query for a college:
1. System looks up counsellors assigned to that college
2. If found → routes to one with **least active queries**
3. If no counsellor assigned → query stays unassigned (admin must assign first)

When a counsellor views queries:
- Only sees queries for colleges they're assigned to (plus general queries with no college)

When a counsellor responds:
- System verifies they're assigned to that query's college, else error

**Configuration:** `app.counsellor.max-colleges=3` in `application.properties`

### Immutable Counsellor Statistics
- When a counsellor resolves a query → entry added to `counsellor_performance_log`
- Log entries are NEVER deleted, even if the original query is removed.
- Reports use this log for accurate historical metrics.

### Role-Based Reports
| Tab | Student | Counsellor | Admin |
|-----|:-------:|:----------:|:-----:|
| College Comparison | YES | YES | YES |
| College Reviews (with comments) | YES | YES | YES |
| My Performance | NO | YES | NO |
| Counsellor Performance | NO | NO | YES |
| System Stats | NO | NO | YES |

---

## 8. DATABASE

### Configuration
File: `backend/src/main/resources/application.properties`
```
spring.datasource.url=jdbc:mysql://localhost:3306/campus_info_db
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
```

### Tables (10 total)
- users, colleges, courses, facilities, college_images
- applications, queries, feedbacks
- counsellor_assignments
- counsellor_performance_log

### Auto-Creation
Hibernate (ddl-auto=update) automatically creates and updates tables based on @Entity classes.

### How to Check Data
```bash
# Connect to database
mysql -u root campus_info_db

# Useful queries
SHOW TABLES;
SELECT id, name, email, role FROM users;
SELECT * FROM counsellor_assignments;
SELECT * FROM counsellor_performance_log;
```

---

## 9. COMMON DEMO QUESTIONS

**Q: Why Spring Boot over plain Spring?**
A: Auto-configuration, embedded server, starter dependencies, production-ready features.

**Q: Why JWT over sessions?**
A: Stateless (scalable), no server storage, works well with REST APIs.

**Q: How does query routing work?**
A: Queries are routed only to counsellors assigned to that college. If no counsellor is assigned, the query stays unassigned until an admin assigns one.

**Q: Why a separate performance log table?**
A: Data integrity. Once a counsellor resolves a query, that fact must persist even if the student deletes the original query.

**Q: How is access controlled?**
A: Multi-layer: JWT authentication, @PreAuthorize on controllers, service-layer college-assignment checks, frontend ProtectedRoute.

**Q: What is JPA / Hibernate?**
A: JPA is the Java Persistence API specification. Hibernate is the most popular implementation, doing the actual SQL work.

**Q: What is BCrypt?**
A: Password hashing algorithm. We never store plain text passwords.

**Q: How does CORS work?**
A: Cross-Origin Resource Sharing - browser security feature. Configured in SecurityConfig to allow localhost:*.

---

## 10. HOW TO RUN

### Prerequisites
- MySQL running on localhost:3306
- Java 21 (or 17+) installed
- Node.js + npm installed

### Backend (Terminal 1)
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/sapmachine-21.jdk/Contents/Home
cd backend
mvn spring-boot:run
```
Backend runs on **http://localhost:8080**

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

### Stop
Press Ctrl+C in each terminal.

If port 8080 is busy:
```bash
lsof -ti :8080 | xargs kill -9
```

---

## 11. DEMO FLOW

1. Open http://localhost:5173
2. Register/Login as 3 roles (Student, Admin, Counsellor)

### As Admin:
- Manage Colleges: Add a college, upload images
- Manage Counsellors: Assign counsellors to colleges (max 3 per counsellor)
- View Applications: See all + filter by college/status
- Reports: View counsellor performance & system stats

### As Student:
- Browse Colleges: See college image gallery
- Apply to a college
- Raise Query for an assigned college (auto-routed to assigned counsellor)
- My Queries: Click "Rate Counsellor" - modal opens with star rating
- Reports: See College Comparison & Reviews

### As Counsellor:
- View Queries: Only sees queries for their assigned colleges
- Respond to queries (verified at backend)
- My Feedback: View student feedback received
- Reports: See My Performance (immutable resolved count)

---

## 12. FILE LOCATIONS QUICK REFERENCE

### Backend
- Application entry: backend/src/main/java/com/onlinecampusinfo/OnlineCampusInfoApplication.java
- Config: backend/src/main/resources/application.properties
- Security: backend/src/main/java/com/onlinecampusinfo/security/
- Models: backend/src/main/java/com/onlinecampusinfo/model/
- Controllers: backend/src/main/java/com/onlinecampusinfo/controller/
- Services: backend/src/main/java/com/onlinecampusinfo/service/
- Repositories: backend/src/main/java/com/onlinecampusinfo/repository/

### Frontend
- Entry: frontend/src/main.jsx then frontend/src/App.jsx
- API clients: frontend/src/api/
- Pages: frontend/src/pages/{student,admin,counsellor}/
- Components: frontend/src/components/common/
- Auth state: frontend/src/context/AuthContext.jsx
