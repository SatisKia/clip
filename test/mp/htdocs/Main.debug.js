var mp;






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
function dft( ret , ret_num, src , src_num ){
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
function idft( ret , ret_num, src , src_num ){
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
function conv( ret , ret_num, x , x_num, y , y_num ){
 var X = new Array();
 var Y = new Array();
 dft( X, ret_num, x, x_num );
 dft( Y, ret_num, y, y_num );
 for( var i = ret_num - 1; i >= 0; i-- ){
  X[i].mulAndAss( Y[i] );
 }
 idft( ret, ret_num, X, ret_num );
}
function mul( ret , a , b ){
 var k = 1;
 if( a[0] < 0 && b[0] >= 0 ){ k = -1; }
 if( b[0] < 0 && a[0] >= 0 ){ k = -1; }
 var la = mp._getLen( a );
 var lb = mp._getLen( b );
 if( la == 0 || lb == 0 ){
  ret[0] = 0;
  return;
 }
 var n = la + lb;
 var r = new Array();
 conv( r, n, a.slice( 1 ), la, b.slice( 1 ), lb );
 ret[n] = 0;
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
var a = new Array();
var b = new Array();
var t = new Array();
var p = new Array();
var start;
function pi_out5( prec, count, order ){
 var N = _DIV( _LOG( prec ), _LOG( 2 ) );
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
 for( var i = 0; i <= 6; i++ ){
  con.print( "<td>" );
  var a = new Array();
  mp.fset( a, mp.F( str ) );
  mp.fround( a, prec, i );
  var tmp = mp.fnum2str( a );
  if( tmp.charAt( 0 ) != '-' ){
   con.print( "&nbsp;" );
  }
  con.print( tmp + "</td>" );
 }
}
function main( id ){
 var i;
 con = new _Console( id );
 setMathEnv( new _MathEnv() );
 mp = new _MultiPrec();
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
   while( pi_out5( 1000, 1, 4 ) ){}
  } else {
   while( pi_out5( 1000, 1, order ) ){}
  }
  con.println( "" + ((new Date()).getTime() - time) + " ms" );
  var str = mp.fnum2str( pi );
  var tmp = str.split( "." );
  con.println( tmp[0] + "." );
  if( tmp[1] ){
   for( i = 0; i < tmp[1].length; i += 100 ){
    con.println( tmp[1].substring( i, i + 100 ) );
   }
  }
 }
 con.println();
 con.println( "fround" );
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
 con.print( "</tr>" );
 con.print( "<tr><td>&nbsp;5.5</td>" ); round( "5.5", 0 ); con.print( "</tr>" );
 con.print( "<tr><td>&nbsp;2.5</td>" ); round( "2.5", 0 ); con.print( "</tr>" );
 con.print( "<tr><td>&nbsp;1.6</td>" ); round( "1.6", 0 ); con.print( "</tr>" );
 con.print( "<tr><td>&nbsp;1.1</td>" ); round( "1.1", 0 ); con.print( "</tr>" );
 con.print( "<tr><td>&nbsp;1.0</td>" ); round( "1.0", 0 ); con.print( "</tr>" );
 con.print( "<tr><td>-1.0</td>" ); round( "-1.0", 0 ); con.print( "</tr>" );
 con.print( "<tr><td>-1.1</td>" ); round( "-1.1", 0 ); con.print( "</tr>" );
 con.print( "<tr><td>-1.6</td>" ); round( "-1.6", 0 ); con.print( "</tr>" );
 con.print( "<tr><td>-2.5</td>" ); round( "-2.5", 0 ); con.print( "</tr>" );
 con.print( "<tr><td>-5.5</td>" ); round( "-5.5", 0 ); con.print( "</tr>" );
 con.print( "</table>" );
 con.println();
 var a = new Array();
 mp.fsqrt( a, mp.F( "2" ), 45 );
 var b = new Array();
 var s;
 for( i = 0; i <= 45; i++ ){
  con.println( mp.fnum2str( a ).substring( 0, i + 3 ) );
  for( var mode = 0; mode <= 6; mode++ ){
   mp.fset( b, a );
   mp.fround( b, i, mode );
   s = mp.fnum2str( b );
   con.print( "fround&nbsp;&nbsp;" );
   switch( mode ){
   case _MP_FROUND_UP : con.print( "UP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" ); break;
   case _MP_FROUND_DOWN : con.print( "DOWN&nbsp;&nbsp;&nbsp;" ); break;
   case _MP_FROUND_CEILING : con.print( "CEILING" ); break;
   case _MP_FROUND_FLOOR : con.print( "FLOOR&nbsp;&nbsp;" ); break;
   case _MP_FROUND_HALF_UP : con.print( "H_UP&nbsp;&nbsp;&nbsp;" ); break;
   case _MP_FROUND_HALF_DOWN: con.print( "H_DOWN&nbsp;" ); break;
   case _MP_FROUND_HALF_EVEN: con.print( "H_EVEN&nbsp;" ); break;
   }
   con.println( "&nbsp;" + s );
  }
  mp.fset( b, a );
  mp.fround( b, i, _MP_FROUND_HALF_DOWN );
  con.println( "fround&nbsp;&nbsp;even:0&nbsp;&nbsp;" + mp.fnum2str( b ) );
  mp.fset( b, a );
  mp.fround2( b, i, false );
  con.println( "fround2&nbsp;even:0&nbsp;&nbsp;" + mp.fnum2str( b ) );
  mp.fset( b, a );
  mp.fround( b, i, _MP_FROUND_HALF_EVEN );
  con.println( "fround&nbsp;&nbsp;even:1&nbsp;&nbsp;" + mp.fnum2str( b ) );
  mp.fset( b, a );
  mp.fround2( b, i, true );
  con.println( "fround2&nbsp;even:1&nbsp;&nbsp;" + mp.fnum2str( b ) );
 }
}
