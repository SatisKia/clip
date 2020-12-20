/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 多倍長整数同士の減算

_MultiPrec.prototype._sub = function( ret/*Array*/, a/*Array*/, b/*Array*/ ){
	var la = this._getLen( a );
	var lb = this._getLen( b );
	ret[la] = 0;	// 配列の確保

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

_MultiPrec.prototype.sub = function( ret/*Array*/, a/*Array*/, b/*Array*/ ){
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
