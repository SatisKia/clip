/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 多倍長浮動小数点数同士の除算
// 除数bが0のときはtrueを返す。
// digitには、被除数aの整数部の桁数が格納される。
_MultiPrec.prototype.fdiv2 = function( ret/*Array*/, a/*Array*/, b/*Array*/, prec, digit/*_Integer*/ ){
	a = this.clone( a );
	b = this.clone( b );

	if( digit == undefined ){
		digit = new _Integer();
	}

	var P = this.getPrec( a );

	/*
	 * 被除数の整数部の桁数を求める
	 */
	var l = this.getLen( a );
	var k = 10;
	var i;
	for( i = 1; i <= _MP_DIGIT; i++ ){
		if( a[l] < k ){ break; }
		k *= 10;
	}
	digit.set( ((l - 1) * _MP_DIGIT + i) - P );

	if( prec < digit.val() ){
		prec = digit.val();
	}

	/*
	 * bb = 1 / b
	 */
	var bb = new Array();
	var aa = new Array();
	this._setLen( aa, 1 ); aa[1] = 1;
	var p = this._matchPrec( aa, b );
	var k = b[0] < 0 ? -1 : 1;
	var l = this.getLen( b );
	var i;
	for( i = l; i > 0; i-- ){
		if( b[i] != 0 ){ break; }
	}
	if( i == 0 ){ return true; }
	if( i != l ){
		p -= (l - i) * _MP_DIGIT;
		this._setPrec( aa, p );
		this._setPrec( b, p );
		this._setLen( b, i * k );
	}
	var q = new Array();
	var r = new Array();
	this.div( q, aa, b, r );
	p = prec * 2 + 1;	// 精度を保つために桁数を増やす
	var t = this._fmul( q, p );
	this._fmul( r, p );
	if( t > 0 ){
		var k = new Array();
		this._fcoef( k, t );
		this.mul( q, q, k );
		this.mul( r, r, k );
	}
	this.div( r, r, b );
	if( this.getLen( a ) == 1 && a[1] == 1 ){
		this.add( ret, q, r );
		if( a[0] < 0 ){ ret[0] = -ret[0]; }
		this._setPrec( ret, p );
		return false;
	} else {
		this.add( bb, q, r );
		this._setPrec( bb, p );
	}

	/*
	 * ret = a * bb
	 */
	this.mul( ret, a, bb );
	p += P;
	var n = _INT( (p - (prec + _MP_DIGIT)) / _MP_DIGIT );
	if( n > 0 ){
		p -= n * _MP_DIGIT;
		this._fdiv( ret, n );
	}
	this._setPrec( ret, p );

	return false;
};
