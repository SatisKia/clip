/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 多倍長浮動小数点数の平方根
// aが負の値の場合trueを返す。
_MultiPrec.prototype.fsqrt3 = function( ret/*Array*/, a/*Array*/, prec ){
	a = this.clone( a );
	var t = prec * 2 - this.getPrec( a );
	var u;
	if( t > 0 ){
		if( (u = this._fmul( a, t )) > 0 ){
			var k = new Array();
			this._fcoef( k, u ); this.mul( a, a, k );
		}
	} else if( t < 0 ){
		u = _ABS( t );
		var n;
		if( (n = _DIV( u, _MP_DIGIT )) > 0 ){
			u -= n * _MP_DIGIT;
			this._fdiv( a, n );
		}
		var k = new Array();
		this._fcoef( k, u ); this.div( a, a, k );
	}
	if( a[this.getLen( a )] == 0 ){
		this._setLen( a, this.getLen( a ) - 1 );
	}
	var r = this.sqrt( ret, a );
	this._setPrec( ret, prec );
	return r;
};
