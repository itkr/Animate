(function(global) {

	var document = global.document;
	var Animate = {};

	// TODO スタイルを継承させてデザインテーマ部分はcssに任せる
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
		"text" : {
			"fontFamily" : '"arial black"',
			"color" : "#6699cc",
			"fontSize" : 30,
		},
		"title" : {
			"color" : "#3366ff",
			"fontSize" : 50,
		},
		"sentence" : {

		},
		"section" : {

		},
	};

	Animate.tree = {
		"Base" : {
			"World" : {},
			"Scene" : {},
			"View" : {
				"TextView" : {
					"TitleTextView" : {},
					"SentenceTextView" : {}
				},
				"SectionView" : {},
				"ImageView" : {}
			},
			"Action" : {},
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
		},

		// 参考
		// https://gist.github.com/ryan-blunden/1495692
		// ryan-blunden's "addClass.js"
		addClass : function(element, newClassName) {
			var className = element.className;
			var classes = newClassName.split(' ');
			var i = classes.length;
			while (i--) {
				className = (className.match(new RegExp('\\b' + classes[i] + '\\b')) === null ? className + ' ' + classes[i] : className);
			}
			element.className = className;
			return element;
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
				this.element = document.createElement('div');
				Animate.tools.addClass(this.element, 'View');

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
				Animate.tools.addClass(this.element, 'TextView');

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
					this.element.innerHTML = _text;
					return this;
				};

				this.resize = function(magnification) {
					this.width *= magnification;
					this.heigth *= magnification;
					this.fontSize *= magnification;
				};

			},

			TitleTextView : function() {
				this.element = document.createElement('h1');
				Animate.tools.addClass(this.element, 'TitleTextView');
			},

			SentenceTextView : function() {
				this.element = document.createElement('p');
				Animate.tools.addClass(this.element, 'SentenceTextView');
			},

			SectionView : function() {
				this.element = document.createElement('section');
				Animate.tools.addClass(this.element, 'SectionView');

				this.add = function(obj) {
					this.element.appendChild(obj.element);
					return this;
				};
			},

			ImageView : function() {
				this.element = document.createElement('img');
				Animate.tools.addClass(this.element, 'ImageView');
			},

			Scene : function() {
				var currentAction = 0;
				var actionList = [];
				var viewList = [];
				var active = false;
				var that = this;
				this.element = document.createElement('div');
				Animate.tools.addClass(this.element, 'Scene');
				this.style = this.element.style;

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

				this.add = function(obj) {
					if (obj.element.style.display === '') {
						obj.display = true;
					}
					this.element.appendChild(obj.element);
					viewList.push(obj);
					return obj;
				};

				this.isActive = function() {
					return active;
				};

				this.activation = function() {
					active = true;
					this.show();
				};

				this.deactivation = function() {
					active = false;
					this.hide();
				};

				this.show = function() {
					this.element.style.display = 'block';
					return this;
				};

				this.hide = function() {
					this.element.style.display = 'none';
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

			},

			World : function(element) {
				var currentScene = 0;
				var sceneList = [];
				var locked = false;
				var that = this;

				var switchScene = function(beforScene, afterScene, animationType, isRivers) {
					that.lock();
					var alpha = 100;
					var anim = setInterval(function() {
						alpha -= 20;
						beforScene.alpha = alpha;
						if (alpha <= 0) {
							clearInterval(anim);
							beforScene.alpha = 100;
							beforScene.deactivation();
							afterScene.activation();
							that.unLock();
						}
					}, 100);
				};

				this.element = element;
				Animate.tools.addClass(this.element, 'World');
				// this.element.setAttribute('class', 'World');

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
					obj.applySettings(obj.settings['scene']);
					if (sceneList.length !== 0) {
						obj.hide();
					}
					sceneList.push(obj);
					this.element.appendChild(obj.element);
					return obj;
				};

				this.resize = function(magnification) {
					var i;
					for ( i = 0; i < sceneList.length; i++) {
						sceneList[i].resize(magnification);
					}
					this.width *= magnification;
					this.heigth *= magnification;
				};

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
				var alpha = 100;
				this.applySettings = function(styles) {
					for (key in styles) {
						this[key] = styles[key];
					}
				};

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

				this.__defineGetter__("alpha", function() {
					return alpha;
				});

				this.__defineSetter__("alpha", function(_alpha) {
					alpha = _alpha;
					if (_alpha >= 100) {
						this.element.style.opacity = '1';
						this.element.style.MozOpacity = '1';
					} else {
						this.element.style.opacity = '0.' + alpha;
						this.element.style.MozOpacity = '0.' + alpha;
					}
					this.element.style.filter = 'alpha(opacity=' + alpha + ')';
					this.element.style.MsFilter = '"alpha(opacity=' + alpha + ')"';
				});
			}
		};
		// Animate.tools.applyTree(objects, Animate.tree);
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
				var world;
				Animate.tools.applyTree(Animate.core, Animate.tree);
				if ( typeof settings === 'undefined') {
					settings = Animate.defaultSettings;
				}
				Animate.core.Base.prototype.settings = settings;
				world = new Animate.core.World(element);
				world.applySettings(world.settings['world']);
				return world;
			},

			view : function(Obj) {
				var Obj = Animate.tools.extend(Obj, Animate.core.View);
				var obj = new Obj();
				obj.applySettings(obj.settings['view']);
				return obj;
			},

			text : function(Obj) {
				var Obj = Animate.tools.extend(Obj, Animate.core.TextView);
				var obj = new Obj();
				obj.applySettings(obj.settings['view']);
				obj.applySettings(obj.settings['text']);
				return obj;
			},

			title : function(Obj) {
				var Obj = Animate.tools.extend(Obj, Animate.core.TitleTextView);
				var obj = new Obj();
				obj.applySettings(obj.settings['view']);
				obj.applySettings(obj.settings['text']);
				obj.applySettings(obj.settings['title']);
				return obj;
			},

			sentence : function(Obj) {
				var Obj = Animate.tools.extend(Obj, Animate.core.SentenceTextView);
				var obj = new Obj();
				obj.applySettings(obj.settings['view']);
				obj.applySettings(obj.settings['text']);
				obj.applySettings(obj.settings['sentence']);
				return obj;
			},

			section : function(Obj) {
				var Obj = Animate.tools.extend(Obj, Animate.core.SectionView);
				var obj = new Obj();
				obj.applySettings(obj.settings['section']);
				return obj;
			},

			model : function(Obj) {
				var Obj = Animate.tools.extend(Obj, Animate.core.Model);
				var obj = new Obj();
				return obj;
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
