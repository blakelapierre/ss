ss.map = ss.map || angular.module('ss-directives-map', []);
ss.map
.directive('map', function() {
	return {
		restrict: 'A',
		controller: function() {
			console.log('map controller');
		},
		link: function(scope, element, attributes, controller) {
			console.log('map');

			map = new google.maps.Map(document.getElementById('map'), {
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				center: new google.maps.LatLng(0, 0),
				zoom: 15
			});

			google.maps.event.addDomListener(element, 'resize', function() {
				console.log('resize');
				var center = map.getCenter();
				google.maps.event.trigger(map, 'resize');
				map.setCenter(center);
			});
		}
	};
});