#include "param\_Float.js"
#include "param\_Integer.js"
#include "param\_String.js"

#include "math\_Complex.js"
#include "math\_Fract.js"
#include "math\_Math.js"
#include "math\_MathEnv.js"
#include "math\_Matrix.js"
#include "math\_Time.js"
#include "math\_Value.js"

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

function test( s, b ){
	var ss = s;
	if( ss.length > 0 ) ss += " ";
	ss += b ? "OK" : "NG";
	if( !b ) con.setColor( "ff0000" );
	con.println( ss );
	con.setColor();
}

function toString( x ){
	var s = "";
	if( x instanceof Array ){
		for( var i = 0; i < x.length; i++ ){
			if( i != 0 ){
				s += ", ";
			}
			s += "" + x[i];
		}
	} else if( x instanceof _Complex ){
		s += "( " + x.real() + ", " + x.imag() + " )";
	} else if( x instanceof _Value ){
		if( x.imag() == 0.0 ){
			s += "" + x.real();
		} else {
			s += "( " + x.real() + ", " + x.imag() + " )";
		}
	} else if( x instanceof _Matrix ){
		var i, j;
		for( i = 0; i < x._row; i++ ){
			s += (i == 0) ? "[[ " : "[ ";
			for( j = 0; j < x._col; j++ ){
				if( j != 0 ){
					s += ", ";
				}
				s += toString( x.val( i, j ) );
			}
			s += (i == x._row - 1) ? " ]]" : " ],";
		}
	} else {
		s += "" + x;
	}
	return s;
}

var time;
function startTest( str ){
	time = (new Date()).getTime();
	printBold( str );
}
function endTest(){
	printBold( "" + ((new Date()).getTime() - time) + " ms" );
	con.println();
}

function main( id ){
	con = new _Console( id );

	// グローバル環境
	setMathEnv( new _MathEnv() );

	con.lock();

	try {
		testMath1();
		testMath2();
		testMath3();
		testComplex();
		testMatrix();
	} catch( e ){
		catchError( e );
	}

	con.unlock();
}

