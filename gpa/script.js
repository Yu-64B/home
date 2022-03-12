'use strict';
const headTexts = ['科目名', '単位', '評価', '素点', '年度', '学期', '教員氏名'];
const additionalHeadTexts = ['GP', '単位数×GP', '選択', '削除'];
const tableObject = [];
const inputElement = Array.from(document.getElementsByTagName('input')).find(inputElement => inputElement.id === 'input');
const tableElement = Array.from(document.getElementsByTagName('table')).find(inputElement => inputElement.id === 'table');
if (inputElement) {
    inputElement.addEventListener('change', handleFile);
}
function handleFile(event) {
    if (!(event instanceof Event) || !(event.currentTarget instanceof HTMLInputElement) || !event.currentTarget.files)
        return;
    const file = event.currentTarget.files[0];
    if (!file || file.type !== 'text/html')
        return;
    const reader = new FileReader();
    reader.onload = (event) => {
        if (!event.target || typeof event.target.result !== 'string')
            return;
        const htmlText = event.target.result;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        createTable(doc);
    };
    reader.readAsText(file);
}
function createTable(doc) {
    // delete table
    if (!tableElement)
        return;
    const tableHeadElement = tableElement.tHead;
    const talbeBodyElement = tableElement.tBodies[0];
    if (!tableHeadElement || !talbeBodyElement)
        return;
    // delete head texts
    headTexts.length = 0;
    // delete table head
    while (tableHeadElement.lastChild) {
        tableElement.removeChild(tableHeadElement.lastChild);
    }
    // delete table body
    while (talbeBodyElement.lastChild) {
        tableElement.removeChild(talbeBodyElement.lastChild);
    }
    // read table
    if (!(doc instanceof Document))
        return;
    const gradeTableElements = Array.from(doc.getElementsByTagName('table')).filter(tableElement => tableElement.className === 'singleTableLine');
    const gradeTableElement = gradeTableElements.find(tableElement => { var _a, _b; return (_b = ((_a = tableElement.parentElement) === null || _a === void 0 ? void 0 : _a.id) === 'singleTableArea') !== null && _b !== void 0 ? _b : false; });
    if (!gradeTableElement)
        return;
    const gradeRowElements = Array.from(gradeTableElement.rows);
    // read table head
    const gradeFirstRowElement = gradeRowElements.shift();
    if (!gradeFirstRowElement)
        return;
    const gradeFirstCellElements = Array.from(gradeFirstRowElement.cells);
    const tmpHeadTexts = [];
    for (const gradeCellElement of gradeFirstCellElements) {
        if (!gradeCellElement.textContent || gradeCellElement.textContent.trim() === '')
            return;
        tmpHeadTexts.push(gradeCellElement.textContent.trim());
    }
    // create head texts
    for (const tmpHeadText of tmpHeadTexts) {
        headTexts.push(tmpHeadText);
    }
    // create table head
    const rowElement = document.createElement('tr');
    for (const headText of headTexts.concat(additionalHeadTexts)) {
        const cellElement = document.createElement('th');
        cellElement.textContent = headText;
        rowElement.appendChild(cellElement);
    }
    tableHeadElement.appendChild(rowElement);
    tableElement.appendChild(tableHeadElement);
    // create table body
    for (const gradeRowElement of gradeRowElements) {
        const gradeCellElements = Array.from(gradeRowElement.cells);
        if (gradeCellElements.slice(1).every(cellElement => !cellElement.textContent || cellElement.textContent.trim() === ''))
            continue;
        const tableRowElement = document.createElement('tr');
        for (const [i, gradeCellElement] of gradeCellElements.entries()) {
            const cellElement = document.createElement('td');
            const labelElement = document.createElement('label');
            const textInputElement = document.createElement('input');
            labelElement.classList.add('outline');
            if (i === 1 || i === 3 || i === 4) {
                textInputElement.type = 'number';
            }
            else {
                textInputElement.type = 'text';
            }
            if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5) {
                textInputElement.classList.add('small');
            }
            else {
                textInputElement.classList.add('large');
            }
            if (gradeCellElement.textContent && gradeCellElement.textContent.trim() !== '') {
                const cellText = gradeCellElement.textContent.trim();
                textInputElement.value = cellText;
            }
            labelElement.appendChild(textInputElement);
            cellElement.appendChild(labelElement);
            tableRowElement.appendChild(cellElement);
        }
        for (let i = 0; i < additionalHeadTexts.length; i++) {
            const cellElement = document.createElement('td');
            const labelElement = document.createElement('label');
            const textInputElement = document.createElement('input');
            if (i === 0 || i === 1) {
                labelElement.classList.add('outline');
                textInputElement.type = 'number';
                textInputElement.classList.add('small');
            }
            else if (i === 2) {
                textInputElement.type = 'checkbox';
                textInputElement.checked = true;
            }
            else {
                textInputElement.type = 'button';
                textInputElement.value = '削除';
            }
            labelElement.appendChild(textInputElement);
            cellElement.appendChild(labelElement);
            tableRowElement.appendChild(cellElement);
        }
        talbeBodyElement.appendChild(tableRowElement);
    }
    tableElement.appendChild(talbeBodyElement);
}
