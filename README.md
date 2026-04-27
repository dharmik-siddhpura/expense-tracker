# 💸 Expense Tracker — Full Stack Finance Manager

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

A fully functional personal finance management web app built for portfolio demonstration. Track income and expenses, visualize spending patterns, and manage budgets — all in one place.

> **Built by [Dharmik Siddhpura](https://www.linkedin.com/in/dharmik-siddhpura/) | MCA Student**

---

## 📸 Screenshots

> *(Add screenshots of Dashboard, Transactions, Budget, and Reports pages here)*

---

## ✨ Features

- **JWT Authentication** — Register, Login, protected routes, persistent sessions
- **Dashboard** — Summary cards, 6-month bar chart, category pie chart, recent transactions
- **Transactions** — Add, edit, delete, search, filter by month/type/category, export CSV
- **Budget Planner** — Set monthly limits per category, progress bars, alerts at 80% & 100%
- **Reports** — Year-over-year monthly table + bar chart, CSV export
- **Settings** — Update name, currency preference (INR/USD/EUR/GBP), delete account
- **Recurring Transactions** — Mark transactions as monthly recurring
- **Multi-currency** — INR, USD, EUR, GBP support
- **Toast Notifications** — Success/error feedback on all actions
- **Responsive Design** — Clean, modern UI with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS |
| Charts | Recharts |
| Routing | React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens) |
| HTTP Client | Axios |

---

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── server.js
│   └── src/
│       ├── config/db.js
│       ├── controllers/   (auth, transaction, budget, category)
│       ├── middleware/     (auth middleware)
│       ├── models/         (User, Transaction, Budget, Category)
│       └── routes/         (auth, transaction, budget, category)
├── frontend/
│   └── src/
│       ├── api/            (axios instance)
│       ├── components/     (Layout, Sidebar, StatCard, TransactionItem, Modal, Forms)
│       ├── context/        (AuthContext)
│       ├── pages/          (Dashboard, Transactions, Budget, Reports, Settings, Login, Register)
│       └── utils/          (formatCurrency, formatDate)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/dharmik-siddhpura/expense-tracker.git
cd expense-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/expense-tracker
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/transactions` | List transactions (with filters) |
| POST | `/api/transactions` | Add transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/transactions/summary` | Dashboard stats |
| GET | `/api/transactions/export` | Export CSV |
| GET | `/api/budgets` | Get budgets with spending |
| POST | `/api/budgets` | Set budget |
| GET | `/api/categories` | Get categories |

---

## 👨‍💻 Developer

**Dharmik Siddhpura** — MCA Student, Aspiring Java Developer & AI Enthusiast

- GitHub: [@dharmik-siddhpura](https://github.com/dharmik-siddhpura)
- LinkedIn: [dharmik-siddhpura](https://www.linkedin.com/in/dharmik-siddhpura/)
- Email: dharmiksiddhpura02@gmail.com
