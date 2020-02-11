/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Global.h"

var _TOKEN_OP = [
	"[++]",
	"[--]",
	"[~]",
	"[!]",
	"[-]",
	"[+]",
	"++",
	"--",
	"*",
	"/",
	"%",
	"+",
	"-",
	"<<",
	">>",
	"<",
	"<=",
	">",
	">=",
	"==",
	"!=",
	"&",
	"^",
	"|",
	"&&",
	"||",
	"?",
	"=",
	"*=",
	"/=",
	"%=",
	"+=",
	"-=",
	"<<=",
	">>=",
	"&=",
	"|=",
	"^=",
	",",
	"**",
	"**="
];

var _TOKEN_FUNC = [
	"defined",
	"indexof",
	"isinf",
	"isnan",
	"rand",
	"time",
	"mktime",
	"tm_sec",
	"tm_min",
	"tm_hour",
	"tm_mday",
	"tm_mon",
	"tm_year",
	"tm_wday",
	"tm_yday",
	"tm_xmon",
	"tm_xyear",
	"a2d",
	"a2g",
	"a2r",
	"d2a",
	"d2g",
	"d2r",
	"g2a",
	"g2d",
	"g2r",
	"r2a",
	"r2d",
	"r2g",
	"sin",
	"cos",
	"tan",
	"asin",
	"acos",
	"atan",
	"atan2",
	"sinh",
	"cosh",
	"tanh",
	"asinh",
	"acosh",
	"atanh",
	"exp",
	"exp10",
	"ln",
	"log",
	"log10",
	"pow",
	"sqr",
	"sqrt",
	"ceil",
	"floor",
	"abs",
	"ldexp",
	"frexp",
	"modf",
	"int",
	"real",
	"imag",
	"arg",
	"norm",
	"conjg",
	"polar",
	"num",
	"denom",
	"row",
	"col",
	"trans",
	"gwidth",
	"gheight",
	"gcolor",
	"gcolor24",
	"gcx",
	"gcy",
	"wcx",
	"wcy",
	"gget",
	"wget",
	"gx",
	"gy",
	"wx",
	"wy",
	"call",
	"eval"
];

var _TOKEN_STAT = [
	"$LOOPSTART",
	"$LOOPEND",
	"$LOOPEND_I",
	"$LOOPEND_D",
	"$LOOPENDE",
	"$LOOPENDE_I",
	"$LOOPENDE_D",
	"do",
	"until",
	"while",
	"endwhile",
	"for",
	"for",
	"next",
	"func",
	"endfunc",
	"if",
	"elif",
	"else",
	"endif",
	"switch",
	"case",
	"default",
	"endswi",
	"breakswi",
	"continue",
	"break",
	"$CONTINUE",
	"$BREAK",
	"assert",
	"return",
	"$RETURN",
	"$RETURN_A"
];

var _TOKEN_COMMAND = [
	"efloat",
	"float",
	"gfloat",
	"ecomplex",
	"complex",
	"gcomplex",
	"prec",
	"fract",
	"mfract",
	"htime",
	"mtime",
	"time",
	"ftime",
	"fps",
	"char",
	"uchar",
	"short",
	"ushort",
	"long",
	"ulong",
	"int",
	"uint",
	"radix",
	"ptype",
	"rad",
	"deg",
	"grad",
	"angle",
	"ans",
	"assert",
	"warn",
	"param",
	"params",
	"define",
	"enum",
	"undef",
	"var",
	"array",
	"local",
	"global",
	"label",
	"parent",
	"real",
	"imag",
	"num",
	"denom",
	"mat",
	"trans",
	"srand",
	"localtime",
	"clear",
	"error",
	"print",
	"println",
	"sprint",
	"scan",
	"gworld",
	"gclear",
	"gcolor",
	"gfill",
	"gmove",
	"gtext",
	"gtextl",
	"gline",
	"gput",
	"gget",
	"gget24",
	"gupdate",
	"window",
	"wfill",
	"wmove",
	"wtext",
	"wtextl",
	"wline",
	"wput",
	"wget",
	"rectangular",
	"parametric",
	"polar",
	"logscale",
	"nologscale",
	"plot",
	"replot",
	"calculator",
	"include",
	"base",
	"namespace",
	"dump",
	"log"
];

var _TOKEN_SE = [
	"inc",
	"dec",
	"neg",
	"cmp",
	"not",
	"minus",
	"set",
	"setc",
	"setf",
	"setm",
	"mul",
	"div",
	"mod",
	"add",
	"adds",	// saturate
	"sub",
	"subs",	// saturate
	"pow",
	"shiftl",
	"shiftr",
	"and",
	"or",
	"xor",
	"lt",	// less than
	"le",
	"gt",	// greater than
	"ge",
	"eq",
	"neq",
	"logand",
	"logor",
	"mul_a",
	"div_a",
	"mod_a",
	"add_a",
	"adds_a",	// saturate
	"sub_a",
	"subs_a",	// saturate
	"pow_a",
	"shiftl_a",
	"shiftr_a",
	"and_a",
	"or_a",
	"xor_a",
	"lt_a",	// less than
	"le_a",
	"gt_a",	// greater than
	"ge_a",
	"eq_a",
	"neq_a",
	"logand_a",
	"logor_a",
	"cnd",
	"set_f",
	"set_t",
	"set_z",
	"loopstart",
	"loopend",
	"loopend_i",
	"loopend_d",
	"loopende",
	"loopende_i",
	"loopende_d",
	"continue",
	"break",
	"return",
	"return_a"
];

// トークン・データ
function __Token(){
	this._code   = 0;		// 識別コード
	this._token  = null;	// トークン値
	this._before = null;	// 前のトークン・データ
	this._next   = null;	// 次のトークン・データ
}

// カスタム・コマンド情報
var _custom_command     = new Array();
var _custom_command_num = 0;
function __CustomCommand(){
	this._name = new String();	// コマンド名
	this._id   = -1;			// コマンドID
}
function regCustomCommand( name, id ){
	_custom_command[_custom_command_num]       = new __CustomCommand();
	_custom_command[_custom_command_num]._name = name;
	_custom_command[_custom_command_num]._id   = id;
	_custom_command_num++;
}

// トークン管理クラス
function _Token(){
	// トークン・リスト
	this._top = null;
	this._end = null;
	this._get = null;
}

