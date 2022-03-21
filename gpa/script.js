'use strict';
const headTexts = ['科目名', '単位', '評価', '素点', '年度', '学期', '教員氏名'];
const additionalHeadTexts = ['GP', '単位数×GP', '選択', '削除'];
const tableHeadElement = document.getElementById('table-head');
const talbeBodyElement = document.getElementById('table-body');
const filterDivElement = document.getElementById('filter-div');
setupGPA();
function setupGPA() {
    const fileInputElement = document.getElementById('file-input');
    const calcGPAButtonInputElement = document.getElementById('calc-gpa-button-input');
    const addButtonInputElement = document.getElementById('add-button-input');
    const readTableButtonInputElement = document.getElementById('read-table-button-input');
    const filterDetailsElement = document.getElementById('filter-details');
    if (fileInputElement instanceof HTMLInputElement) {
        fileInputElement.addEventListener('change', handleFile);
    }
    if (calcGPAButtonInputElement instanceof HTMLInputElement) {
        calcGPAButtonInputElement.addEventListener('click', calculateGPA);
    }
    if (addButtonInputElement instanceof HTMLInputElement) {
        addButtonInputElement.addEventListener('click', addRow);
    }
    if (tableHeadElement instanceof HTMLTableSectionElement) {
        tableHeadElement.appendChild(createHeadRow());
    }
    if (readTableButtonInputElement instanceof HTMLInputElement) {
        readTableButtonInputElement.addEventListener('click', createTableFromText);
    }
    if (filterDetailsElement instanceof HTMLDetailsElement) {
        filterDetailsElement.addEventListener('toggle', updateFilter);
    }
    createFilter();
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
        if (!event.target || typeof event.target.result !== 'string') {
            return;
        }
        const htmlText = event.target.result;
        const parser = new DOMParser();
        const gradeDocument = parser.parseFromString(htmlText, 'text/html');
        createTable(gradeDocument);
    };
    reader.readAsText(file);
}
function createTable(gradeDocument) {
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
    const gradeTableElements = Array.from(gradeDocument.getElementsByTagName('table')).filter(tableElement => tableElement.classList.contains('singleTableLine'));
    const gradeTableElement = gradeTableElements.find(tableElement => tableElement.parentElement instanceof HTMLDivElement && tableElement.parentElement.id === 'singleTableArea');
    if (!gradeTableElement) {
        return;
    }
    for (const [i, rowElement] of Array.from(gradeTableElement.rows).entries()) {
        const texts = readRowTexts(rowElement);
        if (i === 0) {
            if (texts.some(text => text === '') || texts.length !== (new Set(texts)).size) {
                return;
            }
            for (const text of texts) {
                headTexts.push(text);
            }
            tableHeadElement.appendChild(createHeadRow());
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
        if (cellElement.innerText) {
            texts.push(cellElement.innerText.trim());
        }
        else {
            texts.push('');
        }
    }
    return texts;
}
function createHeadRow() {
    const rowElement = document.createElement('tr');
    for (const text of headTexts.concat(additionalHeadTexts)) {
        const cellElement = document.createElement('th');
        const textNode = document.createTextNode(text);
        cellElement.appendChild(textNode);
        rowElement.appendChild(cellElement);
    }
    return rowElement;
}
function createBodyRow(texts) {
    const rowElement = document.createElement('tr');
    for (const [i, text] of headTexts.map((_, i) => { var _a; return (_a = texts[i]) !== null && _a !== void 0 ? _a : ''; }).entries()) {
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
        textInputElement.value = text;
        textInputElement.addEventListener('change', updateFilter);
        labelElement.appendChild(textInputElement);
        cellElement.appendChild(labelElement);
        rowElement.appendChild(cellElement);
    }
    for (const [i, _] of additionalHeadTexts.entries()) {
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
    if (!(talbeBodyElement instanceof HTMLTableSectionElement)) {
        return;
    }
    talbeBodyElement.removeChild(rowElement);
}
function calculateGPA() {
    if (!(talbeBodyElement instanceof HTMLTableSectionElement)) {
        return;
    }
    const scoreToEvaluationTexts = ['D', 'D', 'D', 'D', 'D', 'D', 'C', 'B', 'A', 'AA', 'AA'];
    let GPxCreditSumNumber = 0;
    let creditSumNumber = 0;
    resetCellsColor();
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
        const GPxCreditTextIntputElement = GPxCreditCellElement.getElementsByTagName('input')[0];
        const checkboxInputElement = selectCellElement.getElementsByTagName('input')[0];
        if (!creditTextInputElement || !evaluationTextInputElement || !scoreTextInputElement || !GPTextInputElement || !GPxCreditTextIntputElement || !checkboxInputElement) {
            return;
        }
        if (!checkboxInputElement.checked) {
            continue;
        }
        GPTextInputElement.value = '';
        GPxCreditTextIntputElement.value = '';
        const inputCreditNumber = creditTextInputElement.value.trim() !== '' ? Number(creditTextInputElement.value.trim()) : NaN;
        if (!isNaN(inputCreditNumber)) {
            creditSumNumber += inputCreditNumber;
        }
        else {
            creditCellElement.classList.add('warning');
        }
        const inputEvaluationText = evaluationTextInputElement.value.replace(/[\uFF01-\uFF5E]/g, char => String.fromCharCode(char.charCodeAt(0) - 0xFEE0)).toUpperCase().trim();
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
        const GPxCreditNumber = isNaN(inputCreditNumber) ? 0 : inputCreditNumber * GPNumber;
        GPxCreditTextIntputElement.value = GPxCreditNumber.toString();
        GPxCreditSumNumber += GPxCreditNumber;
    }
    showGPA(GPxCreditSumNumber, creditSumNumber);
}
function showGPA(GPxCreditSumNumber, creditSumNumber) {
    const GPxCreditSumTextIntputElement = document.getElementById('credit-gp-sum-text-input');
    const creditSumTextIntputElement = document.getElementById('credit-sum-text-input');
    const GPATextInputElement = document.getElementById('gpa-text-input');
    if (!(GPxCreditSumTextIntputElement instanceof HTMLInputElement)) {
        return;
    }
    if (!(creditSumTextIntputElement instanceof HTMLInputElement)) {
        return;
    }
    if (!(GPATextInputElement instanceof HTMLInputElement)) {
        return;
    }
    const GPANumber = creditSumNumber !== 0 ? GPxCreditSumNumber / creditSumNumber : 0;
    GPxCreditSumTextIntputElement.value = GPxCreditSumNumber.toString();
    creditSumTextIntputElement.value = creditSumNumber.toString();
    GPATextInputElement.value = GPANumber.toString();
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
function createFilter() {
    if (!(filterDivElement instanceof HTMLDivElement)) {
        return;
    }
    while (filterDivElement.lastChild) {
        filterDivElement.removeChild(filterDivElement.lastChild);
    }
    for (const text of headTexts) {
        const detailsElement = document.createElement('details');
        const summaryElement = document.createElement('summary');
        const textNode = document.createTextNode(text);
        summaryElement.appendChild(textNode);
        detailsElement.appendChild(summaryElement);
        filterDivElement.appendChild(detailsElement);
    }
}
function updateFilter() {
    const filterDetailsElement = document.getElementById('filter-details');
    if (!(filterDetailsElement instanceof HTMLDetailsElement) || !filterDetailsElement.open) {
        return;
    }
}
function createTableFromText() {
    if (!(tableHeadElement instanceof HTMLTableSectionElement) || !(talbeBodyElement instanceof HTMLTableSectionElement)) {
        return;
    }
    while (talbeBodyElement.lastChild) {
        talbeBodyElement.removeChild(talbeBodyElement.lastChild);
    }
    const textareaElement = document.getElementById('textarea');
    if (!(textareaElement instanceof HTMLTextAreaElement)) {
        return;
    }
    const rowTexts = textareaElement.value.trim().split('\n\n').map(text => text.trim());
    for (const [i, rowText] of rowTexts.entries()) {
        const cellTexts = rowText.split(/[\n|\t]+/).map(text => text.trim());
        if (cellTexts.length <= 1) {
            continue;
        }
        if (i === 0 && cellTexts.every(text => text !== '' && isNaN(Number(text))) && cellTexts.length === (new Set(cellTexts)).size && cellTexts.length === rowText.split(/\t/).length) {
            headTexts.length = 0;
            while (tableHeadElement.lastChild) {
                tableHeadElement.removeChild(tableHeadElement.lastChild);
            }
            for (const cellText of cellTexts) {
                headTexts.push(cellText);
            }
            tableHeadElement.appendChild(createHeadRow());
        }
        else {
            if (cellTexts.length === headTexts.length) {
                talbeBodyElement.appendChild(createBodyRow(cellTexts));
            }
            else if (cellTexts.length === headTexts.length - 1) {
                cellTexts.splice(1, 0, '');
                talbeBodyElement.appendChild(createBodyRow(cellTexts));
            }
            else {
                const texts = [];
                texts.length = headTexts.length;
                texts[0] = cellTexts[0];
                texts.fill('', 1);
                talbeBodyElement.appendChild(createBodyRow(texts));
            }
        }
    }
}
