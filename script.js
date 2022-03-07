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
    const infinityFreeUrlDiv = Array.from(document.getElementsByTagName('div')).find(element => element.id === 'infinityfree_url');
    if (githubUrlDiv) {
        githubUrlDiv.insertAdjacentHTML('afterbegin', '<a target="_blank" rel="noopener noreferrer" href="https://docs.github.com/en/pages">Powered by GitHub Pages</a>');
    }
    if (infinityFreeUrlDiv) {
        infinityFreeUrlDiv.insertAdjacentHTML('afterbegin', '<a target="_blank" rel="noopener noreferrer" href="https://infinityfree.net/">Powered by InfinityFree</a>');
    }
}
function putCounter() {
    const counterDiv = Array.from(document.getElementsByTagName('div')).find(element => element.id === 'counter');
    if (counterDiv) {
        if (localStorage && localStorage.getItem('username') && typeof localStorage.getItem('username') === 'string') {
            const usernameString = localStorage.getItem('username');
            counterDiv.insertAdjacentHTML('afterbegin', '<img src="https://yu-64b.infinityfreeapp.com/?parameter=0&username=' + usernameString + '">');
        }
        else {
            counterDiv.insertAdjacentHTML('afterbegin', '<img src="https://yu-64b.infinityfreeapp.com/?paramerter=0">');
        }
    }
}
