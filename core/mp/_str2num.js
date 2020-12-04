// 文字列を多倍長整数に変換する
_MultiPrec.prototype.str2num = function( n/*Array*/, s ){
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