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

    // guardar amigo yes
    static async addFriend({email, amigo, nombre}) {
        const [usuario] = await connection.query(
            'INSERT INTO amigos (usuario_id, amigo_id, nombre) VALUES (?,?,?)',
            [email, amigo, nombre]
        )
        return usuario
    }

    // devolver lista de amigos
    static async getFriend({id}) {
        const [rows] = await connection.query(
            'SELECT * FROM amigos WHERE usuario_id = ?',
            [id]
        )
        return rows
    }

    // creacion de lista del chat para los dos yes
    static async addList({email, amigo}) {
        await connection.query(
            'INSERT INTO chat_list (usuario_id, amigo_id) VALUES (?,?)',
            [email, amigo]
        )

        await connection.query(
            'INSERT INTO chat_list (usuario_id, amigo_id) VALUES (?,?)',
            [amigo, email]
        )
        return
    }
    // devolver lista de chats
    static async getChats({id}) {
        const [rows] = await connection.query(
            'SELECT * FROM chat_list WHERE usuario_id = ?',
            [id]
        )
        return rows
    }
    // buscar usuario por id y devolver su email
    static async getUsuarioId({id}) {
        const [usuario] = await connection.query(
            'SELECT email FROM usuarios where id = ?',
            [id]
        )
        return usuario
    }
}
// modelo del socket
export class MessageModel {
    static async postMessage({content, id, friendId}) {
        const [message] = await connection.query(
            'INSERT INTO mensaje (content, usuario_id, amigo_id) VALUES (?,?,?)',
            [content, id, friendId]
        )
        return message
    }

    static async getMessages({offset}) {
        const [rows] = await connection.execute(
            'SELECT id, content, user FROM mensaje WHERE id > ?',
            [offset]
        );
        return rows
    }

    static async getMyId ({email}) {
        const [rows] = await connection.query(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        )
        return rows
    }

    static async getFriendId ({id, amigoName}) {
        const [rows] = await connection.query(
            'SELECT amigo_id FROM amigos WHERE usuario_id = ? AND nombre = ?',
            [id, amigoName]
        )
        return rows
    }

}