// すべてのセミ数値演算関数のテスト
function testMath1(){
	startTest( "[testing function, part 1]" );

	var x = new _Integer();
	var y = new _Float();

	printBold( "ceil" );
	test( "", floatToValue( -5.1 ).ceil().equal( -5.0 ) );
	test( "", floatToValue( -5.0 ).ceil().equal( -5.0 ) );
	test( "", floatToValue( -4.9 ).ceil().equal( -4.0 ) );
	test( "", floatToValue( 0.0 ).ceil().equal( 0.0 ) );
	test( "", floatToValue( 4.9 ).ceil().equal( 5.0 ) );
	test( "", floatToValue( 5.0 ).ceil().equal( 5.0 ) );
	test( "", floatToValue( 5.1 ).ceil().equal( 6.0 ) );

	printBold( "abs" );
	test( "", floatToValue( -5.0 ).abs().equal( 5.0 ) );
	test( "", floatToValue( 0.0 ).abs().equal( 0.0 ) );
	test( "", floatToValue( 5.0 ).abs().equal( 5.0 ) );

	printBold( "floor" );
	test( "", floatToValue( -5.1 ).floor().equal( -6.0 ) );
	test( "", floatToValue( -5.0 ).floor().equal( -5.0 ) );
	test( "", floatToValue( -4.9 ).floor().equal( -5.0 ) );
	test( "", floatToValue( 0.0 ).floor().equal( 0.0 ) );
	test( "", floatToValue( 4.9 ).floor().equal( 4.0 ) );
	test( "", floatToValue( 5.0 ).floor().equal( 5.0 ) );
	test( "", floatToValue( 5.1 ).floor().equal( 5.0 ) );

	printBold( "mod" );
	test( "", floatToValue( -7.0 ).mod( 3.0 ).equal( -1.0 ) );
	test( "", floatToValue( -3.0 ).mod( 3.0 ).equal( 0.0 ) );
	test( "", floatToValue( -2.0 ).mod( 3.0 ).equal( -2.0 ) );
	test( "", floatToValue( 0.0 ).mod( 3.0 ).equal( 0.0 ) );
	test( "", floatToValue( 2.0 ).mod( 3.0 ).equal( 2.0 ) );
	test( "", floatToValue( 3.0 ).mod( 3.0 ).equal( 0.0 ) );
	test( "", floatToValue( 7.0 ).mod( 3.0 ).equal( 1.0 ) );

	printBold( "frexp" );
	test( "", _APPROX( floatToValue( -3.0 ).frexp( x ).toFloat(), -0.75 ) && (x._val == 2) );
	test( "", _APPROX( floatToValue( -0.5 ).frexp( x ).toFloat(), -0.5 ) && (x._val == 0) );
	test( "", floatToValue( 0.0 ).frexp( x ).equal( 0.0 ) && (x._val == 0) );
	test( "", _APPROX( floatToValue( 0.33 ).frexp( x ).toFloat(), 0.66 ) && (x._val == -1) );
	test( "", _APPROX( floatToValue( 0.66 ).frexp( x ).toFloat(), 0.66 ) && (x._val == 0) );
	test( "", _APPROX( floatToValue( 96.0 ).frexp( x ).toFloat(), 0.75 ) && (x._val == 7) );

	printBold( "ldexp" );
	test( "", floatToValue( -3.0 ).ldexp( 4 ).equal( -48.0 ) );
	test( "", floatToValue( -0.5 ).ldexp( 0 ).equal( -0.5 ) );
	test( "", floatToValue( 0.0 ).ldexp( 36 ).equal( 0.0 ) );
	test( "", _APPROX( floatToValue( 0.66 ).ldexp( -1 ).toFloat(), 0.33 ) );
	test( "", floatToValue( 96 ).ldexp( -3 ).equal( 12.0 ) );

	printBold( "modf" );
	test( "", floatToValue( -11.7 ).modf( y ).equal( -0.7 ) && (y._val == -11.0) );
	test( "", floatToValue( -0.5 ).modf( y ).equal( -0.5 ) && (y._val == 0.0) );
	test( "", floatToValue( 0.0 ).modf( y ).equal( 0.0 ) && (y._val == 0.0) );
	test( "", floatToValue( 0.6 ).modf( y ).equal( 0.6 ) && (y._val == 0.0) );
	test( "", floatToValue( 12.0 ).modf( y ).equal( 0.0 ) && (y._val == 12.0) );

	endTest();
}

