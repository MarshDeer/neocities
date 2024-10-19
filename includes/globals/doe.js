function initWM() {
	// Grab windows
	const windowsArray = document.querySelectorAll('.DOE .window');

	// Create close button
	for (const window of windowsArray) {
		let closeButton = document.createElement('button');
		closeButton.classList.add('close');
		closeButton.onclick = function(){this.parentNode.setAttribute('hidden', true)};
		window.append(closeButton);
	}
}