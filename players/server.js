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

    //     client.on('addUser', function() {
    //         console.log('adduser');
    //         client.id = players.length;
    //         players.push(client);

    //         if(players.length%2 === 0) {
    //             players[players.length-1].type = 's'; 
    //         } else {
    //             players[players.length-1].type = 'z'; 
    //         }

    //         players[players.length-1].id = players.length-1; 
    //         // console.log(JSON.stringify(players[players.length-1].type));

    //         client.send({'type': client.type});
    //         // console.log({'type': client.type});

    //         if(client.id%2 === 0) {
    //             console.log('client id: ' + client.id);
    //             console.log('we are the: ' + client.type);
    //             client.room = 'room' + (Math.floor(client.id/2)).toString();
    //             rooms.push(client.room);
    //             client.join(client.room);
    //         } else {
    //             console.log('client id: ' + client.id);
    //             console.log('we are the: ' + client.type);
    //             client.room = 'room' + (Math.floor(client.id/2)).toString();
    //             client.join(client.room)
    //         }

    //         console.log('we are in room: ' + client.room);
    //         client.join('room' + (Math.floor(client.id/2)).toString());
    //         client.send({room: client.room});

    //         console.log('rooms active: ' + JSON.stringify(rooms));
    //         console.log('players active: ' + players.length);
    // });

    client.on('addUser', function() {
        console.log('addUser');
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

    client.status = 'alive';

    // var i;
    // for(i = 0; i < humans.length; i++) {
    //     console.log(spawnHuman());
    //     humans[i].id = spawnHuman();
    //     console.log(humans[i].id);
    // }
    // client.send({'humans': humans});
    // var otherplayerid = client.id % 2 === 0 ? client.id+1 : client.id-1;  
    // var i;
    // for(i = 0; i < humans.length; i++) {
    //     var humanPos = spawnHuman();
    //     client.send({'humanPos': humanPos, 'humanIndex': i, 'humanName': humans[i]});
    //     players[otherplayerid].send({'humanPos': humanPos, 'humanIndex': i, 'humanName': humans[i]});
    // }

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
        // console.log(JSON.stringify(message));

        // if('zombie' in message) {
        //     console.log('zombie in room ' + client.room + JSON.stringify(message));
        //     io.sockets.in(client.room).emit({'newPosition': message});
        //     console.log('in room: ' + client.room);

        // } else if('slayer' in message){
        //     console.log('slayer in room ' + client.room + JSON.stringify(message));
        //     io.sockets.in(client.room).emit({'newPosition': message});
        //     console.log('in room: ' + client.room);
        // }
        
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
        // console.log(JSON.stringify(otherplayerid)); 

        if('collab' in message) {
            allPlayers++;
            if(allPlayers%2 === 0) {
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

        if('move' in message) {
            players[otherplayerid].send({'readyOther': players[otherplayerid].id});
        }

        //Send movements to other player
        if('zombieOne' in message) {
            console.log('zombie in room ' + client.room + JSON.stringify(message));
            players[otherplayerid].send({'newPosition': message});
        } 
        if('zombieTwo' in message) {
            players[otherplayerid].send({'newPosition': message});
        }
        if('slayerOne' in message) {
            // client.send({'newPositionSlayerOne': message});
            players[otherplayerid].send({'newPositionSlayerOne': message});
        }    
        if('slayerTwo' in message) {
            // client.send({'newPositionSlayerTwo': message});
            players[otherplayerid].send({'newPositionSlayerTwo': message});
        }
        
        if('gameOverCol' in message) {
            console.log('zombieWin!!!');
            players[otherplayerid].send({'remove': client.type}); 
            client.status = 'dead';
            if(players[otherplayerid].status == 'dead') {
                client.send('menuCol');
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
        var otherplayerid = client.id % 2 === 0 ? client.id+1 : client.id-1; 
        players.splice(client.id, client.id);
        console.log(players);
        if(client.id === 0) {
            players[otherplayerid].send({'playerDisconnect': client.id});
        }
        if(client.id === 1) {
            players[otherplayerid].send({'playerDisconnect': client.id});
        }
        players.splice(otherplayerid, otherplayerid);
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
        // return [initX, initZ];
    }
});