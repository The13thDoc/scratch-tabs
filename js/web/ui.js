/*global*/
var guitarStrings = 6;
var maxFrets = 24;
var startCells = 36;
var totalCells = {1:36}; // number of columns, or 'frets'
var tabs = 0;
var visibleTab = 0;
var selected = [];
var savedInput = {};
var userInput = '';
var defaultEmpty = '--';

var asciiVisible = 'false';
var isInitializing = 'false';

/*
* On load
*/
window.onload = function (){
  addMeasure();

  var addNewMeasure = document.getElementById('add-measure');
  addNewMeasure.addEventListener('click', function (event) {
    addMeasure();
  }, true);

  var toggleASCII = document.getElementById('toggle-ascii');
  toggleASCII.addEventListener('click', function (event) {
    var asciiText = document.getElementById('ascii-text');

    if(asciiVisible === 'true') {
      asciiText.setAttribute('style', 'display: none;');
      asciiVisible = 'false';
    } else {
      asciiText.setAttribute('style', 'display: inherit;');
      asciiVisible = 'true';
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
  isInitializing = 'true';
  // Let's create lists here.
  // Replicate a spreadhsheet look
  var content = document.getElementById('measure-content');
  content.setAttribute('style', 'overflow: auto;');

  var tabDiv = document.createElement('div');
  tabDiv.id = 'tab-div-' + tabs.toString();
  tabDiv.className = 'tab-div';
  content.appendChild(tabDiv);

  var tabList = document.createElement('div');
  tabList.id = 'tab-list-' + tabs.toString();
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

    var cellColumnID = 'column_' + cell + '-' + tabs.toString();
    var column = document.createElement('ul');
    column.id = 'tuning-list' + '-' + tabs.toString();
    column.className = 'tuning-column tuning-list';

    // Move DOWN the tablature
    for (var string = 1; string <= guitarStrings; string++) {

      var matrixID = cell + 'x' + string + '-' + tabs.toString();
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
  inputList.id = 'input-list' + '-' + tabs.toString();
  inputList.className = 'input-list';
  makeSelectable(inputList);
  tabList.appendChild(inputList);

  // Create the input columns
  // Move DOWN the tablature
  for (var string = 1; string <= guitarStrings; string++) {

    // Move ACROSS the tablature
    for (var cell = 1; cell <= totalCells[tabs]; cell++) {
      var matrixID = cell + 'x' + string + '-' + tabs.toString();
      var cellID = 'cell_' + matrixID;

      var item = document.createElement('li');
      item.id = cellID;

      // Write the cells
      var canvasElement = getNewCanvas(matrixID);
      savedInput[matrixID] = defaultEmpty;

      // front
      item.className = 'input-cell ui-state-default';
      item.appendChild(canvasElement);

      inputList.appendChild(item);
    }
  }
  // Finished creating the tablature cells.

  updateWidth(totalCells[tabs], inputList);

  var available = document.getElementById('columns-available');
  available.innerHTML = totalCells[tabs];

  writeASCII();
  isInitializing = 'false';
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
        selected = [];
      }
      // var result = $("#select-result").empty();
      $(".ui-selected", this).each(function (index) {
        // only get the CELLS
        var id = $(this).attr('id');
        if (id.indexOf('cell') > -1) {
          // execute acton here
          selected.push(id);
        }
      });
      console.log(selected);
    }
  });
}
