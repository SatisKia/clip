/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 多倍長整数を文字列に変換する

_MultiPrec.prototype._num2str = function( s/*Array*/, n/*Array*/ ){
	var m = (n[0] < 0);

	var n0 = n[0];
	n[0] = this._getLen( n );
	if( n[0] == 0 ){
		s[0] = _CHAR_CODE_0;
		s[1] = 0;	// 文字列終端

		n[0] = n0;
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
	s[ss + 1] = 0;	// 文字列終端

	var t = 0;
	while( t < ss ){
		x = s[t]; s[t++] = s[ss]; s[ss--] = x;
	}

	n[0] = n0;
};

_MultiPrec.prototype.num2str = function( n/*Array*/ ){
	var array = new Array();
	this._num2str( array, n );
	return this._c2jstr( array );
};
