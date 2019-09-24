/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Math.h"

var _DBL_EPSILON = 2.2204460492503131e-016;
var _NORMALIZE   = 0.434294481903251816668;	// 1/log 10
var _RAND_MAX    = 32767;

// 乱数
var _rand_next = 1;
function srand( seed ){
	_rand_next = seed;
}
function rand(){
	_rand_next = _UNSIGNED( _rand_next * 1103515245 + 12345, _UMAX_32 );
	return _MOD( _rand_next / ((_RAND_MAX + 1) * 2), _RAND_MAX + 1 );
}

// 診断
#ifdef DEBUG
function assert( expr ){
	if( !expr ) throw new Error();
}
#endif // DEBUG

// 整数値
function _INT( x ){
	if( x < 0.0 ){
		return Math.ceil( x );
	}
	return Math.floor( x );
}

// 整数演算
function _DIV( a, b/*符号なし整数値*/ ){
	if( a < 0 ){
		return Math.ceil( a / b );
	}
	return Math.floor( a / b );
}
function _MOD( a, b/*符号なし整数値*/ ){
	if( a < 0 ){
		a = -_INT( a );
		return -(a - Math.floor( a / b ) * b);
	}
	a = _INT( a );
	return a - Math.floor( a / b ) * b;
}
function _SHIFTL( a, b ){
	return a * Math.pow( 2, b );
}
function _SHIFTR( a, b ){
	return _DIV( a, Math.pow( 2, b ) );
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

// 符号付き整数値
function _SIGNED( x, umax ){
	var smax = umax / 2 - 1;
	var smin = -umax / 2;
	x = _MOD( x, umax );
	if( x > smax ) return x - umax;
	if( x < smin ) return x + umax;
	return x;
}

// 符号なし整数値
function _UNSIGNED( x, umax ){
	x = _MOD( x, umax );
	if( x < 0 ) return x + umax;
	return x;
}

// 文字コード
function _CHAR( chr ){
	return chr.charCodeAt( 0 );
}
var _CHAR_CODE_0     = _CHAR( '0' );
var _CHAR_CODE_1     = _CHAR( '1' );
var _CHAR_CODE_2     = _CHAR( '2' );
var _CHAR_CODE_3     = _CHAR( '3' );
var _CHAR_CODE_4     = _CHAR( '4' );
var _CHAR_CODE_5     = _CHAR( '5' );
var _CHAR_CODE_6     = _CHAR( '6' );
var _CHAR_CODE_7     = _CHAR( '7' );
var _CHAR_CODE_8     = _CHAR( '8' );
var _CHAR_CODE_9     = _CHAR( '9' );
var _CHAR_CODE_LA    = _CHAR( 'a' );	// Lowercase
var _CHAR_CODE_UA    = _CHAR( 'A' );	// Uppercase
var _CHAR_CODE_EX    = _CHAR( '!' );	// Exclamation
var _CHAR_CODE_COLON = _CHAR( ':' );

// 各種判定
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
	// NaNをゼロでないように判定させる処理
	return (_ISNAN( x ) || (x != 0.0)) ? false : true;
}
function _APPROX( x, y ){
	if( y == 0 ){
		return Math.abs( x ) < (_DBL_EPSILON * 4.0);
	}
	return Math.abs( (y - x) / y ) < (_DBL_EPSILON * 4.0);
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

// 有効桁数を求める
function _EPREC( x ){
	var p, q;
	var t, i;

	if( _ISINF( x ) || _ISNAN( x ) || _ISZERO( x ) ){
		return ( 0 );
	}

	q = 0;
	for( p = 0; ; p++ ){
		t = x * Math.pow( 10.0, p );
		i = _INT( t );
		if( (t - i) == 0.0 ){
			break;
		}
		if( i == 0 ){
			q++;
		}
	}

	if( q == 0 ){
		return p + _INT( Math.log( Math.abs( x ) ) * _NORMALIZE )/*整数部の桁数-1*/;
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
		t = x * Math.pow( 10.0, p );
		i = _INT( t );
		if( (t - i) == 0.0 ){
			break;
		}
	}

	return p;
}

// 最大公約数
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

// 最小公倍数
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

// 文字列を浮動小数点数値に変換する
function stringToFloat( str, top, stop/*_Integer*/ ){
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
			// そのまま下に流す
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

// 文字列を整数値に変換する
function stringToInt( str, top, stop/*_Integer*/, radix ){
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

// 浮動小数点数を文字列に変換する
function _floatString( str ){
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
	return _floatString( str );
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
	return _floatString( str );
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
	return _floatString( str );
}
function floatToStringPoint( val, width ){
	var str = floatToString( val, width );
	if( str.indexOf( "." ) < 0 ){
		str += ".0";
	}
	return str;
}

// 整数を文字列に変換する
function intToString( val, radix, width ){
	if( _ISNAN( val ) ){
		return val.toString();
	}

	if( (width == undefined) || (width <= 0) ){
		width = 1;
	}

	var chr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	// 符号をチェックして, 負の値の場合は正の値に変換する
	var swi = (val < 0);
	if( swi ){
		val = -val;
	}

	// 基数の変換メイン
	var str = "";
	while( val != 0 ){
		str += chr.charAt( _MOD( val, radix ) );
		val = _DIV( val, radix );
	}
	for( i = str.length; i < width; i++ ){
		str += "0";
	}

	// 符号を元に戻す
	if( swi ){
		str += "-";
	}

	// 文字列の反転
	var str2 = "";
	for( var i = str.length - 1; i >= 0; i-- ){
		str2 += str.charAt( i );
	}

	return str2;
}
