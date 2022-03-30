'use strict';
const headTexts = ['科目名', '単位', '評価', '素点', '年度', '学期', '教員氏名'];
const additionalHeadTexts = ['GP', '単位数×GP', '選択', '削除'];
const tableHeadElement = document.getElementById('table-head');
const talbeBodyElement = document.getElementById('table-body');
const filterOuterDivElement = document.getElementById('filter-outer-div');
setupGPA();
function setupGPA() {
    const htmlFileInputElement = document.getElementById('html-file-input');
    const readTableButtonInputElement = document.getElementById('read-table-button-input');
    const csvFileInputeElement = document.getElementById('csv-file-input');
    const calcGPAButtonInputElement = document.getElementById('calc-gpa-button-input');
    const addButtonInputElement = document.getElementById('add-button-input');
    const filterDetailsElement = document.getElementById('filter-outer-details');
    const selectRowsButtonInputElement = document.getElementById('select-rows-button-input');
    const deselectRowsButtonInputElement = document.getElementById('deselect-rows-button-input');
    const showRowsButtonInputElement = document.getElementById('show-rows-button-input');
    const hiddenRowsButtonInputElement = document.getElementById('hidden-rows-button-input');
    const saveCsvButtonInputElement = document.getElementById('save-csv-button-input');
    if (tableHeadElement instanceof HTMLTableSectionElement) {
        tableHeadElement.appendChild(createHeadRow());
    }
    createFilter();
    if (htmlFileInputElement instanceof HTMLInputElement) {
        htmlFileInputElement.addEventListener('change', handleFile);
    }
    if (readTableButtonInputElement instanceof HTMLInputElement) {
        readTableButtonInputElement.addEventListener('click', () => {
            createTableFromText();
            createFilter();
        });
    }
    if (csvFileInputeElement instanceof HTMLInputElement) {
        csvFileInputeElement.addEventListener('change', handleFile);
    }
    if (calcGPAButtonInputElement instanceof HTMLInputElement) {
        calcGPAButtonInputElement.addEventListener('click', calculateGPA);
    }
    if (addButtonInputElement instanceof HTMLInputElement) {
        addButtonInputElement.addEventListener('click', addRow);
    }
    if (filterDetailsElement instanceof HTMLDetailsElement) {
        filterDetailsElement.addEventListener('toggle', updateFilters);
    }
    if (selectRowsButtonInputElement instanceof HTMLInputElement) {
        selectRowsButtonInputElement.addEventListener('click', selectRows);
    }
    if (deselectRowsButtonInputElement instanceof HTMLInputElement) {
        deselectRowsButtonInputElement.addEventListener('click', selectRows);
    }
    if (showRowsButtonInputElement instanceof HTMLInputElement) {
        showRowsButtonInputElement.addEventListener('click', showRows);
    }
    if (hiddenRowsButtonInputElement instanceof HTMLInputElement) {
        hiddenRowsButtonInputElement.addEventListener('click', showRows);
    }
    if (saveCsvButtonInputElement instanceof HTMLInputElement) {
        saveCsvButtonInputElement.addEventListener('click', downloadCsv);
    }
}
function handleFile(event) {
    if (!(event.currentTarget instanceof HTMLInputElement) || !event.currentTarget.files) {
        return;
    }
    const file = event.currentTarget.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = event => {
        if (!event.target || typeof event.target.result !== 'string') {
            return;
        }
        if (file.type === 'text/html') {
            createTableFromHtml(event.target.result);
            createFilter();
        }
        else if (file.type === 'text/csv') {
            createTableFromCsv(event.target.result);
            createFilter();
        }
    };
    reader.readAsText(file);
}
function createTableFromHtml(htmlText) {
    if (!(tableHeadElement instanceof HTMLTableSectionElement) || !(talbeBodyElement instanceof HTMLTableSectionElement)) {
        return;
    }
    const parser = new DOMParser();
    const gradeDocument = parser.parseFromString(htmlText, 'text/html');
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
        const tableCellTexts = readRow(rowElement);
        if (i === 0) {
            if (tableCellTexts.some(text => text === '') || tableCellTexts.length !== (new Set(tableCellTexts)).size) {
                return;
            }
            for (const tableCellText of tableCellTexts) {
                headTexts.push(tableCellText);
            }
            tableHeadElement.appendChild(createHeadRow());
        }
        else {
            if (tableCellTexts.slice(1).every(text => text === '')) {
                continue;
            }
            talbeBodyElement.appendChild(createBodyRow(tableCellTexts));
        }
    }
}
function readRow(rowElement) {
    const tableCellTexts = [];
    for (const cellElement of rowElement.cells) {
        tableCellTexts.push(cellElement.textContent ? cellElement.textContent.trim() : '');
    }
    return tableCellTexts;
}
function createHeadRow() {
    const rowElement = document.createElement('tr');
    for (const headText of headTexts.concat(additionalHeadTexts)) {
        const cellElement = document.createElement('th');
        const textNode = document.createTextNode(headText);
        cellElement.appendChild(textNode);
        rowElement.appendChild(cellElement);
    }
    return rowElement;
}
function createBodyRow(cellTexts) {
    const rowElement = document.createElement('tr');
    const emptyTexts = [];
    emptyTexts.length = Math.max(headTexts.length - cellTexts.length, 0);
    emptyTexts.fill('');
    for (const [i, cellText] of cellTexts.concat(emptyTexts).slice(0, headTexts.length).entries()) {
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
        textInputElement.value = cellText;
        textInputElement.addEventListener('change', updateFilters);
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
    const emptyTexts = [];
    emptyTexts.length = headTexts.length;
    emptyTexts.fill('');
    talbeBodyElement.appendChild(createBodyRow(emptyTexts));
}
function removeRow(event) {
    if (!(event.currentTarget instanceof HTMLInputElement)) {
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
        const filteredEvaluationText = scoreToEvaluationTexts.find(evaluationText => inputEvaluationText === evaluationText);
        if (scoreToEvaluationTexts[inputScoreNumber] !== inputEvaluationText) {
            if (filteredEvaluationText && inputScoreNumber in scoreToEvaluationTexts) {
                evaluationCellElement.classList.add('warning');
                scoreCellElement.classList.add('warning');
            }
            else if (filteredEvaluationText) {
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
        const GPNumber = Math.min(Math.max((filteredEvaluationText ? scoreToEvaluationTexts.lastIndexOf(filteredEvaluationText) : inputScoreNumber) - 5, 0), 4);
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
    if (!(filterOuterDivElement instanceof HTMLDivElement)) {
        return;
    }
    while (filterOuterDivElement.lastChild) {
        filterOuterDivElement.removeChild(filterOuterDivElement.lastChild);
    }
    for (const headText of headTexts) {
        const detailsElement = document.createElement('details');
        const summaryElement = document.createElement('summary');
        const textNode = document.createTextNode(headText);
        const selectAllButtonInputElement = document.createElement('input');
        const deselectAllButtonInputElement = document.createElement('input');
        const filterTableElement = document.createElement('table');
        selectAllButtonInputElement.type = 'button';
        selectAllButtonInputElement.value = '全選択';
        selectAllButtonInputElement.classList.add('checked');
        selectAllButtonInputElement.addEventListener('click', selectAllFilters);
        deselectAllButtonInputElement.type = 'button';
        deselectAllButtonInputElement.value = '全非選択';
        deselectAllButtonInputElement.addEventListener('click', selectAllFilters);
        summaryElement.appendChild(textNode);
        detailsElement.appendChild(summaryElement);
        detailsElement.appendChild(selectAllButtonInputElement);
        detailsElement.appendChild(deselectAllButtonInputElement);
        detailsElement.appendChild(filterTableElement);
        filterOuterDivElement.appendChild(detailsElement);
    }
    updateFilters();
}
function updateFilters() {
    if (!(talbeBodyElement instanceof HTMLTableSectionElement)) {
        return;
    }
    if (!(filterOuterDivElement instanceof HTMLDivElement)) {
        return;
    }
    const filterOuterDetailsElement = document.getElementById('filter-outer-details');
    if (!(filterOuterDetailsElement instanceof HTMLDetailsElement) || !filterOuterDetailsElement.open) {
        return;
    }
    const filterTableElements = filterOuterDivElement.getElementsByTagName('table');
    const previousFilterMaps = createFilterMaps();
    for (const filterTableElement of filterTableElements) {
        while (filterTableElement.lastChild) {
            filterTableElement.removeChild(filterTableElement.lastChild);
        }
    }
    for (const [i, filterTableElement] of Array.from(filterTableElements).entries()) {
        const previousFilterMap = previousFilterMaps[i];
        if (!previousFilterMap) {
            return;
        }
        const newFilterMap = new Map();
        for (const rowElement of talbeBodyElement.rows) {
            const cellElement = rowElement.cells[i];
            if (!cellElement) {
                return;
            }
            const tableInputCellText = Array.from(cellElement.getElementsByTagName('input')).map(inputElement => inputElement.value.trim()).join('');
            const previousFilterBoolean = previousFilterMap.get(tableInputCellText);
            if (previousFilterBoolean === true) {
                newFilterMap.set(tableInputCellText, true);
            }
            else {
                newFilterMap.set(tableInputCellText, false);
            }
        }
        for (const [filterText, filterBoolean] of newFilterMap) {
            filterTableElement.appendChild(createFilterRow(filterText, filterBoolean));
        }
    }
}
function createFilterRow(filterText, checkedBoolean) {
    const filterRowElement = document.createElement('tr');
    const filterCellElement = document.createElement('td');
    const filterLabelElement = document.createElement('label');
    const filterCheckboxInputElement = document.createElement('input');
    const filterTextNode = document.createTextNode(filterText);
    filterCheckboxInputElement.type = 'checkbox';
    filterCheckboxInputElement.checked = checkedBoolean;
    filterLabelElement.appendChild(filterCheckboxInputElement);
    filterLabelElement.appendChild(filterTextNode);
    filterCellElement.appendChild(filterLabelElement);
    filterRowElement.appendChild(filterCellElement);
    return filterRowElement;
}
function selectAllFilters(event) {
    if (!(event.currentTarget instanceof HTMLInputElement)) {
        return;
    }
    const selectAllButtonInputElement = event.currentTarget;
    const checkedBoolean = selectAllButtonInputElement.classList.contains('checked');
    const detailsElement = selectAllButtonInputElement.closest('details');
    if (!detailsElement) {
        return;
    }
    for (const checkboxInputElement of detailsElement.getElementsByTagName('input')) {
        checkboxInputElement.checked = checkedBoolean;
    }
}
function selectRows(event) {
    if (!(talbeBodyElement instanceof HTMLTableSectionElement) || !(event.currentTarget instanceof HTMLInputElement)) {
        return;
    }
    const selectRowsButtonInputElement = event.currentTarget;
    const selectOrDeselectBoolean = selectRowsButtonInputElement.classList.contains('checked');
    const filterMaps = createFilterMaps();
    selectAllRows(!selectOrDeselectBoolean);
    for (const rowElement of talbeBodyElement.rows) {
        const checkboxInputElement = Array.from(rowElement.getElementsByTagName('input')).find(inputElement => inputElement.type === 'checkbox');
        const tableInputCellTexts = readInputRow(rowElement).slice(0, headTexts.length);
        let checkedBoolean = !selectOrDeselectBoolean;
        if (!checkboxInputElement) {
            return;
        }
        for (const [i, tableInputCellText] of tableInputCellTexts.entries()) {
            const filterMap = filterMaps[i];
            if (!filterMap) {
                return;
            }
            const filterBoolean = filterMap.get(tableInputCellText);
            if (filterBoolean === true) {
                checkedBoolean = selectOrDeselectBoolean;
                break;
            }
        }
        checkboxInputElement.checked = checkedBoolean;
    }
}
function selectAllRows(checkedBoolean) {
    if (!(talbeBodyElement instanceof HTMLTableSectionElement)) {
        return;
    }
    const checkboxInputElements = Array.from(talbeBodyElement.getElementsByTagName('input')).filter(inputElement => inputElement.type === 'checkbox');
    for (const checkboxInputElement of checkboxInputElements) {
        checkboxInputElement.checked = checkedBoolean;
    }
}
function showRows(event) {
    if (!(talbeBodyElement instanceof HTMLTableSectionElement) || !(event.currentTarget instanceof HTMLInputElement)) {
        return;
    }
    const showRowsButtonInputElement = event.currentTarget;
    const showOrHiddenBoolean = showRowsButtonInputElement.classList.contains('checked');
    const filterMaps = createFilterMaps();
    showAllRows(!showOrHiddenBoolean);
    for (const rowElement of talbeBodyElement.rows) {
        const tableInputCellTexts = readInputRow(rowElement).slice(0, headTexts.length);
        let checkedBoolean = !showOrHiddenBoolean;
        for (const [i, tableInputCellText] of tableInputCellTexts.entries()) {
            const filterMap = filterMaps[i];
            if (!filterMap) {
                return;
            }
            const filterBoolean = filterMap.get(tableInputCellText);
            if (filterBoolean === true) {
                checkedBoolean = showOrHiddenBoolean;
                break;
            }
        }
        if (checkedBoolean) {
            rowElement.classList.remove('hidden');
        }
        else {
            rowElement.classList.add('hidden');
        }
    }
}
function showAllRows(checkedBoolean) {
    if (!(talbeBodyElement instanceof HTMLTableSectionElement)) {
        return;
    }
    for (const rowElement of talbeBodyElement.rows) {
        if (checkedBoolean) {
            rowElement.classList.remove('hidden');
        }
        else {
            rowElement.classList.add('hidden');
        }
    }
}
function readInputRow(rowElement) {
    const tableInputCellTexts = [];
    for (const cellElement of rowElement.cells) {
        const tableInputCellText = Array.from(cellElement.getElementsByTagName('input')).map(inputElement => inputElement.value.trim()).join('');
        tableInputCellTexts.push(tableInputCellText);
    }
    return tableInputCellTexts;
}
function createFilterMaps() {
    if (!(filterOuterDivElement instanceof HTMLDivElement)) {
        return [];
    }
    const filterMaps = [];
    const filterTableElements = filterOuterDivElement.getElementsByTagName('table');
    for (const filterTableElement of filterTableElements) {
        const filterMap = new Map();
        for (const filterRowElement of filterTableElement.rows) {
            const filterCheckboxInputElement = filterRowElement.getElementsByTagName('input')[0];
            if (!filterCheckboxInputElement) {
                return [];
            }
            filterMap.set(filterRowElement.textContent ? filterRowElement.textContent.trim() : '', filterCheckboxInputElement.checked);
        }
        filterMaps.push(filterMap);
    }
    return filterMaps;
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
    const rowTexts = textareaElement.value.trim().split(/\n{2,}/).map(text => text.trim());
    for (const [i, rowText] of rowTexts.entries()) {
        const cellTexts = rowText.split(/[\n|\t]+/).map(text => text.trim());
        if (cellTexts.length <= 1) {
            continue;
        }
        if (i === 0 && cellTexts.every(text => text !== '' && isNaN(Number(text))) && cellTexts.length === (new Set(cellTexts)).size) {
            headTexts.length = 0;
            while (tableHeadElement.lastChild) {
                tableHeadElement.removeChild(tableHeadElement.lastChild);
            }
            for (const cellText of cellTexts) {
                headTexts.push(cellText);
            }
            tableHeadElement.appendChild(createHeadRow());
        }
        else if (cellTexts.length === headTexts.length) {
            talbeBodyElement.appendChild(createBodyRow(cellTexts));
        }
        else {
            const emptyTexts = [];
            emptyTexts.length = Math.max(headTexts.length - cellTexts.length, 0);
            emptyTexts.fill('');
            cellTexts.splice(1, 0, '');
            talbeBodyElement.appendChild(createBodyRow(cellTexts.concat(emptyTexts).slice(0, headTexts.length)));
        }
    }
}
function downloadCsv() {
    if (!(talbeBodyElement instanceof HTMLTableSectionElement)) {
        return;
    }
    const csvRowTexts = [headTexts.join(',')];
    for (const rowElement of talbeBodyElement.rows) {
        const checkboxInputElement = Array.from(rowElement.getElementsByTagName('input')).find(inputElement => inputElement.type === 'checkbox');
        if (!checkboxInputElement || !checkboxInputElement.checked) {
            continue;
        }
        const tableInputCellTexts = readInputRow(rowElement).slice(0, headTexts.length);
        csvRowTexts.push(tableInputCellTexts.join(','));
    }
    const csvText = csvRowTexts.join('\n');
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvText], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchorElement = document.createElement('a');
    anchorElement.download = 'table.csv';
    anchorElement.href = url;
    anchorElement.click();
    URL.revokeObjectURL(url);
}
function createTableFromCsv(csvText) {
}
