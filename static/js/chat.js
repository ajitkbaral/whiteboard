var chatForm = document.getElementById('chatForm');

chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    socket.emit('send message', chatForm.message.value);
    chatForm.message.value = "";
});

function openChat() {
    document.getElementById("chat").style.display = "block";
    chatForm.message.focus();
}

function closeChat() {
document.getElementById("chat").style.display = "none";
document.getElementById('open-chat-box').style.backgroundColor = '#555';
}

socket.on('new message', function(data){

    document.getElementById('open-chat-box').style.backgroundColor = '#4CAF50';


    var chatbox = document.getElementById('chat-box');
    var chatMessage = document.createElement('div');
    chatMessage.className = 'chat-message';

    var userSpan = document.createElement('span');
    userSpan.innerHTML = "<b>"+data.user+"</b><br>";
    chatMessage.appendChild(userSpan);

    var messageSpan = document.createElement('span');
    messageSpan.innerHTML = data.message;

    chatMessage.appendChild(messageSpan);

    chatbox.appendChild(chatMessage);
    var hr = document.createElement('hr')
    chatbox.appendChild(hr);

    chatbox.scrollTop = chatbox.scrollHeight;

});
