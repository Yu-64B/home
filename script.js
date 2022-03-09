'use strict';
setup();
function setup() {
    const url = new URL(document.location.href);
    if (url.hostname.toLowerCase() === 'yu-64b.github.io') {
        putUrls();
        putCounter();
    }
}
function putUrls() {
    const githubUrlDiv = Array.from(document.getElementsByTagName('div')).find(element => element.id === 'github_pages_url');
    const webhostUrlDiv = Array.from(document.getElementsByTagName('div')).find(element => element.id === 'webhost_url');
    if (githubUrlDiv) {
        githubUrlDiv.insertAdjacentHTML('afterbegin', '<a target="_blank" rel="noopener noreferrer" href="https://docs.github.com/en/pages">Powered by GitHub Pages</a>');
    }
    if (webhostUrlDiv) {
        webhostUrlDiv.insertAdjacentHTML('afterbegin', '<a target="_blank" rel="noopener noreferrer" href="https://www.000webhost.com">Powered by 000webhost</a>');
    }
}
function putCounter() {
    const counterDiv = Array.from(document.getElementsByTagName('div')).find(element => element.id === 'counter');
    if (counterDiv) {
        if (localStorage && localStorage.getItem('username') && typeof localStorage.getItem('username') === 'string') {
            const usernameString = localStorage.getItem('username');
            counterDiv.insertAdjacentHTML('afterbegin', '<img src="https://yu-64b.000webhostapp.com//?parameter=0&username=' + usernameString + '" alt="カウンター" crossorigin="anonymous">');
        }
        else {
            counterDiv.insertAdjacentHTML('afterbegin', '<img src="https://yu-64b.000webhostapp.com//?paramerter=0" alt="カウンター" crossorigin="anonymous">');
        }
    }
}
