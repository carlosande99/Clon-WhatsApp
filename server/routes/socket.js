import { MessageModel, UserModel } from "../models/mysql.js";
// socket.js
export default function setupSocketIO(io) {
  io.on('connection', async (socket) => {
    console.log('new connection');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    // funcion donde se guarda el mensaje en la base de datos
    socket.on('chat message', async (msg) => {
      let result;
      const username = socket.handshake.auth.username ?? 'anonymous';
      const friend = socket.handshake.auth.userFriend ?? 'anonymous';
      try {
        const userId = await MessageModel.getMyId({email: username});
        const friendId = await MessageModel.getFriendId({id: userId[0].id, amigoName: friend});
        const idChat = await UserModel.getChat({id: userId[0].id, amigo_id: friendId[0].amigo_id});
        if(!(idChat.length > 0)){
          await UserModel.addList({id: userId[0].id, amigo_id: friendId[0].amigo_id});
          // se repite la llamada para obtener el id del chat
          const idChat = await UserModel.getChat({id: userId[0].id, amigo_id: friendId[0].amigo_id});
          await MessageModel.postMessage({content: msg, id: userId[0].id, friendId: friendId[0].amigo_id, chatId: idChat[0].id});
          const ultimoMensaje = await MessageModel.getLastMessageId({chatId: idChat[0].id});
          await MessageModel.updateChat({chatId: idChat[0].id, lastMessage_id: ultimoMensaje[0].id});
        }else {
          // guarda el mensaje y actualiza el chat
          await MessageModel.postMessage({content: msg, id: userId[0].id, friendId: friendId[0].amigo_id, chatId: idChat[0].id});
          const ultimoMensaje = await MessageModel.getLastMessageId({chatId: idChat[0].id});
          await MessageModel.updateChat({chatId: idChat[0].id, lastMessage_id: ultimoMensaje[0].id});
        }     
      } catch (error) {
        console.error('Error al guardar mensaje:', error);
        socket.emit('error', 'Error al guardar el mensaje');
      }
      io.emit('chat message', msg, result, username, socket.id, friend);
    });
    // cuando se elije un chat o amigo se cambia el destinatario
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
