var mp;

#include "math\_Complex.js"
#include "math\_MathEnv.js"

// 離散フーリエ変換
function dft( ret/*Array*/, ret_num, src/*Array*/, src_num ){
	var T = 6.28318530717958647692 / ret_num;
	var t, x, U, V;
	for( t = ret_num - 1; t >= 0; t-- ){
		U = T * t;
		ret[t] = new _Complex();
		for( x = 0; x < src_num; x++ ){
			V = U * x;
			ret[t]._re += src[x] * _COS( V );
			ret[t]._im -= src[x] * _SIN( V );
		}
	}
}

// 逆離散フーリエ変換
function idft( ret/*Array*/, ret_num, src/*Array*/, src_num ){
	var T = 6.28318530717958647692 / ret_num;
	var x, t, U, V;
	for( x = ret_num - 1; x >= 0; x-- ){
		U = T * x;
		ret[x] = 0;
		for( t = 0; t < src_num; t++ ){
			V = U * t;
			ret[x] += src[t]._re * _COS( V ) - src[t]._im * _SIN( V );
		}
		ret[x] /= ret_num;
	}
}

// 畳み込み
function conv( ret/*Array*/, ret_num, x/*Array*/, x_num, y/*Array*/, y_num ){
	var X = new Array();
	var Y = new Array();
	dft( X, ret_num, x, x_num );
	dft( Y, ret_num, y, y_num );

	for( var i = ret_num - 1; i >= 0; i-- ){
		X[i].mulAndAss( Y[i] );
	}

	idft( ret, ret_num, X, ret_num );
}

// 多倍長整数同士の乗算
function mul( ret/*Array*/, a/*Array*/, b/*Array*/ ){
	a = mp.clone( a );
	b = mp.clone( b );

	var k = 1;
	if( a[0] < 0 && b[0] >= 0 ){ k = -1; }
	if( b[0] < 0 && a[0] >= 0 ){ k = -1; }

	var la = mp.getLen( a );
	var lb = mp.getLen( b );
	if( la == 0 || lb == 0 ){
		ret[0] = 0;
		return;
	}
	var n = la + lb;

	var r = new Array();
	conv( r, n, a.slice( 1 ), la, b.slice( 1 ), lb );

	ret[n] = 0;	// 配列の確保
	var c = 0;
	var i, rr;
	for( i = 1; i < n; i++ ){
		rr = _INT( r[i - 1] + 0.5 ) + c;
		ret[i] = _MOD( rr, _MP_ELEMENT );
		c = _DIV( rr, _MP_ELEMENT );
	}
	ret[i] = c;

	mp._setLen( ret, (c != 0 ? n : n - 1) * k );
};

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
#include "param\_String.js"
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

var pi = new Array();
var a  = new Array();
var b  = new Array();
var t  = new Array();
var p  = new Array();
var start;
function pi_out5( prec, count, order ){
	var N = _DIV( _LOG( prec ), _LOG( 2 ) );	// 繰り返し回数。log2(prec)程度の反復でよい。
	var T = new Array();
	if( start == 0 ){
		mp.set( a, mp.F( "1" ) );
		switch( order ){
		case 0 : mp.fsqrt3( T, mp.F( "2" ), prec ); break;
		case 1 : mp.fsqrt ( T, mp.F( "2" ), prec ); break;
		default: mp.fsqrt2( T, mp.F( "2" ), prec, order ); break;
		}
		mp.fdiv( b, mp.F( "1" ), T, prec );
		mp.fdiv( t, mp.F( "1" ), mp.F( "4" ), prec );
		mp.set( p, mp.F( "1" ) );
	}
	var U = new Array();
	for( var i = 0; i < count; i++ ){
		mp.fadd( T, a, b );
		mp.fmul( U, T, mp.F( "0.5" ), prec );
		mp.fmul( T, a, b, prec );
		switch( order ){
		case 0 : mp.fsqrt3( b, T, prec ); break;
		case 1 : mp.fsqrt ( b, T, prec ); break;
		default: mp.fsqrt2( b, T, prec, order ); break;
		}
		mp.fsub( T, a, U );
		mp.fmul( T, T, T, prec );
		mp.fmul( T, p, T, prec );
		mp.fsub( t, t, T );
		mp.fmul( p, mp.F( "2" ), p, prec );
		mp.set( a, U );
		start++;
	}
	mp.fadd( T, a, b );
	mp.fmul( T, T, T, prec );
	mp.fmul( U, mp.F( "4" ), t, prec );
	mp.fdiv2( pi, T, U, prec );
	return (start < N);
}

function round( str, prec ){
	for( var i = 0; i <= 8; i++ ){
		con.print( "<td>" );
		var a = new Array();
		mp.fset( a, mp.F( str ) );
		mp.fround( a, prec, i );
		var tmp = mp.fnum2str( a, prec );
		if( tmp.charAt( 0 ) != '-' ){
			con.print( "&nbsp;" );
		}
		con.print( tmp + "</td>" );
	}
}

function main( id ){
	con = new _Console( id );

	// グローバル環境
	setMathEnv( new _MathEnv() );

	mp = new _MultiPrec();

	con.lock();

	try {
		testSqrt( 1000 );
		testRound1();
		testRound2();
	} catch( e ){
		catchError( e );
	}

	con.unlock();
}

