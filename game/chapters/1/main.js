/*jshint esversion: 6 */
/*global window, document, console, media, resolve, reject, commands*/

(function () {
	console.clear();
	Promise.all([
		$('game/chapters/1/scene_1.htm')
	]).then((required) => {
		var [scene1] = required;
		required = undefined;

		media.playMusic('media/music/dooms.mp3');
		var names = [
			'Scrooge',
			'Bob',
			'Angry-Eyebrows',
			'Chump',
			'Johnny',
			'Buttercup',
			'Clark Kent',
			'Harry Potter',
			'Wuss',
			'John Smith',
			'Janette',
			'Whiner Forty-Niner',
			'Dave',
			'Mickey',
			'Mr Smith',
			'Mr Anderson',
			'Caecilius',
			'My fair lady',
			'Mister',
			'Wimp'
		];
		var name = names[randInt(0, names.length - 1)];
		scene1 = scene1.replace(/\%name\%/g, name);
		inspector.log('name is ' + name);

		console.type(scene1, 0.95, false, false).then(() => {
			console.getInput('What should we do?\n> ').then((input) => {
				console.print('The End.');
				setTimeout(() => reject(), 2500);
			});
		});

	})
}());