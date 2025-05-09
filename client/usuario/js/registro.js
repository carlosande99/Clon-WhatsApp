const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        password: formData.get('password'),
    };
    
    fetch('/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(res => {
        if(res.ok) {
            alert('usuario creado');
            window.location.href = '/';
        } else {
            alert(json.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al procesar la solicitud');
    });
});