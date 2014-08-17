// On Load
var guitarStrings = 6;
var selected = [];
init(guitarStrings);

// Initialize the UI
function init(guitarStrings) {
    // Let's create lists here.
    // Replicate a spreadhsheet look

    var totalCells = 20; // number of columns, or 'frets'

    var tabDiv = document.createElement('div');
    tabDiv.id = 'tab-div';

    var tabList = document.createElement('div');
    tabList.id = 'tab-list';
    tabDiv.appendChild(tabList);

    // For all user input
    var inputList = document.createElement('ul');
    inputList.id = 'input-list';
    inputList.className = 'columns';
    makeSelectable(inputList);

    tabList.appendChild(inputList);

    // Move ACROSS the tablature
    for (var cell = 0; cell <= totalCells; cell++) {

        var cellColumnID = 'column_' + cell;
        var column = document.createElement('ul');
        column.id = cellColumnID;
        column.className = 'float-left';

        // Move DOWN the tablature
        for (var string = 1; string <= guitarStrings; string++) {

            var cellID = 'cell_' + cell + 'x' + string;

            var item = document.createElement('li');
            item.id = cellID;

            if (cell === 0) { // Write the tuning

                item.innerHTML = 'X';
                item.className = 'cell tuning-cell';

            } else { // Write the cells

                var canvasID = 'canvas_' + string + '-' + cell;
                var canvas = document.createElement('canvas');
                canvas.id = canvasID;
                canvas.width = '20';
                canvas.height = '20';

                var line = canvas.getContext("2d");
                line.fillStyle = "#000000";
                line.fillRect(0, 10, 20, 1);
                line.font = '12px Arial';

                // front
                item.className = 'cell input-cell ui-state-default';
                item.appendChild(canvas);
            }
            column.appendChild(item);


            if (cell !== 0) {
                inputList.appendChild(item);
            }
        }
        if (cell === 0) {
            tabList.insertBefore(column, inputList);
        }
    }
    var width = 20 * (totalCells + 1) + 2;

    var content = document.getElementById('measure-content');
    //tabDiv.setAttribute('style', 'width:' + width + 'px;');
    content.appendChild(tabDiv);
}
