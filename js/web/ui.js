/*global application variable*/
var TABAPP = TABAPP || {};

/*
* On load
*/
window.onload = TABAPP.utilityFunctions.loadMain;

TABAPP.ui = {

    /**
    * Main.
    */
    loadMain: function () {
        initProjectVariables();

        addMeasure();

        var addNewMeasure = document.getElementById('add-measure');
        addNewMeasure.addEventListener('click', function (event) {
            addMeasure();
        }, true);

        var toggleASCII = document.getElementById('toggle-ascii');
        toggleASCII.addEventListener('click', function (event) {
            var asciiText = document.getElementById('ascii-text');

            if(TABAPP.asciiVisible === 'true') {
                asciiText.setAttribute('style', 'display: none;');
                TABAPP.asciiVisible = 'false';
            } else {
                asciiText.setAttribute('style', 'display: inherit;');
                TABAPP.asciiVisible = 'true';
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
    },

    /**
    * Initialize project variables.
    */
    initProjectVariables: function () {
        TABAPP.guitarStrings = 6;
        TABAPP.maxFrets = 24;
        TABAPP.startCells = 36;
        TABAPP.totalCells = {1:36}; // number of columns, or 'frets'
        TABAPP.tabs = 0;
        TABAPP.visibleTab = 0;
        TABAPP.selected = [];
        TABAPP.savedInput = {};
        TABAPP.userInput = '';
        TABAPP.asciiformats = {
            'monospace-3':{
                'rules':{
                    'defaultEmpty':'---',
                    'singlecharacter':{
                        'pretuning':'',
                        'posttuning':' |',

                        'prefirstbeat':'',
                        'postfirstbeat':'--',

                        'prenextbeat':'',
                        'postnextbeat':'--',

                        'prelastbeat':'',
                        'postlastbeat':'--'
                    },
                    'doublecharacter':{
                        'pretuning':'',
                        'posttuning':'|',

                        'prefirstbeat':'',
                        'postfirstbeat':'-',

                        'prenextbeat':'',
                        'postnextbeat':'-',

                        'prelastbeat':'',
                        'postlastbeat':'-'
                    }
                }
            }
        };
        TABAPP.defaultEmpty = TABAPP.asciiformats['monospace-3']['rules']['defaultEmpty'];
        TABAPP.asciiVisible = 'true';
        TABAPP.isInitializing = 'false';

        var asciiText = document.getElementById('ascii-text');
        if(TABAPP.asciiVisible === 'true') {
            asciiText.setAttribute('style', 'display: inherit;');
        } else {
            asciiText.setAttribute('style', 'display: none;');
        }
    },

    // Initialize the UI
    initUI: function (guitarStrings, duplicateID) {
        TABAPP.isInitializing = 'true';
        // Let's create lists here.
        // Replicate a spreadhsheet look
        var content = document.getElementById('measure-content');
        content.setAttribute('style', 'overflow: auto;');

        var tabDiv = document.createElement('div');
        tabDiv.id = 'tab-div-' + TABAPP.tabs.toString();
        tabDiv.className = 'tab-div';
        content.appendChild(tabDiv);

        var tabList = document.createElement('div');
        tabList.id = 'tab-list-' + TABAPP.tabs.toString();
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

            var cellColumnID = 'column_' + cell + '-' + TABAPP.tabs.toString();
            var column = document.createElement('ul');
            column.id = 'tuning-list' + '-' + TABAPP.tabs.toString();
            column.className = 'tuning-column tuning-list';

            // Move DOWN the tablature
            for (var string = 1; string <= TABAPP.guitarStrings; string++) {

                var matrixID = cell + 'x' + string + '-' + TABAPP.tabs.toString();
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
        inputList.id = 'input-list' + '-' + TABAPP.tabs.toString();
        inputList.className = 'input-list';
        makeSelectable(inputList);
        tabList.appendChild(inputList);

        // Create the input columns
        // Move DOWN the tablature
        for (var string = 1; string <= TABAPP.guitarStrings; string++) {

            // Move ACROSS the tablature
            for (var cell = 1; cell <= TABAPP.totalCells[TABAPP.tabs]; cell++) {
                var matrixID = cell + 'x' + string + '-' + TABAPP.tabs.toString();
                var cellID = 'cell_' + matrixID;

                var item = document.createElement('li');
                item.id = cellID;

                if(duplicateID !== undefined) {
                    var copying = matrixID.substring(0, matrixID.length - 1) + duplicateID;
                    TABAPP.savedInput[matrixID] = TABAPP.savedInput[copying];
                } else {
                    TABAPP.savedInput[matrixID] = TABAPP.defaultEmpty;
                }

                // Write the cells
                var canvasElement = getNewCanvas(matrixID);

                // front
                item.className = 'input-cell ui-state-default';
                item.appendChild(canvasElement);

                inputList.appendChild(item);

                if(TABAPP.savedInput[matrixID] !== TABAPP.defaultEmpty) {
                    writeToCanvas(matrixID, TABAPP.savedInput[matrixID]);
                }
            }
        }
        // Finished creating the tablature cells.

        updateWidth(TABAPP.totalCells[TABAPP.tabs], inputList);

        var available = document.getElementById('columns-available');
        available.innerHTML = TABAPP.totalCells[TABAPP.tabs];

        writeASCII();
        TABAPP.isInitializing = 'false';
    },

    /**
    * Resize the input list's width to fit the new number of columns.
    */
    updateWidth: function (cells, inputList) {
        var width = 20 * (cells);
        inputList.setAttribute('style', 'width:' + width + 'px;');

        var available = document.getElementById('columns-available');
        available.innerHTML = cells;
    },

    // Apply the jQuery selectability to an element.
    makeSelectable: function (e) {
        $(e).selectable({
            stop: function () {
            if (!e.ctrlKey) {
                TABAPP.selected = [];
            }
            // var result = $("#select-result").empty();
            $(".ui-selected", this).each(function (index) {
                // only get the CELLS
                var id = $(this).attr('id');
                if (id.indexOf('cell') > -1) {
                    // execute acton here
                    TABAPP.selected.push(id);
                }
            });
            console.log(TABAPP.selected);
            }
        });
    }
}
