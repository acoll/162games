var Mn = require('backbone.marionette');
var teams = window.teams = require('../teams.json');
var winPerc = require('../win-percentage.json');
var Chart = require('chart.js');
var _ = require('underscore');
var color = require('onecolor');

var opts = require('../win-percentage-opts.js');

module.exports = Mn.LayoutView.extend({
	template: require('../templates/layout.jade'),
	events: {
		'click .teamname': 'clickedTeam'
	},
	templateHelpers: function () {
		return {
			teams: _.values(teams)
		};
	},
	onRender: function () {
		if(this.$el.find('#chart')[0]) {
			var ctx = this.$el.find('#chart')[0].getContext('2d');
			var chart = this.chart= window.chart = new Chart(ctx).Line(winPerc, opts);

			chart.update();

		}
	},
	clickedTeam: function (e) {
		e.preventDefault();

		var teamId = e.currentTarget.getAttribute('teamId');

		var name = teams[teamId].first_name + ' ' + teams[teamId].last_name;

		console.log(name);

		var dataset = this.chart.datasets.find(dataset => dataset.label === name);

		dataset.strokeColor = color(dataset.strokeColor).alpha(1).cssa() ;

		this.chart.update();
	}
});