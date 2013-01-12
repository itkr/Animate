(function(document) {

	/**
	 * Project
	 */
	var world = $A.fn.init(document);
	/**
	 * Scene1
	 */
	var scene1 = world.addScene(function() {
		// box view
		this.addView(function() {
			this.createBox();
		}, 'scene1_view1');
		// canvas view
		this.addCanvas(function(width, height) {
			this.drawFillTriangle(width / 2, height / 2, 60, '#3366ff');
			this.drawStrokeTriangle(width / 2, height / 2, 60, {
				color : '#cc6666',
				lineWidth : 6
			});
			// this.draw(width, height);
		}, 'scene1_canvas1');
	}, 'scene1');

})(window.document);