// さまざまなπ/4の倍数に対するすべての三角関数のテスト
function testMath2(){
	startTest( "[testing function, part 2]" );

	var piby4   = 0.78539816339744830962;
	var rthalf  = 0.70710678118654752440;
	var DBL_MAX = 1.7976931348623158e+308;

	printBold( "facos" );
	test( "", _APPROX( facos( -1.0 ), 4.0 * piby4 ) );
	test( "", _APPROX( facos( -rthalf ), 3.0 * piby4 ) );
	test( "", _APPROX( facos( 0.0 ), 2.0 * piby4 ) );
	test( "", _APPROX( facos( rthalf ), piby4 ) );
	test( "", _APPROX( facos( 1.0 ), 0.0 ) );

	printBold( "fasin" );
	test( "", _APPROX( fasin( -1.0 ), -2.0 * piby4 ) );
	test( "", _APPROX( fasin( -rthalf ), -piby4 ) );
	test( "", _APPROX( fasin( 0.0 ), 0.0 ) );
	test( "", _APPROX( fasin( rthalf ), piby4 ) );
	test( "", _APPROX( fasin( 1.0 ), 2.0 * piby4 ) );

	printBold( "fatan" );
	test( "", _APPROX( fatan( -DBL_MAX ), -2.0 * piby4 ) );
	test( "", _APPROX( fatan( -1.0 ), -piby4 ) );
	test( "", _APPROX( fatan( 0.0 ), 0.0 ) );
	test( "", _APPROX( fatan( 1.0 ), piby4 ) );
	test( "", _APPROX( fatan( DBL_MAX ), 2.0 * piby4 ) );

	printBold( "fatan2" );
	test( "", _APPROX( fatan2( -1.0, -1.0 ), -3.0 * piby4 ) );
	test( "", _APPROX( fatan2( -1.0, 0.0 ), -2.0 * piby4 ) );
	test( "", _APPROX( fatan2( -1.0, 1.0 ), -piby4 ) );
	test( "", _APPROX( fatan2( 0.0, 1.0 ), 0.0 ) );
	test( "", _APPROX( fatan2( 1.0, 1.0 ), piby4 ) );
	test( "", _APPROX( fatan2( 1.0, 0.0 ), 2.0 * piby4 ) );
	test( "", _APPROX( fatan2( 1.0, -1.0 ), 3.0 * piby4 ) );
	test( "", _APPROX( fatan2( 0.0, -1.0 ), 4.0 * piby4 ) || _APPROX( fatan2( 0.0, -1.0 ), -4.0 * piby4 ) );

	printBold( "fcos" );
	test( "", _APPROX( fcos( -3.0 * piby4 ), -rthalf ) );
	test( "", _APPROX( fcos( -2.0 * piby4 ), 0.0 ) );
	test( "", _APPROX( fcos( -piby4 ), rthalf ) );
	test( "", _APPROX( fcos( 0.0 ), 1.0 ) );
	test( "", _APPROX( fcos( piby4 ), rthalf ) );
	test( "", _APPROX( fcos( 2.0 * piby4 ), 0.0 ) );
	test( "", _APPROX( fcos( 3.0 * piby4 ), -rthalf ) );
	test( "", _APPROX( fcos( 4.0 * piby4 ), -1.0 ) );

	printBold( "fsin" );
	test( "", _APPROX( fsin( -3.0 * piby4 ), -rthalf ) );
	test( "", _APPROX( fsin( -2.0 * piby4 ), -1.0 ) );
	test( "", _APPROX( fsin( -piby4 ), -rthalf ) );
	test( "", _APPROX( fsin( 0.0 ), 0.0 ) );
	test( "", _APPROX( fsin( piby4 ), rthalf ) );
	test( "", _APPROX( fsin( 2.0 * piby4 ), 1.0 ) );
	test( "", _APPROX( fsin( 3.0 * piby4 ), rthalf ) );
	test( "", _APPROX( fsin( 4.0 * piby4 ), 0.0 ) );

	printBold( "ftan" );
	test( "", _APPROX( ftan( -3.0 * piby4 ), 1.0 ) );
	test( "", _APPROX( ftan( -piby4 ), -1.0 ) );
	test( "", _APPROX( ftan( 0.0 ), 0.0 ) );
	test( "", _APPROX( ftan( piby4 ), 1.0 ) );
	test( "", _APPROX( ftan( 3.0 * piby4 ), -1.0 ) );

	endTest();
}

