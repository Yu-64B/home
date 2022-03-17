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
    mainDiv.classList.add('main-outer');
    backgroundDiv.appendChild(createHeader());
    mainDiv.appendChild(main);
    backgroundDiv.appendChild(mainDiv);
    backgroundDiv.appendChild(createFooter());
    document.body.appendChild(backgroundDiv);
}
function createHeader() {
    const header = document.createElement('header');
    const headerStartDiv = document.createElement('div');
    const iconDiv = document.createElement('div');
    const iconAnchor = document.createElement('a');
    const iconUrl = new URL('https://yu-64b.github.io/home');
    const iconImg = document.createElement('img');
    const iconImgUrl = new URL('https://yu-64b.github.io/home/pack_icon.png');
    const headerEndDiv = document.createElement('div');
    header.classList.add('header-footer-flex-container', 'header-footer-wrap-container', 'header-footer-large-gap-container');
    headerStartDiv.classList.add('header-start-item');
    iconAnchor.classList.add('header-footer-flex-container');
    iconAnchor.href = iconUrl.href;
    iconImg.src = iconImgUrl.href;
    headerEndDiv.classList.add('header-end-item');
    iconAnchor.appendChild(iconImg);
    iconDiv.appendChild(iconAnchor);
    headerStartDiv.appendChild(iconDiv);
    header.appendChild(headerStartDiv);
    headerEndDiv.appendChild(createCounter());
    header.appendChild(headerEndDiv);
    return header;
}
function createCounter() {
    const counterDiv = document.createElement('div');
    const counterInnerDiv = document.createElement('div');
    const textDiv = document.createElement('div');
    const text = document.createTextNode('表示された回数');
    const imgDiv = document.createElement('div');
    const img = document.createElement('img');
    const imgUrl = new URL('https://yu-64b.000webhostapp.com');
    const urlDiv = document.createElement('div');
    const urlAnchor = document.createElement('a');
    const url = new URL('https://www.000webhost.com');
    const urlText = document.createTextNode('Powered by 000webhost');
    counterDiv.classList.add('counter-item');
    counterInnerDiv.classList.add('header-footer-flex-container', 'header-footer-wrap-container', 'header-footer-small-gap-container');
    imgDiv.classList.add('header-footer-flex-container');
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
    urlAnchor.classList.add('header-footer-link');
    urlAnchor.target = '_blank';
    urlAnchor.rel = 'noopener noreferrer';
    urlAnchor.href = url.href;
    textDiv.appendChild(text);
    counterInnerDiv.appendChild(textDiv);
    imgDiv.appendChild(img);
    counterInnerDiv.appendChild(imgDiv);
    counterDiv.appendChild(counterInnerDiv);
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
    footer.classList.add('header-footer-flex-container');
    urlAnchor.classList.add('header-footer-link');
    urlAnchor.target = '_blank';
    urlAnchor.rel = 'noopener noreferrer';
    urlAnchor.href = url.href;
    urlAnchor.appendChild(urlText);
    urlDiv.appendChild(urlAnchor);
    footer.appendChild(urlDiv);
    return footer;
}
