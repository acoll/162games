var Mn = require('backbone.marionette');
var Backbone = require('backbone');
var teams = require('../models/teams.json');
var standings = require('../models/standings.json');
var defaultTeam = require('../models/default-team.json');
var Chart = require('chart.js');

var StatsView = require('./StatsView');

module.exports = Mn.LayoutView.extend({
	template: require('../templates/layout.jade'),
	regions: {
		'team-one-stats': '.team-one-stats',
		'team-two-stats': '.team-two-stats'
	},
	events: {
		'click .team-name': 'clickedTeam'
	},
	initialize: function () {
		this.collection = new Backbone.Collection(teams);
		this.teamOne = null;
		this.teamTwo = null;
	},
	clickedTeam: function (e) {
		var name = this.$(e.currentTarget).text();

		var team = teams.filter(t => t.first_name === name)[0];
		team.standing = standings.standing.filter(t => t.team_id === team.team_id)[0];

		if(!this.teamOne) {
			this.teamOne = new Backbone.Model(team);
			this.getRegion('team-one-stats').show(new StatsView({ model: this.teamOne }));
			return;
		}

		if(!this.teamTwo) {
			this.teamTwo = new Backbone.Model(team);
			this.getRegion('team-two-stats').show(new StatsView({ model: this.teamTwo }));
			return;
		}

		this.teamOne = new Backbone.Model(team);
		this.getRegion('team-one-stats').show(new StatsView({ model: this.teamOne }));
		this.teamTwo = null;
	},
	onRender: function () {
		this.getRegion('team-one-stats').show(new StatsView({ model: new Backbone.Model(defaultTeam) }));
		this.getRegion('team-two-stats').show(new StatsView({ model: new Backbone.Model(defaultTeam) }));

		var data = {
		    labels: ["January", "February", "March", "April", "May", "June", "July"],
		    datasets: [
		        {
		            label: "My First dataset",
		            fillColor: "rgba(220,220,220,0.0)",
		            strokeColor: "rgba(220,220,220,1)",
		            pointColor: "rgba(220,220,220,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: [65, 59, 80, 81, 56, 55, 40]
		        },
		        {
		            label: "My Second dataset",
		            fillColor: "rgba(151,187,205,0.0)",
		            strokeColor: "rgba(151,187,205,1)",
		            pointColor: "rgba(151,187,205,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: [28, 48, 40, 19, 86, 27, 90]
		        }
		    ]
		};

		var opts = {
			responsive: true,
			bezierCurve: false
		};

		var ctx = this.$el.find('#chart')[0].getContext('2d');
		var chart = new Chart(ctx).Line(data, opts);

		console.log(chart);
	}
});