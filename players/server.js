var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	io = require('socket.io'),
	THREE = require('three');

var server
    players = [];

server = http.createServer(function(req, res){
    var path = url.parse(req.url).pathname;
    switch (path) {
        case '/lib/three.js':
        case '/lib/kb.js':
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
socket.on('connection', function(client){

    client.send({id : client.sessionId}); //send client their ID
    console.log(client.sessionId + ' connected.\n');

    socket.emit('connected');

    client.on('message', function(message) {
        players[client.sessionId] = message;
        console.log(message);
        return client.broadcast({message:[client.sessionId, message]});
    });

    client.on('disconnect', function() {
        players.splice(client.sessionId,1);
        return client.emit({ disconnect: [client.sessionId]})
        console.log('disconnect');
    });
});

function movement_handler() {
    for(player in players) {
        player = vector3.vectorAddSelf(player);
    }
}