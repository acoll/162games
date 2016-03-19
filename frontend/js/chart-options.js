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
	    enabled: false,
        allowDecimals: false,
        title: { text: 'Fruit' },
        visible: false
	},
	yAxis: {
	    title: { text: '' },
	    plotLines: [{
	        value: 0,
	        width: 1,
	        color: '#808080'
	    }]
	},
	tooltip: {
	    valueSuffix: ''
	},
	legend: {
	    enabled: false
	},
	plotOptions: {

        series: {
        	lineWidth: 2
            marker: {
                radius: 0,
                lineColor: null,
                    states: {
                        hover: {
                            fillColor: 'white',
                            radius: 15,
                        }
                    }
                }
            }
        }
};