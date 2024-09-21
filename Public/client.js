const socket = io('http://localhost:3000');

// Function to load chat history from localStorage
function loadChatHistory() {
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    history.forEach(item => {
        appendMessage(item.message, item.position);
    });
}

// Function to save message to localStorage
function saveMessage(message, position) {
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    history.push({ message, position });
    localStorage.setItem('chatHistory', JSON.stringify(history));
}

// Function to append messages to the chat container
function appendMessage(message, position) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(position);
    messageElement.innerText = message;
    document.querySelector('.container').append(messageElement);

    // Save the message in localStorage
    saveMessage(message, position);

    // Scroll to the latest message
    document.querySelector('.container').scrollTop = document.querySelector('.container').scrollHeight;
}

// Load chat history when page is loaded
window.addEventListener('load', () => {
    loadChatHistory();
    
    // Prompt for the user's name
    const name = prompt("Enter your name to join");
    if (name) {
        socket.emit('new-user-joined', name);
    } else {
        // Fallback if no name is provided
        socket.emit('new-user-joined', 'Anonymous');
    }
});

// Handle when a new user joins
socket.on('user-joined', (name) => {
    appendMessage(`${name} joined the chat`, 'from');
});

// Send message to the server and display it
const form = document.querySelector('.send-container');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.getElementById('inp').value;
    appendMessage(`You: ${message}`, 'to');
    socket.emit('send', message);
    document.getElementById('inp').value = '';  // Clear input after sending
});

// Receive message from other users
socket.on('receive', (data) => {
    appendMessage(`${data.name}: ${data.message}`, 'from');
});

// Handle user leaving
socket.on('user-left', (name) => {
    appendMessage(`${name} left the chat`, 'from');
});

// Clear chat history from localStorage
document.getElementById('clearChat').addEventListener('click', () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
        localStorage.removeItem('chatHistory');  // Remove the chat history from localStorage
        document.querySelector('.container').innerHTML = '';  // Clear the chat UI
    }
});
