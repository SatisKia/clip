/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// ブール値の受け渡し用
function _Boolean( val ){
	this._val = (val == undefined) ? false : (val == true);
}

_Boolean.prototype = {
	set : function( val ){
		this._val = (val == true);
		return this;
	},
	val : function(){
		return this._val;
	}
};

function newBooleanArray( len ){
	var a = new Array( len );
	for( var i = 0; i < len; i++ ){
		a[i] = new _Boolean();
	}
	return a;
}
