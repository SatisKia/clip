/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 文字列を多倍長浮動小数点数に変換する
_MultiPrec.prototype.fstr2num = function( n/*Array*/, s ){
	s = this._j2cstr( s );

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
	ss[j] = 0;	// 文字列終端を書き込む
	if( !this._str2num( n, ss ) ){
		return false;
	}

	var e = 0;
	for( ; i < l; i++ ){
		if( s[i] >= _CHAR_CODE_0 && s[i] <= _CHAR_CODE_9 ){
			e = e * 10 + (s[i] - _CHAR_CODE_0);
		} else {
			return false;
		}
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

	return true;
};
