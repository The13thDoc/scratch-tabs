
// <measure></measure>
TABAPP.appModule.directive('measure', function() {
    return {
        restrict: 'E',
        templateUrl: 'measure.html',
        controller: function() {
            this.tab = 1;

            this.selectTab = function(setTab) {
                this.tab = setTab;
            };

            this.isSelected = function(checkTab) {
                return this.tab === checkTab;
            };
        },
        controllerAs: 'measures'
    };
});
