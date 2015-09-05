/**
 * Functions specific to user input.
 */

TABAPP.input = {
    selectedMeasure: '',
    /**
     * Translate key codes from a number pad
     * to its actual number.
     */
    fromKeyCode: function(key) {
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

    clearTemp: function() {
        if (TABAPP.userInput.length > 0) {
            TABAPP.userInput = '';
            console.log('input', 'Cleared temp');
        }
    },

    /**
     * Write current user input to all selected cells.
     */
    writeAll: function(userInput) {
        for (var i = 0; i < TABAPP.input.selectedMeasure.selected.length; i++) {
            // Get only the matrix index. Disregard the element type.
            var index = TABAPP.input.selectedMeasure.selected[i].replace('cell_', '');

            TABAPP.canvas.writeToCanvas(index, userInput);
        }
    },

    /**
     * Unselect any selected cells.
     */
    unselectAll: function() {
        console.log('input', 'UNSELECT');
        console.log(TABAPP.input.selectedMeasure);
        for (var i = 0; i < TABAPP.input.selectedMeasure.selected.length; i++) {
            var cell = document.getElementById(TABAPP.input.selectedMeasure.selected[i]);
            // console.debug(TABAPP.selected[i]);
            cell.classList.remove('unselect', 'ui-selected');
        }
        TABAPP.input.selectedMeasure.selected = [];
        // console.debug('unselect', TABAPP.selected.length);
    },

    /**
     * Clear any selected cells.
     */
    clearAll: function() {
        console.log('input', 'ERASE');
        for (var i = 0; i < TABAPP.input.selectedMeasure.selected.length; i++) {
            // Get only the matrix index. Disregard the element type.
            var index = TABAPP.input.selectedMeasure.selected[i].replace('cell_', '');

            TABAPP.canvas.clearCanvas(index);
        }
    },

    /**
    Add event listener and verification for user input.
    */
    initUserInput: function() {
        document.addEventListener('keyup', function(event) {
            var key = event.keyCode;
            var char;

            TABAPP.input.selectedMeasure = TABAPP.ui.measure;
            // console.log(TABAPP.ui.measure);
            // console.log(this.selectedMeasure);

            // INPUT mode
            if (TABAPP.input.selectedMeasure.selected.length != 0) {
                var timeoutID = window.setTimeout(this.clearTemp, 1000);

                if (key >= 48 && key <= 57) {
                    char = String.fromCharCode(key);
                    TABAPP.userInput = TABAPP.userInput + char;
                    console.log('input', 'WRITE - keyCode: ' + key + '; charCode: ' + char + ' = ' + TABAPP.userInput);

                    if (parseInt(TABAPP.userInput) > TABAPP.input.selectedMeasure.maxFrets) {
                        console.log('input', 'Parse to int successful');
                        TABAPP.userInput = char;
                    }

                    this.writeAll(TABAPP.userInput);
                }

                // 96 - 105 (number pad)
                if (key >= 96 && key <= 105) {
                    char = TABAPP.input.fromKeyCode(key);
                    TABAPP.userInput = TABAPP.userInput + char;
                    console.log('input', 'WRITE - keyCode: ' + key + '; charCode: ' + char + ' = ' + TABAPP.userInput);

                    if (parseInt(TABAPP.userInput) > TABAPP.input.selectedMeasure.maxFrets) {
                        console.log('input', 'Parse to int successful');
                        TABAPP.userInput = char;
                    }

                    TABAPP.input.writeAll(TABAPP.userInput);
                }

                // 8 (backspace), 46 (delete)
                if (key === 8 || key === 46) {
                    TABAPP.input.clearAll();
                }

                // 27 (escape)
                if (key === 27) {
                    TABAPP.input.unselectAll();
                }

            }
        }, true);
    }
};
