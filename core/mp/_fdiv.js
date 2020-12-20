/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 多倍長浮動小数点数同士の除算
// 除数bが0のときはtrueを返す。
_MultiPrec.prototype.fdiv = function( ret/*Array*/, a/*Array*/, b/*Array*/, prec ){
	a = this._clone( a );
	b = this._clone( b );

	var p = this._matchPrec( a, b );
	var k = b[0] < 0 ? -1 : 1;
	var l = this._getLen( b );
	var i;
	for( i = l; i > 0; i-- ){
		if( b[i] != 0 ){ break; }
	}
	if( i == 0 ){ return true; }
	if( i != l ){
		p -= (l - i) * _MP_DIGIT;
		this._setPrec( a, p );
		this._setPrec( b, p );
		this._setLen( b, i * k );
	}

	var q = new Array();
	var r = new Array();
	this.div( q, a, b, r );
	var t = this._fmul( q, prec );
	this._fmul( r, prec );
	if( t > 0 ){
		var k = new Array();
		this._fcoef( k, t );
		this.mul( q, q, k );
		this.mul( r, r, k );
	}
	this.div( r, r, b );
	this.add( ret, q, r );
	this._setPrec( ret, prec );
	return false;
};
