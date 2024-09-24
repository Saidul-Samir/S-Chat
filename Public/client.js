const socket = io();

// Prompt the user for their name when the page loads
window.addEventListener('load', () => {
  const name = prompt("Enter your name to join");
  if (name) {
    socket.emit('new-user-joined', name);
  } else {
    alert("Name is required to join the chat.");
  }
});

function appendMessage(message, position) {
  const messageElement = document.createElement('div');
  messageElement.classList.add(position);
  messageElement.innerText = message;
  document.querySelector('.container').append(messageElement);
  document.querySelector('.container').scrollTop = document.querySelector('.container').scrollHeight;
}

socket.on('user-joined', (name) => {
  appendMessage(`${name} joined the chat`, 'from');
});

const form = document.querySelector('.send-container');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = document.getElementById('inp').value;
  appendMessage(`You: ${message}`, 'to');
  socket.emit('send', message);
  document.getElementById('inp').value = '';
});

socket.on('receive', (data) => {
  appendMessage(`${data.name}: ${data.message}`, 'from');
});

socket.on('user-left', (name) => {
  appendMessage(`${name} left the chat`, 'from');
});
