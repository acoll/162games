var Mn = require('backbone.marionette');
var teams = require('../teams.json');
var winPerc = require('../win-percentage.json');
var Chart = require('chart.js');
var _ = require('underscore');

var datasets = Object.keys(winPerc)
.filter(key => teams[key])
.map(key => {
	console.log('KEY:', key, teams[key]);
	return {
		label: [teams[key].first_name, teams[key].last_name].join(' '),
		data: winPerc[key].games.map(e => e.perc),
		strokeColor: teams[key].colors[0],
		pointColor: teams[key].colors[0]
	};
});

console.log(datasets);

var data = {
    labels: Array.apply(null, {length: 162}).map(Number.call, Number).map(i => i+1),
    datasets: datasets
};

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
		new Chart(ctx).Line(data, opts);
	}
});