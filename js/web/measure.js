/**
* Functions and variables specific to the measures.
*/

/**
* Remove the last column (fret) from the tablature.
*/
function shrinkMeasure() {
  // console.debug('measure', 'Remove last column');
  // For all user input
  var inputList = document.getElementById('input-list' + '-' + TAB.visibleTab.toString());
  var last = TAB.totalCells[TAB.visibleTab];
  var decremented = last - 1;

  // Move DOWN the tablature
  for (var string = 1; string <= TAB.guitarStrings; string++) {
    var matrixID = last + 'x' + string + '-' + TAB.visibleTab.toString();
    var cellID = 'cell_' + matrixID;

    var item = document.getElementById(cellID);
    // console.debug('measure', item);
    delete TAB.savedInput[matrixID];
    inputList.removeChild(item);
  }

  // Now, increment the total number of cells by 1.
  TAB.totalCells[TAB.visibleTab] = decremented;

  updateWidth(TAB.totalCells[TAB.visibleTab], inputList);

  writeASCII();
}

/**
* Append another column (fret) of input to the tablature.
*/
function extendMeasure() {
  // For all user input
  var inputList = document.getElementById('input-list' + '-' + TAB.visibleTab.toString());
  var incremented = (TAB.totalCells[TAB.visibleTab] + 1);

  // Create the input columns
  // Move DOWN the tablature
  for (var string = 1; string <= TAB.guitarStrings; string++) {

    // Move ACROSS the tablature
    for (var cell = incremented; cell <= incremented; cell++) {
      var matrixID = cell + 'x' + string + '-' + TAB.visibleTab.toString();
      var cellID = 'cell_' + matrixID;

      var item = document.createElement('li');
      item.id = cellID;

      // Write the cells
      var canvasElement = getNewCanvas(matrixID);
      TAB.savedInput[matrixID] = TAB.defaultEmpty;

      // front
      item.className = 'input-cell ui-state-default';
      item.appendChild(canvasElement);

      var referenceString = string + 1; // String following current one.
      var referenceElement = document.getElementById('cell_1' + 'x' +
      referenceString + '-' + TAB.visibleTab.toString());

      if (string < 6) {
        inputList.insertBefore(item, referenceElement);
      } else {
        inputList.appendChild(item);
      }
    }
  }
  // Finished creating the tablature cells.

  // Now, increment the total number of cells by 1.
  TAB.totalCells[TAB.visibleTab] = incremented;

  updateWidth(TAB.totalCells[TAB.visibleTab], inputList);

  writeASCII();
}

/**
* Append a new measure to the current list.
*/
function addMeasure() {
  var tabsList = document.getElementById('measure-headers-list');

  var item = document.createElement('li');

  TAB.tabs = TAB.tabs + 1;
  TAB.totalCells[TAB.tabs] = TAB.startCells;

  item.id = 'measure-item-' + TAB.tabs.toString();
  tabsList.appendChild(item);
  item.addEventListener('click', function (event) {
    activateMeasure(div.id.replace('measure-div-',''));
  }, true);

  var div = document.createElement('div');
  div.id = 'measure-div-' + TAB.tabs.toString();
  div.title = 'Measure ' + TAB.tabs.toString();
  div.classList.add('header-size');
  div.innerHTML = div.title;

  // var nameInput = document.createElement('input');
  // nameInput.id = 'measure-name-input-' + TAB.tabs.toString();
  // nameInput.value = 'Measure ' + TAB.tabs.toString();
  // nameInput.placeholder = 'Name your measure';
  // nameInput.setAttribute('disabled', 'true');
  // nameInput.classList.add('measure-headers-list-selected', true);


  // div.appendChild(nameInput);
  // nameInput.display = 'none';

  item.addEventListener('dblclick', function(event){
      console.log('Double Clicked');
    //   div.innerHTML = '';
    //   div.appendChild(nameInput);
    //   nameInput.removeAttribute('disabled');
    //   nameInput.setAttribute('display', 'inhereit');
    //   nameInput.classList.toggle('input-name', true);
    result = window.prompt('Name the measure', div.innerHTML);

    if(result !== null){
        div.innerHTML = result;
        div.title = div.innerHTML;
    }
  }, true);

  // div.addEventListener('focusout', function(event){
    //   console.log('Mouse left.');
    //   nameInput.setAttribute('disabled', 'true');
    // div.removeChild(nameInput);
    // div.innerHTML = nameInput.value;
    //   nameInput.display = 'none';
    //   nameInput.classList.toggle('input-name', false);
  // }, true);

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

    initUI(TAB.guitarStrings);

    activateMeasure(TAB.tabs);
}

/**
Create a context menu for EACH measure.
*/
function createContextMenu(div) {
    var nav = document.createElement('nav');
    nav.id = 'measure-context-menu-' + TAB.tabs.toString();
    nav.classList.add('context-menu');
    document.body.appendChild(nav);

    var ul = document.createElement('ul');
    ul.id = 'measure-context-menu-list-' + TAB.tabs.toString();
    ul.classList.add('measure-context-menu-items');
    nav.appendChild(ul);

    //Context menu event handlers
    var duplicateItem = document.createElement('li');
    duplicateItem.id = 'duplicate-' + TAB.tabs.toString();
    duplicateItem.innerHTML = 'Duplicate';
    duplicateItem.classList.add('measure-context-menu-item');
    ul.appendChild(duplicateItem);
    duplicateItem.addEventListener('click', function(event){
        console.log('Duplicate Clicked in tab #' + div.id);
    }, true);

    var renameItem = document.createElement('li');
    renameItem.id = 'rename-' + TAB.tabs.toString();
    renameItem.innerHTML = 'Rename';
    renameItem.classList.add('measure-context-menu-item');
    ul.appendChild(renameItem);
    renameItem.addEventListener('click', function(event){
        console.log('Rename Clicked in tab #' + div.id);

        result = window.prompt('Name the measure', div.innerHTML);

        if(result !== null){
          div.innerHTML = result;
          div.title = div.innerHTML;
        }
    }, true);

    var hr = document.createElement('hr');
    hr.classList.add('measure-context-menu-hr');
    ul.appendChild(hr);

    var deleteItem = document.createElement('li');
    deleteItem.id = 'delete-' + TAB.tabs.toString();
    deleteItem.innerHTML = 'Delete';
    deleteItem.classList.add('measure-context-menu-item');
    deleteItem.classList.add('item-delete');
    ul.appendChild(deleteItem);
    deleteItem.addEventListener('click', function(event){
        console.log('Delete Clicked in tab #' + div.id);
    }, true);

    return nav;
}

/**
* Make the measure activate and visible.
*/
function activateMeasure(tabID) {
  var currentTab = TAB.visibleTab;
  TAB.visibleTab = tabID;

  var tabDiv = document.getElementById('tab-div-'+TAB.visibleTab.toString());
  var measureItemSelect = document.getElementById('measure-item-'+TAB.visibleTab.toString());
  var previousMeasureNameInput = document.getElementById('measure-name-input-' + currentTab.toString());
  var nextMeasureNameInput = document.getElementById('measure-name-input-' + TAB.visibleTab.toString());

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
  available.innerHTML = TAB.totalCells[tabID];

  unselectAll();
}
