var Mn = require('backbone.marionette');
var Chart = require('chart.js');
var _ = require('underscore');
var color = require('onecolor');

var teams = window.teams = require('../teams.json');
var gameData = require('../games.json');

function buildChartOpts (fn) {
	 return {
		labels: Array.apply(null, {length: 162}).map(Number.call, Number).map(i => i),
		datasets: Object.keys(teams).map(key => {
			var rgb = color(teams[key].colors[0]);
			var highlightColor = rgb.cssa();
			var strokeColor = rgb.cssa();
			return {
				label: gameData[key] ? teams[key].first_name + ' ' + teams[key].last_name : 'UNKNOWN: ' + key,
				data: gameData[key].games.map(fn),
				strokeColor: strokeColor,
				pointColor: highlightColor
		    };
	    })
	};
}

var winPerc = buildChartOpts(g => g.wins);
var homeRuns = buildChartOpts(g => g.homeruns);

var opts = require('../win-percentage-opts.js');

module.exports = Mn.LayoutView.extend({
	template: require('../templates/layout.jade'),
	events: {
		'click .teamname': 'clickedTeam'
	},
	initialize: function () {
		this.selectedTeams = {};
	},
	templateHelpers: function () {
		return {
			teams: _.values(teams)
		};
	},
	onRender: function () {
		if(this.$el.find('#chart')[0]) {
			var ctx = this.$el.find('#chart')[0].getContext('2d');
			this.chart = new Chart(ctx).Line(winPerc, opts);
		}

		this.hittingChart = new Chart(this.$el.find('#hitting-chart')[0].getContext('2d')).Line(homeRuns, opts);

	},
	clickedTeam: function (e) {
		e.preventDefault();

		var teamId = e.currentTarget.getAttribute('teamId');

		var name = teams[teamId].first_name + ' ' + teams[teamId].last_name;

		console.log(name);

		if(this.selectedTeams[name]) delete this.selectedTeams[name];
		else this.selectedTeams[name] = teamId;

		this.$el.find('.teamname').addClass('inactive');

		Object.keys(this.selectedTeams).forEach(name => {
			this.$el.find('[teamId=' + this.selectedTeams[name] + ']').removeClass('inactive');
		});

		this.chart.datasets.forEach(dataset => {
			if(this.selectedTeams[dataset.label])
				dataset.strokeColor = color(dataset.strokeColor).alpha(1).cssa();
			else
				dataset.strokeColor = color(dataset.strokeColor).alpha(0.1).cssa();
		});

		this.chart.update();
	}
});