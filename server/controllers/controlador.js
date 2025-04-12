import { validateUsuario, validatePartialUsuario } from "../schemas/usuario.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from "../config.js";
import { borrarCookie, setCookie } from "../utils/cookieUtils.js";
export class UserController {
    constructor({UserModel}) {
        this.UserModel = UserModel;
    }
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

            const {pass, id, ...rest} = usuario[0];
            const token = jwt.sign({email: usuario[0].email}, SECRET_JWT_KEY, {expiresIn: '1h'});

            return setCookie(res, token).json(rest);
        }

        return res.status(400).json({ error: 'Usuario no encontrado' });

    }

    logout = async (req, res) => {
        borrarCookie(res, 'access_token');
    }

    addFriend = async (req, res) => {
        const {email, amigo, nombre} = req.body;
        const usuario = await this.UserModel.getUsuario({email: amigo});

        if(usuario.length === 0) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        await this.UserModel.addFriend({email: email, amigo: amigo, nombre: nombre});
        await this.UserModel.addList({email: email, amigo: amigo});
        return res.status(200).json({ message: 'Amigo agregado' });
    }
}