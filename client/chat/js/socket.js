import {io} from 'https://cdn.socket.io/4.8.1/socket.io.esm.min.js'
import {email} from './datosServer.js'

const socket = io({
    auth: {
        username: email,
        userFriend: '',
        serverOffset: 0
    }
})

export function abrirChatCon(amigo){
    socket.emit('userDestino', {
        userFriend: amigo,
    });
}

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
        console.log(input)
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

export default socket