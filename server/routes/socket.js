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
      const friend = socket.handshake.auth.userFriend ?? 'anonymous';
      console.log(username)
      console.log(friend)
      try {
        const userId = await MessageModel.getMyId({email: username});
        const friendId = await MessageModel.getFriendId({id: userId[0].id, amigoName: friend});
        result = await MessageModel.postMessage({content: msg, id: userId[0].id, friendId: friendId[0].amigo_id});
      } catch (error) {
        console.error('Error al guardar mensaje:', error);
        socket.emit('error', 'Error al guardar el mensaje');
      }
      io.emit('chat message', msg, result, username, socket.id);
    });

    socket.on('userDestino', (userFriend) => {
      socket.handshake.auth.userFriend = userFriend.userFriend;
      console.log(userFriend.userFriend);
    });
  });
}
// if (!socket.recovered) {
//   try {
//     const rows = await MessageModel.getMessages({offset: socket.handshake.auth.serverOffset ?? 0});
//     rows.forEach((row) => {
//       socket.emit('chat message', row.content, row.id.toString(), row.user);
//     });
//   } catch (error) {
//     console.error('Error al recuperar mensajes:', error);
//   }
// }
