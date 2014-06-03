var socket = io.connect();

function init () {

			socket.on('connected', function() {

			var scene = new THREE.Scene();
			var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

			var renderer = new THREE.WebGLRenderer();
			renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild(renderer.domElement);

			var geometry = new THREE.CubeGeometry(1,1,1);
			var material = new THREE.MeshBasicMaterial({color: 0x458B00});
			var zombie = new THREE.Mesh(geometry, material);
			scene.add(zombie);

			var geometry = new THREE.CubeGeometry(1,1,1);
			var material = new THREE.MeshBasicMaterial({color: 0xffb4d9});
			var slayer = new THREE.Mesh(geometry, material);
			scene.add(slayer);

			camera.position.z = 5;

			var cubeX = 1, cubeY = 1;

			var render = function () {
				requestAnimationFrame(render);

				// socket.broadcast('slayer', function() {
					slayer.position.x = 2;
					slayer.position.y = 2;
					slayer.rotation.x += 0.1;
					slayer.rotation.y += 0.1;
				// });

				// socket.emit('zombie', function() {
	 				zombie.rotation.x += 0.1;
					zombie.rotation.y += 0.1;
				// });

				renderer.render(scene, camera);

				movement();
			}

		    function movement() {
		      if(Key.isDown(Key.A)) {
		      	zombie.position.x -= 0.1;
		      	camera.position.x -= 0.1;
		      }
		      if(Key.isDown(Key.W)) {
		        zombie.position.y += 0.1;
		        camera.position.y += 0.1;
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
		      setInterval(client_move(), 1000/60);

		    }

			render();

			function client_move() {
				var msg = new Message(zombie.position);
				socket.send(msg);
			}

		});

};
// init();