function testSqrt( prec ){
	var i;

	for( var order = 0; order <= 7; order++ ){
		if( order != 0 ){
			con.println();
		}
		switch( order ){
		case 0 : con.print( "fsqrt3: " ); break;
		case 1 : con.print( "fsqrt: " ); break;
		case 7 : con.print( "fsqrt2 order=4 dft: " ); break;
		default: con.print( "fsqrt2 order=" + order + ": " ); break;
		}

		var time = (new Date()).getTime();
		start = 0;
		if( order == 7 ){
			mp.mul = mul;
			while( pi_out5( prec, 1, 4 ) ){}
		} else {
			while( pi_out5( prec, 1, order ) ){}
		}
		con.println( "" + ((new Date()).getTime() - time) + " ms" );
		var str = mp.fnum2str( pi, prec );

		var tmp = str.split( "." );
		con.println( tmp[0] + "." );
		if( tmp[1] ){
			for( i = 0; i < tmp[1].length; i += 100 ){
				con.println( tmp[1].substring( i, i + 100 ) );
			}
		}
	}

	con.println();
}

function testRound1(){
	con.print( "<table border='1' cellspacing='1' cellpadding='4'>" );
	con.print( "<tr>" );
	con.print( "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>" );
	con.print( "<td>UP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>" );
	con.print( "<td>DOWN&nbsp;&nbsp;&nbsp;</td>" );
	con.print( "<td>CEILING</td>" );
	con.print( "<td>FLOOR&nbsp;&nbsp;</td>" );
	con.print( "<td>H_UP&nbsp;&nbsp;&nbsp;</td>" );
	con.print( "<td>H_DOWN&nbsp;</td>" );
	con.print( "<td>H_EVEN&nbsp;</td>" );
	con.print( "<td>H_DOWN2</td>" );
	con.print( "<td>H_EVEN2</td>" );
	con.print( "</tr>" );
	con.print( "<tr><td>&nbsp;5.501</td>" ); round( "5.501" , 0 ); con.print( "</tr>" );
	con.print( "<tr><td>&nbsp;5.5</td>"   ); round( "5.5"   , 0 ); con.print( "</tr>" );
	con.print( "<tr><td>&nbsp;2.501</td>" ); round( "2.501" , 0 ); con.print( "</tr>" );
	con.print( "<tr><td>&nbsp;2.5</td>"   ); round( "2.5"   , 0 ); con.print( "</tr>" );
	con.print( "<tr><td>&nbsp;1.6</td>"   ); round( "1.6"   , 0 ); con.print( "</tr>" );
	con.print( "<tr><td>&nbsp;1.1</td>"   ); round( "1.1"   , 0 ); con.print( "</tr>" );
	con.print( "<tr><td>&nbsp;1.0</td>"   ); round( "1.0"   , 0 ); con.print( "</tr>" );
	con.print( "<tr><td>-1.0</td>"        ); round( "-1.0"  , 0 ); con.print( "</tr>" );
	con.print( "<tr><td>-1.1</td>"        ); round( "-1.1"  , 0 ); con.print( "</tr>" );
	con.print( "<tr><td>-1.6</td>"        ); round( "-1.6"  , 0 ); con.print( "</tr>" );
	con.print( "<tr><td>-2.5</td>"        ); round( "-2.5"  , 0 ); con.print( "</tr>" );
	con.print( "<tr><td>-2.501</td>"      ); round( "-2.501", 0 ); con.print( "</tr>" );
	con.print( "<tr><td>-5.5</td>"        ); round( "-5.5"  , 0 ); con.print( "</tr>" );
	con.print( "<tr><td>-5.501</td>"      ); round( "-5.501", 0 ); con.print( "</tr>" );
	con.print( "</table>" );

	con.println();
}

function testRound2(){
	var a = new Array();
	mp.fsqrt( a, mp.F( "2" ), 45 );

	var b = new Array();
	var s;
	for( var i = 0; i < 45; i++ ){
		s = mp.fnum2str( a, 45 );
		con.setColor( "0000ff" );
		con.print( s.substring( 0, i + 3 ) );
		con.setColor();
		con.println( s.substring( i + 3 ) );

		for( var mode = 0; mode <= 8; mode++ ){
			mp.fset( b, a );
			mp.fround( b, i, mode );
			s = mp.fnum2str( b, i );
			switch( mode ){
			case _MP_FROUND_UP        : con.print( "UP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" ); break;
			case _MP_FROUND_DOWN      : con.print( "DOWN&nbsp;&nbsp;&nbsp;" ); break;
			case _MP_FROUND_CEILING   : con.print( "CEILING" ); break;
			case _MP_FROUND_FLOOR     : con.print( "FLOOR&nbsp;&nbsp;" ); break;
			case _MP_FROUND_HALF_UP   : con.print( "H_UP&nbsp;&nbsp;&nbsp;" ); break;
			case _MP_FROUND_HALF_DOWN : con.print( "H_DOWN&nbsp;" ); break;
			case _MP_FROUND_HALF_EVEN : con.print( "H_EVEN&nbsp;" ); break;
			case _MP_FROUND_HALF_DOWN2: con.print( "H_DOWN2" ); break;
			case _MP_FROUND_HALF_EVEN2: con.print( "H_EVEN2" ); break;
			}
			con.println( "&nbsp;" + s );
		}
	}

	con.println();
}
