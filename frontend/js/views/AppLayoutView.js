var Mn = require('backbone.marionette');
var teams = require('../teams.json');
var winPerc = require('../win-percentage.json');
var Chart = require('chart.js');
var _ = require('underscore');

var opts = require('../win-percentage-opts.js');

module.exports = Mn.LayoutView.extend({
	template: require('../templates/layout.jade'),
	templateHelpers: function () {
		return {
			teams: _.values(teams)
		};
	},
	onRender: function () {
		if(this.$el.find('#chart')[0]) {
			var ctx = this.$el.find('#chart')[0].getContext('2d');
			window.chart = new Chart(ctx).Line(winPerc, opts);

		}
	}
});