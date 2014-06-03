var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	io = require('socket.io'),
	THREE = require('three');
	// Player = require('./lib/Player.js').Player;

var players = [];
var server;

server = http.createServer(function(req, res){
    var path = url.parse(req.url).pathname;
    switch (path) {
        case '/lib/three.js':
        case '/lib/kb.js':
        // case '/lib/Player.js':
        // case '/lib/p.js':
        case '/':
	    if (path == '/') path = '/client.html';
	    fs.readFile(__dirname + path, function(err, data) {
		if (err) return send404(res, "::err:" + path);
		res.writeHead(200, {'Content-Type': 'text/html'})

		// res.writeHead(200, {'Content-Type': path == 'gameClient.js' ? 'text/javascript' : 'text/html'})
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

var socket_io = io.listen(server); 
socket_io.on('connection', function(socket){
	console.log('player joined');
    //send data to client
    socket.emit('player_joined');

    socket.on('player_connected', function(data) {
    	var playerIndex = players.length;
    	// players[playerIndex] = {index: playerIndex, position: new THREE.Vector3(0, 0, 0)};
    	// console.log(playerIndex);
    	console.log(JSON.parse(JSON.stringify(playerIndex)));
    	// var newPlayer = new Player(data.x, data.y);
    	// newplayer.id = this.id;
    	// console.log(JSON.parse(JSON.stringify(playerIndex)));
        socket.on('move_left', function(message) {
            mesh.position.x -= 0.1;
            // if('move_left' in message) {
                // console.log(message);
        });
    });

    // socket.on('move_left', function(position) {
    // 	cube = new Three.Vector
    // });

    socket.on('disconnect', function() {
    	console.log('player left');
    })
});


// setInterval(function(socket) {
// 	socket.on('move_left', function() {
//     	console.log('player moved left');
//     });
// });