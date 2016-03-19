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
        allowDecimals: false,
        title: { text: 'Game' },
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
	    valueSuffix: '',
	    style: {
                bottom: 40,
                top: 40,
                fontWeight: 'bold'
            }
	},
	legend: {
	    enabled: false
	},
	plotOptions: {
        series: {
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