var express = require('express');
var app = express();
// var http = require('http').Server(app);
var socket = require('socket.io');
var url = require('url');
var http = require('http');

var temp_server;

var players = [],
    humans = ['h1'/*, 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10'*/],
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

app.configure(function() {
    app.use(express.static(__dirname + '/'));
});

var server = app.listen(3000);
var io = socket.listen(server);

    io.sockets.on('connection', function(client) {

    //competitive mode

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

    client.gameType = competitive;

    client.score = 0;
    client.send({score: client.score});

    client.room = 'room' + (Math.floor(client.id/2)).toString();
    client.send({room: client.room});

    console.log('competitive humans');
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
            console.log('zombie is at' + posOne + 'slayer is at ' + posTwo);
            client.send({type: players[client.id].type, 'respawn': posOne, 'slayerRespawn': posTwo});
            players[otherplayerid].send({type: players[otherplayerid].type, 'respawn': posOne, 'slayerRespawn': posTwo}); 
        }
        if('slayerWin' in message) {
            console.log('slayerWin!!');

            players[client.id].type = players[client.id].type === 'z' ? 's' : 'z'; 
            players[otherplayerid].type = players[otherplayerid].type === 'z' ? 's' : 'z'; 
            var posOne = respawn();
            var posTwo = respawn();
            console.log('zombie is at' + posOne + 'slayer is at ' + posTwo);
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

    // if(colaborative) {
    console.log('colaborative');

    // players.push(client);

    // if(players.length%2 === 0) {
    //     players[players.length-1].type = 'z1'; 
    // } else {
    //     players[players.length-1].type = 'z2'; 
    // }

    // players[players.length-1].id = players.length-1; 
    // console.log(JSON.stringify(players[players.length-1].type));

    // client.send({'type': client.type});
    // console.log({'type': client.type});

    // client.score = 0;
    // client.send({score: client.score});

    // client.gameType = competitive;

    // client.room = 'room' + (Math.floor(client.id/2)).toString();
    // client.send({room: client.room});

    // console.log('colaborative humans');
    // client.send({'humans': humans});

    client.on('message',function(message) {
        var otherplayerid = client.id % 2 === 0 ? client.id+1 : client.id-1;  
        console.log(JSON.stringify(otherplayerid)); 

        //Send movements to other player
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
        
        if('zombieWinCol' in message) {
            console.log('zombieWin!!!');
            players[otherplayerid].send({'remove': client.type}); 
            //LOOSE - send message to remove from map 
        }
        if('slayerWin' in message) {
            console.log('slayerWin!!');
            players[otherplayerid].send({'remove': client.type}); 
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

    // }
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