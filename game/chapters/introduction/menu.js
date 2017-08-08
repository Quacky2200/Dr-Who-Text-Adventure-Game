/*jshint esversion: 6 */
/*global window, document, console, media*/
(function () {
	var commands = {
		'play intro': {
			description: 'Plays the introduction of Doctor Who for this game',
			run: function () {
				return new Promise((resolve, reject) => {
					console.clear();
					$('game/chapters/introduction/title.htm').then((title) => {
						console.clear();
						document.body.innerHTML = title;
						media.playMusic('media/music/intro.mp3', false);
					});
					setTimeout(() => {
						reject();
					}, 15000);
				});
			}
		},
		'play intro long': {
			description: 'Plays a longer version of the introduction (Audio only)',
			run: function () {
				media.playMusic('media/music/intro-long.mp3');
				return Promise.reject();
			}
		},
		'play intro fast': {
			description: 'Plays a faster version of the introduction (Audio only)',
			run: function () {
				media.playMusic('media/music/intro-long-fast.mp3');
				return Promise.reject();
			}
		},
		'play dooms': {
			description: 'Play a MIDI interpretation of Doomsday (Murray Gold)',
			run: function () {
				media.playMusic('media/music/dooms.mp3', false);
				return Promise.reject();
			}
		},
		'play wors': {
			description: 'Play a MIDI interpretation of Wedding of River Song (Murray Gold)',
			run: function () {
				media.playMusic('media/music/wors.mp3', false);
				return Promise.reject();
			}
		},
		'play tls': {
			description: 'Play a MIDI interpretation of The Long Song (Murray Gold)',
			run: function () {
				media.playMusic('media/music/tls.mp3', false);
				return Promise.reject();
			}
		},
		'play iatd': {
			description: 'Play a MIDI interpretation of I am The Doctor (Murray Gold)',
			run: function () {
				media.playMusic('media/music/iatd.mp3', false);
				return Promise.reject();
			}
		},
		'setcolor commandline': {
			description: 'Set the color of the terminal to gray',
			run: function () {
				document.body.setAttribute('class', 'commandline');
				return Promise.reject();
			}
		},
		'setcolor terminal': {
			description: 'Set the color of the terminal to (lime) green',
			run: function () {
				document.body.setAttribute('class', 'terminal');
				return Promise.reject();
			}
		},
		'setcolor doctorwho': {
			description: 'Set the color of the terminal to blue',
			run: function () {
				document.body.setAttribute('class', 'doctorwho');
				return Promise.reject();
			}
		},
		'show changelog': {
			description: 'Shows the changelog between Ludum Dare #39 and now.',
			run: function () {
				return new Promise((resolve, reject) => {
					$('game/chapters/introduction/changelog.txt').then((changelog) => {
						console.type(changelog, 1.5, true, false).then(() => {
							reject();
						});
					});
				});
			}
		},
		'test typewriter': {
			description: 'Types out a random quote of The Bible as part of a typing test',
			run: function () {
				return new Promise((resolve, reject) => {
					console.clear();
					var background = document.createElement('div');
					background.innerHTML = `<div style="position:relative;height:0;padding-bottom:56.25%"><iframe src="https://www.youtube.com/embed/o_IruYe2pHA?rel=0&amp;controls=0&amp;showinfo=0?ecver=2&autoplay=1&loop=1" width="640" height="360" frameborder="0" style="position:absolute;width:100%;height:100%;left:0" allowfullscreen></iframe></div>`;
					background.style.display = 'none';
					document.body.appendChild(background);
					console.debug('Typewriter test using quotes from The Bible');
					$('game/random/quotes.json').then((quotes) => {
						var skip = document.createElement('pre');
						skip.innerText = 'Press Ctrl-C to stop after current quote';
						skip.style.position = 'absolute';
						skip.style.top = '0px';
						skip.style.right = '0px';
						skip.style.display = 'inline-block';
						skip.style.background = 'rgba(0, 0, 0, 0.5)';
						skip.style.padding = '10px';
						skip.style.margin = '0';
						skip.setAttribute('class', 'commandline');
						

						var exit = false;
						window.onkeydown = function(e) {
							if (e.key.toLowerCase() === 'c' && e.ctrlKey) {
								window.onkeydown = null;
								exit = true;
							}
						};

						var endless = function() {
							//console.clear();
							document.body.appendChild(skip);
							console.type(quotes[randInt(0, quotes.length - 1)], 1, false).then((p) => {
								setTimeout(() => {
									if (exit) {
										console.clear();
										reject();
									} else {
										p.remove();
										endless();
									}
								}, 2500);
							});
						}
						endless();	

					});
					
				});
			}
		}
	};
	commands['play'] = {
		description: 'Play the game',
		run: function () {
			return new Promise(function (resolve, reject) {
				console.type('Let\'s roll...', 1, true, true).then(function() {
					console.clear();
					$('game/chapters/introduction/introduction.txt').then(function (intro) {
						//media.playMusic('media/music/iatd.mp3');
						console.type(intro).then(() => {
							intro = undefined;
							commands['play intro'].run().catch(() => {
								$('game/chapters/1/main.js');
							});
						});
					});
				});
			})
		}
	};
	commands['help'] = {
		description: 'Shows helpful information on the commands available',
		run: function () {
			return new Promise(function (resolve, reject) {
				var keys = Object.keys(commands).sort();
				var str = '';
				for (var i = 0; i < keys.length; i++) {
					var cmd = commands[keys[i]];

					str += keys[i] + ' - ' + cmd.description + '\n';
				}
				console.print(str).then(() => {
					reject();
				})
			});
		}
	};
	return commands;
}());