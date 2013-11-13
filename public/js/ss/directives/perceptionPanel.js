ss.perceptionPanel = ss.perceptionPanel || angular.module('ss-directives-perceptionPanel', []);
ss.perceptionPanel
.directive('perceptionPanel', function() {
	return {
		restrict: 'E',
		templateUrl: '/partials/perceptionPanel.html'
	};
});