/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 多倍長浮動小数点数同士の乗算
_MultiPrec.prototype.fmul = function( ret/*Array*/, a/*Array*/, b/*Array*/, prec ){
	a = this.clone( a );
	b = this.clone( b );

	this.mul( ret, a, b );
	var p = this.getPrec( a ) + this.getPrec( b );
	var n = _INT( (p - (prec + _MP_DIGIT)) / _MP_DIGIT );
	if( n > 0 ){
		p -= n * _MP_DIGIT;
		this._fdiv( ret, n );
	}
	this._setPrec( ret, p );
};
