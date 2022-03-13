'use strict';
setup();
function setup() {
    const url = new URL(document.location.href);
    if (url.hostname.toLowerCase() !== 'yu-64b.github.io') {
        return;
    }
    const main = document.getElementById('main');
    if (!main) {
        return;
    }
    const backgroundDiv = document.createElement('div');
    const mainDiv = document.createElement('div');
    backgroundDiv.classList.add('background');
    mainDiv.classList.add('main_outer');
    backgroundDiv.appendChild(createHeader());
    mainDiv.appendChild(main);
    backgroundDiv.appendChild(mainDiv);
    backgroundDiv.appendChild(createFooter());
    document.body.appendChild(backgroundDiv);
}
function createHeader() {
    const header = document.createElement('header');
    const iconDiv = document.createElement('div');
    const iconImg = document.createElement('img');
    iconDiv.classList.add('header_icon');
    iconImg.src = 'pack_icon.png';
    iconDiv.appendChild(iconImg);
    header.appendChild(iconDiv);
    header.appendChild(createCounter());
    return header;
}
function createCounter() {
    const counterDiv = document.createElement('div');
    const textDiv = document.createElement('div');
    const text = document.createTextNode('表示された回数');
    const imgDiv = document.createElement('div');
    const img = document.createElement('img');
    const imgUrl = new URL('https://yu-64b.000webhostapp.com');
    const urlDiv = document.createElement('div');
    const urlAnchor = document.createElement('a');
    const url = new URL('https://www.000webhost.com');
    const urlText = document.createTextNode('Powered by 000webhost');
    imgUrl.searchParams.set('id', '0');
    if (localStorage && localStorage.getItem('username') && typeof localStorage.getItem('username') === 'string') {
        const usernameString = localStorage.getItem('username');
        if (usernameString) {
            imgUrl.searchParams.set('username', usernameString);
        }
    }
    img.src = imgUrl.href;
    img.alt = 'カウンター';
    img.crossOrigin = 'anonymous';
    urlDiv.classList.add('url');
    urlAnchor.target = '_blank';
    urlAnchor.rel = 'noopener noreferrer';
    urlAnchor.href = url.href;
    textDiv.appendChild(text);
    counterDiv.appendChild(textDiv);
    imgDiv.appendChild(img);
    counterDiv.appendChild(imgDiv);
    urlAnchor.appendChild(urlText);
    urlDiv.appendChild(urlAnchor);
    counterDiv.appendChild(urlDiv);
    return counterDiv;
}
function createFooter() {
    const footer = document.createElement('footer');
    const urlDiv = document.createElement('div');
    const urlAnchor = document.createElement('a');
    const url = new URL('https://docs.github.com/en/pages');
    const urlText = document.createTextNode('Powered by GitHub Pages');
    urlDiv.classList.add('url');
    urlAnchor.target = '_blank';
    urlAnchor.rel = 'noopener noreferrer';
    urlAnchor.href = url.href;
    urlAnchor.appendChild(urlText);
    urlDiv.appendChild(urlAnchor);
    footer.appendChild(urlDiv);
    return footer;
}
