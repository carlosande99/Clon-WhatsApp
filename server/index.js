import express, {json} from 'express'
import path from 'node:path'

import {Server} from 'socket.io'
import {createServer} from 'node:http'

import {rutas} from './routes/routes.js'

const app = express()
const ServerIO = createServer(app)
const io = new Server(ServerIO)

io.on('connection', (socket) => {
  console.log('new connection')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
  })
})

// app.use('/', rutas)

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), '../client', 'index.html'))
})

const PORT = process.env.PORT ?? 3000

ServerIO.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})