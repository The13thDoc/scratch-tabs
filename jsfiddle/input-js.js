// On Load
// window.focus();

var guitarStrings = 6;
var selected = [];
init(guitarStrings);
var userInput = '';

// Initialize the UI
function init(guitarStrings) {
  // Let's create lists here.
  // Replicate a spreadhsheet look

  var totalCells = 10; // number of columns, or 'frets'

  var tabDiv = document.createElement('div');
  tabDiv.id = 'tab-div';

  var tabList = document.createElement('div');
  tabList.id = 'tab-list';
  tabDiv.appendChild(tabList);

  // For all user input
  var inputList = document.createElement('ul');
  inputList.id = 'input-list';
  inputList.className = 'columns';
  makeSelectable(inputList);

  tabList.appendChild(inputList);

  // Move ACROSS the tablature
  for (var cell = 0; cell <= totalCells; cell++) {

    var cellColumnID = 'column_' + cell;
    var column = document.createElement('ul');
    column.id = cellColumnID;
    column.className = 'float-left';

    // Move DOWN the tablature
    for (var string = 1; string <= guitarStrings; string++) {

      var matrixID = cell + 'x' + string;
      var cellID = 'cell_' + matrixID;

      var item = document.createElement('li');
      item.id = cellID;

      if (cell === 0) { // Write the tuning

        item.innerHTML = 'X';
        item.className = 'cell tuning-cell';

      } else { // Write the cells

        var canvasElement = getNewCanvas(matrixID);

        // front
        item.className = 'cell input-cell ui-state-default';
        item.appendChild(canvasElement);
      }
      column.appendChild(item);


      if (cell !== 0) {
        inputList.appendChild(item);
      }
    }
    if (cell === 0) {
      tabList.insertBefore(column, inputList);
    }
  }
  var width = 20 * (totalCells + 1) + 2;

  var content = document.getElementById('measure-content');
  //tabDiv.setAttribute('style', 'width:' + width + 'px;');
  content.appendChild(tabDiv);
}

/**
* Returns a new canvas element with the default drawing.
*/
function getNewCanvas(id) {
  var canvasElement = document.createElement('canvas');
  canvasElement.id = 'canvas_'+id;
  canvasElement.width = '20';
  canvasElement.height = '20';

  var canvas = canvasElement.getContext("2d");
  drawLine(canvas);

  return canvasElement;
}

/**
* Translate key codes from a number pad
* to its actual number.
*/
function fromKeyCode(key) {
  var numberPadMap = {
    '96':'0',
    '97':'1',
    '98':'2',
    '99':'3',
    '100':'4',
    '101':'5',
    '102':'6',
    '103':'7',
    '104':'8',
    '105':'9'
  };

  return numberPadMap[key];
}

/*
* On load
*/
document.addEventListener('keyup', function(event) {
  var key = event.keyCode;
  var char;

  // INPUT mode
  if (selected.length != 0) {
    var timeoutID = window.setTimeout(clearTemp, 1000);

    if (key >= 48 && key <= 57) {
      char = String.fromCharCode(key);
      userInput = userInput + char;
      console.log('input','WRITE - keyCode: '+key+'; charCode: '+char+' = '+userInput);

      if (parseInt(userInput) > 20) {
        console.log('input','Parse to int successful');
        userInput = char;
      }

      writeAll(userInput);
    }

    // 96 - 105 (number pad)
    if (key >= 96 && key <= 105) {
      char = fromKeyCode(key);
      userInput = userInput + char;
      console.log('input','WRITE - keyCode: '+key+'; charCode: '+char+' = '+userInput);

      if (parseInt(userInput) > 20) {
        console.log('input','Parse to int successful');
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
  for(var i = 0; i < selected.length; i++){
    // Get only the matrix index. Disregard the element type.
    var index = selected[i].replace('cell_', '');

    writeToCanvas(index, userInput);
  }
}

/**
* Draw user input to canvas cell.
*/
function writeToCanvas(id, text) {
  var cell = document.getElementById('cell_'+id);

  var canvasElement = getNewCanvas(id);
  var canvas = canvasElement.getContext("2d");
  var x = canvasElement.width / 2;
  var y = canvasElement.height / 2;
  // draw text
  canvas.font = '10pt Arial';
  canvas.textAlign = 'center';
  canvas.textBaseline = 'middle';
  canvas.strokeText(text, x, y);

  // remove current canvas
  cell.removeChild(cell.lastChild);
  // add new canvas
  cell.appendChild(canvasElement);
}

function unselectAll() {
  console.log('input','UNSELECT');
  for(var i = 0; i < selected.length; i++){
    var cell = document.getElementById(selected[i]);
    cell.classList.remove('ui-selected');
  }
}

function clearAll() {
  console.log('input','ERASE');
  for(var i = 0; i < selected.length; i++){
    // Get only the matrix index. Disregard the element type.
    var index = selected[i].replace('cell_', '');

    clearCanvas(index);
  }
}

/**
* Create a new, default canvas (erase).
*/
function clearCanvas(id) {
  var cell = document.getElementById('cell_'+id);
  cell.removeChild(cell.lastChild);

  var canvasElement = getNewCanvas(id);

  // add new canvas element to cell
  cell.appendChild(canvasElement);
}

// Pain the default look onto the canvas cell.
function drawLine(canvas) {
  // paint black line
  canvas.fillStyle = "#000000";
  canvas.fillRect(0, 10, 20, 1);
}

// Apply the jQuery selectability to an element.
function makeSelectable(e) {
  $(e).selectable({
    stop: function () {
      if (!e.ctrlKey) {
        selected = [];
      }
      // var result = $("#select-result").empty();
      $(".ui-selected", this).each(

        // only get the CELLS
        function (index) {
          var id = $(this).attr('id');
          if (id.indexOf('cell') > -1) {
            // execute acton here
            selected.push(id);
          }
        });
        console.log(selected);
      }
    });
  };
