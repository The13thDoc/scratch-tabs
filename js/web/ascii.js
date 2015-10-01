/**
 * Ascii.
 * Reads data from all measures and writes their text (ASCII) representation
 * to a textarea.
 */

var Ascii = function Ascii() {

};
// Write saved JSON data to a text field.
Ascii.prototype.writeASCII: function writeASCII() {
    var asciiText = document.getElementById('ascii-text');
    asciiText.innerHTML = compileASCII();
};

// Compile and return saved JSON data from each measure
// as a string.
Ascii.prototype.compileASCII: function compileASCII() {
    var ascii = '';
    var data = '';
    var cellID;
    var format = TABAPP.asciiformats['monospace-3'];
    var rules = format['rules'];

    // Move through each measure
    for (var measure = 1; measure <= TABAPP.measures.length; measure++) {
        var currentMeasure = TABAPP.measures[measure];

        // Move DOWN the tablature
        for (var string = 1; string <= currentMeasure.stringCount; string++) {

            // Move ACROSS the tablature
            for (var cell = 0; cell <= currentMeasure.totalCells; cell++) {

                cellID = cell + 'x' + string + '-' + measure;

                data = measure.savedInput[cellID];
                data = data.replace(/[-]+/g, ''); // Remove all occurrences of '-'

                // Determine how many characters exist.
                // Get the appropriate rule.
                var variant;
                // console.log(data);
                if (data.length === 1) {
                    variant = rules['singlecharacter'];
                }
                if (data.length === 2) {
                    variant = rules['doublecharacter'];
                }

                // Tuning column.
                if (cell === 0) {
                    ascii = ascii + variant['pretuning'] + data + variant['posttuning'];
                }
                // Empty cell. Fill with default, "empty" character rule
                if (data.length === 0) {
                    ascii = ascii + rules['defaultEmpty'];
                } else {
                    // First column
                    if (cell === 1) {
                        ascii = ascii + variant['prefirstbeat'] + data + variant['postfirstbeat'];
                    }
                    // Any columns after the first and before the last
                    else if (cell > 1 && cell < currentMeasure.totalCells) {
                        ascii = ascii + variant['prenextbeat'] + data + variant['postnextbeat'];
                    }
                    // Last column
                    else if (cell === currentMeasure.totalCells) {
                        ascii = ascii + variant['prelastbeat'] + data + variant['postlastbeat'];
                    }
                }
            }
            ascii = ascii + '\n'; // new line for next string
        }
        ascii = ascii + '\n\n'; // two new lines for next measure
    }
    // console.debug('ascii\n', ascii);
    return ascii;
};
