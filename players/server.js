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
        send404(res, "not found: ");
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

    client.id = players.length % 2;
    players.push(client);
    console.log(client.id);

    client.send({id: client.id});
    console.log({id: client.id});

    client.on('message',function(message) {
        if('A_Zombie' in message) {
        console.log(message);
        var i;
        console.log('players.length' + players.length);
        for(i = 0; i < players.length; i++) {
            players[i].send({'zombieReturn': message});
        }
        } else {

    }
    });
    
    client.on('disconnect', function() {
        players.splice(client.sessionId,1);
        return client.emit({ disconnect: [client.sessionId]})
        console.log('disconnect');
    });
});
