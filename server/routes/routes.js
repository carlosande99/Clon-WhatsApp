import { Router } from 'express'
import { UserController } from '../controllers/controlador.js'

export const createRoutes = ({ UserModel,  MessageModel}) => {
    const rutas = Router()
    // Crear una instancia del controlador
    const userController = new UserController({ UserModel, MessageModel })

    rutas.get('/', userController.pageChat);

    rutas.get('/registro', (req, res) => {
        res.render('usuario/registro')
    });

    rutas.get('/login', (req, res) => {
        res.render('usuario/login')
    });

    rutas.post('/registro', userController.create);

    rutas.post('/login', userController.login);

    // agregar amigo
    rutas.post('/amigo', userController.addFriend);

    // sacar amigos
    rutas.get('/amigo', userController.getFriend);

    // crear lista
    rutas.post('/chats', userController.addChats);

    // sacar lista
    rutas.get('/chats', userController.getChats);
    
    // cerrar sesion
    rutas.post('/logout', userController.logout);

    // devolver mensajes
    rutas.post('/mensages', userController.getMenssages);

    return rutas;
}