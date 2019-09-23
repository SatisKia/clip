/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 浮動小数点数値の受け渡し用
function _Float( val ){
	this._val = (val == undefined) ? 0.0 : val;
}

_Float.prototype = {
	set : function( val ){
		this._val = val;
		return this;
	},
	add : function( val ){
		this._val += val;
		return this;
	},
	val : function(){
		return this._val;
	}
};

function newFloatArray( len ){
	var a = new Array( len );
	for( var i = 0; i < len; i++ ){
		a[i] = new _Float();
	}
	return a;
}
