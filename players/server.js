var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	io = require('socket.io'),
	THREE = require('three'),
    Player = require('./Player').Player;

var players = [];
var server;

server = http.createServer(function(req, res){
    var path = url.parse(req.url).pathname;
    console.log(path);
    switch (path) {
        case '/lib/three.js':
        case '/lib/kb.js':
        case '/Cube.js':
        case '/Player.js':
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
	    send404(res, "not found: "+ path);
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

console.log('connected');

var playerIndex;

var socket = io.listen(server); 
socket.on('connection', function(client, un){

    socket.username = un;

    players.push(socket.username);

    console.log(socket.username + ' connected.\n');

    socket.emit('player_joined');

    client.on('joined', function(data) {
        // var newPlayer = new Player(data.x, data.y);
        // this.broadcast.emit('newPlayer', {x:newPlayer.getX(), y:newPlayer.getY()});
        // console.log(newPlayer.getX(), newPlayer.getY());
    });

    client.on('disconnect', function() {
        delete players[socket.username];
        console.log(socket.username + ' disconnected.\n');
    });
});