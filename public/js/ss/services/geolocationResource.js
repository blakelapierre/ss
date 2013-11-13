ss.geolocationResource = ss.geolocationResource || angular.module('ss-services-geolocationResource', []);
ss.geolocationResource
.factory('geolocationResource', ['$rootScope', function($rootScope) {
	return {
		getLocation: function(callback) {
			var location = {};
			if (debug) {
				location.position = {
					coords: {
						latitude: lat,
						longitude: long
					}
				};
				if (callback) callback(location);
			}
			else if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					location.position = position;
					$rootScope.$apply();
					if (callback) callback(location);
				});
			}
			return location;
		}
	};
}]);