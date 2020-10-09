





function _Float( val ){
 this._val = (val == undefined) ? 0.0 : val;
}

_Float.prototype = {
 set : function( val ){
  this._val = val;
  return this;
 },
 add : function( val ){
  this._val += val;
  return this;
 },
 val : function(){
  return this._val;
 }
};

function newFloatArray( len ){
 var a = new Array( len );
 for( var i = 0; i < len; i++ ){
  a[i] = new _Float();
 }
 return a;
}
function _Integer( val ){
 this._val = (val == undefined) ? 0 : _INT( val );
}
_Integer.prototype = {
 set : function( val ){
  this._val = _INT( val );
  return this;
 },
 add : function( val ){
  this._val += _INT( val );
  return this;
 },
 val : function(){
  return this._val;
 }
};
function newIntegerArray( len ){
 var a = new Array( len );
 for( var i = 0; i < len; i++ ){
  a[i] = new _Integer();
 }
 return a;
}
function _String( str ){
 this._str = (str == undefined) ? "" : ((str == null) ? null : "" + str);
}
_String.prototype = {
 set : function( str ){
  this._str = (str == null) ? null : "" + str;
  return this;
 },
 add : function( str ){
  if( str != null ){
   if( this._str == null ){
    this.set( str );
   } else {
    this._str += "" + str;
   }
  }
  return this;
 },
 str : function(){
  return (this._str == null) ? "" : this._str;
 },
 isNull : function(){
  return (this._str == null);
 },
 replace : function( word, replacement ){
  var end = word.length;
  if( end > 0 ){
   var top = 0;
   while( top < this.str().length ){
    if( this.str().substring( top, end ) == word ){
     var forward = (top > 0) ? this.str().substring( 0, top ) : "";
     var after = (end < this.str().length) ? this.str().slice( end ) : "";
     this.set( forward + replacement + after );
     top += replacement.length;
     end += replacement.length;
    } else {
     top++;
     end++;
    }
   }
  }
  return this;
 },
 replaceNewLine : function( replacement ){
  this.replace( "\r\n", "\n" );
  this.replace( "\r" , "\n" );
  if( replacement != undefined ){
   this.replace( "\n", replacement );
  }
  return this;
 },
 escape : function(){
  this.replace( "&" , "&amp;" );
  this.replace( "<" , "&lt;" );
  this.replace( ">" , "&gt;" );
  this.replace( "\"", "&quot;" );
  this.replace( " " , "&nbsp;" );
  return this;
 },
 unescape : function(){
  this.replace( "&lt;" , "<" );
  this.replace( "&gt;" , ">" );
  this.replace( "&quot;", "\"" );
  this.replace( "&nbsp;", " " );
  this.replace( "&amp;" , "&" );
  return this;
 }
};
function newStringArray( len ){
 var a = new Array( len );
 for( var i = 0; i < len; i++ ){
  a[i] = new _String();
 }
 return a;
}
var _EPS5 = 0.001;
var _SQRT05 = 0.7071067811865475244008444;
function _Complex( re, im ){
 this._re = (re == undefined) ? 0.0 : re;
 this._im = (im == undefined) ? 0.0 : im;
}
_Complex.prototype = {
 angToAng : function( oldType, newType ){
  if( oldType != newType ){
   switch( oldType ){
   case 0:
    this.mulAndAss( (newType == 1) ? 180.0 : 200.0 );
    this.divAndAss( _PI );
    break;
   case 1:
    this.mulAndAss( (newType == 0) ? _PI : 200.0 );
    this.divAndAss( 180.0 );
    break;
   case 2:
    this.mulAndAss( (newType == 0) ? _PI : 180.0 );
    this.divAndAss( 200.0 );
    break;
   }
  }
 },
 setReal : function( re ){
  this._re = re;
 },
 setImag : function( im ){
  this._im = im;
 },
 polar : function( rho, theta ){
  theta = _angToRad( theta );
  this._re = rho * _COS( theta );
  this._im = rho * _SIN( theta );
 },
 real : function(){
  return this._re;
 },
 imag : function(){
  return this._im;
 },
 toFloat : function(){
  return this._re;
 },
 ass : function( r ){
  if( r instanceof _Complex ){
   this._re = r._re;
   this._im = r._im;
  } else {
   this._re = r;
   this._im = 0.0;
  }
  return this;
 },
 minus : function(){
  return new _Complex( -this._re, -this._im );
 },
 add : function( r ){
  if( r instanceof _Complex ){
   return new _Complex( this._re + r._re, this._im + r._im );
  }
  return new _Complex( this._re + r, this._im );
 },
 addAndAss : function( r ){
  if( r instanceof _Complex ){
   this._re += r._re;
   this._im += r._im;
  } else {
   this._re += r;
  }
  return this;
 },
 sub : function( r ){
  if( r instanceof _Complex ){
   return new _Complex( this._re - r._re, this._im - r._im );
  }
  return new _Complex( this._re - r, this._im );
 },
 subAndAss : function( r ){
  if( r instanceof _Complex ){
   this._re -= r._re;
   this._im -= r._im;
  } else {
   this._re -= r;
  }
  return this;
 },
 mul : function( r ){
  if( r instanceof _Complex ){
   if( r._im == 0.0 ){
    return new _Complex( this._re * r._re, this._im * r._re );
   }
   return new _Complex( this._re * r._re - this._im * r._im, this._re * r._im + this._im * r._re );
  }
  return new _Complex( this._re * r, this._im * r );
 },
 mulAndAss : function( r ){
  if( r instanceof _Complex ){
   if( r._im == 0.0 ){
    this._re *= r._re;
    this._im *= r._re;
   } else {
    var t = this._re * r._re - this._im * r._im;
    this._im = this._re * r._im + this._im * r._re;
    this._re = t;
   }
  } else {
   this._re *= r;
   this._im *= r;
  }
  return this;
 },
 div : function( r ){
  if( r instanceof _Complex ){
   if( r._im == 0.0 ){
    return new _Complex( this._re / r._re, this._im / r._re );
   }
   if( _ABS( r._re ) < _ABS( r._im ) ){
    var w = r._re / r._im;
    var d = r._re * w + r._im;
    return new _Complex( (this._re * w + this._im) / d, (this._im * w - this._re) / d );
   }
   var w = r._im / r._re;
   var d = r._re + r._im * w;
   return new _Complex( (this._re + this._im * w) / d, (this._im - this._re * w) / d );
  }
  return new _Complex( this._re / r, this._im / r );
 },
 divAndAss : function( r ){
  if( r instanceof _Complex ){
   if( r._im == 0.0 ){
    this._re /= r._re;
    this._im /= r._re;
   } else if( _ABS( r._re ) < _ABS( r._im ) ){
    var w = r._re / r._im;
    var d = r._re * w + r._im;
    var t = (this._re * w + this._im) / d;
    this._im = (this._im * w - this._re) / d;
    this._re = t;
   } else {
    var w = r._im / r._re;
    var d = r._re + r._im * w;
    var t = (this._re + this._im * w) / d;
    this._im = (this._im - this._re * w) / d;
    this._re = t;
   }
  } else {
   this._re /= r;
   this._im /= r;
  }
  return this;
 },
 mod : function( r ){
  if( r instanceof _Complex ){
   if( r._im == 0.0 ){
    return new _Complex( this._re % r._re, this._im % r._re );
   }
   var z = dupComplex( this );
   z.divAndAss( r );
   z._re = _INT( z._re );
   z._im = _INT( z._im );
   z.mulAndAss( r );
   return this.sub( z );
  }
  return new _Complex( this._re % r, this._im % r );
 },
 modAndAss : function( r ){
  if( r instanceof _Complex ){
   if( r._im == 0.0 ){
    this._re = this._re % r._re;
    this._im = this._im % r._re;
   } else {
    var z = dupComplex( this );
    z.divAndAss( r );
    z._re = _INT( z._re );
    z._im = _INT( z._im );
    z.mulAndAss( r );
    this.subAndAss( z );
   }
  } else {
   this._re = this._re % r;
   this._im = this._im % r;
  }
  return this;
 },
 equal : function( r ){
  if( r instanceof _Complex ){
   return (this._re == r._re) && (this._im == r._im);
  }
  return (this._re == r) && (this._im == 0.0);
 },
 notEqual : function( r ){
  if( r instanceof _Complex ){
   return (this._re != r._re) || (this._im != r._im);
  }
  return (this._re != r) || (this._im != 0.0);
 },
 fabs : function(){
  if( this._re == 0.0 ){
   return _ABS( this._im );
  }
  if( this._im == 0.0 ){
   return _ABS( this._re );
  }
  if( _ABS( this._re ) < _ABS( this._im ) ){
   var t = this._re / this._im;
   return _ABS( this._im ) * _SQRT( 1.0 + t * t );
  }
  var t = this._im / this._re;
  return _ABS( this._re ) * _SQRT( 1.0 + t * t );
 },
 farg : function(){
  return fatan2( this._im, this._re );
 },
 fnorm : function(){
  return this._re * this._re + this._im * this._im;
 },
 conjg : function(){
  return new _Complex( this._re, -this._im );
 },
 sin : function(){
  if( this._im == 0.0 ){
   return floatToComplex( fsin( this._re ) );
  }
  var re = _angToRad( this._re );
  var im = _angToRad( this._im );
  return new _Complex(
   _SIN( re ) * fcosh( im ),
   _COS( re ) * fsinh( im )
   );
 },
 cos : function(){
  if( this._im == 0.0 ){
   return floatToComplex( fcos( this._re ) );
  }
  var re = _angToRad( this._re );
  var im = _angToRad( this._im );
  return new _Complex(
    _COS( re ) * fcosh( im ),
   -_SIN( re ) * fsinh( im )
   );
 },
 tan : function(){
  if( this._im == 0.0 ){
   return floatToComplex( ftan( this._re ) );
  }
  var re2 = _angToRad( this._re ) * 2.0;
  var im2 = _angToRad( this._im ) * 2.0;
  var d = _COS( re2 ) + fcosh( im2 );
  if( d == 0.0 ){
   setComplexError();
  }
  return new _Complex(
   _SIN( re2 ) / d,
   fsinh( im2 ) / d
   );
 },
 asin : function(){
  if( this._im == 0.0 ){
   if( (this._re < -1.0) || (this._re > 1.0) ){
    if( complexIsReal() ){
     setComplexError();
     return floatToComplex( fasin( this._re ) );
    }
   } else {
    return floatToComplex( fasin( this._re ) );
   }
  }
  var i = new _Complex( 0.0, 1.0 );
  var c = i.minus().mul( i.mul( this ).add( this.sqr().minus().add( 1.0 ).sqrt() ).log() );
  c._re = _radToAng( c._re );
  c._im = _radToAng( c._im );
  return c;
 },
 acos : function(){
  if( this._im == 0.0 ){
   if( (this._re < -1.0) || (this._re > 1.0) ){
    if( complexIsReal() ){
     setComplexError();
     return floatToComplex( facos( this._re ) );
    }
   } else {
    return floatToComplex( facos( this._re ) );
   }
  }
  var i = new _Complex( 0.0, 1.0 );
  var c = i.mul( this.sub( i.mul( this.sqr().minus().add( 1.0 ).sqrt() ) ).log() );
  c._re = _radToAng( c._re );
  c._im = _radToAng( c._im );
  return c;
 },
 atan : function(){
  if( this._im == 0.0 ){
   return floatToComplex( fatan( this._re ) );
  }
  var d = new _Complex( -this._re, 1.0 - this._im );
  if( d.equal( 0.0 ) ){
   setComplexError();
  }
  var i = new _Complex( 0.0, 1.0 );
  var c = i.mul( i.add( this ).div( d ).log() ).mul( 0.5 );
  c._re = _radToAng( c._re );
  c._im = _radToAng( c._im );
  return c;
 },
 sinh : function(){
  if( this._im == 0.0 ){
   return floatToComplex( fsinh( this._re ) );
  }
  return new _Complex(
   fsinh( this._re ) * _COS( this._im ),
   fcosh( this._re ) * _SIN( this._im )
   );
 },
 cosh : function(){
  if( this._im == 0.0 ){
   return floatToComplex( fcosh( this._re ) );
  }
  return new _Complex(
   fcosh( this._re ) * _COS( this._im ),
   fsinh( this._re ) * _SIN( this._im )
   );
 },
 tanh : function(){
  if( this._im == 0.0 ){
   return floatToComplex( ftanh( this._re ) );
  }
  var re2 = this._re * 2.0;
  var im2 = this._im * 2.0;
  var d = fcosh( re2 ) + _COS( im2 );
  if( d == 0.0 ){
   setComplexError();
  }
  return new _Complex(
   fsinh( re2 ) / d,
   _SIN( im2 ) / d
   );
 },
 asinh : function(){
  if( this._im == 0.0 ){
   return floatToComplex( fasinh( this._re ) );
  }
  return this.add( this.sqr().add( 1.0 ).sqrt() ).log();
 },
 acosh : function(){
  if( this._im == 0.0 ){
   if( this._re < 1.0 ){
    if( complexIsReal() ){
     setComplexError();
     return floatToComplex( facosh( this._re ) );
    }
   } else {
    return floatToComplex( facosh( this._re ) );
   }
  }
  return this.add( this.sqr().sub( 1.0 ).sqrt() ).log();
 },
 atanh : function(){
  if( this._im == 0.0 ){
   if( (this._re <= -1.0) || (this._re >= 1.0) ){
    if( complexIsReal() ){
     setComplexError();
     return floatToComplex( fatanh( this._re ) );
    }
   } else {
    return floatToComplex( fatanh( this._re ) );
   }
  }
  var d = new _Complex( 1.0 - this._re, -this._im );
  if( d.equal( 0.0 ) ){
   setComplexError();
  }
  return this.add( 1.0 ).div( d ).log().mul( 0.5 );
 },
 ceil : function(){
  return new _Complex(
   _CEIL( this._re ),
   _CEIL( this._im )
   );
 },
 floor : function(){
  return new _Complex(
   _FLOOR( this._re ),
   _FLOOR( this._im )
   );
 },
 exp : function(){
  if( this._im == 0.0 ){
   return floatToComplex( _EXP( this._re ) );
  }
  var e = _EXP( this._re );
  return new _Complex(
   e * _COS( this._im ),
   e * _SIN( this._im )
   );
 },
 exp10 : function(){
  if( this._im == 0.0 ){
   return floatToComplex( _EXP( this._re / _NORMALIZE ) );
  }
  var im = this._im / _NORMALIZE;
  var e = _EXP( this._re / _NORMALIZE );
  return new _Complex(
   e * _COS( im ),
   e * _SIN( im )
   );
 },
 log : function(){
  if( this._im == 0.0 ){
   if( this._re <= 0.0 ){
    if( complexIsReal() ){
     setComplexError();
     return floatToComplex( _LOG( this._re ) );
    }
   } else {
    return floatToComplex( _LOG( this._re ) );
   }
  }
  return new _Complex(
   _LOG( this.fabs() ),
   _ATAN2( this._im, this._re )
   );
 },
 log10 : function(){
  if( this._im == 0.0 ){
   if( this._re <= 0.0 ){
    if( complexIsReal() ){
     setComplexError();
     return floatToComplex( _LOG( this._re ) * _NORMALIZE );
    }
   } else {
    return floatToComplex( _LOG( this._re ) * _NORMALIZE );
   }
  }
  return new _Complex(
   _LOG( this.fabs() ) * _NORMALIZE,
   _ATAN2( this._im, this._re ) * _NORMALIZE
   );
 },
 pow : function( y ){
  if( y instanceof _Complex ){
   if( y._im == 0.0 ){
    if( this._im == 0.0 ){
     return floatToComplex( _POW( this._re, y._re ) );
    }
    return this.log().mul( y._re ).exp();
   }
   if( this._im == 0.0 ){
    return y.mul( _LOG( this._re ) ).exp();
   }
   return this.log().mul( y ).exp();
  }
  if( this._im == 0.0 ){
   return floatToComplex( _POW( this._re, y ) );
  }
  return this.log().mul( y ).exp();
 },


 sqr : function(){
  if( this._im == 0.0 ){
   return floatToComplex( this._re * this._re );
  }
  return new _Complex( this._re * this._re - this._im * this._im, this._re * this._im + this._im * this._re );
 },


 sqrt : function(){
  if( this._im == 0.0 ){
   if( this._re < 0.0 ){
    if( complexIsReal() ){
     setComplexError();
     return floatToComplex( _SQRT( this._re ) );
    }
   } else {
    return floatToComplex( _SQRT( this._re ) );
   }
  }
  if( this._re >= 0.0 ){
   var r = _SQRT( this.fabs() + this._re );
   return new _Complex(
    _SQRT05 * r,
    _SQRT05 * this._im / r
    );
  }
  if( this._im >= 0.0 ){
   var r = _SQRT( this.fabs() - this._re );
   return new _Complex(
    _SQRT05 * this._im / r,
    _SQRT05 * r
    );
  }
  var r = _SQRT( this.fabs() - this._re );
  return new _Complex(
   -_SQRT05 * this._im / r,
   -_SQRT05 * r
   );
 }

};

