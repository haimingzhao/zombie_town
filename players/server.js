var express = require('express');
var app = express();
var socket = require('socket.io');

var players = [],
    rooms = [],
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
    single = false,
    allPlayers = 0;

app.configure(function() {
    app.use(express.static(__dirname + '/'));
});

var server = app.listen(3000);
var io = socket.listen(server);

    io.sockets.on('connection', function(client) {

    client.on('addUser', function() {
        console.log('addUser');
        client.id = players.length;
        client.send({id: client.id});
    players.push(client);

    if(players.length%2 === 0) {
        players[players.length-1].type = 's'; 
    } else {
        players[players.length-1].type = 'z'; 
    }

    players[players.length-1].id = players.length-1; 
    // console.log(JSON.stringify(players[players.length-1].type));
    // console.log(players);

    client.send({'type': client.type});
    console.log({'type': client.type});

    client.score = 0;
    client.send({score: client.score});

    client.room = 'room' + (Math.floor(client.id/2)).toString();
    rooms.push(client.room);
    client.send({room: client.room});
    });

    client.status = -1;

//**************************************************************************************************************

    //competitive mode
    client.on('message',function(message) {
        var otherplayerid = client.id % 2 === 0 ? client.id+1 : client.id-1;  

        if('comp' in message) {
            allPlayers++;
            if(allPlayers%2 === 0 && allPlayers > 0) {
                client.send({'ready': client.type});
                players[otherplayerid].send({'ready': client.type});
            }
        }

        if('zombie' in message) {
            console.log('zombie in room ' + client.room + JSON.stringify(message));

            players[otherplayerid].send({'newPosition': message});
        } else if('slayer' in message){
            console.log('slayer in room ' + client.room + JSON.stringify(message));
            players[otherplayerid].send({'newPosition': message});
        }
        
        if('switch' in message) {
            console.log('switch!!!');

            players[client.id].type = players[client.id].type === 'z' ? 's' : 'z'; 
            players[otherplayerid].type = players[otherplayerid].type === 'z' ? 's' : 'z';
            var posOne = respawn();
            var posTwo = respawn();
            console.log('zombie is at' + posOne + 'slayer is at ' + posTwo);
            client.send({type: players[client.id].type, 'respawn': posOne, 'slayerRespawn': posTwo});
            players[otherplayerid].send({type: players[otherplayerid].type, 'respawn': posOne, 'slayerRespawn': posTwo}); 
        }
        
        if('scoreComp' in message) {
            client.score = message.scoreComp;
            console.log('client ' + client.id + 'score is ' + client.score);
            players[otherplayerid].send({'otherScore': message.scoreComp}); 
        }
        if('humanHit' in message) {
            console.log(humans[message.humanHit] + 'hit');
            players[otherplayerid].send({'humanTurned': message.humanHit});
        }
    });

//**************************************************************************************************************

    //Collaborative mode
    client.on('message',function(message) {
        var otherplayerid = client.id % 2 === 0 ? client.id+1 : client.id-1;  

        if('collab' in message) {
            allPlayers++;
            if(players.length%2 === 0) {
                client.send({'ready': client.type});
                players[otherplayerid].send({'ready': client.type});
            }
        }

        if('loadHumans' in message) {
            console.log('loadHumans');
            var i;
            for(i = 0; i < humans.length; i++) {
                var humanPos = spawnHuman();
                client.send({'humanPos': humanPos, 'humanIndex': i, 'humanName': humans[i]});
                players[otherplayerid].send({'humanPos': humanPos, 'humanIndex': i, 'humanName': humans[i]});
            }  
        }

        //Send movements to other player
        if('zombieOne' in message) {
            console.log('zombie in room ' + client.room + JSON.stringify(message));
            players[otherplayerid].send({'newPosition': message});
        } 
        if('zombieTwo' in message) {
            players[otherplayerid].send({'newPosition': message});
        }
        
        if('gameOverCol' in message) {
            console.log('zombieWin!!!');
            players[otherplayerid].send({'remove': client.type}); 
            if(client.status === 1) {
                console.log('whhhhhy????');
            } else {
                console.log('normal');
            }
            console.log('BEFORE client status is ' + client.status + ' with client id: ' + client.id);
            console.log('BEFORE other client status is ' + players[otherplayerid].status + ' with client id: ' + players[otherplayerid].id);
            client.status = message.gameOverCol;
            if(players[otherplayerid].status === players[otherplayerid].id) {
            console.log('AFTER client status is ' + client.status + ' with client id: ' + client.id);
            console.log('AFTER other client status is ' + players[otherplayerid].status + ' with client id: ' + players[otherplayerid].id);
                // client.send({'menuCol': client.id});
                players[otherplayerid].send({'menuCol': client.id});
            }
        }
        
        //Send cumulative score to both players
        if('scoreCol' in message) {
            client.score += message.scoreCol;
            players[otherplayerid].score = client.score;
            console.log('client ' + client.id + 'score is ' + client.score);
            players[otherplayerid].send({'totalScore': message.scoreCol}); 
        }
        if('humanHit' in message) {
            console.log(humans[message.humanHit] + 'hit');
            players[otherplayerid].send({'humanTurned': message.humanHit});
        }
    });

//**************************************************************************************************************

    //Single Player
    //Don't need to send anything besides logging in high score. Don't need to add to array of players
    //Need to get back score at the end.
    client.on('message', function(message) {
        if('gameOverSingle' in message) {
            console.log('gameOverSingle');
            client.send({'removeSingle': client.id});
        }
        if('scoreSingle' in message) {
            console.log(message);
            client.score = message;
        }
    });

    client.on('single', function() {
            console.log('loadHumans');
            var i;
            for(i = 0; i < humans.length; i++) {
                var humanPos = spawnHuman();
                client.send({'humanPos': humanPos, 'humanIndex': i, 'humanName': humans[i]});
            }  
    });
//**************************************************************************************************************

    client.on('disconnect', function() {
        // var otherplayerid = client.id % 2 === 0 ? client.id+1 : client.id-1; 
        // players.splice(client.id, client.id);
        // console.log(players);
        // if(client.id === 0) {

        //     players[otherplayerid].send({'playerDisconnect': client.id});
        // }
        // if(client.id === 1) {
        //     players[otherplayerid].send({'playerDisconnect': client.id});
        // }
        // players.splice(otherplayerid, otherplayerid);
    });

    function respawn() {
        var respawnPos = spawnPositions[Math.floor((Math.random()*8+1))-1];
        var newX = respawnPos[0]; 
        var newZ = respawnPos[1]; 
        return [newX, newZ];
    }

    function spawnHuman() {
        var initX = Math.floor((Math.random()*290)+1);
        var initZ = Math.floor((Math.random()*290)+1);

        var quadrant = Math.floor((Math.random()*4)+1);
        switch(quadrant) {
            case 1: 
                console.log(initX);
                console.log(initZ);
                return [initX, initZ];
            case 2:
                console.log(-initX);
                console.log(initZ);
                return [-initX, initZ];
            case 3:
                console.log(initX);
                console.log(-initZ);
                return [initX, -initZ];
            case 4:
                console.log(-initX);
                console.log(-initZ);
                return [-initX, -initZ];
        }
    }
});