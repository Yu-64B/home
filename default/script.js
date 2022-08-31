'use strict';
setupDefault();
function setupDefault() {
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
    const putCounter = ['/home', '/home/', '/home/index.html'].includes(url.pathname);
    backgroundDiv.classList.add('background');
    mainDiv.classList.add('main-outer');
    backgroundDiv.appendChild(createHeader(putCounter));
    mainDiv.appendChild(main);
    backgroundDiv.appendChild(mainDiv);
    backgroundDiv.appendChild(createFooter());
    document.body.insertAdjacentElement('afterbegin', backgroundDiv);
}
function createHeader(putCounter) {
    const header = document.createElement('header');
    const iconAnchor = document.createElement('a');
    const iconUrl = new URL('https://yu-64b.github.io/home');
    const iconImg = document.createElement('img');
    const iconImgUrl = new URL('https://yu-64b.github.io/home/default/pack_icon.png');
    header.classList.add('header', 'header-footer-flex-container');
    iconAnchor.classList.add('header-footer-flex-container', 'icon-item');
    iconAnchor.href = iconUrl.href;
    iconImg.classList.add('img');
    iconImg.src = iconImgUrl.href;
    iconAnchor.appendChild(iconImg);
    header.appendChild(iconAnchor);
    if (putCounter) {
        header.appendChild(createCounter());
    }
    return header;
}
function createCounter() {
    const counterDiv = document.createElement('div');
    const counterInnerDiv = document.createElement('div');
    const textDiv = document.createElement('div');
    const text = document.createTextNode('表示された回数');
    const imgDiv = document.createElement('div');
    const img = document.createElement('img');
    const imgUrl = new URL('https://yu-64b.000webhostapp.com/counter');
    const urlDiv = document.createElement('div');
    const urlAnchor = document.createElement('a');
    const url = new URL('https://www.000webhost.com');
    const urlText = document.createTextNode('Powered by 000webhost');
    counterDiv.classList.add('counter-item');
    counterInnerDiv.classList.add('header-footer-flex-container');
    imgDiv.classList.add('header-footer-flex-container');
    imgUrl.searchParams.set('id', '0');
    if (localStorage && localStorage.getItem('username') && typeof localStorage.getItem('username') === 'string') {
        const usernameString = localStorage.getItem('username');
        if (usernameString) {
            imgUrl.searchParams.set('username', usernameString);
        }
    }
    img.classList.add('img');
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
    footer.classList.add('footer', 'header-footer-flex-container');
    urlAnchor.classList.add('header-footer-link');
    urlAnchor.target = '_blank';
    urlAnchor.rel = 'noopener noreferrer';
    urlAnchor.href = url.href;
    urlAnchor.appendChild(urlText);
    urlDiv.appendChild(urlAnchor);
    footer.appendChild(urlDiv);
    return footer;
}
