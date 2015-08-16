/**
* Functions specific to canvas.
*/

TABAPP.canvas = {
    /**
    * Returns a new canvas element with the default drawing.
    */
    getNewCanvas: function (id) {
      var canvasElement = getNewBlankCanvas(id);
      var canvas = canvasElement.getContext("2d");
      // canvas.fillStyle = "#708090";
      // canvas.fillRect(0, 0, 20, 20);
      drawLine(canvas);

      return canvasElement;
    },

    /**
    * Returns a new canvas element with the default drawing.
    */
    getNewBlankCanvas: function (id) {
      var canvasElement = document.createElement('canvas');
      canvasElement.id = 'canvas_' + id;
      canvasElement.width = '20';
      canvasElement.height = '20';

      return canvasElement;
    },

    /**
    * Draw user input to canvas cell in the tablature,
    * with the black line on the canvas.
    */
    writeToCanvas: function (id, text) {
      write(id, text, getNewCanvas(id));
    },

    /**
    * Draw to a blank canvas.
    */
    writeToBlankCanvas: function (id, text) {
      write(id, text, getNewBlankCanvas(id));
    },

    /**
    * Write the specified text to the specified canvas.
    */
    write: function (id, text, canvasElement) {
      var cell = document.getElementById('cell_' + id);

      var canvasContext = canvasElement.getContext("2d");
      var x = canvasElement.width / 2;
      var y = canvasElement.height / 2;

      // draw text
      canvasContext.font = '10pt Arial';
      canvasContext.textAlign = 'center';
      canvasContext.textBaseline = 'middle';
      canvasContext.strokeText(text, x, y);

      TABAPP.savedInput[id] = text;

      // remove current canvas
      cell.removeChild(cell.lastChild);
      // add new canvas
      cell.appendChild(canvasElement);

      if(TABAPP.isInitializing === 'false') {
        writeASCII();
      }
    },

    /**
    * Create a new, default canvas (erase).
    */
    clearCanvas: function (id) {
      var cell = document.getElementById('cell_' + id);
      cell.removeChild(cell.lastChild);

      var canvasElement = getNewCanvas(id);
      TABAPP.savedInput[id] = TABAPP.defaultEmpty;

      // add new canvas element to cell
      cell.appendChild(canvasElement);

        if(TABAPP.isInitializing === 'false') {
          writeASCII();
        }
    },

    /**
    * Pain the default look onto the canvas cell.
    */
    drawLine: function (canvas) {
      // paint black line
      canvas.fillStyle = "#000000";
      canvas.fillRect(0, 10, 20, 1);
  }
}
