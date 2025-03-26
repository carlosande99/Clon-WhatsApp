import express from 'express'

import {Server} from 'socket.io'
import {createServer} from 'node:http'
import path from 'node:path'

import {createRoutes} from './routes/routes.js'
import setupSocketIO from './routes/socket.js'

import { UserModel } from './models/mysql.js'

const app = express();
const ServerIO = createServer(app);

const io = new Server(ServerIO, {
  connectionStateRecovery: {}
});
setupSocketIO(io);

app.use(express.static(path.join(process.cwd(), '../client')));
app.use(express.json());

app.use('/', createRoutes({UserModel}))

const PORT = process.env.PORT ?? 3000

ServerIO.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
});