'use strict';
init();
function init() {
    const url = new URL(document.location.href);
    if (url.hostname.toLowerCase() === 'yu-64b.github.io') {
        putUrls();
        putCounter();
    }
}
function putUrls() {
    const githubUrlDiv = Array.from(document.getElementsByTagName('div')).find(element => element.id === 'github_pages_url');
    const starUrlDiv = Array.from(document.getElementsByTagName('div')).find(element => element.id === 'star_server_free_url');
    if (githubUrlDiv) {
        githubUrlDiv.insertAdjacentHTML('afterbegin', '<a target="_blank" rel="noopener noreferrer" href="https://docs.github.com/en/pages">Powered by GitHub Pages</a>');
    }
    if (starUrlDiv) {
        starUrlDiv.insertAdjacentHTML('afterbegin', '<a target="_blank" rel="noopener noreferrer" href="https://www.star.ne.jp/free/">Powered by Netowl\'s StarServerFree</a>');
    }
}
function putCounter() {
    const counterDiv = Array.from(document.getElementsByTagName('div')).find(element => element.id === 'counter');
    if (counterDiv) {
        if (localStorage && localStorage.getItem('username') && typeof localStorage.getItem('username') === 'string') {
            const usernameString = localStorage.getItem('username');
            counterDiv.insertAdjacentHTML('afterbegin', '<img src="http://yu64b.starfree.jp/counter/?parameter=0&username=' + usernameString + '">');
        }
        else {
            counterDiv.insertAdjacentHTML('afterbegin', '<img src="http://yu64b.starfree.jp/counter/?paramerter=0">');
        }
    }
}
