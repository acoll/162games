var Mn = require('backbone.marionette');
var Chart = require('chart.js');
var Highcharts = require('highcharts');
var _ = require('underscore');
var color = require('onecolor');

var chartOptions = require('../chart-options');

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


function buildDataSeries (fn) {
	return Object.keys(teams).map(key => {
		var rgb = color(teams[key].colors[0]);
		var highlightColor = rgb.cssa();
		var strokeColor = rgb.alpha(0.05).cssa();
		return {
			name: gameData[key] ? teams[key].first_name + ' ' + teams[key].last_name : 'UNKNOWN: ' + key,
			data: gameData[key].games.map(fn),
			type: 'line',
			color: strokeColor
	    };
    });
}

var winPerc = buildChartOpts(g => g.wins);
var homeRuns = buildChartOpts(g => g.homeruns);
var runsData = buildChartOpts(g => g.runs);

var opts = require('../win-percentage-opts.js');

module.exports = Mn.LayoutView.extend({
	template: require('../templates/layout.jade'),
	events: {
		'click .teamname': 'clickedTeam',
		'click .pick-chart-hitting': 'changeHittingChart',
		'click .pick-chart-pitching': 'changePitchingChart'
	},
	initialize: function () {
		this.selectedTeams = {};
		window.VIEW = this;
	},
	templateHelpers: function () {
		return {
			teams: _.values(teams)
		};
	},
	onRender: function () {



		this.chart = Highcharts.chart(this.$el.find('#chart')[0], _.extend(chartOptions, { series: buildDataSeries(g => g.wins) }));

		// if(this.$el.find('#chart')[0]) {
		// 	var ctx = this.$el.find('#chart')[0].getContext('2d');
		// 	this.chart = new Chart(ctx).Line(winPerc, opts);
		// }

		// this.hittingChart = new Chart(this.$el.find('#hitting-chart')[0].getContext('2d')).Line(homeRuns, opts);

	},
	clickedTeam: function (e) {
		e.preventDefault();

		var teamId = e.currentTarget.getAttribute('teamId');

		var name = teams[teamId].first_name + ' ' + teams[teamId].last_name;

		console.log(name);


		var series = this.chart.series.find(series => series.name === name);

		if(this.selectedTeams[name]) {
			delete this.selectedTeams[name];
			series.options.color = color(series.options.color).alpha(0.05).cssa();
		}
		else {
			this.selectedTeams[name] = teamId;
			series.options.color = color(series.options.color).alpha(1).cssa();
		}

		series.update(series.options);

		this.$el.find('.teamname').addClass('inactive');

		Object.keys(this.selectedTeams).forEach(name => {
			this.$el.find('[teamId=' + this.selectedTeams[name] + ']').removeClass('inactive');
		});

	},
	changeHittingChart: function (e) {
		var chartName = e.currentTarget.getAttribute('chart');

		this.$el.find('.pick-chart-hitting').removeClass('active-chart');
		this.$el.find(e.currentTarget).addClass('active-chart');

		if(!chartName) {
			return window.alert('Not Implemented');
		}
		console.log(chartName);

		var newData = {
			'runs': runsData
		}[chartName] || homeRuns;

		this.hittingChart = new Chart(this.$el.find('#hitting-chart')[0].getContext('2d')).Line(newData, opts);
	},
	changePitchingChart: function (e) {
		var chartName = e.currentTarget.getAttribute('chart');

		this.$el.find('.pick-chart-pitching').removeClass('active-chart');
		this.$el.find(e.currentTarget).addClass('active-chart');

		if(!chartName) {
			return window.alert('Not Implemented');
		}
		console.log(chartName);

		var newData = {
			'runs': runsData,
			'homeruns': homeRuns
		}[chartName] || homeRuns;

		this.hittingChart = new Chart(this.$el.find('#pitching-chart')[0].getContext('2d')).Line(newData, opts);
	}
});