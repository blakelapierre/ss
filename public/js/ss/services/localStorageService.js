ss.localStorageService = ss.localStorageService || angular.module('ss-services-localStorageService', [])
ss.localStorageService
.factory('localStorageService', [function() {
	
	return {
		set: function(key, value) {
			if (typeof value === 'object') localStorage[key] = JSON.stringify(value);
			else localStorage[key] = value;
		},
		get: function(key) {
			var value = localStorage[key];
			try {
				value = JSON.parse(value);
				return value;
			}
			catch (e) {}
			return value;
		}
	};
}]);