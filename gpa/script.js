'use strict';
const headTexts = ['科目名', '単位', '評価', '素点', '年度', '学期', '教員氏名'];
const additionalHeadTexts = ['GP', '単位数×GP', '選択', '削除'];
const fileInputElement = document.getElementById('file_input');
const tableHeadElement = document.getElementById('table_head');
const talbeBodyElement = document.getElementById('table_body');
const calcGPButtonInputElement = document.getElementById('calc_gp_button_input');
const calcGPAButtonInputElement = document.getElementById('calc_gpa_button_input');
const addButtonInputElement = document.getElementById('add_button_input');
if (fileInputElement instanceof HTMLInputElement) {
    fileInputElement.addEventListener('change', handleFile);
}
if (calcGPButtonInputElement instanceof HTMLInputElement) {
    calcGPButtonInputElement.addEventListener('click', calculateGP);
}
if (calcGPAButtonInputElement instanceof HTMLInputElement) {
    calcGPAButtonInputElement.addEventListener('click', calculateGPA);
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
    if ((file === null || file === void 0 ? void 0 : file.type) !== 'text/html')
        return;
    const reader = new FileReader();
    reader.onload = (event) => {
        var _a;
        if (typeof ((_a = event.target) === null || _a === void 0 ? void 0 : _a.result) !== 'string')
            return;
        const htmlText = event.target.result;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        createTable(doc);
    };
    reader.readAsText(file);
}
function createTable(doc) {
    if (!(tableHeadElement instanceof HTMLTableSectionElement) || !(talbeBodyElement instanceof HTMLTableSectionElement))
        return;
    headTexts.length = 0;
    while (tableHeadElement.lastChild) {
        tableHeadElement.removeChild(tableHeadElement.lastChild);
    }
    while (talbeBodyElement.lastChild) {
        talbeBodyElement.removeChild(talbeBodyElement.lastChild);
    }
    const gradeTableElements = Array.from(doc.getElementsByClassName('singleTableLine'));
    const gradeTableElement = gradeTableElements.find(tableElement => { var _a; return ((_a = tableElement.parentElement) === null || _a === void 0 ? void 0 : _a.id) === 'singleTableArea'; });
    if (!(gradeTableElement instanceof HTMLTableElement))
        return;
    for (const [i, rowElement] of Array.from(gradeTableElement.rows).entries()) {
        const texts = readRowTexts(rowElement);
        if (i === 0) {
            if (texts.some(text => text === ''))
                return;
            for (const text of texts) {
                headTexts.push(text);
            }
            tableHeadElement.appendChild(createHeadRow(headTexts.concat(additionalHeadTexts)));
        }
        else {
            if (texts.slice(1).every(text => text === ''))
                continue;
            talbeBodyElement.appendChild(createBodyRow(texts));
        }
    }
}
function readRowTexts(rowElement) {
    const texts = [];
    for (const cellElement of rowElement.cells) {
        if (cellElement.textContent) {
            texts.push(cellElement.textContent.trim());
        }
        else {
            texts.push('');
        }
    }
    return texts;
}
function addRow() {
    if (!(talbeBodyElement instanceof HTMLTableSectionElement))
        return;
    const texts = [];
    texts.length = headTexts.length;
    texts.fill('');
    talbeBodyElement.appendChild(createBodyRow(texts));
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
        const text = texts[i];
        if (text) {
            const textNode = document.createTextNode(text);
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
function createBodyRow(texts) {
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
        const text = texts[i];
        if (text) {
            textInputElement.value = text;
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
function calculateGP() {
    var _a;
    if (!(talbeBodyElement instanceof HTMLTableSectionElement))
        return;
    for (const rowElement of talbeBodyElement.rows) {
        const cellElements = rowElement.cells;
        const selectCellElement = cellElements[headTexts.length + 2];
        if (!(((_a = selectCellElement === null || selectCellElement === void 0 ? void 0 : selectCellElement.firstChild) === null || _a === void 0 ? void 0 : _a.firstChild) instanceof HTMLInputElement))
            return;
        const checkboxInputElement = selectCellElement.firstChild.firstChild;
        if (checkboxInputElement.checked)
            continue;
        const creditCellElement = cellElements[1];
        const evaluationCellElement = cellElements[2];
        const scoreCellElement = cellElements[3];
        const GPCellElement = cellElements[headTexts.length];
        const GPxCreditCellElement = cellElements[headTexts.length + 1];
    }
}
function calculateGPA() {
}
