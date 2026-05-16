# Online Campus Info System - System Design

## 1. Database Schema Design

### Entity Relationship Diagram (ERD)

```
+----------------+       +------------------+       +----------------+
|     users      |       |    colleges      |       |    courses     |
+----------------+       +------------------+       +----------------+
| id (PK)        |       | id (PK)          |       | id (PK)        |
| name           |       | name             |       | college_id(FK) |
| email (unique) |       | description      |       | name           |
| password       |       | location         |       | duration       |
| role           |       | established_year |       | eligibility    |
| phone          |       | strength         |       | seats          |
| created_at     |       | admin_id (FK)    |       | fee            |
| updated_at     |       | created_at       |       | created_at     |
+----------------+       | updated_at       |       +----------------+
                          +------------------+
                                  |
              +-------------------+-------------------+
              |                                       |
+------------------+                    +------------------+
|   facilities     |                    |  college_images  |
+------------------+                    +------------------+
| id (PK)          |                    | id (PK)          |
| college_id (FK)  |                    | college_id (FK)  |
| type             |                    | image_url        |
| name             |                    | caption          |
| description      |                    | facility_type    |
| capacity         |                    | created_at       |
| details          |                    +------------------+
| created_at       |
+------------------+

+-------------------+       +------------------+       +------------------+
|   applications    |       |     queries      |       |    feedbacks     |
+-------------------+       +------------------+       +------------------+
| id (PK)           |       | id (PK)          |       | id (PK)          |
| student_id (FK)   |       | student_id (FK)  |       | student_id (FK)  |
| college_id (FK)   |       | counsellor_id(FK)|       | college_id (FK)  |
| course_id (FK)    |       | subject          |       | counsellor_id(FK)|
| student_name      |       | message          |       | rating           |
| student_email     |       | response         |       | comment          |
| student_phone     |       | status           |       | type             |
| qualification     |       | created_at       |       | created_at       |
| percentage        |       | responded_at     |       +------------------+
| status            |       +------------------+
| applied_at        |
| updated_at        |
+-------------------+
```

---

## 2. Detailed Table Definitions

### 2.1 users
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'COUNSELLOR', 'STUDENT') NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2.2 colleges
```sql
CREATE TABLE colleges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    established_year INT,
    strength INT,
    website VARCHAR(255),
    contact_email VARCHAR(150),
    contact_phone VARCHAR(15),
    admin_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id)
);
```

### 2.3 courses
```sql
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    college_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    department VARCHAR(100),
    duration VARCHAR(50),
    degree_type VARCHAR(50),
    eligibility_criteria TEXT,
    total_seats INT,
    fee DECIMAL(10,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);
```

### 2.4 facilities
```sql
CREATE TABLE facilities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    college_id BIGINT NOT NULL,
    type ENUM('LAB', 'LIBRARY', 'SPORTS', 'EXTRACURRICULAR', 'HOSTEL', 'OTHER') NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    capacity INT,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);
```

### 2.5 college_images
```sql
CREATE TABLE college_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    college_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(200),
    facility_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);
```

