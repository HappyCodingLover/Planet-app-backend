// import * as fs from 'fs'
import * as http from 'http'
import config from '~/config'
import { getConnection } from './packages/database'
import server from './server'
import { Server } from 'socket.io'

const PORT = process.env.PORT || config.SERVER_PORT || '3000'

async function onStart(): Promise<void> {
  try {
    await getConnection()
  } catch (err) {
    // tslint:disable-next-line:no-console
    throw err
  }
}

const currentServer = http.createServer(
  /*{
    cert: fs.readFileSync(`${__dirname}/../server.cert`, 'utf8'),
    key: fs.readFileSync(`${__dirname}/../server.key`, 'utf8'),
  },*/
  server,
)
const io = new Server(currentServer, {
  // ...
})
io.on('connection', (socket) => {
  console.log('a user connected :D')
  socket.on('send message', (msg) => {
    console.log('send message', msg)
    socket.join(socket.id)
    io.emit('receive message', msg)
    // io.to(socket.id).emit('receive message', msg)
  })
})

// const io = require("socket.io").listen(server);

currentServer.listen(PORT, onStart)
// tslint:disable-next-line:no-console
console.log(`Server up and running on http://localhost:${PORT}`)
