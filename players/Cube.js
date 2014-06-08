var scene, 
	camera,
	renderer,
	zombie,
	slayer,
	clientid,
	room; 

var socket = io.connect();

function init () {
			// socket.on('connected', function() {

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

			// var geometry = new THREE.CubeGeometry(1,1,1);
			// var material = new THREE.MeshBasicMaterial({color: 0xffb4d9});
			// var slayer = new THREE.Mesh(geometry, material);
			// scene.add(slayer);

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
		// console.log('***' + JSON.stringify(obj));
		if('newPosition' in obj) {
			// console.log('newPosition ' + JSON.stringify(obj));
			// console.log('x =' + JSON.stringify(obj.newPosition.zombie[0].x));

			if (clientid === 0) {
				console.log('We are the zombie.\n'); 
			} else {
				console.log('We are the slayer.\n'); 
			}

			var newx;
			var newy; 

			// if('cur_room' in obj) {
			// 	console.log(obj.cur_room);
			// 	if(obj.cur_room === room) {

			if ('zombie' in obj.newPosition) {
				zombie.position.x = obj.newPosition.zombie[0].x;
				zombie.position.y = obj.newPosition.zombie[0].y;
				// newx = obj.newPosition.zombie[0].x;
				// newy = obj.newPosition.zombie[0].y; 
				// zombie.position.x = newx;
				// zombie.position.y = newy; 
			} else {
				slayer.position.x = obj.newPosition.slayer[0].x;
				slayer.position.y = obj.newPosition.slayer[0].y;
				// newx = obj.newPosition.slayer[0].x;
				// newy = obj.newPosition.slayer[0].y; 
				// slayer.position.x = newx;
				// slayer.position.y = newy;
			}


			// 	}
			// }

			// if ('zombie' in obj.newPosition) {
			// 	zombie.position.x = obj.newPosition.zombie[0].x;
			// 	zombie.position.y = obj.newPosition.zombie[0].y;
			// 	// newx = obj.newPosition.zombie[0].x;
			// 	// newy = obj.newPosition.zombie[0].y; 
			// 	// zombie.position.x = newx;
			// 	// zombie.position.y = newy; 
			// } else {
			// 	slayer.position.x = obj.newPosition.slayer[0].x;
			// 	slayer.position.y = obj.newPosition.slayer[0].y;
			// 	// newx = obj.newPosition.slayer[0].x;
			// 	// newy = obj.newPosition.slayer[0].y; 
			// 	// slayer.position.x = newx;
			// 	// slayer.position.y = newy;
			// }


			// var newz...

			// if (clientid === 0) /* we are the zombie */ {
			// 	slayer.position.x = newx; 
			// 	slayer.position.y = newy; 
			// 	console.log('We have just updated the slayer position.\n'); 
			// } else { /* we are the slayer */
			// 	zombie.position.x = newx;
			// 	zombie.position.y = newy; 
			// 	console.log('We have just updated the zombie position.\n'); 
			// }
		}
		// if('A_Zombie' in message) {
		// 	// console.log('returned ' + message);
		// }
		if('id' in obj) {
			console.log('in id with ' + JSON.stringify(obj.id));
			// Setting the client id. ID == 0 -> zombie. ID == 1 -> slayer. 
			clientid = obj.id; 
			console.log('after assignment ' + JSON.stringify(clientid));

			// this.clientid = obj.id[0];
		}
	});
});

	function movement() {
		if (clientid%2 === 0) {  	
		      if(Key.isDown(Key.A)) {
		      	console.log('client id = 0');
		      	zombie.position.x -= 0.1;
		      	// camera.position.x -= 0.1;
		      	socket.send({'zombie': [zombie.position]});
		      	console.log(zombie.position);
		      }
		      if(Key.isDown(Key.W)) {
		        zombie.position.y += 0.1;
		        // camera.position.y += 0.1;
		        socket.send({'zombie': [zombie.position]});
		      }
		      if(Key.isDown(Key.S)) {
		        zombie.position.y -= 0.1;
		        // camera.position.y -= 0.1;
		        socket.send({'zombie': [zombie.position]});
		      }
		      if(Key.isDown(Key.D)) {
		        zombie.position.x += 0.1;
		        // camera.position.x += 0.1;
		        socket.send({'zombie': [zombie.position]});
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