'use strict';

let usernamePage = document.querySelector("#username-page");
let chatPage = document.querySelector("#chat-page");
let usernameForm = document.querySelector("#username-form");
let messageForm = document.querySelector("#message-form");
let messageInput = document.querySelector("#message");
let messageArea = document.querySelector("#message-area");
let connectingElement = document.querySelector(".connecting");

let username = null;
let stompClient = null;
let colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];
usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)

function connect(event) {
    username = document.querySelector("#name").value.trim();
    if (username) {
        usernamePage.classList.add("hidden");
        chatPage.classList.remove("hidden");
        let socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

function onConnected() {
    //Subscribe to public topics
    stompClient.subscribe("/topic/public", onMessageReceived);
    stompClient.send("/app/addUser", {}, JSON.stringify({
        sender: username,
        messageType: 'JOIN'
    }));
    connectingElement.classList.add("hidden");
}

function onError(error) {
    connectingElement.textContent  ="Unable to connect to websocket server, please refresh the page! ";
    connectingElement.style.color = "red";
}

function sendMessage(event) {
    let messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        let message = {
            sender: username,
            content: messageContent,
            messageType: "CHAT"
        };
        stompClient.send("/app/sendMessage", {}, JSON.stringify(message));
        messageInput.value = "";
    }
    event.preventDefault();
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if(message.messageType === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content  = message.sender  +'join!';
    } else if (message.messageType === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content  = message.sender  +'leave!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

