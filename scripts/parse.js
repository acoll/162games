var fs = require('fs');
var color = require('onecolor');
var csv = require('csv');
var teamsDict = require('../frontend/js/teams.json');

var parser = csv.parse();
var data = fs.readFileSync('./GL2015.TXT');

var mapping = {
	1: 'Date',
	2: 'Number Of Game Type',
	3: 'Day Of Week',
	4: 'away.Team',
	5: 'away.League',
	6: 'away.Game Number',
	7: 'home.Team',
	8: 'home.League',
	9: 'home.Game Number',
	10: 'away.Score',
	11: 'home.Score',
	12: 'Outs',
	13: 'Day or Night',
	14: 'Completion Information',
	17: 'Park ID',
	18: 'Attendance',
	19: 'Time of Game in Minutes',
	20: 'away.Line Scores',
	21: 'home.Line Scores',
	22: 'away.Offensive Stats.At Bats',
	23: 'away.Offensive Stats.Hits',
	24: 'away.Offensive Stats.Doubles',
	25: 'away.Offensive Stats.Triples',
	26: 'away.Offensive Stats.Home Runs',
	27: 'away.Offensive Stats.RBIs',
	28: 'away.Offensive Stats.Sacrifice Hits',
	29: 'away.Offensive Stats.Sacrifice Flies',
	30: 'away.Offensive Stats.Hit By Pitch',
	31: 'away.Offensive Stats.Walks',
	32: 'away.Offensive Stats.Intentional Walks',
	33: 'away.Offensive Stats.Strikeouts',
	34: 'away.Offensive Stats.Stolen Bases',
	35: 'away.Offensive Stats.Caught Stealing',
	36: 'away.Offensive Stats.Grounded Into Doubles',
	37: 'away.Offensive Stats.Awarded First on Catcher Interference',
	38: 'away.Offensive Stats.Left On Base',
	39: 'away.Pitching Stats.Pitchers Used',
	40: 'away.Pitching Stats.Individual Earned Runs',
	41: 'away.Pitching Stats.Team Earned Runs',
	42: 'away.Pitching Stats.Wild Pitches',
	43: 'away.Pitching Stats.Balks',
	44: 'away.Defensive Stats.Putouts',
	45: 'away.Defensive Stats.Assists',
	46: 'away.Defensive Stats.Errors',
	47: 'away.Defensive Stats.Passed Balls',
	48: 'away.Defensive Stats.Double Plays',
	49: 'away.Defensive Stats.Triple Plays',
	50: 'home.Offensive Stats.At Bats',
	51: 'home.Offensive Stats.Hits',
	52: 'home.Offensive Stats.Doubles',
	53: 'home.Offensive Stats.Triples',
	54: 'home.Offensive Stats.Home Runs',
	55: 'home.Offensive Stats.RBIs',
	56: 'home.Offensive Stats.Sacrifice Hits',
	57: 'home.Offensive Stats.Sacrifice Flies',
	58: 'home.Offensive Stats.Hit By Pitch',
	59: 'home.Offensive Stats.Walks',
	60: 'home.Offensive Stats.Intentional Walks',
	61: 'home.Offensive Stats.Strikeouts',
	62: 'home.Offensive Stats.Stolen Bases',
	63: 'home.Offensive Stats.Caught Stealing',
	64: 'home.Offensive Stats.Grounded Into Doubles',
	65: 'home.Offensive Stats.Awarded First on Catcher Interference',
	66: 'home.Offensive Stats.Left On Base',
	67: 'home.Pitching Stats.Pitchers Used',
	68: 'home.Pitching Stats.Individual Earned Runs',
	69: 'home.Pitching Stats.Team Earned Runs',
	70: 'home.Pitching Stats.Wild Pitches',
	71: 'home.Pitching Stats.Balks',
	72: 'home.Defensive Stats.Putouts',
	73: 'home.Defensive Stats.Assists',
	74: 'home.Defensive Stats.Errors',
	75: 'home.Defensive Stats.Passed Balls',
	76: 'home.Defensive Stats.Double Plays',
	77: 'home.Defensive Stats.Triple Plays'
};

var games = [];

csv.parse(data, (err, data) => {
	data.forEach(row => {

		var game = {};

		Object.keys(mapping).forEach(i => {

			var keys = mapping[i].split('.');
			var val = parseInt(row[i-1]);

			if(isNaN(val)) val = row[i-1];

			var obj = game;
			keys.forEach((k, i) => {
				if(i === keys.length - 1) {
					obj[k] = val;
				} else {
					if(!obj[k]) obj[k] = {};
					obj = obj[k];
				}
			});
		});

		games.push(game);
	});

	console.log(JSON.stringify(games, null, 2));

});
