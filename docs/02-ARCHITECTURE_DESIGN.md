# Online Campus Info System - Architecture Design

## 1. High-Level Architecture

```
+-------------------------------------------------------------------+
|                        CLIENT LAYER                                 |
|  +-------------------------------------------------------------+  |
|  |              React JS Frontend (SPA)                          |  |
|  |  +----------+ +----------+ +----------+ +----------+        |  |
|  |  |  Auth    | | College  | | Student  | | Reports  |        |  |
|  |  |  Pages   | |  Pages   | |  Pages   | |  Pages   |        |  |
|  |  +----------+ +----------+ +----------+ +----------+        |  |
|  +-------------------------------------------------------------+  |
+-------------------------------------------------------------------+
                              | HTTP/HTTPS (REST API - JSON)
                              v
+-------------------------------------------------------------------+
|                      BACKEND LAYER (Spring Boot)                    |
|  +-------------------------------------------------------------+  |
|  |           Spring Security + JWT Authentication Filter         |  |
|  +-------------------------------------------------------------+  |
|                                                                     |
|  +----------+ +----------+ +----------+ +----------+              |
|  |  Auth    | | College  | |Application| |  Query   |              |
|  |Controller| |Controller| |Controller | |Controller|              |
|  +----------+ +----------+ +----------+ +----------+              |
|  +----------+ +----------+ +----------+                            |
|  |Feedback  | | Reports  | |  File    |                            |
|  |Controller| |Controller| |Controller|                            |
|  +----------+ +----------+ +----------+                            |
|                                                                     |
|  +-------------------------------------------------------------+  |
|  |              Service Layer (Business Logic)                    |  |
|  +-------------------------------------------------------------+  |
|                                                                     |
|  +-------------------------------------------------------------+  |
|  |         Repository Layer (Spring Data JPA / Hibernate)        |  |
|  +-------------------------------------------------------------+  |
+-------------------------------------------------------------------+
                              | JDBC / JPA
                              v
+-------------------------------------------------------------------+
|                       DATA LAYER                                    |
|  +------------------------+    +------------------------+          |
|  |     MySQL Database      |    |   File Storage         |          |
|  |   (Structured Data)     |    |   (Images/Documents)   |          |
|  +------------------------+    +------------------------+          |
+-------------------------------------------------------------------+
```

---

## 2. Application Architecture Pattern - Layered (N-Tier)

```
+----------------------------------------+
|         Presentation Layer              |
|    (React Components + Pages)           |
+----------------------------------------+
                  |
+----------------------------------------+
|         Controller Layer                |
|    (REST Controllers - Spring MVC)      |
+----------------------------------------+
                  |
+----------------------------------------+
|         Service Layer                   |
|    (Business Logic + Validation)        |
+----------------------------------------+
                  |
+----------------------------------------+
|         Repository Layer                |
|    (Spring Data JPA Repositories)       |
+----------------------------------------+
                  |
+----------------------------------------+
|         Entity/Model Layer              |
|    (JPA Entities / Hibernate Mapping)   |
+----------------------------------------+
                  |
+----------------------------------------+
|         Database Layer                  |
|    (MySQL 8.x)                          |
+----------------------------------------+
```

---

## 3. Authentication and Authorization Flow

```
Student/Admin/Counsellor
        |
        | 1. POST /api/auth/login (credentials)
        v
+------------------+
| Auth Controller  |
+------------------+
        |
        | 2. Validate credentials
        v
+------------------+
| Auth Service     | --> UserRepository --> MySQL
+------------------+
        |
        | 3. Generate JWT Token
        v
+------------------+
| JWT Provider     |
+------------------+
        |
        | 4. Return JWT Token
        v
     Client stores token
        |
        | 5. Subsequent requests with Authorization: Bearer <token>
        v
+------------------+
| JWT Filter       | --> Validates token --> Sets SecurityContext
+------------------+
        |
        | 6. Route to appropriate controller based on role
        v
   Protected Endpoints
```

### Role-Based Access Control (RBAC)

