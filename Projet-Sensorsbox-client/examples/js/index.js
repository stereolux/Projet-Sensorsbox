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
		datas[measure.created.sensor].push(measure.created.value);
		paths[measure.created.sensor]
				.attr('d', line)
				.attr('transform', null)
				.transition()
				.duration(900)
				.ease('linear')
				.attr('stroke', colors[measure.created.sensor])
				.attr('stroke-width', 2)
				.attr('fill', 'none')
				.attr('transform', 'translate(' + x(-1) + ',0)');
		if (datas[measure.created.sensor].length > n + 2) datas[measure.created.sensor].shift();
		console.log(datas[measure.created.sensor]);
	};

	var descriptionDiv = document.createElement('div');

	var sensorsBox = new SensorsBox({verbose: true});
	sensorsBox.watchBox('537e7956af25ef0200ad8bc5', function(err, box) {
		box.sensor.forEach(function(sensor) {
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
	/*sensorsBox.watchSensor('537e7e7daf25ef0200ad8c09', function(err, sensor) {
		datas[sensor.id] = [];
		paths[sensor.id] = svg.append('g')
			.attr('clip-path', 'url(#clip)')
			.append('path')
			.datum(datas[sensor.id])
			.attr('class', 'line')
			.attr('d', line);
	});*/
	sensorsBox.on('measure', function(measure) {
		updateGraph(measure);
	});

})();
