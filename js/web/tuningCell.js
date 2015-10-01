/*
 * TuningCell object
 */

// Constructor.
var TuningCell = function TuningCell(note) {
    this.cellValue = note;
    this.listItem;
    this.canvasElement;

    return this.init();
};

// Initialize the UI.
TuningCell.prototype.init = function init() {
    // Create UI element and style.
    this.listItem = document.createElement('li');
    this.listItem.className = 'cell tuning-cell';
    this.canvasElement = new BlankCanvas();
    this.canvasElement.write(this.cellValue);
    this.listItem.appendChild(this.canvasElement);

    return this.listItem;
};
