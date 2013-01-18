(function(global) {
	// @TODO ViewとCanvasViewなどで共通するメソッドを統一

	var document = global.document;
	var Animate = {};

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
	 * ベースとなるオブジェクト群
	 */
	Animate.core = (function() {
		var objects = {

			View : function() {
				var that = this;
				var defaultParams = {};
				var element = document.createElement('div');
				element.setAttribute('class', 'view');
				this.element = element;

				this.__defineGetter__("width", function() {
					return parseInt(this.element.style.width.replace("px", ""), 10);
				});
				this.__defineSetter__("width", function(width) {
					this.element.width = width;
					this.element.style.width = width + 'px';
					return this;
				});
				this.__defineGetter__("height", function() {
					return parseInt(this.element.style.height.replace("px", ""), 10);

				});
				this.__defineSetter__("height", function(height) {
					this.element.height = height;
					this.element.style.height = height + 'px';
					return this;
				});
				this.__defineGetter__("x", function() {
					return parseInt(this.element.style.left.replace("px", ""), 10);
				});
				this.__defineSetter__("x", function(x) {
					this.element.style.left = x + 'px';
					return this;
				});
				this.__defineGetter__("y", function() {
					return parseInt(this.element.style.top.replace("px", ""), 10);
				});
				this.__defineSetter__("y", function(y) {
					this.element.style.top = y + 'px';
					return this;
				});

				this.setTo = function(parent_element) {
					parent_element.appendChild(this.element);
					return this;
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

				this.text = function(text) {
					this.element.innerHTML = text;
					return this;
				};

				// 表示させる
				this.show = function() {
					this.element.style.display = 'block';
					return this;
				};

				// 見えないようにする
				this.hide = function() {
					this.element.style.display = 'none';
					return this;
				};

				this.updateDefaultParams = function(params) {
					if ( typeof params.x !== 'undefined')
						defaultParams.x = params.x;
					if ( typeof params.y !== 'undefined')
						defaultParams.y = params.y;
					if ( typeof params.width !== 'undefined')
						defaultParams.width = params.width;
					if ( typeof params.height !== 'undefined')
						defaultParams.height = params.height;
					if ( typeof params.display !== 'undefined')
						defaultParams.display = params.display;
				};

				this.reset = function() {
					this.x = defaultParams.x;
					this.y = defaultParams.y;
					this.width = defaultParams.width;
					this.height = defaultParams.height;
					this.element.style.display = defaultParams.display;
				};
			},

			CanvasView : function() {
				// 正三角形の内接円の半径
				var INSCRIBED_CIRCLE = 0.298;
				// 正三角形の外接円の半径
				var CIRCUMCIRCLE = 0.577;

				var that = this;
				var element = document.createElement('canvas');
				var context = element.getContext('2d');
				this.element = element;

				element.setAttribute('class', 'canvasView');

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

			Sprite : function(element) {
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

			Scene : function() {
				var currentAction = 0, actionList = [], that = this;
				var element = document.createElement('div');
				element.setAttribute('class', 'scene');
				this.setTo = function(parent_element) {
					parent_element.appendChild(element);
				};
				this.hasNext = function() {
					if (currentAction === actionList.length) {
						return false;
					} else {
						return true;
					}
				};
				this.next = function() {
					if (this.hasNext()) {
						actionList[currentAction].play();
						currentAction += 1;
						return true;
					} else {
						return false;
					}
				};
				this.prev = function() {
					if (currentAction === 0) {
						return false;
					}
					currentAction -= 1;
					return true;
				};
				this.addAction = function(obj) {
					actionList.push(obj);
				};
				this.add = function(Obj, name) {
					var obj = new Obj();
					obj.setTo(element);
					if (obj.element.style.display === '') {
						obj.element.style.display = 'block'
					}
					obj.updateDefaultParams({
						'x' : obj.x,
						'y' : obj.y,
						'width' : obj.width,
						'height' : obj.height,
						'display' : obj.element.style.display
					});
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
				this.hasNext = function() {
					if (currentScene === sceneList.length) {
						return false;
					} else {
						return true;
					}
				};
				this.next = function() {
					if (sceneList[currentScene].hasNext()) {
						sceneList[currentScene].next();
					} else {
						if (this.hasNext()) {
							currentScene += 1;
							return true;
						} else {
							return false;
						}
					};
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
					var obj = new Obj();
					sceneList.push(obj);
					obj.setTo(element);
					return obj;
				};
				this.removeScene = function() {

				};

			},

			Action : function() {
				this.play = function() {
					this.action();
				};

				this.reset = function() {

				};
			},

			Base : function() {

			}
		};
		Animate.tools.extend(objects.World, objects.Base);
		Animate.tools.extend(objects.Scene, objects.Base);
		Animate.tools.extend(objects.View, objects.Base);
		Animate.tools.extend(objects.CanvasView, objects.View);
		return objects;
	})();

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
			},
			action : function(action) {
				var Obj = function(){
					this.action = action;
				};
				Animate.tools.extend(Obj, Animate.core.Action);
				return new Obj();
			}
		};
		return objects;
	})();

	global.$A = Animate.fn;
	global.Animate = Animate;

})(this);
