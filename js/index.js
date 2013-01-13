(function(document) {

	/**
	 * Project
	 */
	var body = document.getElementsByTagName('body')[0];
	var world = $A.init(body);

	/**
	 * Scene1
	 */
	var scene1 = world.addScene(function() {
		// box view
		this.addView(function() {
			this.width(100);
			this.height(100);
			this.createBox();
		}, 'scene1_view1');
		// canvas view
		this.addCanvas(function() {
			var width = this.width(500);
			var height = this.height(500);
			this.drawFillTriangle(width / 2, height / 2, 60, '#3366ff');
			this.drawStrokeTriangle(width / 2, height / 2, 60, {
				color : '#cc6666',
				lineWidth : 6
			});
			// this.draw(width, height);
		}, 'scene1_canvas1');
	}, 'scene1');

})(window.document);
