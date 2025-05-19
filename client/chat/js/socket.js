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
const chats = document.getElementById('chats')
socket.on('chat message', (msg, serverOffset, username, senderId, friend) => {
    if (senderId !== socket.id) {
        const message = document.createElement('div')
        message.classList.add('message', 'received')
        message.textContent = msg
        messages.appendChild(message)
        socket.auth.serverOffset = serverOffset
    }
    console.log(username)
    console.log(senderId)
    console.log(friend)
    if (!document.getElementById(friend)) {
        const div = document.createElement('div');
        div.classList.add(
          'text-start', 'p-4', 'w-9/10', 'text-white', 'hover:bg-whatsappGrayDark/70', 'rounded-md', 'mb-1'
        );
        const amigo = document.createElement('button');
        amigo.classList.add(
          'btn' , 'text-start', 'w-full'
        );
        amigo.id = friend;
        amigo.innerText = friend;
        div.appendChild(amigo);
        chats.appendChild(div);
    }else{
        // aqui se actualiza el chat con nuevos datos
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
        // enviamos al socket el mensaje para que lo guarde
        socket.emit('chat message', input.value)
        input.value = ''
    }
})

export default socket