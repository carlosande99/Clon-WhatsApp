import { Router } from 'express'
import path from 'node:path'
import { UserController } from '../controllers/controlador.js'
import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from "../config.js";

export const createRoutes = ({ UserModel }) => {
    const rutas = Router()
    // Crear una instancia del controlador
    const userController = new UserController({ UserModel })

    rutas.get('/', (req, res) => {
        const token = req.cookies.access_token
        if(!token){
            return res.status(403).send('No autorizado')
        }
        try{
            const data = jwt.verify(token, SECRET_JWT_KEY)
            res.sendFile(path.join(process.cwd(), '../client', 'chat.html'))
        }catch(error){
            return res.status(401).send('No autorizado')
        }
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
    
    rutas.post('/logout', userController.logout);

    return rutas;
}