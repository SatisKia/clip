/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

var _MP_DIGIT     = 4;
var _MP_ELEMENT   = _POW( 10, _MP_DIGIT );
var _MP_PREC_MASK = 0xFFFFFFFF;
var _MP_LEN_COEF  = _MP_PREC_MASK + 1;

var _MP_FROUND_UP        = 0;	// ゼロから離れるように丸める
var _MP_FROUND_DOWN      = 1;	// ゼロに近づくように丸める
var _MP_FROUND_CEILING   = 2;	// 正の無限大に近づくように丸める
var _MP_FROUND_FLOOR     = 3;	// 負の無限大に近づくように丸める
var _MP_FROUND_HALF_UP   = 4;	// 四捨五入する
var _MP_FROUND_HALF_DOWN = 5;	// 五捨六入する
var _MP_FROUND_HALF_EVEN = 6;	// 最も近い値の方に丸める

function _MultiPrec(){
	this._CONST  = new Array();
	this._FCONST = new Array();

	this.fabs = this.abs;
	this.fneg = this.neg;
	this.fset = this.set;
}

_MultiPrec.prototype.CONST = function( str ){
	if( this._CONST["_" + str] == undefined ){
		this._CONST["_" + str] = new Array();
		this.str2num( this._CONST["_" + str], str );
	}
	return this._CONST["_" + str];
};
_MultiPrec.prototype.FCONST = function( str ){
	if( this._FCONST["_" + str] == undefined ){
		this._FCONST["_" + str] = new Array();
		this.fstr2num( this._FCONST["_" + str], str );
	}
	return this._FCONST["_" + str];
};

_MultiPrec.prototype._getLen = function( a/*Array*/ ){
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

_MultiPrec.prototype._getPrec = function( a/*Array*/ ){
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
	var aa = this._getPrec( a );
	var bb = this._getPrec( b );
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

_MultiPrec.prototype._clone = function( array ){
	var clone = new Array();
	for( var i = 0; i < array.length; i++ ){
		clone[i] = array[i];
	}
	return clone;
};

_MultiPrec.prototype._copy = function( src, src_pos, dst, dst_pos, len ){
	src = this._clone( src );
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