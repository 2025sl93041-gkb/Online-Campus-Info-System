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