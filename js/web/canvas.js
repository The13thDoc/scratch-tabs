/**
* Functions specific to canvas.
*/

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

  // var canvas = canvasElement.getContext("2d");

  return canvasElement;
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

/**
* Write the specified text to the specified canvas.
*/
function write(id, text, canvasElement) {
  var cell = document.getElementById('cell_' + id);

  var canvasContext = canvasElement.getContext("2d");
  var x = canvasElement.width / 2;
  var y = canvasElement.height / 2;
  // draw text
  canvasContext.font = '10pt Arial';
  canvasContext.textAlign = 'center';
  canvasContext.textBaseline = 'middle';
  canvasContext.strokeText(text, x, y);

  TAB.savedInput[id] = text;

  // remove current canvas
  cell.removeChild(cell.lastChild);
  // add new canvas
  cell.appendChild(canvasElement);

  if(TAB.isInitializing === 'false') {
    writeASCII();
  }
}

/**
* Create a new, default canvas (erase).
*/
function clearCanvas(id) {
  var cell = document.getElementById('cell_' + id);
  cell.removeChild(cell.lastChild);

  var canvasElement = getNewCanvas(id);
  TAB.savedInput[id] = TAB.defaultEmpty;

  // add new canvas element to cell
  cell.appendChild(canvasElement);
}

/**
* Pain the default look onto the canvas cell.
*/
function drawLine(canvas) {
  // paint black line
  canvas.fillStyle = "#000000";
  canvas.fillRect(0, 10, 20, 1);
}
