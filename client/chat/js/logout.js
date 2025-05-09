const logout = document.getElementById('cerrarSesion');

logout.addEventListener('click', () => {
    fetch('/logout', {
        method: 'POST',
    })
    .then(res => {
        if(res.ok) {
            alert('sesion cerrada');
            window.location.href = '/login';
        } else {
            alert('Error al cerrar sesión');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al procesar la solicitud');
    });
});