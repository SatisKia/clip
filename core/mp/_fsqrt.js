// 平方根 square root
// aが負の値の場合trueを返す。
_MultiPrec.prototype.fsqrt = function( ret/*Array*/, a/*Array*/, prec ){
	a = this._clone( a );
	if( this.fcmp( a, this.FCONST( "0" ) ) > 0 ){
		var l = new Array();
		var s = new Array();
		var t = new Array();
		if( this.fcmp( a, this.FCONST( "1" ) ) > 0 ){
			this.set( s, a );
		} else {
			this.set( s, this.FCONST( "1" ) );
		}
		do {
			this.set( l, s );
			this.fdiv2( t, a, s, prec );
			this.fadd( t, t, s );
			this.fmul( t, t, this.FCONST( "0.5" ), prec );
			this.set( s, t );
		} while( this.fcmp( s, l ) < 0 );
		this.set( ret, l );
		return false;
	}
	this.set( ret, this.FCONST( "0" ) );
	return (this.fcmp( a, this.FCONST( "0" ) ) != 0);
};
