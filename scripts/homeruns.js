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

		if(!teams[away]) teams[away] = { games: [], wins: 0 };
		if(!teams[home]) teams[home] = { games: [], wins: 0 };

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
			perc: teams[away].wins / awayGameNum
		});
		teams[home].games.push({
			game: homeGameNum,
			wins: teams[home].wins,
			perc: teams[home].wins / homeGameNum
		});

	})


	var data = {
	    labels: Array.apply(null, {length: 162}).map(Number.call, Number).map(i => i),
	    datasets: Object.keys(teams).map(key => {
	    	var rgb = color(teamsDict[key].colors[0]);
	    	var highlightColor = rgb.cssa();
	    	var strokeColor = rgb.cssa();
	    	return {
	    		teamId: key,
		    	label: teamsDict[key] ? teamsDict[key].first_name + ' ' + teamsDict[key].last_name : 'UNKNOWN: ' + key,
		    	data: teams[key].games.map(e => e.wins),
		    	strokeColor: strokeColor,
		    	pointColor: highlightColor
		    };
	    })
	};


	console.log(JSON.stringify(data, null, 2));

});