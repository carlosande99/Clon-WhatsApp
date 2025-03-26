import mysql from 'mysql2/promise'
import bycrypt from 'bcrypt'

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 4000,
    database: 'chat'
}


const connection = mysql.createPool(config)

export class UserModel {
    // buscar usuario
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

        const hashedPassword = await bycrypt.hash(password, 10)

        const [usuario] = await connection.query(
            'INSERT INTO usuarios (nombre, email, pass) VALUES (?,?,?)',
            [nombre, email, hashedPassword]
        )
        return usuario
    }
}

export class MessageModel {
    static async postMessage({content, user}) {
        const [message] = await connection.query(
            'INSERT INTO mensaje (content, user) VALUES (?,?)',
            [content, user]
        )
        return message
    }
}