'use strict';
const headTexts = ['科目名', '単位', '評価', '素点', '年度', '学期', '教員氏名'];
const additionalHeadTexts = ['GP', '単位数×GP', '選択', '削除'];
const tableHeadElement = document.getElementById('table-head');
const talbeBodyElement = document.getElementById('table-body');
const filterOuterDivElement = document.getElementById('filter-outer-div');
setupGPA();
function setupGPA() {
    const fileInputElement = document.getElementById('file-input');
    const readTableButtonInputElement = document.getElementById('read-table-button-input');
    const calcGPAButtonInputElement = document.getElementById('calc-gpa-button-input');
    const addButtonInputElement = document.getElementById('add-button-input');
    const filterDetailsElement = document.getElementById('filter-outer-details');
    const selectAllFiltersButtonInputElement = document.getElementById('select-all-filters-button-input');
    const deselectAllFilterslButtonInputElement = document.getElementById('deselect-all-filters-button-input');
    const selectAllRowsButtonInputElement = document.getElementById('select-all-rows-button-input');
    const deselectAllRowsButtonInputElement = document.getElementById('deselect-all-rows-button-input');
    const selectRowsButtonInputElement = document.getElementById('select-rows-button-input');
    const deselectRowsButtonInputElement = document.getElementById('deselect-rows-button-input');
    const showAllRowsButtonInputElement = document.getElementById('show-all-rows-button-input');
    const hiddenAllRowsButtonInputElement = document.getElementById('hidden-all-rows-button-input');
    const showRowsButtonInputElement = document.getElementById('show-rows-button-input');
    const hiddenRowsButtonInputElement = document.getElementById('hidden-rows-button-input');
    if (tableHeadElement instanceof HTMLTableSectionElement) {
        tableHeadElement.appendChild(createHeadRow());
    }
    createFilter();
    if (fileInputElement instanceof HTMLInputElement) {
        fileInputElement.addEventListener('change', handleFile);
    }
    if (readTableButtonInputElement instanceof HTMLInputElement) {
        readTableButtonInputElement.addEventListener('click', () => {
            createTableFromText();
            createFilter();
        });
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
    if (selectAllFiltersButtonInputElement instanceof HTMLInputElement) {
        selectAllFiltersButtonInputElement.addEventListener('click', event => {
            selectAllFilters(event, true);
        });
    }
    if (deselectAllFilterslButtonInputElement instanceof HTMLInputElement) {
        deselectAllFilterslButtonInputElement.addEventListener('click', event => {
            selectAllFilters(event, false);
        });
    }
    if (selectAllRowsButtonInputElement instanceof HTMLInputElement) {
        selectAllRowsButtonInputElement.addEventListener('click', _ => {
            selectAllRows(true);
        });
    }
    if (deselectAllRowsButtonInputElement instanceof HTMLInputElement) {
        deselectAllRowsButtonInputElement.addEventListener('click', _ => {
            selectAllRows(false);
        });
    }
    if (selectRowsButtonInputElement instanceof HTMLInputElement) {
        selectRowsButtonInputElement.addEventListener('click', _ => {
            selectRows(true);
        });
    }
    if (deselectRowsButtonInputElement instanceof HTMLInputElement) {
        deselectRowsButtonInputElement.addEventListener('click', _ => {
            selectRows(false);
        });
    }
    if (showAllRowsButtonInputElement instanceof HTMLInputElement) {
        showAllRowsButtonInputElement.addEventListener('click', _ => {
            showAllRows(true);
        });
    }
    if (hiddenAllRowsButtonInputElement instanceof HTMLInputElement) {
        hiddenAllRowsButtonInputElement.addEventListener('click', _ => {
            showAllRows(false);
        });
    }
    if (showRowsButtonInputElement instanceof HTMLInputElement) {
        showRowsButtonInputElement.addEventListener('click', _ => {
            showRows(true);
        });
    }
    if (hiddenRowsButtonInputElement instanceof HTMLInputElement) {
        hiddenRowsButtonInputElement.addEventListener('click', _ => {
            showRows(false);
        });
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
        if (!event.target || typeof event.target.result !== 'string') {
            return;
        }
        const htmlText = event.target.result;
        const parser = new DOMParser();
        const gradeDocument = parser.parseFromString(htmlText, 'text/html');
        createTable(gradeDocument);
        createFilter();
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
        texts.push(cellElement.textContent ? cellElement.textContent.trim() : '');
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
    const emptyTexts = [];
    emptyTexts.length = Math.max(headTexts.length - texts.length, 0);
    emptyTexts.fill('');
    for (const [i, text] of texts.concat(emptyTexts).slice(0, headTexts.length).entries()) {
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
    for (const text of headTexts) {
        const detailsElement = document.createElement('details');
        const summaryElement = document.createElement('summary');
        const textNode = document.createTextNode(text);
        const selectAllButtonInputElement = document.createElement('input');
        const deselectAllButtonInputElement = document.createElement('input');
        const filterTableElement = document.createElement('table');
        selectAllButtonInputElement.type = 'button';
        selectAllButtonInputElement.value = '全選択';
        selectAllButtonInputElement.addEventListener('click', event => {
            selectAllFilters(event, true);
        });
        deselectAllButtonInputElement.type = 'button';
        deselectAllButtonInputElement.value = '全非選択';
        deselectAllButtonInputElement.addEventListener('click', event => {
            selectAllFilters(event, false);
        });
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
            const inputText = Array.from(cellElement.getElementsByTagName('input')).map(inputElement => inputElement.value.trim()).join('');
            const previousFilterBoolean = previousFilterMap.get(inputText);
            if (previousFilterBoolean === false) {
                newFilterMap.set(inputText, false);
            }
            else {
                newFilterMap.set(inputText, true);
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
function selectAllFilters(event, checkedBoolean) {
    if (!(event.currentTarget instanceof HTMLInputElement)) {
        return;
    }
    const selectAllButtonInputElement = event.currentTarget;
    const detailsElement = selectAllButtonInputElement.closest('details');
    if (!detailsElement) {
        return;
    }
    for (const checkboxInputElement of detailsElement.getElementsByTagName('input')) {
        checkboxInputElement.checked = checkedBoolean;
    }
}
function selectRows(selectOrDeselectBoolean) {
    if (!(talbeBodyElement instanceof HTMLTableSectionElement)) {
        return;
    }
    const filterMaps = createFilterMaps();
    selectAllRows(!selectOrDeselectBoolean);
    for (const rowElement of talbeBodyElement.rows) {
        const checkboxInputElement = Array.from(rowElement.getElementsByTagName('input')).find(inputElement => inputElement.type === 'checkbox');
        const texts = readInputRowTexts(rowElement).slice(0, headTexts.length);
        let checkedBoolean = selectOrDeselectBoolean;
        if (!checkboxInputElement) {
            return;
        }
        for (const [i, text] of texts.entries()) {
            const filterMap = filterMaps[i];
            if (!filterMap) {
                return;
            }
            const filterBoolean = filterMap.get(text);
            if (filterBoolean !== selectOrDeselectBoolean) {
                checkedBoolean = !selectOrDeselectBoolean;
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
function showRows(showOrHiddenBoolean) {
    if (!(talbeBodyElement instanceof HTMLTableSectionElement)) {
        return;
    }
    const filterMaps = createFilterMaps();
    showAllRows(!showOrHiddenBoolean);
    for (const rowElement of talbeBodyElement.rows) {
        const texts = readInputRowTexts(rowElement).slice(0, headTexts.length);
        let checkedBoolean = showOrHiddenBoolean;
        for (const [i, text] of texts.entries()) {
            const filterMap = filterMaps[i];
            if (!filterMap) {
                return;
            }
            const filterBoolean = filterMap.get(text);
            if (filterBoolean !== showOrHiddenBoolean) {
                checkedBoolean = !showOrHiddenBoolean;
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
function readInputRowTexts(rowElement) {
    const texts = [];
    for (const cellElement of rowElement.cells) {
        const text = Array.from(cellElement.getElementsByTagName('input')).map(inputElement => inputElement.value.trim()).join('');
        texts.push(text);
    }
    return texts;
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
                texts.fill('');
                if (cellTexts[0]) {
                    texts[0] = cellTexts[0];
                }
                talbeBodyElement.appendChild(createBodyRow(texts));
            }
        }
    }
}
