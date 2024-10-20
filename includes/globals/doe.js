// Set up window actions
function initWM() {
	// Grab windows and their container
	const windowsArray = document.querySelectorAll('.DOE .window');
	const windowsContainer = document.querySelector('main').getBoundingClientRect();

	for (const window of windowsArray) {
		// Create close button
		let closeButton = document.createElement('button');
			closeButton.classList.add('titlebarbutton');
			closeButton.style.right = 0;
			closeButton.setAttribute('aria-hidden', true);
			closeButton.onclick = function(){this.parentNode.setAttribute('hidden', true)};

		// Create position reset button
		let resetButton = document.createElement('button');
			resetButton.classList.add('titlebarbutton');
			resetButton.style.left = 0;
			resetButton.setAttribute('aria-hidden', true);
			resetButton.onclick = function(){this.parentNode.style.cssText = ''};

		// Append buttons to window
		window.append(closeButton, resetButton);

		// Make windows draggable
		let titlebar = window.querySelector('.titlebar');
		titlebar.addEventListener('mousedown', (e) => {
			let windowX = window.getBoundingClientRect().left - windowsContainer.left;
			let windowY = window.getBoundingClientRect().top - windowsContainer.top;
			let offsetX = e.clientX - windowX;
			let offsetY = e.clientY - windowY;
			document.documentElement.style['user-select'] = 'none'; //TODO: less messy solution
			const dragMove = (e) => {
				window.style.inset = `${e.clientY - offsetY}px auto auto ${e.clientX - offsetX}px`
				window.style.transform = 'none';
			};
			const dragEnd = () => {
				document.removeEventListener('mousemove', dragMove);
				document.removeEventListener('mouseup', dragEnd);
				document.documentElement.style['user-select'] = 'unset'; //TODO: less messy solution
			};
			document.addEventListener('mousemove', dragMove);
			document.addEventListener('mouseup', dragEnd);
		});
	}
}

// Run clock
function updateClock() {
	let time = new Date();
	let hours = String(time.getHours()).padStart(2,'0');
	let minutes = String(time.getMinutes()).padStart(2,'0');
	document.getElementById('clock').innerText = `${hours}:${minutes}`
}