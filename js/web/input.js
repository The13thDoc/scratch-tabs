/**
* Functions specific to user input.
*/

TABAPP.input = {
    /**
    * Translate key codes from a number pad
    * to its actual number.
    */
    fromKeyCode: function (key) {
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
    },

    clearTemp: function () {
        if (TABAPP.userInput.length > 0) {
            TABAPP.userInput = '';
            console.log('input', 'Cleared temp');
        }
    },

    /**
    * Write current user input to all selected cells.
    */
    writeAll: function (userInput) {
        for (var i = 0; i < TABAPP.selected.length; i++) {
        // Get only the matrix index. Disregard the element type.
        var index = TABAPP.selected[i].replace('cell_', '');

        writeToCanvas(index, userInput);
        }
    },

    /**
    * Unselect any selected cells.
    */
    unselectAll: function () {
        console.log('input', 'UNSELECT');
        for (var i = 0; i < TABAPP.selected.length; i++) {
        var cell = document.getElementById(TABAPP.selected[i]);
        // console.debug(TABAPP.selected[i]);
        cell.classList.remove('unselect', 'ui-selected');
        }
        TABAPP.selected = [];
        // console.debug('unselect', TABAPP.selected.length);
    }

    /**
    * Clear any selected cells.
    */
    clearAll: function () {
        console.log('input', 'ERASE');
        for (var i = 0; i < TABAPP.selected.length; i++) {
        // Get only the matrix index. Disregard the element type.
        var index = TABAPP.selected[i].replace('cell_', '');

        clearCanvas(index);
        }
    },

    /**
    Add event listener and verification for user input.
    */
    initUserInput: function () {
        document.addEventListener('keyup', function (event) {
            var key = event.keyCode;
            var char;

            // INPUT mode
            if (TABAPP.selected.length != 0) {
              var timeoutID = window.setTimeout(clearTemp, 1000);

              if (key >= 48 && key <= 57) {
                char = String.fromCharCode(key);
                TABAPP.userInput = TABAPP.userInput + char;
                console.log('input', 'WRITE - keyCode: ' + key + '; charCode: ' + char + ' = ' + TABAPP.userInput);

                if (parseInt(TABAPP.userInput) > TABAPP.maxFrets) {
                  console.log('input', 'Parse to int successful');
                  TABAPP.userInput = char;
                }

                writeAll(TABAPP.userInput);
              }

              // 96 - 105 (number pad)
              if (key >= 96 && key <= 105) {
                char = fromKeyCode(key);
                TABAPP.userInput = TABAPP.userInput + char;
                console.log('input', 'WRITE - keyCode: ' + key + '; charCode: ' + char + ' = ' + TABAPP.userInput);

                if (parseInt(TABAPP.userInput) > TABAPP.maxFrets) {
                  console.log('input', 'Parse to int successful');
                  TABAPP.userInput = char;
                }

                writeAll(TABAPP.userInput);
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
}
