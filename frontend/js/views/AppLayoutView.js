var Mn = require('backbone.marionette');
var Chart = require('chart.js');
var Highcharts = require('highcharts');
var _ = require('underscore');
var color = require('onecolor');

var chartOptions = require('../chart-options');

var teams = window.teams = require('../teams.json');
var gameData = require('../games.json');


function buildDataSeries (fn) {
	return Object.keys(teams).map(key => {
		var rgb = color(teams[key].colors[0]);
		var highlightColor = rgb.cssa();
		var strokeColor = rgb.alpha(0.05).cssa();
		return {
			name: gameData[key] ? teams[key].first_name + ' ' + teams[key].last_name : 'UNKNOWN: ' + key,
			data: gameData[key].games.map(fn),
			type: 'line',
			color: strokeColor,
			lineWidth: 2,
			marker: {
				enabled: false,
                symbol: `url(/images/${teams[key].team_id}.svg)`,
                radius: 0,
                states: {
                	hover: {
                		enabled: true
                	}
                }
            },
	    };
    });
}

var datas = {
	wins: _.extend(_.clone(chartOptions), { series: buildDataSeries(g => g.wins) }),
	homeruns: _.extend(_.clone(chartOptions), { series: buildDataSeries(g => g.homeruns) }),
	runs: _.extend(_.clone(chartOptions), { series: buildDataSeries(g => g.runs) }),
	runsPm: _.extend(_.clone(chartOptions), { series: buildDataSeries(g => g.runsPm) }),
	stolenBases: _.extend(_.clone(chartOptions), { series: buildDataSeries(g => g.stolenBases) }),
	averages: _.extend(_.clone(chartOptions), { series: buildDataSeries(g => g.averages) }),
	strikeouts: _.extend(_.clone(chartOptions), { series: buildDataSeries(g => g.strikeouts) }),
	errors: _.extend(_.clone(chartOptions), { series: buildDataSeries(g => g.errors) }),
	slugPercentage: _.extend(_.clone(chartOptions), { series: buildDataSeries(g => g.slugPercentage) }),
	era: _.extend(_.clone(chartOptions), { series: buildDataSeries(g => g.era) }),
	whip: _.extend(_.clone(chartOptions), { series: buildDataSeries(g => g.whip) }),
	k9: _.extend(_.clone(chartOptions), { series: buildDataSeries(g => g.k9) }),
	w9: _.extend(_.clone(chartOptions), { series: buildDataSeries(g => g.w9) })
};

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
		this.chart = Highcharts.chart(this.$el.find('#chart')[0], datas.wins);
		this.hittingChart = Highcharts.chart(this.$el.find('#hitting-chart')[0], datas.homeruns);
		this.pitchingChart = Highcharts.chart(this.$el.find('#pitching-chart')[0], datas.errors);
	},
	highlightSelected: function () {
		Object.keys(this.selectedTeams).forEach(k => {
			this.highlightTeam(k);
		});
	},
	highlightTeam: function (name) {
		var seriesChart = this.chart.series.find(series => series.name === name);
		var seriesHitting = this.hittingChart.series.find(series => series.name === name);
		var seriesPitching = this.pitchingChart.series.find(series => series.name === name);

		console.log(seriesChart.options);

		if(!this.selectedTeams[name]) {
			seriesChart.options.color = color(seriesChart.options.color).alpha(0.05).cssa();
			seriesChart.options.lineWidth = 2;

			seriesHitting.options.color = color(seriesHitting.options.color).alpha(0.05).cssa();
			seriesHitting.options.lineWidth = 2;

			seriesPitching.options.color = color(seriesHitting.options.color).alpha(0.05).cssa();
			seriesPitching.options.lineWidth = 2;
		} else {
			seriesChart.options.color = color(seriesChart.options.color).alpha(1).cssa();
			seriesChart.options.lineWidth = 4;


			seriesHitting.options.color = color(seriesHitting.options.color).alpha(1).cssa();
			seriesHitting.options.lineWidth = 4;

			seriesPitching.options.color = color(seriesHitting.options.color).alpha(1).cssa();
			seriesPitching.options.lineWidth = 4;
		}

		seriesChart.update(seriesChart.options);
		seriesHitting.update(seriesHitting.options);
		seriesPitching.update(seriesPitching.options);
	},
	clickedTeam: function (e) {
		e.preventDefault();

		var teamId = e.currentTarget.getAttribute('teamId');

		var name = teams[teamId].first_name + ' ' + teams[teamId].last_name;

		console.log(name);

		if(this.selectedTeams[name]) {
			delete this.selectedTeams[name];
		} else {
			this.selectedTeams[name] = teamId;
		}

		this.highlightTeam(name);

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

		var newData = datas[chartName] || datas.homeruns;

		this.hittingChart = Highcharts.chart(this.$el.find('#hitting-chart')[0], newData);

		this.highlightSelected();
	},
	changePitchingChart: function (e) {
		var chartName = e.currentTarget.getAttribute('chart');

		this.$el.find('.pick-chart-pitching').removeClass('active-chart');
		this.$el.find(e.currentTarget).addClass('active-chart');

		if(!chartName) {
			return window.alert('Not Implemented');
		}
		console.log(chartName);

		var newData = datas[chartName] || datas.homeruns;

		this.pitchingChart = Highcharts.chart(this.$el.find('#pitching-chart')[0], newData);

		this.highlightSelected();
	}
});