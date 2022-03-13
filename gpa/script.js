'use strict';
const headTexts = ['科目名', '単位', '評価', '素点', '年度', '学期', '教員氏名'];
const additionalHeadTexts = ['GP', '単位数×GP', '選択', '削除'];
const tableObject = [];
const fileInputElement = document.getElementById('file_input');
const tableHeadElement = document.getElementById('table_head');
const talbeBodyElement = document.getElementById('table_body');
const calcButtonInputElement = document.getElementById('button_input');
const addButtonInputElement = document.getElementById('add_button_input');
if (fileInputElement instanceof HTMLInputElement) {
    fileInputElement.addEventListener('change', handleFile);
}
if (calcButtonInputElement instanceof HTMLInputElement) {
    calcButtonInputElement.addEventListener('click', calculate);
}
if (addButtonInputElement instanceof HTMLInputElement) {
    addButtonInputElement.addEventListener('click', addRow);
}
if (tableHeadElement instanceof HTMLTableSectionElement) {
    tableHeadElement.appendChild(createHeadRow(headTexts.concat(additionalHeadTexts)));
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
    if (!(tableHeadElement instanceof HTMLTableSectionElement) || !(talbeBodyElement instanceof HTMLTableSectionElement))
        return;
    // delete head texts
    headTexts.length = 0;
    // delete table head
    while (tableHeadElement.lastChild) {
        tableHeadElement.removeChild(tableHeadElement.lastChild);
    }
    // delete table body
    while (talbeBodyElement.lastChild) {
        talbeBodyElement.removeChild(talbeBodyElement.lastChild);
    }
    // read table
    const gradeTableElements = Array.from(doc.getElementsByClassName('singleTableLine'));
    const gradeTableElement = gradeTableElements.find(tableElement => { var _a; return ((_a = tableElement.parentElement) === null || _a === void 0 ? void 0 : _a.id) === 'singleTableArea'; });
    if (!(gradeTableElement instanceof HTMLTableElement))
        return;
    const gradeRowElements = Array.from(gradeTableElement.rows);
    // read table head
    const gradeFirstRowElement = gradeRowElements.shift();
    if (!gradeFirstRowElement)
        return;
    const gradeFirstCellElements = gradeFirstRowElement.cells;
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
    // create table body
    for (const gradeRowElement of gradeRowElements) {
        const gradeCellElements = Array.from(gradeRowElement.cells);
        if (gradeCellElements.slice(1).every(cellElement => !cellElement.textContent || cellElement.textContent.trim() === ''))
            continue;
        const rowElement = document.createElement('tr');
        for (const [i, gradeCellElement] of gradeCellElements.entries()) {
            const cellElement = document.createElement('td');
            const labelElement = document.createElement('label');
            const textInputElement = document.createElement('input');
            labelElement.classList.add('outline');
            if (i === 1 || i === 3 || i === 4) {
                textInputElement.type = 'number';
                textInputElement.classList.add('small');
            }
            else if (i === 2 || i === 5) {
                textInputElement.type = 'text';
                textInputElement.classList.add('small');
            }
            else {
                textInputElement.type = 'text';
                textInputElement.classList.add('large');
            }
            if (gradeCellElement.textContent && gradeCellElement.textContent.trim() !== '') {
                const cellText = gradeCellElement.textContent.trim();
                textInputElement.value = cellText;
            }
            labelElement.appendChild(textInputElement);
            cellElement.appendChild(labelElement);
            rowElement.appendChild(cellElement);
        }
        for (let i = 0; i < additionalHeadTexts.length; i++) {
            const cellElement = document.createElement('td');
            const labelElement = document.createElement('label');
            const inputElement = document.createElement('input');
            if (i === 0 || i === 1) {
                labelElement.classList.add('outline');
                inputElement.type = 'number';
                inputElement.classList.add('small');
            }
            else if (i === 2) {
                inputElement.type = 'checkbox';
                inputElement.checked = true;
            }
            else {
                inputElement.type = 'button';
                inputElement.value = '削除';
                inputElement.addEventListener('click', removeRow);
            }
            labelElement.appendChild(inputElement);
            cellElement.appendChild(labelElement);
            rowElement.appendChild(cellElement);
        }
        talbeBodyElement.appendChild(rowElement);
    }
}
function addRow() {
    if (!(talbeBodyElement instanceof HTMLTableSectionElement))
        return;
    const texts = [];
    texts.length = headTexts.length;
    texts.fill('');
    talbeBodyElement.appendChild(createRow(texts));
}
function removeRow(event) {
    if (!(event instanceof Event) || !(event.currentTarget instanceof HTMLInputElement))
        return;
    const removeButtonInputElement = event.currentTarget;
    const rowElement = removeButtonInputElement.closest('tr');
    if (!rowElement)
        return;
    const talbeBodyElement = rowElement.parentElement;
    if (!talbeBodyElement)
        return;
    talbeBodyElement.removeChild(rowElement);
}
function createHeadRow(texts) {
    const rowElement = document.createElement('tr');
    for (let i = 0; i < headTexts.concat(additionalHeadTexts).length; i++) {
        const cellElement = document.createElement('th');
        if (texts[i]) {
            const textNode = document.createTextNode(texts[i]);
            cellElement.appendChild(textNode);
        }
        else {
            const textNode = document.createTextNode('');
            cellElement.appendChild(textNode);
        }
        rowElement.appendChild(cellElement);
    }
    return rowElement;
}
function createRow(texts) {
    const rowElement = document.createElement('tr');
    for (let i = 0; i < headTexts.length; i++) {
        const cellElement = document.createElement('td');
        const labelElement = document.createElement('label');
        const textInputElement = document.createElement('input');
        labelElement.classList.add('outline');
        if (i === 1 || i === 3 || i === 4) {
            textInputElement.type = 'number';
            textInputElement.classList.add('small');
        }
        else if (i === 2 || i === 5) {
            textInputElement.type = 'text';
            textInputElement.classList.add('small');
        }
        else {
            textInputElement.type = 'text';
            textInputElement.classList.add('large');
        }
        if (texts[i]) {
            textInputElement.value = texts[i];
        }
        labelElement.appendChild(textInputElement);
        cellElement.appendChild(labelElement);
        rowElement.appendChild(cellElement);
    }
    for (let i = 0; i < additionalHeadTexts.length; i++) {
        const cellElement = document.createElement('td');
        const labelElement = document.createElement('label');
        const inputElement = document.createElement('input');
        if (i === 0 || i === 1) {
            labelElement.classList.add('outline');
            inputElement.type = 'number';
            inputElement.classList.add('small');
        }
        else if (i === 2) {
            inputElement.type = 'checkbox';
            inputElement.checked = true;
        }
        else {
            inputElement.type = 'button';
            inputElement.value = '削除';
            inputElement.addEventListener('click', removeRow);
        }
        labelElement.appendChild(inputElement);
        cellElement.appendChild(labelElement);
        rowElement.appendChild(cellElement);
    }
    return rowElement;
}
function calculate() {
}
