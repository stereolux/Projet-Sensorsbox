;(function(root) {

	var EventEmitter = function() {};

	EventEmitter.prototype.on = function(event, callback) {
		this._events = this._events || {};
		this._events[event] = this._events[event] || [];
		this._events[event].push(callback);
	};

	EventEmitter.prototype.off = function(event, callback) {
		this._events = this._events || {};
		if (event in this._events === false) return;
		this._events[event].splice(this._events[event].indexOf(callback), 1);
	};

	EventEmitter.prototype.emit = function(event /* , args... */) {
		this._events = this._events || {};
		if (event in this._events === false) return;
		for (var i = 0; i < this._events[event].length; i++){
			this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	};

	EventEmitter.inherits = function(object) {
		var functions = ['on', 'off', 'emit'];
		for (var i = 0; i < functions.length; i ++) {
			if (typeof object === 'function') {
				object.prototype[functions[i]] = EventEmitter.prototype[functions[i]];
			}
			else {
				object[functions[i]] = EventEmitter.prototype[functions[i]];
			}
		}
	};

	root.SensorsBox = root.SensorsBox || {};
	root.SensorsBox.EventEmitter = EventEmitter;

})(this);
