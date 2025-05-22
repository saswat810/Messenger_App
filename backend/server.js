const express = require('express');
const cors = require('cors'); // Make sure to require it
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const databaseConnect = require('./config/database');
const authRouter = require('./routes/authRoute');
const messengerRoute = require('./routes/messengerRoute');

dotenv.config();

const app = express();

// ✅ CORS config: allow credentials with specific origin(s)
const allowedOrigins = [
  'http://localhost:3001',
  'https://messenger-app-ljle.vercel.app',
'https://messenger-app-ljle-saswaths-projects.vercel.app',
'https://messenger-app-ljle-git-main-saswaths-projects.vercel.app',
'https://messenger-app-ljle-ie6nrcr13-saswaths-projects.vercel.app',
  'https://messenger-app-ljle-git-main-saswaths-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());

// 🔀 Routes
app.use('/api/messenger', authRouter);
app.use('/api/messenger', messengerRoute);

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('This is from backend Server');
});

// 🛠️ DB and Server Init
databaseConnect();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("process.env.SECRET", process.env.SECRET);
  console.log(`Server is running on port ${PORT}`);
});
