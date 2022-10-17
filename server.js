const express = require('express')
const app = express()
const http = require('http').createServer(app)
const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listeing on PORT number ${PORT}`);
})

app.use(express.static(__dirname+'/public'))

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
})

// Socket

const io = require('socket.io')(http)

io.on('connection', (socket) =>{
    console.log("connected");
    socket.on('user_connected' , (user_detail) => {
        socket.broadcast.emit('new_user_connected',user_detail);
    })

    socket.on('message', (msg) => {
        socket.broadcast.emit('message',msg );
    })

})

