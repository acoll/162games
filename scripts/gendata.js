var fs = require('fs');
var color = require('onecolor');
var csv = require('csv');
var teamsDict = require('../frontend/js/teams.json');

var parser = csv.parse();
var data = fs.readFileSync('./GL2015.TXT');

var teams = {};

var Team = function () {
	this.games = [];
	this.wins = 0;
	this.homeruns = 0;
	this.totalWins = 0;
	this.runs = 0;
	this.runsPm = 0;
	this.stolenBases = 0;
	this.hits = 0;
	this.atBats = 0;
}

csv.parse(data, (err, data) => {


	data.forEach(row => {

		var away = row[3];
		var home = row[6];
		var awayGameNum = row[5];
		var homeGameNum = row[8];

		if(!teams[away]) teams[away] = new Team();
		if(!teams[home]) teams[home] = new Team();

		var awayScore = parseInt(row[9]);
		var homeScore = parseInt(row[10]);

		teams[away].homeruns += parseInt(row[25]);
		teams[home].homeruns += parseInt(row[53]);

		teams[home].runs += homeScore;
		teams[away].runs += awayScore;

		teams[home].runsPm += (homeScore - awayScore);
		teams[away].runsPm += (awayScore - homeScore);

		teams[away].stolenBases += parseInt(row[33]);
		teams[home].stolenBases += parseInt(row[61]);

		teams[away].hits += parseInt(row[22]);
		teams[away].atBats += parseInt(row[21]);


		if(awayScore > homeScore) {
			teams[away].totalWins++;
			teams[away].wins++;
			teams[home].wins--;
		}
		if(homeScore > awayScore) {
			teams[home].totalWins++;
			teams[home].wins++;
			teams[away].wins--;
		}

		teams[away].games.push({
			game: awayGameNum,
			wins: teams[away].wins,
			perc: teams[away].wins / awayGameNum,
			homeruns: teams[away].homeruns,
			runs: teams[away].runs,
			runsPm: teams[away].runsPm,
			stolenBases: teams[away].stolenBases,
			averages: teams[away].hits / teams[away].atBats
		});
		teams[home].games.push({
			game: homeGameNum,
			wins: teams[home].wins,
			perc: teams[home].wins / homeGameNum,
			homeruns: teams[home].homeruns,
			runs: teams[home].runs,
			runsPm: teams[home].runsPm,
			stolenBases: teams[home].stolenBases,
			averages: teams[home].hits / teams[home].atBats
		});

	});


	console.log(JSON.stringify(teams, null, 2));

});