var Mn = require('backbone.marionette');
var teams = require('../teams.json');
var winPerc = require('../win-percentage.json');
var Chart = require('chart.js');
var _ = require('underscore');

var opts = { 
	responsive: true, 
	bezierCurve: false,
	datasetFill: false
};

module.exports = Mn.LayoutView.extend({
	template: require('../templates/layout.jade'),
	templateHelpers: function () {
		return {
			teams: _.values(teams)
		};
	},
	onRender: function () {
		var ctx = this.$el.find('#chart')[0].getContext('2d');
		new Chart(ctx).Line(winPerc, opts);
	}
});