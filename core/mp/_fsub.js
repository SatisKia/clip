/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 多倍長浮動小数点数同士の減算
_MultiPrec.prototype.fsub = function( ret/*Array*/, a/*Array*/, b/*Array*/ ){
	a = this.clone( a );
	b = this.clone( b );
	var p = this._matchPrec( a, b );
	this.sub( ret, a, b );
	this._setPrec( ret, p );
};
