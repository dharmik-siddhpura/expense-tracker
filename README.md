# 💸 Expense Tracker — Spring Boot + Vanilla JS + MySQL

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=JSON%20web%20tokens)

A full-stack personal finance management application. Track income & expenses, visualize spending patterns, and manage monthly budgets.

> **Built by [Dharmik Siddhpura](https://www.linkedin.com/in/dharmik-siddhpura/) | MCA Student | AI Enthusiast**

---

## ✨ Features
- JWT Authentication (Register / Login / Protected Routes)
- Dashboard with income/expense summary cards + Chart.js charts
- Full transaction CRUD with filters (type, month, year)
- Budget Planner with progress bars and 80%/100% alerts
- Monthly Reports with year-over-year chart and summary table
- CSV Export of transactions
- Dark mode toggle
- Responsive design (mobile-friendly)
- Demo user auto-seeded on first run

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Backend | Java 17, Spring Boot 3.3, Spring Security |
| Auth | JWT (jjwt 0.12.5) |
| Database | MySQL 8 + Spring Data JPA / Hibernate |
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6 modules) |
| Charts | Chart.js (CDN) |
| Build | Maven |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0

### 1. Clone the repo
```bash
git clone https://github.com/dharmik-siddhpura/Expense-Tracker.git
cd Expense-Tracker
```

### 2. Setup MySQL
```sql
CREATE DATABASE expense_tracker;
```

### 3. Configure backend
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

### 4. Run backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs at **http://localhost:8080**

> First run auto-seeds a demo user:
> - Email: `demo@expense.com`
> - Password: `demo1234`

### 5. Run frontend
Open `frontend/index.html` in a browser (use Live Server in VS Code for best experience).

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/transactions` | List with filters |
| POST | `/api/transactions` | Add transaction |
| PUT | `/api/transactions/{id}` | Update |
| DELETE | `/api/transactions/{id}` | Delete |
| GET | `/api/transactions/summary` | Dashboard stats |
| GET | `/api/transactions/by-category` | Pie chart data |
| GET | `/api/transactions/export/csv` | Download CSV |
| GET | `/api/budgets` | Get budgets |
| POST | `/api/budgets` | Set budget |
| GET | `/api/reports/monthly` | Year report |

---

## 📁 Structure
```
Expense-Tracker/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/expensetracker/
│       ├── config/       SecurityConfig, CorsConfig
│       ├── controller/   Auth, Transaction, Budget, Report
│       ├── service/      Auth, Transaction, Budget, Report
│       ├── repository/   User, Transaction, Budget
│       ├── model/        User, Transaction, Budget
│       ├── dto/          Request/Response DTOs
│       ├── security/     JwtUtil, JwtFilter, UserDetailsService
│       └── exception/    GlobalExceptionHandler
└── frontend/
    ├── index.html / register.html / dashboard.html
    ├── transactions.html / budget.html / reports.html / profile.html
    ├── css/  style.css, responsive.css
    └── js/   auth.js, api.js, dashboard.js, transactions.js, budget.js, reports.js, utils.js
```

---

## 👨‍💻 Developer

**Dharmik Siddhpura** — MCA Student | Aspiring Java Developer | AI Enthusiast

- GitHub: [@dharmik-siddhpura](https://github.com/dharmik-siddhpura)
- LinkedIn: [dharmik-siddhpura](https://www.linkedin.com/in/dharmik-siddhpura/)
- Email: dharmiksiddhpura02@gmail.com
