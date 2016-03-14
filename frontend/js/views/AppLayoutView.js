var Mn = require('backbone.marionette');
var teams = require('../teams.json');

module.exports = Mn.LayoutView.extend({
	template: require('../templates/layout.jade'),
	templateHelpers: function () {
		return {
			teams: teams
		};
	}
});