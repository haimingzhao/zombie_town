var Player = function(initX, initY) {

	var x = initX,
		y = initY,
		id;

	var getX = function() {
		return initX;
	};

	var getY = function() {
		return initY;
	};

	var setX = function(newX) {
		x = newX;
	}

	var setY = function(newY) {
		y = newY;
	}

	return {
		getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        id: id
	};
};

exports.Player = Player;