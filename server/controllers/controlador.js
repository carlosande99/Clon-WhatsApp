import { UserModel } from "../models/mysql.js";
import bcrypt from 'bcrypt';
export class UserController {
    static async create({nombre, email, password}) {
        // validaciones

        const hashedPassword = await bcrypt.hash(password, 10); //contraseña encriptada
        try {
            const usuario = await UserModel.getUsuario(email);
            if(usuario.length > 0) {
                console.log('Usuario ya existe');
            }else{
                console.log('Usuario no existe');
                return await UserModel.postUsuario({nombre, email, hashedPassword});
            }
        } catch (error) {
            console.error(error);
        }
    }
}