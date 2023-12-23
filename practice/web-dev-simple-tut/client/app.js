const form = document.querySelector('form');
const message = document.querySelector('#message');
const chatContainer = document.querySelector('.chat__container');
const roomId = document.querySelector("#room_id");
const roomIdButton = document.querySelector("#room_id + button");
const roomIdSpan = document.querySelector(".room_id span");
const socket = io();
console.log(io);
socket.on('connect', () => {
    console.log(socket);
    displayRoomId(socket.id)
});
socket.on('recieve-message', (message) => {
    displayMessage(message, false);
})
form.addEventListener('submit',(e) =>{
    e.preventDefault();
    if(!message.value) return;
    displayMessage(message.value, true);
    socket.emit('send-message', message.value, roomId.value);
    message.value = "";
});
roomIdButton.addEventListener('click',  e => {
    if(roomId.value === "") return;
    roomIdSpan.textContent = roomId.value;
    socket.emit('join-chat', roomId.value, message => displayJoinedMessage(message))
    roomId.value = "";

})
function displayJoinedMessage(value) {
    const div = document.createElement('div');
    div.className = 'room_id';
    div.textContent = value;
    chatContainer.appendChild(div);
}
function displayRoomId(value) {
    roomIdSpan.textContent = value;
    roomId.value = value;
}
function displayMessage (value, isSender) {
    const div = document.createElement('div');
    div.className = isSender ? 'sender' : 'reciever';
    div.textContent = value;
    chatContainer.appendChild(div);
}