### 2.6 applications
```sql
CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    college_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    student_email VARCHAR(150) NOT NULL,
    student_phone VARCHAR(15),
    qualification VARCHAR(100),
    percentage DECIMAL(5,2),
    address TEXT,
    statement_of_purpose TEXT,
    status ENUM('PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED') DEFAULT 'PENDING',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (college_id) REFERENCES colleges(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

### 2.7 queries
```sql
CREATE TABLE queries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    counsellor_id BIGINT,
    college_id BIGINT,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    response TEXT,
    status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (counsellor_id) REFERENCES users(id),
    FOREIGN KEY (college_id) REFERENCES colleges(id)
);
```

### 2.8 feedbacks
```sql
CREATE TABLE feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    college_id BIGINT,
    counsellor_id BIGINT,
    type ENUM('COLLEGE', 'COUNSELLOR') NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (college_id) REFERENCES colleges(id),
    FOREIGN KEY (counsellor_id) REFERENCES users(id)
);
```

---

## 3. API Design (RESTful Endpoints)

### 3.1 Authentication APIs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login user | Public |
| GET | /api/auth/profile | Get current user profile | Authenticated |
| PUT | /api/auth/profile | Update profile | Authenticated |

### 3.2 College APIs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/colleges | List all colleges | Public |
| GET | /api/colleges/{id} | Get college details | Public |
| POST | /api/colleges | Create new college | ADMIN |
| PUT | /api/colleges/{id} | Update college | ADMIN |
| DELETE | /api/colleges/{id} | Delete college | ADMIN |
| GET | /api/colleges/search?q={query} | Search colleges | Public |
| GET | /api/colleges/{id}/facilities | Get facilities | Public |
| POST | /api/colleges/{id}/facilities | Add facility | ADMIN |
| PUT | /api/colleges/{id}/facilities/{fid} | Update facility | ADMIN |
| DELETE | /api/colleges/{id}/facilities/{fid} | Delete facility | ADMIN |

### 3.3 Course APIs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/colleges/{id}/courses | List courses for college | Public |
| GET | /api/courses/{id} | Get course details | Public |
| POST | /api/colleges/{id}/courses | Add course | ADMIN |
| PUT | /api/courses/{id} | Update course | ADMIN |
| DELETE | /api/courses/{id} | Delete course | ADMIN |

### 3.4 Application APIs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/applications | Submit application | STUDENT |
| GET | /api/applications/my | Get my applications | STUDENT |
| GET | /api/applications/college/{id} | Get applications for college | ADMIN |
| GET | /api/applications/{id} | Get application details | ADMIN/STUDENT |
| PUT | /api/applications/{id}/status | Update application status | ADMIN |

### 3.5 Query APIs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/queries | Raise a query | STUDENT |
| GET | /api/queries/my | Get my queries | STUDENT |
| GET | /api/queries/assigned | Get assigned queries | COUNSELLOR |
| GET | /api/queries/{id} | Get query details | Authenticated |
| PUT | /api/queries/{id}/respond | Respond to query | COUNSELLOR |
| PUT | /api/queries/{id}/close | Close query | STUDENT |

### 3.6 Feedback APIs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/feedbacks | Submit feedback | STUDENT |
| GET | /api/feedbacks/college/{id} | Get college feedbacks | Public |
| GET | /api/feedbacks/counsellor/{id} | Get counsellor feedbacks | Authenticated |
| GET | /api/feedbacks/my | Get my feedbacks | STUDENT |

### 3.7 Report APIs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/reports/college-comparison | Compare college feedbacks | Authenticated |
| GET | /api/reports/counsellor-performance | Counsellor ratings summary | ADMIN |
| GET | /api/reports/application-stats | Application statistics | ADMIN |
| GET | /api/reports/college/{id}/summary | College feedback summary | Authenticated |
| GET | /api/reports/overall-summary | Overall system summary | ADMIN |

### 3.8 File APIs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/files/upload | Upload file/image | ADMIN |
| GET | /api/files/{filename} | Get/download file | Public |
| DELETE | /api/files/{filename} | Delete file | ADMIN |

---

## 4. Data Transfer Objects (DTOs)

### 4.1 Request DTOs

**LoginRequest**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**RegisterRequest**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT",
  "phone": "9876543210"
}
```

**CollegeRequest**
```json
{
  "name": "ABC Engineering College",
  "description": "Premier engineering institution...",
  "location": "123 College Road",
  "city": "Bangalore",
  "state": "Karnataka",
  "establishedYear": 1995,
  "strength": 5000,
  "website": "https://abc-college.edu",
  "contactEmail": "info@abc-college.edu",
  "contactPhone": "0801234567"
}
```

**ApplicationRequest**
```json
{
  "collegeId": 1,
  "courseId": 2,
  "studentName": "John Doe",
  "studentEmail": "john@example.com",
  "studentPhone": "9876543210",
  "qualification": "12th Standard",
  "percentage": 85.5,
  "address": "123 Street, City",
  "statementOfPurpose": "I wish to join..."
}
```

**QueryRequest**
```json
{
  "collegeId": 1,
  "subject": "Admission Process Query",
  "message": "What are the documents required for admission?"
}
```

**FeedbackRequest**
```json
{
  "collegeId": 1,
  "counsellorId": null,
  "type": "COLLEGE",
  "rating": 4,
  "comment": "Great infrastructure and faculty."
}
```

### 4.2 Response DTOs

