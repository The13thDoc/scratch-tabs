/**
 * Functions and variables specific to the measures.
 */
var Measure = function() {
    console.log('Measure', 'Created a Measure object.');

    // Class variables
    this.guitarStrings = 6;
    this.maxFrets = 24;
    this.startCells = 36;
    this.totalCells = startCells; // number of columns, or 'frets'
    this.selected = [];
    this.defaultEmpty = TABAPP.asciiformats['monospace-3']['rules']['defaultEmpty'];
    this.asciiVisible = 'true';
    this.isInitializing = 'false';

};
/**
 * Remove the last column (fret) from the tablature.
 */
Measure.prototype.shrinkMeasure = function() {
    // console.debug('measure', 'Remove last column');
    // For all user input
    var inputList = document.getElementById('input-list' + '-' + TABAPP.visibleTab.toString());

    // Move DOWN the tablature
    for (var string = 1; string <= this.guitarStrings; string++) {
        var matrixID = last + 'x' + string + '-' + TABAPP.visibleTab.toString();
        var cellID = 'cell_' + matrixID;

        var item = document.getElementById(cellID);
        // console.debug('measure', item);
        delete TABAPP.savedInput[matrixID];
        inputList.removeChild(item);
    }

    // Now, increment the total number of cells by 1.
    this.totalCells = this.totalCells - 1;

    TABAPP.ui.updateWidth(this.totalCells, inputList);

    // TABPAPP.ascii.writeASCII(); TODO - Uncomment. Temporarily disable ascii
};

/**
 * Append another column (fret) of input to the tablature.
 */
Measure.prototype.extendMeasure = function() {
    // For all user input
    var inputList = document.getElementById('input-list' + '-' + TABAPP.visibleTab.toString());
    var incremented = (TABAPP.totalCells[TABAPP.visibleTab] + 1);

    // Create the input columns
    // Move DOWN the tablature
    for (var string = 1; string <= TABAPP.guitarStrings; string++) {

        // Move ACROSS the tablature
        for (var cell = incremented; cell <= incremented; cell++) {
            var matrixID = cell + 'x' + string + '-' + TABAPP.visibleTab.toString();
            var cellID = 'cell_' + matrixID;

            var item = document.createElement('li');
            item.id = cellID;

            // Write the cells
            var canvasElement = TABAPP.canvas.getNewCanvas(matrixID);
            TABAPP.savedInput[matrixID] = TABAPP.defaultEmpty;

            // front
            item.className = 'input-cell ui-state-default';
            item.appendChild(canvasElement);

            var referenceString = string + 1; // String following current one.
            var referenceElement = document.getElementById('cell_1' + 'x' +
                referenceString + '-' + TABAPP.visibleTab.toString());

            if (string < 6) {
                inputList.insertBefore(item, referenceElement);
            } else {
                inputList.appendChild(item);
            }
        }
    }
    // Finished creating the tablature cells.

    // Now, increment the total number of cells by 1.
    TABAPP.totalCells[TABAPP.visibleTab] = incremented;

    TABAPP.ui.updateWidth(TABAPP.totalCells[TABAPP.visibleTab], inputList);

    // TABPAPP.ascii.writeASCII(); TODO - Uncomment. Temporarily disable ascii
};

