'use strict';
const headTexts = ['科目名', '単位', '評価', '素点', '年度', '学期', '教員氏名'];
const additionalHeadTexts = ['GP', '単位数×GP', '選択', '削除'];
const tableHeadElement = document.getElementById('table-head');
const talbeBodyElement = document.getElementById('table-body');
setupGPA();
function setupGPA() {
    const fileInputElement = document.getElementById('file-input');
    const calcGPButtonInputElement = document.getElementById('calc-gp-button-input');
    const calcGPAButtonInputElement = document.getElementById('calc-gpa-button-input');
    const addButtonInputElement = document.getElementById('add-button-input');
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
}
function handleFile(event) {
    if (!(event instanceof Event) || !(event.currentTarget instanceof HTMLInputElement) || !event.currentTarget.files) {
        return;
    }
    const file = event.currentTarget.files[0];
    if (!file || file.type !== 'text/html') {
        return;
    }
    const reader = new FileReader();
    reader.onload = event => {
        if (!(event.target instanceof FileReader) || typeof event.target.result !== 'string') {
            return;
        }
        const htmlText = event.target.result;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        createTable(doc);
    };
    reader.readAsText(file);
}
function createTable(doc) {
    if (!(tableHeadElement instanceof HTMLTableSectionElement) || !(talbeBodyElement instanceof HTMLTableSectionElement)) {
        return;
    }
    headTexts.length = 0;
    while (tableHeadElement.lastChild) {
        tableHeadElement.removeChild(tableHeadElement.lastChild);
    }
    while (talbeBodyElement.lastChild) {
        talbeBodyElement.removeChild(talbeBodyElement.lastChild);
    }
    const gradeTableElements = Array.from(doc.getElementsByTagName('table')).filter(tableElement => tableElement.classList.contains('singleTableLine'));
    const gradeTableElement = gradeTableElements.find(tableElement => tableElement.parentElement instanceof HTMLDivElement && tableElement.parentElement.id === 'singleTableArea');
    if (!gradeTableElement) {
        return;
    }
    for (const [i, rowElement] of Array.from(gradeTableElement.rows).entries()) {
        const texts = readRowTexts(rowElement);
        if (i === 0) {
            if (texts.some(text => text === '')) {
                return;
            }
            for (const text of texts) {
                headTexts.push(text);
            }
            tableHeadElement.appendChild(createHeadRow(headTexts.concat(additionalHeadTexts)));
        }
        else {
            if (texts.slice(1).every(text => text === '')) {
                continue;
            }
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
    if (!(talbeBodyElement instanceof HTMLTableSectionElement)) {
        return;
    }
    const texts = [];
    texts.length = headTexts.length;
    texts.fill('');
    talbeBodyElement.appendChild(createBodyRow(texts));
}
function removeRow(event) {
    if (!(event instanceof Event) || !(event.currentTarget instanceof HTMLInputElement)) {
        return;
    }
    const removeButtonInputElement = event.currentTarget;
    const rowElement = removeButtonInputElement.closest('tr');
    if (!rowElement) {
        return;
    }
    const talbeBodyElement = rowElement.parentElement;
    if (!talbeBodyElement) {
        return;
    }
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
    const scoreToEvaluationTexts = ['D', 'D', 'D', 'D', 'D', 'D', 'C', 'B', 'A', 'AA', 'AA'];
    resetCellsColor();
    if (!(talbeBodyElement instanceof HTMLTableSectionElement)) {
        return;
    }
    for (const rowElement of talbeBodyElement.rows) {
        const cellElements = rowElement.cells;
        const creditCellElement = cellElements[1];
        const evaluationCellElement = cellElements[2];
        const scoreCellElement = cellElements[3];
        const GPCellElement = cellElements[headTexts.length];
        const GPxCreditCellElement = cellElements[headTexts.length + 1];
        const selectCellElement = cellElements[headTexts.length + 2];
        if (!creditCellElement || !evaluationCellElement || !scoreCellElement || !GPCellElement || !GPxCreditCellElement || !selectCellElement) {
            return;
        }
        const creditTextInputElement = creditCellElement.getElementsByTagName('input')[0];
        const evaluationTextInputElement = evaluationCellElement.getElementsByTagName('input')[0];
        const scoreTextInputElement = scoreCellElement.getElementsByTagName('input')[0];
        const GPTextInputElement = GPCellElement.getElementsByTagName('input')[0];
        const GPxCreditTextIntpueElement = GPxCreditCellElement.getElementsByTagName('input')[0];
        const checkboxInputElement = selectCellElement.getElementsByTagName('input')[0];
        if (!creditTextInputElement || !evaluationTextInputElement || !scoreTextInputElement || !GPTextInputElement || !GPxCreditTextIntpueElement || !checkboxInputElement) {
            return;
        }
        if (!checkboxInputElement.checked) {
            continue;
        }
        GPTextInputElement.value = '';
        GPxCreditTextIntpueElement.value = '';
        const inputEvaluationText = evaluationTextInputElement.value.trim().replace(/[\uFF01-\uFF5E]/g, text => String.fromCharCode(text.charCodeAt(0) - 0xFEE0)).toUpperCase();
        const inputScoreNumber = scoreTextInputElement.value.trim() !== '' ? Number(scoreTextInputElement.value.trim()) : NaN;
        const checkedEvaluationText = scoreToEvaluationTexts.find(evaluationText => inputEvaluationText === evaluationText);
        if (scoreToEvaluationTexts[inputScoreNumber] !== inputEvaluationText) {
            if (checkedEvaluationText && inputScoreNumber in scoreToEvaluationTexts) {
                evaluationCellElement.classList.add('warning');
                scoreCellElement.classList.add('warning');
            }
            else if (checkedEvaluationText) {
                scoreCellElement.classList.add('warning');
            }
            else if (inputScoreNumber in scoreToEvaluationTexts) {
                evaluationCellElement.classList.add('warning');
            }
            else {
                evaluationCellElement.classList.add('error');
                scoreCellElement.classList.add('error');
                continue;
            }
        }
        const GPNumber = Math.min(Math.max((checkedEvaluationText ? scoreToEvaluationTexts.lastIndexOf(checkedEvaluationText) : inputScoreNumber) - 5, 0), 4);
        GPTextInputElement.value = GPNumber.toString();
        const inputCreditNumber = creditTextInputElement.value.trim() !== '' ? Number(creditTextInputElement.value.trim()) : NaN;
        if (isNaN(inputCreditNumber)) {
            creditCellElement.classList.add('warning');
        }
        const GPxCreditNumber = GPNumber * (isNaN(inputCreditNumber) ? 0 : inputCreditNumber);
        GPxCreditTextIntpueElement.value = GPxCreditNumber.toString();
    }
}
function calculateGPA() {
}
function resetCellsColor() {
    if (!(talbeBodyElement instanceof HTMLTableSectionElement)) {
        return;
    }
    const cells = talbeBodyElement.getElementsByTagName('td');
    for (const cell of cells) {
        cell.classList.remove('warning');
        cell.classList.remove('error');
    }
}
