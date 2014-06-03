var socket = io.connect();
			  // var $usernameInput = $('.usernameInput');

			// socket.emit('username', function(data) {

			// })

			socket.on('player_joined', function() {

			var scene = new THREE.Scene();
			var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

			var renderer = new THREE.WebGLRenderer();
			renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild(renderer.domElement);

			var geometry = new THREE.CubeGeometry(1,1,1);
			var material = new THREE.MeshBasicMaterial({color: 0x1975FF});
			var cube = new THREE.Mesh(geometry, material);
			scene.add(cube);

			camera.position.z = 5;

			var cubeX = 1, cubeY = 1;

			socket.emit('joined');

			var render = function () {
				requestAnimationFrame(render);

				cube.rotation.x += 0.1;
				cube.rotation.y += 0.1;

				renderer.render(scene, camera);

				movement();
			}

		    function movement() {
		      if(Key.isDown(Key.A)) {
		      	cube.position.x -= 0.1;
		      }
		      if(Key.isDown(Key.W)) {
		        cube.position.y += 0.1;
		      }
		      if(Key.isDown(Key.S)) {
		        cube.position.y -= 0.1;
		      }
		      if(Key.isDown(Key.D)) {
		        cube.position.x += 0.1;
		      }
		    }

			render();

		});