// 指数関数、対数関数、特殊べき乗関数のすべてのテスト
function testMath3(){
	startTest( "[testing function, part 3]" );

	var e      = 2.71828182845904523536;
	var ln2    = 0.69314718055994530942;
	var rthalf = 0.70710678118654752440;

	printBold( "facosh" );
	test( "", _APPROX( facosh( 1.0 ), 0.0 ) );
	test( "", _APPROX( facosh( (e + 1.0 / e) / 2.0 ), 1.0 ) );

	printBold( "fasinh" );
	test( "", _APPROX( fasinh( -(e - 1.0 / e) / 2.0 ), -1.0 ) );
	test( "", _APPROX( fasinh( 0.0 ), 0.0 ) );
	test( "", _APPROX( fasinh( (e - 1.0 / e) / 2.0 ), 1.0 ) );

	printBold( "fatanh" );
	test( "", _APPROX( fatanh( -(e * e - 1.0) / (e * e + 1.0) ), -1.0 ) );
	test( "", _APPROX( fatanh( 0.0 ), 0.0 ) );
	test( "", _APPROX( fatanh( (e * e - 1.0) / (e * e + 1.0) ), 1.0 ) );

	printBold( "fcosh" );
	test( "", _APPROX( fcosh( -1.0 ), (e + 1.0 / e) / 2.0 ) );
	test( "", _APPROX( fcosh( 0.0 ), 1.0 ) );
	test( "", _APPROX( fcosh( 1.0 ), (e + 1.0 / e) / 2.0 ) );

	printBold( "exp" );
	test( "", _APPROX( floatToComplex( -1.0 ).exp().toFloat(), 1.0 / e ) );
	test( "", _APPROX( floatToComplex( 0.0 ).exp().toFloat(), 1.0 ) );
	test( "", _APPROX( floatToComplex( ln2 ).exp().toFloat(), 2.0 ) );
	test( "", _APPROX( floatToComplex( 1.0 ).exp().toFloat(), e ) );
	test( "", _APPROX( floatToComplex( 3.0 ).exp().toFloat(), e * e * e ) );

	printBold( "exp10" );
	test( "", _APPROX( floatToComplex( 0.0 ).exp10().toFloat(), 1.0 ) );
	test( "", _APPROX( floatToComplex( 1.0 - floatToComplex( 2.0 ).log10().toFloat() ).exp10().toFloat(), 5.0 ) );
	test( "", _APPROX( floatToComplex( 5.0 ).exp10().toFloat(), 1e5 ) );
printBlue( "" + floatToComplex( 5.0 ).exp10().toFloat() + " " + 1e5 );

	printBold( "log" );
	test( "", floatToComplex( 1.0 ).log().toFloat() == 0.0 );
	test( "", _APPROX( floatToComplex( e ).log().toFloat(), 1.0 ) );
	test( "", _APPROX( floatToComplex( (e * e * e) ).log().toFloat(), 3.0 ) );

	printBold( "log10" );
	test( "", _APPROX( floatToComplex( 1.0 ).log10().toFloat(), 0.0 ) );
	test( "", _APPROX( floatToComplex( 5.0 ).log10().toFloat(), 1.0 - floatToComplex( 2.0 ).log10().toFloat() ) );
	test( "", _APPROX( floatToComplex( 1e5 ).log10().toFloat(), 5.0 ) );

	printBold( "pow" );
	test( "", _APPROX( floatToComplex( -2.5 ).pow( 2.0 ).toFloat(), 6.25 ) );
	test( "", _APPROX( floatToComplex( -2.0 ).pow( -3.0 ).toFloat(), -0.125 ) );
	test( "", floatToComplex( 0.0 ).pow( 6.0 ).toFloat() == 0.0 );
	test( "", _APPROX( floatToComplex( 2.0 ).pow( -0.5 ).toFloat(), rthalf ) );
	test( "", _APPROX( floatToComplex( 3.0 ).pow( 4.0 ).toFloat(), 81.0 ) );

	printBold( "fsinh" );
	test( "", _APPROX( fsinh( -1.0 ), -(e - 1.0 / e) / 2.0 ) );
	test( "", _APPROX( fsinh( 0.0 ), 0.0 ) );
	test( "", _APPROX( fsinh( 1.0 ), (e - 1.0 / e) / 2.0 ) );

	printBold( "sqr" );
	test( "", _APPROX( floatToComplex( 0.0 ).sqr().toFloat(), 0.0 ) );
	test( "", _APPROX( floatToComplex( rthalf ).sqr().toFloat(), 0.5 ) );
	test( "", _APPROX( floatToComplex( 1.0 ).sqr().toFloat(), 1.0 ) );
	test( "", _APPROX( floatToComplex( 1.0 / rthalf ).sqr().toFloat(), 2.0 ) );
	test( "", _APPROX( floatToComplex( 12.0 ).sqr().toFloat(), 144.0 ) );

	printBold( "sqrt" );
	test( "", _APPROX( floatToComplex( 0.0 ).sqrt().toFloat(), 0.0 ) );
	test( "", _APPROX( floatToComplex( 0.5 ).sqrt().toFloat(), rthalf ) );
	test( "", _APPROX( floatToComplex( 1.0 ).sqrt().toFloat(), 1.0 ) );
	test( "", _APPROX( floatToComplex( 2.0 ).sqrt().toFloat(), 1.0 / rthalf ) );
	test( "", _APPROX( floatToComplex( 144.0 ).sqrt().toFloat(), 12.0 ) );

	printBold( "ftanh" );
	test( "", _APPROX( ftanh( -1.0 ), -(e * e - 1.0) / (e * e + 1.0) ) );
	test( "", _APPROX( ftanh( 0.0 ), 0.0 ) );
	test( "", _APPROX( ftanh( 1.0 ), (e * e - 1.0) / (e * e + 1.0) ) );

	endTest();
}

