if (typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function (str){
		return this.lastIndexOf(str, 0) == 0;
	};
}

function globalDistance(lat1, lon1, lat2, lon2, earthRadius) {
	lat1 = toRad(lat1);
	lat2 = toRad(lat2);
	lon1 = toRad(lon1);
	lon2 = toRad(lon2);
	return Math.acos(Math.sin(lat1)*Math.sin(lat2) + 
		Math.cos(lat1)*Math.cos(lat2) *
		Math.cos(lon2-lon1)) * earthRadius;
}

function globalDistanceInMiles(lat1, lon1, lat2, lon2) {
	return globalDistance(lat1, lon1, lat2, lon2, 3959);
}

function globalDistanceInKilometers(lat1, lon1, lat2, lon2) {
	return globalDistance(lat1, lon1, lat2, lon2, 6371);
}

function toRad(degrees) {
	return degrees * Math.PI / 180;
}

function toDegrees(radians) {
	return radians * 180 / Math.PI;
}

function directionAbbreviation(degrees) {
	var directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	return directions[Math.round(degrees / (360 / directions.length)) % directions.length];
}

function bearingTo(lat1, lon1, lat2, lon2) {
	lat1 = toRad(lat1);
	lat2 = toRad(lat2);
	lon1 = toRad(lon1);
	lon2 = toRad(lon2);
	var dLon = lon2 - lon1;

	var y = Math.sin(dLon) * Math.cos(lat2);
	var x = Math.cos(lat1)*Math.sin(lat2) -
	Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
	var bearing = Math.atan2(y, x);

	return (toDegrees(bearing) + 360) % 360;
}