function getComplex( c, re , im ){
 re.set( c._re );
 im.set( c._im );
}
function setComplex( c, re, im ){
 c._re = re;
 c._im = im;
 return c;
}

function dupComplex( x ){
 return new _Complex( x._re, x._im );
}

function floatToComplex( x ){
 return new _Complex( x, 0.0 );
}


function _radToAng( rad ){
 return complexIsRad() ? rad : rad * complexAngCoef() / _PI;
}


function _angToRad( ang ){
 return complexIsRad() ? ang : ang * _PI / complexAngCoef();
}


function fsin( x ){
 return _SIN( _angToRad( x ) );
}
function fcos( x ){
 return _COS( _angToRad( x ) );
}
function ftan( x ){
 return _TAN( _angToRad( x ) );
}
function fasin( x ){
 return _radToAng( _ASIN( x ) );
}
function facos( x ){
 return _radToAng( _ACOS( x ) );
}
function fatan( x ){
 return _radToAng( _ATAN( x ) );
}
function fatan2( y, x ){
 return _radToAng( _ATAN2( y, x ) );
}
function fsinh( x ){
 if( _ABS( x ) > _EPS5 ){
  var t = _EXP( x );
  return (t - 1.0 / t) / 2.0;
 }
 return x * (1.0 + x * x / 6.0);
}
function fcosh( x ){
 var t = _EXP( x );
 return (t + 1.0 / t) / 2.0;
}
function ftanh( x ){
 if( x > _EPS5 ){
  return 2.0 / (1.0 + _EXP( -2.0 * x )) - 1.0;
 }
 if( x < -_EPS5 ){
  return 1.0 - 2.0 / (_EXP( 2.0 * x ) + 1.0);
 }
 return x * (1.0 - x * x / 3.0);
}
function fasinh( x ){
 if( x > _EPS5 ){
  return _LOG( _SQRT( x * x + 1.0 ) + x );
 }
 if( x < -_EPS5 ){
  return -_LOG( _SQRT( x * x + 1.0 ) - x );
 }
 return x * (1.0 - x * x / 6.0);
}
function facosh( x ){
 return _LOG( x + _SQRT( x * x - 1.0 ) );
}
function fatanh( x ){
 if( _ABS( x ) > _EPS5 ){
  return _LOG( (1.0 + x) / (1.0 - x) ) * 0.5;
 }
 return x * (1.0 + x * x / 3.0);
}
var _FRACT_MAX = Number.MAX_SAFE_INTEGER ;
function _Fract( mi, nu, de ){
 this._mi = (mi == undefined) ? false : mi;
 this._nu = (nu == undefined) ? 0 : _INT( nu );
 this._de = (de == undefined) ? 1 : _INT( de );
}
_Fract.prototype = {
 reduce : function(){
  var g = _GCD( this._nu, this._de );
  if( g != 0 ){
   this._nu = _DIV( this._nu, g );
   this._de = _DIV( this._de, g );
  }
 },
 _pure : function( x, keta ){
  if( x == 0 ){
   return -1;
  }
  var k = -1;
  do {
   k++;
   x *= 10;
  } while( x < 1 );
  var str_x = floatToFixed( x, 20 );
  var array_y = new Array( keta );
  var i, j;
  for( i = 0, j = 0; i <= keta; i++ ){
   if( i >= str_x.length ){
    break;
   } else if( str_x.charAt( i ) != '.' ){
    array_y[j++] = str_x.charCodeAt( i ) - _CHAR_CODE_0;
   }
  }
  if( j < keta ){
   return -1;
  }
  var p, _break;
  for( p = _DIV( keta, 2 ); p > 0; p-- ){
   for( i = 0; i < p; i++ ){
    _break = false;
    for( j = 1; ; j++ ){
     if( i + p * j >= keta ){
      break;
     } else if( array_y[i] != array_y[i + p * j] ){
      _break = true;
      break;
     }
    }
    if( _break ){
     break;
    }
   }
   if( i >= p ){
    break;
   }
  }
  if( p > 0 ){
   this._nu = 0;
   for( i = 0; i < p; i++ ){
    this._nu = this._nu * 10 + array_y[i];
   }
   this._de = (_POW( 10.0, p ) - 1) * _POW( 10.0, k );
   return 1;
  }
  return 0;
 },
 _recurring : function( x ){
  var xx = x;
  var k = 1;
  var i;
  for( i = 0; ; i++ ){
   if( xx / _POW( 10.0, i ) < 10 ){
    k = _POW( 10.0, i );
    xx /= k;
    break;
   }
  }
  var ii, ret;
  for( i = 0; ; i++ ){
   ii = _INT( xx );
   if( (ret = this._pure( xx - ii, 14 )) < 0 ){
    break;
   }
   if( ret > 0 ){
    this._nu = (ii * this._de + this._nu) * k;
    this._de *= _POW( 10.0, i );
    if( !_APPROX( x, this._nu / this._de ) ){
     return false;
    }
    this.reduce();
    return true;
   }
   xx *= 10;
  }
  return false;
 },
 _set : function( n, d ){
  if( n > d ){
   if( n > _FRACT_MAX ){
    this._nu = _FRACT_MAX;
    this._de = _INT( _FRACT_MAX * d / n );
   } else {
    this._nu = _INT( n );
    this._de = _INT( d );
   }
  } else {
   if( d > _FRACT_MAX ){
    this._nu = _INT( _FRACT_MAX * n / d );
    this._de = _FRACT_MAX;
   } else {
    this._nu = _INT( n );
    this._de = _INT( d );
   }
  }
  this.reduce();
 },
 _setFloat : function( x ){
  if( !this._recurring( x ) ){
   var de = _POW( 10.0, _FPREC( x ) );
   this._set( x * de, de );
  }
 },
 setMinus : function( mi ){
  this._mi = mi;
 },
 setNum : function( nu ){
  this._nu = _INT( nu );
 },
 setDenom : function( de ){
  this._de = _INT( de );
 },
 getMinus : function(){
  return this._mi && (this._nu != 0);
 },
 num : function(){
  return this._nu;
 },
 denom : function(){
  return this._de;
 },
 toFloat : function(){
  if( this._de == 0 ){
   return Number.POSITIVE_INFINITY;
  }
  return (this._mi ? -this._nu : this._nu) / this._de;
 },
 ass : function( r ){
  if( r instanceof _Fract ){
   this._mi = r._mi;
   this._nu = r._nu;
   this._de = r._de;
  } else {
   if( r < 0.0 ){
    this._mi = true;
    r = -r;
   } else {
    this._mi = false;
   }
   if( r == _INT( r ) ){
    this._nu = r;
    this._de = 1;
   } else {
    this._setFloat( r );
   }
  }
  return this;
 },
 minus : function(){
  return new _Fract( this._mi ? false : true, this._nu, this._de );
 },
 add : function( r ){
  if( r instanceof _Fract ){
   if( this._mi != r._mi ){
    return this.sub( r.minus() );
   }
   if( this._de == 0 ){
    return this;
   }
   if( r._de == 0 ){
    return r;
   }
   var de = _LCM( this._de, r._de );
   return new _Fract(
    this._mi,
    this._nu * de / this._de + r._nu * de / r._de,
    de
    );
  }
  if( this._mi != (r < 0.0) ){
   return this.sub( -r );
  }
  var t = (r < 0.0) ? -r : r;
  if( t == _INT( t ) ){
   return new _Fract(
    this._mi,
    this._nu + t * this._de,
    this._de
    );
  }
  return this.add( floatToFract( r ) );
 },
 addAndAss : function( r ){
  if( r instanceof _Fract ){
   if( this._mi != r._mi ){
    this.subAndAss( r.minus() );
   } else if( this._de == 0 ){
   } else if( r._de == 0 ){
    this.ass( r );
   } else {
    var de = _LCM( this._de, r._de );
    this._set( this._nu * de / this._de + r._nu * de / r._de, de );
   }
  } else {
   if( this._mi != (r < 0.0) ){
    this.subAndAss( -r );
   } else {
    var t = (r < 0.0) ? -r : r;
    if( t == _INT( t ) ){
     this._set( this._nu + t * this._de, this._de );
    } else {
     this.addAndAss( floatToFract( r ) );
    }
   }
  }
  return this;
 },
 sub : function( r ){
  if( r instanceof _Fract ){
   if( this._mi != r._mi ){
    return this.add( r.minus() );
   }
   if( this._de == 0 ){
    return this;
   }
   if( r._de == 0 ){
    return r;
   }
   var de = _LCM( this._de, r._de );
   var nu = this._nu * de / this._de - r._nu * de / r._de;
   if( nu < 0.0 ){
    return new _Fract( this._mi ? false : true, -nu, de );
   }
   return new _Fract( this._mi, nu, de );
  }
  if( this._mi != (r < 0.0) ){
   return this.add( -r );
  }
  var t = (r < 0.0) ? -r : r;
  if( t == _INT( t ) ){
   var nu = this._nu - t * this._de;
   if( nu < 0.0 ){
    return new _Fract( this._mi ? false : true, -nu, this._de );
   }
   return new _Fract( this._mi, nu, this._de );
  }
  return this.sub( floatToFract( r ) );
 },
 subAndAss : function( r ){
  if( r instanceof _Fract ){
   if( this._mi != r._mi ){
    this.addAndAss( r.minus() );
   } else if( this._de == 0 ){
   } else if( r._de == 0 ){
    this.ass( r );
   } else {
    var de = _LCM( this._de, r._de );
    var nu = this._nu * de / this._de - r._nu * de / r._de;
    if( nu < 0.0 ){
     this._mi = this._mi ? false : true;
     this._set( -nu, de );
    } else {
     this._set( nu, de );
    }
   }
  } else {
   if( this._mi != (r < 0.0) ){
    this.addAndAss( -r );
   } else {
    var t = (r < 0.0) ? -r : r;
    if( t == _INT( t ) ){
     var nu = this._nu - t * this._de;
     if( nu < 0.0 ){
      this._mi = this._mi ? false : true;
      this._set( -nu, this._de );
     } else {
      this._set( nu, this._de );
     }
    } else {
     this.subAndAss( floatToFract( r ) );
    }
   }
  }
  return this;
 },
 mul : function( r ){
  if( r instanceof _Fract ){
   return new _Fract(
    (this._mi != r._mi),
    this._nu * r._nu,
    this._de * r._de
    );
  }
  var t = (r < 0.0) ? -r : r;
  if( t == _INT( t ) ){
   return new _Fract(
    (this._mi != (r < 0.0)),
    this._nu * t,
    this._de
    );
  }
  return this.mul( floatToFract( r ) );
 },
 mulAndAss : function( r ){
  if( r instanceof _Fract ){
   this._mi = (this._mi != r._mi);
   this._set( this._nu * r._nu, this._de * r._de );
  } else {
   var t = (r < 0.0) ? -r : r;
   if( t == _INT( t ) ){
    this._mi = (this._mi != (r < 0.0));
    this._set( this._nu * t, this._de );
   } else {
    this.mulAndAss( floatToFract( r ) );
   }
  }
  return this;
 },
 div : function( r ){
  if( r instanceof _Fract ){
   return new _Fract(
    (this._mi != r._mi),
    this._nu * r._de,
    this._de * r._nu
    );
  }
  var t = (r < 0.0) ? -r : r;
  if( t == _INT( t ) ){
   return new _Fract(
    (this._mi != (r < 0.0)),
    this._nu,
    this._de * t
    );
  }
  return this.div( floatToFract( r ) );
 },
 divAndAss : function( r ){
  if( r instanceof _Fract ){
   this._mi = (this._mi != r._mi);
   this._set( this._nu * r._de, this._de * r._nu );
  } else {
   var t = (r < 0.0) ? -r : r;
   if( t == _INT( t ) ){
    this._mi = (this._mi != (r < 0.0));
    this._set( this._nu, this._de * t );
   } else {
    this.divAndAss( floatToFract( r ) );
   }
  }
  return this;
 },
 mod : function( r ){
  if( r instanceof _Fract ){
   if( this._de == 0 ){
    return this;
   }
   if( r._de == 0 ){
    return new _Fract( this._mi, r._nu, r._de );
   }
   var de = _LCM( this._de, r._de );
   var d = r._nu * de / r._de;
   if( d == 0.0 ){
    return new _Fract( this._mi, this._nu, 0 );
   }
   return new _Fract(
    this._mi,
    (this._nu * de / this._de) % d,
    de
    );
  }
  var t = (r < 0.0) ? -r : r;
  if( t == _INT( t ) ){
   if( this._de == 0 ){
    return this;
   }
   if( t == 0.0 ){
    return new _Fract( this._mi, 0, 0 );
   }
   return new _Fract(
    this._mi,
    this._nu % (t * this._de),
    this._de
    );
  }
  return this.mod( floatToFract( r ) );
 },
 modAndAss : function( r ){
  if( r instanceof _Fract ){
   if( this._de == 0 ){
   } else if( r._de == 0 ){
    this._nu = r._nu;
    this._de = r._de;
   } else {
    var de = _LCM( this._de, r._de );
    var d = r._nu * de / r._de;
    if( d == 0.0 ){
     this._de = 0;
    } else {
     this._set( (this._nu * de / this._de) % d, de );
    }
   }
  } else {
   var t = (r < 0.0) ? -r : r;
   if( t == _INT( t ) ){
    if( this._de == 0 ){
    } else if( t == 0.0 ){
     this._nu = 0;
     this._de = 0;
    } else {
     this._set( this._nu % (t * this._de), this._de );
    }
   } else {
    this.modAndAss( floatToFract( r ) );
   }
  }
  return this;
 },
 equal : function( r ){
  if( r instanceof _Fract ){
   return (this.getMinus() == r.getMinus()) && ((this._nu * r._de) == (this._de * r._nu));
  }
  return this.toFloat() == r;
 },
 notEqual : function( r ){
  if( r instanceof _Fract ){
   return (this.getMinus() != r.getMinus()) || ((this._nu * r._de) != (this._de * r._nu));
  }
  return this.toFloat() != r;
 },
 abs : function(){
  return new _Fract( false, this._nu, this._de );
 },
 _powInt : function( y ){
  var nu = _POW( this._nu, y );
  var de = _POW( this._de, y );
  return new _Fract(
   ((nu < 0.0) != (de < 0.0)),
   (nu < 0.0) ? -nu : nu,
   (de < 0.0) ? -de : de
   );
 },
 pow : function( y ){
  if( y instanceof _Fract ){
   if( y.toFloat() == _INT( y.toFloat() ) ){
    return this._powInt( y.toFloat() );
   }
   return floatToFract( _POW( this.toFloat(), y.toFloat() ) );
  }
  if( y == _INT( y ) ){
   return this._powInt( y );
  }
  return floatToFract( _POW( this.toFloat(), y ) );
 },
 sqr : function(){
  return new _Fract(
   false,
   this._nu * this._nu,
   this._de * this._de
   );
 }
};
function getFract( f, mi , nu , de ){
 mi.set( f._mi );
 nu.set( f._nu );
 de.set( f._de );
}
function setFract( f, mi, nu, de ){
 f._mi = mi;
 f._nu = nu;
 f._de = de;
 return f;
}
function dupFract( x ){
 return setFract( new _Fract(), x._mi, x._nu, x._de );
}
function floatToFract( x ){
 return (new _Fract()).ass( x );
}
var _DBL_EPSILON = 2.2204460492503131e-016;
var _NORMALIZE = 0.434294481903251816668;
var _RAND_MAX = 32767;
var _ABS = Math.abs;
var _ACOS = Math.acos;
var _ASIN = Math.asin;
var _ATAN = Math.atan;
var _ATAN2 = Math.atan2;
var _CEIL = Math.ceil;
var _COS = Math.cos;
var _EXP = Math.exp;
var _FLOOR = Math.floor;
var _LOG = Math.log;
var _POW = Math.pow;
var _SIN = Math.sin;
var _SQRT = Math.sqrt;
var _TAN = Math.tan;
var _rand_next = 1;
function srand( seed ){
 _rand_next = seed;
}
function rand(){
 _rand_next = _UNSIGNED( _rand_next * 1103515245 + 12345, 4294967296 );
 return _MOD( _rand_next / ((_RAND_MAX + 1) * 2), _RAND_MAX + 1 );
}
function _INT( x ){
 if( x < 0.0 ){
  return _CEIL( x );
 }
 return _FLOOR( x );
}
function _DIV( a, b ){
 if( a < 0 ){
  return _CEIL( a / b );
 }
 return _FLOOR( a / b );
}
function _MOD( a, b ){
 if( a < 0 ){
  a = -_INT( a );
  return -(a - _FLOOR( a / b ) * b);
 }
 a = _INT( a );
 return a - _FLOOR( a / b ) * b;
}
function _SHIFTL( a, b ){
 return a * _POW( 2, b );
}
function _SHIFTR( a, b ){
 return _DIV( a, _POW( 2, b ) );
}
function _AND( a, b ){
 return (_DIV( a, 0x10000 ) & _DIV( b, 0x10000 )) * 0x10000 + ((a & 0xFFFF) & (b & 0xFFFF));
}
function _OR( a, b ){
 return (_DIV( a, 0x10000 ) | _DIV( b, 0x10000 )) * 0x10000 + ((a & 0xFFFF) | (b & 0xFFFF));
}
function _XOR( a, b ){
 return (_DIV( a, 0x10000 ) ^ _DIV( b, 0x10000 )) * 0x10000 + ((a & 0xFFFF) ^ (b & 0xFFFF));
}
function _SIGNED( x, umax, smin, smax ){
 x = _MOD( x, umax );
 if( x > smax ) return x - umax;
 if( x < smin ) return x + umax;
 return x;
}
function _UNSIGNED( x, umax ){
 x = _MOD( x, umax );
 if( x < 0 ) return x + umax;
 return x;
}
function _MODF( x, _int ){
 var tmp = x.toString().split( "." );
 var k;
 if( tmp[1] ){
  if( (tmp[1].indexOf( "e" ) >= 0) || (tmp[1].indexOf( "E" ) >= 0) ){
   k = 1;
  } else {
   k = _POW( 10, tmp[1].length );
  }
 } else {
  k = 1;
 }
 var i = _INT( x );
 _int.set( i );
 return (x * k - i * k) / k;
}
function _FACTORIAL( x ){
 var m = false;
 if( x < 0 ){
  m = true;
  x = 0 - x;
 }
 var f = 1;
 for( var i = 2; i <= x; i++ ){
  f *= i;
 }
 return m ? -f : f;
}
function _CHAR( chr ){
 return chr.charCodeAt( 0 );
}
var _CHAR_CODE_0 = _CHAR( '0' );
var _CHAR_CODE_9 = _CHAR( '9' );
var _CHAR_CODE_LA = _CHAR( 'a' );
var _CHAR_CODE_LZ = _CHAR( 'z' );
var _CHAR_CODE_UA = _CHAR( 'A' );
var _CHAR_CODE_UZ = _CHAR( 'Z' );
var _CHAR_CODE_EX = _CHAR( '!' );
var _CHAR_CODE_COLON = _CHAR( ':' );
Number.isFinite = Number.isFinite || function( x ){
 return typeof x === "number" && isFinite( x );
};
Number.isNaN = Number.isNaN || function( x ){
 return typeof x === "number" && isNaN( x );
};
function _ISINF( x ){
 return Number.isFinite( x ) ? false : true;
}
function _ISNAN( x ){
 return Number.isNaN( x );
}
function _ISZERO( x ){
 return (_ISNAN( x ) || (x != 0.0)) ? false : true;
}
function _APPROX( x, y ){
 if( y == 0 ){
  return _ABS( x ) < (_DBL_EPSILON * 4.0);
 }
 return _ABS( (y - x) / y ) < (_DBL_EPSILON * 4.0);
}
function _APPROX_M( x, y ){
 if( x._row != y._row ) return false;
 if( x._col != y._col ) return false;
 var l = x._len;
 for( var i = 0; i < l; i++ ){
  if( !_APPROX( x.mat( i ).toFloat(), y.mat( i ).toFloat() ) || !_APPROX( x.mat( i ).imag(), y.mat( i ).imag() ) ) return false;
 }
 return true;
}
function _EPREC( x ){
 var p, q;
 var t, i;
 if( _ISINF( x ) || _ISNAN( x ) || _ISZERO( x ) ){
  return ( 0 );
 }
 q = 0;
 for( p = 0; ; p++ ){
  t = x * _POW( 10.0, p );
  i = _INT( t );
  if( (t - i) == 0.0 ){
   break;
  }
  if( i == 0 ){
   q++;
  }
 }
 if( q == 0 ){
  return p + _INT( _LOG( _ABS( x ) ) * _NORMALIZE ) ;
 }
 return p - q;
}
function _FPREC( x ){
 var p;
 var t, i;
 if( _ISINF( x ) || _ISNAN( x ) ){
  return 0;
 }
 for( p = 0; ; p++ ){
  t = x * _POW( 10.0, p );
  i = _INT( t );
  if( (t - i) == 0.0 ){
   break;
  }
 }
 return p;
}
function _GCD( x, y ){
 if( _ISNAN( x ) ) return x;
 if( _ISNAN( y ) ) return y;
 x = _INT( x );
 y = _INT( y );
 var t;
 while( y != 0 ){
  t = _MOD( x, y );
  x = y;
  y = t;
 }
 return x;
}
function _LCM( x, y ){
 if( _ISNAN( x ) ) return x;
 if( _ISNAN( y ) ) return y;
 x = _INT( x );
 y = _INT( y );
 var g = _GCD( x, y );
 if( g == 0 ){
  return 0.0;
 }
 return x * y / g;
}
function stringToFloat( str, top, stop ){
 var step = 0;
 var i = top;
 var _break = false;
 while( i < str.length ){
  switch( step ){
  case 0:
   if( (str.charAt( i ) == '+') || str.charAt( i ) == '-' ){
    i++;
   }
   step++;
   break;
  case 1:
  case 3:
  case 5:
   if( (str.charCodeAt( i ) >= _CHAR_CODE_0) && (str.charCodeAt( i ) <= _CHAR_CODE_9) ){
    i++;
   } else {
    step++;
   }
   break;
  case 2:
   if( str.charAt( i ) == '.' ){
    i++;
    step = 3;
   } else {
    step = 4;
   }
   break;
  case 4:
   if( (str.charAt( i ) == 'e') || (str.charAt( i ) == 'E') ){
    if( (str.charCodeAt( i + 1 ) >= _CHAR_CODE_0) && (str.charCodeAt( i + 1 ) <= _CHAR_CODE_9) ){
     i++;
     step = 5;
     break;
    }
    if( (str.charAt( i + 1 ) == '+') || str.charAt( i + 1 ) == '-' ){
     i += 2;
     step = 5;
     break;
    }
   }
  case 6:
   _break = true;
   break;
  }
  if( _break ){
   break;
  }
 }
 stop.set( i );
 return parseFloat( str.substring( top, i ) );
}
function stringToInt( str, top, stop , radix ){
 var val = 0;
 var i = top;
 var swi = false;
 if( str.charAt( i ) == '+' ){
  i++;
 } else if( str.charAt( i ) == '-' ){
  swi = true;
  i++;
 }
 var chr;
 var num = (radix > 10) ? 10 : radix;
 while( i < str.length ){
  chr = str.charCodeAt( i );
  val *= radix;
  if( (chr >= _CHAR_CODE_0) && (chr < _CHAR_CODE_0 + num) ){
   val += chr - _CHAR_CODE_0;
   i++;
  } else if( (chr >= _CHAR_CODE_LA) && (chr < _CHAR_CODE_LA + (radix - 10)) ){
   val += 10 + (chr - _CHAR_CODE_LA);
   i++;
  } else if( (chr >= _CHAR_CODE_UA) && (chr < _CHAR_CODE_UA + (radix - 10)) ){
   val += 10 + (chr - _CHAR_CODE_UA);
   i++;
  } else {
   break;
  }
 }
 stop.set( i );
 return swi ? -val : val;
}
function _trimFloatStr( str ){
 var str1 = str;
 var str2 = "";
 var top = str.indexOf( "e" );
 if( top < 0 ){
  top = str.indexOf( "E" );
 }
 if( top >= 0 ){
  str1 = str.substring( 0, top );
  str2 = str.slice( top );
 }
 var min = str1.indexOf( "." );
 if( min >= 0 ){
  var len = str1.length;
  while( len > min ){
   if( (str1.charAt( len - 1 ) != '0') && (str1.charAt( len - 1 ) != '.') ){
    break;
   }
   len--;
  }
  str1 = str1.substr( 0, len );
 }
 return str1 + str2;
}
function floatToExponential( val, width ){
 var str;
 if( width == undefined ){
  str = val.toExponential();
 } else {
  if( width < 0 ){
   width = 0;
  }
  if( width > 20 ){
   width = 20;
  }
  str = val.toExponential( width );
 }
 return _trimFloatStr( str );
}
function floatToFixed( val, width ){
 var str;
 if( width == undefined ){
  str = val.toFixed();
  if( (str.indexOf( "e" ) >= 0) || (str.indexOf( "E" ) >= 0) ){
   str = val.toExponential();
  }
 } else {
  if( width < 0 ){
   width = 0;
  }
  if( width > 20 ){
   width = 20;
  }
  str = val.toFixed( width );
  if( (str.indexOf( "e" ) >= 0) || (str.indexOf( "E" ) >= 0) ){
   str = val.toExponential( width );
  }
 }
 return _trimFloatStr( str );
}
function floatToString( val, width ){
 var str;
 if( width == undefined ){
  str = val.toPrecision();
 } else {
  if( width < 1 ){
   width = 1;
  }
  if( width > 21 ){
   width = 21;
  }
  str = val.toPrecision( width );
 }
 return _trimFloatStr( str );
}
function floatToStringPoint( val, width ){
 var str = floatToString( val, width );
 if( str.indexOf( "." ) < 0 ){
  str += ".0";
 }
 return str;
}
function intToString( val, radix, width ){
 if( _ISNAN( val ) ){
  return val.toString();
 }
 if( (width == undefined) || (width <= 0) ){
  width = 1;
 }
 var chr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
 var swi = (val < 0);
 if( swi ){
  val = -val;
 }
 var str = "";
 while( val != 0 ){
  str += chr.charAt( _MOD( val, radix ) );
  val = _DIV( val, radix );
 }
 for( i = str.length; i < width; i++ ){
  str += "0";
 }
 if( swi ){
  str += "-";
 }
 var str2 = "";
 for( var i = str.length - 1; i >= 0; i-- ){
  str2 += str.charAt( i );
 }
 return str2;
}
var _PI = 3.14159265358979323846264;
var _math_env;
function _MathEnv(){
 this._complex_ang_type = 0;
 this._complex_israd = true;
 this._complex_ang_coef = _PI;
 this._complex_isreal = false;
 this._complex_err = false;
 this._fract_err = false;
 this._matrix_err = false;
 this._time_fps = 30.0;
 this._time_err = false;
 this._value_type = 0;
}
function setMathEnv( env ){
 _math_env = env;
}
function setComplexAngType( angType ){
 _math_env._complex_ang_type = angType;
 _math_env._complex_israd = (_math_env._complex_ang_type == 0);
 _math_env._complex_ang_coef = (_math_env._complex_ang_type == 1) ? 180.0 : 200.0;
}
function complexAngType(){
 return _math_env._complex_ang_type;
}
function complexIsRad(){
 return _math_env._complex_israd;
}
function complexAngCoef(){
 return _math_env._complex_ang_coef;
}
function setComplexIsReal( isReal ){
 _math_env._complex_isreal = isReal;
}
function complexIsReal(){
 return _math_env._complex_isreal;
}
function clearComplexError(){
 _math_env._complex_err = false;
}
function setComplexError(){
 _math_env._complex_err = true;
}
function complexError(){
 return _math_env._complex_err;
}
function clearFractError(){
 _math_env._fract_err = false;
}
function setFractError(){
 _math_env._fract_err = true;
}
function fractError(){
 return _math_env._fract_err;
}
function clearMatrixError(){
 _math_env._matrix_err = false;
}
function setMatrixError(){
 _math_env._matrix_err = true;
}
function matrixError(){
 return _math_env._matrix_err;
}
function setTimeFps( fps ){
 _math_env._time_fps = fps;
}
function timeFps(){
 return _math_env._time_fps;
}
function clearTimeError(){
 _math_env._time_err = false;
}
function setTimeError(){
 _math_env._time_err = true;
}
function timeError(){
 return _math_env._time_err;
}
function setValueType( type ){
 _math_env._value_type = type;
}
function valueType(){
 return _math_env._value_type;
}
function clearValueError(){
 clearComplexError();
 clearFractError();
 clearTimeError();
}
function valueError(){
 return complexError() || fractError() || timeError();
}
function _Matrix( row, col ){
 this._row = (row == undefined) ? 1 : row;
 this._col = (col == undefined) ? 1 : col;
 this._len = this._row * this._col;
 this._mat = newValueArray( this._len + 1 );
}
_Matrix.prototype = {
 resize : function( row, col ){
  if( (row == this._row) && (col == this._col) ){
   return;
  }
  if( (this._len = row * col) > 0 ){
   var i, j;
   var mat = newValueArray( this._len + 1 );
   var m = (row < this._row) ? row : this._row;
   var n = (col < this._col) ? col : this._col;
   for( i = 0; i < m; i++ ){
    for( j = 0; j < n; j++ ){
     copyValue( mat[i * col + j], this._val( i, j ) );
    }
   }
   this._mat = mat;
   this._row = row;
   this._col = col;
  } else {
   this._len = this._row * this._col;
  }
 },
 _resize : function( ini ){
  if( ini._len > this._len ){
   for( var i = ini._len; i > this._len; i-- ){
    this._mat[i] = new _Value();
   }
  } else {
   copyValue( this._mat[ini._len], this._mat[this._len] );
  }
  this._row = ini._row;
  this._col = ini._col;
  this._len = ini._len;
 },
 _resize1 : function(){
  if( this._len > 1 ){
   copyValue( this._mat[1], this._mat[this._len] );
   this._row = 1;
   this._col = 1;
   this._len = 1;
  }
 },
 expand : function( row, col ){
  if( (row >= this._row) || (col >= this._col) ){
   this.resize(
    (row >= this._row) ? row + 1 : this._row,
    (col >= this._col) ? col + 1 : this._col
    );
  }
  return this._val( row, col );
 },
 set : function( row, col, val ){
  this.expand( row, col ).ass( val );
 },
 setReal : function( row, col, val ){
  this.expand( row, col ).setReal( val );
 },
 setImag : function( row, col, val ){
  this.expand( row, col ).setImag( val );
 },
 setNum : function( row, col, val ){
  this.expand( row, col ).setNum( val );
 },
 setDenom : function( row, col, val ){
  this.expand( row, col ).setDenom( val );
 },
 mat : function( index ){
  return this._mat[(index >= this._len) ? this._len : index];
 },
 val : function( row, col ){
  return this._mat[((row >= this._row) || (col >= this._col)) ? this._len : row * this._col + col];
 },
 _val : function( row, col ){
  return this._mat[row * this._col + col];
 },
 toFloat : function( row, col ){
  return this.val( row, col ).toFloat();
 },
 ass : function( r ){
  if( r instanceof _Matrix ){
   if( r._len == 1 ){
    this._resize1();
    copyValue( this._mat[0], r._mat[0] );
   } else {
    this._resize( r );
    for( var i = 0; i < this._len; i++ ){
     copyValue( this._mat[i], r._mat[i] );
    }
   }
  } else if( r instanceof _Value ){
   this._resize1();
   copyValue( this._mat[0], r );
  } else {
   this._resize1();
   this._mat[0].ass( r );
  }
  return this;
 },
 minus : function(){
  var a = new _Matrix( this._row, this._col );
  for( var i = 0; i < this._len; i++ ){
   copyValue( a._mat[i], this._mat[i].minus() );
  }
  return a;
 },
 add : function( r ){
  if( r instanceof _Matrix ){
   if( r._len == 1 ){
    return valueToMatrix( this._mat[0].add( r._mat[0] ) );
   }
   var i, j;
   var a = new _Matrix(
    (this._row > r._row) ? this._row : r._row,
    (this._col > r._col) ? this._col : r._col
    );
   for( i = 0; i < a._row; i++ ){
    for( j = 0; j < a._col; j++ ){
     copyValue( a._val( i, j ), this.val( i, j ).add( r.val( i, j ) ) );
    }
   }
   return a;
  }
  return valueToMatrix( this._mat[0].add( r ) );
 },
 addAndAss : function( r ){
  if( r instanceof _Matrix ){
   if( r._len == 1 ){
    this._resize1();
    this._mat[0].addAndAss( r._mat[0] );
   } else {
    var i, j;
    this.resize(
     (this._row > r._row) ? this._row : r._row,
     (this._col > r._col) ? this._col : r._col
     );
    for( i = 0; i < this._row; i++ ){
     for( j = 0; j < this._col; j++ ){
      this._val( i, j ).addAndAss( r.val( i, j ) );
     }
    }
   }
  } else {
   this._resize1();
   this._mat[0].addAndAss( r );
  }
  return this;
 },
 sub : function( r ){
  if( r instanceof _Matrix ){
   if( r._len == 1 ){
    return valueToMatrix( this._mat[0].sub( r._mat[0] ) );
   }
   var i, j;
   var a = new _Matrix(
    (this._row > r._row) ? this._row : r._row,
    (this._col > r._col) ? this._col : r._col
    );
   for( i = 0; i < a._row; i++ ){
    for( j = 0; j < a._col; j++ ){
     copyValue( a._val( i, j ), this.val( i, j ).sub( r.val( i, j ) ) );
    }
   }
   return a;
  }
  return valueToMatrix( this._mat[0].sub( r ) );
 },
 subAndAss : function( r ){
  if( r instanceof _Matrix ){
   if( r._len == 1 ){
    this._resize1();
    this._mat[0].subAndAss( r._mat[0] );
   } else {
    var i, j;
    this.resize(
     (this._row > r._row) ? this._row : r._row,
     (this._col > r._col) ? this._col : r._col
     );
    for( i = 0; i < this._row; i++ ){
     for( j = 0; j < this._col; j++ ){
      this._val( i, j ).subAndAss( r.val( i, j ) );
     }
    }
   }
  } else {
   this._resize1();
   this._mat[0].subAndAss( r );
  }
  return this;
 },
 mul : function( r ){
  if( this._len == 1 ){
   return dupMatrix( this ).mulAndAss( r );
  }
  if( r instanceof _Matrix ){
   if( r._len == 1 ){
    var a = new _Matrix( this._row, this._col );
    for( var i = 0; i < this._len; i++ ){
     copyValue( a._mat[i], this._mat[i].mul( r._mat[0] ) );
    }
    return a;
   }
   var i, j, k;
   var l = this._row;
   var m = (this._col > r._row) ? this._col : r._row;
   var n = r._col;
   var t = new _Value();
   var a = new _Matrix( l, n );
   for( i = 0; i < a._row; i++ ){
    for( j = 0; j < a._col; j++ ){
     t.ass( 0.0 );
     for( k = 0; k < m; k++ ){
      t.addAndAss( this.val( i, k ).mul( r.val( k, j ) ) );
     }
     copyValue( a._val( i, j ), t );
    }
   }
   return a;
  }
  var a = new _Matrix( this._row, this._col );
  for( var i = 0; i < this._len; i++ ){
   copyValue( a._mat[i], this._mat[i].mul( r ) );
  }
  return a;
 },
 mulAndAss : function( r ){
  if( r instanceof _Matrix ){
   if( this._len == 1 ){
    if( r._len == 1 ){
     this._mat[0].mulAndAss( r._mat[0] );
    } else {
     this.ass( r.mul( this._mat[0] ) );
    }
   } else {
    this.ass( this.mul( r ) );
   }
  } else {
   if( this._len == 1 ){
    this._mat[0].mulAndAss( r );
   } else {
    for( var i = 0; i < this._len; i++ ){
     this._mat[i].mulAndAss( r );
    }
   }
  }
  return this;
 },
 div : function( r ){
  var a = new _Matrix( this._row, this._col );
  if( r instanceof _Matrix ){
   for( var i = 0; i < this._len; i++ ){
    copyValue( a._mat[i], this._mat[i].div( r._mat[0] ) );
   }
  } else {
   for( var i = 0; i < this._len; i++ ){
    copyValue( a._mat[i], this._mat[i].div( r ) );
   }
  }
  return a;
 },
 divAndAss : function( r ){
  if( r instanceof _Matrix ){
   if( this._len == 1 ){
    this._mat[0].divAndAss( r._mat[0] );
   } else {
    for( var i = 0; i < this._len; i++ ){
     this._mat[i].divAndAss( r._mat[0] );
    }
   }
  } else {
   if( this._len == 1 ){
    this._mat[0].divAndAss( r );
   } else {
    for( var i = 0; i < this._len; i++ ){
     this._mat[i].divAndAss( r );
    }
   }
  }
  return this;
 },
 mod : function( r ){
  if( r instanceof _Matrix ){
   return valueToMatrix( this._mat[0].mod( r._mat[0] ) );
  }
  return valueToMatrix( this._mat[0].mod( r ) );
 },
 modAndAss : function( r ){
  this._resize1();
  if( r instanceof _Matrix ){
   this._mat[0].modAndAss( r._mat[0] );
  } else {
   this._mat[0].modAndAss( r );
  }
  return this;
 },
 equal : function( r ){
  if( r instanceof _Matrix ){
   if( (this._row != r._row) || (this._col != r._col) ){
    return false;
   }
   for( var i = 0; i < this._len; i++ ){
    if( this._mat[i].notEqual( r._mat[i] ) ){
     return false;
    }
   }
   return true;
  }
  if( this._len != 1 ){
   return false;
  }
  return this._mat[0].equal( r );
 },
 notEqual : function( r ){
  if( r instanceof _Matrix ){
   if( (this._row != r._row) || (this._col != r._col) ){
    return true;
   }
   for( var i = 0; i < this._len; i++ ){
    if( this._mat[i].notEqual( r._mat[i] ) ){
     return true;
    }
   }
   return false;
  }
  if( this._len != 1 ){
   return true;
  }
  return this._mat[0].notEqual( r );
 },
 trans : function(){
  var i, j;
  var a = new _Matrix( this._col, this._row );
  for( i = 0; i < a._row; i++ ){
   for( j = 0; j < a._col; j++ ){
    copyValue( a._val( i, j ), this._val( j, i ) );
   }
  }
  return a;
 }
};
function deleteMatrix( x ){
 for( var i = 0; i < x._mat.length; i++ ){
  x._mat[i] = null;
 }
 x._mat = null;
}
function dupMatrix( x ){
 var a = new _Matrix( x._row, x._col );
 for( var i = 0; i < x._len; i++ ){
  copyValue( a._mat[i], x._mat[i] );
 }
 return a;
}
function arrayToMatrix( x ){
 var i, j;
 var row = x.length;
 var col = x[0].length;
 for( i = 1; i < row; i++ ){
  if( x[i].length < col ){
   col = x[i].length;
  }
 }
 var a = new _Matrix( row, col );
 for( i = 0; i < row; i++ ){
  for( j = 0; j < col; j++ ){
   a._val( i, j ).ass( x[i][j] );
  }
 }
 return a;
}
function valueToMatrix( x ){
 var a = new _Matrix();
 copyValue( a._mat[0], x );
 return a;
}
function floatToMatrix( x ){
 var a = new _Matrix();
 a._mat[0].setFloat( x );
 return a;
}
function newMatrixArray( len ){
 var a = new Array( len );
 for( var i = 0; i < len; i++ ){
  a[i] = new _Matrix();
 }
 return a;
}
function _Time( i, h, m, s, f ){
 this._fps = timeFps();
 this._minus = (i == undefined) ? false : i;
 this._hour = (h == undefined) ? 0.0 : h;
 this._min = (m == undefined) ? 0.0 : m;
 this._sec = (s == undefined) ? 0.0 : s;
 this._frame = (f == undefined) ? 0.0 : f;
}
_Time.prototype = {
 _update : function(){
  if( timeFps() != this._fps ){
   this._frame = this._frame * timeFps() / this._fps;
   this._fps = timeFps();
   this.reduce();
  }
 },
 _reduce1 : function(){
  var _m, _s, _f;
  var _int = new _Float();
  _m = _MODF( this._hour, _int );
  this._hour = _int.val();
  this._min += _m * 60.0;
  _s = _MODF( this._min, _int );
  this._min = _int.val();
  this._sec += _s * 60.0;
  _f = _MODF( this._sec, _int );
  this._sec = _int.val();
  this._frame += _f * this._fps;
 },
 _reduce2 : function(){
  var _s, _m, _h;
  _s = _INT( this._frame / this._fps );
  if( (this._frame < 0.0) && ((this._frame - _s * this._fps) != 0.0) ){
   _s -= 1.0;
  }
  this._sec += _s;
  this._frame -= _s * this._fps;
  _m = _INT( this._sec / 60.0 );
  if( (this._sec < 0.0) && ((this._sec % 60.0) != 0.0) ){
   _m -= 1.0;
  }
  this._min += _m;
  this._sec -= _m * 60.0;
  _h = _INT( this._min / 60.0 );
  if( (this._min < 0.0) && ((this._min % 60.0) != 0.0) ){
   _h -= 1.0;
  }
  this._hour += _h;
  this._min -= _h * 60.0;
  if( this._hour < 0.0 ){
   this._minus = this._minus ? false : true;
   this._hour = -this._hour;
   this._min = -this._min;
   this._sec = -this._sec;
   this._frame = -this._frame;
   this._reduce2();
  }
 },
 reduce : function(){
  this._reduce1();
  this._reduce2();
 },
 _set : function( x ){
  this._fps = timeFps();
  if( x < 0.0 ){
   this._minus = true;
   x = -x;
  } else {
   this._minus = false;
  }
  this._hour = _DIV( x, 3600 ); x -= _INT( this._hour ) * 3600;
  this._min = _DIV( x, 60 ); x -= _INT( this._min ) * 60;
  this._sec = _INT( x );
  this._frame = (x - this._sec) * this._fps;
 },
 setMinus : function( i ){
  this._minus = i;
 },
 setHour : function( h ){
  this._hour = h;
 },
 setMin : function( m ){
  this._min = m;
 },
 setSec : function( s ){
  this._sec = s;
 },
 setFrame : function( f ){
  this._frame = f;
 },
 getMinus : function(){
  return this._minus;
 },
 hour : function(){
  return this._hour + (this._min / 60.0) + ((this._sec + this._frame / this._fps) / 3600.0);
 },
 min : function(){
  return this._min + ((this._sec + this._frame / this._fps) / 60.0);
 },
 sec : function(){
  return this._sec + this._frame / this._fps;
 },
 frame : function(){
  return this._frame;
 },
 toFloat : function(){
  if( this._minus ){
   return -(this._hour * 3600.0 + this._min * 60.0 + this._sec + this._frame / this._fps);
  }
  return this._hour * 3600.0 + this._min * 60.0 + this._sec + this._frame / this._fps;
 },
 ass : function( r ){
  if( r instanceof _Time ){
   this._fps = r._fps;
   this._minus = r._minus;
   this._hour = r._hour;
   this._min = r._min;
   this._sec = r._sec;
   this._frame = r._frame;
   this._update();
  } else {
   this._set( r );
  }
  return this;
 },
 minus : function(){
  return new _Time( this._minus ? false : true, this._hour, this._min, this._sec, this._frame );
 },
 add : function( r ){
  if( r instanceof _Time ){
   if( this._minus != r._minus ){
    return this.sub( r.minus() );
   }
   var ll = dupTime( this );
   ll._update();
   var rr = dupTime( r );
   rr._update();
   var t = new _Time(
    ll._minus,
    ll._hour + rr._hour,
    ll._min + rr._min,
    ll._sec + rr._sec,
    ll._frame + rr._frame
    );
   t.reduce();
   return t;
  }
  if( this._minus != (r < 0.0) ){
   return this.sub( -r );
  }
  var ll = dupTime( this );
  ll._update();
  var rr = floatToTime( r );
  var t = new _Time(
   ll._minus,
   ll._hour + rr._hour,
   ll._min + rr._min,
   ll._sec + rr._sec,
   ll._frame + rr._frame
   );
  t.reduce();
  return t;
 },
 addAndAss : function( r ){
  if( r instanceof _Time ){
   if( this._minus != r._minus ){
    this.subAndAss( r.minus() );
   } else {
    this._update();
    var rr = dupTime( r );
    rr._update();
    this._hour += rr._hour;
    this._min += rr._min;
    this._sec += rr._sec;
    this._frame += rr._frame;
    this.reduce();
   }
  } else {
   if( this._minus != (r < 0.0) ){
    this.subAndAss( -r );
   } else {
    this._update();
    var rr = floatToTime( r );
    this._hour += rr._hour;
    this._min += rr._min;
    this._sec += rr._sec;
    this._frame += rr._frame;
    this.reduce();
   }
  }
  return this;
 },
 sub : function( r ){
  if( r instanceof _Time ){
   if( this._minus != r._minus ){
    return this.add( r.minus() );
   }
   var ll = dupTime( this );
   ll._update();
   var rr = dupTime( r );
   rr._update();
   var t = new _Time(
    ll._minus,
    ll._hour - rr._hour,
    ll._min - rr._min,
    ll._sec - rr._sec,
    ll._frame - rr._frame
    );
   t.reduce();
   return t;
  }
  if( this._minus != (r < 0.0) ){
   return this.add( -r );
  }
  var ll = dupTime( this );
  ll._update();
  var rr = floatToTime( r );
  var t = new _Time(
   ll._minus,
   ll._hour - rr._hour,
   ll._min - rr._min,
   ll._sec - rr._sec,
   ll._frame - rr._frame
   );
  t.reduce();
  return t;
 },
 subAndAss : function( r ){
  if( r instanceof _Time ){
   if( this._minus != r._minus ){
    this.addAndAss( r.minus() );
   } else {
    this._update();
    var rr = dupTime( r );
    rr._update();
    this._hour -= rr._hour;
    this._min -= rr._min;
    this._sec -= rr._sec;
    this._frame -= rr._frame;
    this.reduce();
   }
  } else {
   if( this._minus != (r < 0.0) ){
    this.addAndAss( -r );
   } else {
    this._update();
    var rr = floatToTime( r );
    this._hour -= rr._hour;
    this._min -= rr._min;
    this._sec -= rr._sec;
    this._frame -= rr._frame;
    this.reduce();
   }
  }
  return this;
 },
 mul : function( r ){
  if( r instanceof _Time ){
   var ll = dupTime( this );
   ll._update();
   var rr = r.toFloat();
   var t = new _Time(
    ll._minus,
    ll._hour * rr,
    ll._min * rr,
    ll._sec * rr,
    ll._frame * rr
    );
   t.reduce();
   return t;
  }
  var ll = dupTime( this );
  ll._update();
  var t = new _Time(
   ll._minus,
   ll._hour * r,
   ll._min * r,
   ll._sec * r,
   ll._frame * r
   );
  t.reduce();
  return t;
 },
 mulAndAss : function( r ){
  this._update();
  if( r instanceof _Time ){
   var rr = r.toFloat();
   this._hour *= rr;
   this._min *= rr;
   this._sec *= rr;
   this._frame *= rr;
  } else {
   this._hour *= r;
   this._min *= r;
   this._sec *= r;
   this._frame *= r;
  }
  this.reduce();
  return this;
 },
 div : function( r ){
  if( r instanceof _Time ){
   var ll = dupTime( this );
   ll._update();
   var rr = r.toFloat();
   var t = new _Time(
    ll._minus,
    ll._hour / rr,
    ll._min / rr,
    ll._sec / rr,
    ll._frame / rr
    );
   t.reduce();
   return t;
  }
  var ll = dupTime( this );
  ll._update();
  var t = new _Time(
   ll._minus,
   ll._hour / r,
   ll._min / r,
   ll._sec / r,
   ll._frame / r
   );
  t.reduce();
  return t;
 },
 divAndAss : function( r ){
  this._update();
  if( r instanceof _Time ){
   var rr = r.toFloat();
   this._hour /= rr;
   this._min /= rr;
   this._sec /= rr;
   this._frame /= rr;
  } else {
   this._hour /= r;
   this._min /= r;
   this._sec /= r;
   this._frame /= r;
  }
  this.reduce();
  return this;
 },
 mod : function( r ){
  if( r instanceof _Time ){
   return floatToTime( this.toFloat() % r.toFloat() );
  }
  return floatToTime( this.toFloat() % r );
 },
 modAndAss : function( r ){
  if( r instanceof _Time ){
   this._set( this.toFloat() % r.toFloat() );
  } else {
   this._set( this.toFloat() % r );
  }
  return this;
 },
 equal : function( r ){
  if( r instanceof _Time ){
   return this.toFloat() == r.toFloat();
  }
  return this.toFloat() == r;
 },
 notEqual : function( r ){
  if( r instanceof _Time ){
   return this.toFloat() != r.toFloat();
  }
  return this.toFloat() != r;
 }
};
function getTime( t, fps , minus , hour , min , sec , frame ){
 fps .set( t._fps );
 minus.set( t._minus );
 hour .set( t._hour );
 min .set( t._min );
 sec .set( t._sec );
 frame.set( t._frame );
}
function setTime( t, fps, minus, hour, min, sec, frame ){
 t._fps = fps;
 t._minus = minus;
 t._hour = hour;
 t._min = min;
 t._sec = sec;
 t._frame = frame;
 return t;
}
function dupTime( x ){
 return setTime( new _Time(), x._fps, x._minus, x._hour, x._min, x._sec, x._frame );
}
function floatToTime( x ){
 return (new _Time()).ass( x );
}
function _Value(){
 this._type = valueType();
 this._c = new _Complex();
 this._f = new _Fract();
 this._t = new _Time();
}
_Value.prototype = {
 type : function(){
  if( valueType() != this._type ){
   switch( valueType() ){
   case 0:
    switch( this._type ){
    case 1: this._c.ass( this._f.toFloat() ); break;
    case 2 : this._c.ass( this._t.toFloat() ); break;
    }
    break;
   case 1:
    switch( this._type ){
    case 0: this._f.ass( this._c.toFloat() ); break;
    case 2 : this._f.ass( this._t.toFloat() ); break;
    }
    break;
   case 2:
    switch( this._type ){
    case 0: this._t.ass( this._c.toFloat() ); break;
    case 1 : this._t.ass( this._f.toFloat() ); break;
    }
    break;
   }
   this._type = valueType();
  }
  return this._type;
 },
 angToAng : function( old_type, new_type ){
  this._complex().angToAng( old_type, new_type );
 },
 _complex : function(){
  switch( this._type ){
  case 1: this._c.ass( this._f.toFloat() ); this._type = 0; break;
  case 2 : this._c.ass( this._t.toFloat() ); this._type = 0; break;
  }
  return this._c;
 },
 _tmpComplex : function(){
  if( this._type == 1 ) return floatToComplex( this._f.toFloat() );
  if( this._type == 2 ) return floatToComplex( this._t.toFloat() );
  return this._c;
 },
 _fract : function(){
  switch( this._type ){
  case 0: this._f.ass( this._c.toFloat() ); this._type = 1; break;
  case 2 : this._f.ass( this._t.toFloat() ); this._type = 1; break;
  }
  return this._f;
 },
 _tmpFract : function(){
  if( this._type == 0 ) return floatToFract( this._c.toFloat() );
  if( this._type == 2 ) return floatToFract( this._t.toFloat() );
  return this._f;
 },
 _time : function(){
  switch( this._type ){
  case 0: this._t.ass( this._c.toFloat() ); this._type = 2; break;
  case 1 : this._t.ass( this._f.toFloat() ); this._type = 2; break;
  }
  return this._t;
 },
 _tmpTime : function(){
  if( this._type == 0 ) return floatToTime( this._c.toFloat() );
  if( this._type == 1 ) return floatToTime( this._f.toFloat() );
  return this._t;
 },
 setFloat : function( x ){
  switch( this._type ){
  case 0: this._c.ass( x ); break;
  case 1 : this._f.ass( x ); break;
  case 2 : this._t.ass( x ); break;
  }
  return this;
 },
 setComplex : function( x ){
  switch( this._type ){
  case 0: this._c.ass( x ); break;
  case 1 : this._f.ass( x.toFloat() ); break;
  case 2 : this._t.ass( x.toFloat() ); break;
  }
  return this;
 },
 setFract : function( x ){
  switch( this._type ){
  case 0: this._c.ass( x.toFloat() ); break;
  case 1 : this._f.ass( x ); break;
  case 2 : this._t.ass( x.toFloat() ); break;
  }
  return this;
 },
 setTime : function( x ){
  switch( this._type ){
  case 0: this._c.ass( x.toFloat() ); break;
  case 1 : this._f.ass( x.toFloat() ); break;
  case 2 : this._t.ass( x ); break;
  }
  return this;
 },
 setReal : function( re ){
  this._complex().setReal( re );
 },
 setImag : function( im ){
  this._complex().setImag( im );
 },
 polar : function( rho, theta ){
  this._complex().polar( rho, theta );
 },
 fractSetMinus : function( mi ){
  this._fract().setMinus( mi );
 },
 setNum : function( nu ){
  this._fract().setNum( nu );
 },
 setDenom : function( de ){
  this._fract().setDenom( de );
 },
 fractReduce : function(){
  this._fract().reduce();
 },
 timeSetMinus : function( i ){
  this._time().setMinus( i );
 },
 setHour : function( h ){
  this._time().setHour( h );
 },
 setMin : function( m ){
  this._time().setMin( m );
 },
 setSec : function( s ){
  this._time().setSec( s );
 },
 setFrame : function( f ){
  this._time().setFrame( f );
 },
 timeReduce : function(){
  this._time().reduce();
 },
 real : function(){
  return this._tmpComplex().real();
 },
 imag : function(){
  return this._tmpComplex().imag();
 },
 fractMinus : function(){
  return this._tmpFract().getMinus();
 },
 num : function(){
  return this._tmpFract().num();
 },
 denom : function(){
  return this._tmpFract().denom();
 },
 timeMinus : function(){
  return this._tmpTime().getMinus();
 },
 hour : function(){
  return this._tmpTime().hour();
 },
 min : function(){
  return this._tmpTime().min();
 },
 sec : function(){
  return this._tmpTime().sec();
 },
 frame : function(){
  return this._tmpTime().frame();
 },
 toFloat : function(){
  if( this._type == 0 ) return this._c.toFloat();
  if( this._type == 1 ) return this._f.toFloat();
  return this._t.toFloat();
 },
 ass : function( r ){
  if( r instanceof _Value ){
   this._type = r._type;
   switch( this._type ){
   case 0: this._c.ass( r._c ); break;
   case 1 : this._f.ass( r._f ); break;
   case 2 : this._t.ass( r._t ); break;
   }
  } else {
   this._type = valueType();
   switch( this._type ){
   case 0: this._c.ass( r ); break;
   case 1 : this._f.ass( r ); break;
   case 2 : this._t.ass( r ); break;
   }
  }
  return this;
 },
 minus : function(){
  this.type();
  if( this._type == 0 ) return complexToValue( this._c.minus() );
  if( this._type == 1 ) return fractToValue ( this._f.minus() );
  return timeToValue( this._t.minus() );
 },
 add : function( r ){
  this.type();
  if( r instanceof _Value ){
   if( r._type == 0 ){
    if( this._type == 0 ) return complexToValue( this._c.add( r._c ) );
    if( this._type == 1 ) return fractToValue ( this._f.add( r._c.toFloat() ) );
    return timeToValue( this._t.add( r._c.toFloat() ) );
   }
   if( r._type == 1 ){
    if( this._type == 0 ) return complexToValue( this._c.add( r._f.toFloat() ) );
    if( this._type == 1 ) return fractToValue ( this._f.add( r._f ) );
    return timeToValue( this._t.add( r._f.toFloat() ) );
   }
   if( this._type == 0 ) return complexToValue( this._c.add( r._t.toFloat() ) );
   if( this._type == 1 ) return fractToValue ( this._f.add( r._t.toFloat() ) );
   return timeToValue( this._t.add( r._t ) );
  }
  if( this._type == 0 ) return complexToValue( this._c.add( r ) );
  if( this._type == 1 ) return fractToValue ( this._f.add( r ) );
  return timeToValue( this._t.add( r ) );
 },
 addAndAss : function( r ){
  if( r instanceof _Value ){
   switch( r._type ){
   case 0:
    switch( this.type() ){
    case 0: this._c.addAndAss( r._c ); break;
    case 1 : this._f.addAndAss( r._c.toFloat() ); break;
    case 2 : this._t.addAndAss( r._c.toFloat() ); break;
    }
    break;
   case 1:
    switch( this.type() ){
    case 0: this._c.addAndAss( r._f.toFloat() ); break;
    case 1 : this._f.addAndAss( r._f ); break;
    case 2 : this._t.addAndAss( r._f.toFloat() ); break;
    }
    break;
   case 2:
    switch( this.type() ){
    case 0: this._c.addAndAss( r._t.toFloat() ); break;
    case 1 : this._f.addAndAss( r._t.toFloat() ); break;
    case 2 : this._t.addAndAss( r._t ); break;
    }
    break;
   }
  } else {
   switch( this.type() ){
   case 0: this._c.addAndAss( r ); break;
   case 1 : this._f.addAndAss( r ); break;
   case 2 : this._t.addAndAss( r ); break;
   }
  }
  return this;
 },
 sub : function( r ){
  this.type();
  if( r instanceof _Value ){
   if( r._type == 0 ){
    if( this._type == 0 ) return complexToValue( this._c.sub( r._c ) );
    if( this._type == 1 ) return fractToValue ( this._f.sub( r._c.toFloat() ) );
    return timeToValue( this._t.sub( r._c.toFloat() ) );
   }
   if( r._type == 1 ){
    if( this._type == 0 ) return complexToValue( this._c.sub( r._f.toFloat() ) );
    if( this._type == 1 ) return fractToValue ( this._f.sub( r._f ) );
    return timeToValue( this._t.sub( r._f.toFloat() ) );
   }
   if( this._type == 0 ) return complexToValue( this._c.sub( r._t.toFloat() ) );
   if( this._type == 1 ) return fractToValue ( this._f.sub( r._t.toFloat() ) );
   return timeToValue( this._t.sub( r._t ) );
  }
  if( this._type == 0 ) return complexToValue( this._c.sub( r ) );
  if( this._type == 1 ) return fractToValue ( this._f.sub( r ) );
  return timeToValue( this._t.sub( r ) );
 },
 subAndAss : function( r ){
  if( r instanceof _Value ){
   switch( r._type ){
   case 0:
    switch( this.type() ){
    case 0: this._c.subAndAss( r._c ); break;
    case 1 : this._f.subAndAss( r._c.toFloat() ); break;
    case 2 : this._t.subAndAss( r._c.toFloat() ); break;
    }
    break;
   case 1:
    switch( this.type() ){
    case 0: this._c.subAndAss( r._f.toFloat() ); break;
    case 1 : this._f.subAndAss( r._f ); break;
    case 2 : this._t.subAndAss( r._f.toFloat() ); break;
    }
    break;
   case 2:
    switch( this.type() ){
    case 0: this._c.subAndAss( r._t.toFloat() ); break;
    case 1 : this._f.subAndAss( r._t.toFloat() ); break;
    case 2 : this._t.subAndAss( r._t ); break;
    }
    break;
   }
  } else {
   switch( this.type() ){
   case 0: this._c.subAndAss( r ); break;
   case 1 : this._f.subAndAss( r ); break;
   case 2 : this._t.subAndAss( r ); break;
   }
  }
  return this;
 },
 mul : function( r ){
  this.type();
  if( r instanceof _Value ){
   if( r._type == 0 ){
    if( this._type == 0 ) return complexToValue( this._c.mul( r._c ) );
    if( this._type == 1 ) return fractToValue ( this._f.mul( r._c.toFloat() ) );
    return timeToValue( this._t.mul( r._c.toFloat() ) );
   }
   if( r._type == 1 ){
    if( this._type == 0 ) return complexToValue( this._c.mul( r._f.toFloat() ) );
    if( this._type == 1 ) return fractToValue ( this._f.mul( r._f ) );
    return timeToValue( this._t.mul( r._f.toFloat() ) );
   }
   if( this._type == 0 ) return complexToValue( this._c.mul( r._t.toFloat() ) );
   if( this._type == 1 ) return fractToValue ( this._f.mul( r._t.toFloat() ) );
   return timeToValue( this._t.mul( r._t ) );
  }
  if( this._type == 0 ) return complexToValue( this._c.mul( r ) );
  if( this._type == 1 ) return fractToValue ( this._f.mul( r ) );
  return timeToValue( this._t.mul( r ) );
 },
 mulAndAss : function( r ){
  if( r instanceof _Value ){
   switch( r._type ){
   case 0:
    switch( this.type() ){
    case 0: this._c.mulAndAss( r._c ); break;
    case 1 : this._f.mulAndAss( r._c.toFloat() ); break;
    case 2 : this._t.mulAndAss( r._c.toFloat() ); break;
    }
    break;
   case 1:
    switch( this.type() ){
    case 0: this._c.mulAndAss( r._f.toFloat() ); break;
    case 1 : this._f.mulAndAss( r._f ); break;
    case 2 : this._t.mulAndAss( r._f.toFloat() ); break;
    }
    break;
   case 2:
    switch( this.type() ){
    case 0: this._c.mulAndAss( r._t.toFloat() ); break;
    case 1 : this._f.mulAndAss( r._t.toFloat() ); break;
    case 2 : this._t.mulAndAss( r._t ); break;
    }
    break;
   }
  } else {
   switch( this.type() ){
   case 0: this._c.mulAndAss( r ); break;
   case 1 : this._f.mulAndAss( r ); break;
   case 2 : this._t.mulAndAss( r ); break;
   }
  }
  return this;
 },
 div : function( r ){
  this.type();
  if( r instanceof _Value ){
   if( r._type == 0 ){
    if( this._type == 0 ) return complexToValue( this._c.div( r._c ) );
    if( this._type == 1 ) return fractToValue ( this._f.div( r._c.toFloat() ) );
    return timeToValue( this._t.div( r._c.toFloat() ) );
   }
   if( r._type == 1 ){
    if( this._type == 0 ) return complexToValue( this._c.div( r._f.toFloat() ) );
    if( this._type == 1 ) return fractToValue ( this._f.div( r._f ) );
    return timeToValue( this._t.div( r._f.toFloat() ) );
   }
   if( this._type == 0 ) return complexToValue( this._c.div( r._t.toFloat() ) );
   if( this._type == 1 ) return fractToValue ( this._f.div( r._t.toFloat() ) );
   return timeToValue( this._t.div( r._t ) );
  }
  if( this._type == 0 ) return complexToValue( this._c.div( r ) );
  if( this._type == 1 ) return fractToValue ( this._f.div( r ) );
  return timeToValue( this._t.div( r ) );
 },
 divAndAss : function( r ){
  if( r instanceof _Value ){
   switch( r._type ){
   case 0:
    switch( this.type() ){
    case 0: this._c.divAndAss( r._c ); break;
    case 1 : this._f.divAndAss( r._c.toFloat() ); break;
    case 2 : this._t.divAndAss( r._c.toFloat() ); break;
    }
    break;
   case 1:
    switch( this.type() ){
    case 0: this._c.divAndAss( r._f.toFloat() ); break;
    case 1 : this._f.divAndAss( r._f ); break;
    case 2 : this._t.divAndAss( r._f.toFloat() ); break;
    }
    break;
   case 2:
    switch( this.type() ){
    case 0: this._c.divAndAss( r._t.toFloat() ); break;
    case 1 : this._f.divAndAss( r._t.toFloat() ); break;
    case 2 : this._t.divAndAss( r._t ); break;
    }
    break;
   }
  } else {
   switch( this.type() ){
   case 0: this._c.divAndAss( r ); break;
   case 1 : this._f.divAndAss( r ); break;
   case 2 : this._t.divAndAss( r ); break;
   }
  }
  return this;
 },
 mod : function( r ){
  this.type();
  if( r instanceof _Value ){
   if( r._type == 0 ){
    if( this._type == 0 ) return complexToValue( this._c.mod( r._c ) );
    if( this._type == 1 ) return fractToValue ( this._f.mod( r._c.toFloat() ) );
    return timeToValue( this._t.mod( r._c.toFloat() ) );
   }
   if( r._type == 1 ){
    if( this._type == 0 ) return complexToValue( this._c.mod( r._f.toFloat() ) );
    if( this._type == 1 ) return fractToValue ( this._f.mod( r._f ) );
    return timeToValue( this._t.mod( r._f.toFloat() ) );
   }
   if( this._type == 0 ) return complexToValue( this._c.mod( r._t.toFloat() ) );
   if( this._type == 1 ) return fractToValue ( this._f.mod( r._t.toFloat() ) );
   return timeToValue( this._t.mod( r._t ) );
  }
  if( this._type == 0 ) return complexToValue( this._c.mod( r ) );
  if( this._type == 1 ) return fractToValue ( this._f.mod( r ) );
  return timeToValue( this._t.mod( r ) );
 },
 modAndAss : function( r ){
  if( r instanceof _Value ){
   switch( r._type ){
   case 0:
    switch( this.type() ){
    case 0: this._c.modAndAss( r._c ); break;
    case 1 : this._f.modAndAss( r._c.toFloat() ); break;
    case 2 : this._t.modAndAss( r._c.toFloat() ); break;
    }
    break;
   case 1:
    switch( this.type() ){
    case 0: this._c.modAndAss( r._f.toFloat() ); break;
    case 1 : this._f.modAndAss( r._f ); break;
    case 2 : this._t.modAndAss( r._f.toFloat() ); break;
    }
    break;
   case 2:
    switch( this.type() ){
    case 0: this._c.modAndAss( r._t.toFloat() ); break;
    case 1 : this._f.modAndAss( r._t.toFloat() ); break;
    case 2 : this._t.modAndAss( r._t ); break;
    }
    break;
   }
  } else {
   switch( this.type() ){
   case 0: this._c.modAndAss( r ); break;
   case 1 : this._f.modAndAss( r ); break;
   case 2 : this._t.modAndAss( r ); break;
   }
  }
  return this;
 },
 equal : function( r ){
  this.type();
  if( r instanceof _Value ){
   if( r._type == 0 ){
    if( this._type == 0 ) return this._c.equal( r._c );
    if( this._type == 1 ) return this._f.equal( r._c.toFloat() );
    return this._t.equal( r._c.toFloat() );
   }
   if( r._type == 1 ){
    if( this._type == 0 ) return this._c.equal( r._f.toFloat() );
    if( this._type == 1 ) return this._f.equal( r._f );
    return this._t.equal( r._f.toFloat() );
   }
   if( this._type == 0 ) return this._c.equal( r._t.toFloat() );
   if( this._type == 1 ) return this._f.equal( r._t.toFloat() );
   return this._t.equal( r._t );
  }
  if( this._type == 0 ) return this._c.equal( r );
  if( this._type == 1 ) return this._f.equal( r );
  return this._t.equal( r );
 },
 notEqual : function( r ){
  this.type();
  if( r instanceof _Value ){
   if( r._type == 0 ){
    if( this._type == 0 ) return this._c.notEqual( r._c );
    if( this._type == 1 ) return this._f.notEqual( r._c.toFloat() );
    return this._t.notEqual( r._c.toFloat() );
   }
   if( r._type == 1 ){
    if( this._type == 0 ) return this._c.notEqual( r._f.toFloat() );
    if( this._type == 1 ) return this._f.notEqual( r._f );
    return this._t.notEqual( r._f.toFloat() );
   }
   if( this._type == 0 ) return this._c.notEqual( r._t.toFloat() );
   if( this._type == 1 ) return this._f.notEqual( r._t.toFloat() );
   return this._t.notEqual( r._t );
  }
  if( this._type == 0 ) return this._c.notEqual( r );
  if( this._type == 1 ) return this._f.notEqual( r );
  return this._t.notEqual( r );
 },
 abs : function(){
  this.type();
  if( this._type == 0 ) return floatToValue( this._c.fabs() );
  if( this._type == 1 ) return fractToValue( this._f.abs () );
  return fractToValue( this._tmpFract().abs() );
 },
 pow : function( y ){
  this.type();
  if( y instanceof _Value ){
   if( this._type == 0 ) return complexToValue( this._c.pow( y._tmpComplex() ) );
   if( this._type == 1 ) return fractToValue ( this._f.pow( y._tmpFract () ) );
   return fractToValue( this._tmpFract().pow( y._tmpFract() ) );
  }
  if( this._type == 0 ) return complexToValue( this._c.pow( y ) );
  if( this._type == 1 ) return fractToValue ( this._f.pow( y ) );
  return fractToValue( this._tmpFract().pow( y ) );
 },
 sqr : function(){
  this.type();
  if( this._type == 0 ) return complexToValue( this._c.sqr() );
  if( this._type == 1 ) return fractToValue ( this._f.sqr() );
  return fractToValue( this._tmpFract().sqr() );
 },
 ldexp : function( exp ){
  var x = this.toFloat();
  var w = (exp >= 0) ? 2.0 : 0.5;
  if( exp < 0 ) exp = -exp;
  while( exp != 0 ){
   if( (exp & 1) != 0 ) x *= w;
   w *= w;
   exp = _DIV( exp, 2 );
  }
  return floatToValue( x );
 },
 frexp : function( exp ){
  var x = this.toFloat();
  var m = (x < 0.0) ? true : false;
  if( m ) x = -x;
  var e = 0;
  if( x >= 1.0 ){
   while( x >= 1.0 ){
    x /= 2.0;
    e++;
   }
  } else if( x != 0.0 ){
   while( x < 0.5 ){
    x *= 2.0;
    e--;
   }
  }
  if( m ) x = -x;
  exp.set( e );
  return floatToValue( x );
 },
 modf : function( _int ){
  return floatToValue( _MODF( this.toFloat(), _int ) );
 },
 factorial : function(){
  return floatToValue( _FACTORIAL( this.toFloat() ) );
 },
 farg : function(){
  return this._complex().farg();
 },
 fnorm : function(){
  return this._complex().fnorm();
 },
 conjg : function(){
  return complexToValue( this._complex().conjg() );
 },
 sin : function(){
  return complexToValue( this._complex().sin() );
 },
 cos : function(){
  return complexToValue( this._complex().cos() );
 },
 tan : function(){
  return complexToValue( this._complex().tan() );
 },
 asin : function(){
  return complexToValue( this._complex().asin() );
 },
 acos : function(){
  return complexToValue( this._complex().acos() );
 },
 atan : function(){
  return complexToValue( this._complex().atan() );
 },
 sinh : function(){
  return complexToValue( this._complex().sinh() );
 },
 cosh : function(){
  return complexToValue( this._complex().cosh() );
 },
 tanh : function(){
  return complexToValue( this._complex().tanh() );
 },
 asinh : function(){
  return complexToValue( this._complex().asinh() );
 },
 acosh : function(){
  return complexToValue( this._complex().acosh() );
 },
 atanh : function(){
  return complexToValue( this._complex().atanh() );
 },
 ceil : function(){
  return complexToValue( this._complex().ceil() );
 },
 floor : function(){
  return complexToValue( this._complex().floor() );
 },
 exp : function(){
  return complexToValue( this._complex().exp() );
 },
 exp10 : function(){
  return complexToValue( this._complex().exp10() );
 },
 log : function(){
  return complexToValue( this._complex().log() );
 },
 log10 : function(){
  return complexToValue( this._complex().log10() );
 },
 sqrt : function(){
  return complexToValue( this._complex().sqrt() );
 }
};
function deleteValue( x ){
 x._c = null;
 x._f = null;
 x._t = null;
}
function getValue( v, type , c , f , t ){
 type.set( v._type );
 setComplex( c, v._c._re, v._c._im );
 setFract( f, v._f._mi, v._f._nu, v._f._de );
 setTime( t, v._t._fps, v._t._minus, v._t._hour, v._t._min, v._t._sec, v._t._frame );
}
function setValue( v, type, c, f, t ){
 v._type = type;
 setComplex( v._c, c._re, c._im );
 setFract( v._f, f._mi, f._nu, f._de );
 setTime( v._t, t._fps, t._minus, t._hour, t._min, t._sec, t._frame );
 return v;
}
function copyValue( v, x ){
 v._type = x._type;
 switch( v._type ){
 case 0: setComplex( v._c, x._c._re, x._c._im ); break;
 case 1 : setFract( v._f, x._f._mi, x._f._nu, x._f._de ); break;
 case 2 : setTime( v._t, x._t._fps, x._t._minus, x._t._hour, x._t._min, x._t._sec, x._t._frame ); break;
 }
 return v;
}
function dupValue( x ){
 return copyValue( new _Value(), x );
}
function floatToValue( x ){
 return (new _Value()).setFloat( x );
}
function complexToValue( x ){
 return (new _Value()).setComplex( x );
}
function fractToValue( x ){
 return (new _Value()).setFract( x );
}
function timeToValue( x ){
 return (new _Value()).setTime( x );
}
function newValueArray( len ){
 var a = new Array( len );
 for( var i = 0; i < len; i++ ){
  a[i] = new _Value();
 }
 return a;
}
var _console_break = "<br>";
function consoleBreak(){
 return _console_break;
}
function _Console( id ){
 if( window.onConsoleUpdate == undefined ) window.onConsoleUpdate = function( id ){};
 this._id = id;
 this._div = document.getElementById( this._id );
 this._html = "";
 this._blankLine = "";
 this._maxLen = 0;
 this._color = "";
 this._lastColor = "";
 this._bold = false;
 this._italic = false;
 this._lock = false;
 this._needUpdate = false;
}
_Console.prototype = {
 setMaxBlankLine : function( num ){
  this._blankLine = "";
  for( var i = 0; i <= num; i++ ){
   this._blankLine += _console_break;
  }
 },
 setMaxLen : function( len ){
  this._maxLen = len;
 },
 setColor : function( color ){
  this._color = (color == undefined) ? "" : color;
 },
 setBold : function( f ){
  this._bold = f;
 },
 setItalic : function( f ){
  this._italic = f;
 },
 lock : function(){
  this._lock = true;
  this._needUpdate = false;
 },
 unlock : function(){
  this._lock = false;
  if( this._needUpdate ){
   this._update();
   this._needUpdate = false;
  }
 },
 _update : function(){
  if( this._lock ){
   this._needUpdate = true;
   return;
  }
  if( this._maxLen > 0 ){
   while( this._html.length > this._maxLen ){
    var index = this._html.indexOf( _console_break );
    if( index < 0 ){
     break;
    }
    this._html = this._html.slice( index + _console_break.length );
   }
  }
  this._div.innerHTML = this._html;
  if( this._html.length > 0 ){
   onConsoleUpdate( this._id );
  }
 },
 _add : function( str ){
  if( str.length > 0 ){
   if( this._bold ){
    if( this._html.slice( -4 ) == "</b>" ){
     this._html = this._html.substring( 0, this._html.length - 4 );
    } else {
     this._html += "<b>";
    }
   }
   if( this._italic ){
    if( this._html.slice( -4 ) == "</i>" ){
     this._html = this._html.substring( 0, this._html.length - 4 );
    } else {
     this._html += "<i>";
    }
   }
   if( this._color.length > 0 ){
    if( (this._html.slice( -7 ) == "</span>") && (this._color == this._lastColor) ){
     this._html = this._html.substring( 0, this._html.length - 7 );
    } else {
     this._html += "<span style='color:#" + this._color + "'>";
    }
    this._lastColor = this._color;
   }
   this._html += str;
   if( this._color.length > 0 ){
    this._html += "</span>";
   }
   if( this._italic ){
    this._html += "</i>";
   }
   if( this._bold ){
    this._html += "</b>";
   }
  }
 },
 clear : function(){
  this._html = "";
  this._update();
 },
 newLine : function(){
  if( this._html.length >= _console_break.length ){
   if( this._html.slice( -_console_break.length ) != _console_break ){
    this._html += _console_break;
    this._update();
   }
  }
 },
 print : function( str ){
  if( str != undefined ){
   this._add( str );
   this._update();
  }
 },
 println : function( str ){
  var needUpdate = false;
  if( str != undefined ){
   this._add( str );
   needUpdate = true;
  }
  if( (this._blankLine.length > 0) && (this._html.length >= this._blankLine.length) ){
   if( this._html.slice( -this._blankLine.length ) != this._blankLine ){
    this._html += _console_break;
    needUpdate = true;
   }
  } else {
   this._html += _console_break;
   needUpdate = true;
  }
  if( needUpdate ){
   this._update();
  }
 },
 scrollBottom : function(){
  this._div.scrollTop = this._div.scrollHeight;
 }
};
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
function _Error(){
 if( window.onError == undefined ) window.onError = function( e ){};
 this._message = new String();
 this._name = new String();
 this._description = new String();
 this._number = new String();
 this._file = new String();
 this._line = new String();
 this._column = new String();
 this._stack = new String();
}
_Error.prototype = {
 message : function(){
  return this._message;
 },
 name : function(){
  return this._name;
 },
 description : function(){
  return this._description;
 },
 number : function(){
  return this._number;
 },
 file : function(){
  return this._file;
 },
 line : function(){
  return this._line;
 },
 column : function(){
  return this._column;
 },
 stack : function(){
  return this._stack;
 }
};
function catchError( e ){
 var _e = new _Error();
 _e._message = e.message;
 _e._name = e.name;
 if( e.description ) _e._description = e.description;
 if( e.number ) _e._number = "" + e.number;
 if( e.fileName ) _e._file = e.fileName;
 if( e.lineNumber ) _e._line = "" + e.lineNumber;
 if( e.columnNumber ) _e._column = "" + e.columnNumber;
 if( e.stack ) _e._stack = e.stack;
 onError( _e );
}
function clip_onerror( message, url, line ){
 var e = new _Error();
 e._message = message;
 e._file = url;
 e._line = line;
 onError( e );
 return true;
}
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
function testMath2(){
 startTest( "[testing function, part 2]" );
 var piby4 = 0.78539816339744830962;
 var rthalf = 0.70710678118654752440;
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
function testMath3(){
 startTest( "[testing function, part 3]" );
 var e = 2.71828182845904523536;
 var ln2 = 0.69314718055994530942;
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
function testComplex(){
 startTest( "[testing complex]" );
 var fc0 = new _Complex();
 var fc1 = floatToComplex( 1 );
 var fc2 = new _Complex( 2, 2 );
 test( "fc0=" + toString( fc0 ), fc0.real() == 0 && fc0.imag() == 0 );
 test( "fc1=" + toString( fc1 ), fc1.real() == 1 && fc1.imag() == 0 );
 test( "fc2=" + toString( fc2 ), fc2.real() == 2 && fc2.imag() == 2 );
 fc0.addAndAss( fc2 ); test( "addAndAss", fc0.real() == 2 && fc0.imag() == 2 );
 fc0.subAndAss( fc1 ); test( "subAndAss", fc0.real() == 1 && fc0.imag() == 2 );
 fc0.mulAndAss( fc2 ); test( "mulAndAss", fc0.real() == -2 && fc0.imag() == 6 );
 fc0.divAndAss( fc2 ); test( "divAndAss", fc0.real() == 1 && fc0.imag() == 2 );
 fc0.ass( new _Complex( -4, -5 ) ); test( "ass" , fc0.real() == -4 && fc0.imag() == -5 );
 fc0.ass( floatToComplex( 2 ).add( fc2 ).add( 3 ) ); test( "add" , fc0.real() == 7 && fc0.imag() == 2 );
 fc0.ass( floatToComplex( 2 ).sub( fc2 ).sub( 3 ) ); test( "sub" , fc0.real() == -3 && fc0.imag() == -2 );
 fc0.ass( floatToComplex( 2 ).mul( fc2 ).mul( 3 ) ); test( "mul" , fc0.real() == 12 && fc0.imag() == 12 );
 fc0.ass( floatToComplex( 8 ).div( fc2 ).div( 2 ) ); test( "div" , fc0.real() == 1 && fc0.imag() == -1 );
 fc0.ass( fc1.add( fc2.minus() ) ); test( "minus", fc0.real() == -1 && fc0.imag() == -2 );
 test( "equal" , fc2.equal ( fc2 ) && fc1.equal ( 1 ) && floatToComplex( 1 ).equal ( fc1 ) );
 test( "notEqual", fc1.notEqual( fc2 ) && fc1.notEqual( 0 ) && floatToComplex( 3 ).notEqual( fc1 ) );
 var e = 2.7182818284590452353602875;
 var ln2 = 0.6931471805599453094172321;
 var piby4 = 0.7853981633974483096156608;
 var rthalf = 0.7071067811865475244008444;
 var c1 = rthalf * (e + 1 / e) / 2;
 var s1 = rthalf * (e - 1 / e) / 2;
 test( "fabs", _APPROX( (new _Complex( 5, -12 )).fabs(), 13 ) );
 test( "farg", fc1.farg() == 0 && _APPROX( fc2.farg(), piby4 ) );
 test( "conjg", fc2.conjg().equal( new _Complex( 2, -2 ) ) );
 fc0.ass( (new _Complex( piby4, -1 )).cos() ); test( "cos" , _APPROX( fc0.real(), c1 ) && _APPROX( fc0.imag(), s1 ) );
 fc0.ass( (new _Complex( -1, piby4 )).cosh() ); test( "cosh", _APPROX( fc0.real(), c1 ) && _APPROX( fc0.imag(), -s1 ) );
 fc0.ass( fc1.exp() ); test( "exp" , _APPROX( fc0.real(), e ) && fc0.imag() == 0 );
 fc0.ass( (new _Complex( 1, -piby4 )).exp() ); test( "exp" , _APPROX( fc0.real(), e * rthalf ) && _APPROX( fc0.imag(), -e * rthalf ) );
 fc0.ass( (new _Complex( 1, -1 )).log() ); test( "log" , _APPROX( fc0.real(), ln2 / 2 ) && _APPROX( fc0.imag(), -piby4 ) );
 test( "norm", (new _Complex( 3, -4 )).fnorm() == 25 && fc2.fnorm() == 8 );
 fc0.polar( 1, -piby4 ); test( "polar", _APPROX( fc0.real(), rthalf ) && _APPROX( fc0.imag(), -rthalf ) );
 fc0.ass( fc2.pow( fc2 ) );
 fc0.ass( fc2.pow( 5 ) ); test( "pow", _APPROX( fc0.real(), -128 ) && _APPROX( fc0.imag(), -128 ) );
printBlue( toString( fc0 ) );
 fc0.ass( fc2.pow( 2 ) ); test( "pow", _APPROX( fc0.real(), 0 ) && _APPROX( fc0.imag(), 8 ) );
printBlue( toString( fc0 ) );
 fc0.ass( floatToComplex( 2 ).pow( fc2 ) );
 fc0.ass( (new _Complex( piby4, -1 )).sin() ); test( "sin" , _APPROX( fc0.real(), c1 ) && _APPROX( fc0.imag(), -s1 ) );
 fc0.ass( (new _Complex( -1, piby4 )).sinh() ); test( "sinh", _APPROX( fc0.real(), -s1 ) && _APPROX( fc0.imag(), c1 ) );
 fc0.ass( (new _Complex( rthalf, -rthalf )).sqr() ); test( "sqr" , _APPROX( fc0.real(), 0 ) && _APPROX( fc0.imag(), -1 ) );
 fc0.ass( (new _Complex( 0, -1 )).sqrt() ); test( "sqrt", _APPROX( fc0.real(), rthalf ) && _APPROX( fc0.imag(), -rthalf ) );
 endTest();
}
function testMatrix(){
 startTest( "[testing matrix]" );
 var matI = arrayToMatrix( [[ 1, 0, 0 ],[ 0, 1, 0 ],[ 0, 0, 1 ]] );
 printBold( "test 1" );
 var matA, matB, matC;
 matA = arrayToMatrix( [[ -4, 6, 3 ],[ 0, 1, 2 ]] );
 matB = arrayToMatrix( [[ 5, -1, 0 ],[ 3, 1, 0 ]] );
 matC = arrayToMatrix( [[ 1, 5, 3 ],[ 3, 2, 2 ]] );
 test( "", matC.equal( matA.add( matB ) ) );
 printBold( "test 2" );
 matA = arrayToMatrix( [[ 2.7, -1.8 ],[ 0.9, 3.6 ]] );
 matB = arrayToMatrix( [[ 5.4, -3.6 ],[ 1.8, 7.2 ]] );
 matC = arrayToMatrix( [[ 3 , -2 ],[ 1 , 4 ]] );
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
 matA = arrayToMatrix( [[ 2, 3 ],[ 5, -1 ]] );
 matR = arrayToMatrix( [[ 2, 4 ],[ 4, -1 ]] );
 matS = arrayToMatrix( [[ 0, -1 ],[ 1, 0 ]] );
 test( "", matA.add( matA.trans() ).div( 2 ).equal( matR ) );
 test( "", matA.sub( matA.trans() ).div( 2 ).equal( matS ) );
 printBold( "test 6" );
 matA = arrayToMatrix( [[ 2, -3 ],[ 0, 4 ]] );
 matB = arrayToMatrix( [[ -5, 2 ],[ 2, 1 ]] );
 matC = arrayToMatrix( [[ 7, -5 ],[ -2, 3 ]] ); test( "", matA.sub( matB ).equal( matC ) );
 matC = arrayToMatrix( [[ -7, 5 ],[ 2, -3 ]] ); test( "", matB.sub( matA ).equal( matC ) );
 matC = arrayToMatrix( [[ 2, 0 ],[ -3, 4 ]] ); test( "", matA.trans().equal( matC ) );
              test( "", matB.trans().equal( matB ) );
              test( "", matB.trans().trans().equal( matB ) );
 matC = arrayToMatrix( [[ 4, -3 ],[ -3, 8 ]] ); test( "", matA.add( matA.trans() ).equal( matC ) );
 matC = arrayToMatrix( [[ 0, -3 ],[ 3, 0 ]] ); test( "", matA.sub( matA.trans() ).equal( matC ) );
 matC = arrayToMatrix( [[ -3, 2 ],[ -1, 5 ]] ); test( "", matA.add( matB ).trans().equal( matC ) );
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
 matA = arrayToMatrix( [[ 2, 1 ],[ 3, 4 ]] );
 matB = arrayToMatrix( [[ 1, -2 ],[ 5, 3 ]] );
 matC = arrayToMatrix( [[ 7, -1 ],[ 23, 6 ]] );
 test( "", matA.mul( matB ).equal( matC ) );
 printBold( "test 9" );
 matA = arrayToMatrix( [[ 3, 2, -1 ],[ 0, 4, 6 ]] );
 matB = arrayToMatrix( [[ 1, 0, 2 ],[ 5, 3, 1 ],[ 6, 4, 2 ]] );
 matC = arrayToMatrix( [[ 7, 2, 6 ],[ 56, 36, 16 ]] );
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
 matA = arrayToMatrix( [[ 1, 1 ],[ 2, 2 ]] );
 matB = arrayToMatrix( [[ -1, 1 ],[ 1, -1 ]] );
 matC = arrayToMatrix( [[ 0, 0 ],[ 0, 0 ]] ); test( "", matA.mul( matB ).equal( matC ) );
 printBold( "test 14" );
 var matD;
 matA = arrayToMatrix( [[ 4, 6, -1 ],[ 3, 0, 2 ],[ 1, -2, 5 ]] );
 matB = arrayToMatrix( [[ 2, 4 ],[ 0, 1 ],[ -1, 2 ]] );
 matC = arrayToMatrix( [[ 3 ],[ 1 ],[ 2 ]] );
 matD = arrayToMatrix( [[ 33, 26, 3 ],[ 14, 14, 7 ],[ 3, -4, 20 ]] ); test( "", matA.mul( matA ).equal( matD ) );
 matD = arrayToMatrix( [[ 4 ],[ 17 ]] ); test( "", matB.trans().mul( matC ).equal( matD ) );
 matD = arrayToMatrix( [[ 4, 17 ]] ); test( "", matC.trans().mul( matB ).equal( matD ) );
 matD = arrayToMatrix( [[ 20, 4, 6 ],[ 4, 1, 2 ],[ 6, 2, 5 ]] ); test( "", matB.mul( matB.trans() ).equal( matD ) );
 matD = arrayToMatrix( [[ 5, 6 ],[ 6, 21 ]] ); test( "", matB.trans().mul( matB ).equal( matD ) );
 matD = arrayToMatrix( [[ 43, 44, 0 ],[ 23, 12, 13 ],[ 6, -10, 33 ]] ); test( "", matA.mul( matA ).add( floatToMatrix( 3 ).mul( matA ) ).sub( floatToMatrix( 2 ).mul( matI ) ).equal( matD ) );
 matD = arrayToMatrix( [[ 25, 100 ]] ); test( "", matC.trans().mul( matA ).mul( matB ).equal( matD ) );
 matD = arrayToMatrix( [[ 25 ],[ 100 ]] ); test( "", matA.mul( matB ).trans().mul( matC ).equal( matD ) );
 printBold( "test 15" );
 matA = arrayToMatrix( [[ 2, -1, 0 ],[ 0, -2, 1 ],[ 1, 0, 1 ]] );
 matB = arrayToMatrix( [[ -2, 1, -1 ],[ 1, 2, -2 ],[ 2, -1, -4 ]] );
 matC = arrayToMatrix( [[ -5, 0, 0 ],[ 0, -5, 0 ],[ 0, 0, -5 ]] );
 test( "", matA.mul( matB ).equal( matB.mul( matA ) ) );
 test( "", matA.mul( matB ).equal( matC ) );
 test( "", matB.mul( matA ).equal( matC ) );
 endTest();
}
