# Finance App Backend — NestJS + MongoDB

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login & get JWT token |

### Users (Protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/users/me | Get logged-in user profile |
| PATCH | /api/users/me | Update profile |

### Transactions (Protected)
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/transactions | Create transaction |
| GET | /api/transactions | Get all (filter: type, category, startDate, endDate, search) |
| GET | /api/transactions/summary | Income / Expense / Balance summary |
| GET | /api/transactions/:id | Get single transaction |
| PATCH | /api/transactions/:id | Update transaction |
| DELETE | /api/transactions/:id | Delete transaction |

### Goals (Protected)
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/goals | Create goal |
| GET | /api/goals | Get all goals |
| GET | /api/goals/summary | Goals summary (active, completed) |
| GET | /api/goals/:id | Get single goal |
| PATCH | /api/goals/:id | Update goal |
| POST | /api/goals/:id/add-amount | Add money to goal |
| DELETE | /api/goals/:id | Delete goal |

### Insights (Protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/insights/categories | Category-wise spending (current month) |
| GET | /api/insights/week-comparison | This week vs last week |
| GET | /api/insights/monthly-trend | Last 6 months income/expense trend |
| GET | /api/insights/smart | Smart tips + top insights |

## Local Setup

```bash
# 1. Clone & install
npm install

# 2. Create .env file
cp .env.example .env
# Fill in MONGODB_URI and JWT_SECRET

# 3. Run dev server
npm run start:dev
```

## Deploy on Render (Free)

1. Push code to GitHub
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Set these:
   - Build Command: `npm install && npm run build`
   - Start Command: `node dist/main`
5. Add Environment Variables:
   - `MONGODB_URI` → your MongoDB Atlas connection string
   - `JWT_SECRET` → any random long string
6. Click Deploy!

## Example Request

```bash
# Register
curl -X POST https://your-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Shiv","email":"shiv@email.com","password":"123456"}'

# Login → copy token from response

# Create Transaction
curl -X POST https://your-app.onrender.com/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":850,"type":"expense","category":"food","date":"2026-04-02","note":"Groceries"}'
```
