'use strict';
const headStrings = ['科目名', '単位', '評価', '素点', '年度', '学期', '教員氏名'];
const additionalHeadStrings = ['GP', '単位数×GP', '選択', '削除'];
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
        else if (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel' || file.type === 'application/octet-stream') {
            createTableFromCsv(event.target.result);
            createFilter();
        }
    };
    reader.readAsText(file);
}
function createTableFromHtml(htmlString) {
    const parser = new DOMParser();
    const gradeDocument = parser.parseFromString(htmlString, 'text/html');
    const gradeTableElements = Array.from(gradeDocument.getElementsByTagName('table')).filter(tableElement => tableElement.classList.contains('singleTableLine'));
    const gradeTableElement = gradeTableElements.find(tableElement => tableElement.parentElement instanceof HTMLDivElement && tableElement.parentElement.id === 'singleTableArea');
    if (!gradeTableElement) {
        return;
    }
    createRows(Array.from(gradeTableElement.rows), readTableRow);
}
function readTableRow(rowElement) {
    const tableCellStrings = [];
    for (const cellElement of rowElement.cells) {
        tableCellStrings.push(cellElement.textContent ? cellElement.textContent.trim() : '');
    }
    return tableCellStrings;
}
function createHeadRow() {
    const rowElement = document.createElement('tr');
    for (const headString of headStrings.concat(additionalHeadStrings)) {
        const cellElement = document.createElement('th');
        const textNode = document.createTextNode(headString);
        cellElement.appendChild(textNode);
        rowElement.appendChild(cellElement);
    }
    return rowElement;
}
function createBodyRow(cellStrings) {
    const rowElement = document.createElement('tr');
    const emptyStrings = [];
    emptyStrings.length = Math.max(headStrings.length - cellStrings.length, 0);
    emptyStrings.fill('');
    for (const [i, cellString] of cellStrings.concat(emptyStrings).slice(0, headStrings.length).entries()) {
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
        textInputElement.value = cellString;
        textInputElement.addEventListener('change', updateFilters);
        labelElement.appendChild(textInputElement);
        cellElement.appendChild(labelElement);
        rowElement.appendChild(cellElement);
    }
    for (const [i, _] of additionalHeadStrings.entries()) {
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
    const emptyStrings = [];
    emptyStrings.length = headStrings.length;
    emptyStrings.fill('');
    talbeBodyElement.appendChild(createBodyRow(emptyStrings));
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
    const scoreToEvaluationStrings = ['D', 'D', 'D', 'D', 'D', 'D', 'C', 'B', 'A', 'AA', 'AA'];
    let GPxCreditSumNumber = 0;
    let creditSumNumber = 0;
    resetCellsColor();
    for (const rowElement of talbeBodyElement.rows) {
        const cellElements = rowElement.cells;
        const creditCellElement = cellElements[1];
        const evaluationCellElement = cellElements[2];
        const scoreCellElement = cellElements[3];
        const GPCellElement = cellElements[headStrings.length];
        const GPxCreditCellElement = cellElements[headStrings.length + 1];
        const selectCellElement = cellElements[headStrings.length + 2];
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
        const inputEvaluationString = evaluationTextInputElement.value.replace(/[\uFF01-\uFF5E]/g, char => String.fromCharCode(char.charCodeAt(0) - 0xFEE0)).toUpperCase().trim();
        const inputScoreNumber = scoreTextInputElement.value.trim() !== '' ? Number(scoreTextInputElement.value.trim()) : NaN;
        const filteredEvaluationString = scoreToEvaluationStrings.find(evaluationString => inputEvaluationString === evaluationString);
        if (scoreToEvaluationStrings[inputScoreNumber] !== inputEvaluationString) {
            if (filteredEvaluationString && inputScoreNumber in scoreToEvaluationStrings) {
                evaluationCellElement.classList.add('warning');
                scoreCellElement.classList.add('warning');
            }
            else if (filteredEvaluationString) {
                scoreCellElement.classList.add('warning');
            }
            else if (inputScoreNumber in scoreToEvaluationStrings) {
                evaluationCellElement.classList.add('warning');
            }
            else {
                evaluationCellElement.classList.add('error');
                scoreCellElement.classList.add('error');
                continue;
            }
        }
        const GPNumber = Math.min(Math.max((filteredEvaluationString ? scoreToEvaluationStrings.lastIndexOf(filteredEvaluationString) : inputScoreNumber) - 5, 0), 4);
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
    for (const headString of headStrings) {
        const detailsElement = document.createElement('details');
        const summaryElement = document.createElement('summary');
        const textNode = document.createTextNode(headString);
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
            const tableInputCellString = Array.from(cellElement.getElementsByTagName('input')).map(inputElement => inputElement.value.trim()).join('');
            const previousFilterBoolean = previousFilterMap.get(tableInputCellString);
            if (previousFilterBoolean === true) {
                newFilterMap.set(tableInputCellString, true);
            }
            else {
                newFilterMap.set(tableInputCellString, false);
            }
        }
        for (const [filterString, filterBoolean] of newFilterMap) {
            filterTableElement.appendChild(createFilterRow(filterString, filterBoolean));
        }
    }
}
function createFilterRow(filterString, checkedBoolean) {
    const filterRowElement = document.createElement('tr');
    const filterCellElement = document.createElement('td');
    const filterLabelElement = document.createElement('label');
    const filterCheckboxInputElement = document.createElement('input');
    const filterTextNode = document.createTextNode(filterString);
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
        const tableInputCellStrings = readTableInputRow(rowElement).slice(0, headStrings.length);
        let checkedBoolean = !selectOrDeselectBoolean;
        if (!checkboxInputElement) {
            return;
        }
        for (const [i, tableInputCellString] of tableInputCellStrings.entries()) {
            const filterMap = filterMaps[i];
            if (!filterMap) {
                return;
            }
            const filterBoolean = filterMap.get(tableInputCellString);
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
        const tableInputCellStrings = readTableInputRow(rowElement).slice(0, headStrings.length);
        let checkedBoolean = !showOrHiddenBoolean;
        for (const [i, tableInputCellString] of tableInputCellStrings.entries()) {
            const filterMap = filterMaps[i];
            if (!filterMap) {
                return;
            }
            const filterBoolean = filterMap.get(tableInputCellString);
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
function readTableInputRow(rowElement) {
    const tableInputCellStrings = [];
    for (const cellElement of rowElement.cells) {
        const tableInputCellString = Array.from(cellElement.getElementsByTagName('input')).map(inputElement => inputElement.value.trim()).join('');
        tableInputCellStrings.push(tableInputCellString);
    }
    return tableInputCellStrings;
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
    const textareaElement = document.getElementById('textarea');
    if (!(textareaElement instanceof HTMLTextAreaElement)) {
        return;
    }
    const textRowStrings = textareaElement.value.trim().split(/\n{2,}/).map(string => string.trim());
    createRows(textRowStrings, textRowString => textRowString.split(/[\n|\t]+/).map(string => string.trim()));
}
function downloadCsv() {
    if (!(talbeBodyElement instanceof HTMLTableSectionElement)) {
        return;
    }
    const csvRowStrings = [headStrings.join(',')];
    for (const rowElement of talbeBodyElement.rows) {
        const checkboxInputElement = Array.from(rowElement.getElementsByTagName('input')).find(inputElement => inputElement.type === 'checkbox');
        if (!checkboxInputElement || !checkboxInputElement.checked) {
            continue;
        }
        const tableInputCellStrings = readTableInputRow(rowElement).slice(0, headStrings.length);
        csvRowStrings.push(tableInputCellStrings.join(','));
    }
    const csvString = csvRowStrings.join('\n');
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchorElement = document.createElement('a');
    anchorElement.download = 'table.csv';
    anchorElement.href = url;
    anchorElement.click();
    URL.revokeObjectURL(url);
}
function createTableFromCsv(csvString) {
    const csvRowStrings = csvString.trim().split('\n').map(string => string.trim());
    createRows(csvRowStrings, csvRowString => csvRowString.split(',').map(string => string.trim()));
}
function createRows(rows, readRowFunction) {
    if (!(tableHeadElement instanceof HTMLTableSectionElement) || !(talbeBodyElement instanceof HTMLTableSectionElement)) {
        return;
    }
    while (talbeBodyElement.lastChild) {
        talbeBodyElement.removeChild(talbeBodyElement.lastChild);
    }
    for (const [i, row] of rows.entries()) {
        const cellStrings = readRowFunction(row);
        if (cellStrings.length <= 1 || cellStrings.slice(1).every(string => string === '')) {
            continue;
        }
        if (i === 0 && cellStrings.every(string => string !== '' && isNaN(Number(string))) && cellStrings.length === (new Set(cellStrings)).size) {
            headStrings.length = 0;
            while (tableHeadElement.lastChild) {
                tableHeadElement.removeChild(tableHeadElement.lastChild);
            }
            for (const cellString of cellStrings) {
                headStrings.push(cellString);
            }
            tableHeadElement.appendChild(createHeadRow());
        }
        else if (cellStrings.length === headStrings.length) {
            talbeBodyElement.appendChild(createBodyRow(cellStrings));
        }
        else {
            const emptyStrings = [];
            emptyStrings.length = Math.max(headStrings.length - cellStrings.length, 0);
            emptyStrings.fill('');
            cellStrings.splice(1, 0, '');
            talbeBodyElement.appendChild(createBodyRow(cellStrings.concat(emptyStrings).slice(0, headStrings.length)));
        }
    }
}
