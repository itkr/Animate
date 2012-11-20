(function(document){
	var ITKR_ANIM = {};

	// Models
	ITKR_ANIM.models = {
		
		/**
		 * 数値管理オブジェクト(モデル例)
		 */
		CountManager : function(){
		
			this.meta = 'CountManager';
			
			// 管理する数値
			var count = 0;
			
			// 下限
			var under = null;
			
			// 上限
			var over = null;		
			
			// 数値の増加
			this.incrCount = function(number){
				count += number;
			}
			
			// 数値の減少
			this.decrCount = function(number){
				count -= number;
			}
			
			// カウントの取得
			// @TODO（あとでアクセサメソッドにする）
			this.getCount = function(){
				return count;
			}	
		},
		
	};
	
	/**
	 * Views
	 * One object one element
	 * テンプレートメソッドのような設計にする(TODO)
	 * このオブジェクト以外でDOM操作を行わない
	 */
	ITKR_ANIM.views = (function(document){
	
		// @TODO 汎用的に使えるメソッドをベースオブジェクトにまとめてコンクリートオブジェクトで継承する
		
		// デバッグ用
		//var puts = function(str){
		//	var element = $('console');
		//	element.innerHTML = str + '<br>' + element.innerHTML;
		//};
		
		var objects = {
			WorldView : function(){
				var element = this.$('world');
				this.set = function(innerElement){
					element.innerHTML = innerElement;
				};
			},
		};
		return objects;

	})(document);
	
	/**
	 * ベースとなるオブジェクト群
	 */
	ITKR_ANIM.core = {
		View : function(document){
			this.$ = function(id){
				return document.getElementById(id);
			};
		},
		Model : function(){
			this.meta = 'NotExtended'
		},
	};
	
	/**
	 * 最初に初期化する関数
	 */
	ITKR_ANIM.init = function(document){
		for(key in this.views){
			this.views[key].prototype = new this.core.View(document);
		}
		for(key in this.models){
			this.models[key].prototype = new this.core.Model();
		}
	};
	
	// Controllers
	(function(){
		ITKR_ANIM.init(document);
		
		var models =  ITKR_ANIM.models;
		var views = ITKR_ANIM.views;
		
		var countManager = new models.CountManager();
		var world = new views.WorldView();
		
		world.set(countManager.getCount());
	})();
	
})(document);
