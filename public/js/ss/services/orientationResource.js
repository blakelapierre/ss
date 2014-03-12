ss.orientationResource = ss.orientationResource || angular.module('ss-services-orientationResource', []);
ss.orientationResource
.factory('orientationResource', ['$rootScope', function($rootScope) {
	var listeners = [];
	var lastOrientationTime = new Date().getTime();
	window.addEventListener('deviceorientation', function(event) {
		var time = new Date().getTime();
		_.each(listeners, function(listener) {
			if ((time - listener.lastOrientationTime) > (1000 / (listener.rate || 1))) {
				listener.callback(event);
				listener.lastOrientationTime = time;
			}
		});
	});
	return {
		listenToOrientation: function(rate, callback) {
			listeners.push({rate: rate, callback: callback, lastOrientationTime: 0});
		}
	};
}]);