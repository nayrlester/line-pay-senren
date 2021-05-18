"use strict";

let express  = require('express'),
    http = require('http'), 
    path = require('path'),
    app = express();
    
app.use(express.static(path.join(__dirname, '/public/assests')));
app.set('views', __dirname + '/public/views');	
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname)));

const port = process.env.PORT || 8080;
const io = require('socket.io')(app.listen(port));
require('./routes')(app, io);

io.on('connection', function(socket) {
  console.log('new connection');
  socket.emit('message', 'This is a message from the dark side.');
});
