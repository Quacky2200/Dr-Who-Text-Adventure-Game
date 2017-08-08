(function() {
	function htmlEntities(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}
	return {
		clear: function() {
			var b = document.body;
			while (b.firstChild) {
				b.removeChild(b.firstChild);
			}
			return new Promise(function(resolve, reject) {resolve();});
		},
		debug: function() {
			// Print information to the screen in red
			var p = document.createElement('pre');
			p.style.color = 'red';
			p.innerText = Array.prototype.slice.call(arguments).join(' ');
			document.body.appendChild(p);
			scrollTo(p);
			return new Promise(function(resolve, reject) {resolve(p);});
		},
		error: function() {
			// Print information to the screen in red
			var p = document.createElement('pre');
			p.style.color = 'red';
			p.innerText = Array.prototype.slice.call(arguments).join(' ');
			document.body.appendChild(p);
			scrollTo(p);
			return new Promise(function(resolve, reject) {resolve(p);});
		},
		print: function(text) {
			// Print to the screen
			var p = document.createElement('pre');
			p.innerText = text;
			document.body.appendChild(p);
			scrollTo(p);
			return new Promise(function(resolve, reject) {resolve(p);});
		},
		log: function() {
			// Print all arguments to the screen (similar to console.log('hello', 'world'))
			var p = document.createElement('pre');
			p.innerText = Array.prototype.slice.call(arguments).join(' ');
			document.body.appendChild(p);
			scrollTo(p);
			return new Promise(function(resolve, reject) {resolve(p);});
		},
		type: function(text, speed, canSkip, continueOnSkip) {
			// Who doesn't love a typewriter?
			speed = (speed !== undefined ? speed : 1);
			canSkip = (canSkip !== undefined ? canSkip : true);
			continueOnSkip = (continueOnSkip !== undefined ? continueOnSkip : false);
			return new Promise(function(resolve, reject) {
				var p = document.createElement('pre');
				document.body.appendChild(p);
				
				var currentChar = -1;
				//var allChars = '';
				var exit = false;
				var elements = [];

				var charSpeed = (0.025 / speed);
				var punctSpeed = charSpeed * 20;
				var charFinalSpeed = charSpeed;
				var charExhaustionSpeed = punctSpeed / 1000;
				var waitParagraph = 1000;
				var punctuation = [',','?', '!', ';', '\n'];

				if (canSkip) {
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
					document.body.appendChild(skip);

					window.onkeypress = function(e) {
						switch (e.key) {
							case 'Enter':
							case 'Escape':
								exit = true;
								skip.remove();
								window.onkeypress = null;
								break;
						}
					};
				}

				var promise = promiseWhile(
					function() { 
			  			return new Promise(function(resolve, reject) {
							currentChar++;
							if (exit || currentChar >= text.length) {
								if (canSkip) {
									skip.remove();
								}
								resolve();
							} else {
								reject();
							}
						});
					},
					function() { 
						return new Promise(function(resolve, reject) {
							function getCChar(i) {
								// Get current char at position i
								return (currentChar + i) >= text.length ? '' : text.charAt(currentChar + i);
							}
							var char = getCChar(0);
							var nextChar = getCChar(1);
							var currentElement = (elements.length > 0 ? elements[elements.length - 1] : null);
							// Example: This is an <b style='color: red' class='test'>IMPORTANT</b> test.
							if ((char == '<' && nextChar.match(/[a-z]/i)) || char == '<' && nextChar == '/') {
								// Start or end of element (e.g. <a or </)
								var elbuffer = char;
								var hasStarted = nextChar !== '/';

								while (nextChar !== ">") {
									currentChar += 1;
									char = getCChar(0);
									nextChar = getCChar(1);
									elbuffer += char;
								}
								elbuffer += nextChar;
								currentChar++;

								if (hasStarted) {
									var s = document.createElement('span');
									s.style.display = 'inline-block';
									s.innerHTML = elbuffer + '</' + elbuffer.match(/<([a-z]+)[ >]/)[1] + '>';
									s = s.firstChild;
									s.setAttribute('alt-data', 'animate');
									if (elements.length > 0) {
										elements[elements.length - 1].appendChild(s);
									} else {
										p.appendChild(s);
									}
									elements.push(s);
								} else {
									var currentElement = elements.pop();
									currentElement.setAttribute('alt-data', null);
								}

							} else if (currentElement) {
								var isFormatted = currentElement.nodeName.toLowerCase() == 'b' || currentElement.nodeName.toLowerCase() == 'i';
								if (isFormatted) {
									var s = document.createElement('span');
									s.append(char);
									currentElement.appendChild(s);
								} else {
									currentElement.append(char);
								}
								//allChars += '<span>' + char + '</span>';
							} else {
								p.append(char);
							}

							scrollTo(p);
					
							if ((punctuation.indexOf(char) > -1 && [' ', '\n'].indexOf(nextChar) > -1) || char == '.') {

								media.playSound('media/soundFX/keys/' + genChars(1, 'fp') + '.mp3');
								charFinalSpeed = charSpeed;
								setTimeout(function() { resolve(); }, punctSpeed * 1000);
								
							} else {	
								media.playSound('media/soundFX/keys/' + genChars(1, 'abcdefghp') + '.mp3');
								charFinalSpeed += charExhaustionSpeed;
								// Formatted strings are animated (bold and italic and need more time to display due to animation)
								var isFormatted = (
									currentElement && 
									(currentElement.nodeName.toLowerCase() == 'b' || 
									currentElement.nodeName.toLowerCase() == 'i')
								);
								setTimeout(function() {resolve();}, charFinalSpeed * (isFormatted ? 2500 : 1000));
							}
						});
					}
				);
				promise.then(function() {
					if (exit && canSkip) {
						/*
						 * On adrupt exit...
						 * Spit out all text
						 */
						p.innerHTML = text;
						scrollTo(p);
						// Show confirmation to continue if we ask for it
						if (exit && !continueOnSkip) {
							console.getInput('Press [Enter] to Continue...').then(function() {
								resolve(p);
							});
							return;
						}
					}
					setTimeout(function() {resolve(p);}, 500);
				});
			});
		},
		getInput: function(prefix, suggestions) {
			prefix = prefix !== undefined ? prefix : '> ';
			// Ask for input and return it
			return new Promise(function(resolve, reject) {
				var cursor = '<span class=\'cursor\' style=\'display: inline-block; width: 0.4em; margin: 0 -0.20em;\'>|</span>';
				var cursorPosition = 0;
				var buffer = '';
				var p = document.createElement('pre');
				document.body.appendChild(p);
				var drawInput = function() {
					p.innerHTML = prefix + htmlEntities(buffer.substring(0, cursorPosition)) + cursor + htmlEntities(buffer.substring(cursorPosition, buffer.length));
					scrollTo(p);
				}
				drawInput();
				var lastKeyDown = null;
				
				var playTap = function() {
					var now = (new Date()).getTime();
					if ((now - lastKeyDown) > 50) {
						media.playSound('media/soundFX/keys/' + genChars(1, 'fp') + '.mp3');
					}
					lastKeyDown = now;
				};

				window.onkeydown = function(e) {
					var key = e.key;
					
					if (key.match(/^[\w\W]{1}$/) && !e.ctrlKey) {
						// Normal key press (characters)
						cursorPosition++;
						buffer = buffer.substring(0, cursorPosition - 1) + key + buffer.substring(cursorPosition - 1, buffer.length);
						drawInput();
						playTap();
					} else if (key.match(/^[\w\W]{1}$/) && e.ctrlKey && key !== 'R') {
						console.error('This is not a terminal').then(function(p) {
							setTimeout(function() { p.remove(); }, 2500);
						});
						e.preventDefault();
						return false();
					} else {
						switch (key) {
							case 'Enter':
								//window.onkeypress = null;
								window.onkeydown = null;
								cursor = '';
								drawInput();
								playTap();
								resolve(buffer);
								break;
							case 'Backspace':
								buffer = buffer.substring(0, Math.max(cursorPosition - 1), 0) + buffer.substring(cursorPosition, buffer.length);
								cursorPosition = Math.max(cursorPosition - 1, 0);
								drawInput();
								playTap();
								e.preventDefault();
								return false;
							case 'Tab':
								// Suggestions for the user
								if (suggestions) {
									var s = document.createElement('pre');
									s.innerHTML = suggestions;
									document.body.insertBefore(s, p);
								}
								break;
							case 'ArrowLeft':
								cursorPosition = Math.max(cursorPosition - 1, 0);
								drawInput();
								break;
							case 'ArrowRight':
								cursorPosition = Math.min(cursorPosition + 1, buffer.length);
								drawInput();
								break;
						}
					}
				};
			});
		}
	};
}());