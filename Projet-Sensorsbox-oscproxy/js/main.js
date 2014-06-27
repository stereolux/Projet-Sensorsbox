(function($, SensorsBox, osc) {

	window.onload = function() {
		var boxesURL = 'http://beta.sensorsbox.com/api/v1/box';
		var $boxList = $('#boxes');
		var connection = new SensorsBox.Connection();
		var oscPort = new osc.UDPPort({
			localAddress: "0.0.0.0",
			localPort: 0
		});
		oscPort.open();
		connection.on('connect', function(){
			console.log('connection successfully established');
		});
		connection.on('measure', function(measure){
			console.log(measure);
			oscPort.send({
				address: '/' + measure.data.box + '/' + measure.data.sensor,
				args: ['value', measure.data.value]
			}, '127.0.0.1', 3333);
		});

		$.getJSON(boxesURL, function(boxes) {
			boxes.forEach(function(box) {
				var $li = $('<li/>').appendTo($boxList);
				var $div = $('<div/>').appendTo($li);
				var $checkbox = $('<input/>')
					.prop('type', 'checkbox')
					.data('boxId', box.id)
					.appendTo($div);
				var $label = $('<label/>')
					.text(box.name)
					.appendTo($div);
			});
		});

		$('#startProxying').click(function() {
			$('#boxes input').each(function() {
				if ($(this).prop('checked')) {
					var boxId = $(this).data('boxId');
					connection.watchBox(boxId);
				}
			});
		});
	};

})(jQuery, SensorsBox, osc);
