// On Load
var guitarStrings = 6;
var selected = [];
init(guitarStrings);

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
    // TO DO: Set a timeout

    for(var i = 0; i < selected.length; i++){

      // Get only the matrix index. Disregard the element type.
      var index = selected[i].replace('cell_', '');

      if (key >= 48 && key <= 57) {
        char = String.fromCharCode(key);
        console.log('input','WRITE - keyCode: '+key+'; charCode: '+char+'; matrix: '+index);

        writeToCanvas(index, char);
      }
      // 96 - 105 (number pad)
      if (key >= 96 && key <= 105) {
        char = fromKeyCode(key);
        console.log('input','WRITE FROM NUMBER PAD - keyCode: '+key+'; charCode: '+char+'; matrix: '+index);

        writeToCanvas(index, char);
      }
      // 8 (backspace), 46 (delete)
      if (key === 8 || key === 46) {
        char = fromKeyCode(key);
        console.log('input','ERASE - keyCode: '+key+'; charCode: '+char+'; matrix: '+index);

        clearCanvas(index);
      }

      // 27 (escape)
      if (key === 27) {
        var cell = document.getElementById(selected[i]);
        console.log('input','UNSELECT - keyCode: '+key+'; charCode: '+char+'; matrix: '+index);

        cell.classList.remove('ui-selected');
      }
    }
  }
}, true);


/**
* Draw user input to canvas cell.
*/
function writeToCanvas(id, text) {
  var cell = document.getElementById('cell_'+id);
  cell.removeChild(cell.lastChild);

  var canvasElement = getNewCanvas(id);
  var canvas = canvasElement.getContext("2d");
  // draw text
  canvas.font = '11pt Arial';
  canvas.strokeText(text, 7, 15);

  // add new canvas element to cell
  cell.appendChild(canvasElement);
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
