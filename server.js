const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
socketIo = require('socket.io');
const io = socketIo(server);
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;
const userId = [];
const userNames = [];
var activeUser = 0;

io.on('connection', (socket)=>{
     socket.on("nameset", (name)=>{
          socket.emit("namesetdone", name);
          userNames.push(name);
          userId.push(socket.id);
          console.log(userNames, userId)
          activeUser = userId.length;
          io.emit('activeUsers', activeUser)
     })

     socket.on("sendmsg", (msg)=>{
          io.emit("receive", {msg, id: socket.id}
          )
     })

     socket.on('typing', (typingUser)=>{
          io.emit('typing', typingUser);
     })

     socket.on("disconnect",()=>{
          const userIndex = userId.indexOf(socket.id)
          if (userIndex !== -1){
               userNames.splice(userIndex, 1);
               userId.splice(userIndex, 1);
               console.log(userNames, userId)
               activeUser = userId.length;
               io.emit('activeUsers', activeUser);
          }
     })
});

app.use('/public', express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
     res.render('index');
});

app.get('/video-chat', (req, res) => {
     res.render('video-chat');
})

server.listen(PORT);
