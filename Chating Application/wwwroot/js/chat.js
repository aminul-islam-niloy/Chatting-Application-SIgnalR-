

"use strict";

const connection = new signalR.HubConnectionBuilder().withUrl("/chathub").build();

document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    const currentUser = document.getElementById("UserInput").value.trim();
    const isCurrentUser = currentUser === user;

    const li = document.createElement("li");
    li.className = "mb-2";

    const messageCard = document.createElement("div");
    messageCard.className = isCurrentUser ? "card text-white bg-primary" : "card bg-light";
    messageCard.style.maxWidth = "75%";
    messageCard.style.marginLeft = isCurrentUser ? "auto" : "0";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body p-2";

    const cardTitle = document.createElement("h6");
    cardTitle.className = "card-title mb-1";
    cardTitle.textContent = user;

    const cardText = document.createElement("p");
    cardText.className = "card-text";
    cardText.textContent = message;

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    messageCard.appendChild(cardBody);
    li.appendChild(messageCard);
    document.getElementById("messageList").appendChild(li);

    const messageContainer = document.getElementById("messageContainer");
    messageContainer.scrollTop = messageContainer.scrollHeight;
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    const user = document.getElementById("UserInput").value.trim();
    const message = document.getElementById("messageInput").value.trim();
    if (user && message) {
        connection.invoke("SendMessage", user, message).catch(function (err) {
            return console.error(err.toString());
        });
        document.getElementById("messageInput").value = '';
    }
    event.preventDefault();
});