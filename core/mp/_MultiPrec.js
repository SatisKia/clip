/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

var _MP_DIGIT     = 4;
var _MP_ELEMENT   = _POW( 10, _MP_DIGIT );
var _MP_PREC_MASK = 0xFFFFFFFF;
var _MP_LEN_COEF  = _MP_PREC_MASK + 1;

// 多倍長演算クラス
function _MultiPrec(){
	this._I = new Array();
	this._F = new Array();

	this.fabs = this.abs;
	this.fneg = this.neg;
	this.fset = this.set;
}

_MultiPrec.prototype.I = function( str ){
	if( this._I["_" + str] == undefined ){
		this._I["_" + str] = new Array();
		this.str2num( this._I["_" + str], str );
	}
	return this._I["_" + str];
};
_MultiPrec.prototype.F = function( str ){
	if( this._F["_" + str] == undefined ){
		this._F["_" + str] = new Array();
		this.fstr2num( this._F["_" + str], str );
	}
	return this._F["_" + str];
};

_MultiPrec.prototype.getLen = function( a/*Array*/ ){
	return _INT( _ABS( a[0] / _MP_LEN_COEF ) );
};
_MultiPrec.prototype._setLen = function( a/*Array*/, len ){
	var p = _AND( _ABS( a[0] ), _MP_PREC_MASK );
	if( len == 0 ){
		a[0] = _MP_LEN_COEF + p; a[1] = 0;	// ゼロ値
	} else {
		a[0] = (_ABS( len ) * _MP_LEN_COEF + p) * (len < 0 ? -1 : 1);
	}
};

_MultiPrec.prototype.getPrec = function( a/*Array*/ ){
	return _AND( _ABS( a[0] ), _MP_PREC_MASK );
};
_MultiPrec.prototype._setPrec = function( a/*Array*/, prec ){
	var l = _INT( _ABS( a[0] / _MP_LEN_COEF ) );
	if( l == 0 ){
		a[0] = _MP_LEN_COEF + prec; a[1] = 0;	// ゼロ値
	} else {
		a[0] = (l * _MP_LEN_COEF + prec) * (a[0] < 0 ? -1 : 1);
	}
};

// 配列の要素の挿入だけで行える分の乗算を行う
_MultiPrec.prototype._fmul = function( a/*Array*/, prec ){
	var n = _INT( prec / _MP_DIGIT );
	if( n > 0 ){
		var l = _INT( _ABS( a[0] / _MP_LEN_COEF ) );
		this._copy( a, 1, a, n + 1, l );
		this._fill( 0, a, 1, n );
		var p = _AND( _ABS( a[0] ), _MP_PREC_MASK );
		a[0] = ((l + n) * _MP_LEN_COEF + p) * (a[0] < 0 ? -1 : 1);
	}
	return prec - n * _MP_DIGIT;
};

// 配列の要素の削除だけで行える分の除算を行う
_MultiPrec.prototype._fdiv = function( a/*Array*/, len ){
	var l = _INT( _ABS( a[0] / _MP_LEN_COEF ) );
	this._copy( a, len + 1, a, 1, l - len );
	l -= len
	var p = _AND( _ABS( a[0] ), _MP_PREC_MASK );
	if( l == 0 ){
		a[0] = _MP_LEN_COEF + p; a[1] = 0;	// ゼロ値
	} else {
		a[0] = (l * _MP_LEN_COEF + p) * (a[0] < 0 ? -1 : 1);
	}
};

// 10のprec乗の値の多倍長数データを生成する
_MultiPrec.prototype._fcoef = function( k/*Array*/, prec ){
	var n = _DIV( prec, _MP_DIGIT ) + 1;
	k[n] = _POW( 10, _MOD( prec, _MP_DIGIT ) );
	this._fill( 0, k, 1, n - 1 );
	k[0] = n * _MP_LEN_COEF;
};

// 小数点以下の桁数を揃える
_MultiPrec.prototype._matchPrec = function( a/*Array*/, b/*Array*/ ){
	var aa = this.getPrec( a );
	var bb = this.getPrec( b );
	var p = aa, t;
	if( aa < bb ){
		if( (t = this._fmul( a, bb - aa )) > 0 ){
			var k = new Array();
			this._fcoef( k, t ); this.mul( a, a, k );
		}
		this._setPrec( a, bb );
		p = bb;
	} else if( bb < aa ){
		if( (t = this._fmul( b, aa - bb )) > 0 ){
			var k = new Array();
			this._fcoef( k, t ); this.mul( b, b, k );
		}
		this._setPrec( b, aa );
	}
	return p;
};

_MultiPrec.prototype.clone = function( a/*Array*/ ){
	if( a.length == 0 ){
		return [ _MP_LEN_COEF, 0 ];	// ゼロ値
	}
	return Array.from( a );
};

_MultiPrec.prototype._copy = function( src, src_pos, dst, dst_pos, len ){
	src = this.clone( src );
	for( var i = 0; i < len; i++ ){
		dst[dst_pos + i] = src[src_pos + i];
	}
};

_MultiPrec.prototype._fill = function( value, array, pos, len ){
	for( var i = 0; i < len; i++ ){
		array[pos + i] = value;
	}
};

_MultiPrec.prototype._strlen = function( array ){
	var len;
	for( len = 0; ; len++ ){
		if( array[len] == 0 ){
			break;
		}
	}
	return len;
};

_MultiPrec.prototype._j2cstr = function( str ){
	var array = new Array();
	var i;
	for( i = 0; i < str.length; i++ ){
		array[i] = str.charCodeAt( i );
	}
	array[i] = 0;
	return array;
};

_MultiPrec.prototype._c2jstr = function( array ){
	var str = new String();
	for( var i = 0; ; i++ ){
		if( array[i] == 0 ){
			break;
		}
		str += String.fromCharCode( array[i] );
	}
	return str;
};
