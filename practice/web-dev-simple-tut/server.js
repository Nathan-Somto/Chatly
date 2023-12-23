const express = require('express');
const app = express();
const {join} = require('path');
app.use(express.static(join(__dirname, 'client')))
app.get('/', (req,res)=> {
    console.log(join(__dirname,'client', 'index.html'))
    res.sendFile(join(__dirname,'client', 'index.html'))
});
const server = app.listen(8080, () => {
    console.log('server running at http://localhost:3000');
})
const io = require('socket.io')(server, {
    cors: {
        origin: [
            '*'
        ]
    }
});


io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  socket.on("send-message", (message, roomId) => {
    // sends a message to all clients.
    //io.emit('recieve-message', message)
    // sends a message to all clients except the sender.
    if(roomId === ""){
        socket.broadcast.emit('recieve-message', message)
    }
     else{
        socket.to(roomId).emit('recieve-message', message)
     }
  });
  socket.on('join-chat', (roomId, cb) => {
    socket.join(roomId)
    // this allows you to call your client code
    cb(`user joined ${roomId}`)
  })

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
});

