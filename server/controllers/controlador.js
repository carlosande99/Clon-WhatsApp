import { validateUsuario, validatePartialUsuario } from "../schemas/usuario.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from "../config.js";
import { borrarCookie, setCookie, buscarCookie } from "../utils/cookieUtils.js";
export class UserController {
    constructor({UserModel}) {
        this.UserModel = UserModel;
    }
    // crear usuario
    create = async (req, res) => {
        // validaciones
        const result = validateUsuario(req.body);
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        // buscar usuario y crearlo
        const {email} = req.body;
        const usuario = await this.UserModel.getUsuario({email});
        
        if(usuario.length > 0) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }
        
        await this.UserModel.postUsuario({ input: result.data });
        const {password, nombre, ...rest} = result.data;
        const token = jwt.sign({email: result.data.email}, SECRET_JWT_KEY, {expiresIn: '1h'});

        return setCookie(res, token).json(rest);
    }

    // iniciar sesion
    login = async (req, res) => {
        const result = validatePartialUsuario(req.body);
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const {email, password} = req.body;
        const usuario = await this.UserModel.getUsuario({email});
        if(usuario.length > 0) {
            const isValid = await bcrypt.compare(password, usuario[0].pass)
            if(!isValid){
                return res.status(400).json({ error: 'Contraseña incorrecta' });
            }
            const {pass, id, created_at, ...rest} = usuario[0];

            const token = jwt.sign({email: usuario[0].email}, SECRET_JWT_KEY, {expiresIn: '1h'});

            const datos = {...rest};

            return setCookie(res, token).json(datos);
        }

        return res.status(400).json({ error: 'Usuario no encontrado' });

    }

    // cerrar sesion
    logout = async (req, res) => {
        borrarCookie(res, 'access_token');
    }

    // añadir amigo
    addFriend = async (req, res) => {
        const {email, amigo, nombre} = req.body;
        const usuario = await this.UserModel.getUsuario({email: amigo});

        if(usuario.length === 0) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        await this.UserModel.addFriend({email: email, amigo: amigo, nombre: nombre});
        return res.status(200).json({ message: 'Amigo agregado' });
    }

    // devolver lista de amigos
    getFriend = async (req, res) => {
        try {
            const token = buscarCookie(req, 'access_token');
            if (!token) {
                return res.status(401).json({ error: 'No autorizado' });
            }
    
            const data = jwt.verify(token, SECRET_JWT_KEY);
            const email = data.email;
    
            const amigos = await this.UserModel.getFriend({ email });
    
            if (amigos.length === 0) {
                return res.status(400).json({ error: 'No tienes amigos' });
            }
    
            const amigosSinDatos = amigos.map(({ id, usuario_id, created_at, ...rest }) => rest);
            return res.status(200).json(amigosSinDatos);
    
        } catch (error) {
            console.error('Error al obtener amigos:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // devolver lista de chats
    getChats = async (req, res) => {
        try{
            const token = buscarCookie(req, 'access_token');
            if (!token) {
                return res.status(401).json({ error: 'No autorizado' });
            }
    
            const data = jwt.verify(token, SECRET_JWT_KEY);
            const email = data.email;

            const chats = await this.UserModel.getChats({ email });

            if (chats.length === 0) {
                return res.status(400).json({ error: 'No tienes chats' });
            }

            const chatsSinDatos = chats.map(({ id, usuario_id, last_message_at, ...rest }) => rest);
            return res.status(200).json(chatsSinDatos);
        }catch(error){
            console.error('Error al obtener chats:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}