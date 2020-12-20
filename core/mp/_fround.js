/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_fround.h"

// 丸め演算
// modeを省略すると、_MP_FROUND_HALF_EVENの動作になる。

_MultiPrec.prototype._froundGet = function( a/*Array*/, n ){
	var l = this._getLen( a );
	var nn = 1 + _DIV( n, _MP_DIGIT );
	if( nn > l ){
		return 0;
	}
	return _MOD( _DIV( a[nn], _POW( 10, _MOD( n, _MP_DIGIT ) ) ), 10 );
};

_MultiPrec.prototype._froundSet = function( a/*Array*/, n, val ){
	var nn = 1 + _DIV( n, _MP_DIGIT );
	var aa = a[nn]; var b = 0; var k = 1;
	n = _MOD( n, _MP_DIGIT );
	for( var i = 0; i < _MP_DIGIT; i++ ){
		if( i == n ){
			b += val * k;
		} else if( i > n ){
			b += _MOD( aa, 10 ) * k;
		}
		aa = _DIV( aa, 10 ); k *= 10;
	}
	a[nn] = b;
};

_MultiPrec.prototype._froundZero = function( a/*Array*/, n ){
	this._fill( 0, a, 1, _DIV( n, _MP_DIGIT ) );
};

_MultiPrec.prototype._froundUp = function( a/*Array*/, n ){
	var l = this._getLen( a );
	var aa;
	while( true ){
		aa = this._froundGet( a, n ) + 1;
		this._froundSet( a, n, _MOD( aa, 10 ) );
		if( aa < 10 ){
			break;
		}
		n++;
		if( (1 + _DIV( n, _MP_DIGIT )) > l ){
			l++;
			this._setLen( a, l * (a[0] < 0 ? -1 : 1) );
			a[l] = 0;
		}
	}
};

_MultiPrec.prototype.fround = function( a/*Array*/, prec, mode ){
	var n = this._getPrec( a ) - prec;
	if( n < 1 ){
		return;
	}
	var aa = this._froundGet( a, n - 1 );
	var u = false;

	if( mode == undefined ){	// パラメータが2つの場合
		mode = _MP_FROUND_HALF_EVEN;
	}
	switch( mode ){
	case _MP_FROUND_UP:
		if( aa > 0 ){ u = true; }
		break;
	case _MP_FROUND_DOWN:
		break;
	case _MP_FROUND_CEILING:
		if( a[0] > 0 && aa > 0 ){ u = true; }
		break;
	case _MP_FROUND_FLOOR:
		if( a[0] < 0 && aa > 0 ){ u = true; }
		break;
	case _MP_FROUND_HALF_UP:
		if( aa > 4 ){ u = true; }
		break;
	case _MP_FROUND_HALF_DOWN:
		if( aa > 5 ){ u = true; }
		break;
	case _MP_FROUND_HALF_EVEN:
		if( _MOD( this._froundGet( a, n ), 2 ) == 1 ){
			if( aa > 4 ){ u = true; }
		} else {
			if( aa > 5 ){ u = true; }
		}
		break;
	}

	if( u ){
		this._froundZero( a, n );
		this._froundUp( a, n );
	} else {
		this._froundZero( a, n - 1 );
		this._froundSet( a, n - 1, 0 );
	}
};
