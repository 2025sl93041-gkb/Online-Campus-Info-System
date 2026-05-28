# Online Campus Info System - Requirements Traceability Matrix

## Project Information
- **Project ID:** KT_Online Campus Info System_33
- **Project Name:** Online Campus Info System
- **Stack:** Spring Boot 3.4.1 / Spring MVC / Spring Data JPA / Hibernate / MySQL / ReactJS

---

## Original Requirements vs Implementation

| # | Requirement | Implementation | Status |
|---|------------|---------------|--------|
| 1 | Logins are made available for the college authorities (admin/counsellor) and students | JWT-based auth with 3 roles: ADMIN, COUNSELLOR, STUDENT. Register/Login pages with role selection. | ✅ Complete |
| 2 | College Authorities as admin should be enabled to upload the information wrt the Colleges, College Strength, Courses available, Facilities like lab, Library Capacity and volumes available, Sports related facilities available, Extra Curricular activities, Eligibility Criteria along with images of the facilities | Admin can CRUD colleges with all fields (name, strength, courses, facilities by type: LAB/LIBRARY/SPORTS/EXTRACURRICULAR/HOSTEL). Image upload via FileController (POST /api/files/upload). | ✅ Complete |
| 3 | Students should be enabled to view all the above said details | Public endpoints: GET /api/colleges, GET /api/colleges/{id} with courses, facilities, images. Frontend: BrowseColleges + CollegeDetailPage. | ✅ Complete |
| 4 | Students should be able to decide the college he wishes to join and he should be able to upload the application form for admission | ApplyPage with course selection, qualification, percentage, SOP. POST /api/applications. | ✅ Complete |
| 4a | The Respective college authorities should be able to view the applications applied by the students | ViewApplications page for Admin. GET /api/applications/college/{id}. Accept/Reject with status update. | ✅ Complete |
| 5 | Students should be able to raise query to the counsellors | RaiseQuery page. POST /api/queries. Auto-assigns counsellor with least load. | ✅ Complete |
| 6 | Counsellors should be able to login and solve the queries raised by the students | ViewQueries page for Counsellor. PUT /api/queries/{id}/respond. Status changes to RESOLVED. | ✅ Complete |
| 7 | Students should be able to provide feedback about the college as well as the resolution provided by the counsellors | GiveFeedback page with type selection (COLLEGE/COUNSELLOR), 1-5 star rating, comments. | ✅ Complete |
| 8 | Facilities should be made available to students which compares the feedback wrt various colleges and counsellors | ReportsPage with college comparison table (sorted by avg rating) + bar chart + counsellor performance table. | ✅ Complete |
| 9 | Reports should be provided to analyse and summarize the feedback | ReportController with 3 endpoints: college-comparison, counsellor-performance, application-stats. Frontend shows stats grid, tables, charts. | ✅ Complete |

---

## Required Modules vs Implementation

| # | Module Name | Backend | Frontend | Route |
|---|------------|---------|----------|-------|
| 1 | Registration/Login Module | AuthController, AuthService, JWT Security | LoginPage, RegisterPage, AuthContext | /login, /register |
| 2 | College Data Updation Module | CollegeController, CollegeService, FileController | ManageColleges (Admin) | /admin/colleges |
| 3 | Students Module For Viewing College Details | CollegeController (GET endpoints) | BrowseColleges, CollegeDetailPage | /colleges, /colleges/:id |
| 4 | Students Application Module | ApplicationController, ApplicationService | ApplyPage, MyApplications | /student/apply/:id, /student/applications |
| 5 | Mgmts Application Viewing Module | ApplicationController (admin endpoints) | ViewApplications | /admin/applications |
| 6 | Students Querying Module | QueryController (student endpoints) | RaiseQuery, MyQueries | /student/raise-query, /student/queries |
| 7 | Counselling Module | QueryController (counsellor endpoints) | ViewQueries | /counsellor/queries |
| 8 | Reports Module | ReportController | ReportsPage | /reports |
| 9 | Feedback Module | FeedbackController, FeedbackService | GiveFeedback | /student/feedback |

---

## Tech Stack Compliance

| Required | Used | Notes |
|----------|------|-------|
| Spring Boot / Spring MVC | Spring Boot 3.4.1 with Spring MVC | ✅ |
| MySQL | MySQL 9.6 (via Homebrew) | ✅ |
| ReactJS | React 19 (Vite) | ✅ |
| Spring Data JPA / Hibernate | Spring Data JPA + Hibernate 6.6.4 | ✅ |
| ORM | Hibernate (via Spring Data JPA) | ✅ |

---

## API Endpoints Summary

### Auth (Public)
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
- GET /api/auth/health

### Colleges (Public GET, Admin POST/PUT/DELETE)
- GET /api/colleges
- GET /api/colleges/{id}
- GET /api/colleges/search?q=
- GET /api/colleges/my (Admin)
- POST /api/colleges (Admin)
- PUT /api/colleges/{id} (Admin)
- DELETE /api/colleges/{id} (Admin)
- GET/POST /api/colleges/{id}/courses
- GET/POST /api/colleges/{id}/facilities

### Applications
- POST /api/applications (Student)
- GET /api/applications/my (Student)
- GET /api/applications/college/{id} (Admin)
- PUT /api/applications/{id}/status (Admin)

### Queries
- POST /api/queries (Student)
- GET /api/queries/my (Student)
- GET /api/queries/assigned (Counsellor)
- PUT /api/queries/{id}/respond (Counsellor)
- PUT /api/queries/{id}/close (Student)

### Feedback
- POST /api/feedbacks (Student)
- GET /api/feedbacks/college/{id} (Public)
- GET /api/feedbacks/counsellor/{id}
- GET /api/feedbacks/my (Student)

### Reports
- GET /api/reports/college-comparison
- GET /api/reports/counsellor-performance
- GET /api/reports/application-stats

### Files
- POST /api/files/upload (Admin - multipart)
- GET /api/files/{filename} (Public)

---

## Database Tables (8 tables)
1. users
2. colleges
3. courses
4. facilities
5. college_images
6. applications
7. queries
8. feedbacks