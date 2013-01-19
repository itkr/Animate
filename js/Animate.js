(function(global) {
	// @TODO ViewとCanvasViewなどで共通するメソッドを統一

	var document = global.document;
	var Animate = {};

	/**
	 * アプリケーション全体に関わる関数など
	 */
	Animate.tools = {

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
				var history = [];
				var currentHistory = 0;
				var element = document.createElement('div');
				element.setAttribute('class', 'view');
				this.element = element;

				this.__defineGetter__("width", function() {
					return parseInt(this.element.style.width.replace("px", ""), 10);
				});
				this.__defineSetter__("width", function(width) {
					this.element.width = width;
					this.element.style.width = width + 'px';
				});
				this.__defineGetter__("height", function() {
					return parseInt(this.element.style.height.replace("px", ""), 10);
				});
				this.__defineSetter__("height", function(height) {
					this.element.height = height;
					this.element.style.height = height + 'px';
				});
				this.__defineGetter__("x", function() {
					return parseInt(this.element.style.left.replace("px", ""), 10);
				});
				this.__defineSetter__("x", function(x) {
					this.element.style.left = x + 'px';
				});
				this.__defineGetter__("y", function() {
					return parseInt(this.element.style.top.replace("px", ""), 10);
				});
				this.__defineSetter__("y", function(y) {
					this.element.style.top = y + 'px';
				});
				this.__defineGetter__("display", function() {
					return this.element.style.display === "block";
				});
				this.__defineSetter__("display", function(display) {
					if (display) {
						this.element.style.display = "block";
					} else {
						this.element.style.display = "none";
					}
				});

				this.setTo = function(parent_element) {
					parent_element.appendChild(this.element);
					return this;
				};

				this.text = function(text) {
					this.element.innerHTML = text;
					return this;
				};

				// 表示させる
				this.show = function() {
					this.display = true;
					return this;
				};

				// 見えないようにする
				this.hide = function() {
					this.display = false;
					return this;
				};

				this.hasNext = function() {
					if (currentHistory + 1 === histry.length) {
						return false;
					}
					return true;
				}

				this.snapShot = function(params) {
					var fixParams = {};
					// javascriptに三項演算子ってあるんだっけ？
					if ( typeof params.x !== 'undefined') {
						fixParams.x = params.x;
					} else {
						fixParams.x = this.x;
					}
					if ( typeof params.y !== 'undefined') {
						fixParams.y = params.y;
					} else {
						fixParams.y = this.y;
					}
					if ( typeof params.width !== 'undefined') {
						fixParams.width = params.width;
					} else {
						fixParams.width = this.width;
					}
					if ( typeof params.height !== 'undefined') {
						fixParams.height = params.height;
					} else {
						fixParams.height = this.height
					}
					if ( typeof params.display !== 'undefined') {
						fixParams.display = params.display;
					} else {
						fixParams.display = this.display;
					}
					return fixParams;
				};

				this.next = function() {
					if (currentHistory === history.length) {
						history.push(this.snapShot({}));
					}
					currentHistory += 1;
				};

				this.prev = function() {
					if (currentHistory === 0) {
						return false;
					}
					currentHistory -= 1;
					this.x = history[currentHistory].x;
					this.y = history[currentHistory].y;
					this.width = history[currentHistory].width;
					this.height = history[currentHistory].height;
					this.display = history[currentHistory].display;
				};

				this.reset = function() {
					this.x = history[0].x;
					this.y = history[0].y;
					this.width = history[0].width;
					this.height = history[0].height;
					this.display = history[0].display;
					currntHistory = 0;
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
				var currentAction = 0;
				var actionList = [];
				var viewList = [];
				var that = this;
				var element = document.createElement('div');
				element.setAttribute('class', 'scene');
				this.setTo = function(parent_element) {
					parent_element.appendChild(element);
				};

				//TODO これをするとどんどんHistoryが更新されてしまう！！要修正
				this.saveViewsParams = function() {
					for (var i = 0; i < viewList.length; i++) {
						viewList[i].next();
					}
				}
				this.hasNext = function() {
					if (currentAction === actionList.length) {
						return false;
					} else {
						return true;
					}
				};
				this.next = function() {
					if (this.hasNext()) {
						this.saveViewsParams();
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
					for (var i = 0; i < viewList.length; i++) {
						viewList[i].prev();
					}
					currentAction -= 1;
					return true;
				};
				this.addAction = function(obj) {
					actionList.push(obj);
				};
				this.add = function(Obj) {
					var obj = new Obj();
					if (obj.element.style.display === '') {
						obj.display = true;
					}
					obj.setTo(element);
					viewList.push(obj);
					return obj;
				};
				this.remove = function() {

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
					if (sceneList[currentScene].prev() === false) {
						if (currentScene === 0) {
							return false;
						}
						currentScene -= 1;
						return true;
					}
					return false;
				};
				this.addScene = function(Obj) {
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
				var Obj = function() {
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
