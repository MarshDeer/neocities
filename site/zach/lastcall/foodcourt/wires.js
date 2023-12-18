/* Constants */
	const overlay = document.getElementById("cableoverlay");
	const canvas = overlay.getContext("2d");

/* Functions */
	function position () {
		var outputjack = document.querySelector('a[href="' + window.location.hash + '"] .jack').getBoundingClientRect();
		var inputjack = document.getElementById("inputjack").getBoundingClientRect();
		return {
			xout: outputjack.left + (outputjack.width / 2),
			yout: outputjack.top + (outputjack.height / 2),
			xin: inputjack.left + (inputjack.width / 2 + 1),
			yin: inputjack.top + (inputjack.height / 2 + 1)
		};
	}

	function draw () {
		/* Toggle connected state */
		connected = document.querySelectorAll("a.connected");
		if (connected.length != 0) {
			document.querySelector(".connected").classList.remove("connected")
		}
			document.querySelector('a[href="' + window.location.hash + '"]').classList.add("connected");
			document.getElementById("main").classList.add("connected");
		/* Match viewport dimensions */
		overlay.width = window.innerWidth;
		overlay.height = window.innerHeight;
		/* Setup */
		canvas.lineCap = "round";
		canvas.clearRect(0, 0, overlay.width, overlay.height);
		/* Drawing */
		canvas.strokeStyle = "#43160e";
		canvas.lineWidth = 9;
		bezier();
		canvas.strokeStyle = "#c65400";
		canvas.lineWidth = 8;
		bezier();
		canvas.strokeStyle = "#ff9c00";
		canvas.lineWidth = 4;
		bezier();
		canvas.strokeStyle = "#ffdaa0";
		canvas.lineWidth = 2;
		bezier();
	}

	function bezier() {
		var pos = position();
		canvas.beginPath();
		canvas.moveTo(pos.xout, pos.yout);
		canvas.bezierCurveTo(pos.xout + 75, pos.yout, pos.xin - 75, pos.yin, pos.xin, pos.yin);
		canvas.stroke();
	}

/* Run */
	draw();
