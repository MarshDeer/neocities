	function setClock() {
		var date = new Date();
		var hour = date.getHours();
		var mins = date.getMinutes();

		hour = updateClock(hour);
		mins = updateClock(mins);

		document.getElementById("clock").innerText = hour + ":" + mins;
	}
	function updateClock(n) {
		if (n < 10) {
			return "0" + n;
		}
		else {
			return n;
		}
	}
	setClock();
	setInterval('setClock()', 15 * 1000);
