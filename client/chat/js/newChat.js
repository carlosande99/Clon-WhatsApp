
const newChat =  document.getElementById('newChat');

// traer datos cuando se hace click y mandar datos cuando se guarde un nuevo chat
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
        // añadir colores
        const chatDataElement = document.getElementById('newChat');
        const amigos = document.querySelectorAll('.amigo');
        amigos.forEach(amigo => {
            amigo.remove();
        });
        for(let i = 0; i < data.length; i++){
            const amigo = document.createElement('option');
            amigo.classList.add('amigo');
            amigo.value = data[i].nombre;
            amigo.innerText = data[i].nombre;
            chatDataElement.appendChild(amigo);
        }
        
    })
    .catch(error => {
        console.error('Hubo un problema con la solicitud Fetch:', error);
    });
});