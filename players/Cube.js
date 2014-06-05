var scene, 
	camera,
	renderer,
	zombie,
	slayer;
var x, y;

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

			// var geometry = new THREE.CubeGeometry(1,1,1);
			// var material = new THREE.MeshBasicMaterial({color: 0xffb4d9});
			// var slayer = new THREE.Mesh(geometry, material);
			// scene.add(slayer);

			camera.position.z = 5;

			var render = function () {
				requestAnimationFrame(render);

				// socket.broadcast('slayer', function() {
					// slayer.position.x = 2;
					// slayer.position.y = 2;
					// slayer.rotation.x += 0.1;
					// slayer.rotation.y += 0.1;
				// });

				// socket.emit('zombie', function() {
	 			// 	zombie.rotation.x += 0.1;
					// zombie.rotation.y += 0.1;
				// });

				renderer.render(scene, camera);

				movement();

			}

		    // socket.on('zombie', function movement() {
		    // });

			render();

		// });

};

$(document).ready(function() {
	init();

	socket.on('connect', function() {
		console.log('connect');
	});

	var geometry = new THREE.CubeGeometry(1,1,1);
	var material = new THREE.MeshBasicMaterial({color: 0xffb4d9});
	var slayer = new THREE.Mesh(geometry, material);
	slayer.position.x = 3;
	slayer.position.y = 1;
	scene.add(slayer);

	socket.on('message', function(message) {
		console.log(JSON.stringify(message));
		if('zombieReturn' in message) {
			console.log(JSON.stringify(message));
		}
		// if('A_Zombie' in message) {
		// 	// console.log('returned ' + message);
		// }
		// if('id' in message) {
		// 	console.log(message);
		// } else {
		// 	// console.log(obj.session.id);
		// }
	});

	socket.on('zombieReturn', function(message) {
		console.log('zombieReturn');
	});
});

		    	function movement() {
		      if(Key.isDown(Key.A)) {
		      	zombie.position.x -= 0.1;
		      	camera.position.x -= 0.1;
		      	socket.send({'A_Zombie': [zombie.position]});
		      	console.log(zombie.position);
		      }
		      if(Key.isDown(Key.W)) {
		        zombie.position.y += 0.1;
		        camera.position.y += 0.1;
		        socket.send({'A_Zombie': [zombie.position]});
		      }
		      if(Key.isDown(Key.S)) {
		        zombie.position.y -= 0.1;
		        camera.position.y -= 0.1;
		      }
		      if(Key.isDown(Key.D)) {
		        zombie.position.x += 0.1;
		        camera.position.x += 0.1;
		      }

		      // client_move();
		      // setInterval(update(), 1000);
		      };
// socket.on('message', function(obj) {

// });

			// socket.on('message', function (obj) {
			// 	if('zombie' in message) {
			// 	zombie.position.x = x;
			// 	zombie.position.y = y;
			// 	}
			// });

			// function update() {
			// 	var msg = new Message(zombie.position);
			// 	socket.send(msg);
			// };

			// function Message(position) {
			// 	// zombie.position.x = x;
			// 	// zombie.position.y = y;
			// 	return zombie;
			// };

			// // socket.on('message', function(obj) {

			// // });

			// setInterval(update(), 1000/60);
