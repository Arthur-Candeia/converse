const express = require('express')
const app = express()
const server = require('http').createServer(app)
const {Server} = require('socket.io')
const cors = require('cors')
const socketio = new Server(server, {cors: {origin: '*'}})
const path = require('path')

app.use(cors())
app.use('/', express.static(path.join(__dirname, '..', 'public')))
app.use('/assets', express.static(path.join(__dirname, '..', 'public', 'assets')))

app.get('/assets', (request, response) => response.sendFile(path.join(__dirname, '..', 'public', 'index.html')))

app.get('/rooms/:room', (request, response) => {
  const {room} = request.params
  if (rooms[room]?.persons?.length == 2) return response.status(422).json({err: 'Sala cheia'})
  response.status(200).json({})
})

const rooms = {}
try {
  socketio.on('connection', (socket) => {
    console.log(socket.id)
  
    socket.on('room', ({room, name}) => {
      if (rooms[room]?.persons?.length == 2 || !room?.trim()) return
      rooms[room] = {persons: [...(rooms[room]?.persons ?? []), socket.id], names: [...(rooms[room]?.names ?? []), name]}
      socketio.emit(`personInRoom${room}`, rooms[room].names)
    })
  
    socket.on('message', ({room, message}) => {
      if (!rooms[room]?.persons.includes(socket.id) || rooms[room].persons.length !== 2) return
      const person = rooms[room].persons.reduce((accum, element) => {
        if(element !== socket.id) return accum + element
        else return accum + ''
      }, '')
      socketio.to(person).emit(room, message)
    })
  
    socket.on('disconnect', () => {
      for (const room in rooms) {
        if (rooms[room].persons.includes(socket.id)) {
          rooms[room].persons = rooms[room].persons.filter((person) => person !== socket.id)
        }
        if (rooms[room].persons.length === 0) delete rooms[room]
      }
    })
  })
} catch (err) {
  console.log(err.message)
}

server.listen(3000, () => console.log(`Server is running on PORT 3000`))