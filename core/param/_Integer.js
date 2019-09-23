/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 整数値の受け渡し用
function _Integer( val ){
	this._val = (val == undefined) ? 0 : _INT( val );
}

_Integer.prototype = {
	set : function( val ){
		this._val = _INT( val );
		return this;
	},
	add : function( val ){
		this._val += _INT( val );
		return this;
	},
	val : function(){
		return this._val;
	}
};

function newIntegerArray( len ){
	var a = new Array( len );
	for( var i = 0; i < len; i++ ){
		a[i] = new _Integer();
	}
	return a;
}
