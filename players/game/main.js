var Main = {};

window.onload = funtion() {
	var container = document.createElement('div');
	document.body.appendChild(container);


	var game = new Main.game(container);
	game.loadContent();
};