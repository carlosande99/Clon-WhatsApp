
const newChat =  document.getElementById('newChat');

// trae todos los chats del usuario
newChat.addEventListener('click', () => {
    fetch('/amigo', {
        method: 'GET',
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Error en la red');
        }
        return res.json();
    })
    .then(data => {
        const contactos = document.getElementById('contactos');
        const usuarios = document.querySelectorAll('.contactos');
        usuarios.forEach(usuario => {
            usuario.remove();
        });
        data.forEach(element => {
            const button = document.createElement('button');
            button.setAttribute('type', 'button')
            button.classList.add('btn', 'flex', 'items-center', 'mb-1', 'mt-1', 'rounded-md', 'hover:bg-whatsappGrayDark/70', 'w-full', 'p-2', 'w-full', 'contactos');
            button.setAttribute('data-email', element.nombre)
            button.innerText = element.nombre;
            contactos.appendChild(button);
        });
    })
    .catch(error => {
        console.error('Hubo un problema con la solicitud Fetch:', error);
    });
});