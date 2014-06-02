// <!--<!DOCTYPE HTML>
// <html>
// 	<head>
// 		<title>My first Three.js app</title>
// 		<style>canvas { width: 100%; height: 100% }</style>
// 	</head>
// 	<body>
// 		<script src="js/three.min.js"></script>
// 		<script src="js/kb.js"></script>
// 		<script> -->

			var socket = io.connect();

			socket.on('player joined', function() {

				var scene = new THREE.Scene();
			// <!-- PerspectiveCamera(field_of_view, aspect_ratio, near, far) -->
			var camera = new THREE.PerspectiveCamera(75, 1000/1000, 0.1, 1000);

			var renderer = new THREE.WebGLRenderer();
			renderer.setSize(1000, 1000);
			document.body.appendChild(renderer.domElement);

			var geometry = new THREE.CubeGeometry(1,1,1);
			var material = new THREE.MeshBasicMaterial({color: 0x1975FF});
			var cube = new THREE.Mesh(geometry, material);
			scene.add(cube);

			camera.position.z = 5;

			var cubeX = 1, cubeY = 1;

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
			
// <!--		</script>
// 	</body>
// </html> -->