_Token.prototype = {

	// 文字列が角括弧(Square Bracket)付き演算子かどうかチェックする
	checkSqOp : function( string, op/*_Integer*/ ){
		switch( string.charAt( 0 ) ){
		case '+':
			if( string.length == 1 ){
				op.set( _CLIP_OP_PLUS );
				return true;
			}
			if( (string.length == 2) && (string.charAt( 1 ) == '+') ){
				op.set( _CLIP_OP_INCREMENT );
				return true;
			}
			break;
		case '-':
			if( string.length == 1 ){
				op.set( _CLIP_OP_MINUS );
				return true;
			}
			if( (string.length == 2) && (string.charAt( 1 ) == '-') ){
				op.set( _CLIP_OP_DECREMENT );
				return true;
			}
			break;
		case '~':
			if( string.length == 1 ){
				op.set( _CLIP_OP_COMPLEMENT );
				return true;
			}
			break;
		case '!':
			if( string.length == 1 ){
				op.set( _CLIP_OP_NOT );
				return true;
			}
			if( (string.length == 2) && (string.charAt( 1 ) == '=') ){	// 過去互換用に[!=]表記を残す
				op.set( _CLIP_OP_NOTEQUAL );
				return true;
			}
			break;
		case '<':	// 過去互換用に残す
			if( string.length == 1 ){
				op.set( _CLIP_OP_LESS );
				return true;
			}
			if( (string.length == 2) && (string.charAt( 1 ) == '=') ){
				op.set( _CLIP_OP_LESSOREQ );
				return true;
			}
			break;
		case '>':	// 過去互換用に残す
			if( string.length == 1 ){
				op.set( _CLIP_OP_GREAT );
				return true;
			}
			if( (string.length == 2) && (string.charAt( 1 ) == '=') ){
				op.set( _CLIP_OP_GREATOREQ );
				return true;
			}
			break;
		case '=':	// 過去互換用に残す
			if( (string.length == 2) && (string.charAt( 1 ) == '=') ){
				op.set( _CLIP_OP_EQUAL );
				return true;
			}
			break;
		case '&':	// 過去互換用に残す
			if( (string.length == 2) && (string.charAt( 1 ) == '&') ){
				op.set( _CLIP_OP_LOGAND );
				return true;
			}
			break;
		case '|':	// 過去互換用に残す
			if( (string.length == 2) && (string.charAt( 1 ) == '|') ){
				op.set( _CLIP_OP_LOGOR );
				return true;
			}
			break;
		}
		return false;
	},

	// 文字列が関数名かどうかチェックする
	checkFunc : function( string, func/*_Integer*/ ){
		func.set( _TOKEN_FUNC.indexOf( string ) );
		return (func.val() >= 0);
	},

	// 文字列が文かどうかチェックする
	checkStat : function( string, stat/*_Integer*/ ){
		stat.set( _TOKEN_STAT.indexOf( string ) );
		return (stat.val() >= 0);
	},

	// 文字列がコマンドかどうかチェックする
	checkCommand : function( string, command/*_Integer*/ ){
		command.set( _TOKEN_COMMAND.indexOf( string ) + 1 );
		if( command.val() >= 1 ){
				return true;
		}

		for( var i = 0; i < _custom_command_num; i++ ){
			if( string == _custom_command[i]._name ){
				command.set( _custom_command[i]._id );
				return true;
			}
		}

		return false;
	},

	// 文字列が単一式かどうかチェックする
	checkSe : function( string, se/*_Integer*/ ){
		se.set( _TOKEN_SE.indexOf( string ) + 1 );
		if( se.val() >= 1 ){
				return true;
		}

		if( this.checkFunc( string, se ) ){
			se.set( _CLIP_SE_FUNC + se.val() );
			return true;
		}

		return false;
	},

	// 文字列が定義定数かどうかチェックする
	checkDefine : function( string, value/*_Value*/ ){
		if( string == "DBL_EPSILON" ){ value.ass( _DBL_EPSILON ); return true; }
		if( string == "HUGE_VAL"    ){ value.ass( Number.MAX_VALUE ); return true; }
		if( string == "RAND_MAX"    ){ value.ass( _RAND_MAX ); return true; }
		if( string == "FALSE"       ){ value.ass( 0 ); return true; }
		if( string == "TRUE"        ){ value.ass( 1 ); return true; }
		if( string == "BG_COLOR"    ){ value.ass( gWorldBgColor() ); return true; }
		if( string == "TIME_ZONE"   ){ value.ass( (new Date()).getTimezoneOffset() * -60 ); return true; }
		if( string == "INFINITY"    ){ value.ass( Number.POSITIVE_INFINITY ); return true; }
		if( string == "NAN"         ){ value.ass( Number.NaN ); return true; }
		return false;
	},

	// 文字列を浮動小数点数値に変換する
	stringToValue : function( param, string, value/*_Value*/ ){
		var i, j;
		var swi;
		var top;
		var stop = new _Integer();
		var tmp = new Array( 4 );

		top = isCharEscape( string, 0 ) ? 1 : 0;
		switch( string.charAt( top ) ){
		case '+': top++  ; swi = false; break;
		case '-': top++  ; swi = true ; break;
		default : top = 0; swi = false; break;
		}

		if( string.charAt( top ) == '\'' ){
			value.ass( 0.0 );
			j = 0;
			for( i = 1; ; i++ ){
				if( top + i >= string.length ){
					break;
				}
				if( isCharEscape( string, top + i ) ){
					i++;
					if( top + i >= string.length ){
						break;
					}
					switch( string.charAt( top + i ) ){
					case 'b': tmp[0] = _CHAR( '\b' ); break;
					case 'f': tmp[0] = _CHAR( '\f' ); break;
					case 'n': tmp[0] = _CHAR( '\n' ); break;
					case 'r': tmp[0] = _CHAR( '\r' ); break;
					case 't': tmp[0] = _CHAR( '\t' ); break;
					case 'v': tmp[0] = _CHAR( '\v' ); break;
					default : tmp[0] = string.charCodeAt( top + i ); break;
					}
				} else {
					tmp[0] = string.charCodeAt( top + i );
				}
				value.ass( value.toFloat() * 256 + tmp[0] );
				j++;
				if( j >= 4 ){
					break;
				}
			}
			if( swi ){
				value.ass( value.minus() );
			}
		} else if( isCharEscape( string, top ) ){
			switch( string.charAt( top + 1 ) ){
			case 'b':
			case 'B':
				value.ass( stringToInt( string, top + 2, stop, 2 ) );
				if( stop.val() < string.length ){
					return false;
				}
				break;
			case '0':
				value.ass( stringToInt( string, top + 2, stop, 8 ) );
				if( stop.val() < string.length ){
					return false;
				}
				break;
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				value.ass( stringToInt( string, top + 1, stop, 10 ) );
				if( stop.val() < string.length ){
					return false;
				}
				break;
			case 'x':
			case 'X':
				value.ass( stringToInt( string, top + 2, stop, 16 ) );
				if( stop.val() < string.length ){
					return false;
				}
				break;
			default:
				return false;
			}
			if( swi ){
				value.ass( value.minus() );
			}
		} else {
			if( (param.mode() & _CLIP_MODE_COMPLEX) != 0 ){
				tmp[0] = stringToFloat( string, top, stop );
				switch( string.charAt( stop.val() ) ){
				case '\\':
				case _CHAR_UTF8_YEN:
				case '+':
				case '-':
					// 実数部
					if( stop.val() == top ){
						return false;
					}
					value.setReal( swi ? -tmp[0] : tmp[0] );

					// 虚数部
					if( isCharEscape( string, stop.val() ) ){
						stop.add( 1 );
					}
					switch( string.charAt( stop.val() ) ){
					case '+': swi = false; break;
					case '-': swi = true ; break;
					default : return false;
					}
					top = stop.val() + 1;
					tmp[0] = stringToFloat( string, top, stop );
					if( (string.charAt( stop.val() ) != 'i') && (string.charAt( stop.val() ) != 'I') ){
						return false;
					} else {
						if( stop.val() + 1 < string.length ){
							return false;
						}
						if( stop.val() == top ){
							value.setImag( swi ? -1.0 : 1.0 );
						} else {
							value.setImag( swi ? -tmp[0] : tmp[0] );
						}
					}

					break;
				case 'i':
				case 'I':
					if( stop.val() + 1 < string.length ){
						return false;
					}

					// 実数部
					value.setReal( 0.0 );

					// 虚数部
					if( stop.val() == top ){
						value.setImag( swi ? -1.0 : 1.0 );
					} else {
						value.setImag( swi ? -tmp[0] : tmp[0] );
					}

					break;
				default:
					if( stop.val() == top ){
						return false;
					}
					value.ass( swi ? -tmp[0] : tmp[0] );
					if( stop.val() < string.length ){
						switch( string.charAt( stop.val() ) ){
						case 'd': case 'D': value.angToAng( _ANG_TYPE_DEG , complexAngType() ); break;
						case 'g': case 'G': value.angToAng( _ANG_TYPE_GRAD, complexAngType() ); break;
						case 'r': case 'R': value.angToAng( _ANG_TYPE_RAD , complexAngType() ); break;
						default : return false;
						}
					}
					break;
				}
			} else if( (param.mode() & (_CLIP_MODE_FLOAT | _CLIP_MODE_FRACT)) != 0 ){
				tmp[0] = stringToFloat( string, top, stop );
				switch( string.charAt( stop.val() ) ){
				case '_':
				case '」':
					if( stop.val() == top ){
						return false;
					}
					value.fractSetMinus( swi );
					value.setNum( tmp[0] );

					if( isCharEscape( string, stop.val() + 1 ) ){
						top = stop.val() + 2;
					} else {
						top = stop.val() + 1;
					}
					tmp[0] = stringToFloat( string, top, stop );
					switch( string.charAt( stop.val() ) ){
					case '_':
					case '」':
						if( stop.val() == top ){
							return false;
						}

						if( isCharEscape( string, stop.val() + 1 ) ){
							top = stop.val() + 2;
						} else {
							top = stop.val() + 1;
						}
						tmp[1] = stringToFloat( string, top, stop );
						if( (tmp[0] < 0.0) || (tmp[1] < 0.0) ){
							return false;
						}
						value.setDenom( tmp[1] );
						value.setNum  ( value.num() * value.denom() + tmp[0] );
						value.fractReduce();
						break;
					default:
						if( tmp[0] < 0.0 ){
							return false;
						}
						value.setDenom( tmp[0] );
						value.fractReduce();
						break;
					}
					break;
				default:
					if( stop.val() == top ){
						return false;
					}
					value.ass( swi ? -tmp[0] : tmp[0] );
					break;
				}
				if( stop.val() < string.length ){
					switch( string.charAt( stop.val() ) ){
					case 'd': case 'D': value.angToAng( _ANG_TYPE_DEG , complexAngType() ); break;
					case 'g': case 'G': value.angToAng( _ANG_TYPE_GRAD, complexAngType() ); break;
					case 'r': case 'R': value.angToAng( _ANG_TYPE_RAD , complexAngType() ); break;
					default : return false;
					}
				}
			} else if( (param.mode() & _CLIP_MODE_TIME) != 0 ){
				var _break = false;
				for( i = 0; i < 4; i++ ){
					if( isCharEscape( string, top ) ){
						top++;
					}
					tmp[i] = stringToFloat( string, top, stop );
					if( stop.val() == top ){
						return false;
					}
					if( stop.val() >= string.length ){
						break;
					}
					switch( string.charAt( stop.val() ) ){
					case 'h':
					case 'H':
					case 'm':
					case 'M':
					case 's':
					case 'S':
					case 'f':
					case 'F':
						if( stop.val() + 1 < string.length ){
							return false;
						}
						_break = true;
						break;
					case ':':
						break;
					default:
						return false;
					}
					if( _break ){
						break;
					}
					top = stop.val() + 1;
				}
				value.timeSetMinus( swi );
				switch( i ){
				case 0:
					if( stop.val() < string.length ){
						switch( string.charAt( stop.val() ) ){
						case 'h': case 'H': value.setHour ( tmp[0] ); value.timeReduce(); break;
						case 'm': case 'M': value.setMin  ( tmp[0] ); value.timeReduce(); break;
						case 's': case 'S': value.setSec  ( tmp[0] ); value.timeReduce(); break;
						case 'f': case 'F': value.setFrame( tmp[0] ); value.timeReduce(); break;
						}
					} else {
						value.setSec( tmp[0] );
						value.timeReduce();
					}
					break;
				case 1:
					if( stop.val() < string.length ){
						switch( string.charAt( stop.val() ) ){
						case 'h': case 'H': return false;
						case 'm': case 'M': value.setHour( tmp[0] ); value.setMin  ( tmp[1] ); value.timeReduce(); break;
						case 's': case 'S': value.setMin ( tmp[0] ); value.setSec  ( tmp[1] ); value.timeReduce(); break;
						case 'f': case 'F': value.setSec ( tmp[0] ); value.setFrame( tmp[1] ); value.timeReduce(); break;
						}
					} else {
						switch( param.mode() ){
						case _CLIP_MODE_H_TIME:
						case _CLIP_MODE_M_TIME: value.setHour( tmp[0] ); value.setMin  ( tmp[1] ); value.timeReduce(); break;
						case _CLIP_MODE_S_TIME: value.setMin ( tmp[0] ); value.setSec  ( tmp[1] ); value.timeReduce(); break;
						case _CLIP_MODE_F_TIME: value.setSec ( tmp[0] ); value.setFrame( tmp[1] ); value.timeReduce(); break;
						}
					}
					break;
				case 2:
					if( stop.val() < string.length ){
						switch( string.charAt( stop.val() ) ){
						case 'h': case 'H':
						case 'm': case 'M': return false;
						case 's': case 'S': value.setHour( tmp[0] ); value.setMin( tmp[1] ); value.setSec  ( tmp[2] ); value.timeReduce(); break;
						case 'f': case 'F': value.setMin ( tmp[0] ); value.setSec( tmp[1] ); value.setFrame( tmp[2] ); value.timeReduce(); break;
						}
					} else {
						switch( param.mode() ){
						case _CLIP_MODE_H_TIME:
						case _CLIP_MODE_M_TIME:
						case _CLIP_MODE_S_TIME: value.setHour( tmp[0] ); value.setMin( tmp[1] ); value.setSec  ( tmp[2] ); value.timeReduce(); break;
						case _CLIP_MODE_F_TIME: value.setMin ( tmp[0] ); value.setSec( tmp[1] ); value.setFrame( tmp[2] ); value.timeReduce(); break;
						}
					}
					break;
				case 3:
					if( stop.val() < string.length ){
						switch( string.charAt( stop.val() ) ){
						case 'h': case 'H':
						case 'm': case 'M':
						case 's': case 'S': return false;
						case 'f': case 'F': value.setHour( tmp[0] ); value.setMin( tmp[1] ); value.setSec( tmp[2] ); value.setFrame( tmp[3] ); value.timeReduce(); break;
						}
					} else {
						switch( param.mode() ){
						case _CLIP_MODE_H_TIME:
						case _CLIP_MODE_M_TIME:
						case _CLIP_MODE_S_TIME:
						case _CLIP_MODE_F_TIME: value.setHour( tmp[0] ); value.setMin( tmp[1] ); value.setSec( tmp[2] ); value.setFrame( tmp[3] ); value.timeReduce(); break;
						}
					}
					break;
				}
			} else if( (param.mode() & _CLIP_MODE_INT) != 0 ){
				value.ass( stringToInt( string, top, stop, param.radix() ) );
				if( stop.val() < string.length ){
					return false;
				}
				if( swi ){
					value.ass( value.minus() );
				}
			}
		}

		return true;
	},

	// 浮動小数点数値を文字列に変換する
	_floatToString : function( param, value ){
		var str = "";
		var prec = param.prec();
		switch( param.mode() ){
		case _CLIP_MODE_E_FLOAT:
		case _CLIP_MODE_E_COMPLEX:
			str = floatToExponential( value, (prec == 0) ? _EPREC( value ) : prec );
			break;
		case _CLIP_MODE_F_FLOAT:
		case _CLIP_MODE_F_COMPLEX:
			str = floatToFixed( value, (prec == 0) ? _FPREC( value ) : prec );
			break;
		case _CLIP_MODE_G_FLOAT:
		case _CLIP_MODE_G_COMPLEX:
			str = floatToString( value, (prec == 0) ? 15 : prec );
			break;
		}
		return str;
	},

	valueToString : function( param, value, real/*_String*/, imag/*_String*/ ){
		switch( param.mode() ){
		case _CLIP_MODE_E_COMPLEX:
		case _CLIP_MODE_F_COMPLEX:
		case _CLIP_MODE_G_COMPLEX:
			if( _ISZERO( value.imag() ) ){
				real.set( this._floatToString( param, value.real() ) );
				imag.set( "" );
			} else if( _ISZERO( value.real() ) ){
				real.set( "" );
				imag.set( this._floatToString( param, value.imag() ) + "i" );
			} else {
				real.set( this._floatToString( param, value.real() ) );
				imag.set( (value.imag() > 0.0) ? "+" : "" );
				imag.add( this._floatToString( param, value.imag() ) + "i" );
			}
			break;
		case _CLIP_MODE_E_FLOAT:
		case _CLIP_MODE_F_FLOAT:
		case _CLIP_MODE_G_FLOAT:
			real.set( this._floatToString( param, value.real() ) );
			imag.set( "" );
			break;
		case _CLIP_MODE_M_FRACT:
			if( (value.denom() != 0) && (_DIV( value.num(), value.denom() ) != 0) ){
				if( _MOD( value.num(), value.denom() ) != 0 ){
					real.set( value.fractMinus() ? "-" : "" );
					real.add( _DIV( value.num(), value.denom() ) );
					real.add( "」" );
					real.add( _MOD( value.num(), value.denom() ) );
					real.add( "」" );
					real.add( value.denom() );
				} else {
					real.set( value.fractMinus() ? "-" : "" );
					real.add( _DIV( value.num(), value.denom() ) );
				}
				imag.set( "" );
				break;
			}
		case _CLIP_MODE_I_FRACT:
			if( value.denom() == 0 ){
				real.set( value.toFloat() );
			} else if( value.denom() == 1 ){
				real.set( value.fractMinus() ? "-" : "" );
				real.add( value.num() );
			} else {
				real.set( value.fractMinus() ? "-" : "" );
				real.add( value.num() );
				real.add( "」" );
				real.add( value.denom() );
			}
			imag.set( "" );
			break;
		case _CLIP_MODE_H_TIME:
			real.set( value.timeMinus() ? "-" : "" );
			real.add( ((value.hour() < 10.0) ? "0" : "") + value.hour() );
			imag.set( "" );
			break;
		case _CLIP_MODE_M_TIME:
			if( _INT( value.hour() ) != 0 ){
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.hour() < 10.0) ? "0" : "") + _INT( value.hour() ) );
				real.add( ":" );
				real.add( ((value.min () < 10.0) ? "0" : "") + value.min() );
			} else {
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.min() < 10.0) ? "0" : "") + value.min() );
			}
			imag.set( "" );
			break;
		case _CLIP_MODE_S_TIME:
			if( _INT( value.hour() ) != 0 ){
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.hour() < 10.0) ? "0" : "") + _INT( value.hour() ) );
				real.add( ":" );
				real.add( ((value.min () < 10.0) ? "0" : "") + _INT( value.min() ) );
				real.add( ":" );
				real.add( ((value.sec () < 10.0) ? "0" : "") + value.sec() );
			} else if( _INT( value.min() ) != 0 ){
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.min() < 10.0) ? "0" : "") + _INT( value.min() ) );
				real.add( ":" );
				real.add( ((value.sec() < 10.0) ? "0" : "") + value.sec() );
			} else {
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.sec() < 10.0) ? "0" : "") + value.sec() );
			}
			imag.set( "" );
			break;
		case _CLIP_MODE_F_TIME:
			if( _INT( value.hour() ) != 0 ){
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.hour () < 10.0) ? "0" : "") + _INT( value.hour() ) );
				real.add( ":" );
				real.add( ((value.min  () < 10.0) ? "0" : "") + _INT( value.min() ) );
				real.add( ":" );
				real.add( ((value.sec  () < 10.0) ? "0" : "") + _INT( value.sec() ) );
				real.add( ":" );
				real.add( ((value.frame() < 10.0) ? "0" : "") + value.frame() );
			} else if( _INT( value.min() ) != 0 ){
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.min  () < 10.0) ? "0" : "") + _INT( value.min() ) );
				real.add( ":" );
				real.add( ((value.sec  () < 10.0) ? "0" : "") + _INT( value.sec() ) );
				real.add( ":" );
				real.add( ((value.frame() < 10.0) ? "0" : "") + value.frame() );
			} else if( _INT( value.sec() ) != 0 ){
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.sec  () < 10.0) ? "0" : "") + _INT( value.sec() ) );
				real.add( ":" );
				real.add( ((value.frame() < 10.0) ? "0" : "") + value.frame() );
			} else {
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.frame() < 10.0) ? "0" : "") + value.frame() );
			}
			imag.set( "" );
			break;
		case _CLIP_MODE_S_CHAR:
			real.set( intToString( _SIGNED( value.toFloat(), _UMAX_8, _SMIN_8, _SMAX_8 ), param.radix() ) );
			imag.set( "" );
			break;
		case _CLIP_MODE_U_CHAR:
			real.set( intToString( _UNSIGNED( value.toFloat(), _UMAX_8 ), param.radix() ) );
			imag.set( "" );
			break;
		case _CLIP_MODE_S_SHORT:
			real.set( intToString( _SIGNED( value.toFloat(), _UMAX_16, _SMIN_16, _SMAX_16 ), param.radix() ) );
			imag.set( "" );
			break;
		case _CLIP_MODE_U_SHORT:
			real.set( intToString( _UNSIGNED( value.toFloat(), _UMAX_16 ), param.radix() ) );
			imag.set( "" );
			break;
		case _CLIP_MODE_S_LONG:
			real.set( intToString( _SIGNED( value.toFloat(), _UMAX_32, _SMIN_32, _SMAX_32 ), param.radix() ) );
			imag.set( "" );
			break;
		case _CLIP_MODE_U_LONG:
			real.set( intToString( _UNSIGNED( value.toFloat(), _UMAX_32 ), param.radix() ) );
			imag.set( "" );
			break;
		}
	},

	sepString : function( string/*_String*/, sep ){
		var src = new String();
		var dst = new String();
		var top;
		var end;
		var _float;
		var _break;
		var len;

		src = string.str();
		dst = "";
		top = 0;
		while( true ){
			_float = false;

			// 先頭を求める
			_break = false;
			for( ; top < src.length; top++ ){
				switch( src.charAt( top ) ){
				case '+':
				case '-':
				case '.':
				case 'e':
				case 'E':
				case 'i':
				case 'I':
				case '_':
				case '」':
				case ':':
					if( src.charAt( top ) == '.' ){
						_float = true;
					}
					dst += src.charAt( top );
					break;
				default:
					_break = true;
					break;
				}
				if( _break ){
					break;
				}
			}
			if( top >= src.length ){
				break;
			}

			// 末尾を求める
			_break = false;
			for( end = top + 1; end < src.length; end++ ){
				switch( src.charAt( end ) ){
				case '+':
				case '-':
				case '.':
				case 'e':
				case 'E':
				case 'i':
				case 'I':
				case '_':
				case '」':
				case ':':
					_break = true;
					break;
				}
				if( _break ){
					break;
				}
			}

			for( len = end - top; len > 0; len-- ){
				dst += src.charAt( top );
				top++;
				if( !_float && (len != 1) && ((len % 3) == 1) ){
					dst += sep;
				}
			}
		}

		string.set( dst );
	},

	// トークン文字列を確保する
	newToken : function( code, token ){
		switch( code ){
		case _CLIP_CODE_TOP:
		case _CLIP_CODE_END:
		case _CLIP_CODE_ARRAY_TOP:
		case _CLIP_CODE_ARRAY_END:
		case _CLIP_CODE_PARAM_ANS:
		case _CLIP_CODE_PARAM_ARRAY:
			return null;
		case _CLIP_CODE_CONSTANT:
			return dupValue( token );
		case _CLIP_CODE_MATRIX:
			return dupMatrix( token );
		}
		return token;
	},

	// トークン文字列を解放する
	delToken : function( code, token ){
		if( token != null ){
			switch( code ){
			case _CLIP_CODE_CONSTANT:
				deleteValue( token );
				break;
			case _CLIP_CODE_MATRIX:
				deleteMatrix( token );
				break;
			}
		}
	},

	// トークン文字列を確保する
	_newToken : function( cur, param, token, len, strToVal ){
		var i;
		var tmp;
		var code = new _Integer();

		switch( token.charCodeAt( 0 ) ){
		case _CLIP_CODE_TOP:
		case _CLIP_CODE_END:
		case _CLIP_CODE_ARRAY_TOP:
		case _CLIP_CODE_ARRAY_END:
		case _CLIP_CODE_PARAM_ARRAY:
			cur._code  = token.charCodeAt( 0 );
			cur._token = null;
			break;
		case _CLIP_CODE_OPERATOR:
			cur._code  = token.charCodeAt( 0 );
			cur._token = token.charCodeAt( 1 );
			break;
		default:
			if( token.charAt( 0 ) == '@' ){
				if( len == 1 ){
					cur._code  = _CLIP_CODE_ARRAY;
					cur._token = 0;
				} else if( (len > 2) && (token.charAt( 1 ) == '@') ){
					cur._code  = _CLIP_CODE_ARRAY;
					cur._token = token.charCodeAt( 2 );
				} else {
					cur._code  = _CLIP_CODE_VARIABLE;
					cur._token = token.charCodeAt( 1 );
				}
				break;
			}

			if( token.charAt( 0 ) == '&' ){
				if( len == 1 ){
					cur._code  = _CLIP_CODE_PARAM_ANS;
					cur._token = null;
					break;
				}
				// そのまま下に流す
			}

			tmp = token.substring( 0, len );

			if( tmp.charAt( 0 ) == '$' ){
				if( this.checkSe( tmp.substring( 1, len ).toLowerCase(), code ) ){
					switch( code.val() ){
					case _CLIP_SE_LOOPSTART:
						cur._code  = _CLIP_CODE_STATEMENT;
						cur._token = _CLIP_STAT_START;
						break;
					case _CLIP_SE_LOOPEND:
						cur._code  = _CLIP_CODE_STATEMENT;
						cur._token = _CLIP_STAT_END;
						break;
					case _CLIP_SE_LOOPEND_INC:
						cur._code  = _CLIP_CODE_STATEMENT;
						cur._token = _CLIP_STAT_END_INC;
						break;
					case _CLIP_SE_LOOPEND_DEC:
						cur._code  = _CLIP_CODE_STATEMENT;
						cur._token = _CLIP_STAT_END_DEC;
						break;
					case _CLIP_SE_LOOPENDEQ:
						cur._code  = _CLIP_CODE_STATEMENT;
						cur._token = _CLIP_STAT_ENDEQ;
						break;
					case _CLIP_SE_LOOPENDEQ_INC:
						cur._code  = _CLIP_CODE_STATEMENT;
						cur._token = _CLIP_STAT_ENDEQ_INC;
						break;
					case _CLIP_SE_LOOPENDEQ_DEC:
						cur._code  = _CLIP_CODE_STATEMENT;
						cur._token = _CLIP_STAT_ENDEQ_DEC;
						break;
					case _CLIP_SE_CONTINUE:
						cur._code  = _CLIP_CODE_STATEMENT;
						cur._token = _CLIP_STAT_CONTINUE2;
						break;
					case _CLIP_SE_BREAK:
						cur._code  = _CLIP_CODE_STATEMENT;
						cur._token = _CLIP_STAT_BREAK2;
						break;
					case _CLIP_SE_RETURN:
						cur._code  = _CLIP_CODE_STATEMENT;
						cur._token = _CLIP_STAT_RETURN2;
						break;
					case _CLIP_SE_RETURN_ANS:
						cur._code  = _CLIP_CODE_STATEMENT;
						cur._token = _CLIP_STAT_RETURN3;
						break;
					default:
						cur._code  = _CLIP_CODE_SE;
						cur._token = code.val();
						break;
					}
				} else {
					cur._code  = _CLIP_CODE_SE;
					cur._token = _CLIP_SE_NULL;
				}
			} else if( this.checkSqOp( tmp, code ) ){
				cur._code  = _CLIP_CODE_OPERATOR;
				cur._token = code.val();
			} else if( tmp.charAt( 0 ) == ':' ){
				cur._code = _CLIP_CODE_COMMAND;
				if( this.checkCommand( tmp.substring( 1, len ), code ) ){
					cur._token = code.val();
				} else {
					cur._token = _CLIP_COMMAND_NULL;
				}
			} else if( tmp.charAt( 0 ) == '!' ){
				cur._code  = _CLIP_CODE_EXTFUNC;
				cur._token = tmp.substring( 1, len );
			} else if( tmp.charAt( 0 ) == '"' ){
				cur._code  = _CLIP_CODE_STRING;
				cur._token = new String();
				for( i = 1; ; i++ ){
					if( i >= tmp.length ){
						break;
					}
					if( isCharEscape( tmp, i ) ){
						i++;
						if( i >= tmp.length ){
							break;
						}
						switch( tmp.charAt( i ) ){
						case 'b': cur._token += '\b'; break;
						case 'f': cur._token += '\f'; break;
						case 'n': cur._token += '\n'; break;
						case 'r': cur._token += '\r'; break;
						case 't': cur._token += '\t'; break;
						case 'v': cur._token += '\v'; break;
						default : cur._token += tmp.charAt( i ); break;
						}
					} else {
						cur._token += tmp.charAt( i );
					}
				}
			} else if( this.checkFunc( tmp, code ) ){
				cur._code  = _CLIP_CODE_FUNCTION;
				cur._token = code.val();
			} else if( this.checkStat( tmp, code ) ){
				cur._code  = _CLIP_CODE_STATEMENT;
				cur._token = code.val();
			} else {
				cur._code  = _CLIP_CODE_CONSTANT;
				cur._token = new _Value();
				if( this.checkDefine( tmp, cur._token ) ){
				} else if( strToVal && this.stringToValue( param, tmp, cur._token ) ){
				} else {
					cur._code  = _CLIP_CODE_LABEL;
					cur._topen = new String();
					cur._token = tmp;
				}
			}

			break;
		}
	},
	_newTokenValue : function( cur, value ){
		cur._code  = _CLIP_CODE_CONSTANT;
		cur._token = dupValue( value );
	},
	_newTokenMatrix : function( cur, value ){
		cur._code  = _CLIP_CODE_MATRIX;
		cur._token = dupMatrix( value );
	},

	// トークン文字列を解放する
	_delToken : function( cur ){
		this.delToken( cur._code, cur._token );
		cur._token = null;
	},

	// リストを検索する
	_searchList : function( num ){
		var tmp = 0;
		var cur = this._top;
		while( true ){
			if( cur == null ){
				return null;
			}
			if( tmp == num ){
				break;
			}
			tmp++;
			cur = cur._next;
		}
		return cur;
	},

	// トークンを追加する
	_addToken : function(){
		var tmp = new __Token();
		if( this._top == null ){
			// 先頭に登録する
			this._top = tmp;
			this._end = tmp;
		} else {
			// 最後尾に追加する
			tmp._before     = this._end;
			this._end._next = tmp;
			this._end       = tmp;
		}
		return tmp;
	},
	add : function( param, token, len, strToVal ){
		var tmp = this._addToken();
		this._newToken( tmp, param, token, len, strToVal );
	},
	addValue : function( value ){
		var tmp = this._addToken();
		this._newTokenValue( tmp, value );
	},
	addMatrix : function( value ){
		var tmp = this._addToken();
		this._newTokenMatrix( tmp, value );
	},
	addCode : function( code, token ){
		var tmp = this._addToken();
		tmp._code  = code;
		tmp._token = this.newToken( code, token );
	},

	// トークンを挿入する
	_insToken : function( cur ){
		var tmp = new __Token();
		tmp._before = cur._before;
		tmp._next   = cur;
		if( cur._before != null ){
			cur._before._next = tmp;
		} else {
			this._top = tmp;
		}
		cur._before = tmp;
		return tmp;
	},
	_ins : function( cur, param, token, len, strToVal ){
		if( cur == null ){
			this.add( param, token, len, strToVal );
		} else {
		var tmp = this._insToken( cur );
		this._newToken( tmp, param, token, len, strToVal );
		}
	},
	_insValue : function( cur, value ){
		if( cur == null ){
			this.addValue( value );
		} else {
		var tmp = this._insToken( cur );
		this._newTokenValue( tmp, value );
		}
	},
	_insMatrix : function( cur, value ){
		if( cur == null ){
			this.addMatrix( value );
		} else {
		var tmp = this._insToken( cur );
		this._newTokenMatrix( tmp, value );
		}
	},
	_insCode : function( cur, code, token ){
		if( cur == null ){
			this.addCode( code, token );
		} else {
		var tmp = this._insToken( cur );
		tmp._code  = code;
		tmp._token = this.newToken( code, token );
		}
	},
	ins : function( num, param, token, len, strToVal ){
		this._ins( this._searchList( num ), param, token, len, strToVal );
	},
	insValue : function( num, value ){
		this._insValue( this._searchList( num ), value );
	},
	insMatrix : function( num, value ){
		this._insMatrix( this._searchList( num ), value );
	},
	insCode : function( num, code, token ){
		this._insCode( this._searchList( num ), code, token );
	},

	// トークンを削除する
	del : function( num ){
		var tmp;

		if( (tmp = this._searchList( num )) == null ){
			return _CLIP_ERR_TOKEN;
		}

		if( tmp._before != null ){
			tmp._before._next = tmp._next;
		} else {
			this._top = tmp._next;
		}
		if( tmp._next != null ){
			tmp._next._before = tmp._before;
		} else {
			this._end = tmp._before;
		}

		// トークン文字列の解放
		this._delToken( tmp );

		return _CLIP_NO_ERR;
	},

	// 全トークンを削除する
	delAll : function(){
		var cur;
		var tmp;

		cur = top;
		while( cur != null ){
			tmp = cur;
			cur = cur._next;

			// トークン文字列の解放
			this._delToken( tmp );
		}
		this._top = null;
	},

	// 文字列をトークン毎に分割する
	separate : function( param, line, strToVal ){
		var cur;
		var token = new String();
		var len = 0;
		var strFlag = false;
		var topCount = 0;
		var formatSeFlag = false;

		// 全トークンを削除する
		this.delAll();

		cur = 0;
		while( cur < line.length ){
			if( isCharEscape( line, cur ) ){
				switch( line.charAt( cur + 1 ) ){
				case '0':
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
				case '9':
				case 'b':
				case 'B':
				case 'f':
				case 'n':
				case 'r':
				case 't':
				case 'v':
				case 'x':
				case 'X':
					break;
				case '\\':
				case _CHAR_UTF8_YEN:
					if( len == 0 ) token = new String();
					token += line.charAt( cur );
					len++;
					// そのまま下に流す
				default:
					cur++;
					if( cur >= line.length ){
						continue;
					}
					break;
				}
				if( len == 0 ) token = new String();
				token += line.charAt( cur );
				len++;
			} else if( (line.charAt( cur ) == '[') && !strFlag ){
				if( len > 0 ){
					this.add( param, token, len, strToVal );
					len = 0;
				}
				strFlag = true;
			} else if( (line.charAt( cur ) == ']') && strFlag ){
				if( len == 0 ){
					token = String.fromCharCode( _CLIP_CODE_PARAM_ARRAY );
					this.add( param, token, 1, strToVal );
				} else {
					this.add( param, token, len, strToVal );
					len = 0;
				}
				strFlag = false;
			} else if( strFlag ){
				if( len == 0 ) token = new String();
				token += line.charAt( cur );
				len++;
			} else {
				var curChar = line.charAt( cur );
				if( line.charCodeAt( cur ) == _CHAR_CODE_SPACE ){
					curChar = ' ';
				}
				switch( curChar ){
				case ' ':
				case '\t':
				case '\r':
				case '\n':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					break;
				case '(':
				case ')':
				case '{':
				case '}':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					switch( curChar ){
					case '(':
						token = String.fromCharCode( _CLIP_CODE_TOP );
						if( !formatSeFlag ){
							if( topCount >= 0 ){
								topCount++;
							}
						}
						break;
					case ')':
						token = String.fromCharCode( _CLIP_CODE_END );
						if( !formatSeFlag ){
							topCount--;
						}
						break;
					case '{':
						token = String.fromCharCode( _CLIP_CODE_ARRAY_TOP );
						formatSeFlag = true;
						break;
					case '}':
						token = String.fromCharCode( _CLIP_CODE_ARRAY_END );
						formatSeFlag = false;
						break;
					}
					this.add( param, token, 1, strToVal );
					break;
				case ':':
					if( len == 0 ) token = new String();
					token += curChar;
					len++;
					if( token.charAt( 0 ) == '@' ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					break;
				case '?':
				case '=':
				case ',':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					token = String.fromCharCode( _CLIP_CODE_OPERATOR );
					switch( curChar ){
					case '?': token += String.fromCharCode( _CLIP_OP_CONDITIONAL ); break;
					case ',': token += String.fromCharCode( _CLIP_OP_COMMA       ); break;
					case '=':
						if( line.charAt( cur + 1 ) == '=' ){
							token += String.fromCharCode( _CLIP_OP_EQUAL );
							cur++;
						} else {
							token += String.fromCharCode( _CLIP_OP_ASS );
						}
						break;
					}
					this.add( param, token, 2, strToVal );
					break;
				case '&':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					token = String.fromCharCode( _CLIP_CODE_OPERATOR );
					switch( line.charAt( cur + 1 ) ){
					case '&': token += String.fromCharCode( _CLIP_OP_LOGAND    ); cur++; break;
					case '=': token += String.fromCharCode( _CLIP_OP_ANDANDASS ); cur++; break;
					default : token += String.fromCharCode( _CLIP_OP_AND       );        break;
					}
					this.add( param, token, 2, strToVal );
					break;
				case '|':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					token = String.fromCharCode( _CLIP_CODE_OPERATOR );
					switch( line.charAt( cur + 1 ) ){
					case '|': token += String.fromCharCode( _CLIP_OP_LOGOR    ); cur++; break;
					case '=': token += String.fromCharCode( _CLIP_OP_ORANDASS ); cur++; break;
					default : token += String.fromCharCode( _CLIP_OP_OR       );        break;
					}
					this.add( param, token, 2, strToVal );
					break;
				case '*':
				case '/':
				case '%':
				case '^':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					token = String.fromCharCode( _CLIP_CODE_OPERATOR );
					if( line.charAt( cur + 1 ) == '=' ){
						switch( curChar ){
						case '*': token += String.fromCharCode( _CLIP_OP_MULANDASS ); break;
						case '/': token += String.fromCharCode( _CLIP_OP_DIVANDASS ); break;
						case '%': token += String.fromCharCode( _CLIP_OP_MODANDASS ); break;
						case '^':
							if( param._enableOpPow && ((param.mode() & _CLIP_MODE_INT) == 0) ){
								token += String.fromCharCode( _CLIP_OP_POWANDASS );
							} else {
								token += String.fromCharCode( _CLIP_OP_XORANDASS );
							}
							break;
						}
						cur++;
					} else {
						switch( curChar ){
						case '*':
							if( line.charAt( cur + 1 ) == '*' ){
								if( line.charAt( cur + 2 ) == '=' ){
									token += String.fromCharCode( _CLIP_OP_POWANDASS );
									cur += 2;
								} else {
									token += String.fromCharCode( _CLIP_OP_POW );
									cur++;
								}
							} else {
								token += String.fromCharCode( _CLIP_OP_MUL );
							}
							break;
						case '/': token += String.fromCharCode( _CLIP_OP_DIV ); break;
						case '%': token += String.fromCharCode( _CLIP_OP_MOD ); break;
						case '^':
							if( param._enableOpPow && ((param.mode() & _CLIP_MODE_INT) == 0) ){
								token += String.fromCharCode( _CLIP_OP_POW );
							} else {
								token += String.fromCharCode( _CLIP_OP_XOR );
							}
							break;
						}
					}
					this.add( param, token, 2, strToVal );
					break;
				case '+':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					token = String.fromCharCode( _CLIP_CODE_OPERATOR );
					switch( line.charAt( cur + 1 ) ){
					case '=': token += String.fromCharCode( _CLIP_OP_ADDANDASS  ); cur++; break;
					case '+': token += String.fromCharCode( _CLIP_OP_POSTFIXINC ); cur++; break;
					default : token += String.fromCharCode( _CLIP_OP_ADD        );        break;
					}
					this.add( param, token, 2, strToVal );
					break;
				case '-':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					token = String.fromCharCode( _CLIP_CODE_OPERATOR );
					switch( line.charAt( cur + 1 ) ){
					case '=': token += String.fromCharCode( _CLIP_OP_SUBANDASS  ); cur++; break;
					case '-': token += String.fromCharCode( _CLIP_OP_POSTFIXDEC ); cur++; break;
					default : token += String.fromCharCode( _CLIP_OP_SUB        );        break;
					}
					this.add( param, token, 2, strToVal );
					break;
				case '<':
				case '>':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					token = String.fromCharCode( _CLIP_CODE_OPERATOR );
					if( line.charAt( cur + 1 ) == curChar ){
						if( line.charAt( cur + 2 ) == '=' ){
							switch( curChar ){
							case '<': token += String.fromCharCode( _CLIP_OP_SHIFTLANDASS ); break;
							case '>': token += String.fromCharCode( _CLIP_OP_SHIFTRANDASS ); break;
							}
							cur += 2;
						} else {
							switch( curChar ){
							case '<': token += String.fromCharCode( _CLIP_OP_SHIFTL ); break;
							case '>': token += String.fromCharCode( _CLIP_OP_SHIFTR ); break;
							}
							cur++;
						}
					} else {
						if( line.charAt( cur + 1 ) == '=' ){
							switch( curChar ){
							case '<': token += String.fromCharCode( _CLIP_OP_LESSOREQ  ); break;
							case '>': token += String.fromCharCode( _CLIP_OP_GREATOREQ ); break;
							}
							cur++;
						} else {
							switch( curChar ){
							case '<': token += String.fromCharCode( _CLIP_OP_LESS  ); break;
							case '>': token += String.fromCharCode( _CLIP_OP_GREAT ); break;
							}
						}
					}
					this.add( param, token, 2, strToVal );
					break;
				case '!':
					if( line.charAt( cur + 1 ) == '=' ){
						if( len > 0 ){
							this.add( param, token, len, strToVal );
							len = 0;
						}
						token = String.fromCharCode( _CLIP_CODE_OPERATOR ) + String.fromCharCode( _CLIP_OP_NOTEQUAL );
						cur++;
						this.add( param, token, 2, strToVal );
					} else {
						if( len == 0 ) token = new String();
						token += curChar;
						len++;
					}
					break;
				case 'e':
				case 'E':
					if( ((param.mode() & _CLIP_MODE_INT) == 0) && (len > 0) ){
						if( (line.charAt( cur + 1 ) == '+') || (line.charAt( cur + 1 ) == '-') ){
							var _break = false;
							for( var i = 0; i < len; i++ ){
								switch( token.charAt( i ) ){
								case '+':
								case '-':
								case '0':
								case '1':
								case '2':
								case '3':
								case '4':
								case '5':
								case '6':
								case '7':
								case '8':
								case '9':
								case '.':
									break;
								default:
									_break = true;
									break;
								}
								if( _break ){
									break;
								}
							}
							if( !_break ){
								token += curChar;
								cur++;
								token += line.charAt( cur );
								len += 2;
								break;
							}
						}
					}
					// そのまま下に流す
				default:
					if( len == 0 ) token = new String();
					token += curChar;
					len++;
					break;
				}
			}
			cur++;
		}
		if( len > 0 ){
			this.add( param, token, len, strToVal );
		}

		if( this._top != null ){
			if( this._top._code == _CLIP_CODE_SE ){
				if( topCount != 0 ){
					return _CLIP_PROC_ERR_SE_OPERAND;
				}
			}
		}

		return _CLIP_NO_ERR;
	},

	// トークンを整える
	_checkOp : function( op ){
		switch( op ){
		case _CLIP_OP_POSTFIXINC:
		case _CLIP_OP_POSTFIXDEC:
			return 15;
		case _CLIP_OP_INCREMENT:
		case _CLIP_OP_DECREMENT:
		case _CLIP_OP_COMPLEMENT:
		case _CLIP_OP_NOT:
		case _CLIP_OP_MINUS:
		case _CLIP_OP_PLUS:
		case _CLIP_OP_POW:
			return 14;
		case _CLIP_OP_MUL:
		case _CLIP_OP_DIV:
		case _CLIP_OP_MOD:
			return 13;
		case _CLIP_OP_ADD:
		case _CLIP_OP_SUB:
			return 12;
		case _CLIP_OP_SHIFTL:
		case _CLIP_OP_SHIFTR:
			return 11;
		case _CLIP_OP_LESS:
		case _CLIP_OP_LESSOREQ:
		case _CLIP_OP_GREAT:
		case _CLIP_OP_GREATOREQ:
			return 10;
		case _CLIP_OP_EQUAL:
		case _CLIP_OP_NOTEQUAL:
			return 9;
		case _CLIP_OP_AND:
			return 8;
		case _CLIP_OP_XOR:
			return 7;
		case _CLIP_OP_OR:
			return 6;
		case _CLIP_OP_LOGAND:
			return 5;
		case _CLIP_OP_LOGOR:
			return 4;
		case _CLIP_OP_CONDITIONAL:
			return 3;
		case _CLIP_OP_ASS:
		case _CLIP_OP_MULANDASS:
		case _CLIP_OP_DIVANDASS:
		case _CLIP_OP_MODANDASS:
		case _CLIP_OP_ADDANDASS:
		case _CLIP_OP_SUBANDASS:
		case _CLIP_OP_SHIFTLANDASS:
		case _CLIP_OP_SHIFTRANDASS:
		case _CLIP_OP_ANDANDASS:
		case _CLIP_OP_ORANDASS:
		case _CLIP_OP_XORANDASS:
		case _CLIP_OP_POWANDASS:
			return 2;
		case _CLIP_OP_COMMA:
			return 1;
		}
		return 0;
	},
	_format : function( top, param, strToVal ){
		var level, topLevel;
		var assLevel = this._checkOp( _CLIP_OP_ASS );
		var retTop, retEnd;
		var tmpTop;
		var tmpEnd;

		// 演算子の優先順位に従って括弧を付ける
		var i;
		var cur = top;
		while( cur != null ){
			if( cur._code == _CLIP_CODE_OPERATOR ){
				// 自分自身の演算子の優先レベルを調べておく
				level = this._checkOp( cur._token );

				retTop = 0;
				retEnd = 0;

				// 前方検索
				i = 0;
				tmpTop = cur._before;
				while( tmpTop != null ){
					switch( tmpTop._code ){
					case _CLIP_CODE_TOP:
						if( i > 0 ){
							i--;
						} else {
							retTop = 1;
						}
						break;
					case _CLIP_CODE_END:
						i++;
						break;
					case _CLIP_CODE_STATEMENT:
						this._ins( tmpTop._next, param, String.fromCharCode( _CLIP_CODE_TOP ), 1, strToVal );
						retTop = 1;
						break;
					case _CLIP_CODE_OPERATOR:
						if( i == 0 ){
							topLevel = this._checkOp( tmpTop._token );
							if( ((topLevel == assLevel) && (level == assLevel)) || (topLevel < level) ){
								retTop = 2;
							}
						}
						break;
					}

					if( retTop == 2 ){
						// 後方検索
						i = 0;
						tmpEnd = cur._next;
						while( tmpEnd != null ){
							switch( tmpEnd._code ){
							case _CLIP_CODE_TOP:
								i++;
								break;
							case _CLIP_CODE_END:
								if( i > 0 ){
									i--;
								} else {
									retEnd = 1;
								}
								break;
							case _CLIP_CODE_OPERATOR:
								if( i == 0 ){
									if( this._checkOp( tmpEnd._token ) < topLevel ){
										retEnd = 2;
									}
								}
								break;
							}

							if( retEnd > 0 ){
								break;
							}
							tmpEnd = tmpEnd._next;
						}

						this._ins( tmpTop._next, param, String.fromCharCode( _CLIP_CODE_TOP ), 1, strToVal );
						if( retEnd > 0 ){
							this._ins( tmpEnd, param, String.fromCharCode( _CLIP_CODE_END ), 1, strToVal );
						}
					}

					if( retTop > 0 ){
						break;
					}
					tmpTop = tmpTop._before;
				}
			}
			cur = cur._next;
		}

		return _CLIP_NO_ERR;
	},
	_formatSe : function( param, strToVal ){
		var i;
		var tmpTop = null;
		var saveBefore;
		var saveNext;
		var ret;

		var cur = this._top;
		var cur2;
		while( cur != null ){
			if( cur._code == _CLIP_CODE_ARRAY_TOP ){
				cur._code = _CLIP_CODE_TOP;
				tmpTop = cur._next;
			} else if( cur._code == _CLIP_CODE_ARRAY_END ){
				cur._code = _CLIP_CODE_END;
				if( tmpTop == null ){
					return _CLIP_PROC_ERR_SE_OPERAND;
				} else {
					saveBefore = tmpTop._before;
					tmpTop._before = null;
					saveNext = cur._before._next;
					cur._before._next = null;
					if( (ret = this._format( tmpTop, param, strToVal )) != _CLIP_NO_ERR ){
						return ret;
					}
					tmpTop._before = saveBefore;

					// 括弧開きを整える
					i = 0;
					cur2 = tmpTop;
					while( cur2 != null ){
						switch( cur2._code ){
						case _CLIP_CODE_TOP:
							i++;
							break;
						case _CLIP_CODE_END:
							i--;
							for( ; i < 0; i++ ){
								this._ins( tmpTop, param, String.fromCharCode( _CLIP_CODE_TOP ), 1, strToVal );
							}
							break;
						}
						cur2 = cur2._next;
					}

					cur._before._next = saveNext;

					// 括弧閉じを整える
					for( ; i > 0; i-- ){
						this._ins( cur, param, String.fromCharCode( _CLIP_CODE_END ), 1, strToVal );
					}

					tmpTop = null;
				}
			}
			cur = cur._next;
		}
		if( tmpTop != null ){
			return _CLIP_PROC_ERR_SE_OPERAND;
		}

		return _CLIP_NO_ERR;
	},
	format : function( param, strToVal ){
		var ret;

		if( this._top != null ){
			if( this._top._code == _CLIP_CODE_SE ){
				return this._formatSe( param, strToVal );
			} else if( this._top._code == _CLIP_CODE_STATEMENT ){
				switch( this._top._token ){
				case _CLIP_STAT_START:
				case _CLIP_STAT_END:
				case _CLIP_STAT_END_INC:
				case _CLIP_STAT_END_DEC:
				case _CLIP_STAT_ENDEQ:
				case _CLIP_STAT_ENDEQ_INC:
				case _CLIP_STAT_ENDEQ_DEC:
				case _CLIP_STAT_CONTINUE2:
				case _CLIP_STAT_BREAK2:
				case _CLIP_STAT_RETURN2:
				case _CLIP_STAT_RETURN3:
					return this._formatSe( param, strToVal );
				case _CLIP_STAT_DO:
				case _CLIP_STAT_ENDWHILE:
				case _CLIP_STAT_NEXT:
				case _CLIP_STAT_ENDFUNC:
				case _CLIP_STAT_ELSE:
				case _CLIP_STAT_ENDIF:
				case _CLIP_STAT_DEFAULT:
				case _CLIP_STAT_ENDSWI:
				case _CLIP_STAT_BREAKSWI:
				case _CLIP_STAT_CONTINUE:
				case _CLIP_STAT_BREAK:
					if( this._top._next != null ){
						return _CLIP_PROC_WARN_DEAD_TOKEN;
					}
					return _CLIP_NO_ERR;
				}
			}
		}

		// 演算子の優先順位に従って括弧を付ける
		if( (ret = this._format( this._top, param, strToVal )) != _CLIP_NO_ERR ){
			return ret;
		}

		// 括弧を整える
		var i = 0;
		var cur = this._top;
		while( cur != null ){
			switch( cur._code ){
			case _CLIP_CODE_TOP:
				i++;
				break;
			case _CLIP_CODE_END:
				i--;
				for( ; i < 0; i++ ){
					this._ins( this._top, param, String.fromCharCode( _CLIP_CODE_TOP ), 1, strToVal );
				}
				break;
			}
			cur = cur._next;
		}
		for( ; i > 0; i-- ){
			this.add( param, String.fromCharCode( _CLIP_CODE_END ), 1, strToVal );
		}

		return _CLIP_NO_ERR;
	},

	// トークン・リストを構築する
	regString : function( param, line, strToVal ){
		var ret;
		if( (ret = this.separate( param, line, strToVal )) != _CLIP_NO_ERR ){
			return ret;
		}
		if( (ret = this.format( param, strToVal )) != _CLIP_NO_ERR ){
			return ret;
		}
		return _CLIP_NO_ERR;
	},

	// トークン・リストをコピーする
	dup : function( dst/*_Token*/ ){
		var srcCur;
		var dstCur;
		var tmp;

		// 初期化
		dst._top = null;
		dst._end = null;
		dst._get = null;

		if( this._top != null ){
			// 先頭に登録する
			dstCur   = new __Token();
			dst._top = dstCur;

			dstCur._code  = this._top._code;
			dstCur._token = this.newToken( this._top._code, this._top._token );

			srcCur = this._top._next;

			while( srcCur != null ){
				// 最後尾に追加する
				tmp          = new __Token();
				tmp._before  = dstCur;
				dstCur._next = tmp;
				dstCur       = tmp;

				dstCur._code  = srcCur._code;
				dstCur._token = this.newToken( srcCur._code, srcCur._token );

				srcCur = srcCur._next;
			}

			dstCur._next = null;
			dst._end     = dstCur;
		}

		return _CLIP_NO_ERR;
	},

	// カレント・トークンをロックする
	lock : function(){
		return this._get;
	},
	unlock : function( lock ){
		this._get = lock;
	},

	// トークンを確認する
	beginGetToken : function( num ){
		this._get = (num == undefined) ? this._top : this._searchList( num );
	},
	getToken : function( code/*_Integer*/, token/*_Void*/ ){
		if( this._get == null ){
			return false;
		}

		code .set( this._get._code  );
		token.set( this._get._token );

		this._get = this._get._next;
		return true;
	},
	getTokenParam : function( param, code/*_Integer*/, token/*_Void*/ ){
		if( this._get == null ){
			return false;
		}

		if( this._get._code == _CLIP_CODE_LABEL ){
			// 重要：関数、ローカル、グローバルの順にチェックすること！
			if( param._func.search( this._get._token, false, null ) != null ){
				// 関数
				code.set( this._get._code );
			} else if( param._var._label.checkLabel( this._get._token ) >= 0 ){
				// ローカル変数
				code.set( _CLIP_CODE_AUTO_VAR );
			} else if( param._array._label.checkLabel( this._get._token ) >= 0 ){
				// ローカル配列
				code.set( _CLIP_CODE_AUTO_ARRAY );
			} else if( globalParam()._var._label.checkLabel( this._get._token ) >= 0 ){
				// グローバル変数
				code.set( _CLIP_CODE_GLOBAL_VAR );
			} else if( globalParam()._array._label.checkLabel( this._get._token ) >= 0 ){
				// グローバル配列
				code.set( _CLIP_CODE_GLOBAL_ARRAY );
			} else {
				var value = new _Value();
				if( this.stringToValue( param, this._get._token, value ) ){
					this._get._code  = _CLIP_CODE_CONSTANT;
					this._get._token = dupValue( value );
				}
				code.set( this._get._code );
			}
		} else {
			code.set( this._get._code );
		}
		token.set( this._get._token );

		this._get = this._get._next;
		return true;
	},
	getTokenLock : function( code/*_Integer*/, token/*_Void*/ ){
		if( this._get == null ){
			return false;
		}

		code .set( this._get._code  );
		token.set( this._get._token );

		return true;
	},
	checkToken : function( code ){
		return (this._get != null) && (this._get._code != code);
	},
	skipToken : function(){
		if( this._get != null ){
			this._get = this._get._next;
		}
	},
	skipComma : function(){
		if( (this._get == null) || (this._get._code != _CLIP_CODE_OPERATOR) || (this._get._token != _CLIP_OP_COMMA) ){
			return false;
		}
		this._get = this._get._next;
		return true;
	},

	// トークン数を確認する
	count : function(){
		var ret = 0;
		var cur = this._top;
		while( cur != null ){
			ret++;
			cur = cur._next;
		}
		return ret;
	},

	// トークン文字列を確認する
	tokenString : function( param, code, token ){
		var string = new String();
		var real = new _String();
		var imag = new _String();
		var tmp = new String();
		var cur;

		switch( code ){
		case _CLIP_CODE_TOP:
			string = "(";
			break;
		case _CLIP_CODE_END:
			string = ")";
			break;
		case _CLIP_CODE_ARRAY_TOP:
			string = "{";
			break;
		case _CLIP_CODE_ARRAY_END:
			string = "}";
			break;
		case _CLIP_CODE_PARAM_ANS:
			string = "&";
			break;
		case _CLIP_CODE_PARAM_ARRAY:
			string = "[]";
			break;
		case _CLIP_CODE_VARIABLE:
			if( param._var._label._label[token] != null ){
				string = param._var._label._label[token];
			} else if( token == 0 ){
				string = "@";
			} else {
				string = "@" + String.fromCharCode( token );
			}
			break;
		case _CLIP_CODE_ARRAY:
			if( param._array._label._label[token] != null ){
				string = param._array._label._label[token];
			} else {
				string = "@@" + String.fromCharCode( token );
			}
			break;
		case _CLIP_CODE_AUTO_VAR:
		case _CLIP_CODE_AUTO_ARRAY:
		case _CLIP_CODE_GLOBAL_VAR:
		case _CLIP_CODE_GLOBAL_ARRAY:
		case _CLIP_CODE_LABEL:
			string = token;
			break;
		case _CLIP_CODE_OPERATOR:
			string = _TOKEN_OP[token];
			break;
		case _CLIP_CODE_SE:
			string = "$";
			if( token == _CLIP_SE_NULL ){
				break;
			} else if( token - 1 < _TOKEN_SE.length ){
				string += _TOKEN_SE[token - 1];
				break;
			}
			token -= _CLIP_SE_FUNC;
			// そのまま下に流す
		case _CLIP_CODE_FUNCTION:
			string += _TOKEN_FUNC[token];
			break;
		case _CLIP_CODE_STATEMENT:
			string = _TOKEN_STAT[token];
			break;
		case _CLIP_CODE_EXTFUNC:
			string = "!" + token;
			break;
		case _CLIP_CODE_COMMAND:
			string = ":";
			if( token != _CLIP_COMMAND_NULL ){
				if( token - 1 < _TOKEN_COMMAND.length ){
					string += _TOKEN_COMMAND[token - 1];
				} else {
					for( var i = 0; i < _custom_command_num; i++ ){
						if( token == _custom_command[i]._id ){
							string += _custom_command[i]._name;
						}
					}
				}
			}
			break;
		case _CLIP_CODE_CONSTANT:
			this.valueToString( param, token, real, imag );
			tmp = real.str() + imag.str();
			cur = 0;
			do {
				switch( tmp.charAt( cur ) ){
				case '-':
				case '+':
					string += '\\';
					break;
				}
				string += tmp.charAt( cur );
				cur++;
			} while( cur < tmp.length );
			break;
		case _CLIP_CODE_STRING:
			cur = 0;
			do {
				if( token.charAt( cur ) == ']' ){
					tmp += '\\';
				}
				tmp += token.charAt( cur );
				cur++;
			} while( cur < token.length );
			string = "[\"" + tmp + "]";
			break;
		default:
			string = "";
			break;
		}
		if( string.charAt( 0 ) == '$' ){
			return string.toUpperCase();
		}
		return string;
	}

};
