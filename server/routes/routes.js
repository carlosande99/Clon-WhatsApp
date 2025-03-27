import { Router } from 'express'
import path from 'node:path'
import { UserController } from '../controllers/controlador.js'

export const createRoutes = ({ UserModel }) => {
    const rutas = Router()
    // Crear una instancia del controlador
    const userController = new UserController({ UserModel })

    rutas.get('/', (req, res) => {
        res.sendFile(path.join(process.cwd(), '../client', 'chat.html')), {email: 'carlos@gmail.com'}
    });
    
    rutas.get('/inicio', (req, res) => {
        res.sendFile(path.join(process.cwd(), '../client', 'inicio.html'))
    });

    rutas.get('/registro', (req, res) => {
        res.sendFile(path.join(process.cwd(), '../client', 'registro.html'))
    });

    rutas.get('/login', (req, res) => {
        res.sendFile(path.join(process.cwd(), '../client', 'login.html'))
    });

    rutas.post('/registro', userController.create);

    rutas.post('/login', userController.login);
    
    // rutas.post('/logout', userController.logout);

    return rutas;
}