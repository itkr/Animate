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

	// Views
	// 1 Object 1 Element
	ITKR_ANIM.Views = {
	
	};

	// Controllers
	(function(document){
		var models =  ITKR_ANIM.Models;
		var countManager = new models.CountManager();
		alert(countManager.getCount());
	})(document);
	
})(document);
