/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 多倍長浮動小数点数の平方根
// aが負の値の場合trueを返す。
_MultiPrec.prototype.fsqrt2 = function( ret/*Array*/, a/*Array*/, prec, order ){
	a = this.clone( a );
	if( this.fcmp( a, this.F( "0" ) ) > 0 ){
		var g = new Array();
		var h = new Array();
		var m = new Array();
		var n = new Array();
		var o = new Array();
		var p = new Array();
		var q = new Array();
		var r = new Array();
		var s = new Array();
		var t = new Array();
		var x = new Array();
		if( this.fcmp( a, this.F( "1" ) ) > 0 ){
			this.fdiv( t, this.F( "1" ), a, prec );
			this.set( x, t );
		} else {
			this.set( x, this.F( "1" ) );
		}
		this.fmul( t, x, x, prec );
		this.fmul( t, a, t, prec );
		this.fsub( h, this.F( "1" ), t );
		this.set( g, this.F( "1" ) );
		this.fdiv( m, this.F( "1" ), this.F( "2" ), prec );
		if( order >= 3 ){ this.fdiv( n, this.F( "3"  ), this.F( "8"   ), prec ); }
		if( order >= 4 ){ this.fdiv( o, this.F( "5"  ), this.F( "16"  ), prec ); }
		if( order >= 5 ){ this.fdiv( p, this.F( "35" ), this.F( "128" ), prec ); }
		if( order == 6 ){ this.fdiv( q, this.F( "63" ), this.F( "256" ), prec ); }
		do {
			switch( order ){
			case 6 : this.set( t, q ); break;
			case 5 : this.set( t, p ); break;
			case 4 : this.set( t, o ); break;
			case 3 : this.set( t, n ); break;
			default: this.set( t, m ); break;
			}
			switch( order ){
			case 6:
				this.fmul( t, h, t, prec );
				this.fadd( t, p, t );
				// そのまま下に流す
			case 5:
				this.fmul( t, h, t, prec );
				this.fadd( t, o, t );
				// そのまま下に流す
			case 4:
				this.fmul( t, h, t, prec );
				this.fadd( t, n, t );
				// そのまま下に流す
			case 3:
				this.fmul( t, h, t, prec );
				this.fadd( t, m, t );
			}
			this.fmul( t, h, t, prec );
			this.fmul( t, x, t, prec );
			this.fadd( x, x, t );
			this.set( g, h );
			this.fmul( t, x, x, prec );
			this.fmul( t, a, t, prec );
			this.fsub( h, this.F( "1" ), t );
			this.abs( r, h );
			this.abs( s, g );
		} while( this.fcmp( r, s ) < 0 );
		this.fmul( ret, a, x, prec );
		return false;
	}
	this.set( ret, this.F( "0" ) );
	return (this.fcmp( a, this.F( "0" ) ) != 0);
};
