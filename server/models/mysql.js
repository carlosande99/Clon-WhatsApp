import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../config.js'
const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 4000,
    database: 'chat'
}
const connection = mysql.createPool(config)

// modelo de usuario
export class UserModel {
    // buscar usuario por el correo
    static async getUsuario({email}) {
        const [usuario] = await connection.query(
            'SELECT * FROM usuarios where email = ?',
            [email]
        )
        return usuario
    }
    // crear usuario
    static async postUsuario({input}) {
        const {
            nombre,
            email,
            password
        } = input

        // contraseña encriptada
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        const [usuario] = await connection.query(
            'INSERT INTO usuarios (nombre, email, pass) VALUES (?,?,?)',
            [nombre, email, hashedPassword]
        )
        return usuario
    }
}
// guardar mensaje del chat
export class MessageModel {
    static async postMessage({content, user}) {
        const [message] = await connection.query(
            'INSERT INTO mensaje (content, user) VALUES (?,?)',
            [content, user]
        )
        return message
    }
}