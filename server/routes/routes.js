import { Router } from 'express'
import { UserController } from '../controllers/controlador.js'
import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from "../config.js";
import { buscarCookie } from '../utils/cookieUtils.js';

export const createRoutes = ({ UserModel }) => {
    const rutas = Router()
    // Crear una instancia del controlador
    const userController = new UserController({ UserModel })

    rutas.get('/', (req, res) => {
        const token = buscarCookie(req, 'access_token');
        if(!token){
            return res.render('usuario/login')
        }
        try{
            const data = jwt.verify(token, SECRET_JWT_KEY)
            res.render('chat/chat', {email: data.email})
        }catch(error){
            return res.status(401).send('No autorizado')
        }
    });

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

    rutas.get('/chats', userController.getChats);
    
    // cerrar sesion
    rutas.post('/logout', userController.logout);

    return rutas;
}