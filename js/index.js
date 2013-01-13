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
		this.add($A.view(function() {
			this.width(150);
			this.height(150);
			this.x(5);
			this.y(5);
			this.createBox();
		}), 'scene1_view1');

		// canvas view
		this.add($A.canvas(function() {
			var width = this.width(150);
			var height = this.height(150);
			this.x(50);
			this.y(50);
			this.drawFillTriangle(width / 2, height / 2, 60, '#3366ff');
			this.drawStrokeTriangle(width / 2, height / 2, 60, {
				color : '#cc6666',
				lineWidth : 6
			});
			// this.draw(width, height);
		}), 'scene1_canvas1');
	}, 'scene1');

	/**
	 * Scene2
	 */
	var scene2 = world.addScene(function() {

	}, 'scene2');

	/**
	 * Scene3
	 */
	var scene3 = world.addScene(function() {

	}, 'scene3');

})(window.document);
