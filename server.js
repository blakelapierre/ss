var express = require('express'),
	app = express(),
	port = 3001;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {


});

app.listen(port);

console.log('Listening on ' + port);