// complexのテスト
function testComplex(){
	startTest( "[testing complex]" );

	// complexの性質のテスト
	var fc0 = new _Complex();
	var fc1 = floatToComplex( 1 );
	var fc2 = new _Complex( 2, 2 );
	test( "fc0=" + toString( fc0 ), fc0.real() == 0 && fc0.imag() == 0 );
	test( "fc1=" + toString( fc1 ), fc1.real() == 1 && fc1.imag() == 0 );
	test( "fc2=" + toString( fc2 ), fc2.real() == 2 && fc2.imag() == 2 );
	fc0.addAndAss( fc2 ); test( "addAndAss", fc0.real() ==  2 && fc0.imag() == 2 );
	fc0.subAndAss( fc1 ); test( "subAndAss", fc0.real() ==  1 && fc0.imag() == 2 );
	fc0.mulAndAss( fc2 ); test( "mulAndAss", fc0.real() == -2 && fc0.imag() == 6 );
	fc0.divAndAss( fc2 ); test( "divAndAss", fc0.real() ==  1 && fc0.imag() == 2 );

	// 算術のテスト
	fc0.ass( new _Complex( -4, -5 ) );					test( "ass"  , fc0.real() == -4 && fc0.imag() == -5 );
	fc0.ass( floatToComplex( 2 ).add( fc2 ).add( 3 ) );	test( "add"  , fc0.real() ==  7 && fc0.imag() ==  2 );
	fc0.ass( floatToComplex( 2 ).sub( fc2 ).sub( 3 ) );	test( "sub"  , fc0.real() == -3 && fc0.imag() == -2 );
	fc0.ass( floatToComplex( 2 ).mul( fc2 ).mul( 3 ) );	test( "mul"  , fc0.real() == 12 && fc0.imag() == 12 );
	fc0.ass( floatToComplex( 8 ).div( fc2 ).div( 2 ) );	test( "div"  , fc0.real() ==  1 && fc0.imag() == -1 );
	fc0.ass( fc1.add( fc2.minus() ) );					test( "minus", fc0.real() == -1 && fc0.imag() == -2 );
	test( "equal"   , fc2.equal   ( fc2 ) && fc1.equal   ( 1 ) && floatToComplex( 1 ).equal   ( fc1 ) );
	test( "notEqual", fc1.notEqual( fc2 ) && fc1.notEqual( 0 ) && floatToComplex( 3 ).notEqual( fc1 ) );

	// 数学関数のテスト
	var e      = 2.7182818284590452353602875;
	var ln2    = 0.6931471805599453094172321;
	var piby4  = 0.7853981633974483096156608;
	var rthalf = 0.7071067811865475244008444;
	var c1 = rthalf * (e + 1 / e) / 2;
	var s1 = rthalf * (e - 1 / e) / 2;
	test( "fabs", _APPROX( (new _Complex( 5, -12 )).fabs(), 13 ) );
	test( "farg", fc1.farg() == 0 && _APPROX( fc2.farg(), piby4 ) );
	test( "conjg", fc2.conjg().equal( new _Complex( 2, -2 ) ) );
	fc0.ass( (new _Complex( piby4, -1 )).cos() );	test( "cos" , _APPROX( fc0.real(), c1 ) && _APPROX( fc0.imag(), s1 ) );
	fc0.ass( (new _Complex( -1, piby4 )).cosh() );	test( "cosh", _APPROX( fc0.real(), c1 ) && _APPROX( fc0.imag(), -s1 ) );
	fc0.ass( fc1.exp() );							test( "exp" , _APPROX( fc0.real(), e ) && fc0.imag() == 0 );
	fc0.ass( (new _Complex( 1, -piby4 )).exp() );	test( "exp" , _APPROX( fc0.real(), e * rthalf ) && _APPROX( fc0.imag(), -e * rthalf ) );
	fc0.ass( (new _Complex( 1, -1 )).log() );		test( "log" , _APPROX( fc0.real(), ln2 / 2 ) && _APPROX( fc0.imag(), -piby4 ) );
	test( "norm", (new _Complex( 3, -4 )).fnorm() == 25 && fc2.fnorm() == 8 );
	fc0.polar( 1, -piby4 ); test( "polar", _APPROX( fc0.real(), rthalf ) && _APPROX( fc0.imag(), -rthalf ) );
	fc0.ass( fc2.pow( fc2 ) );
	fc0.ass( fc2.pow( 5 ) ); test( "pow", _APPROX( fc0.real(), -128 ) && _APPROX( fc0.imag(), -128 ) );
printBlue( toString( fc0 ) );
	fc0.ass( fc2.pow( 2 ) ); test( "pow", _APPROX( fc0.real(), 0 ) && _APPROX( fc0.imag(), 8 ) );
printBlue( toString( fc0 ) );
	fc0.ass( floatToComplex( 2 ).pow( fc2 ) );
	fc0.ass( (new _Complex( piby4, -1 )).sin() );		test( "sin" , _APPROX( fc0.real(), c1 ) && _APPROX( fc0.imag(), -s1 ) );
	fc0.ass( (new _Complex( -1, piby4 )).sinh() );		test( "sinh", _APPROX( fc0.real(), -s1 ) && _APPROX( fc0.imag(), c1 ) );
	fc0.ass( (new _Complex( rthalf, -rthalf )).sqr() );	test( "sqr" , _APPROX( fc0.real(), 0 ) && _APPROX( fc0.imag(), -1 ) );
	fc0.ass( (new _Complex( 0, -1 )).sqrt() );			test( "sqrt", _APPROX( fc0.real(), rthalf ) && _APPROX( fc0.imag(), -rthalf ) );

	endTest();
}

