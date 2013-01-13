(function(document) {

	/**
	 * Project
	 */
	var body = document.getElementsByTagName('body')[0];
	var world = $A.init(body);

	// ---- デバッグ用 ----
	var next_a = document.createElement('a');
	var next_text = document.createTextNode('next');
	next_a.setAttribute('href', 'javascript:void(0)');
	next_a.onclick = function() {
		world.next()
	};
	next_a.appendChild(next_text);
	body.appendChild(next_a);
	// ---- デバッグ用 ----

	/**
	 * Scene1
	 */
	var scene1 = world.addScene(function() {
		// box view
		var view1 = this.add($A.view(function() {
			this.width(150);
			this.height(150);
			this.x(5);
			this.y(5);
			this.createBox();
		}), 'scene1_view1').hide();

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

		this.addAction($A.action(function() {
			view1.display();
		}));
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
