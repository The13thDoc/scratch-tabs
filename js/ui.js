// On Load
//window.focus();
var guitarStrings = 6;
var maxFrets = 24;
var startCells = 36;
var totalCells = {1:36}; // number of columns, or 'frets'
var tabs = 0;
var visibleTab = 0;
var selected = [];
var savedInput = {};
var userInput = '';

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

  document.addEventListener('keyup', function (event) {
    var key = event.keyCode;
    var char;

    // INPUT mode
    if (selected.length != 0) {
      var timeoutID = window.setTimeout(clearTemp, 1000);

      if (key >= 48 && key <= 57) {
        char = String.fromCharCode(key);
        userInput = userInput + char;
        console.log('input', 'WRITE - keyCode: ' + key + '; charCode: ' + char + ' = ' + userInput);

        if (parseInt(userInput) > maxFrets) {
          console.log('input', 'Parse to int successful');
          userInput = char;
        }

        writeAll(userInput);
      }

      // 96 - 105 (number pad)
      if (key >= 96 && key <= 105) {
        char = fromKeyCode(key);
        userInput = userInput + char;
        console.log('input', 'WRITE - keyCode: ' + key + '; charCode: ' + char + ' = ' + userInput);

        if (parseInt(userInput) > maxFrets) {
          console.log('input', 'Parse to int successful');
          userInput = char;
        }

        writeAll(userInput);
      }

      // 8 (backspace), 46 (delete)
      if (key === 8 || key === 46) {
        clearAll();
      }

      // 27 (escape)
      if (key === 27) {
        unselectAll();
      }

    }
  }, true);

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
  // tabDiv.setAttribute('style', 'overflow: scroll;');
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
      savedInput[matrixID] = '--';

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
* Remove the last column (fret) from the tablature.
*/
function shrinkMeasure() {
  // console.debug('measure', 'Remove last column');
  // For all user input
  var inputList = document.getElementById('input-list' + '-' + visibleTab.toString());
  var last = totalCells[visibleTab];
  var decremented = last - 1;

  // Move DOWN the tablature
  for (var string = 1; string <= guitarStrings; string++) {
    var matrixID = last + 'x' + string + '-' + visibleTab.toString();
    var cellID = 'cell_' + matrixID;

    var item = document.getElementById(cellID);
    // console.debug('measure', item);
    inputList.removeChild(item);
  }

  // Now, increment the total number of cells by 1.
  totalCells[visibleTab] = decremented;

  updateWidth(totalCells[visibleTab], inputList);

  writeASCII();
}

