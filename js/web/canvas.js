/**
 * BlankCanvas.
 * LinedCanvas.
 * Creates and returns canvas elements.
 */

var BlankCanvas = function BlankCanvas() {
    this.canvasElement;
    // Returns a new, blank canvas element.
    this.init = function init(id) {
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.id = 'canvas_' + id;
        this.canvasElement.width = '20';
        this.canvasElement.height = '20';
    };
    this.init();

    return this.canvasElement;
};

// Write the specified text to the specified canvas.
BlankCanvas.prototype.write = function write(text) {
    var canvasContext = this.canvasElement.getContext("2d");
    var x = this.canvasElement.width / 2;
    var y = this.canvasElement.height / 2;

    // draw text
    canvasContext.font = '10pt Arial';
    canvasContext.textAlign = 'center';
    canvasContext.textBaseline = 'middle';
    canvasContext.strokeText(text, x, y);
};

// Create a new, default canvas (erase).
BlankCanvas.prototype.clear = function clear() {
    this.canvasElement = this.init();
};

// Constructor.
var LinedCanvas = function LinedCanvas() {
    BlankCanvas.call(this);
    this.canvasElement;
    this.init();
    this.drawLine();

    return this.canvasElement;
};

LinedCanvas.prototype = Object.create(BlankCanvas.prototype);

// Set the "constructor" property to refer to LinedCanvas
LinedCanvas.prototype.constructor = LinedCanvas;

// Paint the default (a black line) look onto the canvas.
LinedCanvas.prototype.drawLine = function drawLine() {
    var canvasContext = this.canvasElement.getContext("2d");
    // paint black line
    canvasContext.fillStyle = "#000000";
    canvasContext.fillRect(0, 10, 20, 1);
};
