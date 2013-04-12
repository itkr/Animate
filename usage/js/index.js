(function(document) {

	var $ = function(id) {
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
		var section = $A.section(function() {
		});
		section.add($A.title(function() {
			this.setText('Animate.js');
		}));
		section.add($A.sentence(function() {
			this.setText('the easy presentation library');
		}));
		section.add($A.sentence(function() {
			this.setText('try now');
		}));
		this.add(section);
	});

	/**
	 * Scene2
	 */
	var scene2 = world.addScene(function() {

		var view1 = this.add($A.title(function() {
			this.setText('Start project');
		}));

		var view2 = this.add($A.sentence(function() {
			this.setText('var world = $A.init(element);');
			this.hide();
		}));

		var view3 = this.add($A.sentence(function() {
			this.setText('var scene = world.addScene(func_a);');
			this.hide();
		}));

		var view4 = this.add($A.sentence(function() {
			this.setText('var view = scene.add($A.view(func_b);');
			this.hide();
		}));

		var view5 = this.add($A.sentence(function() {
			this.setText('view.add($A.action(func_c);');
			this.hide();
		}));

		this.addAction($A.action(function() {
			view2.show();
		}));

		this.addAction($A.action(function() {
			view3.show();
		}));

		this.addAction($A.action(function() {
			view4.show();
		}));

		this.addAction($A.action(function() {
			view5.show();
		}));

	});

	/**
	 * Scene3
	 */
	var scene3 = world.addScene(function() {
		this.add($A.title(function() {
			this.width = 150;
			this.y = 20;
			this.x = 100;
			this.setText('And canvas');
		}));

		var canvas1 = this.add($A.canvas(function() {
			this.width = 150;
			this.height = 150;
			this.x = 150;
			this.y = 150;
			this.drawFillTriangle(this.width / 2, this.height / 2, 60, '#3366ff');
			this.drawStrokeTriangle(this.width / 2, this.height / 2, 60, {
				color : '#cc6666',
				lineWidth : 6
			});
			this.hide();
		}));

		var canvas2 = this.add($A.canvas(function() {
			this.width = 150;
			this.height = 150;
			this.x = canvas1.x + 100;
			this.y = canvas1.y + 100;
			this.drawFillTriangle(this.width / 2, this.height / 2, 60, '#3366ff');
			this.drawStrokeTriangle(this.width / 2, this.height / 2, 60, {
				color : '#66cc66',
				lineWidth : 6
			});
			this.hide();
		}));

		var canvas3 = this.add($A.canvas(function() {
			this.width = 150;
			this.height = 150;
			this.x = canvas2.x + 100;
			this.y = canvas2.y + 100;
			this.drawFillTriangle(this.width / 2, this.height / 2, 60, '#3366ff');
			this.drawStrokeTriangle(this.width / 2, this.height / 2, 60, {
				color : '#6666cc',
				lineWidth : 6
			});
			this.hide();
		}));

		this.addAction($A.action(function() {
			canvas1.show();
		}));
		this.addAction($A.action(function() {
			canvas2.show();
		}));
		this.addAction($A.action(function() {
			canvas3.show();
		}));
	});

})(window.document);
