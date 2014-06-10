var scene, 
	camera,
	renderer,
	zombie,
	slayer,
	clientid,
	room,
	keyPressed; 

var socket = io.connect();

function init () {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	var geometry = new THREE.CubeGeometry(1,1,1);
	var material = new THREE.MeshBasicMaterial({color: 0x458B00});
	zombie = new THREE.Mesh(geometry, material);
	scene.add(zombie);

	var geometry = new THREE.CubeGeometry(1,1,1);
	var material = new THREE.MeshBasicMaterial({color: 0xffb4d9});
	slayer = new THREE.Mesh(geometry, material);
	slayer.position.x = 3;
	slayer.position.y = 1;
	scene.add(slayer);

	camera.position.z = 5;

	var render = function () {
		requestAnimationFrame(render);
		renderer.render(scene, camera);

		movement();

	}

	render();
};

$(document).ready(function() {
	init();

	socket.on('connect', function() {
		console.log('connect');
	});

	socket.on('message', function(obj) {
		console.log(obj);
		console.log('in message');

		if('room' in obj) {
			console.log('we are in room ' + obj.room);
			room = obj.room;
		}
		if('newPosition' in obj) {
			if (clientid === 0) {
				console.log('We are the zombie.\n'); 
			} else {
				console.log('We are the slayer.\n'); 
			}

			if ('zombie' in obj.newPosition) {
				zombie.position.x = obj.newPosition.zombie[0].x;
				zombie.position.y = obj.newPosition.zombie[0].y;
			} else {
				slayer.position.x = obj.newPosition.slayer[0].x;
				slayer.position.y = obj.newPosition.slayer[0].y;
			}
		}
		if('id' in obj) {
			console.log('in id with ' + JSON.stringify(obj.id));
			clientid = obj.id; 
			console.log('after assignment ' + JSON.stringify(clientid));
		}
		if('playerDisconnect' in obj) {
			console.log(obj.playerDisconnect + 'disconnected');
			if(obj.playerDisconnect%2 === 0) {
				scene.remove(zombie);
			} else {
				scene.remove(slayer);
			}
		}
	});
});

function movement() {
	if (clientid%2 === 0) {  	
        if(Key.isDown(Key.A)) {
        	keyPressed = 'A';
        	if(!inSolidRange(keyPressed)){
        	// if((slayer.position.x + 0.5 < zombie.position.x) && (slayer.position.y)) {
        		// if(!inSolidRange()) {
		      	console.log('client id = 0');	
		      	zombie.position.x -= 0.1;
		      	// camera.position.x -= 0.1;
		      	socket.send({'zombie': [zombie.position]});
		      	console.log(zombie.position);
	      } else {
	    		socket.send({'zombieWin': [clientid]});
	    	}
        }
        if(Key.isDown(Key.W)) {
        	 keyPressed = 'W';
        	if(!inSolidRange(keyPressed)){
	        	zombie.position.y += 0.1;
	        	// camera.position.y += 0.1;
	        	socket.send({'zombie': [zombie.position]});
	    	} else {
	    		socket.send({'zombieWin': [clientid]});
	    	}
        }
        if(Key.isDown(Key.S)) {
        	keyPressed = 'S';
        	if(!inSolidRange(keyPressed)){
		        zombie.position.y -= 0.1;
		        // camera.position.y -= 0.1;
		        socket.send({'zombie': [zombie.position]});
	    	} else {
	    		socket.send({'zombieWin': [clientid]});
	    	}
        }
        if(Key.isDown(Key.D)) {
        	keyPressed = 'D';
        	if(!inSolidRange(keyPressed)) {
		        zombie.position.x += 0.1;
		        // camera.position.x += 0.1;
		        socket.send({'zombie': [zombie.position]});
	    	} else {
	    		socket.send({'zombieWin': [clientid]});
	    	}

        }

	} else if(clientid%2 === 1) {     	
	    if(Key.isDown(Key.A)) {
	    	keyPressed = 'A';
        	if(!inSolidRange(keyPressed)){
			console.log('client id = 1');
			slayer.position.x -= 0.1;
			// camera.position.x -= 0.1;
			socket.send({'slayer': [slayer.position]});
			console.log(slayer.position);
			} else {
	    		socket.send({'slayerWin': [clientid]});
	    	}
		}
		if(Key.isDown(Key.W)) {
			keyPressed = 'W';
        	if(!inSolidRange(keyPressed)){
		    slayer.position.y += 0.1;
		    // camera.position.y += 0.1;
		    socket.send({'slayer': [slayer.position]});
		    } else {
	    		socket.send({'slayerWin': [clientid]});
	    	}
		}
		if(Key.isDown(Key.S)) {
			keyPressed = 'S';
        	if(!inSolidRange(keyPressed)){
		    slayer.position.y -= 0.1;
		    // camera.position.y -= 0.1;
		    socket.send({'slayer': [slayer.position]});
		} else {
	    		socket.send({'slayerWin': [clientid]});
	    	}
		}
		if(Key.isDown(Key.D)) {
			keyPressed = 'D';
        	if(!inSolidRange(keyPressed)){
		    slayer.position.x += 0.1;
		    // camera.position.x += 0.1;
		    socket.send({'slayer': [slayer.position]});
		} else {
	    		socket.send({'slayerWin': [clientid]});
	    	}
		}
	}
};

function inSolidRange(keyPressed) {
	var slayerPosX = slayer.position.x,
		slayerPosY = slayer.position.y,
		zombiePosX = zombie.position.x,
		zombiePosY = zombie.position.y;

	if(clientid%2 === 0) {
		switch(keyPressed) {
			case 'W' : return inViolation(zombiePosX, zombiePosY + 0.1, slayer.position, 'W');
			case 'S' : return inViolation(zombiePosX,  zombiePosY - 0.1, slayer.position, 'S');
			case 'A' : return inViolation(zombiePosX - 0.1,  zombiePosY, slayer.position, 'A');
			case 'D' : return inViolation(zombiePosX + 0.1,  zombiePosY, slayer.position, 'D');
		}
	} else if(clientid%2 === 1) {
		switch(keyPressed) {
			case 'W' : return inViolation(slayerPosX, slayerPosY + 0.1, zombie.position, 'W');
			case 'S' : return inViolation(slayerPosX,  slayerPosY - 0.1, zombie.position, 'S');
			case 'A' : return inViolation(slayerPosX - 0.1,  slayerPosY, zombie.position, 'A');
			case 'D' : return inViolation(slayerPosX + 0.1,  slayerPosY, zombie.position, 'D');
		}
	}
};

function inViolation(newPlayerX, newPlayerY, opponentPos, dir) {
	if (((dir === 'A') || (dir === 'D')) && 
		(newPlayerX < opponentPos.x + 1) && (newPlayerX > opponentPos.x - 1) && 
		(newPlayerY < opponentPos.y + 1) && (newPlayerY > opponentPos.y - 1)) {
		console.log("Violating in X domain.\n");
		return true;

	} else if (((dir === 'W') || (dir === 'S')) && 
		(newPlayerY < opponentPos.y + 1) && (newPlayerY > opponentPos.y - 1) && 
		(newPlayerX < opponentPos.x + 1) && (newPlayerX > opponentPos.x - 1)) {
		console.log("Violating in Y domain.\n");
		return true; 
	} else {
		console.log("Not violating.\n"); 
		return false; 
	}
}