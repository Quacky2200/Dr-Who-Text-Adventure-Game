return {
	clear: async function() {
		var b = document.body;
		while (b.firstChild) {
			b.removeChild(b.firstChild);
		}
		return new Promise((resolve, reject) => resolve());
	},
	debug: async function() {
		// Print information to the screen in red
		var p = document.createElement('pre');
		p.style.color = 'red';
		p.innerText = Array.prototype.slice.call(arguments).join(' ');
		document.body.appendChild(p);
		scrollTo(p);
		return new Promise((resolve, reject) => resolve(p));
	},
	error: async function() {
		// Print information to the screen in red
		var p = document.createElement('pre');
		p.style.color = 'red';
		p.innerText = Array.prototype.slice.call(arguments).join(' ');
		document.body.appendChild(p);
		scrollTo(p);
		return new Promise((resolve, reject) => resolve(p));
	},
	print: async function(text) {
		// Print to the screen
		var p = document.createElement('pre');
		p.innerText = text;
		document.body.appendChild(p);
		scrollTo(p);
		return new Promise((resolve, reject) => resolve(p));
	},
	log: async function() {
		// Print all arguments to the screen (similar to console.log('hello', 'world'))
		var p = document.createElement('pre');
		p.innerText = Array.prototype.slice.call(arguments).join(' ');
		document.body.appendChild(p);
		scrollTo(p);
		return new Promise((resolve, reject) => resolve(p));
	},
	type: async function(text, speed = 1, canSkip = true, continueOnSkip = false) {
		// Who doesn't love a typewriter?
		return new Promise(async (resolve, reject) => {
			var p = document.createElement('pre');
			document.body.appendChild(p);
			
			var char_speed = (0.020 / speed);
			var punct_speed = char_speed * 20;
			var char_final_speed = char_speed;
			var char_exhaustion_speed = punct_speed / 1000;
			var wait_paragraph = 1000;
			var punctuation = [',','?', '!', ';', '\n'];

			var buffer = '';
			var exit = false;

			var skip = document.createElement('pre');
			skip.innerText = 'Press [Enter] to skip';
			skip.style.position = 'absolute';
			skip.style.top = '0px';
			skip.style.right = '0px';
			skip.style.display = 'inline-block';
			skip.style.background = 'rgba(0, 0, 0, 0.5)';
			skip.style.padding = '10px';
			skip.style.margin = '0';
			skip.setAttribute('class', 'commandline');
			//document.body.appendChild(skip);

			// window.onkeydown = function(e) {
			// 	if (e.keyCode == 13) {
			// 		exit = true;
			// 		skip.remove();
			// 		window.onkeydown = null;
			// 	}
			// }

			for (var i = 0; i < text.length; i++) {
				var char = text.charAt(i);
				p.textContent += char;
				scrollTo(p);
				var nextChar = (i + 1) >= text.length ? '' : text.charAt(i + 1); 
				if (exit) {
					p.innerText = text;
					scrollTo(p);
					break;
				}
				if ((punctuation.indexOf(char) > -1 && [' ', '\n'].indexOf(nextChar) > -1) || char == '.') {
					media.playSound('media/soundFX/keys/' + genChars(1, 'fp') + '.mp3');
					char_final_speed = char_speed;
					await sleepS(punct_speed);
				} else {	
					media.playSound('media/soundFX/keys/' + genChars(1, 'abcdefghp') + '.mp3');
					char_final_speed += char_exhaustion_speed;
					await sleepS(char_final_speed);
				}
			}
			await sleepS(0.5);
			if (exit && !continueOnSkip) {
				console.getInput('Press [Enter] to Continue...').then(() => {
					resolve(p);
				});
			} else {
				resolve(p);
			}
		});
	},
	getInput: async function(prefix = '> ') {
		// Ask for input and return it
		return new Promise((resolve, reject) => {
			var p = document.createElement('pre');
			document.body.appendChild(p);
			p.innerText = prefix;
			scrollTo(p);
			var buffer = '';
			var playTap = () => media.playSound('media/soundFX/keys/' + genChars(1, 'fp') + '.mp3');
			var ctrlModifier = false;
			window.onkeypress = function(e) {
				var key = e.which || e.keyCode;
				var char = String.fromCharCode(key);
				buffer += char;
				p.innerText = prefix + buffer;
				playTap();
				scrollTo(p);
			}
			window.onkeydown = function(e) {
				switch (e.keyCode) {
					case 8:
						// BACKSPACE
						buffer = buffer.substring(0, buffer.length - 1);
						p.innerText = prefix + buffer;
						playTap();
						ctrlModifier = false;
						break;
					case 13:
						// ENTER
						window.onkeypress = null;
						window.onkeydown = null;
						playTap();
						resolve(buffer);
						ctrlModifier = false;
						break;
					case 85, 67, 90:
						// U, C, Z
						if (ctrlModifier) {
							console.error('This is not a terminal').then((p) => {
								setTimeout(() => p.remove(), 5000);
							});
							buffer = '';
							p.innerText = prefix;
						}
					case 17:
						// CTRL
						ctrlModifier = true;
						break;
					default: 
						ctrlModifier = false;
				}
				scrollTo(p);
			}
		});
	}
};