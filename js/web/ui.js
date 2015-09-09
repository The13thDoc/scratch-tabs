/*global application variable*/
var TABAPP = TABAPP || {};

TABAPP.ui = {
    measure: '',

    /**
     * Initialize project variables.
     */
    initProjectVariables: function() {
        TABAPP.tabs = 0; // shouldn't need
        TABAPP.visibleTab = 0; // shouldn't need
        TABAPP.savedInput = {}; // IO
        TABAPP.userInput = ''; // IO
        TABAPP.asciiformats = { // Formatting
            'monospace-3': {
                'rules': {
                    'defaultEmpty': '---',
                    'singlecharacter': {
                        'pretuning': '',
                        'posttuning': ' |',

                        'prefirstbeat': '',
                        'postfirstbeat': '--',

                        'prenextbeat': '',
                        'postnextbeat': '--',

                        'prelastbeat': '',
                        'postlastbeat': '--'
                    },
                    'doublecharacter': {
                        'pretuning': '',
                        'posttuning': '|',

                        'prefirstbeat': '',
                        'postfirstbeat': '-',

                        'prenextbeat': '',
                        'postnextbeat': '-',

                        'prelastbeat': '',
                        'postlastbeat': '-'
                    }
                }
            }
        };

        TABAPP.measures = [];
        TABAPP.activeMeasure;

        var asciiText = document.getElementById('ascii-text');
        if (TABAPP.ui.measure.asciiVisible === 'true') {
            asciiText.setAttribute('style', 'display: inherit;');
        } else {
            asciiText.setAttribute('style', 'display: none;');
        }
    },

    // Initialize the UI
    initUI: function(guitarStrings, duplicateID) {
        var measure = TABAPP.activeMeasure;
        measure.isInitializing = 'true';
        // Let's create lists here.
        // Replicate a spreadhsheet layout
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
            for (var string = 1; string <= measure.guitarStrings; string++) {

                var matrixID = cell + 'x' + string + '-' + TABAPP.tabs.toString();
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
                tabList.appendChild(column);

                TABAPP.canvas.writeToBlankCanvas(matrixID, tuning[string]);
            }
        }


        // For all user input
        var inputList = document.createElement('ul');
        inputList.id = 'input-list' + '-' + TABAPP.tabs.toString();
        inputList.className = 'input-list';
        this.makeSelectable(inputList);
        tabList.appendChild(inputList);

        // Create the input columns
        // Move DOWN the tablature
        for (var string = 1; string <= measure.guitarStrings; string++) {

            // Move ACROSS the tablature
            for (var cell = 1; cell <= measure.totalCells[TABAPP.tabs]; cell++) {
                var matrixID = cell + 'x' + string + '-' + TABAPP.tabs.toString();
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

        this.updateWidth(measure.totalCells[TABAPP.tabs], inputList);

        var available = document.getElementById('columns-available');
        available.innerHTML = measure.totalCells[TABAPP.tabs];

        // TABPAPP.ascii.writeASCII(); TODO - Uncomment. Temporarily remove.
        measure.isInitializing = 'false';
    },

    /**
     * Resize the input list's width to fit the new number of columns.
     */
    updateWidth: function(cells, inputList) {
        var width = 20 * (cells);
        inputList.setAttribute('style', 'width:' + width + 'px;');

        var available = document.getElementById('columns-available');
        available.innerHTML = cells;
    },

    // Apply the jQuery selectability to an element.
    makeSelectable: function(e) {
        var measure = TABAPP.activeMeasure;
        $(e).selectable({
            stop: function() {
                if (!e.ctrlKey) {
                    measure.selected = [];
                }
                // var result = $("#select-result").empty();
                $(".ui-selected", this).each(function(index) {
                    // only get the CELLS
                    var id = $(this).attr('id');
                    if (id.indexOf('cell') > -1) {
                        // execute acton here
                        measure.selected.push(id);
                    }
                });
                console.log(measure.selected);
            }
        });
    },

    /**
     * Make the measure activate and visible.
     */
    activateMeasure: function(measure) {
        var currentTab = TABAPP.activeMeasure;
        // TABAPP.visibleTab = tabID;
        TABAPP.activeMeasure = measure;

        var tabDiv = document.getElementById('tab-div-' + TABAPP.visibleTab.toString());
        console.log('tab-div-' + TABAPP.visibleTab.toString());
        var measureItemSelect = document.getElementById('measure-item-' + TABAPP.visibleTab.toString());
        var previousMeasureNameInput = document.getElementById('measure-name-input-' + currentTab.toString());
        var nextMeasureNameInput = document.getElementById('measure-name-input-' + TABAPP.visibleTab.toString());

        if (currentTab !== 0) {
            var measureItemUnselect = document.getElementById('measure-item-' + currentTab.toString());
            document.getElementById('tab-div-' + currentTab).setAttribute('style', 'display: none;');

            measureItemUnselect.classList.toggle('measure-headers-list-selected', false);
            measureItemUnselect.classList.toggle('measure-headers-list-unselected', true);
        }

        tabDiv.setAttribute('style', 'display: inherit;');

        measureItemSelect.classList.toggle('measure-headers-list-selected', true);
        measureItemSelect.classList.toggle('measure-headers-list-unselected', false);

        var available = document.getElementById('columns-available');
        available.innerHTML = measure.totalCells[tabID];

        // TABAPP.input.unselectAll();
    },

    /**
     * Append a new measure to the current list.
     */
    addMeasure: function() {
        var measure = new Measure();
        var tabsList = document.getElementById('measure-headers-list');

        var item = document.createElement('li');

        // append to list
        // TABAPP.tabs = TABAPP.tabs + 1; // old way
        TABAPP.measures.push(measure); // new way
        // this.totalCells[TABAPP.tabs] = this.startCells;

        item.id = 'measure-item-' + TABAPP.tabs.toString();
        tabsList.appendChild(item);
        item.addEventListener('click', function(event) {
            this.activateMeasure(div.id.replace('measure-div-', ''), this);
        }, true);

        var div = document.createElement('div');
        div.id = 'measure-div-' + TABAPP.tabs.toString();
        div.title = 'Measure ' + TABAPP.tabs.toString();
        div.classList.add('header-size');
        div.innerHTML = div.title;

        var nav = measure.createContextMenu(div);

        item.addEventListener('contextmenu', function(event) {
            console.log('Context menu enabled');
            // Prevent normal context menu
            event.preventDefault();
            nav.style.top = event.pageY + "px";
            nav.style.left = event.pageX + "px";
            nav.style.display = 'inherit';
        }, true);

        window.addEventListener('click', function(event) {
            console.log('Context menu disabled');
            var menu = document.getElementById(nav.id);
            menu.style.display = 'none';
        }, true);

        item.appendChild(div);

        TABAPP.ui.initUI(TABAPP.guitarStrings, duplicateID);

        this.activateMeasure(measure);
    },

    /**
     * Main.
     */
    loadMain: function() {
        TABAPP.ui.initProjectVariables();

        this.addMeasure();

        var addNewMeasure = document.getElementById('add-measure');
        addNewMeasure.addEventListener('click', function(event) {
            this.addMeasure();
        }, true);

        var toggleASCII = document.getElementById('toggle-ascii');
        toggleASCII.addEventListener('click', function(event) {
            var asciiText = document.getElementById('ascii-text');

            if (TABAPP.ui.measure.asciiVisible === 'true') {
                asciiText.setAttribute('style', 'display: none;');
                TABAPP.ui.measure.asciiVisible = 'false';
            } else {
                asciiText.setAttribute('style', 'display: inherit;');
                TABAPP.ui.measure.asciiVisible = 'true';
            }
        }, true);

        var incrementMeasure = document.getElementById('increment');
        incrementMeasure.addEventListener('click', function(event) {
            TABAPP.ui.measure.extendMeasure();
        }, true);

        var decrementMeasure = document.getElementById('decrement');
        decrementMeasure.addEventListener('click', function(event) {
            TABAPP.ui.measure.shrinkMeasure();
        }, true);

        TABAPP.input.initUserInput();
    }
};
