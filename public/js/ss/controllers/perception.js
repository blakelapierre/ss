ss.SixthSense = (ss.SixthSense || angular.module('SixthSense', [
	'ss-filters-priceLevel', 
	'ss-services-sensorResource', 
	'ss-services-geolocationResource', 
	'ss-services-orientationResource',
	'ss-services-localStorageService', 
	'ss-directives-perceptionPanel',
	'ss-directives-map']))

.controller('PerceptionCtrl', ['$scope', '$timeout', 'sensorResource', 'geolocationResource', 'orientationResource', 'localStorageService', function($scope, $timeout, sensorResource, geolocationResource, orientationResource, localStorageService) {
	// These should come out of the controller I think. Probably need to create directive(s)
	$scope.mapWidth = window.innerWidth;
	$scope.tableHeight = window.innerHeight * 0.7;
	$scope.tableHeight = 300;

	var config = localStorageService.get('config') || {};
	
	config.interests = config.interests || [];
	var interests = _.filter(config.interests, function(interest) { return ((interest || {}).term || '') != ''; });
	$scope.search = function() {
		if ($scope.searchFor != undefined) {
			var interest = _.find(interests, function(interest) { return ($scope.searchFor || '').startsWith(interest.term); });
			if (interest == undefined) {
				interest = {radius: null};
				interests.push(interest);
			}
			interest.term = $scope.searchFor;
			localStorageService.set('config', config);
		}
		$scope.perception = sensorResource.perceive(interests);
		console.dir(interests);
	};
	$scope.interests = interests;

	geolocationResource.getLocation(function(location) {
		console.dir(map);
		//map.setCenter(new google.maps.LatLng(location.position.coords.latitude, location.position.coords.longitude));	

		// new google.maps.Marker({
		// 	map: map,
		// 	position: new google.maps.LatLng(location.position.coords.latitude, location.position.coords.longitude),
		// 	icon: new google.maps.MarkerImage('/images/location.png', null, null, null, new google.maps.Size(25, 25))
		// });

		var locationMarker = new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng(location.position.coords.latitude, location.position.coords.longitude),
			icon: {path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW, rotation: 0}
		});

		orientationResource.listenToOrientation(1, function(event) {
			locationMarker.setIcon({
				path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW, 
				rotation: 360 - event.alpha,
				scale: 4,
				strokeColor: '#f00'
			});
		});
	});

	orientationResource.listenToOrientation(1, function(event) {
		var perception = $scope.perception;
		var oldHeading = perception.orientation.heading;
		perception.orientation = event;
		var heading = 360 - perception.orientation.alpha;
		if (oldHeading != heading) {
			if (perception.orientation.heading !== heading) {
				console.log(perception);
				perception.orientation.heading = heading;
				perception.orientation.direction = directionAbbreviation(heading);
				
				for (var i = 0; i < perception.percepts.length; i++) {
					var percept = perception.percepts[i];
					percept.orientation = event;
					percept.rotation = percept.bearing - heading;
				}

				$scope.$apply();
			}
		}
	});

	var timer = false;
	$scope.$watch('searchFor', function() {
		if (timer) $timeout.cancel(timer);
		timer = $timeout(function() {
			$scope.search();
		}, 1000);
	});

	$timeout(function() {
		$scope.fullscreenClass = true;
	}, 1500);

	//$scope.search();
}]);
