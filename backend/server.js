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
  'http://localhost:3000/',
  'http://localhost:3001/',
  'https://messenger-app-ljle.vercel.app',
'https://messenger-app-ljle-saswaths-projects.vercel.app/',
'https://messenger-app-ljle-git-main-saswaths-projects.vercel.app/',
'https://messenger-app-ljle-ie6nrcr13-saswaths-projects.vercel.app/',
  'https://messenger-app-ljle-git-main-saswaths-projects.vercel.app/'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
