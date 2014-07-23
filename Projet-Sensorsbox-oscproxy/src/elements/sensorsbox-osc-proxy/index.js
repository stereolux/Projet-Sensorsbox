/*
	Sensorsbox OSC-PROXY Logic
*/

Polymer('sensorsbox-osc-proxy', {
	observe : {
		'$.settingspage.remoteServer' : 'newRemoteServer',
		'$.settingspage.localServer' : 'newLocalServer'
	},
	newRemoteServer : function(oldValue, newValue){
		this.connection = new SensorsBox.Connection({
			host: newValue
		});
		this.connection.on('connect', function(){
			console.log('connection successfully established');
		});

		this.$.boxespage.remoteServer = newValue;
	},
	newLocalServer : function(oldValue, newValue){
		var _self = this;
		if (typeof(chrome.app.runtime) !== 'undefined') {
			this.oscPort = new osc.UDPPort({
				localAddress: '0.0.0.0',
				localPort: 0
			});
			this.oscPort.open();
			this.connection.on('measure', function(measure){
				console.log(measure);
				_self.oscPort.send({
					address: '/' + measure.data.box + '/' + measure.data.sensor,
					args: ['value', measure.data.value]
				}, '127.0.0.1', targetPort);
			});
		}

		this.$.boxespage.localServer = newValue;
	},
	ready: function() {
		var _self = this;
		var pages = this.shadowRoot.querySelector('core-pages');
		var coreItems = this.shadowRoot.getElementsByTagName('core-icon-button');

		for (var i = 0; i < coreItems.length; i++) {
			coreItems[i].addEventListener('click', function(e) {
				pages.selected = this.dataset.pageindex;
			});
		}

		var boxes = this.shadowRoot.querySelector('sensorsbox-boxes');
		boxes.addEventListener('watchbox', function(e){
			_self.connection.watchBox(e.detail.boxid, function(){
				console.log('Now watching box ' + e.detail.boxid);
			});
		});
		boxes.addEventListener('unwatchbox', function(e){
			_self.connection.unwatchBox(e.detail.boxid, function(){
				console.log('Not watching box ' + e.detail.boxid + ' anymore');
			});
		})
	}
});
