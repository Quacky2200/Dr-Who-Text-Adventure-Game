(async function() {
	console.clear();
	media.playMusic('media/music/dooms.mp3');
	var script = await $('game/chapters/1/scene_1.htm');
	script = script.replace(/\%name\%/g, name);
	var player = {
		name: name,
		objective: 'Find out why we\'re running out of power',
		inventory: [

		]
	}
	var rooms = {
		console: {
			tag: 'console',
			title: 'The Tardis (Console)',
			description: "",
			items: [
			],
			exits: [
				'office',
				'hallway',
				'outside'
			]
		},
		office: {
			id: 'office',
			tag: 'upstairs',
			title: 'The Office',
			description: "",
			items: [
				{
					id: 'torch',
					description: 'Shines light into dark situations',
					pickup: function() {
						player.inventory[player.inventory.length] = rooms.office.items[0];
						delete rooms.office.items[0];
					}
				}
			],
			exits: {

			}
		},
		hallway: {
			tag: 'hallway',
			title: 'the Hallway',
			description: "It's dark and gloomy. Big and old cables run along the side of the wall. A lot of doors and arches are around. "
		},
		outside: {
			tag: 'outside',
			title: 'Outside',
			description: 'The door is locked.',
			items: [],
			exits: []
		},
		engineroom: {
			tag: 'engine room',
			title: 'The Engine Room',
			description: 'Hot and stuffy. Is that a giant spider over there?',
			items: [],
			exits: [
				'hallway',
			]
		}
	};
	var actions = {};
	console.type(script, 0.95, false, false).then(async () => {
		console.print('What should we do?').then(async () => {
			console.getInput().then(async (text) => {
				if ('fix it') {
					console.debug('Good answer...');
				} else {
					console.debug('Are you sure about that?');
				}
				console.clear();
				var ending = await $('game/chapters/1/end.htm');
				document.body.innerHTML = ending;
				media.playMusic('media/music/iatd.mp3', false);
				var quotes = JSON.parse(await $('game/chapters/1/random.txt'));
				var randInt = (min, max) => {
					return Math.floor((Math.random() * max) + min);
				}
				// Couldn't finish and thought I'd just give people random quotes...
				// setTimeout(async () => {
				// 	var endless = async function() {
				// 		console.debug('Typewriter test using quotes from The Bible');
				// 		console.type(quotes[randInt(0, quotes.length - 1)]).then(() => {
				// 			setTimeout(async () => {
				// 				console.clear();
				// 				endless();
				// 			}, 2500);
				// 		})
				// 	}
				// 	endless();	
				// }, 4000);
			})
		});
	})
})();