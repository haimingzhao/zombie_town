var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    io = require('socket.io'),
    THREE = require('three');

var server,
    players = [],
    humans = ['h1'];

server = http.createServer(function(req, res){
    var path = url.parse(req.url).pathname;
    switch (path) {
        case '/lib/three.js':
        case '/lib/keyboard.js':
        case '/basic_map/js/Detector.js':
        case '/Cube.js':
        case '/basic_map/js/three.min.js':
        case '/basic_map/js/TrackballControls.js':
        case '/basic_map/models/map1/map1.js':
        case '/basic_map/models/map1/Hedges0029_1_S.jpg':
        case '/basic_map/models/map1/TilesPlain0041_2_S.jpg':
        case '/basic_map/models/map1/CardboardPlain0008_1_S.jpg':
        case '/basic_map/models/map1/WoodPlanksPainted0076_25_S.jpg':
        case '/basic_map/models/map1/RooftilesSlate0088_5_S.jpg':
        case '/basic_map/models/map1/MetalFloorsPainted0044_36_S.jpg':
        case '/basic_map/models/map1/RooftilesMetal0018_15_S.jpg':
        case '/basic_map/models/map1/ConcreteFence0028_1_S.jpg':
        case '/basic_map/models/map1/RooftilesSlate0054_3_S.jpg':
        case '/basic_map/models/map1/BricksSmallOld0080_5_S.jpg':
        case '/basic_map/models/map1/RooftilesMetal0049_15_S.jpg':
        case '/basic_map/models/map1/FloorsRegular0181_1_S.jpg':
        case '/basic_map/models/map1/WoodRough0089_19_S.jpg':
        case '/basic_map/models/map1/ConcreteFence0028_1_S.jpg':
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

    client.score = 0;
    client.send({score: client.score});

    client.room = 'room' + (Math.floor(client.id/2)).toString();
    client.send({room: client.room});

    client.send({'humans': humans});

    // var otherid = flip(client.id);

    client.on('message',function(message) {
        var otherid = flip(client.id);
        console.log(JSON.stringify(players[client.id].id) + ' in message');
        if('zombie' in message && players[otherid] !== null) {
            console.log('zombie in room ' + client.room + JSON.stringify(message));

            players[otherid].send({'newPosition': message});
        } else if('slayer' in message){
            console.log(JSON.stringify(players[client.id].id) + 'in message');

            // if(client.id%2 === 1) {
            console.log('slayer in room ' + client.room + JSON.stringify(message));
            players[otherid].send({'newPosition': message});
            // } else if(client.id%) {
            //     console.log('slayer in room ' + client.room + JSON.stringify(message));
            //     players[otherid].send({'newPosition': message});
            // }
        }
                if('zombieWin' in message) {
            console.log('zombieWin!!!');
            players[client.id].id = flip(client.id);
            players[players[client.id].id].id = flip(players[players[client.id].id].id);
            client.turn = 1;
            client.send({turn: client.turn, id: players[client.id].id});
            players[players[client.id].id].send({turn: 1, id: players[players[client.id].id].id});
        }
        if('slayerWin' in message) {
            console.log('slayerWin!!');
            players[client.id].id = flip(client.id);
            players[players[client.id].id].id = flip(players[players[client.id].id].id);
            client.turn = 1;
            client.send({turn: client.turn, id: players[client.id].id});
            players[players[client.id].id].send({turn: 1, id: players[players[client.id].id].id});
            // client.id = flip(client.id); 
            // console.log('after flip id:' + client.id);
            // players[client.id].id = flip(players[client.id].id);
            // client.turn = 1;
            // client.send({turn: client.turn, id: client.id});
            // players[client.id].send({turn: 1, id: players[client.id].id});
        }
                if('score' in message) {
            client.score += message.score;
            console.log('client ' + client.id + 'score is ' + client.score);
        }
        if('humanHit' in message) {
            console.log(humans[message.humanHit] + 'hit');
            players[client.id+1].send({'humanTurned': message});
            // client.send()
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
function flip(oldid) {
    if (oldid%2 === 0) { // change to fit new id numbering scheme
        return oldid+1; 
    } else {
        return oldid-1; 
    }
}