**AuthResponse**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "STUDENT"
}
```

**CollegeResponse**
```json
{
  "id": 1,
  "name": "ABC Engineering College",
  "description": "Premier engineering institution...",
  "location": "123 College Road",
  "city": "Bangalore",
  "state": "Karnataka",
  "establishedYear": 1995,
  "strength": 5000,
  "website": "https://abc-college.edu",
  "courses": [],
  "facilities": [],
  "images": [],
  "averageRating": 4.2,
  "totalFeedbacks": 25
}
```

**ReportResponse (College Comparison)**
```json
{
  "colleges": [
    {
      "collegeId": 1,
      "collegeName": "ABC College",
      "averageRating": 4.2,
      "totalFeedbacks": 25,
      "totalApplications": 150
    },
    {
      "collegeId": 2,
      "collegeName": "XYZ College",
      "averageRating": 3.8,
      "totalFeedbacks": 18,
      "totalApplications": 120
    }
  ]
}
```

---

## 5. Component Interaction Diagrams

### 5.1 Student Application Flow
```
Student Browser
    |
    |-- GET /api/colleges --> Browse colleges
    |-- GET /api/colleges/1 --> View college detail
    |-- GET /api/colleges/1/courses --> View courses
    |-- POST /api/applications --> Submit application
    |       {collegeId, courseId, details...}
    |-- GET /api/applications/my --> Track my applications
```

### 5.2 Admin College Management Flow
```
Admin Browser
    |
    |-- POST /api/colleges --> Create college
    |-- POST /api/colleges/1/courses --> Add courses
    |-- POST /api/colleges/1/facilities --> Add facilities
    |-- POST /api/files/upload --> Upload images
    |-- GET /api/applications/college/1 --> View applications
    |-- PUT /api/applications/5/status --> Accept/Reject
```

### 5.3 Query-Counselling Flow
```
Student                          Counsellor
   |                                  |
   |-- POST /api/queries              |
   |       {subject, message}         |
   |                                  |-- GET /api/queries/assigned
   |                                  |-- PUT /api/queries/1/respond
   |                                  |       {response}
   |-- GET /api/queries/my            |
   |-- POST /api/feedbacks            |
   |       {counsellorId, rating}     |
```

### 5.4 Feedback and Reports Flow
```
Student
    |-- POST /api/feedbacks --> Rate college/counsellor
    |-- GET /api/reports/college-comparison --> Compare colleges
    |
Admin
    |-- GET /api/reports/counsellor-performance --> View counsellor stats
    |-- GET /api/reports/application-stats --> View application stats
    |-- GET /api/reports/overall-summary --> System overview
```

---

## 6. Non-Functional Requirements

### 6.1 Performance
- API response time: less than 500ms for standard queries
- Image upload: support up to 5MB per file
- Pagination: default 10 items per page for list endpoints
- Database indexing on frequently queried columns

### 6.2 Security
- All passwords hashed with BCrypt (strength 10)
- JWT tokens expire after 24 hours
- HTTPS in production
- Input sanitization on all endpoints
- File type validation for uploads (only images: jpg, png, gif)

### 6.3 Scalability
- Stateless backend (JWT-based, no server sessions)
- Database connection pooling (HikariCP)
- Lazy loading for JPA relationships
- Paginated API responses

### 6.4 Reliability
- Global exception handling
- Proper HTTP status codes
- Validation at both frontend and backend
- Database constraints for data integrity

---

## 7. Project Directory Structure Overview

```
OnlineCampusInfo/
├── docs/
│   ├── 01-DEVELOPMENT_PLAN.md
│   ├── 02-ARCHITECTURE_DESIGN.md
│   └── 03-SYSTEM_DESIGN.md
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/onlinecampusinfo/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── model/
│   │   │   │   ├── dto/
│   │   │   │   ├── security/
│   │   │   │   ├── exception/
│   │   │   │   └── OnlineCampusInfoApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── schema.sql
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 8. Deployment Architecture

```
+------------------+     +------------------+     +------------------+
|   React App      |     |  Spring Boot     |     |    MySQL DB      |
|   (Port 5173)    |---->|  (Port 8080)     |---->|  (Port 3306)     |
|   Dev Server     |     |  REST API        |     |  campus_info_db  |
+------------------+     +------------------+     +------------------+
                                |
                          +------------------+
                          |  File Storage    |
                          |  ./uploads/      |
                          +------------------+
```

### Production Deployment
- Frontend: Build React app, serve static files
- Backend: Package as JAR, run with java -jar
- Database: MySQL server instance
- Reverse Proxy: Nginx (optional, for production)
