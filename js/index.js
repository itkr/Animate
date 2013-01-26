(function(document) {

	/**
	 * Project
	 */
	var body = document.getElementsByTagName('body')[0];
	var world = $A.init(body);

	// ---- デバッグ用 ----
	var next_a = document.createElement('a');
	var next_text = document.createTextNode('next ');
	next_a.setAttribute('href', 'javascript:void(0)');
	next_a.onclick = function() {
		world.next();
	};
	next_a.appendChild(next_text);
	body.appendChild(next_a);
	var prev_a = document.createElement('a');
	var prev_text = document.createTextNode(' prev');
	prev_a.setAttribute('href', 'javascript:void(0)');
	prev_a.onclick = function() {
		world.prev();
	};
	prev_a.appendChild(prev_text);
	body.appendChild(prev_a);
	// ---- デバッグ用 ----

	/**
	 * Scene1
	 */
	var scene1 = world.addScene(function() {

		var view1 = this.add($A.view(function() {
			this.width = 150;
			this.y = 0;
			this.text('text1');
			this.hide();
		}));

		var view2 = this.add($A.view(function() {
			this.width = 150;
			this.y = 60;
			this.text('text2');
			this.hide();
		}));

		var view3 = this.add($A.view(function() {
			this.width = 150;
			this.y = 120;
			this.text('text3');
			this.hide();
		}));

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
			this.hide();
		}));

		this.addAction($A.action(function() {
			view1.show();
		}));

		this.addAction($A.action(function() {
			view2.show();
		}));

		this.addAction($A.action(function() {
			view3.show();
		}));

		this.addAction($A.action(function() {
			canvas1.show();
		}));

		this.addAction($A.action(function() {
			canvas1.x = 0;
			canvas1.y = 0;
			canvas1.width = 500;
			canvas1.height = 500;
		}));
		//
		// this.addAction($A.action(function() {
		// canvas1.draw(500, 500);
		// }));

	});

	/**
	 * Scene2
	 */
	var scene2 = world.addScene(function() {
		this.add($A.view(function() {
			this.width = 150;
			this.y = 0;
			this.text('Scene2');
		}));
	});

	/**
	 * Scene3
	 */
	var scene3 = world.addScene(function() {
		this.add($A.view(function() {
			this.width = 150;
			this.y = 0;
			this.text('Scene3');
		}));
	});

})(window.document);
