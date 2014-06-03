var Player = function(spawnX, spawnY) {
	var x = spawnX,
		y = spawnY;

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

	var update = function() {
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

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY
	};
};

exports.Player = Player;