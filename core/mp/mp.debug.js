/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */
(function( window, undefined ){
var _DBL_EPSILON = 2.2204460492503131e-016;
var _NORMALIZE = 0.434294481903251816668;
var _RAND_MAX = 32767;
var _ABS = Math.abs;
var _ACOS = Math.acos;
var _ASIN = Math.asin;
var _ATAN = Math.atan;
var _ATAN2 = Math.atan2;
var _CEIL = Math.ceil;
var _COS = Math.cos;
var _EXP = Math.exp;
var _FLOOR = Math.floor;
var _LOG = Math.log;
var _POW = Math.pow;
var _SIN = Math.sin;
var _SQRT = Math.sqrt;
var _TAN = Math.tan;
var _rand_next = 1;
function srand( seed ){
	_rand_next = seed;
}
function rand(){
	_rand_next = _UNSIGNED( _rand_next * 1103515245 + 12345, 4294967296 );
	return _MOD( _rand_next / ((_RAND_MAX + 1) * 2), _RAND_MAX + 1 );
}
function _INT( x ){
	if( x < 0.0 ){
		return _CEIL( x );
	}
	return _FLOOR( x );
}
function _DIV( a, b ){
	if( a < 0 ){
		return _CEIL( a / b );
	}
	return _FLOOR( a / b );
}
function _MOD( a, b ){
	if( a < 0 ){
		a = -_INT( a );
		return -(a - _FLOOR( a / b ) * b);
	}
	a = _INT( a );
	return a - _FLOOR( a / b ) * b;
}
function _SHIFTL( a, b ){
	return a * _POW( 2, b );
}
function _SHIFTR( a, b ){
	return _DIV( a, _POW( 2, b ) );
}
function _AND( a, b ){
	return (_DIV( a, 0x10000 ) & _DIV( b, 0x10000 )) * 0x10000 + ((a & 0xFFFF) & (b & 0xFFFF));
}
function _OR( a, b ){
	return (_DIV( a, 0x10000 ) | _DIV( b, 0x10000 )) * 0x10000 + ((a & 0xFFFF) | (b & 0xFFFF));
}
function _XOR( a, b ){
	return (_DIV( a, 0x10000 ) ^ _DIV( b, 0x10000 )) * 0x10000 + ((a & 0xFFFF) ^ (b & 0xFFFF));
}
function _SIGNED( x, umax, smin, smax ){
	x = _MOD( x, umax );
	if( x > smax ) return x - umax;
	if( x < smin ) return x + umax;
	return x;
}
function _UNSIGNED( x, umax ){
	x = _MOD( x, umax );
	if( x < 0 ) return x + umax;
	return x;
}
function _MODF( x, _int ){
	var str = x.toString();
	var k;
	if( (str.indexOf( "e" ) >= 0) || (str.indexOf( "E" ) >= 0) ){
		k = 1;
	} else {
		var tmp = str.split( "." );
		if( tmp[1] ){
			k = _POW( 10, tmp[1].length );
		} else {
			k = 1;
		}
	}
	var i = _INT( x );
	_int.set( i );
	return (x * k - i * k) / k;
}
function _FACTORIAL( x ){
	var m = false;
	if( x < 0 ){
		m = true;
		x = 0 - x;
	}
	var f = 1;
	for( var i = 2; i <= x; i++ ){
		f *= i;
	}
	return m ? -f : f;
}
function _CHAR( chr ){
	return chr.charCodeAt( 0 );
}
var _CHAR_CODE_0 = _CHAR( '0' );
var _CHAR_CODE_9 = _CHAR( '9' );
var _CHAR_CODE_LA = _CHAR( 'a' );
var _CHAR_CODE_LZ = _CHAR( 'z' );
var _CHAR_CODE_UA = _CHAR( 'A' );
var _CHAR_CODE_UZ = _CHAR( 'Z' );
var _CHAR_CODE_EX = _CHAR( '!' );
var _CHAR_CODE_COLON = _CHAR( ':' );
Number.isFinite = Number.isFinite || function( x ){
	return typeof x === "number" && isFinite( x );
};
Number.isNaN = Number.isNaN || function( x ){
	return typeof x === "number" && isNaN( x );
};
function _ISINF( x ){
	return Number.isFinite( x ) ? false : true;
}
function _ISNAN( x ){
	return Number.isNaN( x );
}
function _ISZERO( x ){
	return (_ISNAN( x ) || (x != 0.0)) ? false : true;
}
function _APPROX( x, y ){
	if( y == 0 ){
		return _ABS( x ) < (_DBL_EPSILON * 4.0);
	}
	return _ABS( (y - x) / y ) < (_DBL_EPSILON * 4.0);
}
function _APPROX_M( x, y ){
	if( x._row != y._row ) return false;
	if( x._col != y._col ) return false;
	var l = x._len;
	for( var i = 0; i < l; i++ ){
		if( !_APPROX( x.mat( i ).toFloat(), y.mat( i ).toFloat() ) || !_APPROX( x.mat( i ).imag(), y.mat( i ).imag() ) ) return false;
	}
	return true;
}
function _EPREC( x ){
	var p, q;
	var t, i;
	if( _ISINF( x ) || _ISNAN( x ) || _ISZERO( x ) ){
		return ( 0 );
	}
	q = 0;
	for( p = 0; ; p++ ){
		t = x * _POW( 10.0, p );
		i = _INT( t );
		if( (t - i) == 0.0 ){
			break;
		}
		if( i == 0 ){
			q++;
		}
	}
	if( q == 0 ){
		return p + _INT( _LOG( _ABS( x ) ) * _NORMALIZE ) ;
	}
	return p - q;
}
function _FPREC( x ){
	var p;
	var t, i;
	if( _ISINF( x ) || _ISNAN( x ) ){
		return 0;
	}
	for( p = 0; ; p++ ){
		t = x * _POW( 10.0, p );
		i = _INT( t );
		if( (t - i) == 0.0 ){
			break;
		}
	}
	return p;
}
function _GCD( x, y ){
	if( _ISNAN( x ) ) return x;
	if( _ISNAN( y ) ) return y;
	x = _INT( x );
	y = _INT( y );
	var t;
	while( y != 0 ){
		t = _MOD( x, y );
		x = y;
		y = t;
	}
	return x;
}
function _LCM( x, y ){
	if( _ISNAN( x ) ) return x;
	if( _ISNAN( y ) ) return y;
	x = _INT( x );
	y = _INT( y );
	var g = _GCD( x, y );
	if( g == 0 ){
		return 0.0;
	}
	return x * y / g;
}
function stringToFloat( str, top, stop ){
	var step = 0;
	var i = top;
	var _break = false;
	while( i < str.length ){
		switch( step ){
		case 0:
			if( (str.charAt( i ) == '+') || str.charAt( i ) == '-' ){
				i++;
			}
			step++;
			break;
		case 1:
		case 3:
		case 5:
			if( (str.charCodeAt( i ) >= _CHAR_CODE_0) && (str.charCodeAt( i ) <= _CHAR_CODE_9) ){
				i++;
			} else {
				step++;
			}
			break;
		case 2:
			if( str.charAt( i ) == '.' ){
				i++;
				step = 3;
			} else {
				step = 4;
			}
			break;
		case 4:
			if( (str.charAt( i ) == 'e') || (str.charAt( i ) == 'E') ){
				if( (str.charCodeAt( i + 1 ) >= _CHAR_CODE_0) && (str.charCodeAt( i + 1 ) <= _CHAR_CODE_9) ){
					i++;
					step = 5;
					break;
				}
				if( (str.charAt( i + 1 ) == '+') || str.charAt( i + 1 ) == '-' ){
					i += 2;
					step = 5;
					break;
				}
			}
		case 6:
			_break = true;
			break;
		}
		if( _break ){
			break;
		}
	}
	stop.set( i );
	return parseFloat( str.substring( top, i ) );
}
function stringToInt( str, top, stop , radix ){
	var val = 0;
	var i = top;
	var swi = false;
	if( str.charAt( i ) == '+' ){
		i++;
	} else if( str.charAt( i ) == '-' ){
		swi = true;
		i++;
	}
	var chr;
	var num = (radix > 10) ? 10 : radix;
	while( i < str.length ){
		chr = str.charCodeAt( i );
		val *= radix;
		if( (chr >= _CHAR_CODE_0) && (chr < _CHAR_CODE_0 + num) ){
			val += chr - _CHAR_CODE_0;
			i++;
		} else if( (chr >= _CHAR_CODE_LA) && (chr < _CHAR_CODE_LA + (radix - 10)) ){
			val += 10 + (chr - _CHAR_CODE_LA);
			i++;
		} else if( (chr >= _CHAR_CODE_UA) && (chr < _CHAR_CODE_UA + (radix - 10)) ){
			val += 10 + (chr - _CHAR_CODE_UA);
			i++;
		} else {
			break;
		}
	}
	stop.set( i );
	return swi ? -val : val;
}
function _trimFloatStr( str ){
	var str1 = str;
	var str2 = "";
	var top = str.indexOf( "e" );
	if( top < 0 ){
		top = str.indexOf( "E" );
	}
	if( top >= 0 ){
		str1 = str.substring( 0, top );
		str2 = str.slice( top );
	}
	var min = str1.indexOf( "." );
	if( min >= 0 ){
		var len = str1.length;
		while( len > min ){
			if( (str1.charAt( len - 1 ) != '0') && (str1.charAt( len - 1 ) != '.') ){
				break;
			}
			len--;
		}
		str1 = str1.substr( 0, len );
	}
	return str1 + str2;
}
function floatToExponential( val, width ){
	var str;
	if( width == undefined ){
		str = val.toExponential();
	} else {
		if( width < 0 ){
			width = 0;
		}
		if( width > 20 ){
			width = 20;
		}
		str = val.toExponential( width );
	}
	return _trimFloatStr( str );
}
function floatToFixed( val, width ){
	var str;
	if( width == undefined ){
		str = val.toFixed();
		if( (str.indexOf( "e" ) >= 0) || (str.indexOf( "E" ) >= 0) ){
			str = val.toExponential();
		}
	} else {
		if( width < 0 ){
			width = 0;
		}
		if( width > 20 ){
			width = 20;
		}
		str = val.toFixed( width );
		if( (str.indexOf( "e" ) >= 0) || (str.indexOf( "E" ) >= 0) ){
			str = val.toExponential( width );
		}
	}
	return _trimFloatStr( str );
}
function floatToString( val, width ){
	var str;
	if( width == undefined ){
		str = val.toPrecision();
	} else {
		if( width < 1 ){
			width = 1;
		}
		if( width > 21 ){
			width = 21;
		}
		str = val.toPrecision( width );
	}
	return _trimFloatStr( str );
}
function floatToStringPoint( val, width ){
	var str = floatToString( val, width );
	if( str.indexOf( "." ) < 0 ){
		str += ".0";
	}
	return str;
}
function intToString( val, radix, width ){
	if( _ISNAN( val ) ){
		return val.toString();
	}
	if( (width == undefined) || (width <= 0) ){
		width = 1;
	}
	var chr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var swi = (val < 0);
	if( swi ){
		val = -val;
	}
	var str = "";
	while( val != 0 ){
		str += chr.charAt( _MOD( val, radix ) );
		val = _DIV( val, radix );
	}
	for( i = str.length; i < width; i++ ){
		str += "0";
	}
	if( swi ){
		str += "-";
	}
	var str2 = "";
	for( var i = str.length - 1; i >= 0; i-- ){
		str2 += str.charAt( i );
	}
	return str2;
}
function _Integer( val ){
	this._val = (val == undefined) ? 0 : _INT( val );
}
_Integer.prototype = {
	set : function( val ){
		this._val = _INT( val );
		return this;
	},
	add : function( val ){
		this._val += _INT( val );
		return this;
	},
	val : function(){
		return this._val;
	}
};
function newIntegerArray( len ){
	var a = new Array( len );
	for( var i = 0; i < len; i++ ){
		a[i] = new _Integer();
	}
	return a;
}
var _MP_DIGIT = 4;
var _MP_ELEMENT = _POW( 10, _MP_DIGIT );
var _MP_PREC_MASK = 0xFFFFFFFF;
var _MP_LEN_COEF = _MP_PREC_MASK + 1;
var _MP_FROUND_UP = 0;
var _MP_FROUND_DOWN = 1;
var _MP_FROUND_CEILING = 2;
var _MP_FROUND_FLOOR = 3;
var _MP_FROUND_HALF_UP = 4;
var _MP_FROUND_HALF_DOWN = 5;
var _MP_FROUND_HALF_EVEN = 6;
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
_MultiPrec.prototype._getLen = function( a ){
	return _INT( _ABS( a[0] / _MP_LEN_COEF ) );
};
_MultiPrec.prototype._setLen = function( a , len ){
	var p = _AND( _ABS( a[0] ), _MP_PREC_MASK );
	if( len == 0 ){
		a[0] = _MP_LEN_COEF + p; a[1] = 0;
	} else {
		a[0] = (_ABS( len ) * _MP_LEN_COEF + p) * (len < 0 ? -1 : 1);
	}
};
_MultiPrec.prototype._getPrec = function( a ){
	return _AND( _ABS( a[0] ), _MP_PREC_MASK );
};
_MultiPrec.prototype._setPrec = function( a , prec ){
	var l = _INT( _ABS( a[0] / _MP_LEN_COEF ) );
	if( l == 0 ){
		a[0] = _MP_LEN_COEF + prec; a[1] = 0;
	} else {
		a[0] = (l * _MP_LEN_COEF + prec) * (a[0] < 0 ? -1 : 1);
	}
};
_MultiPrec.prototype._fmul = function( a , prec ){
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
_MultiPrec.prototype._fdiv = function( a , len ){
	var l = _INT( _ABS( a[0] / _MP_LEN_COEF ) );
	this._copy( a, len + 1, a, 1, l - len );
	l -= len
	var p = _AND( _ABS( a[0] ), _MP_PREC_MASK );
	if( l == 0 ){
		a[0] = _MP_LEN_COEF + p; a[1] = 0;
	} else {
		a[0] = (l * _MP_LEN_COEF + p) * (a[0] < 0 ? -1 : 1);
	}
};
_MultiPrec.prototype._fcoef = function( k , prec ){
	var n = _DIV( prec, _MP_DIGIT ) + 1;
	k[n] = _POW( 10, _MOD( prec, _MP_DIGIT ) );
	this._fill( 0, k, 1, n - 1 );
	k[0] = n * _MP_LEN_COEF;
};
_MultiPrec.prototype._matchPrec = function( a , b ){
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
_MultiPrec.prototype.abs = function( rop , op ){
	if( op == undefined ){
		rop[0] = _ABS( rop[0] );
		return;
	}
	this._copy( op, 1, rop, 1, this._getLen( op ) );
	rop[0] = _ABS( op[0] );
};
_MultiPrec.prototype.add = function( ret , a , b ){
	a = this._clone( a );
	b = this._clone( b );
	if( a[0] < 0 && b[0] >= 0 ){
		a[0] = -a[0];
		this.sub( ret, b, a );
		return;
	} else if( a[0] >= 0 && b[0] < 0 ){
		b[0] = -b[0];
		this.sub( ret, a, b );
		return;
	}
	var k = (a[0] < 0 && b[0] < 0) ? -1 : 1;
	var la = this._getLen( a );
	var lb = this._getLen( b );
	var lr = (la >= lb) ? la : lb;
	ret[lr + 1] = 0;
	var r = 0, aa = 0, bb = 0, x = 0;
	for( var i = 1; i <= lr; i++ ){
		if( i <= la ){ x += a[++aa]; }
		if( i <= lb ){ x += b[++bb]; }
		if( x < _MP_ELEMENT ){
			ret[++r] = x;
			x = 0;
		} else {
			ret[++r] = x - _MP_ELEMENT;
			x = 1;
		}
	}
	if( x != 0 ){
		ret[++r] = x;
		lr++;
	}
	this._setLen( ret, lr * k );
};
_MultiPrec.prototype.cmp = function( a , b ){
	if( a[0] < 0 && b[0] >= 0 ){ return -1; }
	if( b[0] < 0 && a[0] >= 0 ){ return 1; }
	var k = (a[0] < 0 && b[0] < 0) ? -1 : 1;
	var la = this._getLen( a );
	var lb = this._getLen( b );
	var aa, bb;
	for( var i = (la > lb) ? la : lb; i > 0; i-- ){
		aa = (i <= la) ? a[i] : 0;
		bb = (i <= lb) ? b[i] : 0;
		if( aa != bb ){ return (aa - bb) * k; }
	}
	return 0;
};
_MultiPrec.prototype._mul1 = function( q , a , b ){
	q[a[0] + 1] = 0;
	var c, aa, qq, i, x;
	for( c = 0, aa = 0, qq = 0, i = 0; i < a[0]; i++ ){
		x = a[++aa] * b + c;
		q[++qq] = _MOD( x, _MP_ELEMENT ); c = _DIV( x, _MP_ELEMENT );
	}
	q[++qq] = c;
	q[0] = i; if( c > 0 ){ q[0]++; }
};
_MultiPrec.prototype._div1 = function( q , a , b ){
	q[0] = a[0];
	var c, aa, qq, i, x;
	for( c = 0, aa = a[0], qq = q[0], i = a[0]; i > 0; i-- ){
		x = _MP_ELEMENT * c + a[aa--];
		q[qq--] = _DIV( x, b ); c = _MOD( x, b );
	}
	if( q[q[0]] == 0 ){ q[0]--; }
	return c;
};
_MultiPrec.prototype._sub1 = function( a , b , aa, bb ){
	var c, t;
	for( c = 0, t = bb, bb = 0; bb < t; ){
		a[++aa] -= b[++bb] + c;
		c = 0;
		if( a[aa] < 0 ){ a[aa] += _MP_ELEMENT; c = 1; }
	}
	while( a[aa] == 0 ){ aa--; }
	a[0] = aa;
};
_MultiPrec.prototype.div = function( q , a , b , r ){
	a = this._clone( a );
	b = this._clone( b );
	if( r == undefined ){
		r = new Array();
	}
	var k = 1;
	if( a[0] < 0 && b[0] >= 0 ){ k = -1; }
	if( b[0] < 0 && a[0] >= 0 ){ k = -1; }
	var l = (a[0] < 0) ? -1 : 1;
	a[0] = this._getLen( a );
	b[0] = this._getLen( b );
	q[0] = 0; r[0] = 0;
	var lq, lr;
	var K;
	var Q;
	if( b[0] == 0 || (b[0] == 1 && b[1] == 0) ){ return true ; }
	if( a[0] == 0 || (a[0] == 1 && a[1] == 0) ){ return false; }
	if( a[0] < b[0] ){
		this._copy( a, 0, r, 0, a[0] + 1 );
		lr = r[0]; r[0] = 0; this._setLen( r, lr * l );
		return false;
	}
	if( b[0] == 1 ){
		var rr = 0;
		var c = this._div1( q, a, b[1] );
		if( c > 0 ){
			r[rr++] = 1;
			r[rr] = c;
		} else {
			r[rr] = 0;
		}
		lq = q[0]; q[0] = 0; this._setLen( q, lq * k );
		lr = r[0]; r[0] = 0; this._setLen( r, lr * l );
		return false;
	}
	if( (K = _DIV( _MP_ELEMENT, b[b[0]] + 1 )) > 1 ){
		this._mul1( a, this._clone( a ), K );
		this._mul1( b, this._clone( b ), K );
	}
	q[0] = a[0] - b[0] + 1;
	for( var i = q[0]; i > 0; i-- ){ q[i] = 0; }
	var n = b[0];
	var m;
	var aa, bb, rr;
	while( (m = a[0]) >= n ){
		if( a[a[0]] >= b[b[0]] ){
			for( aa = a[0], bb = b[0]; bb > 0; aa--, bb-- ){
				if( a[aa] != b[bb] ){ break; }
			}
			if( bb == 0 ){
				a[0] -= b[0];
				q[m - n + 1]++;
				continue;
			} else if( a[aa] > b[bb] ){
				this._sub1( a, b, m - n, bb );
				q[m - n + 1]++;
				continue;
			}
			Q = _MP_ELEMENT - 1;
		} else {
			Q = _DIV( _MP_ELEMENT * a[a[0]] + a[a[0] - 1], b[b[0]] );
		}
		if( m == n ){ break; }
		while( true ){
			if( Q == 1 ){
				b[b[0] + 1] = 0;
				this._sub1( a, b, a[0] - b[0] - 1, b[0] );
				break;
			}
			this._mul1( r, b, Q );
			for( aa = a[0], rr = r[0]; rr > 0; aa--, rr-- ){
				if( a[aa] != r[rr] ){ break; }
			}
			if( rr == 0 ){
				a[0] -= r[0];
				break;
			} else if( a[aa] > r[rr] ){
				this._sub1( a, r, a[0] - r[0], rr );
				break;
			} else {
				Q--;
			}
		}
		q[m - n] = Q;
	}
	if( q[q[0]] == 0 ){ q[0]--; }
	if( K > 1 ){
		this._div1( r, a, K );
	} else {
		this._copy( a, 0, r, 0, a[0] + 1 );
	}
	lq = q[0]; q[0] = 0; this._setLen( q, lq * k );
	lr = r[0]; r[0] = 0; this._setLen( r, lr * l );
	return false;
};
_MultiPrec.prototype.fadd = function( ret , a , b ){
	a = this._clone( a );
	b = this._clone( b );
	var p = this._matchPrec( a, b );
	this.add( ret, a, b );
	this._setPrec( ret, p );
};
_MultiPrec.prototype.fcmp = function( a , b ){
	a = this._clone( a );
	b = this._clone( b );
	this._matchPrec( a, b );
	return this.cmp( a, b );
};
_MultiPrec.prototype.fdigit = function( a ){
	var l = this._getLen( a );
	if( l == 0 ){
		return 0;
	}
	var k = 10;
	var i;
	for( i = 1; i <= _MP_DIGIT; i++ ){
		if( a[l] < k ){ break; }
		k *= 10;
	}
	var d = (l - 1) * _MP_DIGIT + i;
	return d - this._getPrec( a );
};
_MultiPrec.prototype.fdiv = function( ret , a , b , prec ){
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
_MultiPrec.prototype.fdiv2 = function( ret , a , b , prec, digit ){
	a = this._clone( a );
	b = this._clone( b );
	if( digit == undefined ){
		digit = new _Integer();
	}
	var P = this._getPrec( a );
	var l = this._getLen( a );
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
	var bb = new Array();
	var aa = new Array();
	this._setLen( aa, 1 ); aa[1] = 1;
	var p = this._matchPrec( aa, b );
	var k = b[0] < 0 ? -1 : 1;
	var l = this._getLen( b );
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
	p = prec * 2 + 1;
	var t = this._fmul( q, p );
	this._fmul( r, p );
	if( t > 0 ){
		var k = new Array();
		this._fcoef( k, t );
		this.mul( q, q, k );
		this.mul( r, r, k );
	}
	this.div( r, r, b );
	if( this._getLen( a ) == 1 && a[1] == 1 ){
		this.add( ret, q, r );
		if( a[0] < 0 ){ ret[0] = -ret[0]; }
		this._setPrec( ret, p );
		return false;
	} else {
		this.add( bb, q, r );
		this._setPrec( bb, p );
	}
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
_MultiPrec.prototype.fmul = function( ret , a , b , prec ){
	a = this._clone( a );
	b = this._clone( b );
	this.mul( ret, a, b );
	var p = this._getPrec( a ) + this._getPrec( b );
	var n = _INT( (p - (prec + _MP_DIGIT)) / _MP_DIGIT );
	if( n > 0 ){
		p -= n * _MP_DIGIT;
		this._fdiv( ret, n );
	}
	this._setPrec( ret, p );
};
_MultiPrec.prototype._fnum2str = function( s , n ){
	n = this._clone( n );
	var p = this._getPrec( n );
	var ss = new Array();
	this._num2str( ss, n );
	var l = this._strlen( ss );
	var i;
	for( i = l - 1; i > 0; i-- ){
		if( ss[i] != _CHAR_CODE_0 ){
			break;
		}
	}
	p -= l - (i + 1);
	if( p < 0 ){
		i -= p; p = 0;
	}
	l = i + 1;
	var j = 0, k = 0;
	if( ss[0] == _CHAR( '-' ) ){
		s[j++] = ss[k++];
		l--;
	}
	if( l <= p ){
		s[j++] = _CHAR_CODE_0;
	}
	if( l < p ){
		s[j++] = _CHAR( '.' );
		for( i = 0; i < p - l; i++ ){
			s[j++] = _CHAR_CODE_0;
		}
	}
	for( i = 0; i < l; i++ ){
		if( i == l - p ){
			s[j++] = _CHAR( '.' );
		}
		s[j++] = ss[k++];
	}
	s[j] = 0;
};
_MultiPrec.prototype.fnum2str = function( a , b ){
	if( b == undefined ){
		var array = new Array();
		this._fnum2str( array, a );
		return this._c2jstr( array );
	} else {
		this._fnum2str( a, b );
		return a;
	}
};
_MultiPrec.prototype._froundGet = function( a , n ){
	var l = this._getLen( a );
	var nn = 1 + _DIV( n, _MP_DIGIT );
	if( nn > l ){
		return 0;
	}
	return _MOD( _DIV( a[nn], pow( 10, _MOD( n, _MP_DIGIT ) ) ), 10 );
};
_MultiPrec.prototype._froundSet = function( a , n, val ){
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
_MultiPrec.prototype._froundZero = function( a , n ){
	this._fill( 0, a, 1, _DIV( n, _MP_DIGIT ) );
};
_MultiPrec.prototype._froundUp = function( a , n ){
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
_MultiPrec.prototype.fround = function( a , prec, mode ){
	var n = this._getPrec( a ) - prec;
	if( n < 1 ){
		return;
	}
	var aa = this._froundGet( a, n - 1 );
	var u = false;
	if( mode == undefined ){
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
_MultiPrec.prototype.fround2 = function( a , prec, even_flag ){
	var n = this._getPrec( a ) - prec;
	if( n < 1 ){
		return;
	}
	var aa = this._froundGet( a, n - 1 );
	var u = false;
	if( even_flag && _MOD( this._froundGet( a, n ), 2 ) == 1 && aa > 4 ){
		u = true;
	} else if( aa > 5 ){
		u = true;
	} else if( aa == 5 && n > 1 ){
		var i = 1 + _DIV( n - 1, _MP_DIGIT );
		if( _MOD( a[i], _POW( 10, _MOD( n - 1, _MP_DIGIT ) ) ) != 0 ){
			u = true;
		} else {
			for( i--; i > 0; i-- ){
				if( a[i] != 0 ){ u = true; break; }
			}
		}
	}
	if( u ){
		this._froundZero( a, n );
		this._froundUp( a, n );
	} else {
		this._froundZero( a, n - 1 );
		this._froundSet( a, n - 1, 0 );
	}
};
_MultiPrec.prototype.fsqrt = function( ret , a , prec ){
	a = this._clone( a );
	if( this.fcmp( a, this.F( "0" ) ) > 0 ){
		var l = new Array();
		var s = new Array();
		var t = new Array();
		if( this.fcmp( a, this.F( "1" ) ) > 0 ){
			this.set( s, a );
		} else {
			this.set( s, this.F( "1" ) );
		}
		do {
			this.set( l, s );
			this.fdiv2( t, a, s, prec );
			this.fadd( t, t, s );
			this.fmul( t, t, this.F( "0.5" ), prec );
			this.set( s, t );
		} while( this.fcmp( s, l ) < 0 );
		this.set( ret, l );
		return false;
	}
	this.set( ret, this.F( "0" ) );
	return (this.fcmp( a, this.F( "0" ) ) != 0);
};
_MultiPrec.prototype.fsqrt2 = function( ret , a , prec, order ){
	a = this._clone( a );
	if( this.fcmp( a, this.F( "0" ) ) > 0 ){
		var g = new Array();
		var h = new Array();
		var m = new Array();
		var n = new Array();
		var o = new Array();
		var p = new Array();
		var q = new Array();
		var r = new Array();
		var s = new Array();
		var t = new Array();
		var x = new Array();
		if( this.fcmp( a, this.F( "1" ) ) > 0 ){
			this.fdiv( t, this.F( "1" ), a, prec );
			this.set( x, t );
		} else {
			this.set( x, this.F( "1" ) );
		}
		this.fmul( t, x, x, prec );
		this.fmul( t, a, t, prec );
		this.fsub( h, this.F( "1" ), t );
		this.set( g, this.F( "1" ) );
		this.fdiv( m, this.F( "1" ), this.F( "2" ), prec );
		if( order >= 3 ){ this.fdiv( n, this.F( "3" ), this.F( "8" ), prec ); }
		if( order >= 4 ){ this.fdiv( o, this.F( "5" ), this.F( "16" ), prec ); }
		if( order >= 5 ){ this.fdiv( p, this.F( "35" ), this.F( "128" ), prec ); }
		if( order == 6 ){ this.fdiv( q, this.F( "63" ), this.F( "256" ), prec ); }
		do {
			switch( order ){
			case 6 : this.set( t, q ); break;
			case 5 : this.set( t, p ); break;
			case 4 : this.set( t, o ); break;
			case 3 : this.set( t, n ); break;
			default: this.set( t, m ); break;
			}
			switch( order ){
			case 6:
				this.fmul( t, h, t, prec );
				this.fadd( t, p, t );
			case 5:
				this.fmul( t, h, t, prec );
				this.fadd( t, o, t );
			case 4:
				this.fmul( t, h, t, prec );
				this.fadd( t, n, t );
			case 3:
				this.fmul( t, h, t, prec );
				this.fadd( t, m, t );
			}
			this.fmul( t, h, t, prec );
			this.fmul( t, x, t, prec );
			this.fadd( x, x, t );
			this.set( g, h );
			this.fmul( t, x, x, prec );
			this.fmul( t, a, t, prec );
			this.fsub( h, this.F( "1" ), t );
			this.abs( r, h );
			this.abs( s, g );
		} while( this.fcmp( r, s ) < 0 );
		this.fmul( ret, a, x, prec );
		return false;
	}
	this.set( ret, this.F( "0" ) );
	return (this.fcmp( a, this.F( "0" ) ) != 0);
};
_MultiPrec.prototype.fsqrt3 = function( ret , a , prec ){
	a = this._clone( a );
	var t = prec * 2 - this._getPrec( a );
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
	if( a[this._getLen( a )] == 0 ){
		this._setLen( a, this._getLen( a ) - 1 );
	}
	var r = this.sqrt( ret, a );
	this._setPrec( ret, prec );
	return r;
};
_MultiPrec.prototype.fstr2num = function( n , s ){
	if( s instanceof Array ){
		s = this._clone( s );
	} else {
		s = this._j2cstr( s );
	}
	var l = this._strlen( s );
	var i, j = 0;
	var p = 0;
	var m = false;
	var ss = new Array();
	for( i = 0; i < l; i++ ){
		if( (s[i] == _CHAR( 'e' )) || (s[i] == _CHAR( 'E' )) ){
			if( p != 0 ){
				p -= l - i;
			}
			i++;
			if( s[i] == _CHAR( '-' ) ){
				m = true;
				i++;
			} else {
				m = false;
				if( s[i] == _CHAR( '+' ) ){
					i++;
				}
			}
			break;
		} else if( s[i] == _CHAR( '.' ) ){
			p = l - (i + 1);
		} else {
			ss[j++] = s[i];
		}
	}
	ss[j] = 0;
	this.str2num( n, ss );
	var e = 0;
	for( ; i < l; i++ ){
		e = e * 10 + (s[i] - _CHAR_CODE_0);
	}
	if( m ){
		p += e; e = 0;
	} else if( p >= e ){
		p -= e; e = 0;
	} else {
		e -= p; p = 0;
	}
	this._setPrec( n, p );
	if( e > 0 ){
		var k = new Array();
		this._fcoef( k, e );
		this.fmul( n, n, k, p );
	}
};
_MultiPrec.prototype.fsub = function( ret , a , b ){
	a = this._clone( a );
	b = this._clone( b );
	var p = this._matchPrec( a, b );
	this.sub( ret, a, b );
	this._setPrec( ret, p );
};
_MultiPrec.prototype.ftrunc = function( rop , op ){
	op = this._clone( op );
	var p = this._getPrec( op );
	var n = _INT( p / _MP_DIGIT );
	if( n > 0 ){
		p -= n * _MP_DIGIT;
		this._fdiv( op, n );
	}
	var k = new Array();
	this._fcoef( k, p );
	this.div( rop, op, k );
};
_MultiPrec.prototype._mul1n = function( ret , a , b, n ){
	ret[n + 1] = 0;
	var c, aa, r, i, x;
	for( c = 0, aa = 0, r = 0, i = 0; i < n; i++ ){
		x = a[++aa] * b + c;
		ret[++r] = _MOD( x, _MP_ELEMENT ); c = _DIV( x, _MP_ELEMENT );
	}
	ret[++r] = c;
	return c;
};
_MultiPrec.prototype.mul = function( ret , a , b ){
	a = this._clone( a );
	b = this._clone( b );
	var k = 1;
	if( a[0] < 0 && b[0] >= 0 ){ k = -1; }
	if( b[0] < 0 && a[0] >= 0 ){ k = -1; }
	var la = this._getLen( a );
	var lb = this._getLen( b );
	if( la == 0 || lb == 0 ){
		ret[0] = 0;
		return;
	}
	var c;
	if( la == 1 ){
		c = this._mul1n( ret, b, a[1], lb );
	} else if( lb == 1 ){
		c = this._mul1n( ret, a, b[1], la );
	} else {
		this._fill( 0, ret, 1, la + lb );
		var aa, bb = 0;
		var i, j, x;
		for( j = 1; j <= lb; j++ ){
			c = 0;
			bb++;
			for( i = 1, aa = 0; i <= la; i++ ){
				x = a[++aa] * b[bb] + ret[i + j - 1] + c;
				ret[i + j - 1] = _MOD( x, _MP_ELEMENT );
				c = _DIV( x, _MP_ELEMENT );
			}
			ret[i + j - 1] = c;
		}
	}
	this._setLen( ret, (c != 0 ? la + lb : la + lb - 1) * k );
};
_MultiPrec.prototype.neg = function( rop , op ){
	if( op == undefined ){
		rop[0] = -rop[0];
		return;
	}
	this._copy( op, 1, rop, 1, this._getLen( op ) );
	rop[0] = -op[0];
};
_MultiPrec.prototype._num2str = function( s , n ){
	n = this._clone( n );
	var m = (n[0] < 0);
	n[0] = this._getLen( n );
	if( n[0] == 0 ){
		s[0] = _CHAR_CODE_0;
		s[1] = 0;
		return
	}
	var ss = -1; var nn = 0;
	var i, j, x;
	for( i = n[0]; i > 0; i-- ){
		x = n[++nn];
		for( j = 0; j < _MP_DIGIT; j++ ){
			s[++ss] = _MOD( x, 10 ) + _CHAR_CODE_0; x = _DIV( x, 10 );
		}
	}
	while( s[ss] == _CHAR_CODE_0 ){
		if( --ss < 0 ){
			ss = 0;
			break;
		}
	}
	if( m ){ s[++ss] = _CHAR( '-' ); }
	s[ss + 1] = 0;
	var t = 0;
	while( t < ss ){
		x = s[t]; s[t++] = s[ss]; s[ss--] = x;
	}
};
_MultiPrec.prototype.num2str = function( a , b ){
	if( b == undefined ){
		var array = new Array();
		this._num2str( array, a );
		return this._c2jstr( array );
	}
	this._num2str( a, b );
	return a;
};
_MultiPrec.prototype.set = function( rop , op ){
	this._copy( op, 0, rop, 0, this._getLen( op ) + 1 );
};
_MultiPrec.prototype.sqrt = function( x , a ){
	a = this._clone( a );
	this._setLen( x, 0 );
	if( a[0] < 0 ){ return true; }
	var la = this._getLen( a );
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
	b[l + 1] = 0;
	this._fill( 0, x, 1, l );
	this._fill( 0, b, 1, l );
	this._setLen( x, l );
	this._setLen( b, l );
	var i = (l - 1) * 2 + 1;
	var aa = a[i];
	if( _MOD( la, 2 ) == 0 ){
		aa += a[i + 1] * _MP_ELEMENT;
	}
	x[l] = _INT( _SQRT( aa ) );
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
		this.div( q, a, b, r );
		if( l > 1 ){
			this._fill( 0, q, 1, l - 1 );
		}
		if( this._getLen( q ) > l ){
			q[l] = _MP_ELEMENT - 1;
			this._setLen( q, l );
		}
		while( true ){
			this.add( r, b, q );
			this.mul( w, r, q );
			if( this.cmp( w, a ) <= 0 ){
				break;
			}
			q[l]--;
		}
		x[l] = q[l];
		if( l == 1 ){
			break;
		}
		this.add( b, r, q );
		this.sub( a, a, w );
		l--;
	}
	return false;
};
_MultiPrec.prototype.str2num = function( n , s ){
	if( s instanceof Array ){
		s = this._clone( s );
	} else {
		s = this._j2cstr( s );
	}
	var m = (s[0] == _CHAR( '-' )) ? 1 : 0;
	var ss = m;
	while( s[ss] >= _CHAR_CODE_0 && s[ss] <= _CHAR_CODE_9 ){ ss++; }
	if( ss == 0 ){
		n[0] = 0;
		return;
	}
	var x = 0; k = 1;
	var nn = 0;
	do {
		x += (s[--ss] - _CHAR_CODE_0) * k; k *= 10;
		if( k == _MP_ELEMENT ){
			n[++nn] = x;
			x = 0; k = 1;
		}
	} while( ss > m );
	if( k > 1 ){
		n[++nn] = x;
	}
	this._setLen( n, (m == 1) ? -nn : nn );
};
_MultiPrec.prototype._sub = function( ret , a , b ){
	var la = this._getLen( a );
	var lb = this._getLen( b );
	ret[la] = 0;
	var r = 0, aa = 0, bb = 0, x = 0;
	var i;
	for( i = 1; i <= la; i++ ){
		x += a[++aa];
		if( i <= lb ){
			x -= b[++bb];
		}
		if( x >= 0 ){
			ret[++r] = x;
			x = 0;
		} else {
			ret[++r] = x + _MP_ELEMENT;
			x = -1;
		}
	}
	while( --i > 0 ){
		if( ret[r--] != 0 ){
			break;
		}
	}
	this._setLen( ret, i );
};
_MultiPrec.prototype.sub = function( ret , a , b ){
	a = this._clone( a );
	b = this._clone( b );
	if( a[0] < 0 && b[0] >= 0 ){
		b[0] = -b[0];
		this.add( ret, a, b );
		return;
	} else if( a[0] >= 0 && b[0] < 0 ){
		b[0] = -b[0];
		this.add( ret, a, b );
		return;
	} else if( a[0] < 0 && b[0] < 0 ){
		a[0] = -a[0];
		b[0] = -b[0];
		this.sub( ret, b, a );
		return;
	}
	if( this.cmp( a, b ) < 0 ){
		this._sub( ret, b, a );
		ret[0] = -ret[0];
	} else {
		this._sub( ret, a, b );
	}
};
window._DBL_EPSILON = _DBL_EPSILON;
window._NORMALIZE = _NORMALIZE;
window._RAND_MAX = _RAND_MAX;
window._ABS = _ABS;
window._ACOS = _ACOS;
window._ASIN = _ASIN;
window._ATAN = _ATAN;
window._ATAN2 = _ATAN2;
window._CEIL = _CEIL;
window._COS = _COS;
window._EXP = _EXP;
window._FLOOR = _FLOOR;
window._LOG = _LOG;
window._POW = _POW;
window._SIN = _SIN;
window._SQRT = _SQRT;
window._TAN = _TAN;
window.srand = srand;
window.rand = rand;
window._INT = _INT;
window._DIV = _DIV;
window._MOD = _MOD;
window._SHIFTL = _SHIFTL;
window._SHIFTR = _SHIFTR;
window._AND = _AND;
window._OR = _OR;
window._XOR = _XOR;
window._SIGNED = _SIGNED;
window._UNSIGNED = _UNSIGNED;
window._MODF = _MODF;
window._FACTORIAL = _FACTORIAL;
window._CHAR = _CHAR;
window._CHAR_CODE_0 = _CHAR_CODE_0;
window._CHAR_CODE_9 = _CHAR_CODE_9;
window._CHAR_CODE_LA = _CHAR_CODE_LA;
window._CHAR_CODE_LZ = _CHAR_CODE_LZ;
window._CHAR_CODE_UA = _CHAR_CODE_UA;
window._CHAR_CODE_UZ = _CHAR_CODE_UZ;
window._CHAR_CODE_EX = _CHAR_CODE_EX;
window._CHAR_CODE_COLON = _CHAR_CODE_COLON;
window._ISINF = _ISINF;
window._ISNAN = _ISNAN;
window._ISZERO = _ISZERO;
window._APPROX = _APPROX;
window._APPROX_M = _APPROX_M;
window._EPREC = _EPREC;
window._FPREC = _FPREC;
window._GCD = _GCD;
window._LCM = _LCM;
window.stringToFloat = stringToFloat;
window.stringToInt = stringToInt;
window.floatToExponential = floatToExponential;
window.floatToFixed = floatToFixed;
window.floatToString = floatToString;
window.floatToStringPoint = floatToStringPoint;
window.intToString = intToString;
window._Integer = _Integer;
window.newIntegerArray = newIntegerArray;
window._MP_DIGIT = _MP_DIGIT;
window._MP_ELEMENT = _MP_ELEMENT;
window._MP_PREC_MASK = _MP_PREC_MASK;
window._MP_LEN_COEF = _MP_LEN_COEF;
window._MP_FROUND_UP = _MP_FROUND_UP;
window._MP_FROUND_DOWN = _MP_FROUND_DOWN;
window._MP_FROUND_CEILING = _MP_FROUND_CEILING;
window._MP_FROUND_FLOOR = _MP_FROUND_FLOOR;
window._MP_FROUND_HALF_UP = _MP_FROUND_HALF_UP;
window._MP_FROUND_HALF_DOWN = _MP_FROUND_HALF_DOWN;
window._MP_FROUND_HALF_EVEN = _MP_FROUND_HALF_EVEN;
window._MultiPrec = _MultiPrec;
})( window );
