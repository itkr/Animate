// Models

Animate.core.Model = function() {
	this.meta = 'NotExtended';
};

Animate.models = (function() {
	var objects = {
		/**
		 * 数値管理オブジェクト(モデル例)
		 */
		CountManager : function() {
			this.meta = 'CountManager';
			var count = 0, under = null, over = null
			this.incrCount = function(number) {
				count += number;
			}
			this.decrCount = function(number) {
				count -= number;
			}
			this.getCount = function() {
				return count;
			};
		}
	};
	for (key in objects) {
		var klass = objects[key];
		klass.prototype = new Animate.core.Model();
	}
	return objects
})();
