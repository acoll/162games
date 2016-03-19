var Mn = require('backbone.marionette');
var Chart = require('chart.js');
var Highcharts = require('highcharts');
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

 series: [{
	            name: 'Tokyo',
	            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
	        }, {
	            name: 'New York',
	            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
	        }, {
	            name: 'Berlin',
	            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
	        }, {
	            name: 'London',
	            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
	        }]

function buildDataSeries (fn) {
	return Object.keys(teams).map(key => {
		var rgb = color(teams[key].colors[0]);
		var highlightColor = rgb.cssa();
		var strokeColor = rgb.cssa();
		return {
			name: gameData[key] ? teams[key].first_name + ' ' + teams[key].last_name : 'UNKNOWN: ' + key,
			data: gameData[key].games.map(fn),
			strokeColor: strokeColor,
			pointColor: highlightColor
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

		Highcharts.chart(this.$el.find('#chart')[0], {
	        title: {
	            text: 'Monthly Average Temperature',
	            x: -20 //center
	        },
	        subtitle: {
	            text: 'Source: WorldClimate.com',
	            x: -20
	        },
	        xAxis: {
	            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	        },
	        yAxis: {
	            title: {
	                text: 'Temperature (°C)'
	            },
	            plotLines: [{
	                value: 0,
	                width: 1,
	                color: '#808080'
	            }]
	        },
	        tooltip: {
	            valueSuffix: '°C'
	        },
	        legend: {
	            layout: 'vertical',
	            align: 'right',
	            verticalAlign: 'middle',
	            borderWidth: 0
	        },
	        series: buildDataSeries(g => g.wins)
	    });

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