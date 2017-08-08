/*jshint esversion: 6 */
/*global window, document, console, media*/
var loopUntilPlay = null;

(function () {
	Promise.all([
		$('game/chapters/introduction/readme.txt'),
		$('game/chapters/introduction/menu.js')
	]).then(function (required) {
		const [readme, menu] = required;
		required = undefined;
		inspector.log('%cUse the \'help\' command to see extras', 'font-size: 9px; color: gray');
		var mainLoop = function () {
			console.getInput().then(function (command) {
				if (Object.keys(menu).indexOf(command.toLowerCase()) > -1) {
					menu[command.toLowerCase()].run().catch(() => mainLoop());
				} else {
					console.print('Unknown command').then(() => mainLoop());
				}
			});
		};
		console.type(readme, 1, true, true).then(() => mainLoop());
	});

}());