import express from 'express'

import {Server} from 'socket.io'
import {createServer} from 'node:http'
import path from 'node:path'
import cookieParser from "cookie-parser";

import {createRoutes} from './routes/routes.js'
import setupSocketIO from './routes/socket.js'
import { PORT } from './config.js'

import { UserModel, MessageModel } from './models/mysql.js'

const app = express();
const ServerIO = createServer(app);

const io = new Server(ServerIO, {
  connectionStateRecovery: {}
});
setupSocketIO(io);

app.use(express.static(path.join(process.cwd(), '../client/usuario')));
app.use(express.static(path.join(process.cwd(), '../client/chat')));
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), '../client'));
app.use(express.json());
app.use(cookieParser());

app.use('/', createRoutes({UserModel, MessageModel}))


ServerIO.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
});