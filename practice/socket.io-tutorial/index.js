const express = require("express");
const {createServer} = require('http');
const {join} = require('path');
const {Server} = require('socket.io');
const app = express();
const server = createServer(app);
const io = new Server(server);
app.get('/', (req,res)=> {
    res.sendFile(join(__dirname, 'index.html'))
});
io.on('connection', (socket) => {
    console.log(`a user ${socket} connected`);
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    })
    socket.on("disconnect", () => {
        console.log('user disconnected');
    });
});
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
})