ss.priceLevel = ss.priceLevel || angular.module('ss-filters-priceLevel', []);
ss.priceLevel
.filter('priceLevel', function() {
	return function(input) {
		switch (input) {
			case 1:
				return '$';
			case 2:
				return '$$';
			case 3:
				return '$$$';
			case 4:
				return '$$$$';
		}
		return '';
	};
});