| Endpoint Pattern | ADMIN | COUNSELLOR | STUDENT |
|-----------------|-------|------------|---------|
| POST /api/colleges/** | Yes | No | No |
| PUT /api/colleges/** | Yes | No | No |
| DELETE /api/colleges/** | Yes | No | No |
| GET /api/colleges/** | Yes | Yes | Yes |
| POST /api/applications | No | No | Yes |
| GET /api/applications/college/{id} | Yes | No | No |
| POST /api/queries | No | No | Yes |
| PUT /api/queries/{id}/respond | No | Yes | No |
| POST /api/feedback | No | No | Yes |
| GET /api/reports/** | Yes | Yes | Yes |

---

## 4. Backend Package Structure

```
com.onlinecampusinfo/
├── config/
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   ├── WebConfig.java
│   └── SwaggerConfig.java
├── controller/
│   ├── AuthController.java
│   ├── CollegeController.java
│   ├── CourseController.java
│   ├── ApplicationController.java
│   ├── QueryController.java
│   ├── FeedbackController.java
│   ├── ReportController.java
│   └── FileController.java
├── service/
│   ├── AuthService.java
│   ├── CollegeService.java
│   ├── CourseService.java
│   ├── ApplicationService.java
│   ├── QueryService.java
│   ├── FeedbackService.java
│   ├── ReportService.java
│   └── FileStorageService.java
├── repository/
│   ├── UserRepository.java
│   ├── CollegeRepository.java
│   ├── CourseRepository.java
│   ├── FacilityRepository.java
│   ├── ApplicationRepository.java
│   ├── QueryRepository.java
│   └── FeedbackRepository.java
├── model/
│   ├── User.java
│   ├── College.java
│   ├── Course.java
│   ├── Facility.java
│   ├── CollegeImage.java
│   ├── Application.java
│   ├── Query.java
│   ├── Feedback.java
│   └── enums/
│       ├── UserRole.java
│       ├── ApplicationStatus.java
│       └── QueryStatus.java
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── CollegeRequest.java
│   │   ├── CourseRequest.java
│   │   ├── ApplicationRequest.java
│   │   ├── QueryRequest.java
│   │   ├── QueryResponseRequest.java
│   │   └── FeedbackRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── UserResponse.java
│       ├── CollegeResponse.java
│       ├── CourseResponse.java
│       ├── ApplicationResponse.java
│       ├── QueryResponse.java
│       ├── FeedbackResponse.java
│       └── ReportResponse.java
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   ├── CustomUserDetailsService.java
│   └── JwtAuthenticationEntryPoint.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   └── UnauthorizedException.java
└── OnlineCampusInfoApplication.java
```

---

## 5. Frontend Architecture

```
frontend/src/
├── api/
│   ├── axiosConfig.js
│   ├── authApi.js
│   ├── collegeApi.js
│   ├── applicationApi.js
│   ├── queryApi.js
│   ├── feedbackApi.js
│   └── reportApi.js
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ErrorBoundary.jsx
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── college/
│   │   ├── CollegeCard.jsx
│   │   ├── CollegeDetail.jsx
│   │   ├── CollegeForm.jsx
│   │   ├── FacilityCard.jsx
│   │   └── CourseList.jsx
│   ├── application/
│   │   ├── ApplicationForm.jsx
│   │   ├── ApplicationList.jsx
│   │   └── ApplicationCard.jsx
│   ├── query/
│   │   ├── QueryForm.jsx
│   │   ├── QueryList.jsx
│   │   └── QueryResponseForm.jsx
│   ├── feedback/
│   │   ├── FeedbackForm.jsx
│   │   ├── FeedbackList.jsx
│   │   └── RatingStars.jsx
│   └── reports/
│       ├── FeedbackChart.jsx
│       ├── ComparisonTable.jsx
│       └── SummaryCard.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── ManageColleges.jsx
│   │   ├── AddCollege.jsx
│   │   ├── EditCollege.jsx
│   │   ├── ViewApplications.jsx
│   │   └── AdminReports.jsx
│   ├── student/
│   │   ├── StudentDashboard.jsx
│   │   ├── BrowseColleges.jsx
│   │   ├── CollegeDetailPage.jsx
│   │   ├── ApplyPage.jsx
│   │   ├── MyApplications.jsx
│   │   ├── RaiseQuery.jsx
│   │   ├── MyQueries.jsx
│   │   ├── GiveFeedback.jsx
│   │   └── ViewReports.jsx
│   └── counsellor/
│       ├── CounsellorDashboard.jsx
│       ├── ViewQueries.jsx
│       └── RespondQuery.jsx
├── context/
│   └── AuthContext.jsx
├── hooks/
│   ├── useAuth.js
│   └── useFetch.js
├── utils/
│   ├── constants.js
│   └── helpers.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 6. Communication Pattern

### Frontend to Backend Communication
- All communication via RESTful API calls
- JSON request/response format
- JWT token passed in Authorization header
- Axios interceptors for automatic token attachment and error handling

### Data Flow Example (Student Applies to College)
```
1. Student fills ApplicationForm.jsx
2. Form calls applicationApi.submitApplication(data)
3. Axios sends POST /api/applications with JWT header
4. JwtAuthenticationFilter validates token
5. ApplicationController receives request
6. ApplicationService processes business logic
7. ApplicationRepository saves to MySQL
8. Response sent back through layers
9. Frontend updates UI with success/error
```

---

## 7. Security Architecture

### Layers of Security
1. CORS Configuration - Only allow frontend origin
2. JWT Authentication Filter - Validate tokens on every request
3. Role-Based Authorization - @PreAuthorize annotations
4. Input Validation - @Valid annotations + custom validators
5. Password Encryption - BCrypt encoding
6. SQL Injection Prevention - JPA parameterized queries
7. XSS Prevention - React auto-escaping + backend sanitization

---

## 8. File Upload Architecture

```
Client (React)
    |
    | Multipart Form Data (images + metadata)
    v
FileController
    |
    | Save file to local storage
    v
FileStorageService
    |
    | Returns file URL/path
    v
Store path in Database (College/Facility record)
    |
    | Serve files via GET /api/files/{filename}
    v
Client displays images
```

---

## 9. Error Handling Strategy

### Backend
- GlobalExceptionHandler with @ControllerAdvice
- Custom exceptions (ResourceNotFound, BadRequest, Unauthorized)
- Standardized error response format:
```json
{
  "timestamp": "2024-01-01T00:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "College not found with id: 5",
  "path": "/api/colleges/5"
}
```

### Frontend
- Axios interceptors for global error handling
- Toast notifications for user feedback
- Error boundaries for component-level errors
- Loading states for async operations