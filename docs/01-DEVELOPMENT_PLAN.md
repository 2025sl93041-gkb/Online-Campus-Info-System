# Online Campus Info System - Development Plan

## Project Overview
The Online Campus Info System provides information regarding various colleges and courses available to aspiring students. It enables college authorities to manage college data and students to explore, compare, and apply to colleges.

---

## Team Structure
| Role | Responsibility |
|------|---------------|
| Lead Developer (You) | Architecture, core backend/frontend, integration, deployment |
| Developer 2 | UI components, feedback module, reports module |
| Developer 3 | Authentication, query/counselling module, minor fixes |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React JS (Vite + React Router + Axios) |
| Backend | Spring Boot 3.x with Spring MVC |
| ORM | Spring Data JPA / Hibernate |
| Database | MySQL 8.x |
| Authentication | Spring Security + JWT |
| File Upload | Spring Multipart |
| Build Tool | Maven (Backend), npm (Frontend) |
| Version Control | Git + GitHub (Collaborative) |
| API Documentation | Swagger / OpenAPI 3.0 |

---

## Module Breakdown

### Module 1: Registration and Login Module
- User registration (Student, Admin, Counsellor)
- JWT-based authentication
- Role-based access control (RBAC)
- Password encryption (BCrypt)

### Module 2: College Data Updation Module (Admin)
- CRUD operations for college information
- Upload college details: strength, courses, facilities, labs, library, sports, extracurricular
- Image upload for facilities
- Eligibility criteria management

### Module 3: Students Module - Viewing College Details
- Browse all colleges
- View detailed college information
- Filter/search colleges by course, location, eligibility
- View facility images

### Module 4: Students Application Module
- Select desired college
- Fill and submit admission application form
- Track application status

### Module 5: Managements Application Viewing Module
- View all applications received
- Filter by course, date, status
- Accept/Reject applications

### Module 6: Students Querying Module
- Raise queries to counsellors
- View query history and status

### Module 7: Counselling Module
- Counsellor login and dashboard
- View assigned queries
- Respond to student queries
- Mark queries as resolved

### Module 8: Feedback Module
- Students provide feedback on colleges
- Students rate counsellor resolutions
- Rating system (1-5 stars + comments)

### Module 9: Reports Module
- Feedback comparison across colleges
- Counsellor performance reports
- Application statistics
- Visual charts and summaries

---

## Development Phases

### Phase 1: Foundation (Week 1-2)
- Project setup and architecture design
- Database schema design and creation
- Spring Boot project initialization
- React project initialization
- Authentication module (Registration/Login)

### Phase 2: Core Features (Week 3-4)
- College Data Updation Module (Admin CRUD + Image Upload)
- Students Viewing Module (Browse/Search/Filter)
- Application Module (Student submission)
- Management Application Viewing

### Phase 3: Communication and Feedback (Week 5-6)
- Query Module (Student raises queries)
- Counselling Module (Counsellor responds)
- Feedback Module (Ratings and Comments)

### Phase 4: Reports and Polish (Week 7-8)
- Reports Module (Charts, Comparisons, Summaries)
- UI/UX polishing
- Testing and Bug fixes
- Deployment preparation

---

## Git Workflow

### Branch Strategy
- main (production-ready)
- develop (integration branch)
- feature/auth-module
- feature/college-module
- feature/student-module
- feature/application-module
- feature/query-module
- feature/counselling-module
- feature/feedback-module
- feature/reports-module
- fix/bug-description

### Commit Convention
- feat: add new feature
- fix: bug fix
- docs: documentation changes
- style: formatting changes
- refactor: code refactoring
- test: adding tests
- chore: maintenance tasks

---

## Task Distribution

### Lead Developer (You - via Cline)
- Project architecture and setup
- Backend API development (all modules)
- Frontend core components
- Database design and migrations
- Integration and deployment
- Code reviews

### Developer 2
- Frontend UI components (College cards, forms)
- Feedback module frontend
- Reports module (charts)
- CSS/Styling
- Testing UI components

### Developer 3
- Login/Registration frontend forms
- Query/Counselling frontend
- Bug fixes and adjustments
- Documentation
- Testing

---

## Deployment Plan
- Backend: Spring Boot JAR
- Frontend: React build (static hosting or served via Spring Boot)
- Database: MySQL instance
- File Storage: Local filesystem

---

## Quality Assurance
- Unit tests (JUnit 5 + Mockito for backend)
- Component tests (React Testing Library)
- API testing (Postman collections)
- Code reviews via GitHub PRs