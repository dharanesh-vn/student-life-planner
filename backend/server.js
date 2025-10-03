const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Orbit Student Planner API is running...');
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/academic', require('./routes/academicRoutes'));
app.use('/api/planning', require('./routes/planningRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/ai', require('./routes/aiRoutes')); // Added this line

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});