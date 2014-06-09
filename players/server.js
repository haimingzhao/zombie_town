var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    io = require('socket.io'),
    THREE = require('three');

var server,
    players = [];

server = http.createServer(function(req, res){
    var path = url.parse(req.url).pathname;
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

    client.room = 'room' + (Math.floor(client.id/2)).toString();
    client.send({room: client.room});

    client.on('message',function(message) {
        if('zombie' in message && players[client.id+1] !== null) {
            console.log('zombie in room ' + client.room + JSON.stringify(message));
            players[client.id+1].send({'newPosition': message});
        } else if('slayer' in message){
            console.log('slayer in room ' + client.room + JSON.stringify(message));
            players[client.id-1].send({'newPosition': message});
        }
        if('zombieWin' in message) {
            console.log('zombieWin!!!');
        }
        if('slayerWin' in message) {
            console.log('slayerWin!!');
        }
    });

    client.on('disconnect', function() {
        players.splice(client.id, client.id);
        console.log(players);
        if(client.id === 0) {
            players[client.id+1].send({'playerDisconnect': client.id});
        }
        if(client.id === 1) {
            players[client.id-1].send({'playerDisconnect': client.id});
        }
    });
});
