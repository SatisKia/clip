/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 多倍長整数同士の除算。商qと余りrを得る。
// 除数bが0のときはtrueを返す。

_MultiPrec.prototype._mul1 = function( q/*Array*/, a/*Array*/, b ){
	q[a[0] + 1] = 0;	// 配列の確保
	var c, aa, qq, i, x;
	for( c = 0, aa = 0, qq = 0, i = 0; i < a[0]; i++ ){
		x = a[++aa] * b + c;
		q[++qq] = _MOD( x, _MP_ELEMENT ); c = _DIV( x, _MP_ELEMENT );
	}
	q[++qq] = c;
	q[0] = i; if( c > 0 ){ q[0]++; }
};

_MultiPrec.prototype._div1 = function( q/*Array*/, a/*Array*/, b ){
	q[0] = a[0];
	var c, aa, qq, i, x;
	for( c = 0, aa = a[0], qq = q[0], i = a[0]; i > 0; i-- ){
		x = _MP_ELEMENT * c + a[aa--];
		q[qq--] = _DIV( x, b ); c = _MOD( x, b );
	}
	if( q[q[0]] == 0 ){ q[0]--; }
	return c;
};

_MultiPrec.prototype._sub1 = function( a/*Array*/, b/*Array*/, aa, bb ){
	var c, t;
	for( c = 0, t = bb, bb = 0; bb < t; ){
		a[++aa] -= b[++bb] + c;
		c = 0;
		if( a[aa] < 0 ){ a[aa] += _MP_ELEMENT; c = 1; }
	}
	while( a[aa] == 0 ){ aa--; }
	a[0] = aa;
};

_MultiPrec.prototype.div = function( q/*Array*/, a/*Array*/, b/*Array*/, r/*Array*/ ){
	a = this.clone( a );
	b = this.clone( b );

	if( r == undefined ){
		r = new Array();
	}

	var k = 1;
	if( a[0] < 0 && b[0] >= 0 ){ k = -1; }
	if( b[0] < 0 && a[0] >= 0 ){ k = -1; }
	var l = (a[0] < 0) ? -1 : 1;

	a[0] = this.getLen( a );
	b[0] = this.getLen( b );
	q[0] = 0; r[0] = 0;

	var lq, lr;
	var K;
	var Q;	// 仮商

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

	// 正規化
	if( (K = _DIV( _MP_ELEMENT, b[b[0]] + 1 )) > 1 ){
		this._mul1( a, this.clone( a ), K );
		this._mul1( b, this.clone( b ), K );
	}

	q[0] = a[0] - b[0] + 1;
	for( var i = q[0]; i > 0; i-- ){ q[i] = 0; }
	var n = b[0];
	var m;
	var aa, bb, rr;
	while( (m = a[0]) >= n ){
		// 仮商Qを求める
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
				// a=a-b
				b[b[0] + 1] = 0;
				this._sub1( a, b, a[0] - b[0] - 1, b[0] );
				break;
			}

			// a=a-仮商(Q)*bを求める
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
		// 逆正規化
		this._div1( r, a, K );
	} else {
		this._copy( a, 0, r, 0, a[0] + 1 );
	}

	lq = q[0]; q[0] = 0; this._setLen( q, lq * k );
	lr = r[0]; r[0] = 0; this._setLen( r, lr * l );
	return false;
};
