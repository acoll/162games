module.exports = {
	title: {
	    text: '',
	    x: -20 //center
	},
	subtitle: {
	    text: '',
	    x: -20
	},
	chart: {
            backgroundColor: 'none',
            type: 'line'
        },
	xAxis: {
	    enabled: false
	},
	yAxis: {
	    title: {
	        text: 'Wins +/-'
	    },
	    plotLines: [{
	        value: 0,
	        width: 1,
	        color: '#808080'
	    }]
	},
	tooltip: {
	    valueSuffix: 'Wins'
	},
	legend: {
	    enabled: false
	}
};