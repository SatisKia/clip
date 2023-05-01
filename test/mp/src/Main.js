var mp;

#include "math\_Complex.js"
#include "math\_MathEnv.js"

// 離散フーリエ変換
function dft( ret/*Array*/, ret_num, src/*Array*/, src_start, src_num ){
	var T = 6.28318530717958647692 / ret_num;
	var t, x, U, V;
	for( t = ret_num - 1; t >= 0; t-- ){
		U = T * t;
		ret[t] = new _Complex();
		for( x = 0; x < src_num; x++ ){
			V = U * x;
			ret[t]._re += src[src_start + x] * _COS( V );
			ret[t]._im -= src[src_start + x] * _SIN( V );
		}
	}
}

// 逆離散フーリエ変換
function idft( ret/*Array*/, ret_start, ret_num, src/*Array*/, src_num ){
	var T = 6.28318530717958647692 / ret_num;
	var x, t, U, V;
	var tmp;
	for( x = ret_num - 1; x >= 0; x-- ){
		U = T * x;
		tmp = 0;
		for( t = 0; t < src_num; t++ ){
			V = U * t;
			tmp += src[t]._re * _COS( V ) - src[t]._im * _SIN( V );
		}
		tmp /= ret_num;
		ret[ret_start + x] = _INT( tmp + 0.5 );
	}
}

// 畳み込み
function conv( ret/*Array*/, ret_start, ret_num, x/*Array*/, x_start, x_num, y/*Array*/, y_start, y_num ){
	var X = new Array();
	var Y = new Array();
	dft( X, ret_num, x, x_start, x_num );
	dft( Y, ret_num, y, y_start, y_num );

	for( var i = ret_num - 1; i >= 0; i-- ){
		X[i].mulAndAss( Y[i] );
	}

	idft( ret, ret_start, ret_num, X, ret_num );
}

// 多倍長整数同士の乗算
function mul( ret/*Array*/, a/*Array*/, b/*Array*/ ){
	a = mp.clone( a );
	b = mp.clone( b );

	var isMinus = false;
	if( a[0] < 0 && b[0] >= 0 ){ isMinus = true; }
	if( b[0] < 0 && a[0] >= 0 ){ isMinus = true; }

	var la = mp.getLen( a );
	var lb = mp.getLen( b );
	if( la == 0 || lb == 0 ){
		ret[0] = 0;
		return;
	}
	var n = la + lb;

	ret[n] = 0;	// 配列の確保
	conv( ret, 1, n, a, 1, la, b, 1, lb );

	var i = 1, c = 0, rr;
	for( ; i < n; i++ ){
		rr = ret[i] + c;
		ret[i] = _MOD( rr, _MP_ELEMENT );
		c = _DIV( rr, _MP_ELEMENT );
	}
	ret[i] = c;

	mp.setLen( ret, c != 0 ? n : n - 1, isMinus );
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

	con.lock();

	try {
		testSqrt( 1000 );
		testRound1();
		testRound2();
		testFactorial();
	} catch( e ){
		catchError( e );
	}

	con.unlock();
}

function testSqrt( prec ){
	var i, j;

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

		mp = new _MultiPrec();

		var time = (new Date()).getTime();
		pi = new Array();
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
				j = i + 100; if( j > tmp[1].length ) j = tmp[1].length;
				con.println( tmp[1].substring( i, j ) );
			}
		}
	}

	con.println();
}

function testRound1(){
	mp = new _MultiPrec();

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
	mp = new _MultiPrec();

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

		con.println();
	}
}

function _mpCombination( n, r ){
	n = _INT( n );
	r = _INT( r );

	var ret;

	ret = new Array();
	if( n < r ){
		mp.set( ret, mp.I( "0" ) );
		return ret;
	}
	if( n - r < r ) r = n - r;
	if( r == 0 ){
		mp.set( ret, mp.I( "1" ) );
		return ret;
	}
	if( r == 1 ){
		mp.str2num( ret, "" + n );
		return ret;
	}

	var numer = new Array( r );
	var denom = new Array( r );

	var i, k;
	var pivot;
	var offset;

	for( i = 0; i < r; i++ ){
		numer[i] = n - r + i + 1;
		denom[i] = i + 1;
	}

	for( k = 2; k <= r; k++ ){
		pivot = denom[k - 1];
		if( pivot > 1 ){
			offset = _MOD( n - r, k );
			for( i = k - 1; i < r; i += k ){
				numer[i - offset] = _DIV( numer[i - offset], pivot );
				denom[i] = _DIV( denom[i], pivot );
			}
		}
	}

	ret = new Array();
	mp.set( ret, mp.I( "1" ) );
	var ii = new Array();
	for( i = 0; i < r; i++ ){
		if( numer[i] > 1 ){
			mp.str2num( ii, "" + numer[i] );
			mp.mul( ret, ret, ii );
		}
	}
	return ret;
}
function _mpFactorial( n ){
	if( n == 0 ){
		var ret = new Array();
		mp.set( ret, mp.I( "1" ) );
		return ret;
	}
	var value = _mpFactorial( _DIV( n, 2 ) );
	mp.mul( value, value, value );
	mp.mul( value, value, _mpCombination( n, _DIV( n, 2 ) ) );
	if( (n & 1) != 0 ){
		var tmp = new Array();
		mp.str2num( tmp, "" + _DIV( n + 1, 2 ) );
		mp.mul( value, value, tmp );
	}
	return value;
}
function mpFactorial( ret/*Array*/, x ){
	var m = false;
	if( x < 0 ){
		m = true;
		x = 0 - x;
	}
	mp.str2num( ret, "1" );
	var ii = new Array();
	for( var i = 2; i <= x; i++ ){
		mp.str2num( ii, "" + i );
		mp.mul( ret, ret, ii );
	}
	if( m ){
		mp.neg( ret );
	}
}
function mpFactorial2( ret/*Array*/, x ){
	var m = false;
	if( x < 0 ){
		m = true;
		x = 0 - x;
	}
	mp.set( ret, _mpFactorial( x ) );
	if( m ){
		mp.neg( ret );
	}
}
function testFactorial(){
	mp = new _MultiPrec();

	var i, j;
	var time;
	var a;
	var s;

	time = (new Date()).getTime();
	a = new Array();
	mpFactorial( a, 999 );
	s = mp.num2str( a );
	for( i = 0; i < s.length; i += 100 ){
		j = i + 100; if( j > s.length ) j = s.length;
		con.println( s.substring( i, j ) );
	}
	con.println( "" + ((new Date()).getTime() - time) + " ms" );

	con.println();

	time = (new Date()).getTime();
	a = new Array();
	mpFactorial2( a, 999 );
	s = mp.num2str( a );
	for( i = 0; i < s.length; i += 100 ){
		j = i + 100; if( j > s.length ) j = s.length;
		con.println( s.substring( i, j ) );
	}
	con.println( "" + ((new Date()).getTime() - time) + " ms" );

	con.println();
}
