/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 汎用オブジェクトの受け渡し用
function _Void( obj ){
	this._obj = (obj == undefined) ? null : obj;
}

_Void.prototype = {
	set : function( obj ){
		this._obj = obj;
		return this;
	},
	obj : function(){
		return this._obj;
	}
};

function newVoidArray( len ){
	var a = new Array( len );
	for( var i = 0; i < len; i++ ){
		a[i] = new _Void();
	}
	return a;
}
