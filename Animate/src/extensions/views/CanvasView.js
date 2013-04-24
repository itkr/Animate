Animate.core.CanvasView = function() {
	var INSCRIBED_CIRCLE = 0.298;
	var CIRCUMCIRCLE = 0.577;
	var that = this;
	var context;
	this.element = document.createElement('canvas');
	Animate.tools.addClass(this.element, 'CanvasView');
	context = this.element.getContext('2d');

	// 正三角形の塗り
	this.drawFillTriangle = function(centerX, centerY, edge, color) {
		context.fillStyle = color;
		context.beginPath();
		context.moveTo(centerX, centerY - (edge * CIRCUMCIRCLE));
		context.lineTo(centerX + (edge / 2), centerY + (edge * INSCRIBED_CIRCLE));
		context.lineTo(centerX - (edge / 2), centerY + (edge * INSCRIBED_CIRCLE));
		context.closePath();
		context.fill();
	};

	// 正三角形の線
	this.drawStrokeTriangle = function(centerX, centerY, edge, option) {
		if ( typeof option.color !== 'undefined')
			context.strokeStyle = option.color;
		if ( typeof option.lineWidth !== 'undefined')
			context.lineWidth = option.lineWidth;
		context.beginPath();
		context.moveTo(centerX, centerY - (edge * CIRCUMCIRCLE));
		context.lineTo(centerX + (edge / 2), centerY + (edge * INSCRIBED_CIRCLE));
		context.lineTo(centerX - (edge / 2), centerY + (edge * INSCRIBED_CIRCLE));
		context.closePath();
		context.stroke();
	};

	// 円の塗り
	this.drawFillArc = function(centerX, centerY, redius, color) {
		context.fillStyle = color;
		context.beginPath();
		context.arc(centerX, centerY, redius, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
	};

	// 円の線
	this.drawStrokeArc = function(centerX, centerY, redius, option) {
		if ( typeof option.color !== 'undefined')
			context.strokeStyle = option.color;
		if ( typeof option.lineWidth !== 'undefined')
			context.lineWidth = option.lineWidth;
		context.beginPath();
		context.arc(centerX, centerY, redius, 0, Math.PI * 2, true);
		context.closePath();
		context.stroke();
	};

	// 正方形の塗り
	this.drawFillRect = function(centerX, centerY, edge, color) {
		context.fillStyle = color;
		context.beginPath();
		context.fillRect(centerX - edge / 2, centerY - edge / 2, edge, edge);
		context.closePath();
		context.fill();
	};

	// 正方形の線
	this.drawStrokeRect = function(centerX, centerY, edge, option) {
		if ( typeof option.color !== 'undefined')
			context.strokeStyle = option.color;
		if ( typeof option.lineWidth !== 'undefined')
			context.lineWidth = option.lineWidth;
		context.beginPath();
		context.strokeRect(centerX - edge / 2, centerY - edge / 2, edge, edge);
		context.closePath();
		context.stroke();
	};

	// 線を引く
	this.drawStroke = function(posX1, posY1, posX2, posY2, option) {
		if ( typeof option.color !== 'undefined')
			context.strokeStyle = option.color;
		if ( typeof option.lineWidth !== 'undefined')
			context.lineWidth = option.lineWidth;
		context.beginPath();
		context.moveTo(posX1, posY1);
		context.lineTo(posX2, posY2);
		context.closePath();
		context.stroke();
	};

	this.draw = function(width, height) {
		var i = 0;
		var that = this;
		var f = function() {
			that.clear();
			that.drawFillTriangle(i, height / 2 + Math.cos(i * Math.PI / 180) * 120, 60, '#3366ff');
			that.drawStrokeTriangle(i, height / 2 + Math.cos(i * Math.PI / 180) * 120, 60, {
				color : '#cc6666',
				lineWidth : 6
			});
			i++;
			if (i > width) {
				i = 0;
			}
		};
		setInterval(f, 10);
	};

	this.clear = function() {
		context.beginPath();
		context.clearRect(0, 0, element.width, element.height);
		context.closePath();
	};
}

Animate.core.Sprite = function(element) {
	var objects = {
		Point : function(x, y) {
			this.x = x;
			this.y = y;
		},
		Rect : function(x, y, edge) {

		}
	};
	return objects;
}

Animate.tree.Base.View.CanvasView = {
	"Sprite" : {}
}

Animate.defaultSettings.canvas = {

}

Animate.fn.canvas = function(Obj) {
	var Obj = Animate.tools.extend(Obj, Animate.core.CanvasView);
	var obj = new Obj();
	obj.set(obj.settings['view']);
	obj.set(obj.settings['canvas']);
	return obj;
}
