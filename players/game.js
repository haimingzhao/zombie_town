var scene,			// Canvas DOM element
	camera,
	renderer,		// Canvas rendering context
	keys,			// Keyboard input
	localPlayer;	// Local player

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

			// //draw
			// var geometry = new THREE.CubeGeometry(1,1,1);
			// var material = new THREE.MeshBasicMaterial({color: 0x458B00});
			// var zombie = new THREE.Mesh(geometry, material);
			// scene.add(zombie);

			// camera.position.z = 5;

			// var cubeX = 1, cubeY = 1;

			// var render = function () {
			// 	requestAnimationFrame(render);

			// 	// socket.emit('zombie', function() {
	 	// 			zombie.rotation.x += 0.1;
			// 		zombie.rotation.y += 0.1;
			// 	// });

			// 	renderer.render(scene, camera);
			// };

			// render();
	// scene = new THREE.Scene();
	// renderer = new THREE.WebGLRenderer();
	// renderer.setSize(window.innerWidth, window.innerHeight);
	// document.body.appendChild(renderer.domElement);

	// 		// var geometry = new THREE.CubeGeometry(1,1,1);
	// 		// var material = new THREE.MeshBasicMaterial({color: 0x458B00});
	// 		// var zombie = new THREE.Mesh(geometry, material);
	// 		// scene.add(zombie);

	// 		// camera.position.z = 5;

	// 		// update();
	// 		// render();

	// 		// var render = function() {
	// 		// 	requestAnimationFrame(render);
	// 		// 	renderer.render(scene, camera);
	// 		// }

	keys = new Keys();
	var initX = 0,	
		initY = 0;

	localPlayer = new Player(initX, initY);

	// setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);
};

// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};


/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	// update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	// window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	localPlayer.update(keys);
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Draw the local player
	// localPlayer.render(renderer);
	// 		draw
			var geometry = new THREE.CubeGeometry(1,1,1);
			var material = new THREE.MeshBasicMaterial({color: 0x458B00});
			var zombie = new THREE.Mesh(geometry, material);
			scene.add(zombie);

			camera.position.z = 5;

			var render = function () {
				requestAnimationFrame(render);

				// socket.emit('zombie', function() {
	 				zombie.rotation.x += 0.1;
					zombie.rotation.y += 0.1;
				// });

				renderer.render(scene, camera);
			};

			render();
};