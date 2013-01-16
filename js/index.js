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

		var view1 = this.add($A.view(function() {
			this.width = 150;
			this.y = 0;
			this.text('text1');
		}), 'scene1_view1').hide();

		var view2 = this.add($A.view(function() {
			this.width = 150;
			this.y = 60;
			this.text('text2');
		}), 'scene1_view2').hide();

		var view3 = this.add($A.view(function() {
			this.width = 150;
			this.y = 120;
			this.text('text3');
		}), 'scene1_view3').hide();

		var canvas1 = this.add($A.canvas(function() {
			this.width = 150;
			this.height = 150;
			this.x = 50;
			this.y = 50;
			this.drawFillTriangle(this.width / 2, this.height / 2, 60, '#3366ff');
			this.drawStrokeTriangle(this.width / 2, this.height / 2, 60, {
				color : '#cc6666',
				lineWidth : 6
			});
		}), 'scene1_canvas1').hide();

		this.addAction($A.action(function() {
			view1.display();
		}));

		this.addAction($A.action(function() {
			view2.display();
		}));

		this.addAction($A.action(function() {
			view3.display();
		}));

		this.addAction($A.action(function() {
			canvas1.display();
		}));

		this.addAction($A.action(function() {
			canvas1.x = 0;
			canvas1.y = 0;
			canvas1.width = 500;
			canvas1.height = 500;
		}));

		this.addAction($A.action(function() {
			canvas1.draw(500, 500);
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
