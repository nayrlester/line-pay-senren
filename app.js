"use strict";

let express  = require('express'),
    http = require('http'), 
    path = require('path'),
    https = require('https'),
    app = express();

const myLiffId = process.env.LINE_PAY_LIFF_ID;

app.set('views', __dirname + '/public/views');	
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/publice/assets'));
app.use(express.static(path.join(__dirname)));
const port = process.env.PORT || 8080;
const io = require('socket.io')(app.listen(port));
require('./routes')(app, io);

io.on('connection', function(socket) {
  console.log('new connection');
  socket.emit('message', 'This is a message from the dark side.');
});
