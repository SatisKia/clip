/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 多倍長整数同士の乗算

_MultiPrec.prototype._mul1n = function( ret/*Array*/, a/*Array*/, b, n ){
	ret[n + 1] = 0;	// 配列の確保
	var c, aa, r, i, x;
	for( c = 0, aa = 0, r = 0, i = 0; i < n; i++ ){
		x = a[++aa] * b + c;
		ret[++r] = _MOD( x, _MP_ELEMENT ); c = _DIV( x, _MP_ELEMENT );
	}
	ret[++r] = c;
	return c;
};

_MultiPrec.prototype.mul = function( ret/*Array*/, a/*Array*/, b/*Array*/ ){
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
