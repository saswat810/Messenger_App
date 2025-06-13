const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const databaseConnect = require('./config/database');
const authRouter = require('./routes/authRoute');
const messengerRoute = require('./routes/messengerRoute');
const cookieParser = require('cookie-parser');

dotenv.config();

// Connect to DB
databaseConnect();

// Middlewares
app.use(cors({
  origin: [
    'https://messenger-app-new.onrender.com',
    'http://localhost:3000',
    'http://localhost:5000',
    'postman'
  ],
  credentials: true
}));

app.use(express.json()); // replaces bodyParser.json()
app.use(cookieParser());

// API Routes
app.use('/api/messenger', authRouter);
app.use('/api/messenger', messengerRoute);

// Serve React frontend (only in production or Render)
const __dirnamePath = path.resolve();
app.use(express.static(path.join(__dirnamePath, 'frontend', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirnamePath, 'frontend', 'build', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("process.env.SECRET:", process.env.SECRET);
  console.log(`Server is running on port ${PORT}`);
});
