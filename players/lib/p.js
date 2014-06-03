/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		id,
		moveAmount = 2;
	
	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

				 //    function movement() {
				//     if(Key.isDown(Key.A)) {
				//     	socket.emit('move_left', function() {
				//     		mesh.position.x -= 0.1;
				//     	})
				//     }
				//     if(Key.isDown(Key.W)) {
				//         mesh.position.y += 0.1;
				//     }
				//     if(Key.isDown(Key.S)) {
				//         mesh.position.y -= 0.1;
				//     }
				//     if(Key.isDown(Key.D)) {
				//         mesh.position.x += 0.1;
				//     }
				// };

	// Update player position
	var update = function(keys) {
		// Previous position
		var prevX = x,
			prevY = y;

		// Up key takes priority over down
		if (kb.up) {
			y -= moveAmount;
		} else if (kb.down) {
			y += moveAmount;
		};

		// Left key takes priority over right
		if (kb.left) {
			x -= moveAmount;
		} else if (kb.right) {
			x += moveAmount;
		};

		return (prevX != x || prevY != y) ? true : false;
	};

	// Draw player
	var draw = function(ctx) {
		ctx.fillRect(x-5, y-5, 10, 10);
	};

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		update: update,
		draw: draw
	}
};