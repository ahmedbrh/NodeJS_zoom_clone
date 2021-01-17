
const express = require('express');
const app = express(); 
const server =  require ('http').Server(app) ; 
const {v4 :  uuidv4}  = require ('uuid'); //versionn 4  
const io = require('socket.io')(server) ; 
const { ExpressPeerServer } = require('peer');
require('dotenv').config()

const peerServer = ExpressPeerServer( server, {  debug : true  });  



 // set the view engine to ejs
 app.use('/peerjs', peerServer )  ; 
app.set ('view engine' , 'ejs') ; 



app.get ('/', (req , res) => { 
res.redirect(`/${uuidv4()}`);

});
app.use(express.static('public'))  ;
app.get('/:room' , (req,res) => { 
res.render('room' , { roomId:   req.params.room  }); 

});

// connecting socket.io 
io.on('connection', (socket)=> {
    socket.on('join-room', (roomId,userId)=> {
      socket.join(roomId); 
      socket.to(roomId).broadcast.emit('user-connected', userId)

//talk to the server  
      socket.on ('message', message => { 
  io.to(roomId).emit('createMessage', message )
})


})
}); 

//listen to the server 
 
server.listen(process.env.PORT || 4040 , ()=> { 

    console.log(`server is running on port ${process.env.PORT || 4040}`)}) ; 