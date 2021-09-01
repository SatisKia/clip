/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 時間計測
function _MeasureTime(){
	this._min   = Number.MAX_VALUE;
	this._max   = 0;
	this._total = 0;
}

_MeasureTime.prototype = {
	run : function( func ){
		var startTime = (new Date()).getTime();
		var ret = func();
		var time = (new Date()).getTime() - startTime;
		if( this._min > time ){
			this._min = time;
		}
		if( this._max < time ){
			this._max = time;
		}
		this._total += time;
		return ret;
	},
	min : function(){
		return this._min;
	},
	max : function(){
		return this._max;
	},
	total : function(){
		return this._total;
	}
};
