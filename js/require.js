//(new Function(`console.log("%cI'm watching you.", "color: gray; font-size: 9px;");`))();

(async function() {
	const $ = function (file) {
		return new Promise((resolve, reject) => {
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if (file.match(/\.(php|htm[l]?|txt)$/)) {
						resolve(this.responseText);
					} else if (file.match(/\.(js)$/)) {
						var response = eval(`(() => {${this.responseText}})();`);
						resolve(response);
					} else {
						insepector.error('This function cannot handle that file type!');
						reject(null);
					}
				} else if (this.readyState == 4 && this.status !== 200) {
					window.console.log(this.status + ' response code for ' + file);
				}
			};
			xhttp.open("GET", file, true); //'chapters/' + chapter + '.php', true);
			xhttp.send();
		});
	}
	
	const media = await $('js/media.js');
	const scrollTo = (e) => window.scrollBy(0, e.offsetTop + e.offsetHeight);
	const sleepMs = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	const sleepS = (s) => sleepMs(s * 1000);
	const console = await $('js/console.js');


	const genChars = function(len = 10, chars = null) {
		chars = chars || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		var text = "";
		for (var i = 0; i < len; i++) {
			text += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return text;
	}

	document.onreadystatechange = function() {
		if (document.readyState == 'complete') {
			
			// Let's run the game.
			$('game/start.js');
			
			document.onreadystatechange = null;
		}
	}
	// Run in-case the document state has already changed by this time
	document.onreadystatechange();

})();
