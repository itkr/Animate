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
		},
		
	};
	
	/**
	 * Views
	 * One object one element
	 * テンプレートメソッドのような設計に
	 * このオブジェクト以外でDOM操作を行わない
	 */
	Animate.views = (function(document){

		var objects = {
			WorldView : function(){
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
				this.set = function(innerElement){
					element.innerHTML = innerElement;
				};
				this.createBox = function(){
					
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
	 };
	 
	 /**
	  *
	  */
	 Animate.events = {
	 };
	
	/**
	 * 最初に初期化する関数
	 */
	Animate.init = function(document){
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
		
		var models =  Animate.models;
		var views = Animate.views;
		
		var countManager = new models.CountManager();
		var world = new views.WorldView();
		
		world.set(countManager.getCount());
	})();
	
})(window.document);
