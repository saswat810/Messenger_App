const express = require('express');
const app = express();
const dotenv = require('dotenv')
const cors = require('cors');
const databaseConnect = require('./config/database')
const authRouter = require('./routes/authRoute')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const messengerRoute = require('./routes/messengerRoute');

dotenv.config()

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/messenger',authRouter);
app.use('/api/messenger',messengerRoute);
app.use(cors({
  origin: [
    'https://messenger-app-new.onrender.com',
    'http://localhost:3000', // your local frontend
    'http://localhost:5000', // to test with Postman
    'postman' // <- Optional if you're not validating the Origin manually
  ],
  credentials: true
}));

const PORT = process.env.PORT || 5000
app.get('/', (req, res)=>{
     res.send('This is from backend Sever')
})

databaseConnect();

app.listen(PORT, ()=>{
     console.log("process.env.SECRET", process.env.SECRET)
     console.log(`Server is running on port ${PORT}`)
})