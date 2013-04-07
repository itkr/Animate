(function(global) {

	var document = global.document;
	var Animate = {};

	Animate.defaultSettings = {
		"world" : {
			"width" : 800,
			"height" : 600,
		},
		"scene" : {
			"width" : 800,
			"height" : 600,
		},
		"view" : {

		},
		"canvas" : {

		},
		"text" : {
			"fontFamily" : '"arial black"',
			"color" : "#6699cc",
			"fontSize" : 40,
		}
	};

	Animate.tree = {
		"Base" : {
			"World" : {},
			"Scene" : {},
			"Action" : {},
			"View" : {
				"TextView" : {},
				"CanvasView" : {
					"Sprite" : {}
				}
			}
		}
	}

	/**
	 * アプリケーション全体に関わる関数など
	 */
	Animate.tools = {

		// オブジェクトを継承させる
		extend : function(Child, Parent) {
			var NewParent = Parent;
			if ( typeof Parent.prototype.parent !== "undefined") {
				NewParent = Animate.tools.extend(Parent, Parent.prototype.parent);
			}
			Child.prototype = new NewParent();
			Child.prototype.parent = NewParent;
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
		},

		// オブジェクトの継承関係を適用する
		applyTree : function(objects, tree) {
			for (parent in tree) {
				for (child in tree[parent]) {
					Animate.tools.extend(objects[child], objects[parent]);
				}
				Animate.tools.applyTree(objects, tree[parent]);
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
				var alpha = 100;
				this.element = document.createElement('div');
				this.element.setAttribute('class', 'view');

				this.__defineGetter__("alpha", function() {
					return alpha;
				});

				this.__defineSetter__("alpha", function(_alpha) {
					alpha = _alpha;
					this.element.style.opacity = '0.' + alpha;
					this.element.style.filter = 'alpha(opacity=' + alpha + ')';
					this.element.style.MozOpacity = '0.' + alpha;
					this.element.style.MsFilter = '"alpha(opacity=' + alpha + ')"';
				});

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
					if (currentHistory >= histry.length - 1) {
						return false;
					}
					return true;
				}

				this.snapShot = function(params) {
					var objParams = {};
					objParams.x = ( typeof params.x !== 'undefined') ? params.x : this.x;
					objParams.y = ( typeof params.y !== 'undefined') ? params.y : this.y;
					objParams.width = ( typeof params.width !== 'undefined') ? params.width : this.width;
					objParams.height = ( typeof params.height !== 'undefined') ? params.height : this.height;
					objParams.display = ( typeof params.display !== 'undefined') ? params.display : this.display;
					return objParams;
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

				this.resize = function(magnification) {
					this.width *= magnification;
					this.heigth *= magnification;
				};

			},

			TextView : function() {
				var that = this;
				var text = '';
				this.element = document.createElement('div');

				this.__defineGetter__("fontFamily", function() {
					return this.element.style.fontFamily;
				});
				this.__defineSetter__("fontFamily", function(fontFamily) {
					this.element.style.fontFamily = fontFamily;
				});
				this.__defineGetter__("color", function() {
					return this.element.style.color;
				});
				this.__defineSetter__("color", function(color) {
					this.element.style.color = color;
				});
				this.__defineGetter__("fontSize", function() {
					return parseInt(this.element.style.fontSize.replace("px", ""), 10);
				});
				this.__defineSetter__("fontSize", function(fontSize) {
					this.element.style.fontSize = fontSize + 'px';
				});
				this.setText = function(_text) {
					text = _text;
					this.element.innerHTML = _text;
					return this;
				};

				this.resize = function(magnification) {
					this.width *= magnification;
					this.heigth *= magnification;
					this.fontSize *= magnification;
				};

				this.applySettings('text');
			},

			CanvasView : function() {
				var INSCRIBED_CIRCLE = 0.298;
				var CIRCUMCIRCLE = 0.577;
				var that = this;
				this.element = document.createElement('canvas');
				var context = this.element.getContext('2d');

				this.element.setAttribute('class', 'canvasView');

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

				this.clear = function() {
					context.beginPath();
					context.clearRect(0, 0, element.width, element.height);
					context.closePath();
				};

				// this.applySettings('canvas');

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
				var active = false;
				var that = this;
				var element = document.createElement('div');
				element.setAttribute('class', 'scene');
				this.element = element;

				this.style = element.style;

				this.__defineGetter__("alpha", function() {
					return alpha;
				});
				this.__defineSetter__("alpha", function(_alpha) {
					alpha = _alpha;
					element.style.opacity = '0.' + alpha;
					element.style.filter = 'alpha(opacity=' + alpha + ')';
					element.style.MozOpacity = '0.' + alpha;
					element.style.MsFilter = '"alpha(opacity=' + alpha + ')"';
				});
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
				this.setTo = function(parent_element) {
					parent_element.appendChild(element);
				};

				var saveViewsParams = function() {
					for (var i = 0; i < viewList.length; i++) {
						viewList[i].next();
					}
				};

				var playCurrentAction = function() {
					saveViewsParams();
					if (actionList.length !== 0) {
						actionList[currentAction].play();
					}
				};

				this.hasNext = function() {
					if (actionList.length === 0) {
						// アクションが指定されていない
						return false;
					}
					if (actionList[currentAction].isPlayable()) {
						// 現在のアクションが実行可能
						return true;
					}
					if (currentAction >= actionList.length - 1) {
						// リストに次がない
						return false;
					} else {
						// リストに次がある
						return true;
					}
				};
				this.next = function() {
					playCurrentAction();
					if (this.hasNext()) {
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
					if (!actionList[currentAction].isPlayable()) {
						// Sceneが変わったとき
						actionList[currentAction].reset();
					} else {
						currentAction -= 1;
						actionList[currentAction].reset();
					}
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

				this.isActive = function() {
					return active;
				};

				this.activation = function() {
					active = true;
					this.show();
				};

				this.deactivation = function() {
					active = true;
					this.hide();
				};

				this.show = function() {
					element.style.display = 'block';
					return this;
				};

				this.hide = function() {
					element.style.display = 'none';
					return this;
				};

				this.resize = function(magnification) {
					var i;
					for ( i = 0; i < viewList.length; i++) {
						viewList[i].resize(magnification);
					}
					this.width *= magnification;
					this.height *= magnification;
				};

				this.applySettings('scene');
			},

			World : function(element) {
				var currentScene = 0, sceneList = [], locked = false;
				var that = this;

				var switchScene = function(beforScene, afterScene, animationType, isRivers) {
					that.lock();
					var bgcolor = 255;
					var anim = setInterval(function() {
						bgcolor -= 50;
						beforScene.style.backgroundColor = 'rgb(' + bgcolor + ',' + bgcolor + ',' + bgcolor + ')';
						if (bgcolor <= 0) {
							clearInterval(anim);
							bgcolor = 255;
							beforScene.style.backgroundColor = 'rgb(' + bgcolor + ',' + bgcolor + ',' + bgcolor + ')';
							beforScene.deactivation();
							afterScene.activation();
							that.unLock();
						}
					}, 100);
				};

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

				this.lock = function() {
					locked = true;
				};

				this.unLock = function() {
					locked = false;
				};

				this.isLocked = function() {
					return locked;
				};

				this.hasNext = function() {
					if (currentScene >= sceneList.length - 1) {
						return false;
					} else {
						return true;
					}
				};
				this.next = function() {
					if (!this.isLocked()) {
						if (sceneList[currentScene].hasNext()) {
							sceneList[currentScene].next();
						} else {
							if (this.hasNext()) {
								switchScene(sceneList[currentScene], sceneList[currentScene + 1])
								currentScene += 1;
								return true;
							} else {
								return false;
							}
						}
					}
				};
				this.prev = function() {
					if (!this.isLocked()) {
						if (sceneList[currentScene].prev() === false) {
							if (currentScene === 0) {
								return false;
							}
							switchScene(sceneList[currentScene], sceneList[currentScene - 1])
							currentScene -= 1;
							return true;
						}
						return false;
					}
				};
				this.addScene = function(Obj) {
					Animate.tools.extend(Obj, Animate.core.Scene)
					var obj = new Obj();
					if (sceneList.length !== 0) {
						obj.hide();
					}
					sceneList.push(obj);
					obj.setTo(element);
					return obj;
				};
				this.removeScene = function() {

				};
				this.resize = function(magnification) {
					var i;
					for ( i = 0; i < sceneList.length; i++) {
						sceneList[i].resize(magnification);
					}
					this.width *= magnification;
					this.heigth *= magnification;
				};

				this.applySettings('world');
			},

			Action : function() {
				var playable = true;

				this.isPlayable = function() {
					return playable;
				};

				this.play = function() {
					if (this.isPlayable()) {
						this.action();
						playable = false;
					}
				};

				this.reset = function() {
					playable = true;
				};
			},

			Base : function() {
				this.applySettings = function(objType) {
					var setting = this.settings[objType];
					for (key in setting) {
						this[key] = setting[key];
					}
				}
			}
		};
		Animate.tools.applyTree(objects, Animate.tree);
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
			init : function(element, settings) {
				if ( typeof settings === 'undefined') {
					settings = Animate.defaultSettings;
				}
				Animate.core.Base.prototype.settings = settings;
				return new Animate.core.World(element);
			},
			view : function(Obj) {
				return Animate.tools.extend(Obj, Animate.core.View);
			},
			canvas : function(Obj) {
				return Animate.tools.extend(Obj, Animate.core.CanvasView);
			},
			text : function(Obj) {
				return Animate.tools.extend(Obj, Animate.core.TextView);
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
