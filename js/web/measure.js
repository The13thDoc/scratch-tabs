/**
* Functions and variables specific to the measures.
*/
var Measure = function() {
    console.log('Created a Measure object.');
};
/**
* Remove the last column (fret) from the tablature.
*/
Measure.prototype.shrinkMeasure = function () {
    // console.debug('measure', 'Remove last column');
    // For all user input
    var inputList = document.getElementById('input-list' + '-' + TABAPP.visibleTab.toString());
    var last = TABAPP.totalCells[TABAPP.visibleTab];
    var decremented = last - 1;

    // Move DOWN the tablature
    for (var string = 1; string <= TABAPP.guitarStrings; string++) {
    var matrixID = last + 'x' + string + '-' + TABAPP.visibleTab.toString();
    var cellID = 'cell_' + matrixID;

    var item = document.getElementById(cellID);
    // console.debug('measure', item);
    delete TABAPP.savedInput[matrixID];
    inputList.removeChild(item);
    }

    // Now, increment the total number of cells by 1.
    TABAPP.totalCells[TABAPP.visibleTab] = decremented;

    updateWidth(TABAPP.totalCells[TABAPP.visibleTab], inputList);

    writeASCII();
};

/**
* Append another column (fret) of input to the tablature.
*/
Measure.prototype.extendMeasure = function () {
    // For all user input
    var inputList = document.getElementById('input-list' + '-' + TABAPP.visibleTab.toString());
    var incremented = (TABAPP.totalCells[TABAPP.visibleTab] + 1);

    // Create the input columns
    // Move DOWN the tablature
    for (var string = 1; string <= TABAPP.guitarStrings; string++) {

    // Move ACROSS the tablature
    for (var cell = incremented; cell <= incremented; cell++) {
      var matrixID = cell + 'x' + string + '-' + TABAPP.visibleTab.toString();
      var cellID = 'cell_' + matrixID;

      var item = document.createElement('li');
      item.id = cellID;

      // Write the cells
      var canvasElement = getNewCanvas(matrixID);
      TABAPP.savedInput[matrixID] = TABAPP.defaultEmpty;

      // front
      item.className = 'input-cell ui-state-default';
      item.appendChild(canvasElement);

      var referenceString = string + 1; // String following current one.
      var referenceElement = document.getElementById('cell_1' + 'x' +
      referenceString + '-' + TABAPP.visibleTab.toString());

      if (string < 6) {
        inputList.insertBefore(item, referenceElement);
      } else {
        inputList.appendChild(item);
      }
    }
    }
    // Finished creating the tablature cells.

    // Now, increment the total number of cells by 1.
    TABAPP.totalCells[TABAPP.visibleTab] = incremented;

    updateWidth(TABAPP.totalCells[TABAPP.visibleTab], inputList);

    writeASCII();
};

/**
* Append a new measure to the current list.
*/
Measure.prototype.addMeasure = function (duplicateID) {
    var tabsList = document.getElementById('measure-headers-list');

    var item = document.createElement('li');

    TABAPP.tabs = TABAPP.tabs + 1;
    TABAPP.totalCells[TABAPP.tabs] = TABAPP.startCells;

    item.id = 'measure-item-' + TABAPP.tabs.toString();
    tabsList.appendChild(item);
    item.addEventListener('click', function (event) {
        activateMeasure(div.id.replace('measure-div-',''));
    }, true);

    var div = document.createElement('div');
    div.id = 'measure-div-' + TABAPP.tabs.toString();
    div.title = 'Measure ' + TABAPP.tabs.toString();
    div.classList.add('header-size');
    div.innerHTML = div.title;

    var nav = createContextMenu(div);

    item.addEventListener('contextmenu', function (event){
        console.log('Context menu enabled');
        // Prevent normal context menu
        event.preventDefault();
        nav.style.top = event.pageY + "px";
        nav.style.left = event.pageX + "px";
        nav.style.display = 'inherit';
    }, true);

    window.addEventListener('click', function(event){
      console.log('Context menu disabled');
      var menu = document.getElementById(nav.id);
      menu.style.display = 'none';
    }, true);

    item.appendChild(div);

    initUI(TABAPP.guitarStrings, duplicateID);

    activateMeasure(TABAPP.tabs);
};

