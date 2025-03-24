import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 4000,
    database: 'chat'
}


export const connection = mysql.createPool(config)

export class UserModel {
    static async getUsuario(email) {
        const [usuario] = await connection.query(
            'SELECT * FROM usuarios where email = ?',
            [email]
        )
        return usuario
    }
    static async postUsuario({nombre, email, hashedPassword}) {
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