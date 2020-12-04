// 多倍長整数同士の加算
_MultiPrec.prototype.add = function( ret/*Array*/, a/*Array*/, b/*Array*/ ){
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
	ret[lr + 1] = 0;	// 配列の確保

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