/**
Create a context menu for EACH measure.
*/
Measure.prototype.createContextMenu = function (div) {
    var nav = document.createElement('nav');
    nav.id = 'measure-context-menu-' + TABAPP.tabs.toString();
    nav.classList.add('context-menu');
    document.body.appendChild(nav);

    var ul = document.createElement('ul');
    ul.id = 'measure-context-menu-list-' + TABAPP.tabs.toString();
    ul.classList.add('measure-context-menu-items');
    nav.appendChild(ul);

    var tabID = div.id.toString().substring(div.id.toString().length - 1, div.id.toString().length);

    //Context menu event handlers
    var duplicateItem = document.createElement('li');
    duplicateItem.id = 'duplicate-' + TABAPP.tabs.toString();
    duplicateItem.innerHTML = 'Duplicate';
    duplicateItem.classList.add('measure-context-menu-item');
    ul.appendChild(duplicateItem);
    duplicateItem.addEventListener('click', function(event){
        console.log('Rename Clicked in tab #' + tabID);

        addMeasure(tabID);
    }, true);

    var renameItem = document.createElement('li');
    renameItem.id = 'rename-' + TABAPP.tabs.toString();
    renameItem.innerHTML = 'Rename';
    renameItem.classList.add('measure-context-menu-item');
    ul.appendChild(renameItem);
    renameItem.addEventListener('click', function(event){
        console.log('Rename Clicked in tab #' + tabID);

        result = window.prompt('Name the measure', div.innerHTML);

        if(result !== null){
          div.innerHTML = result;
          div.title = div.innerHTML;
        }
    }, true);

    var hr = document.createElement('hr');
    hr.classList.add('measure-context-menu-hr');
    // Do not include horizontal rule until Delete is ready
    // ul.appendChild(hr);

    var deleteItem = document.createElement('li');
    deleteItem.id = 'delete-' + TABAPP.tabs.toString();
    deleteItem.innerHTML = 'Delete';
    deleteItem.classList.add('measure-context-menu-item');
    deleteItem.classList.add('item-delete');
    // ul.appendChild(deleteItem); // Do not include in context menu
    deleteItem.addEventListener('click', function(event){
        console.log('Delete Clicked in tab #' + tabID);

        var measureToDelete = document.getElementById('measure-item-' + tabID);
        var headerList = document.getElementById('measure-headers-list');

        var activate = 1;
        var intID = parseInt(tabID, 10);
        if(intID === TABAPP.tabs) {
            activate = intID - 1;
        } else {
            activate = intID + 1;
        }

        console.log('Removing: '+intID);
        console.log('Activating: '+activate);
        activateMeasure(activate);
        headerList.removeChild(measureToDelete);
    }, true);

    return nav;
};

/**
* Make the measure activate and visible.
*/
Measure.prototype.activateMeasure = function (tabID) {
    var currentTab = TABAPP.visibleTab;
    TABAPP.visibleTab = tabID;

    var tabDiv = document.getElementById('tab-div-'+TABAPP.visibleTab.toString());
    console.log('tab-div-'+TABAPP.visibleTab.toString());
    var measureItemSelect = document.getElementById('measure-item-'+TABAPP.visibleTab.toString());
    var previousMeasureNameInput = document.getElementById('measure-name-input-' + currentTab.toString());
    var nextMeasureNameInput = document.getElementById('measure-name-input-' + TABAPP.visibleTab.toString());

    if(currentTab !== 0){
    var measureItemUnselect = document.getElementById('measure-item-'+currentTab.toString());
    document.getElementById('tab-div-'+currentTab).setAttribute('style', 'display: none;');

    measureItemUnselect.classList.toggle('measure-headers-list-selected', false);
    measureItemUnselect.classList.toggle('measure-headers-list-unselected', true);

    // previousMeasureNameInput.classList.toggle('measure-headers-list-unselected', true);
    // previousMeasureNameInput.classList.toggle('measure-headers-list-selected', false);
    }

    tabDiv.setAttribute('style', 'display: inherit;');

    measureItemSelect.classList.toggle('measure-headers-list-selected', true);
    measureItemSelect.classList.toggle('measure-headers-list-unselected', false);

    // nextMeasureNameInput.classList.toggle('measure-headers-list-unselected', false);
    // nextMeasureNameInput.classList.toggle('measure-headers-list-selected', true);

    var available = document.getElementById('columns-available');
    available.innerHTML = TABAPP.totalCells[tabID];

    unselectAll();
};
