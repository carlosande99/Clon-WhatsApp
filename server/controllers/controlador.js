import { validateUsuario, validatePartialUsuario } from "../schemas/usuario.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from "../config.js";
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
        
        const newUser = await this.UserModel.postUsuario({ input: result.data });
        return res.status(201).json(newUser);
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
            // secret no es valido para produccion
            const token = jwt.sign({email: usuario[0].email}, SECRET_JWT_KEY, {expiresIn: '1h'});
            
            return res.status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                    // secure: true,
                    sameSite: 'none',
                    maxAge: 1000 * 60 * 60 // 1 hora
                })
                .json(rest);
        }

        return res.status(400).json({ error: 'Usuario no encontrado' });

    }
}