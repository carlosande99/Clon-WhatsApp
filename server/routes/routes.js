import { Router } from 'express'
import path from 'node:path'
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
            return res.render('login')
        }
        try{
            const data = jwt.verify(token, SECRET_JWT_KEY)
            res.render('chat', {email: data.email})
        }catch(error){
            return res.status(401).send('No autorizado')
        }
    });
    
    rutas.get('/inicio', (req, res) => {
        res.render('inicio')
    });

    rutas.get('/registro', (req, res) => {
        res.render('registro')
    });

    rutas.get('/login', (req, res) => {
        res.render('login')
    });

    rutas.post('/registro', userController.create);

    rutas.post('/login', userController.login);
    
    rutas.post('/logout', userController.logout);

    return rutas;
}