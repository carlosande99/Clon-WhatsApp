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
    // buscar usuario por el correo o id
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

    // guardar amigo
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
    // devolver nombre del amigo
    static async getFriendName ({id, amigo_id}) {
        const [rows] = await connection.query(
            'SELECT nombre FROM amigos WHERE usuario_id =? AND amigo_id =?',
            [id, amigo_id]
        )
        return rows
    }
    // creacion de lista del chat para los dos usuarios solo cuando sea el primer mensaje
    static async addList({id, amigo_id}) {
        await connection.query(
            'INSERT INTO chat_list (user1, user2) VALUES (?,?)',
            [id, amigo_id]
        )
        return
    }
    // devolver id del chat
    static async getChat({id, amigo_id}) {
        const [rows] = await connection.query(
            'SELECT id FROM chat_list WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)',
            [id, amigo_id, amigo_id, id]
        );
        return rows;
    }
    // buscar usuario por id y devolver su email
    static async getUsuarioId({id}) {
        const [usuario] = await connection.query(
            'SELECT email FROM usuarios where id = ?',
            [id]
        )
        return usuario
    }
    // devolver todos lo chats
    static async getAllChats ({id}) {
        const [rows] = await connection.query(
            'SELECT * FROM chat_list WHERE user1 =? OR user2 =?',
            [id, id]
        )
        return rows
    }
    // devolver el ultimo mensaje de cada chat
    static async getLastMessage ({id}) {
        const [rows] = await connection.query(
            'SELECT content FROM mensaje WHERE id =?',
            [id]
        )
        return rows
    }
    // devolver el id del amigo
    static async getFriendId ({id, amigoName}) {
        const [rows] = await connection.query(
            'SELECT amigo_id FROM amigos WHERE usuario_id = ? AND nombre = ?',
            [id, amigoName]
        )
        return rows
    }
}
// modelo del socket
export class MessageModel {
    // guardar mensaje
    static async postMessage({content, id, friendId, chatId}) {
        await connection.query(
            'INSERT INTO mensaje (content, usuario_id, amigo_id, chat_id) VALUES (?,?,?,?)',
            [content, id, friendId, chatId]
        )
        return
    }
    // recuperar mensajes
    static async getMessages({chat_id}) {
        const [rows] = await connection.execute(
            'SELECT * FROM mensaje WHERE chat_id = ?',
            [chat_id]
        );
        return rows
    }
    // sacar datos del usuario por el correo
    static async getMyId ({email}) {
        const [rows] = await connection.query(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        )
        return rows
    }
    // sacar id y de los amigos
    static async getFriendId ({id, amigoName}) {
        const [rows] = await connection.query(
            'SELECT amigo_id FROM amigos WHERE usuario_id = ? AND nombre = ?',
            [id, amigoName]
        )
        return rows
    }
    // actualizar el chat con el ultimo mensaje
    static async updateChat ({chatId, lastMessage_id}) {
        await connection.query(
            'UPDATE chat_list SET last_message_id =? WHERE id =?',
            [lastMessage_id, chatId]
        )
        return
    }
    // devolver el id del ultimo mensaje
    static async getLastMessageId ({chatId}) {
        const [rows] = await connection.query(
            'SELECT id FROM mensaje WHERE chat_id =? ORDER BY created_at DESC LIMIT 1',
            [chatId]
        )
        return rows
    }
}