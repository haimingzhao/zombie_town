var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    io = require('socket.io'),
    THREE = require('three');

var server,
    players = [],
    rooms = ['room1'];

server = http.createServer(function(req, res){
    var path = url.parse(req.url).pathname;
    // console.log(path);
    switch (path) {
        case '/lib/three.js':
        case '/lib/keyboard.js':
        case '/Cube.js':
        case '/':
            if (path == '/') path = '/client.html';
            fs.readFile(__dirname + path, function(err, data) {
            if (err) return send404(res, "::err:" + path);
            // res.writeHead(200, {'Content-Type': 'text/html'})

            res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
            res.write(data, 'utf8');
            res.end();
            });
        break;
        default:
        send404(res, "not found: " + path);
    break;
    }
});

send404 = function(res, msg){
    console.log("404:: " + msg);
    res.writeHead(404);
    res.write('404:: ' + msg);
    res.end();
};

server.listen(3000);

var socket = io.listen(server); 
socket.on('connection', function(client){

    client.id = players.length;
    players.push(client);
    console.log('client id ' + client.id);

    client.send({id: client.id});
    console.log({id: client.id});

    // Create each room for 2 players
    // if(client.id%2 === 0) {
    //     //rooms.push(rooms.length);
    //     client.room = 'room1';
    //     client.join('room1');
    // } else if(client.id%2 === 1) {
    //     client.room = 'room1';
    //     client.join('room1');
    // }
    client.room = 'room' + (Math.floor(client.id/2)).toString();

    // console.log(rooms.length - 1);
    client.send({room: client.room});

    client.on('message',function(message) {
        if('zombie' in message) {
            console.log('zombie in room ' + client.room + JSON.stringify(message));
            // if(client.id%2 === 0) {
                players[client.id+1].send({'newPosition': message});
            // }
            // } else {
            //     // if(client.id%2 === 1) {
            //     players[cilent.id-1].send({'newPosition': message});
            // // }
            // }
            // var i;
            // for(i = 0; i < players.length; i++) {
            //     console.log(players[i] + 'room '  + players[i].room);
            //     players[i].in('room1').send({'newPosition': message});
            //     // players[i].send({'newPosition': message, 'cur_room': client.room});
            // }
        } else if('slayer' in message){
            console.log('slayer in room ' + client.room + JSON.stringify(message));
            players[client.id-1].send({'newPosition': message});
            // var i;
            // for(i = 0; i < players.length; i++) {
            //     console.log(players[i] +  'room ' + players[i].room);
            //     players[i].in('room1').send({'newPosition': message});
            //     players[i].send({'newPosition': message, 'cur_room': client.room});
            // }
        }
    });
    
    client.on('disconnect', function() {
        players.splice(client.sessionId,1);
        return client.emit({ disconnect: [client.sessionId]})
        console.log('disconnect');
    });
});
