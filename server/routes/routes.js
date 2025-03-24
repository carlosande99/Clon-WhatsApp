import { Router } from 'express'
import path from 'node:path'
import { UserController } from '../controllers/controlador.js'

export const rutas = Router()
rutas.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), '../client', 'chat.html'))
});
  
rutas.get('/inicio', (req, res) => {
    res.sendFile(path.join(process.cwd(), '../client', 'inicio.html'))
});

rutas.get('/registro', (req, res) => {
    res.sendFile(path.join(process.cwd(), '../client', 'registro.html'))
});

rutas.post('/registro', (req, res) => {
    const {nombre, email, password} = req.body
    console.log(req.body)
    try{
        res.send(UserController.create({nombre, email, password}))
    } catch (error){
        console.error(error)
    }
});