/**
* Functions and variables specific to the measures.
*/

/**
* Remove the last column (fret) from the tablature.
*/
function shrinkMeasure() {
  // console.debug('measure', 'Remove last column');
  // For all user input
  var inputList = document.getElementById('input-list' + '-' + visibleTab.toString());
  var last = totalCells[visibleTab];
  var decremented = last - 1;

  // Move DOWN the tablature
  for (var string = 1; string <= guitarStrings; string++) {
    var matrixID = last + 'x' + string + '-' + visibleTab.toString();
    var cellID = 'cell_' + matrixID;

    var item = document.getElementById(cellID);
    // console.debug('measure', item);
    delete savedInput[matrixID];
    inputList.removeChild(item);
  }

  // Now, increment the total number of cells by 1.
  totalCells[visibleTab] = decremented;

  updateWidth(totalCells[visibleTab], inputList);

  writeASCII();
}

/**
* Append another column (fret) of input to the tablature.
*/
function extendMeasure() {
  // For all user input
  var inputList = document.getElementById('input-list' + '-' + visibleTab.toString());
  var incremented = (totalCells[visibleTab] + 1);

  // Create the input columns
  // Move DOWN the tablature
  for (var string = 1; string <= guitarStrings; string++) {

    // Move ACROSS the tablature
    for (var cell = incremented; cell <= incremented; cell++) {
      var matrixID = cell + 'x' + string + '-' + visibleTab.toString();
      var cellID = 'cell_' + matrixID;

      var item = document.createElement('li');
      item.id = cellID;

      // Write the cells
      var canvasElement = getNewCanvas(matrixID);
      savedInput[matrixID] = defaultEmpty;

      // front
      item.className = 'input-cell ui-state-default';
      item.appendChild(canvasElement);

      var referenceString = string + 1; // String following current one.
      var referenceElement = document.getElementById('cell_1' + 'x' +
      referenceString + '-' + visibleTab.toString());

      if (string < 6) {
        inputList.insertBefore(item, referenceElement);
      } else {
        inputList.appendChild(item);
      }
    }
  }
  // Finished creating the tablature cells.

  // Now, increment the total number of cells by 1.
  totalCells[visibleTab] = incremented;

  updateWidth(totalCells[visibleTab], inputList);

  writeASCII();
}

/**
* Append a new measure to the current list.
*/
function addMeasure() {
  var tabsList = document.getElementById('measure-headers-list');

  var item = document.createElement('li');

  tabs = tabs + 1;
  totalCells[tabs] = startCells;

  item.id = 'measure-item-' + tabs.toString();
  tabsList.appendChild(item);
  item.addEventListener('click', function (event) {
    activateMeasure(div.id.replace('measure-div-',''));
  }, true);

  var div = document.createElement('div');
  div.id = 'measure-div-' + tabs.toString();
  div.title = 'Measure ' + tabs.toString();
  div.innerHTML = 'Measure ' + tabs.toString();

  item.appendChild(div);

  init(guitarStrings);

  activateMeasure(tabs);
}

/**
* Make the measure activate and visible.
*/
function activateMeasure(tabID) {
  var currentTab = visibleTab;
  visibleTab = tabID;

  var tabDiv = document.getElementById('tab-div-'+visibleTab.toString());
  var measureItemSelect = document.getElementById('measure-item-'+visibleTab.toString());

  if(currentTab !== 0){
    var measureItemUnselect = document.getElementById('measure-item-'+currentTab.toString());
    document.getElementById('tab-div-'+currentTab).setAttribute('style', 'display: none;');
    measureItemUnselect.setAttribute('style', 'background: #C9C9C9;');
  }
  tabDiv.setAttribute('style', 'display: inherit;');
  measureItemSelect.setAttribute('style', 'background: orange;');

  var available = document.getElementById('columns-available');
  available.innerHTML = totalCells[tabID];

  unselectAll();
}
