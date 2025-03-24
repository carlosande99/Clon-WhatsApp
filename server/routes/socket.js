import { MessageModel } from "../models/mysql.js";
// socket.js
export default function setupSocketIO(io) {
    io.on('connection', async (socket) => {
      console.log('new connection');
  
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
  
      socket.on('chat message', async (msg) => {
        let result;
        const username = socket.handshake.auth.username ?? 'anonymous';
        try {
          result = await MessageModel.postMessage({content: msg, user: username});
        } catch (error) {
          console.error('Error al guardar mensaje:', error);
          socket.emit('error', 'Error al guardar el mensaje');
        }
        io.emit('chat message', msg, result, username, socket.id);
      });
  
      if (!socket.recovered) {
        try {
          const [rows] = await connection.execute(
            'SELECT id, content, user FROM mensaje WHERE id > ?',
            [socket.handshake.auth.serverOffset ?? 0]
          );
          rows.forEach((row) => {
            socket.emit('chat message', row.content, row.id.toString(), row.user);
          });
        } catch (error) {
          console.error('Error al recuperar mensajes:', error);
        }
      }
    });
  }

