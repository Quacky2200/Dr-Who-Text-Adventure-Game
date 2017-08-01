(async function() {
	var randInt = (min, max) => {
		return Math.floor((Math.random() * max) + min);
	}
	var name = '';
	var loopUntilPlay = async function(type = false) {
		console.clear();
		var readme = await $('game/chapters/introduction/readme.txt');
		var printFn = type ? console.type(readme, 1, true, true) : console.print(readme);
		printFn.then(() => {
			console.getInput().then(async (response) => {
				if (response.toLowerCase() == 'play dooms') {
					// Doomsday
					media.playMusic('media/music/dooms.mp3', false);
				} else if (response.toLowerCase() == 'play wors') {
					// Wedding of River Song
					media.playMusic('media/music/wors.mp3', false);
				} else if (response.toLowerCase() == 'play tls') {
					// The long song
					media.playMusic('media/music/tls.mp3', false);
				} else if (response.toLowerCase() == 'play iatd') {
					// I am the Doctor
					media.playMusic('media/music/iatd.mp3', false);
				} else if (response.toLowerCase() == 'setcolor commandline') {
					// Gray text
					document.body.setAttribute('class', 'commandline')
				} else if (response.toLowerCase() == 'setcolor terminal') {
					// Lime text
					document.body.setAttribute('class', 'lime');
				} else if (response.toLowerCase() == 'setcolor doctorwho') {
					// Blue text
					document.body.setAttribute('class', 'doctorwho');
				} else if (response.toLowerCase() == 'play intro') {
					// Doomsday
					console.clear();
					var title = await $('game/chapters/introduction/title.htm');
					document.body.innerHTML = title;
					media.playMusic('media/music/intro.mp3', false);
					setTimeout(function() {
						loopUntilPlay();
					}, 18000);
					return;
				} else if (response.toLowerCase() == 'test') {
					var quotes = JSON.parse(await $('game/chapters/1/random.txt'));
					// Couldn't finish and thought I'd just give people random quotes...
					console.debug('Typewriter test using quotes from The Bible');
					console.type(quotes[randInt(0, quotes.length - 1)]).then(() => {
						setTimeout(async () => {
							console.clear();
							loopUntilPlay();
						}, 2500);
					});
					return;
				} else if (response.toLowerCase() == 'play') {
					loopUntilPlay = null;

					questions = [
						"What's your favourite food?",
						"In one word, what's do you hate most about you?",
						"What's your favourite animal?",
						"In a couple of space-seperated words, what do you hate most about your neighbour?",
						"What's the weather like in your area?",
						"Your least favourite name",
						"The smelliest thing you can think of?",
						"Your stuffed animal name?",
						"The name of your childhood bully?",
						"What's the most negative word you can think of?",
						"When you get angry what do you shout?",
						"What is your most favourite drink on a night out?",
						"Enter in as few words possible what you really hate"
					];

					console.type('I just need two quick questions to be answered:', 1, true, true).then(async () => {
						await console.print(questions[randInt(0, questions.length - 1)]);
						var q1 = await console.getInput();
						await console.print(questions[randInt(0, questions.length - 1)]);
						var q2 = await console.getInput();

						var name = q1.replace(/ /g, '-') + ' ' + q2.replace(/ /g, '-');

						console.type('Let\'s roll...', 1, true, true).then(async () => {
							console.clear();
							console.type(await $('game/chapters/introduction/introduction.txt')).then(async (p) => {
								console.clear();
								var title = await $('game/chapters/introduction/title.htm');
								document.body.innerHTML = title;
								media.playMusic('media/music/intro.mp3', false);
								setTimeout(function() {
									$('game/chapters/1/main.js');
								}, 18000);
							});
						});
						
					});
					return;
				} 
				loopUntilPlay();
			});
		});

	}

	loopUntilPlay(true);

})();