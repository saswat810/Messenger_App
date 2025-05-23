const express = require('express');
const app = express();
const dotenv = require('dotenv')

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

if (process.env.NODE_ENV === 'production') {
     const __dirname = path.resolve();
     app.use('/uploads', express.static('/var/data/uploads'));
     app.use(express.static(path.join(__dirname, '/frontend/build')));
   
     app.get('*', (req, res) =>
       res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
     );
   } else {
     const __dirname = path.resolve();
   app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
     app.get('/', (req, res) => {
       res.send('API is running....');
     });
   }

const PORT = process.env.PORT || 5000
app.get('/', (req, res)=>{
     res.send('This is from backend Sever')
})

databaseConnect();

app.listen(PORT, ()=>{
     console.log("process.env.SECRET", process.env.SECRET)
     console.log(`Server is running on port ${PORT}`)
})
