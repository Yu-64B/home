'use strict';
const headTexts = ['科目名', '単位', '評価', '素点', '年度', '学期', '教員氏名'];
const tableObject = [];
const inputElement = Array.from(document.getElementsByTagName('input')).find(element => element.id === 'input');
if (inputElement) {
    inputElement.addEventListener('change', handleFile);
}
function handleFile(event) {
    if (!(event instanceof Event) || !(event.currentTarget instanceof HTMLInputElement) || !event.currentTarget.files)
        return;
    const file = event.currentTarget.files[0];
    if (file.type !== 'text/html')
        return;
    const reader = new FileReader();
    reader.onload = (event) => {
        if (!event.target || typeof event.target.result !== 'string')
            return;
        const text = event.target.result;
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        makeJson(doc);
    };
    reader.readAsText(file);
}
function makeJson(doc) {
    if (!(doc instanceof Document))
        return;
    const gradeTables = Array.from(doc.getElementsByTagName('table')).filter(table => table.className === 'singleTableLine');
    const gradeTable = gradeTables.find(table => { var _a, _b; return (_b = ((_a = table.parentElement) === null || _a === void 0 ? void 0 : _a.id) === 'singleTableArea') !== null && _b !== void 0 ? _b : false; });
    if (!gradeTable)
        return;
    const rows = Array.from(gradeTable.rows);
    const firstRow = rows.shift();
    if (!firstRow)
        return;
    const firstCells = Array.from(firstRow.cells);
    const tmpHeadTexts = [];
    for (const cell of firstCells) {
        if (!cell.textContent || cell.textContent.trim() === '')
            return;
        tmpHeadTexts.push(cell.textContent.trim());
    }
    headTexts.length = 0;
    for (const tmpHeadText of tmpHeadTexts)
        headTexts.push(tmpHeadText);
    for (const row of rows) {
        const cells = Array.from(row.cells);
        if (cells.slice(1).every(cell => !cell.textContent || cell.textContent.trim() === ''))
            continue;
        const rowObject = {};
        for (const [i, cell] of cells.entries()) {
            if (!cell.textContent || cell.textContent.trim() === '')
                continue;
            const cellText = cell.textContent.trim();
            if (i === 1 || i === 3 || i === 4) {
                if (parseFloat(cellText) === NaN)
                    return;
                rowObject[headTexts[i]] = parseFloat(cellText);
            }
            else {
                rowObject[headTexts[i]] = cellText;
            }
        }
        tableObject.push(rowObject);
    }
    console.log(tableObject);
}
