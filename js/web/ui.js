/*global*/
var TAB = TAB || {};

/*
* On load
*/
window.onload = loadMain;

/**
* Initialize project variables.
*/
function initVars() {
    TAB.guitarStrings = 6;
    TAB.maxFrets = 24;
    TAB.startCells = 36;
    TAB.totalCells = {1:36}; // number of columns, or 'frets'
    TAB.tabs = 0;
    TAB.visibleTab = 0;
    TAB.selected = [];
    TAB.savedInput = {};
    TAB.userInput = '';
    TAB.defaultEmpty = '--';
    TAB.asciiVisible = 'false';
    TAB.isInitializing = 'false';
}

/**
* Main.
*/
function loadMain() {
    initVars();

    addMeasure();

    var addNewMeasure = document.getElementById('add-measure');
    addNewMeasure.addEventListener('click', function (event) {
        addMeasure();
    }, true);

    var toggleASCII = document.getElementById('toggle-ascii');
    toggleASCII.addEventListener('click', function (event) {
        var asciiText = document.getElementById('ascii-text');

        if(TAB.asciiVisible === 'true') {
            asciiText.setAttribute('style', 'display: none;');
            TAB.asciiVisible = 'false';
        } else {
            asciiText.setAttribute('style', 'display: inherit;');
            TAB.asciiVisible = 'true';
        }
    }, true);

    var incrementMeasure = document.getElementById('increment');
    incrementMeasure.addEventListener('click', function (event) {
        extendMeasure();
    }, true);

    var decrementMeasure = document.getElementById('decrement');
    decrementMeasure.addEventListener('click', function (event) {
        shrinkMeasure();
    }, true);

    initUserInput();
}

// Initialize the UI
function init(guitarStrings) {
    TAB.isInitializing = 'true';
    // Let's create lists here.
    // Replicate a spreadhsheet look
    var content = document.getElementById('measure-content');
    content.setAttribute('style', 'overflow: auto;');

    var tabDiv = document.createElement('div');
    tabDiv.id = 'tab-div-' + TAB.tabs.toString();
    tabDiv.className = 'tab-div';
    content.appendChild(tabDiv);

    var tabList = document.createElement('div');
    tabList.id = 'tab-list-' + TAB.tabs.toString();
    tabDiv.appendChild(tabList);

    var tuning = {
        '1': 'E',
        '2': 'B',
        '3': 'G',
        '4': 'D',
        '5': 'A',
        '6': 'E',
    }

    // Create the tuning column
    // Move ACROSS the tablature
    for (var cell = 0; cell <= 0; cell++) {

        var cellColumnID = 'column_' + cell + '-' + TAB.tabs.toString();
        var column = document.createElement('ul');
        column.id = 'tuning-list' + '-' + TAB.tabs.toString();
        column.className = 'tuning-column tuning-list';

        // Move DOWN the tablature
        for (var string = 1; string <= TAB.guitarStrings; string++) {

            var matrixID = cell + 'x' + string + '-' + TAB.tabs.toString();
            var cellID = 'cell_' + matrixID;

            var item = document.createElement('li');
            item.id = cellID;
            // Write the tuning
            // item.innerHTML = tuning[string];
            item.className = 'cell tuning-cell';

            // Write the cells
            var canvasElement = getNewCanvas(matrixID);


            item.appendChild(canvasElement);
            column.appendChild(item);
            tabList.appendChild(column);

            writeToBlankCanvas(matrixID, tuning[string]);
        }
    }


    // For all user input
    var inputList = document.createElement('ul');
    inputList.id = 'input-list' + '-' + TAB.tabs.toString();
    inputList.className = 'input-list';
    makeSelectable(inputList);
    tabList.appendChild(inputList);

    // Create the input columns
    // Move DOWN the tablature
    for (var string = 1; string <= TAB.guitarStrings; string++) {

        // Move ACROSS the tablature
        for (var cell = 1; cell <= TAB.totalCells[TAB.tabs]; cell++) {
            var matrixID = cell + 'x' + string + '-' + TAB.tabs.toString();
            var cellID = 'cell_' + matrixID;

            var item = document.createElement('li');
            item.id = cellID;

            // Write the cells
            var canvasElement = getNewCanvas(matrixID);
            TAB.savedInput[matrixID] = TAB.defaultEmpty;

            // front
            item.className = 'input-cell ui-state-default';
            item.appendChild(canvasElement);

            inputList.appendChild(item);
        }
    }
    // Finished creating the tablature cells.

    updateWidth(TAB.totalCells[TAB.tabs], inputList);

    var available = document.getElementById('columns-available');
    available.innerHTML = TAB.totalCells[TAB.tabs];

    writeASCII();
    TAB.isInitializing = 'false';
}

/**
* Resize the input list's width to fit the new number of columns.
*/
function updateWidth(cells, inputList) {
    var width = 20 * (cells);
    inputList.setAttribute('style', 'width:' + width + 'px;');

    var available = document.getElementById('columns-available');
    available.innerHTML = cells;
}

// Apply the jQuery selectability to an element.
function makeSelectable(e) {
    $(e).selectable({
        stop: function () {
            if (!e.ctrlKey) {
                TAB.selected = [];
            }
            // var result = $("#select-result").empty();
            $(".ui-selected", this).each(function (index) {
                // only get the CELLS
                var id = $(this).attr('id');
                if (id.indexOf('cell') > -1) {
                    // execute acton here
                    TAB.selected.push(id);
                }
            });
            console.log(TAB.selected);
        }
    });
}
