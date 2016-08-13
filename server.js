/**
 * Created by sachin on 13/8/16.
 */
var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
usersall=[];
connections=[];

server.listen(process.env.PORT || 3000);

console.log ("server running .....");

app.get('/',function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on ('connection',function (socket) {
    connections.push(socket);
    console.log('Connected : %s socket connected',connections.length);

    socket.on('disconnect',function (data) {

       usersall.splice(usersall.indexOf(socket.username),1);
       updateuserNames();
       connections.splice(connections.indexOf(socket),1);
       console.log('Disconnected: %s sockets connected', connections.length);
    });

    //Send Message
    socket.on('send message',function (data) {
        io.sockets.emit ('new message',{msg : data ,user: socket.username});
    });

    //New user

    socket.on('new user',function (data,callback) {
    callback(true);
        socket.username=data;
        usersall.push(socket.username);
        updateuserNames();
    })

    function updateuserNames() {
        io.sockets.emit('get users',usersall);
    }
});

