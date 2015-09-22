/*global application variable*/
var TABAPP = TABAPP || {};

TABAPP.ui = {
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
        available.innerHTML = measure.totalCells;

        // TABAPP.input.unselectAll();
    },

    /**
     * Append a new measure to the current list.
     */
    addMeasure: function() {
        var measure = new Measure();
        measure.isInitializing = 'true';

        var tabsList = document.getElementById('measure-headers-list');

        var item = document.createElement('li');

        // append to list
        // TABAPP.tabs = TABAPP.tabs + 1; // old way
        TABAPP.measures.push(measure); // new way
        // this.totalCells[TABAPP.tabs] = this.startCells;

        // item.id = 'measure-item-' + TABAPP.tabs.toString();
        tabsList.appendChild(item);
        item.addEventListener('click', function(event) {
            this.activateMeasure(div.id.replace('measure-div-', ''), this);
        }, true);

        var div = document.createElement('div');
        // div.id = 'measure-div-' + TABAPP.tabs.toString();
        // div.title = 'Measure ' + TABAPP.tabs.toString();
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
            // var menu = document.getElementById(nav.id);
            nav.style.display = 'none';
        }, true);

        item.appendChild(div);

        // Let's create lists here.
        // Replicate a spreadhsheet layout
        var content = document.getElementById('measure-content');
        content.setAttribute('style', 'overflow: auto;');

        var tabDiv = document.createElement('div');
        // tabDiv.id = 'tab-div-' + TABAPP.tabs.toString();
        tabDiv.className = 'tab-div';
        content.appendChild(tabDiv);

        var tabList = document.createElement('div');
        // tabList.id = 'tab-list-' + TABAPP.tabs.toString();
        tabDiv.appendChild(tabList);

        tabList.appendChild(measure.createTuning());

        // For all user input
        var inputList = document.createElement('ul');
        // inputList.id = 'input-list' + '-' + TABAPP.tabs.toString();
        inputList.className = 'input-list';
        this.makeSelectable(inputList);
        tabList.appendChild(inputList);

        measure.createMeasure(inputList);

        this.updateWidth(measure.totalCells, inputList);

        // TABPAPP.ascii.writeASCII(); TODO - Uncomment. Temporarily remove.
        measure.isInitializing = 'false';
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
