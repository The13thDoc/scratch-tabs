/**
* Functions specific to user input.
*/

/**
* Translate key codes from a number pad
* to its actual number.
*/
function fromKeyCode(key) {
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

function clearTemp() {
  if (TAB.userInput.length > 0) {
    TAB.userInput = '';
    console.log('input', 'Cleared temp');
  }
}

/**
* Write current user input to all selected cells.
*/
function writeAll(userInput) {
  for (var i = 0; i < TAB.selected.length; i++) {
    // Get only the matrix index. Disregard the element type.
    var index = TAB.selected[i].replace('cell_', '');

    writeToCanvas(index, userInput);
  }
}

/**
* Unselect any selected cells.
*/
function unselectAll() {
  console.log('input', 'UNSELECT');
  for (var i = 0; i < TAB.selected.length; i++) {
    var cell = document.getElementById(TAB.selected[i]);
    // console.debug(TAB.selected[i]);
    cell.classList.remove('unselect', 'ui-selected');
  }
  TAB.selected = [];
  // console.debug('unselect', TAB.selected.length);
}

/**
* Clear any selected cells.
*/
function clearAll() {
  console.log('input', 'ERASE');
  for (var i = 0; i < TAB.selected.length; i++) {
    // Get only the matrix index. Disregard the element type.
    var index = TAB.selected[i].replace('cell_', '');

    clearCanvas(index);
  }
}

/**
Add event listener and verification for user input.
*/
function initUserInput() {
  document.addEventListener('keyup', function (event) {
    var key = event.keyCode;
    var char;

    // INPUT mode
    if (TAB.selected.length != 0) {
      var timeoutID = window.setTimeout(clearTemp, 1000);

      if (key >= 48 && key <= 57) {
        char = String.fromCharCode(key);
        TAB.userInput = TAB.userInput + char;
        console.log('input', 'WRITE - keyCode: ' + key + '; charCode: ' + char + ' = ' + TAB.userInput);

        if (parseInt(TAB.userInput) > TAB.maxFrets) {
          console.log('input', 'Parse to int successful');
          TAB.userInput = char;
        }

        writeAll(TAB.userInput);
      }

      // 96 - 105 (number pad)
      if (key >= 96 && key <= 105) {
        char = fromKeyCode(key);
        TAB.userInput = TAB.userInput + char;
        console.log('input', 'WRITE - keyCode: ' + key + '; charCode: ' + char + ' = ' + TAB.userInput);

        if (parseInt(TAB.userInput) > TAB.maxFrets) {
          console.log('input', 'Parse to int successful');
          TAB.userInput = char;
        }

        writeAll(TAB.userInput);
      }

      // 8 (backspace), 46 (delete)
      if (key === 8 || key === 46) {
        clearAll();
      }

      // 27 (escape)
      if (key === 27) {
        unselectAll();
      }

    }
  }, true);
}
