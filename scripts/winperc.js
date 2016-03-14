var fs = require('fs');
var csv = require('csv');
var teamsDict = require('../frontend/js/teams.json');

var parser = csv.parse();
var data = fs.readFileSync('./GL2015.TXT');

var teams = {};

var data = {
    labels: Array.apply(null, {length: 162}).map(Number.call, Number).map(i => i+1),
    datasets: []
};

csv.parse(data, (err, data) => {


	data.forEach(row => {

		var away = row[3];
		var home = row[6];
		var awayGameNum = row[5];
		var homeGameNum = row[8];

		var awayScore = row[9];
		var homeScore = row[10];

		if(!teams[away]) teams[away] = { games: [], wins: 0 };
		if(!teams[home]) teams[home] = { games: [], wins: 0 };

		// console.log(away, ':', awayScore);
		// console.log(home, ':', homeScore);

		if(awayScore > homeScore) teams[away].wins++;
		else if(homeScore > awayScore) teams[home].wins++;

		teams[away].games.push({
			game: awayGameNum,
			wins: teams[away].wins,
			perc: teams[away].wins / awayGameNum
		});
		teams[home].games.push({
			game: homeGameNum,
			wins: teams[home].wins,
			perc: teams[home].wins / homeGameNum
		});

	})


	console.log(JSON.stringify(teams, null, 2));

});


// return {
// 		label: [teams[key].first_name, teams[key].last_name].join(' '),
// 		data: winPerc[key].games.map(e => e.perc),
// 		strokeColor: teams[key].colors[0],
// 		pointColor: teams[key].colors[0]
// 	};