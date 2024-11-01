function fetchData() {
	fetch('data.json')
	.then(response => response.json())
	.then(data => {levelData = data.levels;})
	.catch(error => {console.error('json fetch failed', error);});
}

function init() {
	const windowsArray = document.querySelectorAll('.window');
	const windowsContainer = document.documentElement.getBoundingClientRect();
	
	for (const window of windowsArray) {
		let handle = window.querySelector('.draghandle');
		handle.addEventListener('mousedown', (e) => {
			let windowX = window.getBoundingClientRect().left - windowsContainer.left;
			let windowY = window.getBoundingClientRect().top - windowsContainer.top;
			let offsetX = e.clientX - windowX;
			let offsetY = e.clientY - windowY;
			
			const dragMove = (e) => {
				window.style.inset = `${e.clientY - offsetY}px auto auto ${e.clientX - offsetX}px`
				window.style.transform = 'none';
			};
			
			const dragEnd = () => {
				document.removeEventListener('mousemove', dragMove);
				document.removeEventListener('mouseup', dragEnd);
				document.documentElement.style['user-select'] = 'unset';
			};
			
			document.documentElement.style['user-select'] = 'none';
			document.addEventListener('mousemove', dragMove);
			document.addEventListener('mouseup', dragEnd);
		});
	}
	fetchData();
}

function create(target) {
	const names = ['one', 'two', 'three', 'four', 'five', 'six'];
	const percent = [1.6, 3.2, 4.8, 6.4, 8, 9.6, 11.2, 12.8, 14.4, 16, 17.6, 19.2, 20.8, 22.4, 24, 25.6, 27.2, 28.8, 30.4, 32, 33.6, 35.2, 36.8, 38.4, 40, 41.6, 43.2, 44.8, 46.4, 48, 49.6, 51.2, 52.8, 54.4, 56, 57.6, 59.2, 60.8, 62.4, 64, 65.6, 67.2, 68.8, 70.4, 72, 73.6, 75.2, 76.8, 78.4, 80, 81.6, 83.2, 84.8, 86.4, 88, 89.6, 91.2, 92.8, 94.4];
	console.log(levelData[target].title);
	// chip preview animation
	document.getElementById('preview').removeAttribute('hidden');
	let visualizer = document.querySelector('.visualizer');
	visualizer.querySelector('style').remove();
	let keyframes = '';
	for (let legIteration = 0; legIteration < 6; legIteration++) {
		keyframes = keyframes + `@keyframes ${names[legIteration]} {\n`;
		for (let tickIteration = 0; tickIteration < 59; tickIteration++) {
			keyframes = keyframes + `${percent[tickIteration]}% {background: var(--${levelData[target].signalValue[legIteration][tickIteration]});}\n`;
		}
		keyframes = keyframes + `100% {background: var(--${levelData[target].signalValue[legIteration][58]});}\n}\n`;
	}
	let animations = document.createElement('style');
	animations.innerHTML = keyframes;
	visualizer.append(animations);

	// layout src
	document.getElementById('layout').removeAttribute('hidden')
	document.querySelector('#layout img').src = `https://raw.githubusercontent.com/MarshDeer/zachtronics-solutions/root/Last%20Call%20BBS/ChipWizard/${encodeURI(levelData[target].title)}.png`;

	// output graph
	document.getElementById('output').removeAttribute('hidden')
	const outputGrid = document.getElementById('output');
	document.querySelectorAll('#output .row').forEach((row) => {row.remove()});
	for (let rowIteration = 0; rowIteration < 6; rowIteration++) {
		let rowElement = document.createElement('div');
		rowElement.classList.add('row');
		rowElement.classList.add(names[rowIteration]);
		let nameContainer = document.createElement('div');
		nameContainer.classList.add('name');
		let nameElement = document.createElement('span');
		nameElement.innerText = levelData[target].signalName[rowIteration];
		nameContainer.append(nameElement);
		rowElement.append(nameContainer);
		console.log(levelData[target].signalName[rowIteration], levelData[target].signalValue[rowIteration]);
		for (tickValue of levelData[target].signalValue[rowIteration]) {
			let tickElement = document.createElement('div');
			tickElement.setAttribute('value', tickValue);
			tickElement.classList.add('tick');
			rowElement.append(tickElement);
		}
		let rowEnd = document.createElement('div');
		rowEnd.classList.add('end');
		rowElement.append(rowEnd);
		outputGrid.append(rowElement);
	}
}