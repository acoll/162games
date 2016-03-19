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
			var chart = this.chart= window.chart = new Chart(ctx).Line(winPerc, opts);

			chart.update();

		}
	},
	clickedTeam: function (e) {
		e.preventDefault();

		var teamId = e.currentTarget.getAttribute('teamId');

		var name = teams[teamId].first_name + ' ' + teams[teamId].last_name;

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