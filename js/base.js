// @TODO スコープとか

(function(document){
	var Animate = {};

	// Models
	Animate.models = {
		
		/**
		 * 数値管理オブジェクト(モデル例)
		 */
		CountManager : function(){
			this.meta = 'CountManager';
			var count = 0,
			under = null,
			over = null
			this.incrCount = function(number){
				count += number;
			}
			this.decrCount = function(number){
				count -= number;
			}
			this.getCount = function(){
				return count;
			};
		}

	};
	
	/**
	 * Views
	 * One object one element
	 * テンプレートメソッドのような設計に
	 * このオブジェクト以外でDOM操作を行わない
	 */
	Animate.views = (function(document){
		var models =  Animate.models;

		// @TODO element.foo()の様にView内のメソッド呼べる用にする
		var objects = {
			WorldView : function(){
				this.set();
				var countManager = new models.CountManager();
				countManager.incrCount(1);
				this.createBox();
			},
		};

		return objects;
	})(document);
	
	/**
	 * CanvasViews
	 */
	Animate.canvasViews = (function(document){
		var models =  Animate.models;

		// @TODO element.foo()の様にView内のメソッド呼べる用にする
		var objects = {
			MainCanvasView : function(width, height){
				var that = this;
				this.set(width, height);
				this.drawFillTriangle(width/2, height/2, 60, '#3366ff');
				this.drawStrokeTriangle(width/2, height/2, 60, {color:'#cc6666', lineWidth:6});
				var i = 0;
				var draw = function(){
					that.clear();
					that.drawFillTriangle(i, height/2 + Math.cos(i*Math.PI / 180)*120, 60, '#3366ff');
					that.drawStrokeTriangle(i, height/2 + Math.cos(i*Math.PI / 180)*120, 60, {color:'#cc6666', lineWidth:6});
					i++;
					if(i>width){
						i = 0;
					}
				};
				setInterval(draw,10);
			}
		};

		return objects;
	})(document);

	/**
	 * ベースとなるオブジェクト群
	 */
	Animate.core = (function(){
		var objects = {

			View : function(element){
				// 初期化
				this.set = function(){
					document.getElementById('body').appendChild(element);
				};
				
				// elementに追加
				this.append = function(elem){
					element.appendChild(elem);
				};
				
				// box(DIV)を作成
				this.createBox = function(){
					var box = document.createElement('div');
					box.innerHTML = 'hoge';
					box.className = 'box'
					element.appendChild(box);
					return box;
				};

				// 表示させる
				this.display = function(){
				};

				// 見えないようにする
				this.hide = function(){
				};
			},

			CanvasView : function(element){

				var INSCRIBED_CIRCLE = 0.298;  // 正三角形の内接円の半径
				var CIRCUMCIRCLE = 0.577; // 正三角形の外接円の半径
				var context = element.getContext('2d');
				
				// elementの中身を初期化
				this.set = function(width, height){
					document.getElementById('body').appendChild(element);
					element.width = width;
					element.height = height;
				};

				// 正三角形の塗り
				this.drawFillTriangle = function (centerX, centerY, edge, color){
					context.fillStyle = color;
					context.beginPath();
					context.moveTo(centerX, centerY-(edge*CIRCUMCIRCLE));
					context.lineTo(centerX+(edge/2), centerY+(edge*INSCRIBED_CIRCLE));
					context.lineTo(centerX-(edge/2), centerY+(edge*INSCRIBED_CIRCLE));
					context.closePath();
					context.fill();
				};

				// 正三角形の線
				this.drawStrokeTriangle = function (centerX, centerY, edge, option){
					if(typeof option.color !== 'undefined') context.strokeStyle = option.color;
					if(typeof option.lineWidth !== 'undefined')context.lineWidth = option.lineWidth;
					context.beginPath();
					context.moveTo(centerX, centerY-(edge*CIRCUMCIRCLE));
					context.lineTo(centerX+(edge/2), centerY+(edge*INSCRIBED_CIRCLE));
					context.lineTo(centerX-(edge/2), centerY+(edge*INSCRIBED_CIRCLE));
					context.closePath();
					context.stroke();
			    };

				// 円の塗り
			    this.drawFillArc = function(centerX, centerY, redius, color){
					context.fillStyle = color;
					context.beginPath();
					context.arc(centerX, centerY, redius, 0, Math.PI*2, true);
					context.closePath();
					context.fill();
			    };

				// 円の線
			    this.drawStrokeArc = function(centerX, centerY, redius, option){
					if(typeof option.color !== 'undefined') context.strokeStyle = option.color;
					if(typeof option.lineWidth !== 'undefined')context.lineWidth = option.lineWidth;
					context.beginPath();
					context.arc(centerX, centerY, redius, 0, Math.PI*2, true);
					context.closePath();
					context.stroke();
			    };

				// 正方形の塗り
				this.drawFillRect = function(centerX, centerY, edge, color){
					context.fillStyle = color;
					context.beginPath();
					context.fillRect(centerX-edge/2, centerY-edge/2, edge,edge);
					context.closePath();
					context.fill();
			    };

				// 正方形の線
			    this.drawStrokeRect = function(centerX, centerY, edge, option){
					if(typeof option.color !== 'undefined') context.strokeStyle = option.color;
					if(typeof option.lineWidth !== 'undefined') context.lineWidth = option.lineWidth;
					context.beginPath();
					context.strokeRect(centerX-edge/2, centerY-edge/2, edge, edge);
					context.closePath();
					context.stroke();
			    };

				// 線を引く
			    this.drawStroke = function(posX1, posY1, posX2, posY2, option){
					if(typeof option.color !== 'undefined') context.strokeStyle = option.color;
					if(typeof option.lineWidth !== 'undefined') context.lineWidth = option.lineWidth;
					context.beginPath();
					context.moveTo(posX1, posY1);
					context.lineTo(posX2, posY2);
					context.closePath();
					context.stroke();
			    };

			    // キャンバス内消す
			    this.clear = function(){
			    	context.beginPath();
					context.clearRect(0, 0, element.width, element.height);
					context.closePath();
			    };

			},

			Scene : function(element){
			},

			Model : function(){
				this.meta = 'NotExtended';
			}

		};
		return objects;	
	})();

	/**
	 * アプリケーション全体に関わる関数など
	 */
	 Animate.fn = {

	 	//継承実装1
	 	update : function(dest, sources){
	 		for(var property in sources){
	 			dest[property] = sources[property];
	 		}
	 		return dest;
	 	},

	 	// 継承実装2
	 	extend : function(dest, sources){
	 		// @TODO 実装
	 		return this.update(dest, sources);
	 	},

	 	// 汎用的イベントハンドラ
	 	listenEvent : function(eventTarget, eventType, eventHandler){
		    if(eventTarget.addEventListener){
				eventTarget.addEventListener(eventType,eventHandler,false);
			}else if(eventTarget.attachEvent){
				eventType = "on" + eventType;
				eventTarget.attachEvent(eventType,eventHandler);
			}else{
				eventTarget["on" + eventType] = eventHandler;
			}
		}
	 };
	 
	 Animate.tools = (function(){
	 	var objects = {
	 	};
	 	return objects;
	 })();

	 /**
	  *  独自イベントハンドラ
	  */
	 Animate.events = (function(document){
	 	var objects = {
	 	};
	 	return objects;
	 })(document);
	 
	 /**
	  * 外部ライブラリ関連
	  */
	  Animate.lib = (function(){
	  	var objects = {
	  	};
	  	return objects;
	  })();
	
	/**
	 * 最初に初期化する関数
	 */
	Animate.init = function(document){
		for(key in this.views){
			var klass = this.views[key];
			var element = document.createElement('div');
			klass.prototype = new this.core.View(element);
		}
		for(key in this.canvasViews){
			var klass = this.canvasViews[key];
			var element = document.createElement('canvas');
			klass.prototype = new this.core.CanvasView(element);
		}
		for(key in this.models){
			var klass = this.models[key];
			klass.prototype = new this.core.Model();
		}
	};

	// Controllers
	(function(){
		Animate.init(document);
		var views = Animate.views;
		var canvasViews = Animate.canvasViews;
		var world = new views.WorldView();
		var main_canvas = new canvasViews.MainCanvasView(600,600);
	})();
	
})(window.document);