import {io} from 'https://cdn.socket.io/4.8.1/socket.io.esm.min.js'

const socket = io({
    auth: {
        username: userEmail,
        userFriend: 'sergio@gmail.com',
        serverOffset: 0
    }
})

const form = document.getElementById('form')
const input = document.getElementById('input')
const messages = document.querySelector('.chat-messages')

socket.on('chat message', (msg, serverOffset, username, senderId) => {
    if (senderId !== socket.id) {
        const message = document.createElement('div')
        message.classList.add('message', 'received')
        message.textContent = msg
        messages.appendChild(message)
        socket.auth.serverOffset = serverOffset
    }
})

form.addEventListener('submit', e => {
    e.preventDefault()
    if (input.value) {
        // Crear y mostrar el mensaje enviado localmente
        const message = document.createElement('div')
        message.classList.add('message', 'sent')
        message.textContent = input.value
        messages.appendChild(message)
        
        // Enviamos tanto el mensaje como nuestro ID
        socket.emit('chat message', input.value)
        input.value = ''
    }
})