;(function(){
	'use strict'

	var doc = document;

	var patterns = [];

	const li = doc.createElement('li'),
				div = doc.createElement('div'),
				labelSymbol = doc.createElement('label'),
				labelWords = doc.createElement('label'),
				inputSymbol = doc.createElement('input'),
				inputWords = doc.createElement('textarea'),
				removeButt = doc.createElement('button');

	inputSymbol.setAttribute('type', 'text');
	inputSymbol.setAttribute('required', '');
	removeButt.classList.add('removeButt');
	

	function generate() {
		let sym,
				val,
				options = {},
				symbolsList = symbols.getElementsByTagName('li');

		options.pattern = pattern.value;
		for (let i = 0; i < symbolsList.length; i++) {
			sym = symbolsList[i].getElementsByTagName('input')[0].value;
			val = symbolsList[i].getElementsByTagName('textarea')[0].value;
			options[sym] = val.replace(/\s+/g, '').split(',');
		}

		fetch('/generate', {
			method: 'post',
  		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  		body: `options=${JSON.stringify(options)}`
		}).then(res => res.text())
			.then(text => {
				namegenOut.innerHTML = text;
			});
	}
	function removeSymbolLi() {
		this.parentNode.remove();
	}

	function addSymbolLi() {
		let listFrag = doc.createDocumentFragment();

		listFrag.appendChild(li.cloneNode());
		listFrag.firstChild.appendChild(removeButt.cloneNode());
		listFrag.firstChild.firstChild.addEventListener('click', removeSymbolLi);
		listFrag.firstChild.appendChild(div.cloneNode());
		listFrag.firstChild.lastChild.appendChild(inputSymbol.cloneNode());
		listFrag.firstChild.lastChild.appendChild(labelSymbol.cloneNode());
		listFrag.firstChild.lastChild.lastChild.innerText = 'Символ:';
		listFrag.firstChild.appendChild(labelWords.cloneNode());
		listFrag.firstChild.lastChild.innerText = 'Подстановки:';
		listFrag.firstChild.appendChild(inputWords.cloneNode());

		symbols.appendChild(listFrag);
	}

	function fillEditor(name) {
		symbols.innerHTML = '';
		pattern.value = '';

		for (let i in patterns) {
			if ( patterns[i].name === name ) {
				pattern.value = patterns[i].pattern;

				for (let j in patterns[i]) {
					if ( j === 'name' || j === 'pattern' ) {
						continue;
					}
					addSymbolLi();

					symbols.lastChild.getElementsByTagName('input')[0].value = j;
					symbols.lastChild.getElementsByTagName('textarea')[0].value = patterns[i][j];
				}

				break;
			}
		}
	}

	function toggleList() {
		patternList.classList.toggle('open');
	}

	function selectLi() {
		selectedLi.innerHTML = this.innerHTML;
		fillEditor(selectedLi.innerHTML);
	}

	function openEditor() {
		editor.classList.remove('hidden');
	}

	function closeEditor() {
		editor.classList.add('hidden');
	}

	function namegenInit() {

		fetch('/init', {
			method: 'post'
		}).then(res => res.json())
			.then(item => {
				let listFrag = doc.createDocumentFragment();

				patterns = item.patterns;

				for (let i in patterns) {
					listFrag.appendChild(li.cloneNode());
					listFrag.lastChild.innerHTML = patterns[i].name;
					listFrag.lastChild.addEventListener('click', selectLi);
				}
				listFrag.appendChild(li.cloneNode());
				listFrag.lastChild.innerHTML = 'Пользовательский шаблон';
				listFrag.lastChild.addEventListener('click', selectLi);

				selectLi.call(listFrag.firstChild);
				patternList.appendChild(listFrag);
			});
	}


	generateButt.addEventListener('click', generate);
	editButt.addEventListener('click', openEditor);
	closeButt.addEventListener('click', closeEditor);
	addSymbolButt.addEventListener('click', addSymbolLi);
	patternList.addEventListener('click', toggleList);

	namegenInit();
})();