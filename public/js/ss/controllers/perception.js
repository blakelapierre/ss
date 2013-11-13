ss.SixthSense = ss.SixthSense || angular.module('SixthSense', ['ss-filters-priceLevel', 'ss-services-sensorResource', 'ss-services-geolocationResource', 'ss-directives-perceptionPanel']);
ss.SixthSense
.controller('PerceptionCtrl', ['$scope', '$timeout', 'sensorResource', 'geolocationResource', function($scope, $timeout, sensorResource, geolocationResource) {
	// These should come out of the controller I think. Probably need to create directive(s)
	$scope.mapWidth = window.innerWidth;
	$scope.tableHeight = window.innerHeight * 0.7;
	$scope.tableHeight = 300;

	$scope.interests = [{term: 'coffee'}];

	$scope.search = function() {
		if (!_.some($scope.interests, function(interest) { return interest.term == $scope.searchFor; })) {
			if ($scope.searchFor != undefined) $scope.interests.push({term: $scope.searchFor, radius: null});
			$scope.perception = sensorResource.perceive($scope.interests);
		}
	};

	geolocationResource.getLocation(function(location) {
		map = new google.maps.Map(document.getElementById('map'), {
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: new google.maps.LatLng(location.position.coords.latitude, location.position.coords.longitude),
			zoom: 15
		});

		new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng(location.position.coords.latitude, location.position.coords.longitude)
		});
	});

	var timer = false;
	$scope.$watch('searchFor', function() {
		if (timer) $timeout.cancel(timer);
		timer = $timeout(function() {
			$scope.search();
		}, 1000);
	});

	$scope.search();
}]);
