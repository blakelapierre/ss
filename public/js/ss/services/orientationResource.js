ss.orientationResource = ss.orientationResource || angular.module('ss-services-orientationResource', []);
ss.orientationResource
.factory('orientationResource', ['$rootScope', function($rootScope) {
	return {
		listenToOrientation: function(rate, callback) {
			var lastOrientationTime = new Date().getTime();
			window.addEventListener('deviceorientation', function(event) {
				var time = new Date().getTime();
				if ((time - lastOrientationTime) > (1000 / (rate || 1))) {
					if (callback) callback(event);
					lastOrientationTime = time;
				}
			});
		}
	};
}]);