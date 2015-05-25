/**
* Functions specific to the ASCII tab feature.
*/

/**
* Write saved JSON data to a text field.
*/
function writeASCII() {
  var asciiText = document.getElementById('ascii-text');
  asciiText.innerHTML = compileASCII();
}

/**
* Compile and return saved JSON data as a string.
*/
function compileASCII() {
  var ascii = '';
  var data = '';
  var cellID;
  var format = TAB.asciiformats['simpleformat1'];
  var rules = format['rules'];

  // Move through each measure
  for (var measure = 1; measure <= TAB.tabs; measure++) {

    // Move DOWN the tablature
    for (var string = 1; string <= TAB.guitarStrings; string++) {

      // Move ACROSS the tablature
      for (var cell = 0; cell <= TAB.totalCells[measure]; cell++) {

        cellID = cell + 'x' + string + '-' + measure;

        data = TAB.savedInput[cellID];
        data = data.replace(/[-]+/g, ''); // Remove all occurrences of '-'

        // Determine how many characters exist.
        // Get the appropriate rule.
        var variant;
        console.log(data);
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
            else if (cell > 1 && cell < TAB.totalCells[measure]) {
                ascii = ascii + variant['prenextbeat'] + data + variant['postnextbeat'];
            }
            // Last column
            else if (cell === TAB.totalCells[measure]) {
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
}
