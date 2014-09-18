/**
 * Porting Javascript prototype to Dart.
 */

import 'dart:html';
import 'dart:js' as js;

var guitarStrings = 6;
var selected = [];
var userInput = '';

void main() {
  print('starting...');
  init(guitarStrings);


}

/// Initialize the UI
void init(guitarStrings) {
  print('initializing UI...');
  // Let's create lists here.
  // Replicate a spreadhsheet look

  var totalCells = 10; // number of columns, or 'frets'

  var tabDiv = new Element.tag('div');
  tabDiv.id = 'tab-div';

  var tabList = new Element.tag('div');
  tabList.id = 'tab-list';
  tabDiv.append(tabList);

  // For all user input
  var inputList = new Element.tag('ul');
  inputList.id = 'input-list';
  inputList.className = 'columns';
  makeSelectable(inputList);
  
  tabList.append(inputList);

  // Move ACROSS the tablature
  for (var cell = 0; cell <= totalCells; cell++) {

    var cellColumnID = 'column_' + cell.toString();
    var column = new Element.tag('ul');
    column.id = cellColumnID;
    column.className = 'float-left';

    // Move DOWN the tablature
    for (var string = 1; string <= guitarStrings; string++) {

      var matrixID = cell.toString() + 'x' + string.toString();
      var cellID = 'cell_' + matrixID.toString();

      var item = new Element.tag('li');
      item.id = cellID;

      var tuning = {
        '1': 'E',
        '2': 'B',
        '3': 'G',
        '4': 'D',
        '5': 'A',
        '6': 'E',
      };

      if (cell == 0) { // Write the tuning
        item.appendHtml(tuning[string.toString()]);
        item.className = 'cell tuning-cell';

      } else { // Write the cells

        var canvasElement = getNewCanvas(matrixID);

        // front
        item.className = 'cell input-cell ui-state-default';
        item.append(canvasElement);
      }
      column.append(item);


      if (cell != 0) {
        inputList.append(item);
      }
    }
    if (cell == 0) {
      tabList.insertBefore(column, inputList);
    }
  }
  var width = 20 * (totalCells + 1) + 2;

  var content = document.getElementById('measure-content');
  //tabDiv.setAttribute('style', 'width:' + width + 'px;');
  content.append(tabDiv);
}

/// Returns a new canvas element with the default drawing.
Element getNewCanvas(id) {
  var canvasElement = new Element.tag('canvas');
  canvasElement.id = 'canvas_' + id;
  canvasElement.width = 20;
  canvasElement.height = 20;

  var canvas = canvasElement.getContext("2d");
  drawLine(canvas);

  return canvasElement;
}


/// Translate key codes from a number pad
/// to its actual number.
void append(key) {
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

/// Clear the temporary user input variable.
void clearTemp() {
  if (userInput.length > 0) {
    userInput = '';
    print(/*'input',*/'Cleared temp');
  }
}

/// Write current user input to all selected cells.
void writeAll(userInput) {
  for (var i = 0; i < selected.length; i++) {
    // Get only the matrix index. Disregard the element type.
    var index = selected[i].replace('cell_', '');

    writeToCanvas(index, userInput);
  }
}

/// Draw user input to canvas cell.
void writeToCanvas(id, text) {
  var cell = document.getElementById('cell_' + id);

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
  cell.remove();
  // add new canvas
  cell.append(canvasElement);
}

/// Unselect each selected cell.
void unselectAll() {
  print(/*'input',*/'UNSELECT');
  for (var i = 0; i < selected.length; i++) {
    var cell = document.getElementById(selected[i]);
    cell.classes.remove('ui-selected');
  }
}

/// Clear each selected cell.
void clearAll() {
  print(/*'input',*/'ERASE');
  for (var i = 0; i < selected.length; i++) {
    // Get only the matrix index. Disregard the element type.
    var index = selected[i].replace('cell_', '');

    clearCanvas(index);
  }
}


/// Create a new, default canvas (erase).
void clearCanvas(id) {
  var cell = document.getElementById('cell_' + id);
  cell.remove();

  var canvasElement = getNewCanvas(id);

  // add new canvas element to cell
  cell.append(canvasElement);
}

/// Pain the default look onto the canvas cell.
void drawLine(canvas) {
  // paint black line
  canvas.fillStyle = "#000000";
  canvas.fillRect(0, 10, 20, 1);
}

/// Apply the jQuery selectability to an element.
void makeSelectable(Element e) {
  js.context..callMethod(r'$', [e])
      ..callMethod('selectable', [new js.JsObject.jsify({'stop': 'function () {}'})]);
  
//  $(e).selectable({
//    stop: function () {
//      if (!e.ctrlKey) {
//        selected = [];
//      }
//      // var result = $("#select-result").empty();
//      $(".ui-selected", this).each(function (index) {
//        // only get the CELLS
//        var id = $(this).attr('id');
//        if (id.indexOf('cell') > -1) {
//          // execute acton here
//          selected.push(id);
//        }
//      });
//      console.log(selected);
//    }
//  });
}
