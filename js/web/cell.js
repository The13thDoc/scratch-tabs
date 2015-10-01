/*
 * Cell object
 */

// Constructor.
var Cell = function Cell() {
    this.defaultEmpty = TABAPP.asciiformats['monospace-3']['rules']['defaultEmpty'];
    this.cellValue = defaultEmpty;
    this.listItem;
    this.canvasElement;

    return this.init();
};

// Initialize the UI.
Cell.prototype.init = function init() {
    // Create UI element and style.
    this.listItem = document.createElement('li');
    this.listItem.className = 'input-cell ui-state-default';
    this.canvasElement = new Canvas();
    this.listItem.appendChild(this.canvasElement);

    return this.listItem;
};
