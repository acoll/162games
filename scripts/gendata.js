var fs = require('fs');
var color = require('onecolor');
var csv = require('csv');
var teamsDict = require('../frontend/js/teams.json');

var parser = csv.parse();
var data = fs.readFileSync('./GL2015.TXT');

var teams = {};

csv.parse(data, (err, data) => {


	data.forEach(row => {

		var away = row[3];
		var home = row[6];
		var awayGameNum = row[5];
		var homeGameNum = row[8];

		var awayScore = row[9];
		var homeScore = row[10];

		if(!teams[away]) teams[away] = { games: [], wins: 0, homeruns: 0 };
		if(!teams[home]) teams[home] = { games: [], wins: 0, homeruns: 0 };

		teams[away].homeruns += parseInt(row[25]);
		teams[home].homeruns += parseInt(row[53]);


		if(awayScore > homeScore) {
			teams[away].wins++;
			teams[home].wins--;
		}
		else if(homeScore > awayScore) {
			teams[home].wins++;
			teams[away].wins--;
		}

		teams[away].games.push({
			game: awayGameNum,
			wins: teams[away].wins,
			perc: teams[away].wins / awayGameNum,
			homeruns: teams[away].homeruns
		});
		teams[home].games.push({
			game: homeGameNum,
			wins: teams[home].wins,
			perc: teams[home].wins / homeGameNum,
			homeruns: teams[home].homeruns
		});

	});


	console.log(JSON.stringify(teams, null, 2));

});