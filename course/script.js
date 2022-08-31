'use strict';
setupCourse();
function setupCourse() {
    const fileInputElement = document.getElementById('json-file-input');
    const readCopyButtonInputElement = document.getElementById('read-copy-button-input');
    const writeCopyButtonInputElement = document.getElementById('write-copy-button-input');
    const uptateButtonInputElement = document.getElementById('update-button-input');
    setCheckboxTogleEvent();
    updatePre();
    if (fileInputElement instanceof HTMLInputElement) {
        fileInputElement.addEventListener('change', handleFile);
    }
    if (readCopyButtonInputElement instanceof HTMLInputElement) {
        readCopyButtonInputElement.addEventListener('click', copyToClipboard);
    }
    if (writeCopyButtonInputElement instanceof HTMLInputElement) {
        writeCopyButtonInputElement.addEventListener('click', copyToClipboard);
    }
    if (uptateButtonInputElement instanceof HTMLInputElement) {
        uptateButtonInputElement.addEventListener('click', updatePre);
    }
}
function handleFile(event) {
    if (!(event.currentTarget instanceof HTMLInputElement) || !event.currentTarget.files || !event.currentTarget.files[0]) {
        return;
    }
    const file = event.currentTarget.files[0];
    const reader = new FileReader();
    reader.onload = event => {
        if (!event.target || typeof event.target.result !== 'string') {
            return;
        }
        readJson(event.target.result);
        setCheckboxTogleEvent();
        updatePre();
    };
    reader.readAsText(file);
}
function readJson(json) {
    const semesters = parseJson(json);
    const outerDivElement = document.getElementById('courses');
    const divElement = document.createElement('div');
    if (!isUnknownArray(semesters) || !(outerDivElement instanceof HTMLDivElement)) {
        return;
    }
    while (divElement.lastChild) {
        divElement.removeChild(divElement.lastChild);
    }
    for (const semester of semesters) {
        const detailsElement = readTableGroup(semester);
        if (!detailsElement) {
            return;
        }
        detailsElement.classList.add('details');
        divElement.appendChild(detailsElement);
    }
    outerDivElement.appendChild(divElement);
}
function parseJson(json) {
    try {
        return JSON.parse(json);
    }
    catch (error) {
        console.log(error);
        return;
    }
}
function readTableGroup(tableGroup) {
    if (!isUnknownObject(tableGroup) || !('title' in tableGroup) || typeof tableGroup.title !== 'string' || !('tables' in tableGroup) || !isUnknownArray(tableGroup.tables)) {
        return;
    }
    const detailsElement = document.createElement('details');
    const summaryElement = document.createElement('summary');
    const divElement = document.createElement('div');
    const textNode = document.createTextNode(tableGroup.title);
    detailsElement.open = true;
    summaryElement.appendChild(textNode);
    detailsElement.appendChild(summaryElement);
    for (const rows of tableGroup.tables) {
        if (!isUnknownArray(rows)) {
            return;
        }
        const tableElement = document.createElement('table');
        const tbodyElement = document.createElement('tbody');
        tableElement.classList.add('table');
        for (const cells of rows) {
            if (!isUnknownArray(cells)) {
                return;
            }
            const rowElement = document.createElement('tr');
            for (const cell of cells) {
                if (!isUnknownObject(cell) || !('tag' in cell) || (cell.tag !== 'th' && cell.tag !== 'td')) {
                    return;
                }
                const tag = cell.tag;
                const cellElement = document.createElement(tag);
                if ('text_content' in cell) {
                    if (typeof cell.text_content !== 'string') {
                        return;
                    }
                    const textContent = cell.text_content;
                    const contentTextNode = document.createTextNode(textContent);
                    cellElement.appendChild(contentTextNode);
                }
                if ('checkbox' in cell) {
                    const checkbox = cell.checkbox;
                    if (!isUnknownObject(checkbox) || !('disabled' in checkbox) || typeof checkbox.disabled !== 'boolean' || !('checked' in checkbox) || typeof checkbox.checked !== 'boolean' || !('value' in checkbox) || typeof checkbox.value !== 'string') {
                        return;
                    }
                    const labelElement = document.createElement('label');
                    const checkboxInputElement = document.createElement('input');
                    checkboxInputElement.type = 'checkbox';
                    checkboxInputElement.disabled = checkbox.disabled;
                    checkboxInputElement.checked = checkbox.checked;
                    checkboxInputElement.value = checkbox.value;
                    labelElement.appendChild(checkboxInputElement);
                    cellElement.appendChild(labelElement);
                }
                else if ('table_groups' in cell) {
                    const classes = cell.table_groups;
                    if (!isUnknownArray(classes)) {
                        return;
                    }
                    const selectDetailsElement = document.createElement('details');
                    const selectSummaryElement = document.createElement('summary');
                    const selectTextNode = document.createTextNode('選択');
                    const selectDivElemet = document.createElement('div');
                    selectSummaryElement.appendChild(selectTextNode);
                    selectDetailsElement.appendChild(selectSummaryElement);
                    selectDetailsElement.classList.add('select-details');
                    selectDivElemet.classList.add('select-div');
                    for (const clas of classes) {
                        const innerDetailsElement = readTableGroup(clas);
                        if (!innerDetailsElement) {
                            return;
                        }
                        innerDetailsElement.classList.add('inner-details');
                        selectDivElemet.appendChild(innerDetailsElement);
                        selectDetailsElement.appendChild(selectDivElemet);
                    }
                    cellElement.appendChild(selectDetailsElement);
                }
                else if ('syllabus' in cell) {
                    const syllabusUrl = cell.syllabus;
                    if (typeof syllabusUrl !== 'string') {
                        return;
                    }
                    const syllabusAElement = document.createElement('a');
                    const syllabusTextNode = document.createTextNode('シラバス参照');
                    syllabusAElement.href = syllabusUrl;
                    syllabusAElement.appendChild(syllabusTextNode);
                    cellElement.appendChild(syllabusAElement);
                }
                rowElement.appendChild(cellElement);
            }
            tbodyElement.appendChild(rowElement);
        }
        tableElement.appendChild(tbodyElement);
        divElement.appendChild(tableElement);
    }
    detailsElement.appendChild(divElement);
    return detailsElement;
}
function setCheckboxTogleEvent() {
    const checkboxInputElements = Array.from(document.getElementsByTagName('input')).filter(inputElement => inputElement.type === 'checkbox');
    for (const checkboxInputElement of checkboxInputElements) {
        checkboxInputElement.addEventListener('click', togleCheckbox);
    }
}
function togleCheckbox(event) {
    if (!(event.currentTarget instanceof HTMLInputElement)) {
        return;
    }
    const togledCheckboxInputElement = event.currentTarget;
    const checked = togledCheckboxInputElement.checked;
    const value = togledCheckboxInputElement.value;
    const checkboxInputElements = Array.from(document.getElementsByTagName('input')).filter(inputElement => inputElement.type === 'checkbox' && inputElement.value === value);
    for (const checkboxInputElement of checkboxInputElements) {
        checkboxInputElement.checked = checked;
    }
    updatePre();
}
function copyToClipboard(event) {
    if (!(event.currentTarget instanceof HTMLInputElement) || !event.currentTarget.parentElement || !(event.currentTarget.parentElement.nextElementSibling instanceof HTMLPreElement)) {
        return;
    }
    const preElement = event.currentTarget.parentElement.nextElementSibling;
    const selection = window.getSelection();
    const range = document.createRange();
    if (!selection) {
        return;
    }
    range.selectNodeContents(preElement);
    selection.removeAllRanges();
    selection.addRange(range);
    const string = selection.toString();
    navigator.clipboard.writeText(string);
}
function updatePre() {
    const preElement = document.getElementById('pre');
    if (!(preElement instanceof HTMLPreElement)) {
        return;
    }
    while (preElement.lastChild) {
        preElement.removeChild(preElement.lastChild);
    }
    const checkedValues = Array.from(document.getElementsByTagName('input')).filter(inputElement => inputElement.type === 'checkbox' && !inputElement.disabled && inputElement.checked).map(inputElement => inputElement.value);
    const uncheckedValues = Array.from(document.getElementsByTagName('input')).filter(inputElement => inputElement.type === 'checkbox' && !inputElement.disabled && !inputElement.checked).map(inputElement => inputElement.value);
    const checkedValuesSet = new Set(checkedValues);
    const uncheckedValuesSet = new Set(uncheckedValues);
    const errorValues = [];
    for (const checkedValue of checkedValuesSet) {
        if (checkedValue.includes('`') || checkedValue.includes('$')) {
            const errorTextNode = document.createTextNode('Error');
            preElement.appendChild(errorTextNode);
            return;
        }
    }
    for (const uncheckedValue of uncheckedValuesSet) {
        if (uncheckedValue.includes('`') || uncheckedValue.includes('$')) {
            const errorTextNode = document.createTextNode('Error');
            preElement.appendChild(errorTextNode);
            return;
        }
    }
    for (const checkedValue of checkedValuesSet) {
        if (uncheckedValuesSet.has(checkedValue)) {
            errorValues.push(checkedValue);
        }
    }
    if (errorValues.length !== 0) {
        const errorText = 'Error: ' + errorValues.map(value => '"' + value + '"').join(', ');
        const errorTextNode = document.createTextNode(errorText);
        preElement.appendChild(errorTextNode);
        return;
    }
    const result = Array.from(checkedValuesSet).join(',');
    const list = Array.from(uncheckedValuesSet).join(',');
    const text = `(function () {
    'use strict';
    const jugyoCdDelFurikaeInputElement = document.getElementById('jugyoCdDelFurikae');
    const jugyoCdAddFurikaeInputElement = document.getElementById('jugyoCdAddFurikae');
    const addButtonInputElement = document.getElementById('form1:add');
    if (!(jugyoCdDelFurikaeInputElement instanceof HTMLInputElement) || !(jugyoCdAddFurikaeInputElement instanceof HTMLInputElement) || !(addButtonInputElement instanceof HTMLInputElement)) {
        console.log('Error');
        return;
    }
    jugyoCdDelFurikaeInputElement.value = \`${list}\`;
    jugyoCdAddFurikaeInputElement.value = \`${result}\`;
    addButtonInputElement.click();
})();
`;
    const textNode = document.createTextNode(text);
    preElement.appendChild(textNode);
}
function isUnknownArray(array) {
    return Array.isArray(array);
}
function isUnknownObject(object) {
    return object !== null && typeof object === 'object';
}
