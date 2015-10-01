/*
 * GuitarString object.
 */

// Constructor.
var GuitarString = function GuitarString(fretCount, totalCells, tuning, inputList) {
    this.fretCount = fretCount; // number of playable frets
    this.totalCells = totalCells; // number of musical columns
    this.savedInput[]; // All columns of musical data, including tuning as [0]
    this.tuning = tuning;

    this.init(inputList);
};

// Initialize the arrays and members.
GuitarString.prototype.init = function init(inputList) {
    this.savedInput[0] = new TuningCell(this.tuning);

    for (var cell = 1; cell <= this.totalCells; cell++) {
        this.savedInput[cell] = new Cell();
        inputList.appendChild(this.savedInput[cell]); // Add <li> to measure UI
    }
};

GuitarString.prototype.getSavedInput = function getSavedInput() {
    return this.savedInput;
};
