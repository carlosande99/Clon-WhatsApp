import { validateUsuario } from "../schemas/usuario.js";
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
        const {email} = req.params;
        const usuario = await this.UserModel.getUsuario({email});
        if(usuario.length > 0) {
            console.log('Usuario ya existe');
        }else{
            console.log('Usuario no existe');
            const newUser = await this.UserModel.postUsuario(result.data);
        }
    }
}