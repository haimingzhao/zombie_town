var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    io = require('socket.io'),
    THREE = require('three');

var server,
    players = [],
    humans = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10'],
    spawnPositions = [[-176, 224], 
                      [-176, 108], 
                      [146, 170],  
                      [164, 180], 
                      [74, 172], 
                      [-42, 126], 
                      [-136, -32], 
                      [106, -32]] ,
    switchingInProgress = false,
    competitive = false,
    colaborative = false,
    single = false;

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
        case '/competitive.html':
            fs.readFile(__dirname + path, function(err, data) {
            if (err) return send404(res, "::err:" + path);
            res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
            res.write(data, 'utf8');
            res.end();
            });
            competitive = true;
            break;
        case '/colaborative.html':
            fs.readFile(__dirname + path, function(err, data) {
            if (err) return send404(res, "::err:" + path);
            res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
            res.write(data, 'utf8');
            res.end();
            });
            colaborative = true;
            break;
        case '/single.html':
            fs.readFile(__dirname + path, function(err, data) {
            if (err) return send404(res, "::err:" + path);
            res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
            res.write(data, 'utf8');
            res.end();
            });
            single = true;
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

    if(competitive) {

    console.log('competitive');

    players.push(client);

    if(players.length%2 === 0) {
        players[players.length-1].type = 's'; 
    } else {
        players[players.length-1].type = 'z'; 
    }

    players[players.length-1].id = players.length-1; 
    console.log(JSON.stringify(players[players.length-1].type));

    client.send({'type': client.type});
    console.log({'type': client.type});

    client.score = 0;
    client.send({score: client.score});

    client.room = 'room' + (Math.floor(client.id/2)).toString();
    client.send({room: client.room});

    client.send({'humans': humans});

    client.on('message',function(message) {
        var otherplayerid = client.id % 2 === 0 ? client.id+1 : client.id-1;  
        console.log(JSON.stringify(otherplayerid)); 

        if('zombie' in message) {
            console.log('zombie in room ' + client.room + JSON.stringify(message));

            players[otherplayerid].send({'newPosition': message});
        } else if('slayer' in message){
            console.log('slayer in room ' + client.room + JSON.stringify(message));
            players[otherplayerid].send({'newPosition': message});
        }
        
        if('zombieWin' in message) {
            console.log('zombieWin!!!');

            players[client.id].type = players[client.id].type === 'z' ? 's' : 'z'; 
            players[otherplayerid].type = players[otherplayerid].type === 'z' ? 's' : 'z';
            var posOne = respawn();
            var posTwo = respawn();
            client.send({type: players[client.id].type, 'respawn': posOne, 'slayerRespawn': posTwo});
            players[otherplayerid].send({type: players[otherplayerid].type, 'respawn': posOne, 'slayerRespawn': posTwo}); 
        }
        if('slayerWin' in message) {
            console.log('slayerWin!!');

            players[client.id].type = players[client.id].type === 'z' ? 's' : 'z'; 
            players[otherplayerid].type = players[otherplayerid].type === 'z' ? 's' : 'z'; 
            var posOne = respawn();
            var posTwo = respawn();
            client.send({type: players[client.id].type, 'zombieRespawn': posOne, 'slayerRespawn': posTwo});
            players[otherplayerid].send({type: players[otherplayerid].type, 'respawn': posOne, 'slayerRespawn': posTwo}); 
        }
        
        if('score' in message) {
            client.score = message.score;
            console.log('client ' + client.id + 'score is ' + client.score);
            players[otherplayerid].send({'otherScore': message.score}); 
        }
        if('humanHit' in message) {
            console.log(humans[message.humanHit] + 'hit');
            players[otherplayerid].send({'humanTurned': message.humanHit});
        }
    });
    } 

    if(colaborative) {
    console.log('colaborative');

    players.push(client);

    if(players.length%2 === 0) {
        players[players.length-1].type = 'z1'; 
    } else {
        players[players.length-1].type = 'z2'; 
    }

    players[players.length-1].id = players.length-1; 
    console.log(JSON.stringify(players[players.length-1].type));

    client.send({'type': client.type});
    console.log({'type': client.type});

    client.score = 0;
    client.send({score: client.score});

    client.room = 'room' + (Math.floor(client.id/2)).toString();
    client.send({room: client.room});

    client.send({'humans': humans});

    client.on('message',function(message) {
        var otherplayerid = client.id % 2 === 0 ? client.id+1 : client.id-1;  
        console.log(JSON.stringify(otherplayerid)); 

        if('zombieOne' in message) {
            console.log('zombie in room ' + client.room + JSON.stringify(message));
            players[otherplayerid].send({'newPosition': message});
        } else if('zombieTwo' in message) {
            players[otherplayerid].send({'newPosition': message});
        }else if('slayer' in message){
            console.log('slayer in room ' + client.room + JSON.stringify(message));
            client.send({'newPosition': message});
            players[otherplayerid].send({'newPosition': message});
        }
        
        if('zombieWin' in message) {
            console.log('zombieWin!!!');
            //LOOSE - send message to remove from map 
        }
        if('slayerWin' in message) {
            console.log('slayerWin!!');
            //LOOSE - send message to remove from map 
        }
        
        //Send cumulative score to both players
        if('score' in message) {
            client.score = message.score;
            console.log('client ' + client.id + 'score is ' + client.score);
            players[otherplayerid].send({'otherScore': message.score}); 
        }
        if('humanHit' in message) {
            console.log(humans[message.humanHit] + 'hit');
            players[otherplayerid].send({'humanTurned': message.humanHit});
        }
    });

    }
    if(single) {

    }

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

    function respawn() {
        var respawnPos = spawnPositions[Math.floor((Math.random()*8+1))-1];
        var newX = respawnPos[0]; 
        var newZ = respawnPos[1]; 
        return [newX, newZ];
    }
});