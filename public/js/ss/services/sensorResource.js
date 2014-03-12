ss.sensorsService = ss.sensorsService || angular.module('ss-services-sensorResource', ['ss-services-geolocationResource', 'ss-services-orientationResource']);
ss.sensorsService
.factory('sensorResource', ['$rootScope', '$http', 'geolocationResource', 'orientationResource', function($rootScope, $http, geolocationResource, orientationResource) {
	return {
		perceive: function(interests) {
			var perception = {
				location: null,
				orientation: {heading: $rootScope.perception != null ? $rootScope.perception.orientation.heading : 0},
				percepts: []
			};

			var searchForInterest = function(interest, location, callback) {
				var request = {
					location: map.center,
					// radius: interest.radius || 50000,
					name: interest.term,
					rankBy: google.maps.places.RankBy.DISTANCE
				};

				var searchCallback = function(results, status) {
					console.log(location, results);
					var percepts = [];
					for (var i = 0; i < results.length; i++) {
						var result = results[i],
							distance = globalDistanceInMiles(location.latitude, location.longitude, result.geometry.location.lat(), result.geometry.location.lng()),
							bearing = bearingTo(location.latitude, location.longitude, result.geometry.location.lat(), result.geometry.location.lng());
						
						percepts.push({
							name: result.name,
							vicinity: result.vicinity,
							rating: result.rating,
							priceLevel: result.price_level,
							distance: distance,
							bearing: bearing,
							direction: directionAbbreviation(bearing),
							rotation: bearing - perception.orientation.heading,
							icon: result.icon
						});

						//Should this be in a factory?
						new google.maps.Marker({
							position: new google.maps.LatLng(result.geometry.location.lat(), result.geometry.location.lng()),
							map: map,
							title: result.name,
							icon: new google.maps.MarkerImage(result.icon, null, null, null, new google.maps.Size(25, 25))
						});
					}
					
					percepts = _.sortBy(percepts, 'distance');
					if (callback) callback(percepts);
				};
				
				service = new google.maps.places.PlacesService(map);
				service.nearbySearch(request, searchCallback);
			};

			geolocationResource.getLocation(function(location) {
				perception.location = location.position;
				perception.percepts = [];
				for (var i = 0; i < interests.length; i++) {
					var interest = interests[i];
					searchForInterest(interest, location.position.coords, function(percepts) {
						perception.percepts = perception.percepts.concat(percepts);
						perception.percepts = _.sortBy(perception.percepts, 'distance');
						console.dir(perception);
						$rootScope.$apply();
					});
				};
			});


			// orientationResource.listenToOrientation(1, function(event) {
			// 	var oldHeading = perception.orientation.heading;
			// 	perception.orientation = event;
			// 	var heading = 360 - perception.orientation.alpha;
			// 	if (oldHeading != heading) {
			// 		if (perception.orientation.heading !== heading) {
			// 			console.log(perception);
			// 			perception.orientation.heading = heading;
			// 			perception.orientation.direction = directionAbbreviation(heading);
						
			// 			for (var i = 0; i < perception.percepts.length; i++) {
			// 				var percept = perception.percepts[i];
			// 				percept.rotation = percept.bearing - heading;
			// 			}

			// 			$rootScope.$apply();
			// 		}
			// 	}
			// });

			return perception;
		}
	};
}]);