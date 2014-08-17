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

      var cellID = 'cell_' + cell + 'x' + string;

      var item = document.createElement('li');
      item.id = cellID;

      if (cell === 0) { // Write the tuning

        item.innerHTML = 'X';
        item.className = 'cell tuning-cell';

      } else { // Write the cells

        var canvasID = 'canvas_' + string + '-' + cell;
        var canvas = document.createElement('canvas');
        canvas.id = canvasID;
        canvas.width = '20';
        canvas.height = '20';

        var line = canvas.getContext("2d");
        line.fillStyle = "#000000";
        line.fillRect(0, 10, 20, 1);
        line.font = '12px Arial';

        // front
        item.className = 'cell input-cell ui-state-default';
        item.appendChild(canvas);
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

// Input
function writeToCanvas(id, text) {
  var element = document.getElementById(id);
  console.log('Write: '+text+' to cell: '+element.id);

  var line = element.getContext("2d");
  // line.fillStyle = "#000000";
  // line.fillRect(0, 10, 20, 1);
  line.font = '12px Arial';
  line.strokeText(text, 7, 15);
}

/*
* On load
*/
document.addEventListener('keyup', function(event) {
  var key = event.keyCode;
  var char = String.fromCharCode(key);

  // INPUT mode
  if (selected.length != 0) {
    // TO DO: Set a timeout

    if (key >= 48 && key <= 57) {
      console.log('keyCode: '+key);
      console.log('charCode: '+char);

      writeToCanvas(selected[0], char);
    }
    // 96 - 105 (number pad)
    if (key >= 96 && key <= 105) {
      console.log('keyCode: '+key);
      console.log('charCode: '+fromKeyCode(key));

      writeToCanvas(selected[0], char);
    }

  }
}, true);

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