// 行列のテスト
function testMatrix(){
	startTest( "[testing matrix]" );

	/*
	 * 算術のテスト
	 */

	var matI = arrayToMatrix( [[ 1, 0, 0 ],[ 0, 1, 0 ],[ 0, 0, 1 ]] );

	printBold( "test 1" );
	var matA, matB, matC;
	matA = arrayToMatrix( [[ -4,  6, 3 ],[ 0, 1, 2 ]] );
	matB = arrayToMatrix( [[  5, -1, 0 ],[ 3, 1, 0 ]] );
	matC = arrayToMatrix( [[  1,  5, 3 ],[ 3, 2, 2 ]] );
	test( "", matC.equal( matA.add( matB ) ) );

	printBold( "test 2" );
	matA = arrayToMatrix( [[ 2.7, -1.8 ],[ 0.9, 3.6 ]] );
	matB = arrayToMatrix( [[ 5.4, -3.6 ],[ 1.8, 7.2 ]] );
	matC = arrayToMatrix( [[ 3  , -2   ],[ 1  , 4   ]] );
	test( "", matA.add( matA ).equal( floatToMatrix( 2 ).mul( matA ) ) );
	test( "", matA.add( matA ).equal( matB ) );
	test( "", floatToMatrix( 2 ).mul( matA ).equal( matB ) );
	test( "", _APPROX_M( floatToMatrix( 10 / 9 ).mul( matA ), matC ) );

	printBold( "test 3" );
	matA = arrayToMatrix( [[ 5, -8, 1 ],[ 4, 0, 0 ]] );
	matB = arrayToMatrix( [[ 5, 4 ],[ -8, 0 ],[ 1, 0 ]] );
	test( "", matA.trans().equal( matB ) );

	printBold( "test 4" );
	matA = arrayToMatrix( [[ 7, 5, -2 ]] );
	matB = arrayToMatrix( [[ 7 ],[ 5 ],[ -2 ]] );
	test( "", matA.trans().equal( matB ) );

	printBold( "test 5" );
	var matR, matS;
	matA = arrayToMatrix( [[ 2,  3 ],[ 5, -1 ]] );
	matR = arrayToMatrix( [[ 2,  4 ],[ 4, -1 ]] );
	matS = arrayToMatrix( [[ 0, -1 ],[ 1,  0 ]] );
	test( "", matA.add( matA.trans() ).div( 2 ).equal( matR ) );
	test( "", matA.sub( matA.trans() ).div( 2 ).equal( matS ) );

	printBold( "test 6" );
	matA = arrayToMatrix( [[  2, -3 ],[  0,  4 ]] );
	matB = arrayToMatrix( [[ -5,  2 ],[  2,  1 ]] );
	matC = arrayToMatrix( [[  7, -5 ],[ -2,  3 ]] );	test( "", matA.sub( matB ).equal( matC ) );
	matC = arrayToMatrix( [[ -7,  5 ],[  2, -3 ]] );	test( "", matB.sub( matA ).equal( matC ) );
	matC = arrayToMatrix( [[  2,  0 ],[ -3,  4 ]] );	test( "", matA.trans().equal( matC ) );
														test( "", matB.trans().equal( matB ) );
														test( "", matB.trans().trans().equal( matB ) );
	matC = arrayToMatrix( [[  4, -3 ],[ -3, 8 ]] );		test( "", matA.add( matA.trans() ).equal( matC ) );
	matC = arrayToMatrix( [[  0, -3 ],[  3, 0 ]] );		test( "", matA.sub( matA.trans() ).equal( matC ) );
	matC = arrayToMatrix( [[ -3,  2 ],[ -1, 5 ]] );		test( "", matA.add( matB ).trans().equal( matC ) );
														test( "", matA.trans().add( matB.trans() ).equal( matC ) );

	printBold( "test 7" );
	var matK, matM, matN, matL;
	matK = arrayToMatrix( [[ 1, 3, 5 ],[ 0, 4, 2 ],[ 0, 0, 6 ]] );
	matM = arrayToMatrix( [[ 2, 0, 0 ],[ -1, 1, 0 ],[ 4, -3, 0 ]] );
	matN = arrayToMatrix( [[ 6, 7 ],[ 0, -2 ],[ 3, 8 ]] );
	matL = arrayToMatrix( [[ 18, 0, 9 ],[ 21, -6, 24 ]] );
														test( "", floatToMatrix( 3 ).mul( matN ).trans().equal( matL ) );
														test( "", floatToMatrix( 3 ).mul( matN.trans() ).equal( matL ) );
	matL = arrayToMatrix( [[ -1, 3, 5 ],[ 1, 3, 2 ],[ -4, 3, 6 ]] );
														test( "", matK.sub( matM ).equal( matL ) );
														test( "", matM.sub( matK ).equal( matL.minus() ) );
	matL = arrayToMatrix( [[ 3, 3, 5 ],[ -1, 5, 2 ],[ 4, -3, 6 ]] );
														test( "", matK.add( matM ).equal( matL ) );
														test( "", matM.add( matK ).equal( matL ) );

	printBold( "test 8" );
	matA = arrayToMatrix( [[ 2,  1 ],[  3, 4 ]] );
	matB = arrayToMatrix( [[ 1, -2 ],[  5, 3 ]] );
	matC = arrayToMatrix( [[ 7, -1 ],[ 23, 6 ]] );
	test( "", matA.mul( matB ).equal( matC ) );

	printBold( "test 9" );
	matA = arrayToMatrix( [[ 3, 2, -1 ],[  0,  4,  6 ]] );
	matB = arrayToMatrix( [[ 1, 0,  2 ],[  5,  3,  1 ],[ 6, 4, 2 ]] );
	matC = arrayToMatrix( [[ 7, 2,  6 ],[ 56, 36, 16 ]] );
	test( "", matA.mul( matB ).equal( matC ) );

	printBold( "test 10" );
	matA = arrayToMatrix( [[ 3, 4, 2 ],[ 6, 0, -1 ],[ -5, -2, 1 ]] );
	matB = arrayToMatrix( [[ 1 ],[ 3 ],[ 2 ]] );
	matC = arrayToMatrix( [[ 19 ],[ 4 ],[ -9 ]] );
	test( "", matA.mul( matB ).equal( matC ) );

	printBold( "test 11" );
	matA = arrayToMatrix( [[ 3, 6, 1 ]] );
	matB = arrayToMatrix( [[ 1 ],[ 2 ],[ 4 ]] );
	matC = arrayToMatrix( [[ 3, 6, 1 ],[ 6, 12, 2 ],[ 12, 24, 4 ]] );
	test( "", floatToMatrix( 3 ).notEqual( matA ) );
	test( "", matA.notEqual( 3 ) );
	test( "", matA.mul( matB ).equal( 19 ) );
	test( "", matB.mul( matA ).equal( matC ) );

	printBold( "test 12" );
	matA = arrayToMatrix( [[ 1, 0 ],[ 0, 0 ]] );
	matB = arrayToMatrix( [[ 0, 1 ],[ 1, 0 ]] );
	matC = arrayToMatrix( [[ 0, 1 ],[ 0, 0 ]] ); test( "", matA.mul( matB ).equal( matC ) );
	matC = arrayToMatrix( [[ 0, 0 ],[ 1, 0 ]] ); test( "", matB.mul( matA ).equal( matC ) );

	printBold( "test 13" );
	matA = arrayToMatrix( [[  1, 1 ],[ 2,  2 ]] );
	matB = arrayToMatrix( [[ -1, 1 ],[ 1, -1 ]] );
	matC = arrayToMatrix( [[  0, 0 ],[ 0,  0 ]] ); test( "", matA.mul( matB ).equal( matC ) );

	printBold( "test 14" );
	var matD;
	matA = arrayToMatrix( [[ 4, 6, -1 ],[ 3, 0, 2 ],[ 1, -2, 5 ]] );
	matB = arrayToMatrix( [[ 2, 4 ],[ 0, 1 ],[ -1, 2 ]] );
	matC = arrayToMatrix( [[ 3 ],[ 1 ],[ 2 ]] );
	matD = arrayToMatrix( [[ 33, 26, 3 ],[ 14, 14, 7 ],[ 3, -4, 20 ]] );	test( "", matA.mul( matA ).equal( matD ) );
	matD = arrayToMatrix( [[ 4 ],[ 17 ]] );									test( "", matB.trans().mul( matC ).equal( matD ) );
	matD = arrayToMatrix( [[ 4, 17 ]] );									test( "", matC.trans().mul( matB ).equal( matD ) );
	matD = arrayToMatrix( [[ 20, 4, 6 ],[ 4, 1, 2 ],[ 6, 2, 5 ]] );			test( "", matB.mul( matB.trans() ).equal( matD ) );
	matD = arrayToMatrix( [[ 5, 6 ],[ 6, 21 ]] );							test( "", matB.trans().mul( matB ).equal( matD ) );
	matD = arrayToMatrix( [[ 43, 44, 0 ],[ 23, 12, 13 ],[ 6, -10, 33 ]] );	test( "", matA.mul( matA ).add( floatToMatrix( 3 ).mul( matA ) ).sub( floatToMatrix( 2 ).mul( matI ) ).equal( matD ) );
	matD = arrayToMatrix( [[ 25, 100 ]] );									test( "", matC.trans().mul( matA ).mul( matB ).equal( matD ) );
	matD = arrayToMatrix( [[ 25 ],[ 100 ]] );								test( "", matA.mul( matB ).trans().mul( matC ).equal( matD ) );

	printBold( "test 15" );
	matA = arrayToMatrix( [[  2, -1,  0 ],[ 0, -2,  1 ],[ 1,  0,  1 ]] );
	matB = arrayToMatrix( [[ -2,  1, -1 ],[ 1,  2, -2 ],[ 2, -1, -4 ]] );
	matC = arrayToMatrix( [[ -5,  0,  0 ],[ 0, -5,  0 ],[ 0,  0, -5 ]] );
	test( "", matA.mul( matB ).equal( matB.mul( matA ) ) );
	test( "", matA.mul( matB ).equal( matC ) );
	test( "", matB.mul( matA ).equal( matC ) );

	endTest();
}
