import axios from 'axios';

const BASE = 'http://localhost:3000/api';

const transactions = [
  { amount: 50000, type: 'income', category: 'salary', date: '2026-03-01', note: 'March Salary' },
  { amount: 15000, type: 'income', category: 'freelance', date: '2026-03-10', note: 'Web project' },
  { amount: 1200, type: 'expense', category: 'food', date: '2026-03-02', note: 'Groceries' },
  { amount: 800, type: 'expense', category: 'food', date: '2026-03-08', note: 'Restaurant' },
  { amount: 2500, type: 'expense', category: 'transport', date: '2026-03-05', note: 'Fuel' },
  { amount: 500, type: 'expense', category: 'transport', date: '2026-03-12', note: 'Uber' },
  { amount: 3000, type: 'expense', category: 'bills', date: '2026-03-03', note: 'Electricity bill' },
  { amount: 1500, type: 'expense', category: 'bills', date: '2026-03-04', note: 'Internet bill' },
  { amount: 4500, type: 'expense', category: 'shopping', date: '2026-03-15', note: 'Clothes' },
  { amount: 2000, type: 'expense', category: 'shopping', date: '2026-03-20', note: 'Electronics' },
  { amount: 1800, type: 'expense', category: 'health', date: '2026-03-07', note: 'Doctor visit' },
  { amount: 600, type: 'expense', category: 'health', date: '2026-03-18', note: 'Medicines' },
  { amount: 1000, type: 'expense', category: 'entertainment', date: '2026-03-22', note: 'Movies & OTT' },
  { amount: 700, type: 'expense', category: 'entertainment', date: '2026-03-25', note: 'Gaming' },
  { amount: 50000, type: 'income', category: 'salary', date: '2026-04-01', note: 'April Salary' },
  { amount: 900, type: 'expense', category: 'food', date: '2026-04-02', note: 'Groceries' },
  { amount: 1100, type: 'expense', category: 'transport', date: '2026-04-03', note: 'Cab rides' },
  { amount: 3200, type: 'expense', category: 'bills', date: '2026-04-04', note: 'Rent' },
  { amount: 2200, type: 'expense', category: 'shopping', date: '2026-04-05', note: 'Amazon order' },
  { amount: 500, type: 'expense', category: 'other', date: '2026-04-06', note: 'Miscellaneous' },
];

const goals = [
  { title: 'Emergency Fund', targetAmount: 100000, savedAmount: 35000, deadline: '2026-12-31', icon: '🛡️' },
  { title: 'New Laptop', targetAmount: 80000, savedAmount: 20000, deadline: '2026-08-01', icon: '💻' },
  { title: 'Vacation Trip', targetAmount: 50000, savedAmount: 12000, deadline: '2026-10-01', icon: '✈️' },
  { title: 'Car Down Payment', targetAmount: 200000, savedAmount: 60000, deadline: '2027-03-01', icon: '🚗' },
];

async function seed() {
  // 1. Register user
  let token: string;
  try {
    const res = await axios.post(`${BASE}/auth/register`, {
      name: 'Demo User',
      email: 'demo@financeapp.com',
      password: 'demo1234',
    });
    token = res.data.token;
    console.log('✅ User registered');
  } catch {
    // User might already exist, try login
    const res = await axios.post(`${BASE}/auth/login`, {
      email: 'demo@financeapp.com',
      password: 'demo1234',
    });
    token = res.data.token;
    console.log('✅ User logged in');
  }

  const headers = { Authorization: `Bearer ${token}` };

  // 2. Seed transactions
  for (const t of transactions) {
    await axios.post(`${BASE}/transactions`, t, { headers });
  }
  console.log(`✅ ${transactions.length} transactions seeded`);

  // 3. Seed goals
  for (const g of goals) {
    await axios.post(`${BASE}/goals`, g, { headers });
  }
  console.log(`✅ ${goals.length} goals seeded`);

  console.log('\n🎉 Seed complete!');
  console.log('Login with: demo@financeapp.com / demo1234');
}

seed().catch(console.error);
