'use strict';
setup();
function setup() {
    const url = new URL(document.location.href);
    if (url.hostname.toLowerCase() !== 'yu-64b.github.io') {
        return;
    }
    const main = Array.from(document.getElementsByTagName('main')).find(element => element.id === 'main');
    if (!main) {
        return;
    }
    const backgroundDiv = document.createElement('div');
    const mainDiv = document.createElement('div');
    backgroundDiv.id = 'background';
    backgroundDiv.classList.add('background');
    mainDiv.classList.add('main_outer');
    backgroundDiv.insertAdjacentHTML('afterbegin', '<header><div class="header_icon"><img src="pack_icon.png"></div><div id="counter_outer"></div></header>');
    mainDiv.appendChild(main);
    backgroundDiv.appendChild(mainDiv);
    backgroundDiv.insertAdjacentHTML('beforeend', '<footer><div class="url"><a target="_blank" rel="noopener noreferrer" href="https://docs.github.com/en/pages">Powered by GitHub Pages</a></div></footer>');
    document.body.appendChild(backgroundDiv);
    putCounter();
}
function putCounter() {
    const counterDiv = Array.from(document.getElementsByTagName('div')).find(element => element.id === 'counter_outer');
    if (!counterDiv) {
        return;
    }
    const counterTextDiv = document.createElement('div');
    counterTextDiv.textContent = '表示された回数';
    counterDiv.appendChild(counterTextDiv);
    if (localStorage && localStorage.getItem('username') && typeof localStorage.getItem('username') === 'string') {
        const usernameString = localStorage.getItem('username');
        counterDiv.insertAdjacentHTML('beforeend', '<div><img src="https://yu-64b.000webhostapp.com//?parameter=0&username=' + usernameString + '" alt="カウンター" crossorigin="anonymous"></div>');
    }
    else {
        counterDiv.insertAdjacentHTML('beforeend', '<div><img src="https://yu-64b.000webhostapp.com//?paramerter=0" alt="カウンター" crossorigin="anonymous"></div>');
    }
    counterDiv.insertAdjacentHTML('beforeend', '<div class="url"><a target="_blank" rel="noopener noreferrer" href="https://www.000webhost.com">Powered by 000webhost</a></div>');
}
