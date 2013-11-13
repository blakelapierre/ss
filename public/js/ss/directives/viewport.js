ss.viewport = ss.viewport || angular.module('ss-directives-viewport', []);
ss.viewport
.directive('viewport', function() {
	return function($scope, element, attributes) {
		var setToWindowSize = function() {
			var searchHeight = $(element).find('.search-container').height();
			element.css('overflow', 'hidden');
			element.css('width', $(window).width() + 'px');
			element.css('height', $(window).height() + 'px');

			var search = element.find('.search-container');
			var remainingHeight = $(window).height() - searchHeight;
			$scope.mapHeight = remainingHeight * 0.35;
			$scope.tableHeight = remainingHeight * 0.65;
			$scope.mapWidth = $(window).width();
			$scope.tableWidth = $(window).width();
		};

		angular.element(window).on('resize', function() {
			$scope.$apply(setToWindowSize);
		});

		setToWindowSize();
	}
});