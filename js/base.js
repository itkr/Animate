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
				var countManager = new models.CountManager();
				this.set(countManager.getCount());
				this.createBox();
			},
		};

		return objects;
	})(document);
	
	/**
	 * ベースとなるオブジェクト群
	 */
	Animate.core = (function(){
		var objects = {

			View : function(element){
				this.set = function(elem){
					element.innerHTML = elem;
				};
				this.append = function(elem){
					element.appendChild(elem);
				};
				this.createBox = function(){
					var box = document.createElement('div');
					box.innerHTML = 'hoge';
					box.className = 'box'
					element.appendChild(box);
					return box;
				};
				this.display = function(){
				
				};
			},

			Model : function(){
				this.meta = 'NotExtended';
			},

		};
		return objects;	
	})();
	
	/**
	 *
	 */
	 Animate.fn = {
	 	extend : function(){
	 		// @TODO 実装
	 	}
	 };
	 
	 /**
	  *
	  */
	 Animate.events = (function(document){
	 	var objects = {
	 	
	 	};
	 	return objects;
	 })(document);
	
	/**
	 * 最初に初期化する関数
	 */
	Animate.init = function(document){
		// @TODO extend()関数使う
		for(key in this.views){
			var view = this.views[key];
			view.prototype = new this.core.View(document.getElementById(key));
		}
		for(key in this.models){
			var model = this.models[key];
			model.prototype = new this.core.Model();
		}
	};

	// Controllers
	(function(){
		Animate.init(document);
		var views = Animate.views;
		var world = new views.WorldView();
	})();
	
})(window.document);
