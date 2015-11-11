var Mn = require('backbone.marionette');
var Backbone = require('backbone');
var teams = require('../models/teams.json');
var standings = require('../models/standings.json');
var defaultTeam = require('../models/default-team.json');

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
	}
});