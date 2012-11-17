(function(document){
	var ITKR_ANIM = {};

	// Models
	ITKR_ANIM.Models = {
		
		/**
		 * 数値管理オブジェクト
		 */
		CountManager : function(){
			
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
		} //,
		
	};
	
	/**
	 * Views
	 * One object one element
	 * テンプレートメソッドのような設計
	 * このオブジェクト以外でDOM操作を行わない
	 */
	ITKR_ANIM.Views = function(document){
	
		// @TODO 汎用的に使えるメソッドをベースオブジェクトにまとめてコンクリートオブジェクトで継承する

		// ---- 操作関数 ----		
		// エレメント取得簡略化
		var $ = function(id){
			return document.getElementById(id);
		};
		
		// デバッグ用
		var puts = function(str){
			var element = $('console');
			element.innerHTML = str + '<br>' + element.innerHTML;
		};
		
		// ---- DOM ----
		// メインエレメント
		this.WorldView = function(){
			var element = $('world');
			this.set = function(innerElement){
				element.innerHTML = innerElement;
			};
		};


	};
	
	// Controllers
	(function(){
		var models =  ITKR_ANIM.Models;
		// @TODO newしない設計にする
		var views = new ITKR_ANIM.Views(document);
		
		var countManager = new models.CountManager();
		var world = new views.WorldView();
		world.set('set');
	})();
	
})(document);
