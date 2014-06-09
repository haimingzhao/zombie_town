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
				if(inRange()) {
					console.log('zombie turned slayer');
					socket.send({'zombieWin': [clientid]});
				}

			} else {
				slayer.position.x = obj.newPosition.slayer[0].x;
				slayer.position.y = obj.newPosition.slayer[0].y;
				if(inRange()) {
					console.log('slayer killed zombie');
					socket.send({'slayerWin': [clientid]});
				}
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
	      }
        }
        if(Key.isDown(Key.W)) {
        	 keyPressed = 'W';
        	if(!inSolidRange(keyPressed)){
	        	zombie.position.y += 0.1;
	        	// camera.position.y += 0.1;
	        	socket.send({'zombie': [zombie.position]});
	    	}
        }
        if(Key.isDown(Key.S)) {
        	keyPressed = 'S';
        	if(!inSolidRange(keyPressed)){
		        zombie.position.y -= 0.1;
		        // camera.position.y -= 0.1;
		        socket.send({'zombie': [zombie.position]});
	    	}
        }
        if(Key.isDown(Key.D)) {
        	keyPressed = 'D';
        	if(!inSolidRange(keyPressed)) {
		        zombie.position.x += 0.1;
		        // camera.position.x += 0.1;
		        socket.send({'zombie': [zombie.position]});
	    	}

        }

	} else if(clientid%2 === 1) {     	
	    if(Key.isDown(Key.A)) {
			console.log('client id = 1');
			slayer.position.x -= 0.1;
			// camera.position.x -= 0.1;
			socket.send({'slayer': [slayer.position]});
			console.log(slayer.position);
		}
		if(Key.isDown(Key.W)) {
		    slayer.position.y += 0.1;
		    // camera.position.y += 0.1;
		    socket.send({'slayer': [slayer.position]});
		    }
		if(Key.isDown(Key.S)) {
		    slayer.position.y -= 0.1;
		    // camera.position.y -= 0.1;
		    socket.send({'slayer': [slayer.position]});
		}
		if(Key.isDown(Key.D)) {
		    slayer.position.x += 0.1;
		    // camera.position.x += 0.1;
		    socket.send({'slayer': [slayer.position]});
		}
	}
};

function inRange() {
	var isInRange = false,
		slayerPosX = slayer.position.x,
		slayerPosY = slayer.position.y,
		zombiePosX = zombie.position.x,
		zombiePosY = zombie.position.y;
	if(clientid%2 === 0) {
		if(
			((zombiePosX < slayerPosX + 1) && (zombiePosY < slayerPosY + 1)) 
			&& ((zombiePosX < slayerPosX + 1) && (zombiePosY > slayerPosY - 1))
			&& ((zombiePosX > slayerPosX - 1) && (zombiePosY > slayerPosY - 1)) 
			&& ((zombiePosX > slayerPosX - 1) && (zombiePosY < slayerPosY + 1))
			) {
			isInRange = true;
		}
	} else if(clientid%2 === 1) {
		if((
			(slayerPosX < zombiePosX + 1) && (slayerPosY < zombiePosY + 1)) 
			&& ((slayerPosX < zombiePosX + 1) && (slayerPosY > zombiePosY - 1))
			&& ((slayerPosX > zombiePosX - 1) && (slayerPosY > zombiePosY - 1)) 
			&& ((slayerPosX > zombiePosX - 1) && (slayerPosY < zombiePosY + 1))
			) {
			isInRange = true;
		}
	}
	return isInRange;
};

