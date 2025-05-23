import { validateUsuario, validatePartialUsuario } from "../schemas/usuario.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from "../config.js";
import { borrarCookie, setCookie, buscarCookie } from "../utils/cookieUtils.js";
export class UserController {
    constructor({UserModel, MessageModel}) {
        this.UserModel = UserModel;
        this.MessageModel = MessageModel;
    }

    // render de la pagina
    pageChat = async (req, res) => {
        const token = buscarCookie(req, 'access_token');
        if(!token){
            return res.render('usuario/login')
        }
        try{
            // cosas que tengo que devolver -> mis datos como el gmail y nombre como de mis amigos
            const data = jwt.verify(token, SECRET_JWT_KEY);
            const misDatos = await this.UserModel.getUsuario({email: data.email});
            // console.log(misDatos[0].id)
            // console.log(misChats)
            const {id, pass, created_at, ...rest} = misDatos[0]
            // console.log(rest)
            res.render('chat/chat', {misDatos: rest});
        }catch(error){
            return res.status(401).send('Error al renderizar la pagina de chat')
        }
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
            const {pass, id, created_at, nombre, ...rest} = usuario[0];

            const token = jwt.sign({email: rest.email}, SECRET_JWT_KEY, {expiresIn: '1h'});

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
        const datos = await this.UserModel.getUsuario({email: email});
        const usuario = await this.UserModel.getUsuario({email: amigo});

        if(usuario.length === 0) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        await this.UserModel.addFriend({email: datos[0].id, amigo: usuario[0].id, nombre: nombre});
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
            const datos = await this.UserModel.getUsuario({email: email});
            // falta poner el buscar el id del user por el email
            const amigos = await this.UserModel.getFriend({ id: datos[0].id });
    
            if (amigos.length === 0) {
                return res.status(400).json({ error: 'No tienes amigos' });
            }
    
            const amigosSinDatos = amigos.map(({ id, usuario_id, created_at, amigo_id,  ...rest }) => rest);
            return res.status(200).json(amigosSinDatos);
    
        } catch (error) {
            console.error('Error al obtener amigos:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    // añadir los chats
    addChats = async (req, res) => {
        try{
            const {amigo} = req.body;
            const token = buscarCookie(req, 'access_token');
            if (!token) {
                return res.status(401).json({ error: 'No autorizado' });
            }
    
            const data = jwt.verify(token, SECRET_JWT_KEY);
            const email = data.email;
            const datos = await this.UserModel.getUsuario({email: email});
            const usuario = await this.UserModel.getUsuario({email: amigo});

            await this.UserModel.addList({email: datos[0].id, amigo: usuario[0].id});
            return res.status(200).json({ message: 'Lista de chat creada' });
        }catch(error){
            console.error('Error al crear lista de chat:', error);
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
            const datos = await this.UserModel.getUsuario({email: email});
            const chats = await this.UserModel.getAllChats({ id: datos[0].id });
            if (chats.length === 0) {
                return res.status(400).json({ error: 'No tienes chats' });
            }
            const chatsConDatos = []
            for (const element of chats) {
                const amigoId = Buffer.compare(element.user1, datos[0].id) === 0 ? element.user2 : element.user1;
                const friendName = await this.UserModel.getFriendName({id: datos[0].id, amigo_id: amigoId});
                const ultimoMensaje = await this.UserModel.getLastMessage({id: element.last_message_id});
                chatsConDatos.push({
                    nombre: friendName[0].nombre,
                    mensaje: ultimoMensaje[0].content,
                })
            }
            return res.status(200).json(chatsConDatos);
        }catch(error){
            console.error('Error al obtener chats:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    getMenssages = async (req, res) => {
        try{
            const {amigo} = req.body;
            const token = buscarCookie(req, 'access_token');
            if (!token) {
                return res.status(401).json({ error: 'No autorizado' });
            }
            const data = jwt.verify(token, SECRET_JWT_KEY);
            const email = data.email;
            const datos = await this.UserModel.getUsuario({email: email});
            const idFriend = await this.UserModel.getFriendId({id: datos[0].id, amigoName: amigo});
            const idChat = await this.UserModel.getChat({id: datos[0].id, amigo_id: idFriend[0].amigo_id});
            console.log(idChat[0].id)
            const mensajes = await this.MessageModel.getMessages({chat_id: idChat[0].id});
            return res.status(200).json(mensajes);
        }catch(error){
            console.error('Error al crear lista de chat:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}