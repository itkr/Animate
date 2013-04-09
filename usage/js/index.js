(function(document) {

	var $ = function(id){
		return document.getElementById(id);
	};
	var world = $A.init($('world'));
	$('next').onclick = function() {
		world.next();
	};
	$('prev').onclick = function() {
		world.prev();
	};

	/**
	 * Scene1
	 */
	var scene1 = world.addScene(function() {

		var view1 = this.add($A.title(function() {
			this.width = 150;
			this.y = 0;
			this.setText('text1');
			this.hide();
		}));

		var view2 = this.add($A.sentence(function() {
			this.width = 150;
			this.y = 60;
			this.setText('text2');
			this.hide();
		}));

		var view3 = this.add($A.sentence(function() {
			this.width = 150;
			this.y = 120;
			this.setText('text3');
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
			this.name='c1';
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
		
		// this.addAction($A.action(function() {
			// world.resize(0.5);
		// }));


		// this.addAction($A.action(function() {
			// canvas1.x = 0;
			// canvas1.y = 0;
			// canvas1.width = 500;
			// canvas1.height = 500;
		// }));
		//
		// this.addAction($A.action(function() {
		// canvas1.draw(500, 500);
		// }));

	});

	/**
	 * Scene2
	 */
	var scene2 = world.addScene(function() {
		this.add($A.title(function() {
			this.width = 150;
			this.y = 0;
			this.setText('Scene2');
		}));
	});

	/**
	 * Scene3
	 */
	var scene3 = world.addScene(function() {
		this.add($A.title(function() {
			this.width = 150;
			this.y = 0;
			this.setText('Scene3');
		}));
	});

})(window.document);