function inSolidRange(keyPressed) {
	var isInRange = false,
		slayerPosX = slayer.position.x,
		slayerPosY = slayer.position.y,
		zombiePosX = zombie.position.x,
		zombiePosY = zombie.position.y;

	if(clientid%2 === 0) {
		var newZombiePos = zombie.position; 
		switch(keyPressed) {
			// case 'A': return (((zombiePosX < slayerPosX - 0.75) && (zombiePosY < slayerPosY + 0.75)) 
			// 					&& ((zombiePosX < slayerPosX - 0.75) && (zombiePosY > slayerPosY - 0.75))
			// 					&& ((zombiePosX < slayerPosX + 0.75) && (zombiePosY > slayerPosY - 0.75))
			// 					&& ((zombiePosX < slayerPosX + 0.75) && (zombiePosY < slayerPosY + 0.75)));
			// case 'D': return (((slayerPosX < zombiePosX - 0.75) && (zombiePosY < slayerPosY + 0.75)) 
			// 					&& ((slayerPosX < zombiePosX - 0.75) && (zombiePosY > slayerPosY - 0.75))
			// 					&& ((slayerPosX < zombiePosX + 0.75) && (zombiePosY > slayerPosY - 0.75))
			// 					&& ((slayerPosX < zombiePosX + 0.75) && (zombiePosY < slayerPosY + 0.75)));
			case 'W' : 	newZombiePos.y = zombie.position.y + 0.1; 
							return inViolation(newZombiePos, slayer.position, 'W');
			case 'S' : 	newZombiePos.y = zombie.position.y - 0.1; 
							return inViolation(newZombiePos, slayer.position, 'S');
			case 'A' : 	newZombiePos.x = zombie.position.x - 0.1; 
							return inViolation(newZombiePos, slayer.position, 'A');
			case 'D' :	newZombiePos.x = zombie.position.x + 0.1; 
							return inViolation(newZombiePos, slayer.position, 'D');
			// case 'D': return (((zombiePosX > slayerPosX - 0.75) && (zombiePosY < slayerPosY + 0.75)) 
			// 					&& ((zombiePosX > slayerPosX - 0.75) && (zombiePosY > slayerPosY - 0.75))
			// 					&& ((zombiePosX > slayerPosX + 0.75) && (zombiePosY > slayerPosY - 0.75))
			// 					&& (( zombiePosX > slayerPosX + 0.75) && (zombiePosY < slayerPosY + 0.75)));
		}
	}
		// if(
		// 	((zombiePosX < slayerPosX + 0.5) && (zombiePosY < slayerPosY + 0.5)) 
		// 	&& ((zombiePosX < slayerPosX + 0.5) && (zombiePosY > slayerPosY - 0.5))
		// 	&& ((zombiePosX > slayerPosX - 0.5) && (zombiePosY > slayerPosY - 0.5)) 
		// 	&& ((zombiePosX > slayerPosX - 0.5) && (zombiePosY < slayerPosY + 0.5))
		// 	) {
		// 	isInRange = true;
		// }
	// } else if(clientid%2 === 1) {
	// 	if((
	// 		(slayerPosX < zombiePosX + 0.5) && (slayerPosY < zombiePosY + 0.5)) 
	// 		&& ((slayerPosX < zombiePosX + 0.5) && (slayerPosY > zombiePosY - 0.5))
	// 		&& ((slayerPosX > zombiePosX - 0.5) && (slayerPosY > zombiePosY - 0.5)) 
	// 		&& ((slayerPosX > zombiePosX - 0.5) && (slayerPosY < zombiePosY + 0.5))
	// 		) {
	// 		isInRange = true;
	// 	}
	// }
	// return isInRange;
};

function inViolation(newZombiePos, slayerPos, dir) {
	if (((dir === 'A') || (dir === 'D')) && 
		(newZombiePos.x < slayerPos.x + 1) && (newZombiePos.x > slayerPos.x - 1) && 
		(newZombiePos.y < slayerPos.y + 1) && (newZombiePos.y > slayerPos.y - 1)) {

		if (dir === 'A') {
			newZombiePos.x += 0.1;
		} else {
			newZombiePos.x -= 0.1; 
		}

		console.log("Violating in X domain.\n");
		return true;
	} else if (((dir === 'W') || (dir === 'S')) && 
		(newZombiePos.y < slayerPos.y + 1) && (newZombiePos.y > slayerPos.y - 1) && 
		(newZombiePos.x < slayerPos.x + 1) && (newZombiePos.x > slayerPos.x - 1)) {

		if (dir === 'S') {
			newZombiePos.y += 0.1;
		} else {
			newZombiePos.y -= 0.1; 
		}

		console.log("Violating in Y domain.\n");
		return true; 
	} else {
		console.log("Not violating.\n"); 
		return false; 
	}
}