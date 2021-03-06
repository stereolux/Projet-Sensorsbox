;(function() {
	var n = 20,
		datas = {},
		paths = {},
		colors = {};

	var margin = {top: 20, right: 20, bottom: 20, left: 40},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var x = d3.scale.linear()
		.domain([0, n - 1])
		.range([0, width]);

	var y = d3.scale.linear()
		.domain([0, 1023])
		.range([height, 0]);

	var line = d3.svg.line()
		.x(function(d, i) { return x(i); })
		.y(function(d, i) { return y(d); })
		.interpolate('basis');

	var svg = d3.select('body').append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	svg.append('defs').append('clipPath')
		.attr('id', 'clip')
		.append('rect')
		.attr('width', width)
		.attr('height', height);

	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + y(0) + ')')
		.call(d3.svg.axis().scale(x).orient('bottom'));

	svg.append('g')
		.attr('class', 'y axis')
		.call(d3.svg.axis().scale(y).orient('left'));

	var updateGraph = function(measure) {
		datas[measure.data.sensor].push(measure.data.value);
		paths[measure.data.sensor]
				.attr('d', line)
				.attr('transform', null)
				.transition()
				.duration(900)
				.ease('linear')
				.attr('stroke', colors[measure.data.sensor])
				.attr('stroke-width', 2)
				.attr('fill', 'none')
				.attr('transform', 'translate(' + x(-1) + ',0)');
		if (datas[measure.data.sensor].length > n + 2) datas[measure.data.sensor].shift();
		console.log(datas[measure.data.sensor]);
	};

	var descriptionDiv = document.createElement('div');

	var sbConnection = new SensorsBox.Connection({
		verbose:true
	});
	window.sbConnection = sbConnection;
	sbConnection.on('connect', function(){
		sbConnection.watchBox('53838983b94c1e0200b2a02d', function(err, box) {
			console.log('successfully watching');
		});
	})
	sbConnection.on('box', function(body){
		body.data.sensor.forEach(function(sensor) {
			colors[sensor.id] = 'hsl(' + Math.random() * 360 + ',100%,50%)';
			var desc = document.createElement('div');
			desc.setAttribute('style','color: ' + colors[sensor.id] + ';');
			desc.innerHTML = sensor.name + ': ' + sensor.description;
			descriptionDiv.appendChild(desc);

			console.log(colors[sensor.id]);
			datas[sensor.id] = [];
			paths[sensor.id] = svg.append('g')
				.attr('clip-path', 'url(#clip)')
				.append('path')
				.datum(datas[sensor.id])
				.attr('class', 'line')
				.attr('d', line);
		});
	});

	document.body.appendChild(descriptionDiv);
	/*sensorsBoxConnection.watchSensor('537e7e7daf25ef0200ad8c09', function(err, sensor) {
		datas[sensor.id] = [];
		paths[sensor.id] = svg.append('g')
			.attr('clip-path', 'url(#clip)')
			.append('path')
			.datum(datas[sensor.id])
			.attr('class', 'line')
			.attr('d', line);
	});*/
	sbConnection.on('measure', function(measure) {
		updateGraph(measure);
	});

})();
