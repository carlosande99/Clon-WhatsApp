// funcion de cada boton al ser pulsado
const buttons = document.querySelectorAll('button');
buttons.forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    // boton de enviar mensaje
    if(btn.id === 'enviar'){
      console.log('enviar')
      const form = document.getElementById('form');
      btn.firstElementChild.firstElementChild.setAttribute('href', './assets/sprite.svg#microphone');
      btn.setAttribute('id', 'microphone');
      btn.setAttribute('type', 'button');
      form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
    // boton de abrir nuevos chats
    if(btn.id === 'newChat'){
      const closeModal = document.getElementById('closeModal');
      const modal = document.getElementById('modal');
      const modalContent = document.getElementById('modalContent');
      // Abre el modal
      modal.classList.remove('hidden');

      // Cierra el modal al hacer clic en el botón de cerrar
      closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
      });

      // Cierra el modal al hacer clic fuera del contenido
      window.addEventListener('click', (e) => {
        if (!modal.classList.contains('hidden') && !modalContent.contains(e.target)) {
          modal.classList.add('hidden');
        }
      });
    }
  })
})