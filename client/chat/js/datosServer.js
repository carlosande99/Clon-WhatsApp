const el = document.getElementById('user-data');
const { nombre, email } = JSON.parse(el.textContent);
export { nombre, email };