/**
* Append another column (fret) of input to the tablature.
*/
function extendMeasure() {
  // For all user input
  var inputList = document.getElementById('input-list' + '-' + visibleTab.toString());
  var incremented = (totalCells[visibleTab] + 1);

  // Create the input columns
  // Move DOWN the tablature
  for (var string = 1; string <= guitarStrings; string++) {

    // Move ACROSS the tablature
    for (var cell = incremented; cell <= incremented; cell++) {
      var matrixID = cell + 'x' + string + '-' + visibleTab.toString();
      var cellID = 'cell_' + matrixID;

      var item = document.createElement('li');
      item.id = cellID;

      // Write the cells
      var canvasElement = getNewCanvas(matrixID);
      savedInput[matrixID] = '--';

      // front
      item.className = 'input-cell ui-state-default';
      item.appendChild(canvasElement);

      var referenceString = string + 1; // String following current one.
      var referenceElement = document.getElementById('cell_1' + 'x' +
      referenceString + '-' + visibleTab.toString());

      if (string < 6) {
        inputList.insertBefore(item, referenceElement);
      } else {
        inputList.appendChild(item);
      }
    }
  }
  // Finished creating the tablature cells.

  // Now, increment the total number of cells by 1.
  totalCells[visibleTab] = incremented;

  updateWidth(totalCells[visibleTab], inputList);

  writeASCII();
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

/**
* Returns a new canvas element with the default drawing.
*/
function getNewCanvas(id) {
  var canvasElement = document.createElement('canvas');
  canvasElement.id = 'canvas_' + id;
  canvasElement.width = '20';
  canvasElement.height = '20';

  var canvas = canvasElement.getContext("2d");
  drawLine(canvas);

  return canvasElement;
}

/**
* Returns a new canvas element with the default drawing.
*/
function getNewBlankCanvas(id) {
  var canvasElement = document.createElement('canvas');
  canvasElement.id = 'canvas_' + id;
  canvasElement.width = '20';
  canvasElement.height = '20';

  var canvas = canvasElement.getContext("2d");

  return canvasElement;
}

/**
* Translate key codes from a number pad
* to its actual number.
*/
function fromKeyCode(key) {
  var numberPadMap = {
    '96': '0',
    '97': '1',
    '98': '2',
    '99': '3',
    '100': '4',
    '101': '5',
    '102': '6',
    '103': '7',
    '104': '8',
    '105': '9'
  };

  return numberPadMap[key];
}

function clearTemp() {
  if (userInput.length > 0) {
    userInput = '';
    console.log('input', 'Cleared temp');
  }
}

/**
* Write current user input to all selected cells.
*/
function writeAll(userInput) {
  for (var i = 0; i < selected.length; i++) {
    // Get only the matrix index. Disregard the element type.
    var index = selected[i].replace('cell_', '');

    writeToCanvas(index, userInput);
  }
}

/**
* Draw user input to canvas cell in the tablature,
* with the black line on the canvas.
*/
function writeToCanvas(id, text) {
  write(id, text, getNewCanvas(id));
}

/**
* Draw to a blank canvas.
*/
function writeToBlankCanvas(id, text) {
  write(id, text, getNewBlankCanvas(id));
}

function write(id, text, canvas) {
  var cell = document.getElementById('cell_' + id);

  var canvasElement = canvas;
  var canvas = canvasElement.getContext("2d");
  var x = canvasElement.width / 2;
  var y = canvasElement.height / 2;
  // draw text
  canvas.font = '10pt Arial';
  canvas.textAlign = 'center';
  canvas.textBaseline = 'middle';
  canvas.strokeText(text, x, y);

  savedInput[id] = text;

  // remove current canvas
  cell.removeChild(cell.lastChild);
  // add new canvas
  cell.appendChild(canvasElement);

  if(isInitializing === 'false') {
    writeASCII();
  }
}

/**
* Unselect any selected cells.
*/
function unselectAll() {
  console.log('input', 'UNSELECT');
  for (var i = 0; i < selected.length; i++) {
    var cell = document.getElementById(selected[i]);
    // console.debug(cell);
    cell.classList.remove('unselect', 'ui-selected');
  }
  selected = [];
  // console.debug('unselect', selected.length);
}

/**
* Clear any selected cells.
*/
function clearAll() {
  console.log('input', 'ERASE');
  for (var i = 0; i < selected.length; i++) {
    // Get only the matrix index. Disregard the element type.
    var index = selected[i].replace('cell_', '');

    clearCanvas(index);
  }
}

/**
* Create a new, default canvas (erase).
*/
function clearCanvas(id) {
  var cell = document.getElementById('cell_' + id);
  cell.removeChild(cell.lastChild);

  var canvasElement = getNewCanvas(id);
  savedInput[id] = '';

  // add new canvas element to cell
  cell.appendChild(canvasElement);
}

// Pain the default look onto the canvas cell.
function drawLine(canvas) {
  // paint black line
  canvas.fillStyle = "#000000";
  canvas.fillRect(0, 10, 20, 1);
}

/**
* Append a new measure to the current list.
*/
function addMeasure() {
  var tabsList = document.getElementById('measure-headers-list');

  var item = document.createElement('li');

  tabs = tabs + 1;
  totalCells[tabs] = startCells;

  item.id = 'measure-item-' + tabs.toString();
  tabsList.appendChild(item);
  item.addEventListener('click', function (event) {
    activateMeasure(div.id.replace('measure-div-',''));
  }, true);

  var div = document.createElement('div');
  div.id = 'measure-div-' + tabs.toString();
  div.title = 'Measure ' + tabs.toString();
  div.innerHTML = 'Measure ' + tabs.toString();

  item.appendChild(div);

  init(guitarStrings);

  activateMeasure(tabs);
}

/**
* Make the measure activate and visible.
*/
function activateMeasure(tabID) {
  var currentTab = visibleTab;
  visibleTab = tabID;

  var tabDiv = document.getElementById('tab-div-'+visibleTab.toString());
  var measureItemSelect = document.getElementById('measure-item-'+visibleTab.toString());

  if(currentTab !== 0){
    var measureItemUnselect = document.getElementById('measure-item-'+currentTab.toString());
    document.getElementById('tab-div-'+currentTab).setAttribute('style', 'display: none;');
    measureItemUnselect.setAttribute('style', 'background: #C9C9C9;');
  }
  tabDiv.setAttribute('style', 'display: inherit;');
  measureItemSelect.setAttribute('style', 'background: orange;');

  var available = document.getElementById('columns-available');
  available.innerHTML = totalCells[tabID];

  unselectAll();
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

/**
* Write saved JSON data to a text field.
*/
function writeASCII() {
  var asciiText = document.getElementById('ascii-text');
  asciiText.innerHTML = compileASCII();
}

/**
* Compile and return saved JSON data as a string.
*/
function compileASCII() {
  var ascii = '';
  var data = '';
  var cellID;

  // Move through each measure
  for (var measure = 1; measure <= tabs; measure++) {

    // Move DOWN the tablature
    for (var string = 1; string <= guitarStrings; string++) {

      // Move ACROSS the tablature
      for (var cell = 0; cell <= totalCells[tabs]; cell++) {

        cellID = cell + 'x' + string + '-' + measure;

        if(!savedInput[cellID]) {
          data = '';
        } else {
          data = savedInput[cellID];
        }

        if(cell === 0){
          ascii = ascii + data + "|";
        } else {
          ascii = ascii + '-' + data;
        }

        // console.debug('ascii', cellID);
        // console.debug('ascii', data);
      }
      ascii = ascii + '\n'; // new line for next string
    }
    ascii = ascii + '\n\n'; // two new lines for next measure
  }
  // console.debug('ascii\n', ascii);
  return ascii;
}
