# 💰 Finance App Backend

A production-ready REST API for personal finance management — built with **NestJS**, **MongoDB Atlas**, and **JWT Authentication**.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black)

---

## 📁 Project Structure

```
src/
├── auth/               # Register & Login (JWT)
├── users/              # User profile
├── transactions/       # Income & Expense CRUD
├── goals/              # Savings goals
├── insights/           # Spending analytics
├── common/
│   ├── guards/         # JWT Auth Guard
│   └── decorators/     # @GetUser decorator
├── app.module.ts
└── main.ts
```

---

## ⚙️ Local Setup

### 1. Clone & Install

```bash
git clone https://github.com/your-username/finance-app-backend.git
cd finance-app-backend
npm install
```

### 2. Create `.env` File

```bash
cp .env.example .env
```

Fill in your values:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/financeapp
JWT_SECRET=your_super_secret_key_here
PORT=3000
```

> Generate a strong JWT secret:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 3. Run Dev Server

```bash
npm run start:dev
```

App runs at → `http://localhost:3000`
Swagger UI → `http://localhost:3000/api/docs`

---

## 🔐 Authentication

This API uses **JWT Bearer Token** authentication.

| Step | Action |
|------|--------|
| 1 | Call `POST /api/auth/register` or `POST /api/auth/login` |
| 2 | Copy the `token` from the response |
| 3 | Send it in every protected request as: `Authorization: Bearer <token>` |

---

## 📡 API Endpoints

### 🔓 Auth — Public

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get JWT token |

---

### 👤 Users — Protected

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/users/me` | Get logged-in user profile |
| `PATCH` | `/api/users/me` | Update name or email |

---

### 💸 Transactions — Protected

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/transactions` | Create a transaction |
| `GET` | `/api/transactions` | Get all transactions (with filters) |
| `GET` | `/api/transactions/summary` | Income / Expense / Balance totals |
| `GET` | `/api/transactions/:id` | Get single transaction |
| `PATCH` | `/api/transactions/:id` | Update a transaction |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |

**Available Query Filters for `GET /api/transactions`:**

| Param | Example | Description |
|-------|---------|-------------|
| `type` | `expense` | Filter by `income` or `expense` |
| `category` | `food` | Filter by category name |
| `startDate` | `2024-01-01` | From date |
| `endDate` | `2024-12-31` | To date |
| `search` | `groceries` | Search in note field |

---

### 🎯 Goals — Protected

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/goals` | Create a savings goal |
| `GET` | `/api/goals` | Get all goals |
| `GET` | `/api/goals/summary` | Active / Completed count + total saved |
| `GET` | `/api/goals/:id` | Get single goal |
| `PATCH` | `/api/goals/:id` | Update a goal |
| `POST` | `/api/goals/:id/add-amount` | Add money to a goal |
| `DELETE` | `/api/goals/:id` | Delete a goal |

---

### 📊 Insights — Protected

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/insights/categories` | Category-wise spending (current month) |
| `GET` | `/api/insights/week-comparison` | This week vs last week |
| `GET` | `/api/insights/monthly-trend` | Last 6 months income/expense trend |
| `GET` | `/api/insights/smart` | Smart tips + top spending insights |

---

## 🧪 Quick Test (curl)

```bash
# 1. Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Shiv","email":"shiv@email.com","password":"123456"}'

# 2. Login → copy token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"shiv@email.com","password":"123456"}'

# 3. Create transaction (paste your token)
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":850,"type":"expense","category":"food","date":"2024-04-02","note":"Groceries"}'

# 4. Get summary
curl http://localhost:3000/api/transactions/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🚀 Deploy on Render (Free)

1. Push your code to **GitHub**
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repo
4. Set the following:

| Setting | Value |
|---------|-------|
| Build Command | `npm install && npm run build` |
| Start Command | `node dist/main` |

5. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Your generated secret key |
| `PORT` | `3000` |

6. Click **Deploy** 🎉

---

## 📖 Swagger Docs

Interactive API docs available at:

```
http://localhost:3000/api/docs
```

To test protected routes in Swagger:
1. Call `POST /api/auth/login` → copy the token
2. Click **Authorize 🔒** button (top right)
3. Paste token → click **Authorize**
4. All protected routes will now work

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| NestJS | Backend framework |
| MongoDB Atlas | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Swagger | API documentation |
| class-validator | Request validation |
