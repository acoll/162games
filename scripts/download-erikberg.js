var request = require('request-promise');
var fs = require('fs');

request({
	uri: 'https://erikberg.com/mlb/teams.json',
	headers: {
		'User-Agent': 'Testing/1.0 (adamcoll.ac@gmail.com)'
	}
})
.then(result => fs.writeFileSync('teams.json', result));

request({
	uri: 'https://erikberg.com/mlb/standings.json',
	headers: {
		'User-Agent': 'Testing/1.0 (adamcoll.ac@gmail.com)'
	}
})
.then(result => fs.writeFileSync('standings.json', result));


