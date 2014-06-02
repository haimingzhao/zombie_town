http = require('http'),
url = require('url'),
fs = require('fs'),
io = require('socket.io');

var players = [];
var server;

server = http.createServer(function(req, res){
    var path = url.parse(req.url).pathname;
    switch (path) {
        case '/three.js':
        case '/kb.js':
        case '/':
	    if (path == '/') path = '/client.html';
	    fs.readFile(__dirname + path, function(err, data) {
		if (err) return send404(res, "::err:" + path);
		res.writeHead(200, {'Content-Type': path == 'gameClient.js' ? 'text/javascript' : 'text/html'})
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

console.log('hello');

var socket = io.listen(server); 
socket.on('connection', function(socket){
	console.log('connect');
    //send data to client
    socket.emit('date', {'date': new Date()});
});