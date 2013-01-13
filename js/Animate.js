(function(global) {
	// @TODO ViewとCanvasViewなどで共通するメソッドを統一

	var document = global.document;
	var Animate = {};

	/**
	 * ベースとなるオブジェクト群
	 */
	Animate.core = (function() {
		var objects = {

			View : function() {

				var element = document.createElement('div');
				var that = this;
				this.width = function(width) {
					if ( typeof width === 'number') {
						element.width = width;
						element.style.width = width + 'px';
					}
					return element.width;
				};

				this.height = function(height) {
					if ( typeof height === 'number') {
						element.height = height;
						element.style.height = height + 'px';
					}
					return element.height;
				};

				this.setTo = function(parent_element) {
					parent_element.appendChild(element);
				};

				// elementに追加
				this.append = function(elem) {
					element.appendChild(elem);
				};

				// box(DIV)を作成
				this.createBox = function() {
					var box = document.createElement('div');
					box.innerHTML = 'hoge';
					box.className = 'box';
					box.style.width = that.width() + 'px';
					box.style.height = that.height() + 'px';
					element.appendChild(box);
					return box;
				};

				// 表示させる
				this.display = function() {
				};

				// 見えないようにする
				this.hide = function() {
				};
			},

			CanvasView : function() {
				// 正三角形の内接円の半径
				var INSCRIBED_CIRCLE = 0.298;
				// 正三角形の外接円の半径
				var CIRCUMCIRCLE = 0.577;

				var element = document.createElement('canvas');
				var context = element.getContext('2d');

				this.width = function(width) {
					if ( typeof width === 'number') {
						element.width = width;
						element.style.width = width + 'px';
					}
					return element.width;
				};

				this.height = function(height) {
					if ( typeof height === 'number') {
						element.height = height;
						element.style.height = height + 'px';
					}
					return element.height;
				};

				this.setTo = function(parent_element) {
					parent_element.appendChild(element);
				};

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

				// キャンバス内消す
				this.clear = function() {
					context.beginPath();
					context.clearRect(0, 0, element.width, element.height);
					context.closePath();
				};

			},

			Canvas : function(element) {
				var objects = {
					Point : function(x, y) {
						this.x = x;
						this.y = y;
					},
					Rect : function(x, y, edge) {

					}
				};
				return objects;
			},

			Scene : function(element) {
				var currentAction = 0, actionList = [];
				var element = document.createElement('div');
				element.setAttribute('class', 'scene');
				this.setTo = function(parent_element) {
					parent_element.appendChild(element);
				}
				this.next = function() {
					if (currentAction === actionList.length) {
						return false;
					}
					currentAction += 1;
					return true;
				};
				this.prev = function() {
					if (currentAction === 0) {
						return false;
					}
					currentAction -= 1;
					return true;
				};
				this.addAction = function() {

				};
				this.addView = function(Obj, name) {
					Animate.tools.extend(Obj, Animate.core.View)
					var obj = new Obj();
					obj.setTo(element);
					return obj;
				};
				this.addCanvas = function(Obj, name, width, height) {
					// 仮
					Animate.tools.extend(Obj, Animate.core.CanvasView)
					var obj = new Obj(width, height);
					obj.setTo(element);
					return obj;
				};
				this.removeView = function() {

				};
				this.removeCanvas = function() {

				};
			},

			World : function(element) {
				var currentScene = 0, sceneList = [];
				this.play = function() {

				};
				this.next = function() {
					if (currentScene === sceneList.length) {
						return false;
					}
					currentScene += 1;
					return true;
				};
				this.prev = function() {
					if (currentScene === 0) {
						return false;
					}
					currentScene -= 1;
					return true;
				};
				this.addScene = function(Obj, name) {
					Animate.tools.extend(Obj, Animate.core.Scene)
					sceneList.push(Obj);
					var obj = new Obj();
					obj.setTo(element);
					return obj;
				};
				this.removeScene = function() {

				};

			},

			Action : function() {
				// Tweenerっぽくしたい
				this.play = function() {

				};
			}
		};
		return objects;
	})();

	/**
	 * アプリケーション全体に関わる関数など
	 */
	Animate.tools = {

		//継承実装1
		update : function(dest, sources) {
			for (var property in sources) {
				dest[property] = sources[property];
			}
			return dest;
		},

		// 継承実装2
		//		extend : function(child, parent) {
		//			var extendLight = function(p, c) {
		//				var j;
		//				for (j in p) {
		//					if (p.hasOwnProperty(j)) {
		//						c[j] == p[j];
		//					}
		//				}
		//				return c;
		//			};
		//			var i = 0, toStr = Object.prototype.toString, astr = "[object Array]";
		//			for (i in parent) {
		//				if (parent.hasOwnProperty(i)) {
		//					if ( typeof parent[i] === "object") {
		//						child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
		//						extendLight(parent[i], child[i]);
		//					} else {
		//						child[i] = parent[i];
		//					}
		//				}
		//			}
		//			return child;
		//		},

		extend : function(Child, Parent) {
			Child.prototype = new Parent();
			return Child;
		},

		// 汎用的イベントハンドラ
		listenEvent : function(eventTarget, eventType, eventHandler) {
			if (eventTarget.addEventListener) {
				eventTarget.addEventListener(eventType, eventHandler, false);
			} else if (eventTarget.attachEvent) {
				eventType = "on" + eventType;
				eventTarget.attachEvent(eventType, eventHandler);
			} else {
				eventTarget["on" + eventType] = eventHandler;
			}
		}
	};

	/**
	 *  独自イベントハンドラ
	 */
	Animate.events = (function(document) {
		var objects = {
		};
		return objects;
	})(document);

	/**
	 * 外部ライブラリ関連
	 */
	Animate.lib = (function() {
		var objects = {
		};
		return objects;
	})();

	Animate.fn = (function() {
		var objects = {
			init : function(element) {
				return new Animate.core.World(element);
			},
			view : function(Obj) {
				return Animate.tools.extend(Obj, Animate.core.View);
			},
			canvas : function(Obj) {
				return Animate.tools.extend(Obj, Animate.core.CanvasView);
			},
			model : function(Obj) {
				return Animate.tools.extend(Obj, Animate.core.Model);
			}
		};
		return objects;
	})();

	global.$A = Animate.fn;
	global.Animate = Animate;

})(this);
