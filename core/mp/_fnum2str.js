/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 多倍長浮動小数点数を文字列に変換する

_MultiPrec.prototype._fnum2str = function( s/*Array*/, n/*Array*/, prec ){
	n = this.clone( n );

	var p = this.getPrec( n );
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
	var pp = false;
	if( ss[0] == _CHAR( '-' ) ){
		s[j++] = ss[k++];
		l--;
	}
	if( l <= p ){
		s[j++] = _CHAR_CODE_0;
	}
	if( l < p ){
		s[j++] = _CHAR( '.' );
		pp = true;
		for( i = 0; i < p - l; i++ ){
			if( prec != undefined ){
				prec--;
				if( prec < 0 ){
					break;
				}
			}
			s[j++] = _CHAR_CODE_0;
		}
	}
	for( i = 0; i < l; i++ ){
		if( i == l - p ){
			s[j++] = _CHAR( '.' );
			pp = true;
		}
		if( pp ){
			if( prec != undefined ){
				prec--;
				if( prec < 0 ){
					break;
				}
			}
		}
		s[j++] = ss[k++];
	}
	s[j] = 0;
};

_MultiPrec.prototype.fnum2str = function( n/*Array*/, prec ){
	var array = new Array();
	this._fnum2str( array, n, prec );
	return this._c2jstr( array );
};
