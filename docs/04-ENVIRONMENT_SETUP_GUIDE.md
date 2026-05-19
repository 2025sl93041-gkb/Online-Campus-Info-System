# Online Campus Info System - Environment Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

| Tool | Version | Download Link |
|------|---------|---------------|
| Java JDK | 17 or higher | https://adoptium.net/ |
| Maven | 3.8+ | https://maven.apache.org/download.cgi |
| Node.js | 18+ (LTS) | https://nodejs.org/ |
| npm | 9+ (comes with Node) | - |
| MySQL | 8.0+ | https://dev.mysql.com/downloads/ |
| Git | Latest | https://git-scm.com/ |
| VS Code / IntelliJ | Latest | IDE of choice |

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/2025sl93041-gkb/Online-Campus-Info-System.git
cd Online-Campus-Info-System
```

---

## Step 2: Database Setup (MySQL)

### 2.1 Start MySQL Server
Make sure MySQL is running on port 3306.

### 2.2 Create the Database
```sql
CREATE DATABASE campus_info_db;
CREATE USER 'campususer'@'localhost' IDENTIFIED BY 'campuspass123';
GRANT ALL PRIVILEGES ON campus_info_db.* TO 'campususer'@'localhost';
FLUSH PRIVILEGES;
```

> **Note:** Tables will be auto-created by Spring Boot JPA (ddl-auto=update) when you run the backend.

---

## Step 3: Backend Setup (Spring Boot)

### 3.1 Navigate to backend directory
```bash
cd backend
```

### 3.2 Configure application properties
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campus_info_db
spring.datasource.username=campususer
spring.datasource.password=campuspass123
```

### 3.3 Build and Run
```bash
# Using Maven
mvn clean install
mvn spring-boot:run
```

The backend will start at: **http://localhost:8080**

### 3.4 Verify Backend is Running
```bash
curl http://localhost:8080/api/auth/health
```

---

## Step 4: Frontend Setup (React)

### 4.1 Navigate to frontend directory
```bash
cd frontend
```

### 4.2 Install dependencies
```bash
npm install
```

### 4.3 Start development server
```bash
npm run dev
```

The frontend will start at: **http://localhost:5173**

---

## Step 5: Verify Full Stack is Working

1. Open browser at http://localhost:5173
2. You should see the homepage
3. Try registering a new user
4. Login with the credentials

---

## IDE Recommendations

### VS Code Extensions
- **Backend:** Extension Pack for Java, Spring Boot Extension Pack
- **Frontend:** ES7+ React/Redux Snippets, Prettier, ESLint
- **General:** GitLens, Thunder Client (API testing)

### IntelliJ IDEA
- Use IntelliJ for backend (better Spring Boot support)
- Use VS Code for frontend (better React support)

---

## Common Issues & Troubleshooting

### MySQL Connection Refused
- Ensure MySQL is running: `mysql -u root -p`
- Check port 3306 is not blocked
- Verify credentials in application.properties

### Port Already in Use
- Backend (8080): `lsof -i :8080` then `kill -9 <PID>`
- Frontend (5173): `lsof -i :5173` then `kill -9 <PID>`

### Maven Build Failure
- Ensure Java 17+ is set: `java -version`
- Clear Maven cache: `mvn clean install -U`

### npm Install Errors
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

---

## Git Workflow for Team Members

### Before Starting Work
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### After Completing Work
```bash
git add .
git commit -m "feat: description of your changes"
git push origin feature/your-feature-name
```
Then create a **Pull Request** to `develop` branch on GitHub.

### Staying Updated
```bash
git checkout develop
git pull origin develop
git checkout your-branch
git merge develop
```

---

## Environment Variables (Summary)

| Variable | Default Value | Description |
|----------|--------------|-------------|
| DB_URL | jdbc:mysql://localhost:3306/campus_info_db | Database URL |
| DB_USERNAME | campususer | Database username |
| DB_PASSWORD | campuspass123 | Database password |
| JWT_SECRET | (set in properties) | JWT signing key |
| SERVER_PORT | 8080 | Backend port |
| UPLOAD_DIR | ./uploads | File upload directory |