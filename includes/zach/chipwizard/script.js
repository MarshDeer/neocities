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
	console.log(levelData[target].title);
	// chip preview animation
	document.getElementById('preview').removeAttribute('hidden')
	
	// layout src
	document.querySelector('#layout img').src = `https://raw.githubusercontent.com/MarshDeer/zachtronics-solutions/root/Last%20Call%20BBS/ChipWizard/${encodeURI(levelData[target].title)}.png`;
	document.getElementById('layout').removeAttribute('hidden')
	
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