/**
Create a context menu for EACH measure.
*/
Measure.prototype.createContextMenu = function(div) {
    var nav = document.createElement('nav');
    nav.id = 'measure-context-menu-' + TABAPP.tabs.toString();
    nav.classList.add('context-menu');
    document.body.appendChild(nav);

    var ul = document.createElement('ul');
    ul.id = 'measure-context-menu-list-' + TABAPP.tabs.toString();
    ul.classList.add('measure-context-menu-items');
    nav.appendChild(ul);

    var tabID = div.id.toString().substring(div.id.toString().length - 1, div.id.toString().length);

    //Context menu event handlers
    var duplicateItem = document.createElement('li');
    duplicateItem.id = 'duplicate-' + TABAPP.tabs.toString();
    duplicateItem.innerHTML = 'Duplicate';
    duplicateItem.classList.add('measure-context-menu-item');
    ul.appendChild(duplicateItem);

    duplicateItem.addEventListener('click', function(event) {
        TABAPP.ui.addMeasure(tabID);
    }, true);

    var renameItem = document.createElement('li');
    renameItem.id = 'rename-' + TABAPP.tabs.toString();
    renameItem.innerHTML = 'Rename';
    renameItem.classList.add('measure-context-menu-item');
    ul.appendChild(renameItem);

    renameItem.addEventListener('click', function(event) {
        result = window.prompt('Name the measure', div.innerHTML);

        if (result !== null) {
            div.innerHTML = result;
            div.title = div.innerHTML;
        }
    }, true);

    var hr = document.createElement('hr');
    hr.classList.add('measure-context-menu-hr');
    // Do not include horizontal rule until Delete is ready
    // ul.appendChild(hr);

    var deleteItem = document.createElement('li');
    deleteItem.id = 'delete-' + TABAPP.tabs.toString();
    deleteItem.innerHTML = 'Delete';
    deleteItem.classList.add('measure-context-menu-item');
    deleteItem.classList.add('item-delete');
    // ul.appendChild(deleteItem); // Do not include in context menu
    deleteItem.addEventListener('click', function(event) {
        console.log('Delete Clicked in tab #' + tabID);

        var measureToDelete = document.getElementById('measure-item-' + tabID);
        var headerList = document.getElementById('measure-headers-list');

        var activate = 1;
        var intID = parseInt(tabID, 10);
        if (intID === TABAPP.tabs) {
            activate = intID - 1;
        } else {
            activate = intID + 1;
        }

        console.log('Removing: ' + intID);
        console.log('Activating: ' + activate);
        this.activateMeasure(activate);
        headerList.removeChild(measureToDelete);
    }, true);

    return nav;
};

Measure.prototype.createTuning = function () {
    var tuning = {
        '1': 'E',
        '2': 'B',
        '3': 'G',
        '4': 'D',
        '5': 'A',
        '6': 'E',
    }

    var cellColumnID = 'column_' + cell;
    var column = document.createElement('ul');
    // column.id = 'tuning-list' + '-' + TABAPP.tabs.toString();
    column.className = 'tuning-column tuning-list';

    // Move DOWN the tablature
    for (var string = 1; string <= this.guitarStrings; string++) {

        var matrixID = cell + 'x' + string;
        var cellID = 'cell_' + matrixID;

        var item = document.createElement('li');
        item.id = cellID;
        // Write the tuning
        // item.innerHTML = tuning[string];
        item.className = 'cell tuning-cell';

        // Write the cells
        var canvasElement = TABAPP.canvas.getNewCanvas(matrixID);


        item.appendChild(canvasElement);
        column.appendChild(item);
        // tabList.appendChild(column);

        // TABAPP.canvas.writeToBlankCanvas(matrixID, tuning[string]);
    }
    return column;
};

Measure.prototype.createMeasure = function (duplicateID, inputList) {
    // Create the input columns
    // Move DOWN the tablature
    for (var string = 1; string <= this.guitarStrings; string++) {

        // Move ACROSS the tablature
        for (var cell = 1; cell <= this.totalCells; cell++) {
            var matrixID = cell + 'x' + string;
            var cellID = 'cell_' + matrixID;

            var item = document.createElement('li');
            item.id = cellID;

            if (duplicateID !== undefined) {
                var copying = matrixID.substring(0, matrixID.length - 1) + duplicateID;
                TABAPP.savedInput[matrixID] = TABAPP.savedInput[copying];
            } else {
                TABAPP.savedInput[matrixID] = measure.defaultEmpty;
            }

            // Write the cells
            var canvasElement = TABAPP.canvas.getNewCanvas(matrixID);

            // front
            item.className = 'input-cell ui-state-default';
            item.appendChild(canvasElement);

            inputList.appendChild(item);

            if (TABAPP.savedInput[matrixID] !== measure.defaultEmpty) {
                TABAPP.canvas.writeToCanvas(matrixID, TABAPP.savedInput[matrixID]);
            }
        }
    }
    // Finished creating the tablature cells.
};
