(function () {
	var music = document.createElement('audio');
	return {
		playSound: function(sound) {
			// No need to add to DOM as it will still play without
			var snd = document.createElement('audio');
			// Always remove sound effects in-case of spam
			snd.onended = function() {
				this.remove();
			};
			snd.setAttribute('preload', 'none')
			snd.setAttribute('autoplay', true);
			snd.volume = 0.5;
			snd.setAttribute('src', sound);
		},
		playMusic: function(file, loop) {
			loop = loop !== undefined ? loop : true; 
			// Level/Story music should always be looped to avoid silence.
			music.setAttribute('autoplay', true);
			music.onended = null;
			music.setAttribute('src', file);
			if (loop) {
				music.onended = function() {
					music.currentTime = 0;
					if (!music.paused) music.play();
				};
			}
		}
	};
	
}());