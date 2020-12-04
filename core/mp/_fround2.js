_MultiPrec.prototype.fround2 = function( a/*Array*/, prec, even_flag ){
	var n = this._getPrec( a ) - prec;
	if( n < 1 ){
		return;
	}
	var aa = this._froundGet( a, n - 1 );
	var u = false;

	if( even_flag && _MOD( this._froundGet( a, n ), 2 ) == 1 && aa > 4 ){
		u = true;
	} else if( aa > 5 ){
		u = true;
	} else if( aa == 5 && n > 1 ){
		var i = 1 + _DIV( n - 1, _MP_DIGIT );
		if( _MOD( a[i], _POW( 10, _MOD( n - 1, _MP_DIGIT ) ) ) != 0 ){
			u = true;
		} else {
			for( i--; i > 0; i-- ){
				if( a[i] != 0 ){ u = true; break; }
			}
		}
	}

	if( u ){
		this._froundZero( a, n );
		this._froundUp( a, n );
	} else {
		this._froundZero( a, n - 1 );
		this._froundSet( a, n - 1, 0 );
	}
};