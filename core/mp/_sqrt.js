/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 多倍長整数の平方根
// aが負の値の場合trueを返す。
_MultiPrec.prototype.sqrt = function( x/*Array*/, a/*Array*/ ){
	a = this.clone( a );

	this._setLen( x, 0 );
	if( a[0] < 0 ){ return true; }
	var la = this.getLen( a );
	if( la == 0 ){ return false; }
	if( la == 1 ){
		this._setLen( x, 1 );
		x[1] = _INT( _SQRT( a[1] ) );
		return false;
	}
	if( la == 2 ){
		this._setLen( x, 1 );
		x[1] = _INT( _SQRT( a[2] * _MP_ELEMENT + a[1] ) );
		return false;
	}

	var l = _DIV( la + 1, 2 );
	var b = new Array();
	b[l + 1] = 0;	// 配列の確保
	this._fill( 0, x, 1, l );
	this._fill( 0, b, 1, l );
	this._setLen( x, l );
	this._setLen( b, l );

	// 最上位桁の平方数を求める
	var i = (l - 1) * 2 + 1;
	var aa = a[i];
	if( _MOD( la, 2 ) == 0 ){
		aa += a[i + 1] * _MP_ELEMENT;
	}
	x[l] = _INT( _SQRT( aa ) );

	// 初回のaとbが求まる
	b[l] = x[l] + x[l];
	if( b[l] >= _MP_ELEMENT ){
		b[l] -= _MP_ELEMENT;
		b[l + 1] = 1;
		this._setLen( b, l + 1 );
	}
	var w = new Array();
	this.mul( w, x, x );
	this.sub( a, a, w );
	l--;

	var q = new Array();
	var r = new Array();
	while( true ){
		this.div( q, a, b, r );	// 仮値Q
		if( l > 1 ){
			this._fill( 0, q, 1, l - 1 );
		}
		if( this.getLen( q ) > l ){
			q[l] = _MP_ELEMENT - 1;
			this._setLen( q, l );
		}
		while( true ){
			this.add( r, b, q );
			this.mul( w, r, q );
			if( this.cmp( w, a ) <= 0 ){
				break;
			}
			q[l]--;	// 仮値Qを下げる
		}
		x[l] = q[l];
		if( l == 1 ){
			break;
		}

		// 次のaとbが求まる
		this.add( b, r, q );
		this.sub( a, a, w );
		l--;
	}
	return false;
};
