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
        createObjectAndTable(doc);
    };
    reader.readAsText(file);
}
function createObjectAndTable(doc) {
    // create object
    if (!(doc instanceof Document))
        return;
    const gradeTableElements = Array.from(doc.getElementsByTagName('table')).filter(tableElement => tableElement.className === 'singleTableLine');
    const gradeTableElement = gradeTableElements.find(tableElement => { var _a, _b; return (_b = ((_a = tableElement.parentElement) === null || _a === void 0 ? void 0 : _a.id) === 'singleTableArea') !== null && _b !== void 0 ? _b : false; });
    if (!gradeTableElement)
        return;
    const rowElements = Array.from(gradeTableElement.rows);
    const firstRowElement = rowElements.shift();
    if (!firstRowElement)
        return;
    const firstCellElements = Array.from(firstRowElement.cells);
    const tmpHeadTexts = [];
    for (const cellElement of firstCellElements) {
        if (!cellElement.textContent || cellElement.textContent.trim() === '')
            return;
        tmpHeadTexts.push(cellElement.textContent.trim());
    }
    headTexts.length = 0;
    for (const tmpHeadText of tmpHeadTexts)
        headTexts.push(tmpHeadText);
    // create table
    if (!tableElement)
        return;
    while (tableElement.lastChild) {
        tableElement.removeChild(tableElement.lastChild);
    }
    const tableHeadElement = document.createElement('thead');
    const tableRowElement = document.createElement('tr');
    for (const headText of headTexts.concat(additionalHeadTexts)) {
        const tableCellElement = document.createElement('th');
        tableCellElement.textContent = headText;
        tableRowElement.appendChild(tableCellElement);
    }
    tableHeadElement.appendChild(tableRowElement);
    tableElement.appendChild(tableHeadElement);
    // create object
    tableObject.length = 0;
    // create table
    const talbeBodyElement = document.createElement('tbody');
    tableElement.appendChild(talbeBodyElement);
    // create object
    for (const rowElement of rowElements) {
        const cellElements = Array.from(rowElement.cells);
        if (cellElements.slice(1).every(cell => !cell.textContent || cell.textContent.trim() === ''))
            continue;
        const rowObject = {};
        // create table
        const tableRowElement = document.createElement('tr');
        // create object
        for (const [i, cellElement] of cellElements.entries()) {
            // if (!cellElement.textContent || cellElement.textContent.trim() === '') continue;
            // const cellText = cellElement.textContent.trim();
            // cteate table
            const tableCellElement = document.createElement('td');
            const labelElement = document.createElement('label');
            const textInputElement = document.createElement('input');
            labelElement.appendChild(textInputElement);
            tableCellElement.appendChild(labelElement);
            tableRowElement.appendChild(tableCellElement);
            if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5) {
                textInputElement.classList.add('small');
            }
            else {
                textInputElement.classList.add('large');
            }
            // create object
            if (i === 1 || i === 3 || i === 4) {
                // create table
                textInputElement.type = 'number';
                // create object
                if (!cellElement.textContent || cellElement.textContent.trim() === '')
                    continue;
                const cellText = cellElement.textContent.trim();
                if (!headTexts[i] || parseFloat(cellText) === NaN)
                    return;
                rowObject[headTexts[i]] = parseFloat(cellText);
                // create table
                textInputElement.value = cellText;
                // create object
            }
            else {
                // create table
                textInputElement.type = 'text';
                // create object
                if (!cellElement.textContent || cellElement.textContent.trim() === '')
                    continue;
                const cellText = cellElement.textContent.trim();
                if (!headTexts[i])
                    return;
                rowObject[headTexts[i]] = cellText;
                // create table
                textInputElement.value = cellText;
                // create object
            }
        }
        // create table
        for (let i = 0; i < additionalHeadTexts.length; i++) {
            const tableCellElement = document.createElement('td');
            const labelElement = document.createElement('label');
            const textInputElement = document.createElement('input');
            if (i === 0 || i === 1) {
                textInputElement.type = 'number';
                textInputElement.classList.add('small');
            }
            else if (i === 2) {
                textInputElement.type = 'checkbox';
            }
            else {
                textInputElement.type = 'button';
            }
            labelElement.appendChild(textInputElement);
            tableCellElement.appendChild(labelElement);
            tableRowElement.appendChild(tableCellElement);
        }
        // create object
        tableObject.push(rowObject);
        // create table
        talbeBodyElement.appendChild(tableRowElement);
        // create object
    }
}
