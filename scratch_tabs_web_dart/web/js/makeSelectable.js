

// Apply the jQuery selectability to an element.
function makeSelectable(e) {
  $(e).selectable({
    stop: function () {
      if (!e.ctrlKey) {
        selected = [];
      }
      // var result = $("#select-result").empty();
      $(".ui-selected", this).each(function (index) {
        // only get the CELLS
        var id = $(this).attr('id');
        if (id.indexOf('cell') > -1) {
          // execute acton here
          selected.push(id);
        }
      });
      console.log(selected);
    }
  });
};
