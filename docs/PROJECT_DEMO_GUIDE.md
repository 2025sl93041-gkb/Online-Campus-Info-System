# 🎓 Online Campus Info System - Complete Demo Guide

## Quick Overview
**What is it?** A full-stack web app for students to explore colleges, apply, raise queries, and give feedback.

**Tech Stack:**
- **Backend:** Java 17 + Spring Boot 3.4 + MySQL + JWT
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
        ├── components/         # Reusable components
        ├── context/            # AuthContext (state)
        └── pages/              # Page components
```

---

## 2. USER ROLES & FEATURES

| Role | Features |
|------|----------|
| **STUDENT** | Register, Login, Browse colleges, Apply, Raise queries, Give feedback |
| **ADMIN** | Manage colleges (CRUD), Add courses/facilities, View applications |
| **COUNSELLOR** | View & respond to queries, View feedback received |

---

## 3. BACKEND ARCHITECTURE (Spring Boot)

### 3.1 Layers
```
Controller → Service → Repository → Database
    ↑           ↑           ↑
   REST      Business    JPA/Hibernate
   APIs       Logic
```

### 3.2 Controllers (7 total)
| Controller | Endpoints | Purpose |
|------------|-----------|---------|
| AuthController | `/api/auth/*` | Login, Register |
| CollegeController | `/api/colleges/*` | CRUD colleges |
| ApplicationController | `/api/applications/*` | Student applications |
| QueryController | `/api/queries/*` | Student queries |
| FeedbackController | `/api/feedbacks/*` | Feedback system |
| FileController | `/api/files/*` | File uploads |
| ReportController | `/api/reports/*` | Statistics |

### 3.3 Services (5 total)
- **AuthService** - Authentication & user management
- **CollegeService** - College CRUD operations
- **ApplicationService** - Application processing
- **QueryService** - Query management
- **FeedbackService** - Feedback handling

### 3.4 Repositories (7 total)
All extend `JpaRepository<Entity, Long>`:
- UserRepository, CollegeRepository, CourseRepository
- FacilityRepository, ApplicationRepository, QueryRepository, FeedbackRepository

### 3.5 Models/Entities (8 total)
| Entity | Fields |
|--------|--------|
| User | id, name, email, password, role |
| College | id, name, description, city, state, establishedYear |
| Course | id, name, duration, fees, college |
| Facility | id, type, description, college |
| Application | id, student, college, course, status |
| Query | id, student, counsellor, subject, message, status |
| Feedback | id, student, type, rating, comment, college/counsellor |
| CollegeImage | id, url, college |

### 3.6 Enums
```java
UserRole: STUDENT, ADMIN, COUNSELLOR
ApplicationStatus: PENDING, APPROVED, REJECTED, WITHDRAWN
QueryStatus: OPEN, IN_PROGRESS, RESOLVED, CLOSED
FeedbackType: COLLEGE, COUNSELLOR
FacilityType: LIBRARY, LAB, HOSTEL, SPORTS, CAFETERIA, WIFI, TRANSPORT
```

---

## 4. SECURITY & JWT AUTHENTICATION

### 4.1 How JWT Works
```
1. User logs in with email/password
2. Server validates credentials
3. Server generates JWT token (contains user id, email, role)
4. Client stores token in localStorage
5. Client sends token in Authorization header for every request
6. Server validates token before processing request
```

### 4.2 Security Classes
| Class | Purpose |
|-------|---------|
| **JwtTokenProvider** | Generate & validate JWT tokens |
| **JwtAuthenticationFilter** | Intercept requests, extract & validate JWT |
| **JwtAuthenticationEntryPoint** | Handle unauthorized access (401) |
| **CustomUserDetailsService** | Load user from database |
| **CustomUserDetails** | Wrapper around User entity |
| **SecurityConfig** | Configure security rules |

### 4.3 SecurityConfig Rules
```java
// Public endpoints (no auth required)
/api/auth/** → permitAll()
GET /api/colleges/** → permitAll()
GET /api/courses/** → permitAll()
GET /api/files/** → permitAll()
GET /api/feedbacks/college/** → permitAll()

// All other requests require authentication
anyRequest() → authenticated()
```

### 4.4 Role-Based Authorization
Using `@PreAuthorize` annotation:
```java
@PreAuthorize("hasRole('STUDENT')")  // Only students
@PreAuthorize("hasRole('ADMIN')")    // Only admins
@PreAuthorize("hasRole('COUNSELLOR')") // Only counsellors
```

---

## 5. FRONTEND ARCHITECTURE (React)

### 5.1 Key Files
| File | Purpose |
|------|---------|
| `main.jsx` | Entry point, renders App |
| `App.jsx` | Routes configuration |
| `AuthContext.jsx` | Global auth state |
| `axiosConfig.js` | Axios instance with interceptors |

### 5.2 Routing (App.jsx)
```jsx
// Public Routes
/ → HomePage
/login → LoginPage
/register → RegisterPage
/colleges → BrowseColleges
/colleges/:id → CollegeDetailPage

// Student Routes (Protected)
/student/dashboard → StudentDashboard
/student/applications → MyApplications
/student/queries → MyQueries
/student/feedback → GiveFeedback

// Admin Routes (Protected)
/admin/dashboard → AdminDashboard
/admin/colleges → ManageColleges
/admin/applications → ViewApplications

// Counsellor Routes (Protected)
/counsellor/dashboard → CounsellorDashboard
/counsellor/queries → ViewQueries
/counsellor/feedback → MyFeedback
```

### 5.3 ProtectedRoute Component
```jsx
// Checks if user is logged in and has required role
<ProtectedRoute roles={['STUDENT']}>
  <StudentDashboard />
</ProtectedRoute>
```

### 5.4 AuthContext (State Management)
```jsx
// Provides globally:
- user (current user object)
- token (JWT)
- login(credentials) → calls API, stores token
- logout() → clears token
- isAuthenticated() → checks if logged in
- hasRole(role) → checks user role
```

### 5.5 Axios Interceptors
```javascript
// Request interceptor - adds JWT token to every request
config.headers.Authorization = `Bearer ${token}`

// Response interceptor - handles 401 errors
if (error.status === 401) {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
```

---

## 6. API ENDPOINTS

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, get JWT token |

### Colleges
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/colleges` | List all colleges |
| GET | `/api/colleges/{id}` | Get college details |
| POST | `/api/colleges` | Create college (Admin) |
| PUT | `/api/colleges/{id}` | Update college (Admin) |
| DELETE | `/api/colleges/{id}` | Delete college (Admin) |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Submit application (Student) |
| GET | `/api/applications/my` | My applications (Student) |
| GET | `/api/applications` | All applications (Admin) |
| PUT | `/api/applications/{id}/status` | Update status (Admin) |
| DELETE | `/api/applications/{id}` | Withdraw (Student) |

### Queries
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/queries` | Raise query (Student) |
| GET | `/api/queries/my` | My queries (Student) |
| GET | `/api/queries/assigned` | Assigned queries (Counsellor) |
| PUT | `/api/queries/{id}/respond` | Respond to query (Counsellor) |
| DELETE | `/api/queries/{id}` | Delete query (Student) |

### Feedbacks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/feedbacks` | Submit feedback (Student) |
| GET | `/api/feedbacks/college/{id}` | College feedbacks |
| GET | `/api/feedbacks/my-received` | My received feedback (Counsellor) |

---

## 7. DATABASE DESIGN

### Tables
- users, colleges, courses, facilities, college_images
- applications, queries, feedbacks

### Key Relationships
```
User (1) ←→ (N) Application
User (1) ←→ (N) Query (as student)
User (1) ←→ (N) Query (as counsellor)
User (1) ←→ (N) Feedback (as student)
User (1) ←→ (N) Feedback (as counsellor target)
College (1) ←→ (N) Course
College (1) ←→ (N) Facility
College (1) ←→ (N) Application
College (1) ←→ (N) Feedback
```

---

## 8. KEY CODE EXPLANATIONS

### 8.1 JWT Token Generation
```java
// JwtTokenProvider.java
public String generateToken(Authentication auth) {
    return Jwts.builder()
        .setSubject(email)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hours
        .signWith(secretKey)
        .compact();
}
```

### 8.2 JWT Filter
```java
// JwtAuthenticationFilter.java
// For every request:
1. Extract token from "Authorization: Bearer <token>"
2. Validate token signature and expiration
3. Load user from database
4. Set authentication in SecurityContext
```

### 8.3 Entity with JPA
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String email;
    
    @Enumerated(EnumType.STRING)
    private UserRole role;
}
```

### 8.4 Repository Query
```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

### 8.5 React Hook (useAuth)
```jsx
const { user, login, logout, isAuthenticated } = useAuth();
```

---

## 9. COMMON INTERVIEW QUESTIONS

**Q: Why Spring Boot over plain Spring?**
A: Auto-configuration, embedded server, starter dependencies, production-ready features.

**Q: Why JWT over sessions?**
A: Stateless (scalable), no server storage, works well with REST APIs, contains claims.

**Q: What is JPA?**
A: Java Persistence API - specification for ORM. Hibernate is the implementation.

**Q: What is @Transactional?**
A: Ensures database operations are atomic (all succeed or all rollback).

**Q: Why React Context over Redux?**
A: Simpler for small apps, built-in React feature, no extra dependencies.

**Q: How does ProtectedRoute work?**
A: Checks if user is authenticated and has required role; redirects to login if not.

**Q: What is Axios interceptor?**
A: Middleware that runs before every request (add token) or after every response (handle errors).

**Q: CORS error - what is it?**
A: Browser security preventing cross-origin requests. Solved by configuring CORS in backend.

**Q: What is BCrypt?**
A: Password hashing algorithm. Never store plain passwords.

**Q: What is @RestController?**
A: Combines @Controller + @ResponseBody. Returns JSON directly.

---

## 10. DEMO FLOW

1. **Show Home Page** - Public landing page
2. **Register as Student** - Show form validation
3. **Login** - Show JWT in localStorage
4. **Browse Colleges** - Public endpoint
5. **Apply to College** - Protected, student only
6. **Raise Query** - Student feature
7. **Login as Counsellor** - Different role
8. **Respond to Query** - Counsellor feature
9. **Login as Admin** - Third role
10. **Manage Colleges** - Admin CRUD
11. **View Reports** - Statistics

---

## 11. HOW TO RUN

```bash
# Terminal 1 - Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

**Test Accounts:**
- Create via Register page or check database

---

## 12. DATABASE GUIDE 📊

### 12.1 Where is the Database?

The database is **NOT in the project folder**. It's stored in **MySQL Server** running on your machine.

**Database Configuration File:** `backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campus_info_db
spring.datasource.username=root
spring.datasource.password=(empty)
```

**Key Info:**
- **Database Type:** MySQL 8/9
- **Database Name:** `campus_info_db`
- **Host:** `localhost`
- **Port:** `3306` (default MySQL port)
- **Username:** `root`
- **Password:** (empty)

**Physical Location of MySQL Data:**
```
/opt/homebrew/var/mysql/campus_info_db/
```
(Don't access directly - always use SQL commands)

### 12.2 Database Tables (8 total)

```
campus_info_db
├── users               # All users (Students, Admins, Counsellors)
├── colleges            # College information
├── courses             # Courses offered by each college
├── facilities          # Facilities (Library, Lab, Hostel, etc.)
├── college_images      # Images for each college
├── applications        # Student applications to colleges
├── queries             # Student queries to counsellors
└── feedbacks           # Student feedback (for colleges & counsellors)
```

### 12.3 How to Check the Database - 4 Methods

#### **METHOD 1: Command Line MySQL Shell**

```bash
# Connect to database
mysql -u root campus_info_db
```

Once inside, useful commands:
```sql
SHOW TABLES;              -- See all tables
DESCRIBE users;           -- See structure of users table
SELECT * FROM users;      -- See all users
SELECT * FROM colleges;   -- See all colleges
exit                      -- Exit
```

#### **METHOD 2: One-line Commands (Quick & Easy)**
```bash
# View all tables
mysql -u root campus_info_db -e "SHOW TABLES;"

# View all users
mysql -u root campus_info_db -e "SELECT id, name, email, role FROM users;"

# View all colleges
mysql -u root campus_info_db -e "SELECT id, name, city, state FROM colleges;"

# View all applications
mysql -u root campus_info_db -e "SELECT * FROM applications;"

# View all queries
mysql -u root campus_info_db -e "SELECT id, subject, status FROM queries;"

# View all feedbacks
mysql -u root campus_info_db -e "SELECT * FROM feedbacks;"

# Count records
mysql -u root campus_info_db -e "SELECT COUNT(*) FROM users;"
```

#### **METHOD 3: GUI Tools (Best for Demo!)**

**Option A: MySQL Workbench (Free)**
- Download: https://dev.mysql.com/downloads/workbench/
- Connect: Host=`localhost`, Port=`3306`, User=`root`, Password=(empty)
- Browse `campus_info_db` → See all tables visually

**Option B: TablePlus (Mac)**
```bash
brew install --cask tableplus
```

**Option C: DBeaver (Free, Cross-platform)**
```bash
brew install --cask dbeaver-community
```

#### **METHOD 4: VS Code Extension**
Install "MySQL" extension by Jun Han or "SQLTools" extension to view database directly in VS Code.

### 12.4 Useful SQL Queries for Demo

**Show all users with roles:**
```sql
SELECT id, name, email, role FROM users;
```

**Show all colleges:**
```sql
SELECT id, name, city, state, established_year FROM colleges;
```

**Show applications with student & college names (JOIN):**
```sql
SELECT a.id, u.name AS student, c.name AS college, a.status 
FROM applications a 
JOIN users u ON a.student_id = u.id 
JOIN colleges c ON a.college_id = c.id;
```

**Show queries with counsellor info:**
```sql
SELECT q.id, q.subject, q.status, 
       s.name AS student, c.name AS counsellor 
FROM queries q 
JOIN users s ON q.student_id = s.id 
LEFT JOIN users c ON q.counsellor_id = c.id;
```

**Count users by role:**
```sql
SELECT role, COUNT(*) FROM users GROUP BY role;
```

**Show recent feedbacks:**
```sql
SELECT f.id, f.type, f.rating, f.comment, u.name AS student 
FROM feedbacks f 
JOIN users u ON f.student_id = u.id 
ORDER BY f.created_at DESC;
```

### 12.5 How Tables Are Created

**Auto-creation by Hibernate:**
The line in `application.properties`:
```properties
spring.jpa.hibernate.ddl-auto=update
```

This tells Hibernate to:
- **Auto-create tables** when app starts (if they don't exist)
- **Update schema** when you change Entity classes
- **Never delete data** (only adds new columns/tables)

**This is why you didn't manually create tables!** Hibernate reads your `@Entity` classes and creates corresponding tables.

### 12.6 Data Flow: From UI to Database

**When user registers:**
```
Frontend Form 
  → POST /api/auth/register 
  → AuthController 
  → AuthService.register() 
  → UserRepository.save(user) 
  → Hibernate generates: 
     INSERT INTO users (name, email, password, role) VALUES (...)
  → Data saved to MySQL ✅
```

**When fetching colleges:**
```
Browse Colleges Page 
  → GET /api/colleges
  → CollegeController
  → CollegeService.getAllColleges()
  → CollegeRepository.findAll()
  → Hibernate generates: SELECT * FROM colleges
  → Data returned as JSON ✅
```

### 12.7 Database Demo Quick Cheat Sheet

```bash
# Connect to database
mysql -u root campus_info_db

# Inside MySQL
SHOW TABLES;                          # List all tables
DESC users;                           # Show table structure  
SELECT * FROM users;                  # View all users
SELECT * FROM colleges;               # View all colleges
SELECT COUNT(*) FROM applications;    # Count records
exit                                  # Quit
```

### 12.8 Common Database Questions

**Q: Where is the database stored?**
A: In MySQL server on localhost:3306, in a database called `campus_info_db`. Physical files are managed by MySQL.

**Q: How do tables get created?**
A: Hibernate auto-creates them based on `@Entity` annotated Java classes using `ddl-auto=update`.

**Q: Do you write SQL queries?**
A: No, we use Spring Data JPA - just call methods like `findAll()`, `findById()`, `save()`. Hibernate generates SQL automatically.

**Q: How are passwords stored?**
A: Hashed using BCryptPasswordEncoder. We never store plain passwords.

**Q: What if database is empty?**
A: First time you run the app, tables are created. After that, register users via UI to populate data.

### 12.9 Demo Tip: Live Database Demonstration

**Best way to impress your professor:**

1. Open **MySQL Workbench** (or terminal) **side-by-side** with your app
2. Show the empty/current `users` table
3. Register a new user from the frontend
4. Click "Refresh" in MySQL Workbench
5. **Show the new entry appearing in real-time!**
6. Repeat for applications, queries, etc.

This demonstrates the **end-to-end flow** from UI → API → Database.

---
