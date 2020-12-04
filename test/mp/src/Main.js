#include "param\_String.js"

#include "extras\_Console.js"
var con;
function onConsoleUpdate( id ){
}
function printBold( s ){
	con.setBold( true );
	con.println( s );
	con.setBold( false );
}
function printBlue( s ){
	con.setColor( "0000ff" );
	con.println( s );
	con.setColor();
}

#include "extras\_Error.js"
function onError( e ){
	con.setColor( "ff0000" );

	con.println( "<b>message:</b> " + e.message() );
	con.println( "<b>name:</b> " + e.name() );
	con.println( "<b>description:</b> " + e.description() );
	con.println( "<b>number:</b> " + e.number() );
	con.println( "<b>file:</b> " + e.file() );
	con.println( "<b>line:</b> " + e.line() );
	con.println( "<b>column:</b> " + e.column() );

	var tmp = new _String( e.stack() );
	tmp.escape().replaceNewLine( consoleBreak() );
	con.println( "<b>stack:</b> " + tmp.str() );

	con.setColor();
}

var mp;

var pi = new Array();
var a  = new Array();
var b  = new Array();
var n  = new Array();
var p  = new Array();
var t  = new Array();
var tt = new Array();
var u  = new Array();
var start;
function pi_out5( prec, count, order ){
	var N = _DIV( _LOG( prec ), _LOG( 2 ) );	// 繰り返し回数。log2(prec)程度の反復でよい。
	if( start == 0 ){
		mp.set( a, mp.FCONST( "1" ) );
		switch( order ){
		case 0 : mp.fsqrt3( tt, mp.FCONST( "2" ), prec ); break;
		case 1 : mp.fsqrt ( tt, mp.FCONST( "2" ), prec ); break;
		default: mp.fsqrt2( tt, mp.FCONST( "2" ), prec, order ); break;
		}
		mp.fdiv( b, mp.FCONST( "1" ), tt, prec );
		mp.fdiv( t, mp.FCONST( "1" ), mp.FCONST( "4" ), prec );
		mp.set( p, mp.FCONST( "1" ) );
	}
	for( var i = 0; i < count; i++ ){
		mp.fadd( tt, a, b );
		mp.fmul( n, tt, mp.FCONST( "0.5" ), prec );
		mp.fmul( tt, a, b, prec );
		switch( order ){
		case 0 : mp.fsqrt3( b, tt, prec ); break;
		case 1 : mp.fsqrt ( b, tt, prec ); break;
		default: mp.fsqrt2( b, tt, prec, order ); break;
		}
		mp.fsub( tt, a, n );
		mp.fmul( tt, tt, tt, prec );
		mp.fmul( tt, p, tt, prec );
		mp.fsub( t, t, tt );
		mp.fmul( p, mp.FCONST( "2" ), p, prec );
		mp.set( a, n );
		start++;
	}
	mp.fadd( tt, a, b );
	mp.fmul( tt, tt, tt, prec );
	mp.fmul( u, mp.FCONST( "4" ), t, prec );
	mp.fdiv2( pi, tt, u, prec );
	return (start < N);
}

function main( id ){
	con = new _Console( id );

	mp = new _MultiPrec();

	for( var order = 0; order <= 6; order++ ){
		if( order != 0 ){
			con.println();
		}
		switch( order ){
		case 0 : con.print( "fsqrt3: " ); break;
		case 1 : con.print( "fsqrt: " ); break;
		default: con.print( "fsqrt2 order=" + order + ": " ); break;
		}

		var time = (new Date()).getTime();
		start = 0;
		while( pi_out5( 1000, 1, order ) ){}
		con.println( "" + ((new Date()).getTime() - time) + " ms" );
		var str = mp.fnum2str( pi );

		var tmp = str.split( "." );
		con.println( tmp[0] + "." );
		if( tmp[1] ){
			for( var i = 0; i < tmp[1].length; i += 100 ){
				con.println( tmp[1].substring( i, i + 100 ) );
			}
		}
	}
}
