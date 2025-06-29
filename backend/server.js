const express = require('express');
const http = require('http'); // 👈 ADD THIS
const { Server } = require('socket.io'); // 👈 ADD THIS
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

// App and Server setup
const app = express();
const server = http.createServer(app); // 👈 Use http server

// Socket.IO setup on same server
const io = new Server(server, {
  cors: {
    origin: [
      'https://messenger-app-new.onrender.com',
      'http://localhost:3000',
      'http://localhost:5000'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// 👇 Move your socket.io code here
let users = [];

const addUser = (userId, socketId, userInfo) => {
  const checkUser = users.some(u => u.userId === userId);
  if (!checkUser) {
    users.push({ userId, socketId, userInfo });
  }
};

const userRemove = (socketId) => {
  users = users.filter(u => u.socketId !== socketId);
};

const findFriend = (id) => {
  return users.find(u => u.userId === id);
};

const userLogout = (userId) => {
  users = users.filter(u => u.userId !== userId);
};

io.on('connection', (socket) => {
  console.log('Socket is connecting...');

  socket.on('addUser', (userId, userInfo) => {
    addUser(userId, socket.id, userInfo);
    io.emit('getUser', users);
    const us = users.filter(u => u.userId !== userId);
    const con = 'new_user_add';
    for (let i = 0; i < us.length; i++) {
      socket.to(us[i].socketId).emit('new_user_add', con);
    }
  });

  socket.on('sendMessage', (data) => {
    const user = findFriend(data.reseverId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('getMessage', data);
    }
  });

  socket.on('messageSeen', msg => {
    const user = findFriend(msg.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('msgSeenResponse', msg);
    }
  });

  socket.on('delivaredMessage', msg => {
    const user = findFriend(msg.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('msgDelivaredResponse', msg);
    }
  });

  socket.on('seen', data => {
    const user = findFriend(data.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('seenSuccess', data);
    }
  });

  socket.on('typingMessage', (data) => {
    const user = findFriend(data.reseverId);
    if (user !== undefined) {
      socket.to(user.socketId).emit('typingMessageGet', {
        senderId: data.senderId,
        reseverId: data.reseverId,
        msg: data.msg
      });
    }
  });

  socket.on('logout', userId => {
    userLogout(userId);
  });

  socket.on('disconnect', () => {
    console.log('user is disconnect... ');
    userRemove(socket.id);
    io.emit('getUser', users);
  });
});

// Middleware setup
app.use(cors({
  origin: [
    'https://messenger-app-new.onrender.com',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/messenger', authRouter);
app.use('/api/messenger', messengerRoute);

// Static frontend build
const __dirnamePath = path.resolve();
app.use(express.static(path.join(__dirnamePath, 'frontend', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirnamePath, 'frontend', 'build', 'index.html'));
});

// Start the unified server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server and WebSocket running on port ${PORT}`);
});
