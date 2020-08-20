/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */
(function( window, undefined ){
var document = window.document;
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
assert( re != undefined );
		this._re = re;
	},
	setImag : function( im ){
assert( im != undefined );
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
assert( r != undefined );
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
assert( r != undefined );
		if( r instanceof _Complex ){
			return new _Complex( this._re + r._re, this._im + r._im );
		}
		return new _Complex( this._re + r, this._im );
	},
	addAndAss : function( r ){
assert( r != undefined );
		if( r instanceof _Complex ){
			this._re += r._re;
			this._im += r._im;
		} else {
			this._re += r;
		}
		return this;
	},
	sub : function( r ){
assert( r != undefined );
		if( r instanceof _Complex ){
			return new _Complex( this._re - r._re, this._im - r._im );
		}
		return new _Complex( this._re - r, this._im );
	},
	subAndAss : function( r ){
assert( r != undefined );
		if( r instanceof _Complex ){
			this._re -= r._re;
			this._im -= r._im;
		} else {
			this._re -= r;
		}
		return this;
	},
	mul : function( r ){
assert( r != undefined );
		if( r instanceof _Complex ){
			if( r._im == 0.0 ){
				return new _Complex( this._re * r._re, this._im * r._re );
			}
			return new _Complex( this._re * r._re - this._im * r._im, this._re * r._im + this._im * r._re );
		}
		return new _Complex( this._re * r, this._im * r );
	},
	mulAndAss : function( r ){
assert( r != undefined );
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
assert( r != undefined );
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
assert( r != undefined );
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
assert( r != undefined );
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
assert( r != undefined );
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
function assert( expr ){
	if( !expr ) throw new Error();
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
assert( (row != undefined) && (col != undefined) );
		return this._mat[((row >= this._row) || (col >= this._col)) ? this._len : row * this._col + col];
	},
	_val : function( row, col ){
assert( (row >= 0) && (row < this._row) && (col >= 0) && (col < this._col) );
		return this._mat[row * this._col + col];
	},
	toFloat : function( row, col ){
assert( (row != undefined) && (col != undefined) );
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
		_m = this._hour - _INT( this._hour );
		this._hour = _INT( this._hour );
		this._min += _m * 60.0;
		_s = this._min - _INT( this._min );
		this._min = _INT( this._min );
		this._sec += _s * 60.0;
		_f = this._sec - _INT( this._sec );
		this._sec = _INT( this._sec );
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
		var x = this.toFloat();
		var i = _INT( x );
		_int.set( i );
		return floatToValue( x - i );
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
function _Boolean( val ){
	this._val = (val == undefined) ? false : (val == true);
}
_Boolean.prototype = {
	set : function( val ){
		this._val = (val == true);
		return this;
	},
	val : function(){
		return this._val;
	}
};
function newBooleanArray( len ){
	var a = new Array( len );
	for( var i = 0; i < len; i++ ){
		a[i] = new _Boolean();
	}
	return a;
}
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
function _Void( obj ){
	this._obj = (obj == undefined) ? null : obj;
}
_Void.prototype = {
	set : function( obj ){
		this._obj = obj;
		return this;
	},
	obj : function(){
		return this._obj;
	}
};
function newVoidArray( len ){
	var a = new Array( len );
	for( var i = 0; i < len; i++ ){
		a[i] = new _Void();
	}
	return a;
}
function _Tm(){
	this._sec = 0;
	this._min = 0;
	this._hour = 0;
	this._mday = 1;
	this._mon = 0;
	this._year = 0;
	this._wday = 0;
	this._yday = 0;
}
function time(){
	return _DIV( (new Date()).getTime(), 1000 );
}
function mktime( tm ){
	var date = new Date();
	date.setFullYear( 1900 + tm._year );
	date.setMonth ( tm._mon );
	date.setDate ( tm._mday );
	date.setHours ( tm._hour );
	date.setMinutes ( tm._min );
	date.setSeconds ( tm._sec );
	return _DIV( date.getTime(), 1000 );
}
function localtime( t ){
	var date = new Date( t * 1000 );
	var startDate = new Date();
	startDate.setFullYear( date.getFullYear() );
	startDate.setMonth ( 0 );
	startDate.setDate ( 1 );
	startDate.setHours ( 0 );
	startDate.setMinutes ( 0 );
	startDate.setSeconds ( 0 );
	var tm = new _Tm();
	tm._sec = date.getSeconds ();
	tm._min = date.getMinutes ();
	tm._hour = date.getHours ();
	tm._mday = date.getDate ();
	tm._mon = date.getMonth ();
	tm._year = date.getFullYear() - 1900;
	tm._wday = date.getDay ();
	tm._yday = _DIV( date.getTime() - startDate.getTime(), 86400000 );
	return tm;
}
function __ArrayNode(){
	this._node = null;
	this._nodeNum = 0;
	this._vector = newValueArray( 1 );
	this._vectorNum = 0;
}
__ArrayNode.prototype = {
	dup : function( dst ){
		var i;
		if( this._nodeNum > 0 ){
			dst._node = _newArrayNodeArray( this._nodeNum );
			dst._nodeNum = this._nodeNum;
			for( i = 0; i < this._nodeNum; i++ ){
				this._node[i].dup( dst._node[i] );
			}
		} else {
			dst._node = null;
			dst._nodeNum = 0;
		}
		if( this._vectorNum > 0 ){
			for( i = this._vectorNum; i >= dst._vectorNum; i-- ){
				dst._vector[i] = new _Value();
			}
			dst._vectorNum = this._vectorNum;
			for( i = 0; i < this._vectorNum; i++ ){
				copyValue( dst._vector[i], this._vector[i] );
			}
		} else {
			dst._vector = newValueArray( 1 );
			dst._vectorNum = 0;
		}
	},
	makeToken : function( dst , flag ){
		var i;
		if( this._nodeNum > 0 ){
			dst.addCode( 16, null );
			for( i = 0; i < this._nodeNum; i++ ){
				this._node[i].makeToken( dst, true );
			}
			dst.addCode( 17, null );
		}
		if( this._vectorNum > 0 ){
			dst.addCode( 16, null );
			for( i = 0; i < this._vectorNum; i++ ){
				dst.addValue( this._vector[i] );
			}
			dst.addCode( 17, null );
		}
		if( flag && (this._nodeNum == 0) && (this._vectorNum == 0) ){
			dst.addCode( 16, null );
			dst.addCode( 17, null );
		}
	},
	_newVector : function( index ){
		if( this._vectorNum == 0 ){
			this._vector = newValueArray( index + 2 );
		} else {
			for( var i = index + 1; i >= this._vectorNum; i-- ){
				this._vector[i] = new _Value();
			}
		}
		this._vectorNum = index + 1;
	},
	_resizeVector : function( index ){
		copyValue( this._vector[index + 1], this._vector[this._vectorNum] );
		this._vectorNum = index + 1;
	},
	_newNode : function( index ){
		if( this._nodeNum == 0 ){
			this._nodeNum = index + 1;
			this._node = _newArrayNodeArray( this._nodeNum );
		} else {
			var tmp = _newArrayNodeArray( index + 1 );
			for( var i = 0; i < this._nodeNum; i++ ){
				this._node[i].dup( tmp[i] );
			}
			this._node = tmp;
			this._nodeNum = index + 1;
		}
	},
	_resizeNode : function( index ){
		this._nodeNum = index + 1;
	},
	_copyArray : function( src, i ){
		var dst = new Array( src.length - i );
		for( var j = 0; j < dst.length; j++ ){
			dst[j] = src[i + j];
		}
		return dst;
	},
	set : function( index, value ){
		if( index instanceof Array ){
			if( index[1] < 0 ){
				this.set( index[0], value );
			} else if( (index[0] >= 0) && (index[0] != 0xFFFFFFFF) ){
				if( index[0] >= this._nodeNum ){
					this._newNode( index[0] );
				}
				this._node[index[0]].set( this._copyArray( index, 1 ), value );
			}
		} else if( (index >= 0) && (index != 0xFFFFFFFF) ){
			if( index >= this._vectorNum ){
				this._newVector( index );
			}
			this._vector[index].ass( value );
		}
	},
	resize : function( index, value ){
		if( index instanceof Array ){
			if( index[1] < 0 ){
				this.resize( index[0], value );
			} else if( (index[0] >= 0) && (index[0] != 0xFFFFFFFF) ){
				if( index[0] >= this._nodeNum ){
					this._newNode( index[0] );
				} else {
					this._resizeNode( index[0] );
				}
				this._node[index[0]].set( this._copyArray( index, 1 ), value );
			}
		} else if( (index >= 0) && (index != 0xFFFFFFFF) ){
			if( index >= this._vectorNum ){
				this._newVector( index );
			} else {
				this._resizeVector( index );
			}
			this._vector[index].ass( value );
		}
	},
	setVector : function( value, num ){
		if( num > this._vectorNum ){
			this._newVector( num - 1 );
		} else {
			this._resizeVector( num - 1 );
		}
		for( var i = 0; i < num; i++ ){
			this._vector[i].ass( value[i] );
		}
	},
	setVector2 : function( real, imag, num ){
		if( num > this._vectorNum ){
			this._newVector( num - 1 );
		} else {
			this._resizeVector( num - 1 );
		}
		for( var i = 0; i < num; i++ ){
			this._vector[i].setReal( real[i] );
			this._vector[i].setImag( imag[i] );
		}
	},
	val : function( index ){
		if( index instanceof Array ){
			if( index[1] < 0 ){
				return this.val( index[0] );
			}
			if( index[0] < this._nodeNum ){
				return this._node[index[0]].val( this._copyArray( index, 1 ) );
			}
			return this._vector[this._vectorNum];
		}
		return this._vector[(index < this._vectorNum) ? index : this._vectorNum ];
	}
};
function _newArrayNodeArray( len ){
	var a = new Array( len );
	for( var i = 0; i < len; i++ ){
		a[i] = new __ArrayNode();
	}
	return a;
}
function _Array(){
	this._label = new _Label( this );
	this._node = _newArrayNodeArray( 256 );
	this._mat = newMatrixArray ( 256 );
}
_Array.prototype = {
	define : function( label ){
		var index;
		if( (index = this._label.define( label )) >= 0 ){
			this._node[index] = new __ArrayNode();
			this._mat [index] = new _Matrix();
		}
		return index;
	},
	_moveData : function( index ){
		var newIndex;
		if( (newIndex = this._label.define( this._label._label[index] )) >= 0 ){
			this.dup( this, index, newIndex, false );
		}
	},
	move : function( index ){
		if( this._label._flag[index] == 2 ){
			this._moveData( index );
			this._label.setLabel( index, null, false );
		}
		this._label._flag[index] = 1;
	},
	set : function( index, subIndex, dim, value, moveFlag ){
		if( moveFlag ){
			this.move( index );
		}
		if( dim == 1 ){
			this._node[index].set( subIndex[0], value );
		} else if( dim == 2 ){
			if(
				(subIndex[0] < 0) || (subIndex[0] == 0xFFFFFFFF) ||
				(subIndex[1] < 0) || (subIndex[1] == 0xFFFFFFFF)
			){
				return;
			}
			this._mat[index].set( subIndex[0], subIndex[1], value );
		} else {
			this._node[index].set( subIndex, value );
		}
	},
	setVector : function( index, value, num, moveFlag ){
		if( moveFlag ){
			this.move( index );
		}
		this._node[index].setVector( value, num );
	},
	setVector2 : function( index, real, imag, num, moveFlag ){
		if( moveFlag ){
			this.move( index );
		}
		this._node[index].setVector2( real, imag, num );
	},
	setMatrix : function( index, src, moveFlag ){
		if( moveFlag ){
			this.move( index );
		}
		this._mat[index].ass( src );
	},
	setMatrix2 : function( index, real, imag, moveFlag ){
		if( real._len == imag._len ){
			var src = dupMatrix( real );
			for( var i = 0; i < real._len; i++ ){
				src._mat[i].setImag( imag._mat[i].real() );
			}
			if( moveFlag ){
				this.move( index );
			}
			this._mat[index].ass( src );
		}
	},
	resize : function( index, resIndex, subIndex, dim, value, moveFlag ){
		if( moveFlag ){
			this.move( index );
		}
		if( dim == 1 ){
			this._node[index].resize( subIndex[0], value );
		} else if( dim == 2 ){
			this._mat[index].resize( resIndex[0] + 1, resIndex[1] + 1 );
			this._mat[index].set( subIndex[0], subIndex[1], value );
		} else {
			this._node[index].resize( subIndex, value );
		}
	},
	resizeVector : function( index, subIndex, value, moveFlag ){
		if( moveFlag ){
			this.move( index );
		}
		this._node[index].resize( subIndex, value );
	},
	val : function( index, subIndex, dim ){
		if( dim != undefined ){
			if( dim == 1 ){
				return this._node[index].val( subIndex[0] );
			} else if( dim == 2 ){
				return this._mat[index].val(
					((subIndex[0] < 0) || (subIndex[0] == 0xFFFFFFFF)) ? this._mat[index]._row : subIndex[0],
					((subIndex[1] < 0) || (subIndex[1] == 0xFFFFFFFF)) ? this._mat[index]._col : subIndex[1]
					);
			}
		}
		return this._node[index].val( subIndex );
	},
	dup : function( dst , srcIndex, dstIndex, moveFlag ){
		if( moveFlag ){
			dst.move( dstIndex );
		}
		this._node[srcIndex].dup( dst._node[dstIndex] );
		dst._mat[dstIndex].ass( this._mat[srcIndex] );
	},
	makeToken : function( dst , srcIndex ){
		var row, col;
		dst.delAll();
		if( (this._mat[srcIndex]._len > 1) || this._mat[srcIndex]._mat[0].notEqual( 0.0 ) ){
			dst.addCode( 16, null );
			for( row = 0; row < this._mat[srcIndex]._row; row++ ){
				dst.addCode( 16, null );
				for( col = 0; col < this._mat[srcIndex]._col; col++ ){
					dst.addValue( this._mat[srcIndex].val( row, col ) );
				}
				dst.addCode( 17, null );
			}
			dst.addCode( 17, null );
			this._node[srcIndex].makeToken( dst, false );
		} else {
			this._node[srcIndex].makeToken( dst, true );
		}
		return dst;
	}
};
function _FuncInfo(){
	this._name = new String();
	this._cnt = 0;
}
function __Func( createFlag ){
	this._createFlag = createFlag;
	this._info = null;
	this._label = null;
	this._line = null;
	this._topNum = 1;
	this._before = null;
	this._next = null;
}
function _Func(){
	this._top = null;
	this._end = null;
	this._num = 0;
	this._max = -1;
}
_Func.prototype = {
	setMaxNum : function( max ){
		if( max >= 0 ){
			for( var i = this._num - max; i > 0; i-- ){
				this._del();
			}
		}
		this._max = max;
	},
	getInfo : function( num, info ){
		var tmp = 0;
		var cur = this._top;
		while( true ){
			if( cur == null ){
				return false;
			}
			if( tmp == num ){
				break;
			}
			tmp++;
			cur = cur._next;
		}
		info._name = cur._info._name;
		info._cnt = cur._info._cnt;
		return true;
	},
	canDel : function(){
		return (this._top != null);
	},
	_add : function( createFlag ){
		var tmp = new __Func( createFlag );
		if( this._top == null ){
			this._top = tmp;
			this._end = tmp;
		} else {
			tmp._before = this._end;
			this._end._next = tmp;
			this._end = tmp;
		}
		return tmp;
	},
	_ins : function( createFlag ){
		var tmp = new __Func( createFlag );
		if( this._top == null ){
			this._top = tmp;
			this._end = tmp;
		} else {
			tmp._next = this._top;
			this._top._before = tmp;
			this._top = tmp;
		}
		return tmp;
	},
	create : function( name, topNum ){
		if( this._max == 0 ){
			return null;
		}
		if( this._num == this._max ){
			this._del();
		}
		var tmp = this._ins( true );
		tmp._info = new _FuncInfo();
		tmp._info._name = name;
		tmp._info._cnt = 0;
		tmp._label = new _Token();
		tmp._line = new _Line();
		tmp._topNum = (topNum == undefined) ? 1 : topNum;
		this._num++;
		return tmp;
	},
	open : function( srcFunc ){
		if( this._max == 0 ){
			return null;
		}
		if( this._num == this._max ){
			this._del();
		}
		var tmp = this._ins( false );
		tmp._info = srcFunc._info;
		tmp._label = srcFunc._label;
		tmp._line = srcFunc._line;
		tmp._topNum = srcFunc._topNum;
		this._num++;
		return tmp;
	},
	openAll : function( src ){
		var srcFunc;
		var dstFunc;
		this.delAll();
		srcFunc = src._top;
		while( srcFunc != null ){
			dstFunc = this._add( false );
			dstFunc._info = srcFunc._info;
			dstFunc._label = srcFunc._label;
			dstFunc._line = srcFunc._line;
			dstFunc._topNum = srcFunc._topNum;
			srcFunc = srcFunc._next;
		}
		this._num = src._num;
		this._max = src._max;
	},
	del : function( func ){
		if( func._before != null ){
			func._before._next = func._next;
		} else {
			this._top = func._next;
		}
		if( func._next != null ){
			func._next._before = func._before;
		} else {
			this._end = func._before;
		}
		this._num--;
	},
	_del : function(){
		if( this._top == null ){
			return;
		}
		var tmp = this._top;
		var cur = this._top._next;
		while( cur != null ){
			if( cur._info._cnt <= tmp._info._cnt ){
				tmp = cur;
			}
			cur = cur.next;
		}
		this.del( tmp );
	},
	delAll : function(){
		this._top = null;
		this._num = 0;
	},
	search : function( name, updateCnt, nameSpace ){
		if( name.startsWith( ":" ) ){
			name = name.slice( 1 );
		} else if( (nameSpace != null) && (name.indexOf( ":" ) < 0) ){
			name = nameSpace + ":" + name;
		}
		var cur = this._top;
		while( cur != null ){
			if( name == cur._info._name ){
				if( updateCnt ){
					cur._info._cnt++;
				}
				return cur;
			}
			cur = cur._next;
		}
		return null;
	}
};
function isCharSpace( str, index ){
	return ((str.charAt( index ) == ' ') || (str.charCodeAt( index ) == 0xA0));
}
function isCharEnter( str, index ){
	var chr = str.charAt( index );
	return ((chr == '\r') || (chr == '\n'));
}
function isCharEscape( str, index ){
	var chr = str.charAt( index );
	return ((chr == '\\') || (chr == '¥'));
}
function _GraphAns(){
	this._x = 0.0;
	this._y1 = 0.0;
	this._y2 = 0.0;
}
_GraphAns.prototype = {
	set : function( src ){
		this._x = src._x;
		this._y1 = src._y1;
		this._y2 = src._y2;
	}
};
function newGraphAnsArray( len ){
	var a = new Array( len );
	for( var i = 0; i < len; i++ ){
		a[i] = new _GraphAns();
	}
	return a;
}
function __GraphInfo(){
	this._draw = true;
	this._color = 0;
	this._mode = 0;
	this._expr1 = new String();
	this._expr2 = new String();
	this._index = 0;
	this._start = 0.0;
	this._end = 0.0;
	this._step = 0.0;
	this._ans = new Array();
	this._ansNum = new _Integer();
	this._baseX = 0.0;
	this._baseY = 0.0;
	this._logBaseX = 0.0;
	this._logBaseY = 0.0;
	this._isLogScaleX = false;
	this._isLogScaleY = false;
}
function __TextInfo(){
	this._width = 0;
	this._ascent = 0;
	this._descent = 0;
}
function _Graph(){
	this._gWorld = new _GWorld();
	this._info = new Array();
	this._infoNum = 0;
	this._curIndex = 0;
	this.addGraph();
}
_Graph.prototype = {
	addGraph : function(){
		this._curIndex = this._infoNum;
		this._infoNum++;
		this._info[this._curIndex] = new __GraphInfo();
		this._info[this._curIndex]._draw = true;
		this._info[this._curIndex]._mode = 0;
		this._info[this._curIndex]._expr1 = "";
		this._info[this._curIndex]._expr2 = "";
		this._info[this._curIndex]._ans = new Array();
		this._info[this._curIndex]._ansNum.set( 0 );
		this.setLogScaleX( 10.0 );
		this.setLogScaleY( 10.0 );
		this._info[this._curIndex]._isLogScaleX = false;
		this._info[this._curIndex]._isLogScaleY = false;
		return true;
	},
	delGraph : function(){
		this._info[this._curIndex]._expr1 = "";
		this._info[this._curIndex]._expr2 = "";
		this._info[this._curIndex]._ans = new Array();
		this._info[this._curIndex]._ansNum.set( 0 );
		for( var i = this._curIndex + 1; i < this._infoNum; i++ ){
			this._info[i - 1] = this._info[i];
		}
		this._infoNum--;
		if( this._curIndex == this._infoNum ){
			this.selGraph( this._infoNum - 1 );
		}
		if( this._infoNum == 0 ){
			this.addGraph();
		}
	},
	selGraph : function( index ){
		if( (index < 0) || (index >= this._infoNum) ){
			return false;
		}
		this._curIndex = index;
		return true;
	},
	setDrawFlag : function( draw ){
		this._info[this._curIndex]._draw = draw;
	},
	drawFlag : function(){
		return this._info[this._curIndex]._draw;
	},
	setColor : function( color ){
		this._info[this._curIndex]._color = color;
	},
	color : function(){
		return this._info[this._curIndex]._color;
	},
	setMode : function( mode ){
		this._info[this._curIndex]._mode = mode;
	},
	mode : function(){
		return this._info[this._curIndex]._mode;
	},
	setExpr : function( expr ){
		this._info[this._curIndex]._expr1 = expr;
		this._info[this._curIndex]._expr2 = "";
	},
	setExpr1 : function( expr1 ){
		this._info[this._curIndex]._expr1 = expr1;
	},
	setExpr2 : function( expr2 ){
		this._info[this._curIndex]._expr2 = expr2;
	},
	expr : function(){
		return this._info[this._curIndex]._expr1;
	},
	expr1 : function(){
		return this._info[this._curIndex]._expr1;
	},
	expr2 : function(){
		return this._info[this._curIndex]._expr2;
	},
	setIndex : function( index ){
		this._info[this._curIndex]._index = index;
	},
	index : function(){
		return this._info[this._curIndex]._index;
	},
	setStart : function( start ){
		this._info[this._curIndex]._start = start;
	},
	setEnd : function( end ){
		this._info[this._curIndex]._end = end;
	},
	setStep : function( step ){
		this._info[this._curIndex]._step = step;
	},
	start : function(){
		return this._info[this._curIndex]._start;
	},
	end : function(){
		return this._info[this._curIndex]._end;
	},
	step : function(){
		return this._info[this._curIndex]._step;
	},
	setLogScaleX : function( base ){
		if( base <= 1.0 ){
			this._info[this._curIndex]._isLogScaleX = false;
		} else {
			this._info[this._curIndex]._isLogScaleX = true;
			this._info[this._curIndex]._baseX = base;
			this._info[this._curIndex]._logBaseX = 1.0 / _LOG( base );
		}
	},
	setLogScaleY : function( base ){
		if( base <= 1.0 ){
			this._info[this._curIndex]._isLogScaleY = false;
		} else {
			this._info[this._curIndex]._isLogScaleY = true;
			this._info[this._curIndex]._baseY = base;
			this._info[this._curIndex]._logBaseY = 1.0 / _LOG( base );
		}
	},
	isLogScaleX : function(){
		return this._info[this._curIndex]._isLogScaleX;
	},
	isLogScaleY : function(){
		return this._info[this._curIndex]._isLogScaleY;
	},
	logBaseX : function(){
		return this._info[this._curIndex]._baseX;
	},
	logBaseY : function(){
		return this._info[this._curIndex]._baseY;
	},
	logX : function( x ){
		return this._info[this._curIndex]._isLogScaleX ? _LOG( x ) * this._info[this._curIndex]._logBaseX : x;
	},
	logY : function( y ){
		return this._info[this._curIndex]._isLogScaleY ? _LOG( y ) * this._info[this._curIndex]._logBaseY : y;
	},
	expX : function( x ){
		return this._info[this._curIndex]._isLogScaleX ? _EXP( x / this._info[this._curIndex]._logBaseX ) : x;
	},
	expY : function( y ){
		return this._info[this._curIndex]._isLogScaleY ? _EXP( y / this._info[this._curIndex]._logBaseY ) : y;
	},
	delAns : function(){
		this._info[this._curIndex]._ans = new Array();
		this._info[this._curIndex]._ansNum.set( 0 );
	},
	create : function( width, height ){
		this._gWorld.scroll(
			(width - this._gWorld._width ) / 2.0,
			(height - this._gWorld._height) / 2.0
			);
		return this._gWorld.create( width, height, false );
	},
	open : function( image , offset, width, height ){
		this._gWorld.scroll(
			(width - this._gWorld._width ) / 2.0,
			(height - this._gWorld._height) / 2.0
			);
		return this._gWorld.open( image, offset, width, height, false );
	},
	_drawHLine : function( y ){
		var yy = this._gWorld.imgPosY( y );
		gWorldLine( this._gWorld, 0, yy, this._gWorld._width - 1, yy );
		this._gWorld._gWorldLine = true;
		for( var i = 0; i < this._gWorld._width; i++ ){
			this._gWorld.put( i, yy );
		}
		this._gWorld._gWorldLine = false;
	},
	_drawVLine : function( x ){
		var xx = this._gWorld.imgPosX( x );
		gWorldLine( this._gWorld, xx, 0, xx, this._gWorld._height - 1 );
		this._gWorld._gWorldLine = true;
		for( var i = 0; i < this._gWorld._height; i++ ){
			this._gWorld.put( xx, i );
		}
		this._gWorld._gWorldLine = false;
	},
	_drawXText : function( x, y ){
		var yy;
		var text = floatToString( x, 15 );
		var tmp = new __TextInfo();
		this._gWorld.getTextInfo( text, tmp );
		var width = tmp._width;
		var ascent = tmp._ascent;
		var descent = tmp._descent;
		if( this._gWorld.imgPosY( y ) < 0 ){
			yy = ascent + 1;
		} else if( (this._gWorld.imgPosY( y ) + (ascent + descent + 1)) >= this._gWorld._height ){
			yy = this._gWorld._height - descent;
		} else {
			yy = this._gWorld.imgPosY( y ) + ascent + 2;
		}
		this._gWorld.drawText(
			text,
			this._gWorld.imgPosX( x ) + 2,
			yy,
			false
			);
	},
	_drawYText : function( x, y ){
		var xx;
		var text = floatToString( y, 15 );
		var tmp = new __TextInfo();
		this._gWorld.getTextInfo( text, tmp );
		var width = tmp._width;
		var ascent = tmp._ascent;
		var descent = tmp._descent;
		if( (this._gWorld.imgPosX( x ) - (width + 1)) < 0 ){
			xx = 1;
		} else if( this._gWorld.imgPosX( x ) >= this._gWorld._width ){
			xx = this._gWorld._width - width;
		} else {
			xx = this._gWorld.imgPosX( x ) - width;
		}
		this._gWorld.drawText(
			text,
			xx,
			this._gWorld.imgPosY( y ) - descent,
			false
			);
	},
	clear : function( backColor, scaleColor, unitColor, unitX, unitY, textColor, textX, textY ){
		var i;
		var tmp;
		var pos, end;
		if( unitX > 0.0 ){
			while( true ){
				tmp = this._gWorld.imgSizX( unitX );
				if( (tmp < 0) || (tmp >= 2) ){
					break;
				}
				unitX *= 10.0;
			}
		}
		if( unitY > 0.0 ){
			while( true ){
				tmp = this._gWorld.imgSizY( unitY );
				if( (tmp < 0) || (tmp >= 2) ){
					break;
				}
				unitY *= 10.0;
			}
		}
		this._gWorld.clear( backColor );
		var saveColor = this._gWorld._color;
		this._gWorld.setColor( unitColor );
		if( unitX > 0.0 ){
			pos = this._gWorld.wndPosX( 0 );
			end = this._gWorld.wndPosX( this._gWorld._width - 1 );
			i = _DIV( pos, unitX );
			if( (this._gWorld.wndPosX( 1 ) - pos) > 0.0 ){
				while( (pos = i * unitX) <= end ){
					this._drawVLine( pos );
					i++;
				}
			} else {
				while( (pos = i * unitX) >= end ){
					this._drawVLine( pos );
					i--;
				}
			}
		}
		if( unitY > 0.0 ){
			pos = this._gWorld.wndPosY( 0 );
			end = this._gWorld.wndPosY( this._gWorld._height - 1 );
			i = _DIV( pos, unitY );
			if( (this._gWorld.wndPosY( 1 ) - pos) > 0.0 ){
				while( (pos = i * unitY) <= end ){
					this._drawHLine( pos );
					i++;
				}
			} else {
				while( (pos = i * unitY) >= end ){
					this._drawHLine( pos );
					i--;
				}
			}
		}
		this._gWorld.setColor( scaleColor );
		this._drawHLine( 0.0 );
		this._drawVLine( 0.0 );
		this._gWorld.setColor( textColor );
		unitX *= textX;
		if( unitX > 0.0 ){
			pos = this._gWorld.wndPosX( 0 );
			end = this._gWorld.wndPosX( this._gWorld._width - 1 );
			i = _DIV( pos, unitX );
			if( (this._gWorld.wndPosX( 1 ) - pos) > 0.0 ){
				while( (pos = i * unitX) <= end ){
					this._drawXText( pos, 0.0 );
					i++;
				}
			} else {
				while( (pos = i * unitX) >= end ){
					this._drawXText( pos, 0.0 );
					i--;
				}
			}
		}
		unitY *= textY;
		if( unitY > 0.0 ){
			pos = this._gWorld.wndPosY( 0 );
			end = this._gWorld.wndPosY( this._gWorld._height - 1 );
			i = _DIV( pos, unitY );
			if( (this._gWorld.wndPosY( 1 ) - pos) > 0.0 ){
				while( (pos = i * unitY) <= end ){
					this._drawYText( 0.0, pos );
					i++;
				}
			} else {
				while( (pos = i * unitY) >= end ){
					this._drawYText( 0.0, pos );
					i--;
				}
			}
		}
		this._gWorld.setColor( saveColor );
	},
	_process : function( proc, param, expr, x, y ){
		var ret = false;
		param._var.set( this._info[this._curIndex]._index, x, false );
		var saveAnsFlag = proc._printAns;
		proc._printAns = false;
		if( proc.processLoop( expr, param ) == 0x04 ){
			if( param.val( 0 ).imag() == 0.0 ){
				y.set( param.val( 0 ).toFloat() );
			} else {
				y.set( NaN );
			}
			ret = true;
		}
		proc._printAns = saveAnsFlag;
		return ret;
	},
	_drawLine : function( x1, y1, x2, y2 ){
		var xx1 = new _Integer( x1 );
		var yy1 = new _Integer( y1 );
		var xx2 = new _Integer( x2 );
		var yy2 = new _Integer( y2 );
		if( this._gWorld.clipLine( xx1, yy1, xx2, yy2 ) == 1 ){
			this._gWorld.drawLine( xx1._val, yy1._val, xx2._val, yy2._val );
			return true;
		}
		return false;
	},
	_plot : function( proc, param, start, end, ans , ansNum , startAns, startIndex ){
		var i;
		var drawFlag = false;
		var posX, posY;
		var oldX, oldY;
		var yy = new _Float();
		if( start > end ){
			var tmp = start; start = end; end = tmp;
		}
		ansNum.set( end - start + 1 );
		if( ansNum._val <= 0 ){
			ansNum.set( 0 );
		} else {
			var saveFlag = param._fileFlag;
			param._fileFlag = false;
			for( i = 0; i < ansNum._val; i++ ){
				ans[i] = new _GraphAns();
			}
			this._gWorld.setColor( this._info[this._curIndex]._color );
			if( startIndex > 0 ){
				drawFlag = true;
				posX = this._gWorld.imgPosX( this.logX( startAns[startIndex]._x ) );
				posY = this._gWorld.imgPosY( this.logY( startAns[startIndex]._y1 ) );
			}
			for( i = 0; i < ansNum._val; i++ ){
				ans[i]._x = this.expX( this._gWorld.wndPosX( start + i ) );
				if( this._process( proc, param, this._info[this._curIndex]._expr1, ans[i]._x, yy ) ){
					ans[i]._y1 = yy._val;
					var tmp = this.logY( ans[i]._y1 );
					if( _ISINF( tmp ) || _ISNAN( tmp ) ){
						drawFlag = false;
					} else {
						if( drawFlag ){
							oldX = posX;
							oldY = posY;
							posX = this._gWorld.imgPosX( this.logX( ans[i]._x ) );
							posY = this._gWorld.imgPosY( this.logY( ans[i]._y1 ) );
							this._drawLine( oldX, oldY, posX, posY );
						} else {
							drawFlag = true;
							posX = this._gWorld.imgPosX( this.logX( ans[i]._x ) );
							posY = this._gWorld.imgPosY( this.logY( ans[i]._y1 ) );
						}
					}
				} else {
					ansNum.set( i );
					break;
				}
			}
			if( startIndex == 0 ){
				if( drawFlag ){
					oldX = posX;
					oldY = posY;
					posX = this._gWorld.imgPosX( this.logX( startAns[startIndex]._x ) );
					posY = this._gWorld.imgPosY( this.logY( startAns[startIndex]._y1 ) );
					this._drawLine( oldX, oldY, posX, posY );
				}
			}
			param._fileFlag = saveFlag;
		}
	},
	_plotStep : function( proc, param, start, end, step, ans , ansNum , startAns, startIndex ){
		var i;
		var drawFlag = false;
		var posX, posY;
		var oldX, oldY;
		var yy = new _Float();
		if( start > end ){
			var tmp = start; start = end; end = tmp;
		}
		if( step < 0.0 ){
			step = -step;
		}
		if( step == 0.0 ){
			ansNum.set( 0 );
		} else {
			ansNum.set( _INT( (end - start) / step ) + 1 );
		}
		if( ansNum._val <= 0 ){
			ansNum.set( 0 );
		} else {
			var saveFlag = param._fileFlag;
			param._fileFlag = false;
			for( i = 0; i < ansNum._val; i++ ){
				ans[i] = new _GraphAns();
			}
			this._gWorld.setColor( this._info[this._curIndex]._color );
			switch( this._info[this._curIndex]._mode ){
			case 1:
				if( startIndex > 0 ){
					drawFlag = true;
					posX = this._gWorld.imgPosX( startAns[startIndex]._y1 );
					posY = this._gWorld.imgPosY( startAns[startIndex]._y2 );
				}
				for( i = 0; i < ansNum._val; i++ ){
					ans[i]._x = start + step * i;
					if( this._process( proc, param, this._info[this._curIndex]._expr1, ans[i]._x, yy ) ){
						ans[i]._y1 = yy._val;
						if( this._process( proc, param, this._info[this._curIndex]._expr2, ans[i]._x, yy ) ){
							ans[i]._y2 = yy._val;
							if( drawFlag ){
								oldX = posX;
								oldY = posY;
								posX = this._gWorld.imgPosX( ans[i]._y1 );
								posY = this._gWorld.imgPosY( ans[i]._y2 );
								this._drawLine( oldX, oldY, posX, posY );
							} else {
								drawFlag = true;
								posX = this._gWorld.imgPosX( ans[i]._y1 );
								posY = this._gWorld.imgPosY( ans[i]._y2 );
							}
						} else {
							ansNum.set( i );
							break;
						}
					} else {
						ansNum.set( i );
						break;
					}
				}
				if( startIndex == 0 ){
					if( drawFlag ){
						oldX = posX;
						oldY = posY;
						posX = this._gWorld.imgPosX( startAns[startIndex]._y1 );
						posY = this._gWorld.imgPosY( startAns[startIndex]._y2 );
						this._drawLine( oldX, oldY, posX, posY );
					}
				}
				break;
			case 2:
				if( startIndex > 0 ){
					drawFlag = true;
					posX = this._gWorld.imgPosX( startAns[startIndex]._y1 * fcos( startAns[startIndex]._x ) );
					posY = this._gWorld.imgPosY( startAns[startIndex]._y1 * fsin( startAns[startIndex]._x ) );
				}
				for( i = 0; i < ansNum._val; i++ ){
					ans[i]._x = start + step * i;
					if( this._process( proc, param, this._info[this._curIndex]._expr1, ans[i]._x, yy ) ){
						ans[i]._y1 = yy._val;
						var tmp = ans[i]._y1;
						if( _ISINF( tmp ) || _ISNAN( tmp ) ){
							drawFlag = false;
						} else {
							if( drawFlag ){
								oldX = posX;
								oldY = posY;
								posX = this._gWorld.imgPosX( ans[i]._y1 * fcos( ans[i]._x ) );
								posY = this._gWorld.imgPosY( ans[i]._y1 * fsin( ans[i]._x ) );
								this._drawLine( oldX, oldY, posX, posY );
							} else {
								drawFlag = true;
								posX = this._gWorld.imgPosX( ans[i]._y1 * fcos( ans[i]._x ) );
								posY = this._gWorld.imgPosY( ans[i]._y1 * fsin( ans[i]._x ) );
							}
						}
					} else {
						ansNum.set( i );
						break;
					}
				}
				if( startIndex == 0 ){
					if( drawFlag ){
						oldX = posX;
						oldY = posY;
						posX = this._gWorld.imgPosX( startAns[startIndex]._y1 * fcos( startAns[startIndex]._x ) );
						posY = this._gWorld.imgPosY( startAns[startIndex]._y1 * fsin( startAns[startIndex]._x ) );
						this._drawLine( oldX, oldY, posX, posY );
					}
				}
				break;
			}
			param._fileFlag = saveFlag;
		}
	},
	plot : function( proc, param ){
		this.delAns();
		switch( this._info[this._curIndex]._mode ){
		case 0:
			this._plot(
				proc, param,
				this._gWorld.imgPosX( this._info[this._curIndex]._start ),
				this._gWorld.imgPosX( this._info[this._curIndex]._end ),
				this._info[this._curIndex]._ans, this._info[this._curIndex]._ansNum,
				null, -1
				);
			break;
		case 1:
		case 2:
			this._plotStep(
				proc, param,
				this._info[this._curIndex]._start,
				this._info[this._curIndex]._end,
				this._info[this._curIndex]._step,
				this._info[this._curIndex]._ans, this._info[this._curIndex]._ansNum,
				null, -1
				);
			break;
		}
		return (this._info[this._curIndex]._ansNum._val != 0);
	},
	_plotPos : function( proc, param, pos ){
		var i;
		var start, end, step;
		var beforeFlag;
		var tmpAns = new Array();
		var tmpAnsNum = new _Integer();
		if( this._info[this._curIndex]._ansNum._val <= 0 ){
			return false;
		}
		switch( this._info[this._curIndex]._mode ){
		case 0:
			if( this._info[this._curIndex]._ans[0]._x < this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum._val - 1]._x ){
				if( pos < this.logX( this._info[this._curIndex]._ans[0]._x ) ){
					start = this._gWorld.imgPosX( pos );
					end = this._gWorld.imgPosX( this.logX( this._info[this._curIndex]._ans[0]._x ) ) - 1;
					beforeFlag = true;
				} else if( pos > this.logX( this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum._val - 1]._x ) ){
					start = this._gWorld.imgPosX( this.logX( this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum._val - 1]._x ) ) + 1;
					end = this._gWorld.imgPosX( pos );
					beforeFlag = false;
				} else {
					return false;
				}
			} else {
				if( pos > this.logX( this._info[this._curIndex]._ans[0]._x ) ){
					start = this._gWorld.imgPosX( pos );
					end = this._gWorld.imgPosX( this.logX( this._info[this._curIndex]._ans[0]._x ) ) - 1;
					beforeFlag = true;
				} else if( pos < this.logX( this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum._val - 1]._x ) ){
					start = this._gWorld.imgPosX( this.logX( this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum._val - 1]._x ) ) + 1;
					end = this._gWorld.imgPosX( pos );
					beforeFlag = false;
				} else {
					return false;
				}
			}
			this._plot(
				proc, param,
				start, end,
				tmpAns, tmpAnsNum,
				this._info[this._curIndex]._ans, beforeFlag ? 0 : this._info[this._curIndex]._ansNum._val - 1
				);
			break;
		case 1:
		case 2:
			step = this._info[this._curIndex]._step;
			if( step < 0.0 ){
				step = -step;
			}
			if( this._info[this._curIndex]._ans[0]._x < this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum._val - 1]._x ){
				if( pos < this._info[this._curIndex]._ans[0]._x ){
					start = pos;
					end = this._info[this._curIndex]._ans[0]._x - step;
					beforeFlag = true;
				} else if( pos > this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum._val - 1]._x ){
					start = this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum._val - 1]._x + step;
					end = pos;
					beforeFlag = false;
				} else {
					return false;
				}
			} else {
				if( pos > this._info[this._curIndex]._ans[0]._x ){
					start = pos;
					end = this._info[this._curIndex]._ans[0]._x - step;
					beforeFlag = true;
				} else if( pos < this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum._val - 1]._x ){
					start = this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum._val - 1]._x + step;
					end = pos;
					beforeFlag = false;
				} else {
					return false;
				}
			}
			this._plotStep(
				proc, param,
				start, end, step,
				tmpAns, tmpAnsNum,
				this._info[this._curIndex]._ans, beforeFlag ? 0 : this._info[this._curIndex]._ansNum._val - 1
				);
			break;
		}
		if( tmpAnsNum._val == 0 ){
			return false;
		}
		var newAnsNum = this._info[this._curIndex]._ansNum._val + tmpAnsNum._val;
		var newAns = newGraphAnsArray( newAnsNum );
		if( beforeFlag ){
			for( i = 0; i < tmpAnsNum._val; i++ ){
				newAns[i].set( tmpAns[i] );
			}
			for( ; i < newAnsNum; i++ ){
				newAns[i].set( this._info[this._curIndex]._ans[i - tmpAnsNum._val] );
			}
		} else {
			for( i = 0; i < this._info[this._curIndex]._ansNum._val; i++ ){
				newAns[i].set( this._info[this._curIndex]._ans[i] );
			}
			for( ; i < newAnsNum; i++ ){
				newAns[i].set( tmpAns[i - this._info[this._curIndex]._ansNum._val] );
			}
		}
		this._info[this._curIndex]._ans = newAns;
		this._info[this._curIndex]._ansNum.set( newAnsNum );
		return true;
	},
	_rePlot : function(){
		var i;
		var drawFlag = false;
		var posX, posY;
		var oldX, oldY;
		this._gWorld.setColor( this._info[this._curIndex]._color );
		if( this._info[this._curIndex]._ansNum._val > 0 ){
			switch( this._info[this._curIndex]._mode ){
			case 0:
				for( i = 0; i < this._info[this._curIndex]._ansNum._val; i++ ){
					var tmp = this.logY( this._info[this._curIndex]._ans[i]._y1 );
					if( _ISINF( tmp ) || _ISNAN( tmp ) ){
						drawFlag = false;
					} else {
						if( drawFlag ){
							oldX = posX;
							oldY = posY;
							posX = this._gWorld.imgPosX( this.logX( this._info[this._curIndex]._ans[i]._x ) );
							posY = this._gWorld.imgPosY( this.logY( this._info[this._curIndex]._ans[i]._y1 ) );
							this._drawLine( oldX, oldY, posX, posY );
						} else {
							drawFlag = true;
							posX = this._gWorld.imgPosX( this.logX( this._info[this._curIndex]._ans[i]._x ) );
							posY = this._gWorld.imgPosY( this.logY( this._info[this._curIndex]._ans[i]._y1 ) );
						}
					}
				}
				break;
			case 1:
				for( i = 0; i < this._info[this._curIndex]._ansNum._val; i++ ){
					if( drawFlag ){
						oldX = posX;
						oldY = posY;
						posX = this._gWorld.imgPosX( this._info[this._curIndex]._ans[i]._y1 );
						posY = this._gWorld.imgPosY( this._info[this._curIndex]._ans[i]._y2 );
						this._drawLine( oldX, oldY, posX, posY );
					} else {
						drawFlag = true;
						posX = this._gWorld.imgPosX( this._info[this._curIndex]._ans[i]._y1 );
						posY = this._gWorld.imgPosY( this._info[this._curIndex]._ans[i]._y2 );
					}
				}
				break;
			case 2:
				for( i = 0; i < this._info[this._curIndex]._ansNum._val; i++ ){
					var tmp = this._info[this._curIndex]._ans[i]._y1;
					if( _ISINF( tmp ) || _ISNAN( tmp ) ){
						drawFlag = false;
					} else {
						if( drawFlag ){
							oldX = posX;
							oldY = posY;
							posX = this._gWorld.imgPosX( this._info[this._curIndex]._ans[i]._y1 * fcos( this._info[this._curIndex]._ans[i]._x ) );
							posY = this._gWorld.imgPosY( this._info[this._curIndex]._ans[i]._y1 * fsin( this._info[this._curIndex]._ans[i]._x ) );
							this._drawLine( oldX, oldY, posX, posY );
						} else {
							drawFlag = true;
							posX = this._gWorld.imgPosX( this._info[this._curIndex]._ans[i]._y1 * fcos( this._info[this._curIndex]._ans[i]._x ) );
							posY = this._gWorld.imgPosY( this._info[this._curIndex]._ans[i]._y1 * fsin( this._info[this._curIndex]._ans[i]._x ) );
						}
					}
				}
				break;
			}
			return true;
		}
		return false;
	},
	rePlot : function( proc, param ){
		if( proc == undefined ){
			return this._rePlot();
		} else if( this._info[this._curIndex]._ansNum._val <= 0 ){
			return this.plot( proc, param );
		} else {
			var ret = new Array( 3 );
			ret[0] = this._rePlot();
			ret[1] = this._plotPos( proc, param, this._info[this._curIndex]._start );
			ret[2] = this._plotPos( proc, param, this._info[this._curIndex]._end );
			return ret[0] || ret[1] || ret[2];
		}
	},
	mark : function( x, y1, y2 ){
		var i;
		var posX, posY;
		switch( this._info[this._curIndex]._mode ){
		case 0:
			posX = this._gWorld.imgPosX( this.logX( x ) );
			for( i = 0; i < this._gWorld._height; i++ ){
				this._gWorld.putXOR( posX, i );
			}
			posY = this._gWorld.imgPosY( this.logY( y1 ) );
			for( i = 0; i < this._gWorld._width; i++ ){
				this._gWorld.putXOR( i, posY );
			}
			break;
		case 1:
			posX = this._gWorld.imgPosX( y1 );
			for( i = 0; i < this._gWorld._height; i++ ){
				this._gWorld.putXOR( posX, i );
			}
			posY = this._gWorld.imgPosY( y2 );
			for( i = 0; i < this._gWorld._width; i++ ){
				this._gWorld.putXOR( i, posY );
			}
			break;
		case 2:
			posX = this._gWorld.imgPosX( y1 * fcos( x ) );
			for( i = 0; i < this._gWorld._height; i++ ){
				this._gWorld.putXOR( posX, i );
			}
			posY = this._gWorld.imgPosY( y1 * fsin( x ) );
			for( i = 0; i < this._gWorld._width; i++ ){
				this._gWorld.putXOR( i, posY );
			}
			break;
		}
	},
	markRect : function( sx, sy, ex, ey ){
		var i;
		var tmp;
		var posX = this._gWorld.imgPosX( sx );
		var posY = this._gWorld.imgPosY( sy );
		var endX = this._gWorld.imgPosX( ex );
		var endY = this._gWorld.imgPosY( ey );
		if( posX > endX ){
			tmp = posX; posX = endX; endX = tmp;
		}
		if( posY > endY ){
			tmp = posY; posY = endY; endY = tmp;
		}
		for( i = posX; i <= endX; i++ ){
			this._gWorld.putXOR( i, posY );
			this._gWorld.putXOR( i, endY );
		}
		for( i = posY + 1; i < endY; i++ ){
			this._gWorld.putXOR( posX, i );
			this._gWorld.putXOR( endX, i );
		}
	},
	_search : function( x, ratio ){
		var i;
		if( this._info[this._curIndex]._ansNum._val > 0 ){
			var num = this._info[this._curIndex]._ansNum._val - 1;
			if( this._info[this._curIndex]._ans[0]._x < this._info[this._curIndex]._ans[1]._x ){
				if( x < this._info[this._curIndex]._ans[0]._x ){
					return -1;
				} else if( x > this._info[this._curIndex]._ans[num]._x ){
					return this._info[this._curIndex]._ansNum._val;
				} else if( x == this._info[this._curIndex]._ans[num]._x ){
					ratio.set( 0.0 );
					return num;
				}
				for( i = 1; i <= num; i++ ){
					if( (x >= this._info[this._curIndex]._ans[i - 1]._x) && (x < this._info[this._curIndex]._ans[i]._x) ){
						ratio.set( (x - this._info[this._curIndex]._ans[i - 1]._x) / (this._info[this._curIndex]._ans[i]._x - this._info[this._curIndex]._ans[i - 1]._x) );
						return i - 1;
					}
				}
			} else {
				if( x > this._info[this._curIndex]._ans[0]._x ){
					return -1;
				} else if( x < this._info[this._curIndex]._ans[num]._x ){
					return this._info[this._curIndex]._ansNum._val;
				} else if( x == this._info[this._curIndex]._ans[num]._x ){
					ratio.set( 0.0 );
					return num;
				}
				for( i = 1; i <= num; i++ ){
					if( (x <= this._info[this._curIndex]._ans[i - 1]._x) && (x > this._info[this._curIndex]._ans[i]._x) ){
						ratio.set( (x - this._info[this._curIndex]._ans[i - 1]._x) / (this._info[this._curIndex]._ans[i]._x - this._info[this._curIndex]._ans[i - 1]._x) );
						return i - 1;
					}
				}
			}
		}
		return -2;
	},
	_dist : function( x1, y1, x2, y2 ){
		if( _ISINF( x2 ) || _ISNAN( x2 ) || _ISINF( y2 ) || _ISNAN( y2 ) ){
			return -1.0;
		}
		return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
	},
	_searchParam : function( x, y ){
		var i;
		var tmp;
		if( this._info[this._curIndex]._ansNum._val > 0 ){
			var num = 0;
			var dist = this._dist( x, y, this._info[this._curIndex]._ans[0]._y1, this._info[this._curIndex]._ans[0]._y2 );
			for( i = 1; i < this._info[this._curIndex]._ansNum._val; i++ ){
				tmp = this._dist( x, y, this._info[this._curIndex]._ans[i]._y1, this._info[this._curIndex]._ans[i]._y2 );
				if( (tmp >= 0.0) && ((dist < 0.0) || (tmp < dist)) ){
					num = i;
					dist = tmp;
				}
			}
			return num;
		}
		return -2;
	},
	_searchPolar : function( x, y, ratio ){
		var tmp;
		if( this._info[this._curIndex]._ansNum._val > 0 ){
			var num = 0;
			var dist = this._dist(
				x, y,
				this._info[this._curIndex]._ans[0]._y1 * fcos( this._info[this._curIndex]._ans[0]._x ),
				this._info[this._curIndex]._ans[0]._y1 * fsin( this._info[this._curIndex]._ans[0]._x )
				);
			for( var i = 1; i < this._info[this._curIndex]._ansNum._val; i++ ){
				tmp = this._dist(
					x, y,
					this._info[this._curIndex]._ans[i]._y1 * fcos( this._info[this._curIndex]._ans[i]._x ),
					this._info[this._curIndex]._ans[i]._y1 * fsin( this._info[this._curIndex]._ans[i]._x )
					);
				if( (tmp >= 0.0) && ((dist < 0.0) || (tmp < dist)) ){
					num = i;
					dist = tmp;
				}
			}
			ratio.set( 0.0 );
			return num;
		}
		return -2;
	},
	getAns : function( x, y, ans ){
		var num;
		var ratio = new _Float();
		switch( this._info[this._curIndex]._mode ){
		case 0:
			ans._x = this.expX( this._gWorld.wndPosX( x ) );
			if( (num = this._search( ans._x, ratio )) < -1 ){
				return false;
			}
			if( num == -1 ){
				return false;
			} else if( num == this._info[this._curIndex]._ansNum._val ){
				return false;
			} else if( ratio._val == 0.0 ){
				ans._y1 = this._info[this._curIndex]._ans[num]._y1;
				ans._y2 = this._info[this._curIndex]._ans[num]._y2;
			} else {
				ans._y1 = this._info[this._curIndex]._ans[num]._y1 + (this._info[this._curIndex]._ans[num + 1]._y1 - this._info[this._curIndex]._ans[num]._y1) * ratio._val;
				ans._y2 = this._info[this._curIndex]._ans[num]._y2 + (this._info[this._curIndex]._ans[num + 1]._y2 - this._info[this._curIndex]._ans[num]._y2) * ratio._val;
			}
			break;
		case 1:
			if( (num = this._searchParam( this._gWorld.wndPosX( x ), this._gWorld.wndPosY( y ) )) < -1 ){
				return false;
			}
			if( num == -1 ){
				return false;
			} else if( num == this._info[this._curIndex]._ansNum._val ){
				return false;
			} else {
				ans._x = this._info[this._curIndex]._ans[num]._x ;
				ans._y1 = this._info[this._curIndex]._ans[num]._y1;
				ans._y2 = this._info[this._curIndex]._ans[num]._y2;
			}
			break;
		case 2:
			if( (num = this._searchPolar( this._gWorld.wndPosX( x ), this._gWorld.wndPosY( y ), ratio )) < -1 ){
				return false;
			}
			if( num == -1 ){
				return false;
			} else if( num == this._info[this._curIndex]._ansNum._val ){
				return false;
			} else if( ratio._val == 0.0 ){
				ans._x = this._info[this._curIndex]._ans[num]._x ;
				ans._y1 = this._info[this._curIndex]._ans[num]._y1;
			} else {
				ans._x = this._info[this._curIndex]._ans[num]._x + (this._info[this._curIndex]._ans[num + 1]._x - this._info[this._curIndex]._ans[num]._x ) * ratio._val;
				ans._y1 = this._info[this._curIndex]._ans[num]._y1 + (this._info[this._curIndex]._ans[num + 1]._y1 - this._info[this._curIndex]._ans[num]._y1) * ratio._val;
			}
			break;
		}
		return true;
	},
	get : function( proc, param, x, y1 , y2 ){
		var i;
		var num;
		var ratio = new _Float();
		var tmp;
		if( (num = this._search( x, ratio )) < -1 ){
			return false;
		}
		if( num == -1 ){
			if( !this._process( proc, param, this._info[this._curIndex]._expr1, x, y1 ) ){
				return false;
			}
			if( this._info[this._curIndex]._mode == 1 ){
				if( !this._process( proc, param, this._info[this._curIndex]._expr2, x, y2 ) ){
					return false;
				}
			}
			tmp = newGraphAnsArray( this._info[this._curIndex]._ansNum._val + 1 );
			for( i = 0; i < this._info[this._curIndex]._ansNum._val; i++ ){
				tmp[i + 1].set( this._info[this._curIndex]._ans[i] );
			}
			num = 0;
		} else if( num == this._info[this._curIndex]._ansNum._val ){
			if( !this._process( proc, param, this._info[this._curIndex]._expr1, x, y1 ) ){
				return false;
			}
			if( this._info[this._curIndex]._mode == 1 ){
				if( !this._process( proc, param, this._info[this._curIndex]._expr2, x, y2 ) ){
					return false;
				}
			}
			tmp = newGraphAnsArray( this._info[this._curIndex]._ansNum._val + 1 );
			for( i = 0; i < this._info[this._curIndex]._ansNum._val; i++ ){
				tmp[i].set( this._info[this._curIndex]._ans[i] );
			}
			num = this._info[this._curIndex]._ansNum._val;
		} else if( ratio._val == 0.0 ){
			y1.set( this._info[this._curIndex]._ans[num]._y1 );
			y2.set( this._info[this._curIndex]._ans[num]._y2 );
			return true;
		} else {
			if( !this._process( proc, param, this._info[this._curIndex]._expr1, x, y1 ) ){
				return false;
			}
			if( this._info[this._curIndex]._mode == 1 ){
				if( !this._process( proc, param, this._info[this._curIndex]._expr2, x, y2 ) ){
					return false;
				}
			}
			tmp = newGraphAnsArray( this._info[this._curIndex]._ansNum._val + 1 );
			for( i = 0; i <= num; i++ ){
				tmp[i].set( this._info[this._curIndex]._ans[i] );
			}
			for( ; i < this._info[this._curIndex]._ansNum._val; i++ ){
				tmp[i + 1].set( this._info[this._curIndex]._ans[i] );
			}
			num++;
		}
		tmp[num]._x = x;
		tmp[num]._y1 = y1._val;
		tmp[num]._y2 = y2._val;
		this._info[this._curIndex]._ansNum.set( this._info[this._curIndex]._ansNum._val + 1 );
		this._info[this._curIndex]._ans = tmp;
		return true;
	}
};
function __CharInfo(){
	this._width = 0;
	this._ascent = 0;
	this._descent = 0;
	this._sizeX = 0;
	this._sizeY = 0;
	this._data = null;
}
var _gworld_char_info = new Array();
function newGWorldCharInfo( charSet ){
	_gworld_char_info[charSet] = new Array( 256 );
	for( var i = 0; i < 256; i++ ){
		_gworld_char_info[charSet][i] = new __CharInfo();
	}
}
function regGWorldCharInfo( charSet, chr, width, ascent, descent, sizeX, sizeY, data ){
	_gworld_char_info[charSet][chr]._width = width;
	_gworld_char_info[charSet][chr]._ascent = ascent;
	_gworld_char_info[charSet][chr]._descent = descent;
	_gworld_char_info[charSet][chr]._sizeX = sizeX;
	_gworld_char_info[charSet][chr]._sizeY = sizeY;
	_gworld_char_info[charSet][chr]._data = new String();
	_gworld_char_info[charSet][chr]._data = data;
}
var _gworld_bg_color = 0;
function regGWorldBgColor( rgbColor ){
	_gworld_bg_color = rgbColor;
}
function gWorldBgColor(){
	return _gworld_bg_color;
}
function _GWorld(){
	this._image = null;
	this._offset = 0;
	this._width = 0;
	this._height = 0;
	this._createFlag = false;
	this._offsetX = 0.0;
	this._offsetY = 0.0;
	this._ratioX = 1.0;
	this._ratioY = 1.0;
	this._ratioX2 = 1.0;
	this._ratioY2 = 1.0;
	this._beginScroll = false;
	this._scrollPosX = 0.0;
	this._scrollPosY = 0.0;
	this._scrollOffX = 0.0;
	this._scrollOffY = 0.0;
	this._imgMoveX = 0;
	this._imgMoveY = 0;
	this._wndMoveX = 0.0;
	this._wndMoveY = 0.0;
	this._color = 0;
	this._charSet = 0;
	this._gWorldPut = true;
}
_GWorld.prototype = {
	create : function( width, height, initWindow ){
		this._dispose();
		if( (width <= 0) || (height <= 0) ){
			return false;
		}
		this._image = new Array( width * height );
		this._offset = width;
		this._width = width;
		this._height = height;
		this._createFlag = true;
		if( initWindow ){
			this.setWindow( 0.0, 0.0, 1.0, 1.0 );
		} else {
			this._wndMoveX = this.wndPosX( this._imgMoveX );
			this._wndMoveY = this.wndPosY( this._imgMoveY );
		}
		this.clear( 0 );
		return true;
	},
	open : function( image, offset, width, height, initWindow ){
		this._dispose();
		if( (width <= 0) || (height <= 0) ){
			return false;
		}
		this._image = image;
		this._offset = offset;
		this._width = width;
		this._height = height;
		this._createFlag = false;
		if( initWindow ){
			this.setWindow( 0.0, 0.0, 1.0, 1.0 );
		} else {
			this._wndMoveX = this.wndPosX( this._imgMoveX );
			this._wndMoveY = this.wndPosY( this._imgMoveY );
		}
		this.clear( 0 );
		return true;
	},
	_dispose : function(){
		this._image = null;
		this._offset = 0;
		this._width = 0;
		this._height = 0;
		this._createFlag = false;
	},
	setWindow : function( offsetX, offsetY, ratioX, ratioY ){
		this._offsetX = offsetX;
		this._offsetY = offsetY;
		this._ratioX = ratioX;
		this._ratioY = ratioY;
		this._ratioX2 = (this._ratioX >= 0.0) ? this._ratioX : -this._ratioX;
		this._ratioY2 = (this._ratioY >= 0.0) ? this._ratioY : -this._ratioY;
		this._wndMoveX = this.wndPosX( this._imgMoveX );
		this._wndMoveY = this.wndPosY( this._imgMoveY );
	},
	setWindowIndirect : function( left, bottom, right, top ){
		var sizeX, sizeY;
		if( ((sizeX = right - left) == 0.0) || ((sizeY = bottom - top) == 0.0) ){
			return false;
		}
		this._ratioX = (this._width - 1) / sizeX;
		this._ratioY = (this._height - 1) / sizeY;
		this._ratioX2 = (this._ratioX >= 0.0) ? this._ratioX : -this._ratioX;
		this._ratioY2 = (this._ratioY >= 0.0) ? this._ratioY : -this._ratioY;
		this._offsetX = 0.5 - left * this._ratioX;
		this._offsetY = 0.5 - top * this._ratioY;
		this._wndMoveX = this.wndPosX(this._imgMoveX);
		this._wndMoveY = this.wndPosY(this._imgMoveY);
		return true;
	},
	scroll : function( scrollX, scrollY ){
		if( this._beginScroll ){
			this._offsetX = this._scrollOffX + (scrollX - this._scrollPosX);
			this._offsetY = this._scrollOffY + (scrollY - this._scrollPosY);
		} else {
			this._offsetX += scrollX;
			this._offsetY += scrollY;
		}
	},
	beginScroll : function( scrollX, scrollY ){
		this._beginScroll = true;
		this._scrollPosX = scrollX;
		this._scrollPosY = scrollY;
		this._scrollOffX = this._offsetX;
		this._scrollOffY = this._offsetY;
	},
	endScroll : function(){
		this._beginScroll = false;
	},
	getWindow : function( offsetX , offsetY , ratioX , ratioY ){
		if( offsetX != null ) offsetX.set( this._offsetX );
		if( offsetY != null ) offsetY.set( this._offsetY );
		if( ratioX != null ) ratioX .set( this._ratioX );
		if( ratioY != null ) ratioY .set( this._ratioY );
	},
	imgPosX : function( x ){
		return _INT( x * this._ratioX + this._offsetX );
	},
	imgPosY : function( y ){
		return _INT( y * this._ratioY + this._offsetY );
	},
	imgSizX : function( x ){
		x *= this._ratioX2;
		if( _ISINF( x ) || _ISNAN( x ) ){
			return -1;
		}
		return _INT( x );
	},
	imgSizY : function( y ){
		y *= this._ratioY2;
		if( _ISINF( y ) || _ISNAN( y ) ){
			return -1;
		}
		return _INT( y );
	},
	wndPosX : function( x ){
		return (x - this._offsetX) / this._ratioX;
	},
	wndPosY : function( y ){
		return (y - this._offsetY) / this._ratioY;
	},
	wndSizX : function( x ){
		return x / this._ratioX2;
	},
	wndSizY : function( y ){
		return y / this._ratioY2;
	},
	setColor : function( color ){
		this._color = color;
		gWorldSetColor( this, this._color );
	},
	putColor : function( x, y, color ){
		if( (x < 0) || (x >= _INT( this._width )) || (y < 0) || (y >= _INT( this._height )) ){
			return false;
		}
		this._image[y * this._offset + x] = color;
		if( this._gWorldPut ){
			if( color == this._color ){
				gWorldPut( this, x, y );
			} else {
				gWorldPutColor( this, x, y, color );
			}
		}
		return true;
	},
	put : function( x, y ){
		return this.putColor( x, y, this._color );
	},
	wndPut : function( x, y ){
		return this.put( this.imgPosX( x ), this.imgPosY( y ) );
	},
	putXOR : function( x, y ){
		if( (x < 0) || (x >= _INT( this._width )) || (y < 0) || (y >= _INT( this._height )) ){
			return false;
		}
		var color = 255 - this._image[y * this._offset + x];
		this._image[y * this._offset + x] = color;
		if( this._gWorldPut ){
			gWorldPutColor( this, x, y, color );
		}
		return true;
	},
	get : function( x, y ){
		if( (x < 0) || (x >= _INT( this._width )) || (y < 0) || (y >= _INT( this._height )) ){
			return 0;
		}
		return this._image[y * this._offset + x];
	},
	wndGet : function( x, y ){
		return this.get( this.imgPosX( x ), this.imgPosY( y ) );
	},
	clear : function( color ){
		var ix, iy, yy;
		for( iy = 0; iy < this._height; iy++ ){
			yy = iy * this._offset;
			for( ix = 0; ix < this._width; ix++ ){
				this._image[yy + ix] = color;
			}
		}
		gWorldClear( this, color );
	},
	fill : function( x, y, w, h ){
		var ix, iy, yy;
		if( x < 0 ){
			w += x;
			x = 0;
		}
		if( y < 0 ){
			h += y;
			y = 0;
		}
		if( (x + w) > _INT( this._width ) ){
			w = _INT( this._width - x );
		}
		if( (y + h) > _INT( this._height ) ){
			h = _INT( this._height - y );
		}
		for( iy = y; iy < y + h; iy++ ){
			yy = iy * this._offset;
			for( ix = x; ix < x + w; ix++ ){
				this._image[yy + ix] = this._color;
			}
		}
		gWorldFill( this, x, y, w, h );
	},
	wndFill : function( x, y, w, h ){
		var gx = this.imgPosX( x );
		var gy = this.imgPosY( y );
		var gw = this.imgPosX( x + w ) - gx;
		var gh = this.imgPosY( y + h ) - gy;
		if( gw < 0 ){
			gx += (gw + 1);
			gw = -gw;
		}
		if( gh < 0 ){
			gy += (gh + 1);
			gh = -gh;
		}
		this.fill( gx, gy, gw, gh );
	},
	_clipLine : function( x1, y1, x2, y2, x , y ){
		var a, b;
		if( x._val < 0 ){
			if( y1 == y2 ){
				x.set( 0 );
			} else {
				a = (y1 - y2) / (x1 - x2);
				b = y1 - a * x1;
				x.set( 0 );
				y.set( _INT( b ) );
			}
		} else if( x._val > this._width ){
			if( y1 == y2 ){
				x.set( this._width );
			} else {
				a = (y1 - y2) / (x1 - x2);
				b = y1 - a * x1;
				x.set( this._width );
				y.set( _INT( a * this._width + b ) );
			}
		}
		if( y._val < 0 ){
			if( x1 == x2 ){
				y.set( 0 );
			} else {
				a = (y1 - y2) / (x1 - x2);
				b = y1 - a * x1;
				x.set( _INT( -b / a ) );
				y.set( 0 );
			}
		} else if( y._val > this._height ){
			if( x1 == x2 ){
				y.set( this._height );
			} else {
				a = (y1 - y2) / (x1 - x2);
				b = y1 - a * x1;
				x.set( _INT( (this._height - b) / a ) );
				y.set( this._height );
			}
		}
	},
	clipLine : function( x1 , y1 , x2 , y2 ){
		var ret;
		if(
			(x1._val >= 0) && (x1._val <= this._width ) &&
			(y1._val >= 0) && (y1._val <= this._height) &&
			(x2._val >= 0) && (x2._val <= this._width ) &&
			(y2._val >= 0) && (y2._val <= this._height)
		){
			return 1;
		} else {
			if(
				(x1._val >= 0) && (x1._val <= this._width ) &&
				(y1._val >= 0) && (y1._val <= this._height)
			){
				this._clipLine( x1._val, y1._val, x2._val, y2._val, x2, y2 );
				ret = 1;
			} else if(
				(x2._val >= 0) && (x2._val <= this._width ) &&
				(y2._val >= 0) && (y2._val <= this._height)
			){
				this._clipLine( x1._val, y1._val, x2._val, y2._val, x1, y1 );
				ret = 1;
			} else {
				this._clipLine( x1._val, y1._val, x2._val, y2._val, x1, y1 );
				this._clipLine( x1._val, y1._val, x2._val, y2._val, x2, y2 );
				ret = 2;
			}
			if(
				((x1._val <= 0 ) && (x2._val <= 0 )) ||
				((y1._val <= 0 ) && (y2._val <= 0 )) ||
				((x1._val >= this._width ) && (x2._val >= this._width )) ||
				((y1._val >= this._height) && (y2._val >= this._height))
			){
				return 0;
			}
		}
		return ret;
	},
	drawLine : function( x1, y1, x2, y2 ){
		gWorldLine( this, x1, y1, x2, y2 );
		this._gWorldPut = false;
		var dx, dy;
		var step;
		var temp;
		var s;
		dx = _ABS( x2 - x1 );
		dy = _ABS( y2 - y1 );
		if( dx > dy ){
			if( x1 > x2 ){
				step = (y1 > y2) ? 1 : -1;
				temp = x1; x1 = x2; x2 = temp;
				y1 = y2;
			} else {
				step = (y1 < y2) ? 1 : -1;
			}
			this.put( x1, y1 );
			s = _DIV( dx, 2 );
			while( ++x1 <= x2 ){
				if( (s -= dy) < 0 ){
					s += dx;
					y1 += step;
				}
				this.put( x1, y1 );
			}
		} else {
			if( y1 > y2 ){
				step = (x1 > x2) ? 1 : -1;
				temp = y1; y1 = y2; y2 = temp;
				x1 = x2;
			} else {
				step = (x1 < x2) ? 1 : -1;
			}
			this.put( x1, y1 );
			s = _DIV( dy, 2 );
			while( ++y1 <= y2 ){
				if( (s -= dx) < 0 ){
					s += dy;
					x1 += step;
				}
				this.put( x1, y1 );
			}
		}
		this._gWorldPut = true;
	},
	drawLineXOR : function( x1, y1, x2, y2 ){
		var dx, dy;
		var step;
		var temp;
		var s;
		dx = _ABS( x2 - x1 );
		dy = _ABS( y2 - y1 );
		if( dx > dy ){
			if( x1 > x2 ){
				step = (y1 > y2) ? 1 : -1;
				temp = x1; x1 = x2; x2 = temp;
				y1 = y2;
			} else {
				step = (y1 < y2) ? 1 : -1;
			}
			this.putXOR( x1, y1 );
			s = _DIV( dx, 2 );
			while( ++x1 <= x2 ){
				if( (s -= dy) < 0 ){
					s += dx;
					y1 += step;
				}
				this.putXOR( x1, y1 );
			}
		} else {
			if( y1 > y2 ){
				step = (x1 > x2) ? 1 : -1;
				temp = y1; y1 = y2; y2 = temp;
				x1 = x2;
			} else {
				step = (x1 < x2) ? 1 : -1;
			}
			this.putXOR( x1, y1 );
			s = _DIV( dy, 2 );
			while( ++y1 <= y2 ){
				if( (s -= dx) < 0 ){
					s += dy;
					x1 += step;
				}
				this.putXOR( x1, y1 );
			}
		}
	},
	line : function( x1, y1, x2, y2 ){
		var xx1 = new _Integer( x1 );
		var yy1 = new _Integer( y1 );
		var xx2 = new _Integer( x2 );
		var yy2 = new _Integer( y2 );
		if( this.clipLine( xx1, yy1, xx2, yy2 ) == 0 ){
			return false;
		}
		this.drawLine( xx1._val, yy1._val, xx2._val, yy2._val );
		this.moveTo( x2, y2 );
		return true;
	},
	lineXOR : function( x1, y1, x2, y2 ){
		var xx1 = new _Integer( x1 );
		var yy1 = new _Integer( y1 );
		var xx2 = new _Integer( x2 );
		var yy2 = new _Integer( y2 );
		if( this.clipLine( xx1, yy1, xx2, yy2 ) == 0 ){
			return false;
		}
		this.drawLineXOR( xx1._val, yy1._val, xx2._val, yy2._val );
		this.moveTo( x2, y2 );
		return true;
	},
	wndLine : function( x1, y1, x2, y2 ){
		var gx1 = new _Integer( this.imgPosX( x1 ) );
		var gy1 = new _Integer( this.imgPosY( y1 ) );
		var gx2 = new _Integer( this.imgPosX( x2 ) );
		var gy2 = new _Integer( this.imgPosY( y2 ) );
		if( this.clipLine( gx1, gy1, gx2, gy2 ) == 0 ){
			return false;
		}
		this.drawLine( gx1._val, gy1._val, gx2._val, gy2._val );
		this.wndMoveTo( x2, y2 );
		return true;
	},
	moveTo : function( x, y ){
		this._imgMoveX = x;
		this._imgMoveY = y;
		this._wndMoveX = this.wndPosX( this._imgMoveX );
		this._wndMoveY = this.wndPosY( this._imgMoveY );
	},
	wndMoveTo : function( x, y ){
		this._wndMoveX = x;
		this._wndMoveY = y;
		this._imgMoveX = this.imgPosX( this._wndMoveX );
		this._imgMoveY = this.imgPosY( this._wndMoveY );
	},
	lineTo : function( x, y ){
		return this.line( this._imgMoveX, this._imgMoveY, x, y );
	},
	wndLineTo : function( x, y ){
		return this.wndLine( this._wndMoveX, this._wndMoveY, x, y );
	},
	selectCharSet : function( charSet ){
		this._charSet = charSet;
	},
	getTextInfo : function( text, info ){
		info._width = 0;
		info._ascent = 0;
		info._descent = 0;
		var chr;
		for( var i = 0; i < text.length; i++ ){
			chr = text.charCodeAt( i );
			if( _gworld_char_info[this._charSet][chr]._data != null ){
				info._width += _gworld_char_info[this._charSet][chr]._width;
				if( _gworld_char_info[this._charSet][chr]._ascent > info._ascent ){
					info._ascent = _gworld_char_info[this._charSet][chr]._ascent;
				}
				if( _gworld_char_info[this._charSet][chr]._descent > info._descent ){
					info._descent = _gworld_char_info[this._charSet][chr]._descent;
				}
			}
		}
	},
	drawTextColor : function( text, x, y, color, right ){
		gWorldTextColor( this, text, x, y, color, right );
		this._gWorldPut = false;
		this._imgMoveX = x;
		this._imgMoveY = y;
		var xx, yy;
		var top;
		var chr;
		for( var i = 0; i < text.length; i++ ){
			chr = text.charCodeAt( right ? text.length - 1 - i : i );
			if( _gworld_char_info[this._charSet][chr]._data != null ){
				if( right ){
					this._imgMoveX -= _gworld_char_info[this._charSet][chr]._width;
				}
				top = 0;
				for( yy = this._imgMoveY - _gworld_char_info[this._charSet][chr]._sizeY; ; yy++ ){
					for( xx = 0; xx < _gworld_char_info[this._charSet][chr]._sizeX; xx++ ){
						if( _gworld_char_info[this._charSet][chr]._data.length == top + xx ){
							break;
						}
						if( _gworld_char_info[this._charSet][chr]._data.charAt( top + xx ) == '1' ){
							this.putColor( this._imgMoveX + xx, yy, color );
						}
					}
					if( _gworld_char_info[this._charSet][chr]._data.length == top + xx ){
						break;
					}
					top += _gworld_char_info[this._charSet][chr]._sizeX;
				}
				if( !right ){
					this._imgMoveX += _gworld_char_info[this._charSet][chr]._width;
				}
			}
		}
		this._wndMoveX = this.wndPosX( this._imgMoveX );
		this._gWorldPut = true;
	},
	drawText : function( text, x, y, right ){
		this.drawTextColor( text, x, y, this._color, right );
	},
	drawTextTo : function( text, right ){
		this.drawTextColor( text, this._imgMoveX, this._imgMoveY, this._color, right );
	},
	wndDrawTextColor : function( text, x, y, color, right ){
		var gx = this.imgPosX( x );
		var gy = this.imgPosY( y );
		this.drawTextColor( text, gx, gy, color, right );
	},
	wndDrawText : function( text, x, y, right ){
		this.wndDrawTextColor( text, x, y, this._color, right );
	},
	wndDrawTextTo : function( text, right ){
		this.wndDrawTextColor( text, this._wndMoveX, this._wndMoveY, this._color, right );
	},
};
function defGWorldFunction(){
	if( window.gWorldClear == undefined ) window.gWorldClear = function( gWorld, color ){};
	if( window.gWorldSetColor == undefined ) window.gWorldSetColor = function( gWorld, color ){};
	if( window.gWorldPutColor == undefined ) window.gWorldPutColor = function( gWorld, x, y, color ){};
	if( window.gWorldPut == undefined ) window.gWorldPut = function( gWorld, x, y ){};
	if( window.gWorldFill == undefined ) window.gWorldFill = function( gWorld, x, y, w, h ){};
	if( window.gWorldLine == undefined ) window.gWorldLine = function( gWorld, x1, y1, x2, y2 ){};
	if( window.gWorldTextColor == undefined ) window.gWorldTextColor = function( gWorld, text, x, y, color, right ){};
}
function _Label( obj ){
	this._obj = obj;
	this._label = new Array( 256 );
	this._flag = new Array( 256 );
	for( var i = 0; i < 256; i++ ){
		this._label[i] = null;
		this._flag [i] = _LABEL_UNUSED;
	}
	this._index = {};
}
_Label.prototype = {
	define : function( label ){
		if( label != null ){
			for( var i = 255; i >= 0; i-- ){
				if( this._flag[i] == _LABEL_UNUSED ){
					this._flag[i] = _LABEL_MOVABLE;
					this.setLabel( i, label, false );
					return i;
				}
			}
		}
		return -1;
	},
	undef : function( label ){
		var index;
		if( (index = this.checkLabel( label )) >= 0 ){
			this.setLabel( index, null, false );
			this._flag[index] = _LABEL_UNUSED;
		}
		return index;
	},
	setLabel : function( index, label, moveFlag ){
		if( this.moveFlag ){
			this._obj.move( index );
		}
		if( this._label[index] != null ){
			if( this._index[this._label[index]] == index ){
				delete this._index[this._label[index]];
			}
			this._label[index] = null;
		}
		if( label != null ){
			if( label.length > 0 ){
				this._label[index] = label;
				this._index[label] = index;
			}
		}
	},
	checkLabel : function( label ){
		if( label in this._index ){
			return this._index[label];
		}
		return -1;
	}
};
function __Line(){
	this._token = null;
	this._num = 0;
	this._comment = null;
	this._next = null;
}
function _Line( num ){
	this._top = null;
	this._end = null;
	this._get = null;
	this._nextNum = (num == undefined) ? 1 : ((num > 0) ? num : 1);
}
_Line.prototype = {
	_newLine : function(){
		var tmp = new __Line();
		if( this._top == null ){
			this._top = tmp;
			this._end = tmp;
		} else {
			this._end._next = tmp;
			this._end = tmp;
		}
		tmp._num = this._nextNum;
		return tmp;
	},
	dup : function(){
		var dst = new _Line();
		var line;
		this._get = this._top;
		while( this._get != null ){
			dst.regLine( this._get );
			this._get = this._get._next;
		}
		dst._nextNum = this._nextNum;
		return dst;
	},
	_checkEscape : function( line, top, cur ){
		cur--;
		if( cur < top ){
			return false;
		}
		var check = false;
		while( isCharEscape( line, top + cur ) ){
			check = check ? false : true;
			cur--;
			if( cur < top ){
				break;
			}
		}
		return check;
	},
	regString : function( param, line, strToVal ){
		var i;
		var ret;
		var len;
		var curLine = "";
		var tmp = this._newLine();
		tmp._token = new _Token();
		var top = 0;
		var cur = 0;
		while( top + cur < line.length ){
			if( line.charAt( top + cur ) == ';' ){
				if( !this._checkEscape( line, top, cur ) ){
					curLine = line.substr( top, cur );
					if( (ret = tmp._token.regString( param, curLine, strToVal )) != 0x00 ){
						return ret;
					}
					tmp = this._newLine();
					tmp._token = new _Token;
					top = top + cur + 1;
					cur = 0;
					continue;
				}
			} else if( line.charAt( top + cur ) == '#' ){
				if( !this._checkEscape( line, top, cur ) ){
					len = line.length - (top + cur + 1);
					tmp._comment = new String();
					for( i = 0; i < len; i++ ){
						var tmp2 = top + cur + 1 + i;
						if( isCharEnter( line, tmp2 ) ){
							break;
						}
						tmp._comment += line.charAt( tmp2 );
					}
					line = line.substr( top, cur );
					curLine = line;
					continue;
				}
			}
			cur++;
			curLine = line.substr( top, cur );
		}
		this._nextNum++;
		return tmp._token.regString( param, curLine, strToVal );
	},
	regLine : function( line ){
		var ret;
		var tmp = this._newLine();
		tmp._token = new _Token();
		if( (ret = line._token.dup( tmp._token )) != 0x00 ){
			return ret;
		}
		if( line._num > 0 ){
			tmp._num = line._num;
			this._nextNum = tmp._num + 1;
		} else {
			this._nextNum++;
		}
		if( line._comment != null ){
			tmp._comment = line._comment;
		}
		return 0x00;
	},
	beginGetLine : function(){
		this._get = this._top;
	},
	getLine : function(){
		if( this._get == null ){
			return null;
		}
		var line = this._get;
		this._get = this._get._next;
		return line;
	}
};
function __Loop(){
	this._line = null;
	this._subFlag = false;
	this._next = null;
}
function _Loop(){
	this._beforeLoop = null;
	this._curLoop = this;
	this._loopType = 0;
	this._top = null;
	this._end = null;
	this._cur = null;
	this._getFlag = false;
	this._breakFlag = false;
	this._contFlag = false;
}
_Loop.prototype = {
	_newLine : function(){
		var tmp = new __Loop();
		if( this._top == null ){
			this._top = tmp;
		} else {
			this._end._next = tmp;
		}
		this._end = tmp;
		this._end._next = this._top;
		tmp._line = null;
		return tmp;
	},
	_del : function( cur, before ){
		if( cur == null ){
			return null;
		}
		var tmp = cur;
		if( before != null ){
			before._next = tmp._next;
			cur = tmp._next;
		} else if( tmp == this._end ){
			this._top = null;
			cur = null;
		} else {
			this._top = tmp._next;
			this._end._next = this._top;
			cur = tmp._next;
		}
		if( tmp._subFlag ){
			tmp._line = null;
		} else {
			tmp._line._token = null;
			if( tmp._line._comment != null ){
				tmp._line._comment = null;
			}
			tmp._line = null;
		}
		return cur;
	},
	_loopStart : function( _this, line , beforeFlag ){
		if( _this._curLoop._loopType != 5 ){
			line._obj._subFlag = true;
			line._obj._line = new _Loop();
			line._obj._line._loopType = 1;
			line._obj._line._beforeLoop = _this._curLoop;
			_this._curLoop = line._obj._line;
			line.set( _this._curLoop._newLine() );
		}
		return 0x00;
	},
	_loopDo : function( _this, line , beforeFlag ){
		if( _this._curLoop._loopType != 5 ){
			line._obj._subFlag = true;
			line._obj._line = new _Loop();
			line._obj._line._loopType = 2;
			line._obj._line._beforeLoop = _this._curLoop;
			_this._curLoop = line._obj._line;
			line.set( _this._curLoop._newLine() );
		}
		return 0x00;
	},
	_loopWhile : function( _this, line , beforeFlag ){
		if( _this._curLoop._loopType != 5 ){
			line._obj._subFlag = true;
			line._obj._line = new _Loop();
			line._obj._line._loopType = 3;
			line._obj._line._beforeLoop = _this._curLoop;
			_this._curLoop = line._obj._line;
			line.set( _this._curLoop._newLine() );
		}
		return 0x00;
	},
	_loopFor : function( _this, line , beforeFlag ){
		if( _this._curLoop._loopType != 5 ){
			line._obj._subFlag = true;
			line._obj._line = new _Loop();
			line._obj._line._loopType = 4;
			line._obj._line._beforeLoop = _this._curLoop;
			_this._curLoop = line._obj._line;
			line.set( _this._curLoop._newLine() );
		}
		return 0x00;
	},
	_loopFunc : function( _this, line , beforeFlag ){
		if( _this._curLoop._loopType == 5 ){
			return 0x212C;
		}
		line._obj._subFlag = true;
		line._obj._line = new _Loop();
		line._obj._line._loopType = 5;
		line._obj._line._beforeLoop = _this._curLoop;
		_this._curLoop = line._obj._line;
		line.set( _this._curLoop._newLine() );
		return 0x00;
	},
	_loopEnd : function( _this, line , beforeFlag ){
		if( _this._curLoop._loopType == 1 ){
			beforeFlag.set( true );
		}
		return 0x00;
	},
	_loopCont : function( _this, line , beforeFlag ){
		if( _this._curLoop._loopType == 1 ){
			beforeFlag.set( true );
		}
		return 0x00;
	},
	_loopUntil : function( _this, line , beforeFlag ){
		if( _this._curLoop._loopType == 2 ){
			beforeFlag.set( true );
		}
		return 0x00;
	},
	_loopEndWhile : function( _this, line , beforeFlag ){
		if( _this._curLoop._loopType == 3 ){
			beforeFlag.set( true );
		}
		return 0x00;
	},
	_loopNext : function( _this, line , beforeFlag ){
		var tmp;
		var ret;
		if( _this._curLoop._loopType == 4 ){
			tmp = _this._curLoop._top._line._token;
			tmp.del( 0 );
			tmp.del( 0 );
			tmp.del( -1 );
			if( _this._curLoop._top._next == _this._curLoop._end ){
				return 0x2126;
			} else if( _this._curLoop._top._next._subFlag ){
				return 0x2126;
			}
			tmp = _this._curLoop._top._next._line._token;
			if( tmp.count() > 0 ){
				tmp.insCode( 0, 10, 12 );
				tmp.insCode( 1, 0, null );
				tmp.addCode( 15, null );
			} else {
				tmp.insCode( 0, 10, 13 );
			}
			if( _this._curLoop._top._next._next == _this._curLoop._end ){
				return 0x2127;
			} else if( _this._curLoop._top._next._next._subFlag ){
				return 0x2127;
			}
			if( (ret = _this._curLoop.regLine( _this._curLoop._top._next._next._line )) != 0x02 ){
				return ret;
			}
			_this._curLoop._top._next._next = _this._curLoop._del( _this._curLoop._top._next._next, _this._curLoop._top._next );
			beforeFlag.set( true );
		}
		return 0x00;
	},
	_loopEndFunc : function( _this, line , beforeFlag ){
		if( _this._curLoop._loopType == 5 ){
			beforeFlag.set( true );
		}
		return 0x00;
	},
	regLine : function( line ){
		var code;
		var token;
		var ret;
		var tmp = new _Void( this._curLoop._newLine() );
		var beforeFlag = new _Boolean( false );
		line._token.beginGetToken();
		if( line._token.getToken() ){
			code = _get_code;
			token = _get_token;
			if( (code == 10) && (token < 17) ){
				if( (ret = _loopSub[token]( this, tmp, beforeFlag )) != 0x00 ){
					return ret;
				}
			}
		}
		tmp._obj._line = new __Line();
		tmp._obj._line._token = new _Token();
		line._token.dup( tmp._obj._line._token );
		tmp._obj._line._num = line._num;
		if( line._comment != null ){
			tmp._obj._line._comment = new String();
			tmp._obj._line._comment = line._comment;
		}
		tmp._obj._line._next = line._next;
		tmp._obj._subFlag = false;
		if( beforeFlag._val ){
			this._curLoop._getFlag = false;
			this._curLoop = this._curLoop._beforeLoop;
			if( this._curLoop._loopType == 0 ){
				return 0x04;
			}
		}
		return 0x02;
	},
	_getNextLine : function(){
		if( this._curLoop._loopType == 1 ){
			this._curLoop._cur = this._curLoop._cur._next;
			return true;
		} else if( this._curLoop._loopType == 2 ){
			this._curLoop._cur = this._curLoop._cur._next;
			return true;
		} else if( this._curLoop._loopType == 3 ){
			this._curLoop._cur = this._curLoop._cur._next;
			return true;
		} else if( this._curLoop._loopType == 4 ){
			this._curLoop._cur = (this._curLoop._cur == this._curLoop._end) ?
				this._curLoop._top._next :
				this._curLoop._cur._next;
			return true;
		} else if( this._curLoop._loopType == 5 ){
			if( this._curLoop._cur == this._curLoop._end ){
				return false;
			} else {
				this._curLoop._cur = this._curLoop._cur._next;
				return true;
			}
		}
		this._curLoop._cur = (this._curLoop._cur == this._curLoop._end) ?
			null :
			this._curLoop._cur._next;
		return true;
	},
	getLine : function(){
		if( !(this._curLoop._getFlag) ){
			this._curLoop._getFlag = true;
			this._curLoop._cur = this._curLoop._top;
		}
		if( this._curLoop._cur == null ){
			return null;
		} else if( this._curLoop._cur._subFlag ){
			var nextLoop = this._curLoop._cur._line;
			nextLoop._breakFlag = this._curLoop._breakFlag;
			this._curLoop = nextLoop;
			return this._curLoop.getLine();
		}
		var line = this._curLoop._cur._line;
		if( this._curLoop._getNextLine() ){
			return line;
		}
		return null;
	},
	doEnd : function(){
		if( this._curLoop._contFlag ){
			this._curLoop._breakFlag = false;
			this._curLoop._contFlag = false;
		} else if( this._curLoop._breakFlag ){
			this._curLoop._breakFlag = false;
			this._curLoop._getFlag = false;
			this._curLoop = this._curLoop._beforeLoop;
			this._curLoop._getNextLine();
		}
	},
	doBreak : function(){
		if( !(this._curLoop._contFlag) ){
			this._curLoop._breakFlag = true;
		}
	},
	doContinue : function(){
		if( !(this._curLoop._breakFlag) ){
			this._curLoop._breakFlag = true;
			this._curLoop._contFlag = true;
		}
	},
	checkBreak : function(){
		return this._curLoop._breakFlag;
	},
	checkContinue : function(){
		return this._curLoop._contFlag;
	}
};
var _loopSub = [
	_Loop.prototype._loopStart,
	_Loop.prototype._loopEnd,
	_Loop.prototype._loopEnd,
	_Loop.prototype._loopEnd,
	_Loop.prototype._loopEnd,
	_Loop.prototype._loopEnd,
	_Loop.prototype._loopEnd,
	_Loop.prototype._loopCont,
	_Loop.prototype._loopDo,
	_Loop.prototype._loopUntil,
	_Loop.prototype._loopWhile,
	_Loop.prototype._loopEndWhile,
	_Loop.prototype._loopFor,
	_Loop.prototype._loopFor,
	_Loop.prototype._loopNext,
	_Loop.prototype._loopFunc,
	_Loop.prototype._loopEndFunc
];
function _Param( num, parentParam, inherit ){
	var i;
	this._parentNum = (parentParam == undefined) ? 0 : (
		parentParam._fileFlag ? ((parentParam._topNum > 0) ? num - parentParam._topNum + 1 : num) : 0
		);
	this._parentFunc = (parentParam == undefined) ? "" : (
		(parentParam._funcName == null) ? "" : parentParam._funcName
		);
	if( parentParam == undefined ){
		inherit = false;
	}
	this._calculator = inherit ? parentParam._calculator : false;
	this._base = inherit ? parentParam._base : 0;
	this._mode = inherit ? parentParam._mode : 0x0012;
	this._fps = inherit ? parentParam._fps : 30.0;
	this._prec = inherit ? parentParam._prec : 6;
	this._radix = inherit ? parentParam._radix : 10;
	if( parentParam != undefined ){
		this._saveMode = parentParam._mode;
		this._saveFps = parentParam._fps;
	}
	this.updateMode();
	this.updateFps();
	this._var = new _Variable();
	this._array = new _Array();
	this._func = new _Func();
	this._funcName = null;
	this._fileData = null;
	this._fileDataGet = 0;
	this._fileLine = null;
	this._fileFlag = false;
	this._topNum = 0;
	this._lineNum = 1;
	this._enableCommand = true;
	this._enableOpPow = false;
	this._enableStat = true;
	this._printAns = true;
	this._assFlag = false;
	this._subStep = 0;
	this._parent = null;
	this._updateParam = new Array( 10 );
	for( i = 0; i < 10; i++ ){
		this._updateParam[i] = false;
	}
	this._updateParamCode = new Array();
	this._updateParamIndex = new Array();
	this._updateParentVar = new Array();
	this._updateParentArray = new Array();
	this._defNameSpace = null;
	this._nameSpace = null;
	this._seFlag = false;
	this._seToken = 0;
}
_Param.prototype = {
	end : function(){
		if( this._saveMode != undefined ){
			globalParam().setMode( this._saveMode );
		}
		if( this._saveFps != undefined ){
			globalParam().setFps( this._saveFps );
		}
	},
	updateMode : function(){
		setComplexIsReal( (this._mode & 0x0020) == 0 );
		if( (this._mode & 0x0040) != 0 ){
			setValueType( 1 );
		} else if( (this._mode & 0x0080) != 0 ){
			setValueType( 2 );
		} else {
			setValueType( 0 );
		}
	},
	setMode : function( mode ){
		this._mode = mode;
		this.updateMode();
	},
	updateFps : function(){
		setTimeFps( this._fps );
	},
	setFps : function( fps ){
		if( fps < 0.0 ){
			this._fps = 30.0;
		} else {
			this._fps = fps;
		}
		this.updateFps();
	},
	setPrec : function( prec ){
		if( prec < 0 ){
			this._prec = 6;
		} else {
			this._prec = prec;
		}
	},
	setRadix : function( radix ){
		if( radix < 2 ){
			this._radix = 10;
		} else if( radix > 36 ){
			this._radix = 36;
		} else {
			this._radix = radix;
		}
	},
	setVal : function( index, value, moveFlag ){
		if( index == 0 ){
			this._array._mat[index]._mat[0].ass( value );
			return true;
		} else {
			return this._var.set( index, value, moveFlag );
		}
	},
	setReal : function( index, value, moveFlag ){
		if( index == 0 ){
			this._array._mat[index]._mat[0].setReal( value );
			return true;
		} else {
			return this._var.setReal( index, value, moveFlag );
		}
	},
	setImag : function( index, value, moveFlag ){
		if( index == 0 ){
			this._array._mat[index]._mat[0].setImag( value );
			return true;
		} else {
			return this._var.setImag( index, value, moveFlag );
		}
	},
	fractSetMinus : function( index, isMinus, moveFlag ){
		if( index == 0 ){
			this._array._mat[index]._mat[0].fractSetMinus( isMinus );
			return true;
		} else {
			return this._var.fractSetMinus( index, isMinus, moveFlag );
		}
	},
	setNum : function( index, value, moveFlag ){
		if( index == 0 ){
			this._array._mat[index]._mat[0].setNum( value );
			return true;
		} else {
			return this._var.setNum( index, value, moveFlag );
		}
	},
	setDenom : function( index, value, moveFlag ){
		if( index == 0 ){
			this._array._mat[index]._mat[0].setDenom( value );
			return true;
		} else {
			return this._var.setDenom( index, value, moveFlag );
		}
	},
	fractReduce : function( index, moveFlag ){
		if( index == 0 ){
			this._array._mat[index]._mat[0].fractReduce();
			return true;
		} else {
			return this._var.fractReduce( index, moveFlag );
		}
	},
	val : function( index ){
		return (index == 0) ? this._array._mat[index]._mat[0] : this._var.val( index );
	},
	isZero : function( index ){
		return _ISZERO( this.val( index ).real() ) && _ISZERO( this.val( index ).imag() );
	},
	setFunc : function( funcName, topNum ){
		if( this._funcName != null ){
			this._funcName = null;
		}
		if( funcName != null ){
			this._funcName = new String();
			this._funcName = funcName;
			var end = this._funcName.indexOf( ":" );
			if( end > 0 ){
				this.setDefNameSpace( this._funcName.substring( 0, end ) );
			}
		}
		this._topNum = topNum;
	},
	dupDefine : function( dst ){
		for( var i = 1; i < 256; i++ ){
			if( this._var.isLocked( i ) ){
				dst._var.define( this._var._label._label[i], this._var.val( i ), true );
			}
		}
	},
	setLabel : function( label ){
		var i;
		var code;
		var token;
		var strLabel = new String();
		var lock;
		i = 0;
		label.beginGetToken();
		while( label.getToken() ){
			code = _get_code;
			token = _get_token;
			if( (code == 20) || ((code == 11) && (token >= 21)) ){
				if( !(label.getToken()) ){
					break;
				}
				code = _get_code;
				token = _get_token;
				this._updateParam[i] = true;
			} else {
				this._updateParam[i] = false;
			}
			if( code == 8 ){
				strLabel = token;
				lock = label.lock();
				if( label.getToken() ){
					code = _get_code;
					token = _get_token;
					if( code == 21 ){
						this._array._label.setLabel( _CHAR_CODE_0 + i, strLabel, true );
					} else {
						label.unlock( lock );
						this._var._label.setLabel( _CHAR_CODE_0 + i, strLabel, true );
					}
				} else {
					label.unlock( lock );
					this._var._label.setLabel( _CHAR_CODE_0 + i, strLabel, true );
				}
				i++;
			}
		}
	},
	setDefNameSpace : function( defNameSpace ){
		this._defNameSpace = defNameSpace;
		this._nameSpace = this._defNameSpace;
	},
	resetNameSpace : function(){
		this._nameSpace = this._defNameSpace;
	}
};
var _MIN_VALUE = [ -128, 0 , -32768, 0 , -2147483648, 0 ];
var _MAX_VALUE = [ 127, 256 - 1, 32767, 65536 - 1, 2147483647, 4294967296 - 1 ];
var _proc_env;
function _ProcEnv(){
	this._proc_graph = new _Graph();
	this._proc_gworld = this._proc_graph._gWorld;
	this._proc_func = new _Func();
	this._global_param = null;
	this._proc_warn_flow = false;
	this._proc_trace = false;
	this._proc_loop_max = 0;
	this._proc_loop_count = 0;
	this._proc_loop_count_max = 0;
	this._proc_loop_total = 0;
	this._math_env = new _MathEnv();
}
function setProcEnv( env ){
	_proc_env = env;
	setMathEnv( env._math_env );
}
function procGraph(){
	return _proc_env._proc_graph;
}
function procGWorld(){
	return _proc_env._proc_gworld;
}
function procFunc(){
	return _proc_env._proc_func;
}
function setGlobalParam( param ){
	_proc_env._global_param = param;
}
function globalParam(){
	return _proc_env._global_param;
}
function setProcWarnFlowFlag( flag ){
	_proc_env._proc_warn_flow = flag;
}
function procWarnFlowFlag(){
	return _proc_env._proc_warn_flow;
}
function setProcTraceFlag( flag ){
	_proc_env._proc_trace = flag;
}
function procTraceFlag(){
	return _proc_env._proc_trace;
}
function setProcLoopMax( max ){
	_proc_env._proc_loop_max = max;
}
function procLoopMax(){
	return _proc_env._proc_loop_max;
}
function initProcLoopCount(){
	_proc_env._proc_loop_count = 0;
	_proc_env._proc_loop_count_max = 0;
	_proc_env._proc_loop_total = 0;
}
function resetProcLoopCount(){
	if( _proc_env._proc_loop_count_max < _proc_env._proc_loop_count ){
		_proc_env._proc_loop_count_max = _proc_env._proc_loop_count;
	}
	_proc_env._proc_loop_count = 0;
}
function setProcLoopCount( count ){
	_proc_env._proc_loop_count = count;
}
function procLoopCount(){
	return _proc_env._proc_loop_count;
}
function procLoopCountMax(){
	return _proc_env._proc_loop_count_max;
}
function incProcLoopTotal(){
	_proc_env._proc_loop_total++;
}
function procLoopTotal(){
	return _proc_env._proc_loop_total;
}
function __Inc(){
	this._flag = false;
	this._code = 0;
	this._token = null;
	this._array = null;
	this._arraySize = 0;
	this._next = null;
}
function __ProcPrint(){
	this._string = null;
	this._next = null;
}
function __ProcScan(){
	this._title = null;
	this._code = 0;
	this._token = null;
	this._before = null;
	this._next = null;
}
__ProcScan.prototype = {
	title : function(){
		if( this._title == null ){
			return "";
		}
		return this._title;
	},
	getDefString : function( proc, param ){
		var defString = new String();
		switch( this._code ){
		case 0x46:
			param = globalParam();
		case 0x44:
		case 0x45:
			defString = proc.strGet( param._array, proc.arrayIndexDirect( param, this._code, this._token ) );
			break;
		case 0x23:
			param = globalParam();
		default:
			var token = new _Token();
			var real = new _String();
			var imag = new _String();
			token.valueToString( param, param.val( proc.varIndexDirect( param, this._code, this._token ) ), real, imag );
			defString = real.str() + imag.str();
			break;
		}
		return defString;
	},
	setNewValue : function( newString, proc, param ){
		switch( this._code ){
		case 0x46:
			param = globalParam();
		case 0x44:
		case 0x45:
			proc.strSet( param._array, proc.arrayIndexDirect( param, this._code, this._token ), newString );
			break;
		default:
			var token = new _Token();
			var value = new _Value();
			if( token.stringToValue( param, newString, value ) ){
				var moveFlag = new _Boolean();
				var index = proc.varIndexDirectMove( param, this._code, this._token, moveFlag );
				param.setVal( index, value, moveFlag._val );
			}
			break;
		}
	}
};
function __ProcUsage(){
	this._string = null;
	this._next = null;
}
function __ProcInfo(){
	this._assCode = 14;
	this._assToken = null;
	this._curArray = null;
	this._curArraySize = 0;
}
function __Index(){
	this._param = null;
	this._index = -1;
}
__Index.prototype = {
	set : function( param, index ){
		this._param = param;
		this._index = index;
	}
};
function _Proc( parentMode, printAssert, printWarn, gUpdateFlag ){
	this._token = new _Token();
	this._value = new _Value();
	this._matAns = new _Matrix();
	this._matSeAns = new _Matrix();
	this._procLine = null;
	this._defLine = new __Line();
	this._curLine = this._defLine;
	this._defInfo = new __ProcInfo();
	this._curInfo = this._defInfo;
	this._errCode = 0;
	this._errToken = null;
	this._parentMode = parentMode;
	this._angType = 0;
	this._angUpdateFlag = false;
	this._parentAngType = complexAngType();
	setComplexAngType( this._angType );
	this._quitFlag = false;
	this._printAns = false;
	this._printAssert = printAssert;
	this._prevPrintAssert = printAssert;
	this._printWarn = printWarn;
	this._prevPrintWarn = printWarn;
	this._gUpdateFlag = gUpdateFlag;
	this._prevGUpdateFlag = gUpdateFlag;
	this._statIfMode = new Array( 16 );
	this._statIfMode[0] = 1;
	this._statIfCnt = 0;
	this._statIfMax = 15;
	this._statSwiMode = new Array( 16 );
	this._statSwiMode[0] = 1;
	this._statSwiVal = newMatrixArray( 16 );
	this._statSwiCnt = 0;
	this._statSwiMax = 15;
	this._statMode = 0;
	this._stat = null;
	this._loopCnt = 0;
	this._initArrayFlag = false;
	this._initArrayCnt = 0;
	this._initArrayMax = 0;
	this._initArrayIndex = 0;
	this._initArrayMoveFlag = new _Boolean();
	this._initArray = null;
	this._topInc = null;
	this._endInc = null;
	this._topUsage = null;
	this._curUsage = null;
}
_Proc.prototype = {
	end : function(){
		setComplexAngType( this._parentAngType );
	},
	setFuncCacheSize : function( size ){
		procFunc().setMaxNum( size );
	},
	funcCacheSize : function(){
		return procFunc()._max;
	},
	clearFuncCache : function( name ){
		var curFunc;
		if( (curFunc = procFunc().search( name, false, null )) != null ){
			procFunc().del( curFunc );
		}
	},
	clearAllFuncCache : function(){
		procFunc().delAll();
	},
	getFuncCacheInfo : function( num, info ){
		return procFunc().getInfo( num, info );
	},
	canClearFuncCache : function(){
		return procFunc().canDel();
	},
	_setFlag : function( flag, newFlag , prevFlag ){
		if( flag < 0 ){
			var tmpFlag = newFlag._val;
			newFlag .set( prevFlag._val );
			prevFlag.set( tmpFlag );
		} else {
			prevFlag.set( newFlag._val );
			newFlag .set( flag != 0 );
		}
	},
	setAssertFlag : function( flag ){
		var printAssert = new _Boolean( this._printAssert );
		var prevPrintAssert = new _Boolean( this._prevPrintAssert );
		this._setFlag( flag, printAssert, prevPrintAssert );
		this._printAssert = printAssert ._val;
		this._prevPrintAssert = prevPrintAssert._val;
	},
	setWarnFlag : function( flag ){
		var printWarn = new _Boolean( this._printWarn );
		var prevPrintWarn = new _Boolean( this._prevPrintWarn );
		this._setFlag( flag, printWarn, prevPrintWarn );
		this._printWarn = printWarn ._val;
		this._prevPrintWarn = prevPrintWarn._val;
	},
	setGUpdateFlag : function( flag ){
		var gUpdateFlag = new _Boolean( this._gUpdateFlag );
		var prevGUpdateFlag = new _Boolean( this._prevGUpdateFlag );
		this._setFlag( flag, gUpdateFlag, prevGUpdateFlag );
		this._gUpdateFlag = gUpdateFlag ._val;
		this._prevGUpdateFlag = prevGUpdateFlag._val;
	},
	setAngType : function( type, updateFlag ){
		this._angType = type;
		this._angUpdateFlag = updateFlag;
		setComplexAngType( this._angType );
	},
	getAngType : function( type , updateFlag ){
		type.set( this._angType );
		updateFlag.set( this._angUpdateFlag );
	},
	_index : function( param, code, token ){
		if( token == _CHAR_CODE_COLON ){
			var value = new _Matrix();
			if( this._const( param, code, token, value ) == 0x00 ){
				return _UNSIGNED( value._mat[0].toFloat(), 256 );
			}
		}
		return token;
	},
	varIndexParam : function( param, token ){
		return this._index( param, 0x21, token );
	},
	autoVarIndex : function( param, token ){
		return param._var._label.checkLabel( token );
	},
	varIndexIndirect : function( param, code, token ){
		return (code == 0x21) ? this._index( param, code, token ) : this.autoVarIndex( param, token );
	},
	varIndexIndirectMove : function( param, code, token, moveFlag ){
		moveFlag.set( code == 0x21 );
		return moveFlag._val ? this._index( param, code, token ) : this.autoVarIndex( param, token );
	},
	varIndexDirect : function( param, code, token ){
		return (code == 0x21) ? token : this.autoVarIndex( param, token );
	},
	varIndexDirectMove : function( param, code, token, moveFlag ){
		moveFlag.set( code == 0x21 );
		return moveFlag._val ? token : this.autoVarIndex( param, token );
	},
	arrayIndexParam : function( param, token ){
		return this._index( param, 0x44, token );
	},
	autoArrayIndex : function( param, token ){
		return param._array._label.checkLabel( token );
	},
	arrayIndexIndirect : function( param, code, token ){
		return (code == 0x44) ? this._index( param, code, token ) : this.autoArrayIndex( param, token );
	},
	arrayIndexIndirectMove : function( param, code, token, moveFlag ){
		moveFlag.set( code == 0x44 );
		return moveFlag._val ? this._index( param, code, token ) : this.autoArrayIndex( param, token );
	},
	arrayIndexDirect : function( param, code, token ){
		return (code == 0x44) ? token : this.autoArrayIndex( param, token );
	},
	arrayIndexDirectMove : function( param, code, token, moveFlag ){
		moveFlag.set( code == 0x44 );
		return moveFlag._val ? token : this.autoArrayIndex( param, token );
	},
	_strSet : function( array, index, top, str ){
		var src, dst;
		var dst2 = new Array( 1 );
		array.resizeVector( index, top + str.length, 0.0, false );
		for( src = 0, dst = top; src < str.length; src++, dst++ ){
			dst2[0] = dst;
			array.set( index, dst2, 1, str.charCodeAt( src ), false );
		}
	},
	strSet : function( array, index, str ){
		this._strSet( array, index, 0, str );
	},
	strCat : function( array, index, str ){
		this._strSet( array, index, this.strLen( array, index ), str );
	},
	strGet : function( array, index ){
		var str = new String();
		var len = this.strLen( array, index );
		for( var i = 0; i < len; i++ ){
			str += String.fromCharCode( _INT( array.val( index, i ).toFloat() ) );
		}
		return str;
	},
	strLen : function( array, index ){
		var len;
		for( len = 0; ; len++ ){
			if( array.val( index, len ).toFloat() == 0 ){
				break;
			}
		}
		return len;
	},
	strLwr : function( array, index ){
		var chr;
		var dst = new Array( 1 );
		for( var i = 0; ; i++ ){
			if( (chr = array.val( index, i ).toFloat()) == 0 ){
				break;
			}
			if( (chr >= _CHAR_CODE_UA) && (chr <= _CHAR_CODE_UZ) ){
				dst[0] = i;
				array.set( index, dst, 1, chr - _CHAR_CODE_UA + _CHAR_CODE_LA, false );
			}
		}
	},
	strUpr : function( array, index ){
		var chr;
		var dst = new Array( 1 );
		for( var i = 0; ; i++ ){
			if( (chr = array.val( index, i ).toFloat()) == 0 ){
				break;
			}
			if( (chr >= _CHAR_CODE_LA) && (chr <= _CHAR_CODE_LZ) ){
				dst[0] = i;
				array.set( index, dst, 1, chr - _CHAR_CODE_LA + _CHAR_CODE_UA, false );
			}
		}
	},
	_setError : function( code, token ){
		this._errCode = code;
		this._errToken = token;
	},
	_retError : function( err, code, token ){
		this._setError( code, token );
		return err;
	},
	_updateMatrix : function( param, value ){
		var i;
		if( (param._mode & 0x0010) != 0 ){
			for( i = 0; i < value._len; i++ ){
				value._mat[i].setImag( 0.0 );
			}
		} else if( (param._mode & 0x0100) != 0 ){
			if( this._printWarn && procWarnFlowFlag() ){
				var index = (param._mode & 0x000F);
				var minValue = _MIN_VALUE[index];
				var maxValue = _MAX_VALUE[index];
				var intValue;
				for( i = 0; i < value._len; i++ ){
					intValue = _INT( value._mat[i].toFloat() );
					if( (intValue < minValue) || (intValue > maxValue) ){
						this._errorProc( (intValue < minValue) ? 0x1002 : 0x1003, this._curLine._num, param, 8, "" + intValue );
					}
				}
			}
			switch( param._mode ){
			case 0x0100:
				for( i = 0; i < value._len; i++ ){
					value._mat[i].ass( _SIGNED( value._mat[i].toFloat(), 256, -128, 127 ) );
				}
				break;
			case 0x0101:
				for( i = 0; i < value._len; i++ ){
					value._mat[i].ass( _UNSIGNED( value._mat[i].toFloat(), 256 ) );
				}
				break;
			case 0x0102:
				for( i = 0; i < value._len; i++ ){
					value._mat[i].ass( _SIGNED( value._mat[i].toFloat(), 65536, -32768, 32767 ) );
				}
				break;
			case 0x0103:
				for( i = 0; i < value._len; i++ ){
					value._mat[i].ass( _UNSIGNED( value._mat[i].toFloat(), 65536 ) );
				}
				break;
			case 0x0104:
				for( i = 0; i < value._len; i++ ){
					value._mat[i].ass( _SIGNED( value._mat[i].toFloat(), 4294967296, -2147483648, 2147483647 ) );
				}
				break;
			case 0x0105:
				for( i = 0; i < value._len; i++ ){
					value._mat[i].ass( _UNSIGNED( value._mat[i].toFloat(), 4294967296 ) );
				}
				break;
			}
		}
	},
	_updateArrayNode : function( param, node ){
		var i;
		if( node._nodeNum > 0 ){
			for( i = 0; i < node._nodeNum; i++ ){
				this._updateArrayNode( param, node._node[i] );
			}
		}
		if( node._vectorNum > 0 ){
			if( (param._mode & 0x0010) != 0 ){
				for( i = 0; i < node._vectorNum; i++ ){
					node._vector[i].setImag( 0.0 );
				}
			} else if( (param._mode & 0x0100) != 0 ){
				if( this._printWarn && procWarnFlowFlag() ){
					var index = (param._mode & 0x000F);
					var minValue = _MIN_VALUE[index];
					var maxValue = _MAX_VALUE[index];
					var intValue;
					for( i = 0; i < node._vectorNum; i++ ){
						intValue = _INT( node._vector[i].toFloat() );
						if( (intValue < minValue) || (intValue > maxValue) ){
							this._errorProc( (intValue < minValue) ? 0x1002 : 0x1003, this._curLine._num, param, 8, "" + intValue );
						}
					}
				}
				switch( param._mode ){
				case 0x0100:
					for( i = 0; i < node._vectorNum; i++ ){
						node._vector[i].ass( _SIGNED( node._vector[i].toFloat(), 256, -128, 127 ) );
					}
					break;
				case 0x0101:
					for( i = 0; i < node._vectorNum; i++ ){
						node._vector[i].ass( _UNSIGNED( node._vector[i].toFloat(), 256 ) );
					}
					break;
				case 0x0102:
					for( i = 0; i < node._vectorNum; i++ ){
						node._vector[i].ass( _SIGNED( node._vector[i].toFloat(), 65536, -32768, 32767 ) );
					}
					break;
				case 0x0103:
					for( i = 0; i < node._vectorNum; i++ ){
						node._vector[i].ass( _UNSIGNED( node._vector[i].toFloat(), 65536 ) );
					}
					break;
				case 0x0104:
					for( i = 0; i < node._vectorNum; i++ ){
						node._vector[i].ass( _SIGNED( node._vector[i].toFloat(), 4294967296, -2147483648, 2147483647 ) );
					}
					break;
				case 0x0105:
					for( i = 0; i < node._vectorNum; i++ ){
						node._vector[i].ass( _UNSIGNED( node._vector[i].toFloat(), 4294967296 ) );
					}
					break;
				}
			}
		}
	},
	_updateArray : function( param, array, index ){
		this._updateArrayNode( param, array._node[index] );
		this._updateMatrix( param, array._mat[index] );
	},
	_updateValue : function( param, value ){
		if( (param._mode & 0x0010) != 0 ){
			value.setImag( 0.0 );
		} else if( (param._mode & 0x0100) != 0 ){
			if( this._printWarn && procWarnFlowFlag() ){
				var index = (param._mode & 0x000F);
				var minValue = _MIN_VALUE[index];
				var maxValue = _MAX_VALUE[index];
				var intValue = _INT( value.toFloat() );
				if( (intValue < minValue) || (intValue > maxValue) ){
					this._errorProc( (intValue < minValue) ? 0x1002 : 0x1003, this._curLine._num, param, 8, "" + intValue );
				}
			}
			switch( param._mode ){
			case 0x0100:
				value.ass( _SIGNED( value.toFloat(), 256, -128, 127 ) );
				break;
			case 0x0101:
				value.ass( _UNSIGNED( value.toFloat(), 256 ) );
				break;
			case 0x0102:
				value.ass( _SIGNED( value.toFloat(), 65536, -32768, 32767 ) );
				break;
			case 0x0103:
				value.ass( _UNSIGNED( value.toFloat(), 65536 ) );
				break;
			case 0x0104:
				value.ass( _SIGNED( value.toFloat(), 4294967296, -2147483648, 2147483647 ) );
				break;
			case 0x0105:
				value.ass( _UNSIGNED( value.toFloat(), 4294967296 ) );
				break;
			}
		}
	},
	_procInitArray : function( param ){
		var i;
		var flag;
		var code;
		var token;
		var ret = 0x00;
		var arrayList;
		var resizeList;
		var saveLine;
		var lock;
		var value = new _Matrix();
		flag = false;
		while( this._curLine._token.getToken() ){
			code = _get_code;
			token = _get_token;
			this._initArray.addCode( code, token );
			if( code == 16 ){
				this._initArrayCnt++;
				if( this._initArrayCnt > this._initArrayMax ){
					this._initArrayMax = this._initArrayCnt;
				}
			} else if( code == 17 ){
				if( this._initArrayCnt <= 0 ){
					ret = this._retError( 0x2102, code, token );
					flag = true;
					break;
				}
				this._initArrayCnt--;
				if( this._initArrayCnt <= 0 ){
					arrayList = new Array( this._initArrayMax + 1 );
					resizeList = new Array( 3 );
					resizeList[0] = 0;
					resizeList[1] = 0;
					resizeList[2] = -1;
					saveLine = this._curLine._token;
					this._curLine._token = this._initArray;
					i = 0;
					this._initArray.beginGetToken();
					while( true ){
						lock = this._initArray.lock();
						if( !(this._initArray.getToken()) ){
							break;
						}
						code = _get_code;
						token = _get_token;
						if( code == 16 ){
							this._initArrayCnt++;
							arrayList[this._initArrayCnt - 1] = 0;
							arrayList[this._initArrayCnt ] = -1;
						} else if( code == 17 ){
							this._initArrayCnt--;
							if( this._initArrayCnt > 0 ){
								arrayList[this._initArrayCnt - 1]++;
								arrayList[this._initArrayCnt ] = -1;
							}
						} else {
							this._initArray.unlock( lock );
							if( this._const( param, code, token, value ) == 0x00 ){
								if( this._initArrayCnt == 2 ){
									if( resizeList[0] < arrayList[0] ){
										resizeList[0] = arrayList[0];
									}
									if( resizeList[1] < arrayList[1] ){
										resizeList[1] = arrayList[1];
									}
								}
								param._array.resize(
									this._initArrayIndex,
									resizeList, arrayList, this._initArrayCnt,
									value._mat[0],
									this._initArrayMoveFlag._val
									);
								arrayList[this._initArrayCnt - 1]++;
							} else {
								ret = this._retError( 0x2102, code, token );
								flag = true;
								break;
							}
						}
						i++;
					}
					this._curLine._token = saveLine;
					arrayList = null;
					resizeList = null;
					flag = true;
					break;
				}
			}
		}
		if( flag ){
			this._initArrayFlag = false;
			this._initArray = null;
		}
		return (ret == 0x00) ? 0x03 : ret;
	},
	_getArrayInfo : function( param, code, token ){
		var lock;
		var value = new _Matrix();
		var index;
		this._curInfo._curArray = new Array( 16 );
		for( this._curInfo._curArraySize = 0; ; this._curInfo._curArraySize++ ){
			lock = this._curLine._token.lock();
			if( this._const( param, code, token, value ) != 0x00 ){
				this._curLine._token.unlock( lock );
				break;
			}
			index = _INT( value._mat[0].toFloat() ) - param._base;
			if( index < 0 ){
				this._errorProc( 0x1000, this._curLine._num, param, 14, null );
				this._curInfo._curArray[this._curInfo._curArraySize] = 0xFFFFFFFF;
			} else {
				this._curInfo._curArray[this._curInfo._curArraySize] = index;
			}
		}
		this._curInfo._curArray[this._curInfo._curArraySize] = -1;
	},
	_getParams : function( parentParam, code, token, funcParam ){
		var lock;
		var newCode;
		var newToken;
		var tmpValue = new _Matrix();
		while( true ){
			lock = this._curLine._token.lock();
			if( !(this._curLine._token.getTokenParam( parentParam )) ){
				break;
			}
			newCode = _get_code;
			newToken = _get_token;
			if(
				((newCode & (0x20 | 0x40)) != 0) ||
				(newCode == 7) ||
				(newCode == 19)
			){
				funcParam.addCode( newCode, newToken );
			} else {
				this._curLine._token.unlock( lock );
				if( this._const( parentParam, code, token, tmpValue ) == 0x00 ){
					if( tmpValue._len > 1 ){
						funcParam.addMatrix( tmpValue );
					} else {
						funcParam.addValue( tmpValue._mat[0] );
					}
				} else {
					this._curLine._token.unlock( lock );
					break;
				}
			}
		}
	},
	_formatError : function( format, funcName, error ){
		if( funcName == null ){
			error.set( format );
		} else {
			this._formatFuncName( format, funcName, error );
		}
	},
	_checkSkipLoop : function(){
		return (this._statMode == 2) && this._stat.checkBreak();
	},
	_checkSkipIf : function(){
		return ((this._statIfMode[this._statIfCnt] == 0) || (this._statIfMode[this._statIfCnt] == 2)) ? true : this._checkSkipLoop();
	},
	_checkSkipSwi : function(){
		return ((this._statSwiMode[this._statSwiCnt] == 0) || (this._statSwiMode[this._statSwiCnt] == 2)) ? true : this._checkSkipLoop();
	},
	_checkSkip : function(){
		return (
			((this._statIfMode [this._statIfCnt ] == 0 ) || (this._statIfMode [this._statIfCnt ] == 2 )) ||
			((this._statSwiMode[this._statSwiCnt] == 0) || (this._statSwiMode[this._statSwiCnt] == 2))
			) ? true : this._checkSkipLoop();
	},
	_processLoop : function( param ){
		var code;
		var token;
		this._curLine._token.beginGetToken();
		if( !(this._curLine._token.getTokenLock()) ){
			return 0x03;
		}
		code = _get_code;
		token = _get_token;
		switch( code ){
		case 10:
			if( !(param._enableStat) ){
				return 0x102;
			}
			this._setError( code, token );
			return _procSubLoop[token]( this );
		case 9:
			if( !(param._enableCommand) ){
				return 0x101;
			}
			break;
		case 22:
			param._seFlag = true;
			param._seToken = token;
			break;
		}
		return this._checkSkip() ? 0x03 : 0x00;
	},
	_constFirst : function( param, code, token, value ){
		var newCode;
		var newToken;
		if( !(this._curLine._token.getTokenParam( param )) ){
			return this._retError( 0x2106, code, token );
		}
		newCode = _get_code;
		newToken = _get_token;
		this._token.delToken( this._curInfo._assCode, this._curInfo._assToken );
		this._curInfo._assCode = newCode;
		this._curInfo._assToken = this._token.newToken( newCode, newToken );
		if( newCode == 0x21 ){
			return this._procVariableFirst( param, newToken, value );
		} else if( newCode == 0x44 ){
			return this._procArrayFirst( param, newToken, value );
		} else if( (newCode & 0x1F) < 14 ){
			return _procSub[newCode & 0x1F]( this, param, newCode, newToken, value );
		} else {
			return this._retError( 0x210A, newCode, newToken );
		}
	},
	_const : function( param, code, token, value ){
		var newCode;
		var newToken;
		if( !(this._curLine._token.getTokenParam( param )) ){
			return this._retError( 0x2106, code, token );
		}
		newCode = _get_code;
		newToken = _get_token;
		if( (newCode & 0x1F) < 14 ){
			return _procSub[newCode & 0x1F]( this, param, newCode, newToken, value );
		} else {
			return this._retError( 0x210A, newCode, newToken );
		}
	},
	_constSkip : function( code, token ){
		var subStep;
		var lock;
		subStep = 0;
		while( true ){
			lock = this._curLine._token.lock();
			if( this._curLine._token.getToken() ){
				switch( _get_code ){
				case 0:
					subStep++;
					break;
				case 15:
					subStep--;
					if( subStep < 0 ){
						this._curLine._token.unlock( lock );
						return 0x00;
					}
					break;
				case 11:
					if( subStep <= 0 ){
						this._curLine._token.unlock( lock );
						return 0x00;
					}
					break;
				}
			} else {
				break;
			}
		}
		return 0x00;
	},
	_constSkipConditional : function( code, token ){
		var subStep;
		subStep = 0;
		while( true ){
			if( this._curLine._token.getToken() ){
				switch( _get_code ){
				case 0:
					subStep++;
					break;
				case 15:
					subStep--;
					if( subStep < 0 ){
						return this._retError( 0x2106, code, token );
					}
					break;
				}
				if( subStep == 0 ){
					break;
				}
			} else {
				return this._retError( 0x2106, code, token );
			}
		}
		return 0x00;
	},
	_getString : function( param, string ){
		var code;
		var token;
		if( this._curLine._token.getTokenParam( param ) ){
			code = _get_code;
			token = _get_token;
			if( code == 19 ){
				string.set( token );
			} else if( (code & 0x40) != 0 ){
				if( code == 0x46 ){
					param = globalParam();
				}
				var arrayIndex = this.arrayIndexIndirect( param, code, token );
				string.set( this.strGet( param._array, arrayIndex ) );
			} else {
				string.set( null );
			}
		} else {
			string.set( null );
			return false;
		}
		return true;
	},
	_processOp : function( param, value ){
		var code;
		var token;
		if( !(this._curLine._token.getToken()) ){
			return this._retError( 0x2101, 14, null );
		}
		code = _get_code;
		token = _get_token;
		if( (code == 11) && (token >= 6) ){
			return _procSubOp[token]( this, param, code, token, value );
		} else {
			return this._retError( 0x2101, code, token );
		}
	},
	_regInc : function( flag, param, code, token ){
		switch( this._curInfo._assCode ){
		case 0x21:
			if( param._var.isLocked( this._curInfo._assToken ) ){
				return this._retError( 0x210E, code, token );
			}
			this._regIncSub( flag, this._curInfo._assCode, this._curInfo._assToken, null, 0 );
			break;
		case 0x23:
			param = globalParam();
		case 0x22:
			if( param._var.isLocked( this.autoVarIndex( param, this._curInfo._assToken ) ) ){
				return this._retError( 0x210E, code, token );
			}
			this._regIncSub( flag, this._curInfo._assCode, this._curInfo._assToken, null, 0 );
			break;
		case 0x44:
		case 0x45:
		case 0x46:
			if( this._curInfo._curArraySize == 0 ){
				return this._retError( 0x2104, code, token );
			} else {
				this._regIncSub( flag, this._curInfo._assCode, this._curInfo._assToken, this._curInfo._curArray, this._curInfo._curArraySize );
			}
			break;
		default:
			return this._retError( 0x2104, code, token );
		}
		return 0x00;
	},
	_regIncSub : function( flag, code, token, array, arraySize ){
		var tmpInc = new __Inc();
		if( this._topInc == null ){
			tmpInc._next = null;
			this._topInc = tmpInc;
			this._endInc = tmpInc;
		} else {
			tmpInc._next = null;
			this._endInc._next = tmpInc;
			this._endInc = tmpInc;
		}
		tmpInc._flag = flag;
		tmpInc._code = code;
		tmpInc._token = this._token.newToken( code, token );
		if( array == null ){
			tmpInc._array = null;
		} else {
			tmpInc._array = new Array( arraySize + 1 );
			for( var i = 0; i < arraySize; i++ ){
				tmpInc._array[i] = array[i];
			}
			tmpInc._array[arraySize] = -1;
			tmpInc._arraySize = arraySize;
		}
		return tmpInc;
	},
	_delInc : function(){
		var cur;
		var tmp;
		cur = this._topInc;
		while( cur != null ){
			tmp = cur;
			cur = cur._next;
			this._token.delToken( tmp._code, tmp._token );
			if( tmp._array != null ){
				tmp._array = null;
			}
		}
		this._topInc = null;
	},
	_processInc : function( param ){
		var cur;
		var index;
		var value = new _Value();
		cur = this._topInc;
		while( cur != null ){
			switch( cur._code ){
			case 0x21:
				index = cur._token;
				value.ass( param.val( index ) );
				this._updateValue( param, value );
				if( cur._flag ){
					value.addAndAss( 1.0 );
				} else {
					value.subAndAss( 1.0 );
				}
				param.setVal( index, value, true );
				break;
			case 0x22:
				index = this.autoVarIndex( param, cur._token );
				value.ass( param.val( index ) );
				this._updateValue( param, value );
				if( cur._flag ){
					value.addAndAss( 1.0 );
				} else {
					value.subAndAss( 1.0 );
				}
				param.setVal( index, value, false );
				break;
			case 0x23:
				index = this.autoVarIndex( globalParam(), cur._token );
				value.ass( globalParam().val( index ) );
				this._updateValue( globalParam(), value );
				if( cur._flag ){
					value.addAndAss( 1.0 );
				} else {
					value.subAndAss( 1.0 );
				}
				globalParam().setVal( index, value, false );
				break;
			case 0x44:
				index = cur._token;
				value.ass( param._array.val( index, cur._array, cur._arraySize ) );
				this._updateValue( param, value );
				if( cur._flag ){
					value.addAndAss( 1.0 );
				} else {
					value.subAndAss( 1.0 );
				}
				param._array.set( index, cur._array, cur._arraySize, value, true );
				break;
			case 0x45:
				index = this.autoArrayIndex( param, cur._token );
				value.ass( param._array.val( index, cur._array, cur._arraySize ) );
				this._updateValue( param, value );
				if( cur._flag ){
					value.addAndAss( 1.0 );
				} else {
					value.subAndAss( 1.0 );
				}
				param._array.set( index, cur._array, cur._arraySize, value, false );
				break;
			case 0x46:
				index = this.autoArrayIndex( globalParam(), cur._token );
				value.ass( globalParam()._array.val( index, cur._array, cur._arraySize ) );
				this._updateValue( globalParam(), value );
				if( cur._flag ){
					value.addAndAss( 1.0 );
				} else {
					value.subAndAss( 1.0 );
				}
				globalParam()._array.set( index, cur._array, cur._arraySize, value, false );
				break;
			}
			cur = cur._next;
		}
		this._delInc();
	},
	_processSub : function( param, value ){
		var ret = 0x00;
		var lock;
		var code;
		var token;
		var savInfo;
		var subInfo = new __ProcInfo();
		savInfo = this._curInfo;
		this._curInfo = subInfo;
		lock = this._curLine._token.lock();
		if( (ret = this._processOp( param, value )) != 0x00 ){
			this._curLine._token.unlock( lock );
			if( (ret = this._constFirst( param, 14, null, value )) != 0x00 ){
				this._curInfo = savInfo;
				this._token.delToken( subInfo._assCode, subInfo._assToken );
				subInfo._curArray = null;
				return ret;
			}
			var tmpValue1 = new _Matrix();
			lock = this._curLine._token.lock();
			if( this._const( param, 14, null, tmpValue1 ) != 0x00 ){
				this._curLine._token.unlock( lock );
			} else if( (param._mode & 0x0020) != 0 ){
				if( this._curLine._token.checkToken( 15 ) ){
					this._curLine._token.getToken();
					code = _get_code;
					token = _get_token;
					this._curInfo = savInfo;
					this._token.delToken( subInfo._assCode, subInfo._assToken );
					subInfo.curArray = null;
					return this._retError( 0x210C, code, token );
				} else {
					value._mat[0].setImag( tmpValue1._mat[0].real() );
					this._curLine._token.getToken();
					this._curInfo = savInfo;
					this._token.delToken( subInfo._assCode, subInfo._assToken );
					subInfo._curArray = null;
					return 0x00;
				}
			} else if( (param._mode & (0x0010 | 0x0040)) != 0 ){
				var tmpValue2 = new _Matrix();
				lock = this._curLine._token.lock();
				if( this._const( param, 14, null, tmpValue2 ) != 0x00 ){
					value.divAndAss( tmpValue1._mat[0].toFloat() );
					this._curLine._token.unlock( lock );
				} else if( this._curLine._token.checkToken( 15 ) ){
					this._curLine._token.getToken();
					code = _get_code;
					token = _get_token;
					this._curInfo = savInfo;
					this._token.delToken( subInfo._assCode, subInfo._assToken );
					subInfo._curArray = null;
					return this._retError( 0x210D, code, token );
				} else {
					tmpValue1.divAndAss( tmpValue2._mat[0].toFloat() );
					value.addAndAss( tmpValue1 );
					this._curLine._token.getToken();
					this._curInfo = savInfo;
					this._token.delToken( subInfo._assCode, subInfo._assToken );
					subInfo._curArray = null;
					return 0x00;
				}
			}
		}
		while( this._curLine._token.checkToken( 15 ) ){
			if( (ret = this._processOp( param, value )) != 0x00 ){
				this._curInfo = savInfo;
				this._token.delToken( subInfo._assCode, subInfo._assToken );
				subInfo._curArray = null;
				return ret;
			}
		}
		this._curLine._token.getToken();
		this._curInfo = savInfo;
		this._token.delToken( subInfo._assCode, subInfo._assToken );
		subInfo._curArray = null;
		return ret;
	},
	_processSe : function( param, value ){
		var ret;
		if( (ret = this._constFirst( param, 22, param._seToken, value )) != 0x00 ){
			return ret;
		}
		var saveArray = this._curInfo._curArray;
		var saveArraySize = this._curInfo._curArraySize;
		if( param._seToken < 69 ){
			ret = _procSubSe[param._seToken]( this, param, 22, param._seToken, value );
		} else {
			ret = this._procFuncSe( this, param, 12, param._seToken - 69, value );
		}
		if( ret == 0x00 ){
			if( this._curLine._token._get != null ){
				ret = this._retError( 0x2181, 22, param._seToken );
			} else {
				this._updateMatrix( param, value );
				ret = this._assVal( param, 22, param._seToken, saveArray, saveArraySize, value );
			}
		}
		saveArray = null;
		return ret;
	},
	_processFirst : function( param, ret ){
		if( this._curLine._token._top == null ){
			ret.set( 0x04 );
			return false;
		}
		if( this._topInc != null ){
			this._delInc();
		}
		if( procTraceFlag() ){
			printTrace( param, this._curLine._token, this._curLine._num, this._curLine._comment, this._checkSkip() );
		}
		return true;
	},
	_processNext : function( param, ret ){
		while( true ){
			if( ret.set( this._processLoop( param ) )._val != 0x00 ){
				break;
			}
			if( this._initArrayFlag ){
				this._curLine._token.beginGetToken();
				ret.set( this._procInitArray( param ) );
				break;
			}
			param._assFlag = false;
			param._subStep = 0;
			this._curLine._token.beginGetToken();
			if( param._seFlag ){
				this._curLine._token.skipToken();
				if( ret.set( this._processSe( param, this._matSeAns ) )._val != 0x00 ){
					break;
				}
			} else {
				this._matAns.ass( param._array._mat[0] );
				if( ret.set( this._processSub( param, this._matAns ) )._val != 0x00 ){
					break;
				}
				param._array.setMatrix( 0, this._matAns, true );
			}
			ret.set( 0x04 );
			break;
		}
		if( this._topInc != null ){
			this._processInc( param );
		}
		if( param._seFlag ){
			param._seFlag = false;
		} else {
			if( (this._curLine._next == null) && this._printAns && !(param._assFlag) ){
				if( ret._val == 0x04 ){
					this.printAns( param );
				}
			}
		}
	},
	_regProcess : function( line, err ){
		this._curLine = line;
		if( this._statMode == 1 ){
			err.set( this._stat.regLine( this._curLine ) );
			switch( err._val ){
			case 0x02:
				break;
			case 0x04:
				this._statMode = 2;
				break;
			default:
				this._statMode = 0;
				return false;
			}
		}
		return true;
	},
	_process : function( param, err ){
		switch( this._statMode ){
		case 0:
			if( this._processFirst( param, err ) ){
				this._processNext( param, err );
				if( ((err._val != 0x04) && (err._val != 0x03)) || this._quitFlag ){
					return false;
				}
			}
			break;
		case 2:
			var line;
			while( (line = this._stat.getLine()) != null ){
				this._curLine = line;
				if( this._processFirst( param, err ) ){
					this._processNext( param, err );
					if( ((err._val != 0x04) && (err._val != 0x03)) || this._quitFlag ){
						this._statMode = 0;
						return false;
					}
				}
			}
			this._statMode = 0;
			break;
		}
		return true;
	},
	beginProcess : function( line, param, err ){
		if( line instanceof _Line ){
			this._procLine = line.dup();
			err.set( 0x00 );
			this._procLine.beginGetLine();
			return true;
		}
		this._procLine = new _Line( param._lineNum );
		if( err.set( this._procLine.regString( param, line, this._statMode != 1 ) )._val == 0x00 ){
			this._procLine.beginGetLine();
			return true;
		}
		return false;
	},
	process : function( param, err ){
		var line;
		if( (line = this._procLine.getLine()) == null ){
			return false;
		}
		if( !this._regProcess( line, err ) ){
			return false;
		}
		if( !this._process( param, err ) ){
			return false;
		}
		if( err._val >= 0x100 ){
			if( this._quitFlag ){
				this._errorProc( err._val, this._curLine._num, param, this._errCode, this._errToken );
			} else if( err._val == 0x01 ){
			} else {
				this._errorProc( err._val, this._curLine._num, param, this._errCode, this._errToken );
			}
		}
		if( (this._statMode == 0) && (this._stat != null) ){
			this._stat = null;
		}
		return true;
	},
	termProcess : function( param, err ){
		var ret;
		if( this._quitFlag ){
			if( err._val >= 0x100 ){
				this._errorProc( err._val, this._curLine._num, param, this._errCode, this._errToken );
			}
			ret = 0x04;
		} else if( err._val == 0x01 ){
			ret = 0x01;
		} else {
			if( err._val >= 0x100 ){
				ret = this._errorProc( err._val, this._curLine._num, param, this._errCode, this._errToken ) ? 0x01 : 0x02;
			} else {
				ret = 0x02;
			}
		}
		if( (this._statMode == 0) && (this._stat != null) ){
			this._stat = null;
		}
		this._curLine = this._defLine;
		this._procLine = null;
		return ret;
	},
	resetLoopCount : function(){
		if( this._loopCnt > procLoopCount() ){
			setProcLoopCount( this._loopCnt );
		}
		this._loopCnt = 0;
	},
	processLoop : function( line, param ){
		this.resetLoopCount();
		var err = new _Integer();
		if( this.beginProcess( line, param, err ) ){
			while( this.process( param, err ) ){}
		}
		this.termProcess( param, err );
		return err._val;
	},
	beginTestProcess : function( line, param, err ){
		this._procLine = new _Line( param._lineNum );
		if( err.set( this._procLine.regString( param, line, false ) )._val == 0x00 ){
			this._procLine.beginGetLine();
			return true;
		}
		return false;
	},
	testProcess : function( param, err ){
		var line;
		if( (line = this._procLine.getLine()) == null ){
			return false;
		}
		printTest( param, line._token, line._num, line._comment );
		return true;
	},
	termTestProcess : function( param, err ){
		var ret;
		if( err._val >= 0x100 ){
			ret = this._errorProc( err._val, this._curLine._num, param, this._errCode, this._errToken ) ? 0x01 : 0x02;
		} else {
			ret = 0x02;
		}
		this._procLine = null;
		return ret;
	},
	testProcessLoop : function( line, param ){
		this.resetLoopCount();
		var err = new _Integer();
		if( this.beginTestProcess( line, param, err ) ){
			while( this.testProcess( param, err ) ){}
		}
		this.termTestProcess( param, err );
		return err._val;
	},
	getParam : function( funcParam, parentParam, childParam ){
		var code;
		var token;
		var index;
		var saveLine = this._curLine._token;
		this._curLine._token = funcParam;
		var i = _CHAR_CODE_0;
		var j = 0;
		funcParam.beginGetToken();
		while( funcParam.getTokenParam( parentParam ) ){
			code = _get_code;
			token = _get_token;
			if( j > 9 ){
				this._curLine._token = saveLine;
				return this._retError( 0x2161, code, token );
			}
			childParam._updateParamCode[j] = code;
			switch( code ){
			case 0x21:
				index = this.varIndexParam( parentParam, token );
				childParam._updateParamIndex[j] = index;
				childParam._var.set( i, parentParam.val( index ), true );
				this._updateValue( parentParam, childParam._var.val( i ) );
				break;
			case 0x22:
				index = this.autoVarIndex( parentParam, token );
				childParam._updateParamIndex[j] = index;
				childParam._var.set( i, parentParam.val( index ), true );
				this._updateValue( parentParam, childParam._var.val( i ) );
				break;
			case 0x23:
				index = this.autoVarIndex( globalParam(), token );
				childParam._updateParamIndex[j] = index;
				childParam._var.set( i, globalParam().val( index ), true );
				this._updateValue( globalParam(), childParam._var.val( i ) );
				break;
			case 0x44:
				index = this.arrayIndexParam( parentParam, token );
				childParam._updateParamIndex[j] = index;
				parentParam._array.dup( childParam._array, index, i, true );
				this._updateArray( parentParam, childParam._array, i );
				if( token == 0 ){
					childParam._var.set( i, parentParam.val( 0 ), true );
					this._updateValue( parentParam, childParam._var.val( i ) );
				}
				break;
			case 0x45:
				index = this.autoArrayIndex( parentParam, token );
				childParam._updateParamIndex[j] = index;
				parentParam._array.dup( childParam._array, index, i, true );
				this._updateArray( parentParam, childParam._array, i );
				break;
			case 0x46:
				index = this.autoArrayIndex( globalParam(), token );
				childParam._updateParamIndex[j] = index;
				globalParam()._array.dup( childParam._array, index, i, true );
				this._updateArray( globalParam(), childParam._array, i );
				break;
			case 19:
				this.strSet( childParam._array, i, token );
				break;
			case 7:
				childParam._var.set( i, token, true );
				this._updateValue( parentParam, childParam._var.val( i ) );
				break;
			case 18:
				childParam._array.setMatrix( i, token, true );
				this._updateMatrix( parentParam, childParam._array._mat[i] );
				break;
			default:
				this._curLine._token = saveLine;
				return this._retError( 0x2162, code, token );
			}
			i++;
			j++;
		}
		this._curLine._token = saveLine;
		childParam._var.set( _CHAR_CODE_EX, j, true );
		return 0x00;
	},
	updateParam : function( parentParam, childParam ){
		var i, j;
		var index;
		j = childParam._updateParamCode.length;
		for( i = 0; i < j; i++ ){
			if( childParam._updateParam[i] ){
				switch( childParam._updateParamCode[i] ){
				case 0x21:
					index = childParam._updateParamIndex[i];
					if( parentParam.setVal( index, childParam._var.val( i + _CHAR_CODE_0 ), true ) ){
						if( index == 0 ){
							this._updateMatrix( childParam, parentParam._array._mat[index] );
						} else {
							this._updateValue( childParam, parentParam._var.val( index ) );
						}
					}
					break;
				case 0x22:
					index = childParam._updateParamIndex[i];
					if( parentParam.setVal( index, childParam._var.val( i + _CHAR_CODE_0 ), false ) ){
						if( index == 0 ){
							this._updateMatrix( childParam, parentParam._array._mat[index] );
						} else {
							this._updateValue( childParam, parentParam._var.val( index ) );
						}
					}
					break;
				case 0x23:
					index = childParam._updateParamIndex[i];
					if( globalParam().setVal( index, childParam._var.val( i + _CHAR_CODE_0 ), false ) ){
						if( index == 0 ){
							this._updateMatrix( childParam, globalParam()._array._mat[index] );
						} else {
							this._updateValue( childParam, globalParam()._var.val( index ) );
						}
					}
					break;
				case 0x44:
					childParam._array.dup( parentParam._array, i + _CHAR_CODE_0, childParam._updateParamIndex[i], true );
					break;
				case 0x45:
					childParam._array.dup( parentParam._array, i + _CHAR_CODE_0, childParam._updateParamIndex[i], false );
					break;
				case 0x46:
					childParam._array.dup( globalParam()._array, i + _CHAR_CODE_0, childParam._updateParamIndex[i], false );
					break;
				}
			}
		}
		return 0x00;
	},
	updateParent : function( parentParam, childParam ){
		var i, j;
		var index;
		j = childParam._updateParentVar.length;
		for( i = 0; i < j; i++ ){
			index = childParam._updateParentVar[i];
			parentParam.setVal( index, childParam._var.val( index ), true );
			if( index == 0 ){
				this._updateMatrix( childParam, parentParam._array._mat[index] );
			} else {
				this._updateValue( childParam, parentParam._var.val( index ) );
			}
		}
		j = childParam._updateParentArray.length;
		for( i = 0; i < j; i++ ){
			index = childParam._updateParentArray[i];
			childParam._array.dup( parentParam._array, index, index, true );
		}
	},
	updateAns : function( childParam ){
		if( this._angUpdateFlag && (complexAngType() != this._parentAngType) ){
			this._value.ass( childParam._array._mat[0]._mat[0] );
			this._value.angToAng( this._angType, this._parentAngType );
			childParam._array.setMatrix( 0, this._value, true );
		}
	},
	getExtFuncData : function( func , nameSpace ){
		var saveFunc = new String();
		saveFunc = func.str();
		var data = getExtFuncDataDirect( saveFunc );
		if( data != null ){
			return data;
		}
		if( saveFunc.startsWith( ":" ) ){
			func.set( saveFunc.slice( 1 ) );
		} else if( (nameSpace != null) && (saveFunc.indexOf( ":" ) < 0) ){
			func.set( nameSpace + ":" + saveFunc );
		}
		return getExtFuncDataNameSpace( func.str() );
	},
	newFuncCache : function( func, childParam, nameSpace ){
		var curFunc;
		if( procFunc()._max == 0 ){
			return null;
		}
		var func2 = new _String( func );
		var fileData = this.getExtFuncData( func2, nameSpace );
		if( fileData == null ){
			return null;
		}
		curFunc = procFunc().create( func2.str() );
		for( var i = 0; i < fileData.length; i++ ){
			if( curFunc._line.regString( childParam, fileData[i], false ) == 0x100D ){
				errorProc( 0x100D, curFunc._line._nextNum - 1, func, "" );
			}
		}
		return curFunc;
	},
	_beginMain : function( func, childParam, step , err , ret , funcParam, parentParam ){
		if( parentParam != null ){
			parentParam.updateMode();
			parentParam.updateFps ();
			childParam._parent = parentParam;
		}
		childParam._fileFlag = false;
		childParam._fileData = null;
		if( funcParam != null ){
			if( err.set( this.getParam( funcParam, parentParam, childParam ) )._val != 0x00 ){
				this._errorProc( err._val, 0, childParam, this._errCode, this._errToken );
				ret.set( 0x01 );
				return false;
			}
		}
		childParam.updateMode();
		childParam.updateFps ();
		var func2 = new _String( func );
		childParam._fileData = this.getExtFuncData( func2, (parentParam == null) ? null : parentParam._nameSpace );
		childParam._fileDataGet = 0;
		if( childParam._fileData == null ){
			this._errorProc( 0x2160, 0, childParam, 13, func );
			ret.set( 0x01 );
			return false;
		}
		childParam._fileFlag = true;
		childParam._fileLine = null;
		childParam.setFunc( func2.str(), 0 );
		childParam._lineNum = 1;
		step.set( 0 );
		return true;
	},
	_beginMainCache : function( func, childParam, step , err , ret , funcParam, parentParam ){
		if( parentParam != null ){
			parentParam.updateMode();
			parentParam.updateFps ();
			childParam._parent = parentParam;
		}
		childParam._fileFlag = true;
		childParam._fileData = null;
		childParam._fileLine = func._line;
		if( funcParam != null ){
			if( err.set( this.getParam( funcParam, parentParam, childParam ) )._val != 0x00 ){
				this._errorProc( err._val, 0, childParam, this._errCode, this._errToken );
				ret.set( 0x01 );
				return false;
			}
		}
		childParam.updateMode();
		childParam.updateFps ();
		childParam.setFunc( func._info._name, func._topNum );
		childParam._lineNum = 1;
		step.set( 0 );
		return true;
	},
	_termMain : function( func, childParam, parentParam ){
		if( childParam._fileFlag ){
			childParam._fileData = null;
			if( parentParam != null ){
				this.updateParam( parentParam, childParam );
				this.updateParent( parentParam, childParam );
			}
		}
		this.updateAns( childParam );
		if( parentParam != null ){
			parentParam.updateMode();
			parentParam.updateFps ();
		}
	},
	_termMainCache : function( func, childParam, parentParam ){
		if( parentParam != null ){
			this.updateParam( parentParam, childParam );
			this.updateParent( parentParam, childParam );
		}
		this.updateAns( childParam );
		if( parentParam != null ){
			parentParam.updateMode();
			parentParam.updateFps ();
		}
	},
	beginMain : function( func, childParam, step , err , ret , funcParam, parentParam ){
		if( func instanceof __Func ){
			return this._beginMainCache( func, childParam, step, err, ret, funcParam, parentParam );
		}
		return this._beginMain( func, childParam, step, err, ret, funcParam, parentParam );
	},
	main : function( func, childParam, step , err , ret ){
		if( func instanceof __Func ){
			return _procMainCache[step._val]( this, func, childParam, step, err, ret );
		}
		return _procMain[step._val]( this, func, childParam, step, err, ret );
	},
	termMain : function( func, childParam, parentParam ){
		if( func instanceof __Func ){
			this._termMainCache( func, childParam, parentParam );
		} else {
			this._termMain( func, childParam, parentParam );
		}
	},
	getFuncName : function( func ){
		if( func instanceof __Func ){
			return func._info._name;
		}
		return func;
	},
	printAns : function( childParam ){
		if( childParam._array._mat[0]._len > 1 ){
			printAnsMatrix( childParam, childParam._array.makeToken( new _Token(), 0 ) );
		} else {
			var real = new _String();
			var imag = new _String();
			this._token.valueToString( childParam, childParam.val( 0 ), real, imag );
			printAnsComplex( real.str(), imag.str() );
		}
	},
	initInternalProc : function( childProc, func, childParam, parentParam ){
		if( parentParam != null ){
			parentParam.dupDefine( childParam );
			childParam._func.openAll( parentParam._func );
			childParam.setDefNameSpace( parentParam._defNameSpace );
		}
		childParam.setLabel( func._label );
	},
	mainLoop : function( func, childParam, funcParam, parentParam ){
		this.resetLoopCount();
		var step = new _Integer();
		var err = new _Integer();
		var ret = new _Integer();
		if( this.beginMain( func, childParam, step, err, ret, funcParam, parentParam ) ){
			while( this.main( func, childParam, step, err, ret ) ){}
		}
		this.termMain( func, childParam, parentParam );
		return ret._val;
	},
	beginTest : function( func, childParam, step , err , ret ){
		return this._beginMain( func, childParam, step, err, ret, null, null );
	},
	test : function( func, childParam, step , err , ret ){
		return _procTest[step._val]( this, func, childParam, step, err, ret );
	},
	termTest : function( func, childParam ){
		this._termMain( func, childParam, null );
	},
	testLoop : function( func, childParam ){
		this.resetLoopCount();
		var step = new _Integer();
		var err = new _Integer();
		var ret = new _Integer();
		if( this.beginTest( func, childParam, step, err, ret ) ){
			while( this.test( func, childParam, step, err, ret ) ){}
		}
		this.termTest( func, childParam );
		return ret._val;
	},
	_firstChar : function( line ){
		var i = 0;
		if( i < line.length ){
			while( isCharSpace( line, i ) || (line.charAt( i ) == '\t') ){
				i++;
				if( i >= line.length ){
					break;
				}
			}
		}
		return i;
	},
	_formatFuncName : function( format, funcName, usage ){
		var i;
		var cur = 0;
		while( true ){
			if( (cur >= format.length) || isCharEnter( format, cur ) ){
				break;
			} else if( isCharEscape( format, cur ) ){
				cur++;
				if( (cur >= format.length) || isCharEnter( format, cur ) ){
					break;
				}
				usage.add( format.charAt( cur ) );
			} else if( format.charAt( cur ) == '-' ){
				for( i = 0; i < funcName.length; i++ ){
					usage.add( funcName.charAt( i ) );
				}
			} else {
				usage.add( format.charAt( cur ) );
			}
			cur++;
		}
	},
	_addUsage : function( format, funcName ){
		var usage = new _String();
		var tmpUsage;
		this._formatFuncName( format, funcName, usage );
		if( this._topUsage == null ){
			this._topUsage = new __ProcUsage();
			this._curUsage = this._topUsage;
		} else {
			tmpUsage = new __ProcUsage();
			this._curUsage._next = tmpUsage;
			this._curUsage = tmpUsage;
		}
		this._curUsage._string = new String();
		this._curUsage._string = usage.str();
	},
	usage : function( func, childParam, cacheFlag ){
		var curFunc;
		if( (curFunc = procFunc().search( func, false, null )) == null ){
			if( cacheFlag ){
				curFunc = this.newFuncCache( func, childParam, null );
			}
		}
		this._topUsage = null;
		if( curFunc != null ){
			var line;
			curFunc._line.beginGetLine();
			while( (line = curFunc._line.getLine()) != null ){
				if( (line._token.count() == 0) && (line._comment != null) ){
					if( line._comment.charAt( 0 ) != '!' ){
						this._addUsage( line._comment, func );
					}
				} else {
					break;
				}
			}
		} else {
			var cur;
			var func2 = new _String( func );
			var fileData = this.getExtFuncData( func2, null );
			if( fileData == null ){
				this._errorProc( 0x2160, 0, childParam, 13, func );
				return;
			}
			for( var i = 0; i < fileData.length; i++ ){
				var string = fileData[i];
				cur = this._firstChar( string );
				if( (cur < string.length) && (string.charAt( cur ) == '#') ){
					cur++;
					if( (cur < string.length) && (string.charAt( cur ) == '!') ){
					} else if( cur >= string.length ){
						this._addUsage( "", func );
					} else {
						this._addUsage( string.slice( cur ), func );
					}
				} else {
					break;
				}
			}
		}
		doCommandUsage( this._topUsage );
		var tmpUsage;
		this._curUsage = this._topUsage;
		while( this._curUsage != null ){
			tmpUsage = this._curUsage;
			this._curUsage = this._curUsage._next;
			if( tmpUsage._string != null ){
				tmpUsage._string = null;
			}
		}
	},
	getAns : function( childParam, value, parentParam ){
		if( childParam._printAns ){
			value.ass( childParam._array._mat[0] );
			if( parentParam != null ){
				this._updateMatrix( parentParam, value );
			}
		} else {
			if( parentParam != null ){
				if( parentParam._subStep == 0 ){
					parentParam._assFlag = true;
				}
			}
		}
	},
	_assertProc : function( num, param ){
		return assertProc(
			param._fileFlag ? ((param._topNum > 0) ? num - param._topNum + 1 : num) : 0,
			(param._funcName == null) ? "" : param._funcName
			);
	},
	_errorProc : function( err, num, param, code, token ){
		if( (err & 0x1000) != 0 ){
			if( !this._printWarn ){
				return false;
			}
			errorProc(
				err,
				param._fileFlag ? ((param._topNum > 0) ? num - param._topNum + 1 : num) : 0,
				(param._funcName == null) ? "" : param._funcName,
				this._token.tokenString( param, code, token )
				);
		} else if( (err & 0x2100) != 0 ){
			errorProc(
				err,
				param._fileFlag ? ((param._topNum > 0) ? num - param._topNum + 1 : num) : 0,
				(param._funcName == null) ? "" : param._funcName,
				this._token.tokenString( param, code, token )
				);
		} else if( err >= 0x100 ){
			errorProc(
				err,
				param._fileFlag ? ((param._topNum > 0) ? num - param._topNum + 1 : num) : 0,
				(param._funcName == null) ? "" : param._funcName,
				""
				);
		}
		return (((err & 0x2000) != 0) && param._fileFlag);
	},
	doCommandPlot : function( childProc, childParam, graph, start, end, step ){
		childProc.setAngType( this._angType, false );
		switch( graph.mode() ){
		case 0:
			childParam._var._label.setLabel( _CHAR( 'x' ), "x", true );
			graph.setIndex( _CHAR( 'x' ) );
			break;
		case 1:
		case 2:
			childParam._var._label.setLabel( _CHAR( 't' ), "t", true );
			graph.setIndex( _CHAR( 't' ) );
			break;
		}
		graph.setStart( start );
		graph.setEnd ( end );
		graph.setStep ( step );
		onStartPlot();
		graph.plot( childProc, childParam );
		onEndPlot();
	},
	doCommandRePlot : function( childProc, childParam, graph, start, end, step ){
		childProc.setAngType( this._angType, false );
		switch( graph.mode() ){
		case 0:
			childParam._var._label.setLabel( _CHAR( 'x' ), "x", true );
			graph.setIndex( _CHAR( 'x' ) );
			break;
		case 1:
		case 2:
			childParam._var._label.setLabel( _CHAR( 't' ), "t", true );
			graph.setIndex( _CHAR( 't' ) );
			break;
		}
		graph.setStart( start );
		graph.setEnd ( end );
		graph.setStep ( step );
		onStartRePlot();
		graph.rePlot( childProc, childParam );
		onEndRePlot();
	},
	_getSeOperand : function( param, code, token, value ){
		if( this._curLine._token.skipComma() ){
			return this._const( param, code, token, value );
		}
		return this._retError( 0x2181, code, token );
	},
	_skipSeOperand : function( code, token ){
		if( this._curLine._token.skipComma() ){
			return this._constSkip( code, token );
		}
		return this._retError( 0x2181, code, token );
	},
	_seNull : function( _this, param, code, token, value ){
		return 0x2180;
	},
	_seIncrement : function( _this, param, code, token, value ){
		value.addAndAss( 1.0 );
		return 0x00;
	},
	_seDecrement : function( _this, param, code, token, value ){
		value.subAndAss( 1.0 );
		return 0x00;
	},
	_seNegative : function( _this, param, code, token, value ){
		value.ass( value.minus() );
		return 0x00;
	},
	_seComplement : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( ~_INT( tmpValue._mat[0].toFloat() ) );
		return 0x00;
	},
	_seNot : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( (_INT( tmpValue._mat[0].toFloat() ) == 0) ? 1 : 0 );
		return 0x00;
	},
	_seMinus : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue.minus() );
		return 0x00;
	},
	_seSet : function( _this, param, code, token, value ){
		var ret;
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		return 0x00;
	},
	_seSetC : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value._mat[0].setImag( tmpValue._mat[0].real() );
		return 0x00;
	},
	_seSetF : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.divAndAss( tmpValue._mat[0].toFloat() );
		return 0x00;
	},
	_seSetM : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = newMatrixArray( 2 );
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue[0] )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != 0x00 ){
			return ret;
		}
		tmpValue[0].divAndAss( tmpValue[1]._mat[0].toFloat() );
		value.addAndAss( tmpValue[0] );
		return 0x00;
	},
	_seMul : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.mulAndAss( tmpValue );
		return 0x00;
	},
	_seDiv : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		if( _this._printWarn && tmpValue.equal( 0.0 ) ){
			_this._errorProc( 0x1001, _this._curLine._num, param, 14, null );
		}
		value.divAndAss( tmpValue );
		return 0x00;
	},
	_seMod : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		if( _this._printWarn && tmpValue.equal( 0.0 ) ){
			_this._errorProc( 0x1001, _this._curLine._num, param, 14, null );
		}
		value.modAndAss( tmpValue );
		return 0x00;
	},
	_seAdd : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.addAndAss( tmpValue );
		return 0x00;
	},
	_seAddS : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = newMatrixArray( 3 );
		if( (ret = _this._getSeOperand( param, code, token, tmpValue[0] )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue[2] )) != 0x00 ){
			return ret;
		}
		var a = value._mat[0].toFloat() + tmpValue[0]._mat[0].toFloat();
		var b = tmpValue[1]._mat[0].toFloat();
		var c = tmpValue[2]._mat[0].toFloat();
		if( a < b ) a = b;
		if( a > c ) a = c;
		value.ass( a );
		return 0x00;
	},
	_seSub : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.subAndAss( tmpValue );
		return 0x00;
	},
	_seSubS : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = newMatrixArray( 3 );
		if( (ret = _this._getSeOperand( param, code, token, tmpValue[0] )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue[2] )) != 0x00 ){
			return ret;
		}
		var a = value._mat[0].toFloat() - tmpValue[0]._mat[0].toFloat();
		var b = tmpValue[1]._mat[0].toFloat();
		var c = tmpValue[2]._mat[0].toFloat();
		if( a < b ) a = b;
		if( a > c ) a = c;
		value.ass( a );
		return 0x00;
	},
	_sePow : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( value._mat[0].pow( tmpValue._mat[0] ) );
		return 0x00;
	},
	_seShiftL : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( _SHIFTL( _INT( value._mat[0].toFloat() ), _INT( tmpValue._mat[0].toFloat() ) ) );
		return 0x00;
	},
	_seShiftR : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( _SHIFTR( _INT( value._mat[0].toFloat() ), _INT( tmpValue._mat[0].toFloat() ) ) );
		return 0x00;
	},
	_seAND : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( _AND( _INT( value._mat[0].toFloat() ), _INT( tmpValue._mat[0].toFloat() ) ) );
		return 0x00;
	},
	_seOR : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( _OR( _INT( value._mat[0].toFloat() ), _INT( tmpValue._mat[0].toFloat() ) ) );
		return 0x00;
	},
	_seXOR : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( _XOR( _INT( value._mat[0].toFloat() ), _INT( tmpValue._mat[0].toFloat() ) ) );
		return 0x00;
	},
	_seLess : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( (value._mat[0].toFloat() < tmpValue._mat[0].toFloat()) ? 1 : 0 );
		return 0x00;
	},
	_seLessOrEq : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( (value._mat[0].toFloat() <= tmpValue._mat[0].toFloat()) ? 1 : 0 );
		return 0x00;
	},
	_seGreat : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( (value._mat[0].toFloat() > tmpValue._mat[0].toFloat()) ? 1 : 0 );
		return 0x00;
	},
	_seGreatOrEq : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( (value._mat[0].toFloat() >= tmpValue._mat[0].toFloat()) ? 1 : 0 );
		return 0x00;
	},
	_seEqual : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( value.equal( tmpValue ) ? 1 : 0 );
		return 0x00;
	},
	_seNotEqual : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( value.notEqual( tmpValue ) ? 1 : 0 );
		return 0x00;
	},
	_seLogAND : function( _this, param, code, token, value ){
		var ret;
		if( value.notEqual( 0.0 ) ){
			var tmpValue = new _Matrix();
			if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
				return ret;
			}
			value.ass( tmpValue.notEqual( 0.0 ) ? 1 : 0 );
		} else {
			if( (ret = _this._skipSeOperand( code, token )) != 0x00 ){
				return ret;
			}
			value.ass( 0 );
		}
		return 0x00;
	},
	_seLogOR : function( _this, param, code, token, value ){
		var ret;
		if( value.notEqual( 0.0 ) ){
			if( (ret = _this._skipSeOperand( code, token )) != 0x00 ){
				return ret;
			}
			value.ass( 1 );
		} else {
			var tmpValue = new _Matrix();
			if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
				return ret;
			}
			value.ass( tmpValue.notEqual( 0.0 ) ? 1 : 0 );
		}
		return 0x00;
	},
	_seMulAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.mulAndAss( tmpValue );
		return 0x00;
	},
	_seDivAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		if( _this._printWarn && tmpValue.equal( 0.0 ) ){
			_this._errorProc( 0x1001, _this._curLine._num, param, 14, null );
		}
		value.divAndAss( tmpValue );
		return 0x00;
	},
	_seModAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		if( _this._printWarn && tmpValue.equal( 0.0 ) ){
			_this._errorProc( 0x1001, _this._curLine._num, param, 14, null );
		}
		value.modAndAss( tmpValue );
		return 0x00;
	},
	_seAddAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.addAndAss( tmpValue );
		return 0x00;
	},
	_seAddSAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = newMatrixArray( 3 );
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue[0] )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue[2] )) != 0x00 ){
			return ret;
		}
		var a = value._mat[0].toFloat() + tmpValue[0]._mat[0].toFloat();
		var b = tmpValue[1]._mat[0].toFloat();
		var c = tmpValue[2]._mat[0].toFloat();
		if( a < b ) a = b;
		if( a > c ) a = c;
		value.ass( a );
		return 0x00;
	},
	_seSubAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.subAndAss( tmpValue );
		return 0x00;
	},
	_seSubSAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = newMatrixArray( 3 );
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue[0] )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue[2] )) != 0x00 ){
			return ret;
		}
		var a = value._mat[0].toFloat() - tmpValue[0]._mat[0].toFloat();
		var b = tmpValue[1]._mat[0].toFloat();
		var c = tmpValue[2]._mat[0].toFloat();
		if( a < b ) a = b;
		if( a > c ) a = c;
		value.ass( a );
		return 0x00;
	},
	_sePowAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( value._mat[0].pow( tmpValue._mat[0] ) );
		return 0x00;
	},
	_seShiftLAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( _SHIFTL( _INT( value._mat[0].toFloat() ), _INT( tmpValue._mat[0].toFloat() ) ) );
		return 0x00;
	},
	_seShiftRAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( _SHIFTR( _INT( value._mat[0].toFloat() ), _INT( tmpValue._mat[0].toFloat() ) ) );
		return 0x00;
	},
	_seANDAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( _AND( _INT( value._mat[0].toFloat() ), _INT( tmpValue._mat[0].toFloat() ) ) );
		return 0x00;
	},
	_seORAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( _OR( _INT( value._mat[0].toFloat() ), _INT( tmpValue._mat[0].toFloat() ) ) );
		return 0x00;
	},
	_seXORAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( _XOR( _INT( value._mat[0].toFloat() ), _INT( tmpValue._mat[0].toFloat() ) ) );
		return 0x00;
	},
	_seLessAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( (value._mat[0].toFloat() < tmpValue._mat[0].toFloat()) ? 1 : 0 );
		return 0x00;
	},
	_seLessOrEqAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( (value._mat[0].toFloat() <= tmpValue._mat[0].toFloat()) ? 1 : 0 );
		return 0x00;
	},
	_seGreatAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( (value._mat[0].toFloat() > tmpValue._mat[0].toFloat()) ? 1 : 0 );
		return 0x00;
	},
	_seGreatOrEqAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( (value._mat[0].toFloat() >= tmpValue._mat[0].toFloat()) ? 1 : 0 );
		return 0x00;
	},
	_seEqualAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( value.equal( tmpValue ) ? 1 : 0 );
		return 0x00;
	},
	_seNotEqualAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
			return ret;
		}
		value.ass( value.notEqual( tmpValue ) ? 1 : 0 );
		return 0x00;
	},
	_seLogANDAndAss : function( _this, param, code, token, value ){
		var ret;
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( value.notEqual( 0.0 ) ){
			var tmpValue = new _Matrix();
			if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
				return ret;
			}
			value.ass( tmpValue.notEqual( 0.0 ) ? 1 : 0 );
		} else {
			if( (ret = _this._skipSeOperand( code, token )) != 0x00 ){
				return ret;
			}
			value.ass( 0 );
		}
		return 0x00;
	},
	_seLogORAndAss : function( _this, param, code, token, value ){
		var ret;
		if( (ret = _this._getSeOperand( param, code, token, value )) != 0x00 ){
			return ret;
		}
		if( value.notEqual( 0.0 ) ){
			if( (ret = _this._skipSeOperand( code, token )) != 0x00 ){
				return ret;
			}
			value.ass( 1 );
		} else {
			var tmpValue = new _Matrix();
			if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
				return ret;
			}
			value.ass( tmpValue.notEqual( 0.0 ) ? 1 : 0 );
		}
		return 0x00;
	},
	_seConditional : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) == 0x00 ){
			if( tmpValue.notEqual( 0.0 ) ){
				if( (ret = _this._getSeOperand( param, code, token, value )) == 0x00 ){
					ret = _this._skipSeOperand( code, token );
				}
			} else {
				if( (ret = _this._skipSeOperand( code, token )) == 0x00 ){
					ret = _this._getSeOperand( param, code, token, value );
				}
			}
		}
		return ret;
	},
	_seSetFALSE : function( _this, param, code, token, value ){
		value.ass( 0 );
		return 0x00;
	},
	_seSetTRUE : function( _this, param, code, token, value ){
		value.ass( 1 );
		return 0x00;
	},
	_seSetZero : function( _this, param, code, token, value ){
		value.ass( 0.0 );
		return 0x00;
	},
	_getFuncParam : function( param, code, token, value , seFlag ){
		var ret;
		if( seFlag ){
			if( !(this._curLine._token.skipComma()) ){
				return this._retError( 0x2181, code, token );
			}
		}
		ret = this._const( param, code, token, value );
		if( ret == 0x2106 ){
			return this._retError( 0x2103, code, token );
		}
		return ret;
	},
	_getFuncParamIndex : function( param, code, token, index , moveFlag , seFlag ){
		var newToken;
		if( seFlag ){
			if( !(this._curLine._token.skipComma()) ){
				return this._retError( 0x2181, code, token );
			}
		}
		if( !(this._curLine._token.getTokenParam( param )) ){
			return this._retError( 0x2103, code, token );
		}
		newToken = _get_token;
		switch( _get_code ){
		case 0x21:
			index.set( param, this.varIndexParam( param, newToken ) );
			moveFlag.set( true );
			break;
		case 0x23:
			param = globalParam();
		case 0x22:
			index.set( param, this.autoVarIndex( param, newToken ) );
			moveFlag.set( false );
			break;
		default:
			return this._retError( 0x2103, code, token );
		}
		return 0x00;
	},
	_getFuncParamMatrix : function( param, code, token, moveFlag , seFlag ){
		var lock;
		var newCode;
		var newToken;
		var index;
		lock = this._curLine._token.lock();
		if( seFlag ){
			if( !(this._curLine._token.skipComma()) ){
				this._curLine._token.unlock( lock );
				return null;
			}
		}
		if( this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			switch( newCode ){
			case 0x46:
				param = globalParam();
			case 0x44:
			case 0x45:
				index = this.arrayIndexIndirectMove( param, newCode, newToken, moveFlag );
				break;
			case 8:
			case 0x23:
				index = param._array._label.checkLabel( newToken );
				moveFlag.set( false );
				break;
			default:
				index = -1;
				break;
			}
		} else {
			index = -1;
		}
		if( index < 0 ){
			this._curLine._token.unlock( lock );
			return null;
		}
		return param._array._mat[index];
	},
	_funcDefined : function( _this, param, code, token, value, seFlag ){
		var newCode;
		if( seFlag ){
			if( !(_this._curLine._token.skipComma()) ){
				return _this._retError( 0x2181, code, token );
			}
		}
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			value.ass( ((newCode == 8) || (newCode == 0x23) || (newCode == 0x46)) ? 0.0 : 1.0 );
			return 0x00;
		}
		return _this._retError( 0x2103, code, token );
	},
	_funcIndexOf : function( _this, param, code, token, value, seFlag ){
		var newToken;
		if( seFlag ){
			if( !(_this._curLine._token.skipComma()) ){
				return _this._retError( 0x2181, code, token );
			}
		}
		if( _this._curLine._token.getTokenParam( param ) ){
			newToken = _get_token;
			switch( _get_code ){
			case 0x22:
				value.ass( _this.autoVarIndex( param, newToken ) );
				return 0x00;
			case 0x45:
				value.ass( _this.autoArrayIndex( param, newToken ) );
				return 0x00;
			case 0x23:
			case 0x46:
				break;
			}
		}
		return _this._retError( 0x2103, code, token );
	},
	_funcIsInf : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( _ISINF( tmpValue._mat[0].toFloat() ) ? 1.0 : 0.0 );
		return 0x00;
	},
	_funcIsNaN : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( _ISNAN( tmpValue._mat[0].toFloat() ) ? 1.0 : 0.0 );
		return 0x00;
	},
	_funcRand : function( _this, param, code, token, value, seFlag ){
		value.ass( rand() );
		return 0x00;
	},
	_funcTime : function( _this, param, code, token, value, seFlag ){
		value.ass( (new Date()).getTime() / 1000.0 );
		return 0x00;
	},
	_funcMkTime : function( _this, param, code, token, value, seFlag ){
		var i;
		var format = new _String();
		var errFlag;
		var tmpValue = new _Matrix();
		if( seFlag ){
			if( !(_this._curLine._token.skipComma()) ){
				return _this._retError( 0x2181, code, token );
			}
		}
		_this._getString( param, format );
		if( format.isNull() ){
			return _this._retError( 0x210B, code, token );
		}
		var t = time();
		var tm = localtime( t );
		errFlag = false;
		for( i = 0; i < format.str().length; i++ ){
			if( format.str().charAt( i ) == '%' ){
				i++;
				if( i >= format.str().length ){
					errFlag = true;
					break;
				}
				if( _this._getFuncParam( param, code, token, tmpValue, seFlag ) != 0x00 ){
					errFlag = true;
					break;
				}
				switch( format.str().charAt( i ) ){
				case 's': tm._sec = _INT( tmpValue._mat[0].toFloat() ); break;
				case 'm': tm._min = _INT( tmpValue._mat[0].toFloat() ); break;
				case 'h': tm._hour = _INT( tmpValue._mat[0].toFloat() ); break;
				case 'D': tm._mday = _INT( tmpValue._mat[0].toFloat() ); break;
				case 'M': tm._mon = _INT( tmpValue._mat[0].toFloat() ); break;
				case 'Y': tm._year = _INT( tmpValue._mat[0].toFloat() ); break;
				case 'w': tm._wday = _INT( tmpValue._mat[0].toFloat() ); break;
				case 'y': tm._yday = _INT( tmpValue._mat[0].toFloat() ); break;
				default:
					errFlag = true;
					break;
				}
				if( errFlag ){
					break;
				}
			}
		}
		format = null;
		if( errFlag ){
			return _this._retError( 0x2103, code, token );
		}
		value.ass( mktime( tm ) );
		return 0x00;
	},
	_funcTmSec : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.ass( localtime( t )._sec );
		return 0x00;
	},
	_funcTmMin : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.ass( localtime( t )._min );
		return 0x00;
	},
	_funcTmHour : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.ass( localtime( t )._hour );
		return 0x00;
	},
	_funcTmMDay : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.ass( localtime( t )._mday );
		return 0x00;
	},
	_funcTmMon : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.ass( localtime( t )._mon );
		return 0x00;
	},
	_funcTmYear : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.ass( localtime( t )._year );
		return 0x00;
	},
	_funcTmWDay : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.ass( localtime( t )._wday );
		return 0x00;
	},
	_funcTmYDay : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.ass( localtime( t )._yday );
		return 0x00;
	},
	_funcTmXMon : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.ass( localtime( t )._mon + 1 );
		return 0x00;
	},
	_funcTmXYear : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.ass( 1900 + localtime( t )._year );
		return 0x00;
	},
	_funcA2D : function( _this, param, code, token, value, seFlag ){
		var ret;
		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != 0x00 ){
			return ret;
		}
		value._mat[0].angToAng( complexAngType(), 1 );
		return 0x00;
	},
	_funcA2G : function( _this, param, code, token, value, seFlag ){
		var ret;
		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != 0x00 ){
			return ret;
		}
		value._mat[0].angToAng( complexAngType(), 2 );
		return 0x00;
	},
	_funcA2R : function( _this, param, code, token, value, seFlag ){
		var ret;
		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != 0x00 ){
			return ret;
		}
		value._mat[0].angToAng( complexAngType(), 0 );
		return 0x00;
	},
	_funcD2A : function( _this, param, code, token, value, seFlag ){
		var ret;
		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != 0x00 ){
			return ret;
		}
		value._mat[0].angToAng( 1, complexAngType() );
		return 0x00;
	},
	_funcD2G : function( _this, param, code, token, value, seFlag ){
		var ret;
		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != 0x00 ){
			return ret;
		}
		value._mat[0].angToAng( 1, 2 );
		return 0x00;
	},
	_funcD2R : function( _this, param, code, token, value, seFlag ){
		var ret;
		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != 0x00 ){
			return ret;
		}
		value._mat[0].angToAng( 1, 0 );
		return 0x00;
	},
	_funcG2A : function( _this, param, code, token, value, seFlag ){
		var ret;
		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != 0x00 ){
			return ret;
		}
		value._mat[0].angToAng( 2, complexAngType() );
		return 0x00;
	},
	_funcG2D : function( _this, param, code, token, value, seFlag ){
		var ret;
		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != 0x00 ){
			return ret;
		}
		value._mat[0].angToAng( 2, 1 );
		return 0x00;
	},
	_funcG2R : function( _this, param, code, token, value, seFlag ){
		var ret;
		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != 0x00 ){
			return ret;
		}
		value._mat[0].angToAng( 2, 0 );
		return 0x00;
	},
	_funcR2A : function( _this, param, code, token, value, seFlag ){
		var ret;
		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != 0x00 ){
			return ret;
		}
		value._mat[0].angToAng( 0, complexAngType() );
		return 0x00;
	},
	_funcR2D : function( _this, param, code, token, value, seFlag ){
		var ret;
		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != 0x00 ){
			return ret;
		}
		value._mat[0].angToAng( 0, 1 );
		return 0x00;
	},
	_funcR2G : function( _this, param, code, token, value, seFlag ){
		var ret;
		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != 0x00 ){
			return ret;
		}
		value._mat[0].angToAng( 0, 2 );
		return 0x00;
	},
	_funcSin : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].sin() );
		return 0x00;
	},
	_funcCos : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].cos() );
		return 0x00;
	},
	_funcTan : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].tan() );
		return 0x00;
	},
	_funcASin : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].asin() );
		if( valueError() ){
			_this._errorProc( 0x1004, _this._curLine._num, param, 14, null );
			clearValueError();
		}
		return 0x00;
	},
	_funcACos : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].acos() );
		if( valueError() ){
			_this._errorProc( 0x1005, _this._curLine._num, param, 14, null );
			clearValueError();
		}
		return 0x00;
	},
	_funcATan : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].atan() );
		return 0x00;
	},
	_funcATan2 : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = newMatrixArray( 2 );
		if( (ret = _this._getFuncParam( param, code, token, tmpValue[0], seFlag )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getFuncParam( param, code, token, tmpValue[1], seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( fatan2( tmpValue[0]._mat[0].toFloat(), tmpValue[1]._mat[0].toFloat() ) );
		return 0x00;
	},
	_funcSinH : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].sinh() );
		return 0x00;
	},
	_funcCosH : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].cosh() );
		return 0x00;
	},
	_funcTanH : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].tanh() );
		return 0x00;
	},
	_funcASinH : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].asinh() );
		return 0x00;
	},
	_funcACosH : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].acosh() );
		if( valueError() ){
			_this._errorProc( 0x1006, _this._curLine._num, param, 14, null );
			clearValueError();
		}
		return 0x00;
	},
	_funcATanH : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].atanh() );
		if( valueError() ){
			_this._errorProc( 0x1007, _this._curLine._num, param, 14, null );
			clearValueError();
		}
		return 0x00;
	},
	_funcExp : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].exp() );
		return 0x00;
	},
	_funcExp10 : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].exp10() );
		return 0x00;
	},
	_funcLn : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].log() );
		if( valueError() ){
			_this._errorProc( 0x1008, _this._curLine._num, param, 14, null );
			clearValueError();
		}
		return 0x00;
	},
	_funcLog : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		if( param._calculator ){
			value.ass( tmpValue._mat[0].log10() );
		} else {
			value.ass( tmpValue._mat[0].log() );
		}
		if( valueError() ){
			_this._errorProc( param._calculator ? 0x1009 : 0x1008, _this._curLine._num, param, 14, null );
			clearValueError();
		}
		return 0x00;
	},
	_funcLog10 : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].log10() );
		if( valueError() ){
			_this._errorProc( 0x1009, _this._curLine._num, param, 14, null );
			clearValueError();
		}
		return 0x00;
	},
	_funcPow : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = newMatrixArray( 2 );
		if( (ret = _this._getFuncParam( param, code, token, tmpValue[0], seFlag )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getFuncParam( param, code, token, tmpValue[1], seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue[0]._mat[0].pow( tmpValue[1]._mat[0] ) );
		return 0x00;
	},
	_funcSqr : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].sqr() );
		return 0x00;
	},
	_funcSqrt : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].sqrt() );
		if( valueError() ){
			_this._errorProc( 0x100A, _this._curLine._num, param, 14, null );
			clearValueError();
		}
		return 0x00;
	},
	_funcCeil : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].ceil() );
		return 0x00;
	},
	_funcFloor : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].floor() );
		return 0x00;
	},
	_funcAbs : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].abs() );
		return 0x00;
	},
	_funcLdexp : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = newMatrixArray( 2 );
		if( (ret = _this._getFuncParam( param, code, token, tmpValue[0], seFlag )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getFuncParam( param, code, token, tmpValue[1], seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue[0]._mat[0].ldexp( _INT( tmpValue[1]._mat[0].toFloat() ) ) );
		return 0x00;
	},
	_funcFrexp : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		var index = new __Index();
		var moveFlag = new _Boolean();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getFuncParamIndex( param, code, token, index, moveFlag, seFlag )) != 0x00 ){
			return ret;
		}
		var _n = new _Integer();
		value.ass( tmpValue._mat[0].frexp( _n ) );
		if( !(index._param.setVal( index._index, _n._val, moveFlag._val )) ){
			return _this._retError( 0x210E, code, token );
		}
		return 0x00;
	},
	_funcModf : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		var index = new __Index();
		var moveFlag = new _Boolean();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getFuncParamIndex( param, code, token, index, moveFlag, seFlag )) != 0x00 ){
			return ret;
		}
		var _f = new _Float();
		value.ass( tmpValue._mat[0].modf( _f ) );
		if( !(index._param.setVal( index._index, _f._val, moveFlag._val )) ){
			return _this._retError( 0x210E, code, token );
		}
		return 0x00;
	},
	_funcInt : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value._mat[0].setReal( _INT( tmpValue._mat[0].real() ) );
		value._mat[0].setImag( _INT( tmpValue._mat[0].imag() ) );
		return 0x00;
	},
	_funcReal : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].real() );
		return 0x00;
	},
	_funcImag : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].imag() );
		return 0x00;
	},
	_funcArg : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].farg() );
		return 0x00;
	},
	_funcNorm : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].fnorm() );
		return 0x00;
	},
	_funcConjg : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].conjg() );
		return 0x00;
	},
	_funcPolar : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = newMatrixArray( 2 );
		if( (ret = _this._getFuncParam( param, code, token, tmpValue[0], seFlag )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getFuncParam( param, code, token, tmpValue[1], seFlag )) != 0x00 ){
			return ret;
		}
		value._mat[0].polar( tmpValue[0]._mat[0].toFloat(), tmpValue[1]._mat[0].toFloat() );
		return 0x00;
	},
	_funcNum : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		if( tmpValue._mat[0].fractMinus() ){
			value.ass( -tmpValue._mat[0].num() );
		} else {
			value.ass( tmpValue._mat[0].num() );
		}
		return 0x00;
	},
	_funcDenom : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( tmpValue._mat[0].denom() );
		return 0x00;
	},
	_funcRow : function( _this, param, code, token, value, seFlag ){
		var mat;
		var moveFlag = new _Boolean();
		if( (mat = _this._getFuncParamMatrix( param, code, token, moveFlag, seFlag )) != null ){
			value.ass( mat._row );
		} else {
			var ret;
			var tmpValue = new _Matrix();
			if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
				return ret;
			}
			value.ass( tmpValue._row );
		}
		return 0x00;
	},
	_funcCol : function( _this, param, code, token, value, seFlag ){
		var mat;
		var moveFlag = new _Boolean();
		if( (mat = _this._getFuncParamMatrix( param, code, token, moveFlag, seFlag )) != null ){
			value.ass( mat._col );
		} else {
			var ret;
			var tmpValue = new _Matrix();
			if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
				return ret;
			}
			value.ass( tmpValue._col );
		}
		return 0x00;
	},
	_funcTrans : function( _this, param, code, token, value, seFlag ){
		var mat;
		var moveFlag = new _Boolean();
		if( (mat = _this._getFuncParamMatrix( param, code, token, moveFlag, seFlag )) != null ){
			value.ass( mat.trans() );
		} else {
			var ret;
			var tmpValue = new _Matrix();
			if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
				return ret;
			}
			value.ass( tmpValue.trans() );
		}
		return 0x00;
	},
	_funcStrCmp : function( _this, param, code, token, value, seFlag ){
		if( seFlag ){
			if( !(_this._curLine._token.skipComma()) ){
				return _this._retError( 0x2181, code, token );
			}
		}
		var string1 = new _String();
		if( _this._getString( param, string1 ) ){
			if( seFlag ){
				if( !(_this._curLine._token.skipComma()) ){
					return _this._retError( 0x2181, code, token );
				}
			}
			var string2 = new _String();
			if( _this._getString( param, string2 ) ){
				var str1 = string1.str();
				var str2 = string2.str();
				var val = str1.length - str2.length;
				if( val == 0 ){
					var i;
					switch( token ){
					case 68:
						for( i = 0; i < str1.length; i++ ){
							val = str1.charCodeAt( i ) - str2.charCodeAt( i );
							if( val != 0 ){
								break;
							}
						}
						break;
					case 69:
						var chr1, chr2;
						for( i = 0; i < str1.length; i++ ){
							chr1 = str1.charCodeAt( i );
							if( (chr1 >= _CHAR_CODE_UA) && (chr1 <= _CHAR_CODE_UZ) ){
								chr1 = chr1 - _CHAR_CODE_UA + _CHAR_CODE_LA;
							}
							chr2 = str2.charCodeAt( i );
							if( (chr2 >= _CHAR_CODE_UA) && (chr2 <= _CHAR_CODE_UZ) ){
								chr2 = chr2 - _CHAR_CODE_UA + _CHAR_CODE_LA;
							}
							val = chr1 - chr2;
							if( val != 0 ){
								break;
							}
						}
						break;
					}
				}
				value.ass( val );
				return 0x00;
			}
		}
		return _this._retError( 0x2103, code, token );
	},
	_funcStrLen : function( _this, param, code, token, value, seFlag ){
		if( seFlag ){
			if( !(_this._curLine._token.skipComma()) ){
				return _this._retError( 0x2181, code, token );
			}
		}
		var string = new _String();
		if( _this._getString( param, string ) ){
			value.ass( string.str().length );
			return 0x00;
		}
		return _this._retError( 0x2103, code, token );
	},
	_funcGWidth : function( _this, param, code, token, value, seFlag ){
		value.ass( procGWorld()._width );
		return 0x00;
	},
	_funcGHeight : function( _this, param, code, token, value, seFlag ){
		value.ass( procGWorld()._height );
		return 0x00;
	},
	_funcGColor : function( _this, param, code, token, value, seFlag ){
		var lock;
		var tmpValue = new _Matrix();
		lock = _this._curLine._token.lock();
		if( _this._getFuncParam( param, code, token, tmpValue, seFlag ) == 0x00 ){
			procGWorld().setColor( doFuncGColor( _UNSIGNED( tmpValue._mat[0].toFloat(), 16777216 ) ) );
		} else {
			_this._curLine._token.unlock( lock );
		}
		value.ass( (token == 73) ? procGWorld()._color : doFuncGColor24( procGWorld()._color ) );
		return 0x00;
	},
	_funcGCX : function( _this, param, code, token, value, seFlag ){
		value.ass( procGWorld()._imgMoveX );
		return 0x00;
	},
	_funcGCY : function( _this, param, code, token, value, seFlag ){
		value.ass( procGWorld()._imgMoveY );
		return 0x00;
	},
	_funcWCX : function( _this, param, code, token, value, seFlag ){
		value.ass( procGWorld()._wndMoveX );
		return 0x00;
	},
	_funcWCY : function( _this, param, code, token, value, seFlag ){
		value.ass( procGWorld()._wndMoveY );
		return 0x00;
	},
	_funcGGet : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = newMatrixArray( 2 );
		if( (ret = _this._getFuncParam( param, code, token, tmpValue[0], seFlag )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getFuncParam( param, code, token, tmpValue[1], seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( procGWorld().get( _INT( tmpValue[0]._mat[0].toFloat() ), _INT( tmpValue[1]._mat[0].toFloat() ) ) );
		return 0x00;
	},
	_funcWGet : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = newMatrixArray( 2 );
		if( (ret = _this._getFuncParam( param, code, token, tmpValue[0], seFlag )) != 0x00 ){
			return ret;
		}
		if( (ret = _this._getFuncParam( param, code, token, tmpValue[1], seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( procGWorld().wndGet( tmpValue[0]._mat[0].toFloat(), tmpValue[1]._mat[0].toFloat() ) );
		return 0x00;
	},
	_funcGX : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( procGWorld().imgPosX( tmpValue._mat[0].toFloat() ) );
		return 0x00;
	},
	_funcGY : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( procGWorld().imgPosY( tmpValue._mat[0].toFloat() ) );
		return 0x00;
	},
	_funcWX : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( procGWorld().wndPosX( _INT( tmpValue._mat[0].toFloat() ) ) );
		return 0x00;
	},
	_funcWY : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != 0x00 ){
			return ret;
		}
		value.ass( procGWorld().wndPosY( _INT( tmpValue._mat[0].toFloat() ) ) );
		return 0x00;
	},
	_funcCall : function( _this, param, code, token, value, seFlag ){
		var ret;
		if( seFlag ){
			if( !(_this._curLine._token.skipComma()) ){
				return _this._retError( 0x2181, code, token );
			}
		}
		var func = new _String();
		_this._getString( param, func );
		if( func.isNull() ){
			return _this._retError( 0x210B, code, token );
		}
		if( func.str().charAt( 0 ) == '!' ){
			ret = _this._procExtFunc( _this, param, 13, func.str().slice( 1 ), value );
		} else {
			var _func = new _Integer();
			if( !_this._token.checkFunc( func.str(), _func ) ){
				ret = _this._retError( 0x210F, code, token );
			} else {
				ret = _this._procFunc( _this, param, 12, _func._val, value );
			}
		}
		return ret;
	},
	_funcEval : function( _this, param, code, token, value, seFlag ){
		var ret;
		if( seFlag ){
			if( !(_this._curLine._token.skipComma()) ){
				return _this._retError( 0x2181, code, token );
			}
		}
		var string = new _String();
		_this._getString( param, string );
		if( string.isNull() ){
			return _this._retError( 0x210B, code, token );
		}
		var childProc = new _Proc( param._mode, _this._printAssert, _this._printWarn, _this._gUpdateFlag );
		var childParam = new _Param( _this._curLine._num, param, true );
		childParam._enableCommand = false;
		childParam._enableStat = false;
		ret = doFuncEval( _this, childProc, childParam, string.str(), value );
		childProc.end();
		childParam.end();
		return ret;
	},
	doFuncEval : function( childProc, childParam, string, value ){
		var ret;
		childProc.setAngType( this._angType, false );
		if( (ret = childProc.processLoop( string, childParam )) == 0x04 ){
			value.ass( childParam._array._mat[0] );
			return 0x00;
		}
		return ret;
	},
	_setVal : function( param, code, token, value ){
		switch( this._curInfo._assCode ){
		case 0x21:
			if( !(param.setVal( this._curInfo._assToken, value._mat[0], true )) ){
				return this._retError( 0x210E, code, token );
			}
			break;
		case 0x23:
			param = globalParam();
		case 0x22:
			if( !(param.setVal( this.autoVarIndex( param, this._curInfo._assToken ), value._mat[0], false )) ){
				return this._retError( 0x210E, code, token );
			}
			break;
		case 0x44:
			if( this._curInfo._curArraySize == 0 ){
				return this._retError( 0x2105, code, token );
			} else {
				param._array.set(
					this._curInfo._assToken,
					this._curInfo._curArray, this._curInfo._curArraySize,
					value._mat[0], true
					);
			}
			break;
		case 0x46:
			param = globalParam();
		case 0x45:
			if( this._curInfo._curArraySize == 0 ){
				return this._retError( 0x2105, code, token );
			} else {
				param._array.set(
					this.autoArrayIndex( param, this._curInfo._assToken ),
					this._curInfo._curArray, this._curInfo._curArraySize,
					value._mat[0], false
					);
			}
			break;
		default:
			return this._retError( 0x2105, code, token );
		}
		return 0x00;
	},
	_assVal : function( param, code, token, array, arraySize, value ){
		switch( this._curInfo._assCode ){
		case 0x21:
			if( !(param.setVal( this._curInfo._assToken, value._mat[0], true )) ){
				return this._retError( 0x210E, code, token );
			}
			break;
		case 0x23:
			param = globalParam();
		case 0x22:
			if( !(param.setVal( this.autoVarIndex( param, this._curInfo._assToken ), value._mat[0], false )) ){
				return this._retError( 0x210E, code, token );
			}
			break;
		case 0x44:
			if( arraySize == 0 ){
				param._array.setMatrix( this._curInfo._assToken, value, true );
			} else {
				param._array.set( this._curInfo._assToken, array, arraySize, value._mat[0], true );
			}
			break;
		case 0x46:
			param = globalParam();
		case 0x45:
			if( arraySize == 0 ){
				param._array.setMatrix( this.autoArrayIndex( param, this._curInfo._assToken ), value, false );
			} else {
				param._array.set( this.autoArrayIndex( param, this._curInfo._assToken ), array, arraySize, value._mat[0], false );
			}
			break;
		default:
			return this._retError( 0x2104, code, token );
		}
		return 0x00;
	},
	_unaryIncrement : function( _this, param, code, token, value ){
		var ret;
		if( param._subStep == 0 ){
			param._assFlag = true;
		}
		if( (ret = _this._constFirst( param, code, token, value )) == 0x00 ){
			value.addAndAss( 1.0 );
			return _this._setVal( param, code, token, value );
		}
		return ret;
	},
	_unaryDecrement : function( _this, param, code, token, value ){
		var ret;
		if( param._subStep == 0 ){
			param._assFlag = true;
		}
		if( (ret = _this._constFirst( param, code, token, value )) == 0x00 ){
			value.subAndAss( 1.0 );
			return _this._setVal( param, code, token, value );
		}
		return ret;
	},
	_unaryComplement : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( ~_INT( rightValue._mat[0].toFloat() ) );
			_this._updateMatrix( param, value );
		}
		return ret;
	},
	_unaryNot : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( (_INT( rightValue._mat[0].toFloat() ) == 0) ? 1 : 0 );
			_this._updateMatrix( param, value );
		}
		return ret;
	},
	_unaryMinus : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( rightValue.minus() );
			_this._updateMatrix( param, value );
		}
		return ret;
	},
	_unaryPlus : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( rightValue );
			_this._updateMatrix( param, value );
		}
		return ret;
	},
	_opPostfixInc : function( _this, param, code, token, value ){
		return _this._regInc( true , param, code, token );
	},
	_opPostfixDec : function( _this, param, code, token, value ){
		return _this._regInc( false , param, code, token );
	},
	_opMul : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.mulAndAss( rightValue );
			_this._updateMatrix( param, value );
		}
		return ret;
	},
	_opDiv : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			if( _this._printWarn && rightValue.equal( 0.0 ) ){
				_this._errorProc( 0x1001, _this._curLine._num, param, 14, null );
			}
			value.divAndAss( rightValue );
			_this._updateMatrix( param, value );
		}
		return ret;
	},
	_opMod : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			if( _this._printWarn && rightValue.equal( 0.0 ) ){
				_this._errorProc( 0x1001, _this._curLine._num, param, 14, null );
			}
			value.modAndAss( rightValue );
			_this._updateMatrix( param, value );
		}
		return ret;
	},
	_opAdd : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.addAndAss( rightValue );
			_this._updateMatrix( param, value );
		}
		return ret;
	},
	_opSub : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.subAndAss( rightValue );
			_this._updateMatrix( param, value );
		}
		return ret;
	},
	_opShiftL : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( _SHIFTL( _INT( value._mat[0].toFloat() ), _INT( rightValue._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value );
		}
		return ret;
	},
	_opShiftR : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( _SHIFTR( _INT( value._mat[0].toFloat() ), _INT( rightValue._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value );
		}
		return ret;
	},
	_opLess : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( (value._mat[0].toFloat() < rightValue._mat[0].toFloat()) ? 1 : 0 );
		}
		return ret;
	},
	_opLessOrEq : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( (value._mat[0].toFloat() <= rightValue._mat[0].toFloat()) ? 1 : 0 );
		}
		return ret;
	},
	_opGreat : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( (value._mat[0].toFloat() > rightValue._mat[0].toFloat()) ? 1 : 0 );
		}
		return ret;
	},
	_opGreatOrEq : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( (value._mat[0].toFloat() >= rightValue._mat[0].toFloat()) ? 1 : 0 );
		}
		return ret;
	},
	_opEqual : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( value.equal( rightValue ) ? 1 : 0 );
		}
		return ret;
	},
	_opNotEqual : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( value.notEqual( rightValue ) ? 1 : 0 );
		}
		return ret;
	},
	_opAND : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( _AND( _INT( value._mat[0].toFloat() ), _INT( rightValue._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value );
		}
		return ret;
	},
	_opXOR : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( _XOR( _INT( value._mat[0].toFloat() ), _INT( rightValue._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value );
		}
		return ret;
	},
	_opOR : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( _OR( _INT( value._mat[0].toFloat() ), _INT( rightValue._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value );
		}
		return ret;
	},
	_opLogAND : function( _this, param, code, token, value ){
		var ret;
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( value.notEqual( 0.0 ) ){
			var rightValue = new _Matrix();
			if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
				value.ass( rightValue.notEqual( 0.0 ) ? 1 : 0 );
			}
		} else {
			if( (ret = _this._constSkip( code, token )) == 0x00 ){
				value.ass( 0 );
			}
		}
		return ret;
	},
	_opLogOR : function( _this, param, code, token, value ){
		var ret;
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( value.notEqual( 0.0 ) ){
			if( (ret = _this._constSkip( code, token )) == 0x00 ){
				value.ass( 1 );
			}
		} else {
			var rightValue = new _Matrix();
			if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
				value.ass( rightValue.notEqual( 0.0 ) ? 1 : 0 );
			}
		}
		return ret;
	},
	_opConditional : function( _this, param, code, token, value ){
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( value.notEqual( 0.0 ) ){
			if( _this._const( param, code, token, value ) == 0x00 ){
				_this._updateMatrix( param, value );
				if( _this._constSkipConditional( code, token ) == 0x00 ){
					return 0x00;
				}
			}
		} else {
			if( _this._constSkipConditional( code, token ) == 0x00 ){
				if( _this._const( param, code, token, value ) == 0x00 ){
					_this._updateMatrix( param, value );
					return 0x00;
				}
			}
		}
		return _this._retError( 0x2107, code, token );
	},
	_opAss : function( _this, param, code, token, value ){
		var ret;
		if( param._subStep == 0 ){
			param._assFlag = true;
		}
		var saveArray = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;
		if( (ret = _this._const( param, code, token, value )) == 0x00 ){
			_this._updateMatrix( param, value );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}
		saveArray = null;
		return ret;
	},
	_opMulAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = true;
		}
		var saveArray = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.mulAndAss( rightValue );
			_this._updateMatrix( param, value );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}
		saveArray = null;
		return ret;
	},
	_opDivAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = true;
		}
		var saveArray = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			if( _this._printWarn && rightValue.equal( 0.0 ) ){
				_this._errorProc( 0x1001, _this._curLine._num, param, 14, null );
			}
			value.divAndAss( rightValue );
			_this._updateMatrix( param, value );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}
		saveArray = null;
		return ret;
	},
	_opModAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = true;
		}
		var saveArray = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			if( _this._printWarn && rightValue.equal( 0.0 ) ){
				_this._errorProc( 0x1001, _this._curLine._num, param, 14, null );
			}
			value.modAndAss( rightValue );
			_this._updateMatrix( param, value );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}
		saveArray = null;
		return ret;
	},
	_opAddAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = true;
		}
		var saveArray = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.addAndAss( rightValue );
			_this._updateMatrix( param, value );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}
		saveArray = null;
		return ret;
	},
	_opSubAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = true;
		}
		var saveArray = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.subAndAss( rightValue );
			_this._updateMatrix( param, value );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}
		saveArray = null;
		return ret;
	},
	_opShiftLAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = true;
		}
		var saveArray = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( _SHIFTL( _INT( value._mat[0].toFloat() ), _INT( rightValue._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}
		saveArray = null;
		return ret;
	},
	_opShiftRAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = true;
		}
		var saveArray = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( _SHIFTR( _INT( value._mat[0].toFloat() ), _INT( rightValue._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}
		saveArray = null;
		return ret;
	},
	_opANDAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = true;
		}
		var saveArray = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( _AND( _INT( value._mat[0].toFloat() ), _INT( rightValue._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}
		saveArray = null;
		return ret;
	},
	_opORAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = true;
		}
		var saveArray = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( _OR( _INT( value._mat[0].toFloat() ), _INT( rightValue._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}
		saveArray = null;
		return ret;
	},
	_opXORAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = true;
		}
		var saveArray = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( _XOR( _INT( value._mat[0].toFloat() ), _INT( rightValue._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}
		saveArray = null;
		return ret;
	},
	_opComma : function( _this, param, code, token, value ){
		var ret;
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, value )) == 0x00 ){
			_this._updateMatrix( param, value );
		}
		return ret;
	},
	_opPow : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( value._mat[0].pow( rightValue._mat[0] ) );
			_this._updateMatrix( param, value );
		}
		return ret;
	},
	_opPowAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _Matrix();
		if( param._subStep == 0 ){
			param._assFlag = false;
		}
		var saveArray = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;
		if( (ret = _this._const( param, code, token, rightValue )) == 0x00 ){
			value.ass( value._mat[0].pow( rightValue._mat[0] ) );
			_this._updateMatrix( param, value );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}
		saveArray = null;
		return ret;
	},
	_loopBegin : function( _this ){
		if( _this._statMode == 0 ){
			var ret;
			_this._statMode = 1;
			_this._stat = new _Loop();
			if( (ret = _this._stat.regLine( _this._curLine )) != 0x02 ){
				_this._stat = null;
				_this._statMode = 0;
				return ret;
			}
			return 0x03;
		} else if( _this._statMode == 2 ){
			if( _this._checkSkip() ){
				_this._stat.doBreak();
				return 0x03;
			}
		}
		return 0x00;
	},
	_loopEnd : function( _this ){
		if( _this._statMode == 2 ){
			if( _this._checkSkip() ){
				var _continue = _this._stat.checkContinue();
				_this._stat.doBreak();
				_this._stat.doEnd();
				if( !_continue ){
					return 0x03;
				}
			}
		}
		return 0x00;
	},
	_loopCont : function( _this ){
		if( _this._statMode == 2 ){
			if( _this._checkSkip() ){
				_this._stat.doBreak();
				_this._stat.doEnd();
				return 0x03;
			}
		}
		return 0x00;
	},
	_loopUntil : function( _this ){
		if( _this._statMode == 2 ){
			if( _this._checkSkip() ){
				var _continue = _this._stat.checkContinue();
				_this._stat.doBreak();
				_this._stat.doEnd();
				if( !_continue ){
					return 0x03;
				}
			}
		}
		return 0x00;
	},
	_loopEndWhile : function( _this ){
		if( _this._statMode == 2 ){
			if( _this._checkSkip() ){
				_this._stat.doBreak();
				_this._stat.doEnd();
				return 0x03;
			}
		}
		return 0x00;
	},
	_loopNext : function( _this ){
		if( _this._statMode == 2 ){
			if( _this._checkSkip() ){
				_this._stat.doBreak();
				_this._stat.doEnd();
				return 0x03;
			}
		}
		return 0x00;
	},
	_loopEndFunc : function( _this ){
		if( _this._statMode == 2 ){
			if( _this._checkSkip() ){
				_this._stat.doBreak();
				_this._stat.doEnd();
				return 0x03;
			}
		}
		return 0x00;
	},
	_loopIf : function( _this ){
			_this._statIfCnt++;
			if( _this._statIfCnt > _this._statIfMax ){
				_this._statIfCnt--;
				return 0x2120;
			}
			if( _this._checkSkipSwi() || ((_this._statIfMode[_this._statIfCnt - 1] == 0) || (_this._statIfMode[_this._statIfCnt - 1] == 2)) ){
				_this._statIfMode[_this._statIfCnt] = 2;
				return 0x03;
			} else {
				_this._statIfMode[_this._statIfCnt] = 1;
			}
		return 0x00;
	},
	_loopElIf : function( _this ){
		if( _this._statIfCnt == 0 ){
			return 0x2121;
		}
		if( _this._statIfMode[_this._statIfCnt] == 2 ){
			return 0x03;
		}
		return 0x00;
	},
	_loopElse : function( _this ){
		if( _this._statIfCnt == 0 ){
			return 0x2121;
		}
		if( _this._statIfMode[_this._statIfCnt] == 2 ){
			return 0x03;
		}
		return 0x00;
	},
	_loopEndIf : function( _this ){
		if( _this._statIfCnt == 0 ){
			return 0x2121;
		}
		_this._statIfCnt--;
		if( _this._statIfMode[_this._statIfCnt] == 2 ){
			return 0x03;
		}
		return 0x00;
	},
	_loopSwitch : function( _this ){
			_this._statSwiCnt++;
			if( _this._statSwiCnt > _this._statSwiMax ){
				_this._statSwiCnt--;
				return 0x2122;
			}
			if( _this._checkSkipIf() || ((_this._statSwiMode[_this._statSwiCnt - 1] == 0) || (_this._statSwiMode[_this._statSwiCnt - 1] == 2)) ){
				_this._statSwiMode[_this._statSwiCnt] = 2;
				return 0x03;
			} else {
				_this._statSwiMode[_this._statSwiCnt] = 1;
			}
		return 0x00;
	},
	_loopCase : function( _this ){
		if( _this._statSwiCnt == 0 ){
			return 0x2123;
		}
		if( _this._statSwiMode[_this._statSwiCnt] == 2 ){
			return 0x03;
		}
		return 0x00;
	},
	_loopDefault : function( _this ){
		if( _this._statSwiCnt == 0 ){
			return 0x2123;
		}
		if( _this._statSwiMode[_this._statSwiCnt] == 2 ){
			return 0x03;
		}
		return 0x00;
	},
	_loopEndSwi : function( _this ){
		if( _this._statSwiCnt == 0 ){
			return 0x2123;
		}
		_this._statSwiCnt--;
		if( _this._statSwiMode[_this._statSwiCnt] == 2 ){
			return 0x03;
		}
		return 0x00;
	},
	_loopBreakSwi : function( _this ){
		if( _this._statSwiCnt == 0 ){
			return 0x2123;
		}
		if( _this._statSwiMode[_this._statSwiCnt] == 2 ){
			return 0x03;
		}
		return 0x00;
	},
	_loopContinue : function( _this ){
		if( _this._statMode == 2 ){
			if( _this._checkSkip() ){
				return 0x03;
			}
		}
		return 0x00;
	},
	_loopBreak : function( _this ){
		if( _this._statMode == 2 ){
			if( _this._checkSkip() ){
				return 0x03;
			}
		}
		return 0x00;
	},
	_loopAssert : function( _this ){
		if( _this._checkSkip() ){
			return 0x03;
		}
		return 0x00;
	},
	_loopReturn : function( _this ){
		if( _this._checkSkip() ){
			return 0x03;
		}
		return 0x00;
	},
	_doStatBreak : function(){
		this._stat.doBreak();
		this.resetLoopCount();
	},
	_statStart : function( _this, param, code, token ){
		if( _this._statMode == 2 ){
			_this._loopCnt++;
			incProcLoopTotal();
			if( (procLoopMax() > 0) && (_this._loopCnt > procLoopMax()) ){
				return 0x2130;
			}
		}
		return 0x03;
	},
	_statEnd : function( _this, param, code, token ){
		if( _this._statMode == 0 ){
			return 0x2182;
		} else if( _this._statMode == 2 ){
			var ret;
			var tmpValue = newMatrixArray( 2 );
			if( (ret = _this._constFirst( param, code, token, tmpValue[0] )) != 0x00 ){
				return ret;
			}
			var saveArray = _this._curInfo._curArray;
			var saveArraySize = _this._curInfo._curArraySize;
			if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != 0x00 ){
				return ret;
			}
			var stop = _INT( tmpValue[1]._mat[0].toFloat() );
			if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != 0x00 ){
				return ret;
			}
			var step = _INT( tmpValue[1]._mat[0].toFloat() );
			if( step == 0 ){
				return _this._retError( 0x2181, code, token );
			}
			if( _this._curLine._token._get != null ){
				return _this._retError( 0x2181, code, token );
			}
			tmpValue[0].addAndAss( step );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, tmpValue[0] );
			saveArray = null;
			if( ret != 0x00 ){
				return ret;
			}
			var _break;
			if( step < 0 ){
				_break = (_INT( tmpValue[0]._mat[0].toFloat() ) <= stop);
			} else {
				_break = (_INT( tmpValue[0]._mat[0].toFloat() ) >= stop);
			}
			if( _break ){
				_this._doStatBreak();
			}
			_this._stat.doEnd();
		}
		return 0x03;
	},
	_statEndInc : function( _this, param, code, token ){
		if( _this._statMode == 0 ){
			return 0x2182;
		} else if( _this._statMode == 2 ){
			var ret;
			var tmpValue = newMatrixArray( 2 );
			if( (ret = _this._constFirst( param, code, token, tmpValue[0] )) != 0x00 ){
				return ret;
			}
			var saveArray = _this._curInfo._curArray;
			var saveArraySize = _this._curInfo._curArraySize;
			if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != 0x00 ){
				return ret;
			}
			if( _this._curLine._token._get != null ){
				return _this._retError( 0x2181, code, token );
			}
			tmpValue[0].addAndAss( 1 );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, tmpValue[0] );
			saveArray = null;
			if( ret != 0x00 ){
				return ret;
			}
			if( _INT( tmpValue[0]._mat[0].toFloat() ) >= _INT( tmpValue[1]._mat[0].toFloat() ) ){
				_this._doStatBreak();
			}
			_this._stat.doEnd();
		}
		return 0x03;
	},
	_statEndDec : function( _this, param, code, token ){
		if( _this._statMode == 0 ){
			return 0x2182;
		} else if( _this._statMode == 2 ){
			var ret;
			var tmpValue = newMatrixArray( 2 );
			if( (ret = _this._constFirst( param, code, token, tmpValue[0] )) != 0x00 ){
				return ret;
			}
			var saveArray = _this._curInfo._curArray;
			var saveArraySize = _this._curInfo._curArraySize;
			if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != 0x00 ){
				return ret;
			}
			if( _this._curLine._token._get != null ){
				return _this._retError( 0x2181, code, token );
			}
			tmpValue[0].subAndAss( 1 );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, tmpValue[0] );
			saveArray = null;
			if( ret != 0x00 ){
				return ret;
			}
			if( _INT( tmpValue[0]._mat[0].toFloat() ) <= _INT( tmpValue[1]._mat[0].toFloat() ) ){
				_this._doStatBreak();
			}
			_this._stat.doEnd();
		}
		return 0x03;
	},
	_statEndEq : function( _this, param, code, token ){
		if( _this._statMode == 0 ){
			return 0x2182;
		} else if( _this._statMode == 2 ){
			var ret;
			var tmpValue = newMatrixArray( 2 );
			if( (ret = _this._constFirst( param, code, token, tmpValue[0] )) != 0x00 ){
				return ret;
			}
			var saveArray = _this._curInfo._curArray;
			var saveArraySize = _this._curInfo._curArraySize;
			if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != 0x00 ){
				return ret;
			}
			var stop = _INT( tmpValue[1]._mat[0].toFloat() );
			if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != 0x00 ){
				return ret;
			}
			var step = _INT( tmpValue[1]._mat[0].toFloat() );
			if( step == 0 ){
				return _this._retError( 0x2181, code, token );
			}
			if( _this._curLine._token._get != null ){
				return _this._retError( 0x2181, code, token );
			}
			tmpValue[0].addAndAss( step );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, tmpValue[0] );
			saveArray = null;
			if( ret != 0x00 ){
				return ret;
			}
			var _break;
			if( step < 0 ){
				_break = (_INT( tmpValue[0]._mat[0].toFloat() ) < stop);
			} else {
				_break = (_INT( tmpValue[0]._mat[0].toFloat() ) > stop);
			}
			if( _break ){
				_this._doStatBreak();
			}
			_this._stat.doEnd();
		}
		return 0x03;
	},
	_statEndEqInc : function( _this, param, code, token ){
		if( _this._statMode == 0 ){
			return 0x2182;
		} else if( _this._statMode == 2 ){
			var ret;
			var tmpValue = newMatrixArray( 2 );
			if( (ret = _this._constFirst( param, code, token, tmpValue[0] )) != 0x00 ){
				return ret;
			}
			var saveArray = _this._curInfo._curArray;
			var saveArraySize = _this._curInfo._curArraySize;
			if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != 0x00 ){
				return ret;
			}
			if( _this._curLine._token._get != null ){
				return _this._retError( 0x2181, code, token );
			}
			tmpValue[0].addAndAss( 1 );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, tmpValue[0] );
			saveArray = null;
			if( ret != 0x00 ){
				return ret;
			}
			if( _INT( tmpValue[0]._mat[0].toFloat() ) > _INT( tmpValue[1]._mat[0].toFloat() ) ){
				_this._doStatBreak();
			}
			_this._stat.doEnd();
		}
		return 0x03;
	},
	_statEndEqDec : function( _this, param, code, token ){
		if( _this._statMode == 0 ){
			return 0x2182;
		} else if( _this._statMode == 2 ){
			var ret;
			var tmpValue = newMatrixArray( 2 );
			if( (ret = _this._constFirst( param, code, token, tmpValue[0] )) != 0x00 ){
				return ret;
			}
			var saveArray = _this._curInfo._curArray;
			var saveArraySize = _this._curInfo._curArraySize;
			if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != 0x00 ){
				return ret;
			}
			if( _this._curLine._token._get != null ){
				return _this._retError( 0x2181, code, token );
			}
			tmpValue[0].subAndAss( 1 );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, tmpValue[0] );
			saveArray = null;
			if( ret != 0x00 ){
				return ret;
			}
			if( _INT( tmpValue[0]._mat[0].toFloat() ) < _INT( tmpValue[1]._mat[0].toFloat() ) ){
				_this._doStatBreak();
			}
			_this._stat.doEnd();
		}
		return 0x03;
	},
	_statCont : function( _this, param, code, token ){
		switch( _this._statMode ){
		case 0:
			return 0x2185;
		case 2:
			_this._stat.doEnd();
			break;
		}
		return 0x03;
	},
	_statDo : function( _this, param, code, token ){
		if( _this._statMode == 2 ){
			_this._loopCnt++;
			incProcLoopTotal();
			if( (procLoopMax() > 0) && (_this._loopCnt > procLoopMax()) ){
				return 0x2130;
			}
		}
		return 0x03;
	},
	_statUntil : function( _this, param, code, token ){
		if( _this._statMode == 0 ){
			return 0x2124;
		} else if( _this._statMode == 2 ){
			var ret;
			var tmpValue = new _Matrix();
			if( (ret = _this._const( param, code, token, tmpValue )) != 0x00 ){
				return ret;
			}
			if( tmpValue.equal( 0.0 ) ){
				_this._doStatBreak();
			}
			_this._stat.doEnd();
		}
		return 0x03;
	},
	_statWhile : function( _this, param, code, token ){
		if( _this._statMode == 2 ){
			_this._loopCnt++;
			incProcLoopTotal();
			if( (procLoopMax() > 0) && (_this._loopCnt > procLoopMax()) ){
				return 0x2130;
			}
			var ret;
			var tmpValue = new _Matrix();
			if( (ret = _this._const( param, code, token, tmpValue )) != 0x00 ){
				return ret;
			}
			if( tmpValue.equal( 0.0 ) ){
				_this._doStatBreak();
			}
		}
		return 0x03;
	},
	_statEndWhile : function( _this, param, code, token ){
		switch( _this._statMode ){
		case 0:
			return 0x2125;
		case 2:
			_this._stat.doEnd();
			break;
		}
		return 0x03;
	},
	_statFor : function( _this, param, code, token ){
		if( _this._statMode == 2 ){
			_this._loopCnt++;
			incProcLoopTotal();
			if( (procLoopMax() > 0) && (_this._loopCnt > procLoopMax()) ){
				return 0x2130;
			}
			var ret;
			var tmpValue = new _Matrix();
			if( (ret = _this._const( param, code, token, tmpValue )) != 0x00 ){
				return ret;
			}
			if( tmpValue.equal( 0.0 ) ){
				_this._doStatBreak();
			}
		}
		return 0x03;
	},
	_statFor2 : function( _this, param, code, token ){
		if( _this._statMode == 2 ){
			_this._loopCnt++;
			incProcLoopTotal();
			if( (procLoopMax() > 0) && (_this._loopCnt > procLoopMax()) ){
				return 0x2130;
			}
		}
		return 0x03;
	},
	_statNext : function( _this, param, code, token ){
		switch( _this._statMode ){
		case 0:
			return 0x2128;
		case 2:
			_this._stat.doEnd();
			break;
		}
		return 0x03;
	},
	_statFunc : function( _this, param, code, token ){
		var i;
		if( _this._statMode == 2 ){
			var newCode;
			var newToken;
			if( _this._curLine._token.getTokenParam( param ) ){
				newCode = _get_code;
				newToken = _get_token;
				if( newCode == 0 ){
					if( !(_this._curLine._token.getTokenParam( param )) ){
						return _this._retError( 0x212E, newCode, newToken );
					}
					newCode = _get_code;
					newToken = _get_token;
				}
				if( (newCode == 8) || (newCode == 0x23) || (newCode == 0x46) ){
					_this._stat.doBreak();
					if( param._func.search( newToken, false, null ) != null ){
						return _this._retError( 0x212E, newCode, newToken );
					}
					var func;
					if( (func = param._func.create( newToken, _this._curLine._num + 1 )) != null ){
						i = 0;
						while( _this._curLine._token.getToken() ){
							newCode = _get_code;
							newToken = _get_token;
							switch( newCode ){
							case 0:
							case 15:
								break;
							case 20:
							case 21:
							case 11:
								func._label.addCode( newCode, newToken );
								break;
							case 8:
								if( i <= 9 ){
									func._label.addCode( newCode, newToken );
									i++;
									break;
								}
							default:
								param._func.del( func );
								return _this._retError( 0x212F, newCode, newToken );
							}
						}
						var line;
						while( (line = _this._stat.getLine()) != null ){
							_this._curLine = line;
							func._line.regLine( _this._curLine );
						}
					} else {
						return 0x212B;
					}
					return 0x03;
				}
			}
			return _this._retError( 0x212E, newCode, newToken );
		}
		return 0x03;
	},
	_statEndFunc : function( _this, param, code, token ){
		switch( _this._statMode ){
		case 0:
			return 0x212D;
		case 2:
			_this._stat.doEnd();
			break;
		}
		return 0x03;
	},
	_statIf : function( _this, param, code, token ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._const( param, code, token, tmpValue )) != 0x00 ){
			_this._statIfCnt--;
			return ret;
		}
		_this._statIfMode[_this._statIfCnt] = (tmpValue.notEqual( 0.0 ) ? 1 : 0);
		return 0x03;
	},
	_statElIf : function( _this, param, code, token ){
		if( _this._statIfMode[_this._statIfCnt] == 0 ){
			var ret;
			var tmpValue = new _Matrix();
			if( (ret = _this._const( param, code, token, tmpValue )) != 0x00 ){
				return ret;
			}
			if( tmpValue.notEqual( 0.0 ) ){
				_this._statIfMode[_this._statIfCnt] = 1;
			}
		} else if( _this._statIfMode[_this._statIfCnt] == 1 ){
			_this._statIfMode[_this._statIfCnt] = 2;
		}
		return 0x03;
	},
	_statElse : function( _this, param, code, token ){
		if( _this._statIfMode[_this._statIfCnt] == 0 ){
			_this._statIfMode[_this._statIfCnt] = 1;
		} else if( _this._statIfMode[_this._statIfCnt] == 1 ){
			_this._statIfMode[_this._statIfCnt] = 2;
		}
		return 0x03;
	},
	_statEndIf : function( _this, param, code, token ){
		return 0x03;
	},
	_statSwitch : function( _this, param, code, token ){
		var ret;
		if( (ret = _this._const( param, code, token, _this._statSwiVal[_this._statSwiCnt] )) != 0x00 ){
			_this._statSwiCnt--;
			return ret;
		}
		_this._statSwiMode[_this._statSwiCnt] = 0;
		return 0x03;
	},
	_statCase : function( _this, param, code, token ){
		if( _this._statSwiMode[_this._statSwiCnt] == 0 ){
			var ret;
			var tmpValue = new _Matrix();
			if( (ret = _this._const( param, code, token, tmpValue )) != 0x00 ){
				return ret;
			}
			if( tmpValue.equal( _this._statSwiVal[_this._statSwiCnt] ) ){
				_this._statSwiMode[_this._statSwiCnt] = 1;
			}
		}
		return 0x03;
	},
	_statDefault : function( _this, param, code, token ){
		if( _this._statSwiMode[_this._statSwiCnt] == 0 ){
			_this._statSwiMode[_this._statSwiCnt] = 1;
		}
		return 0x03;
	},
	_statEndSwi : function( _this, param, code, token ){
		return 0x03;
	},
	_statBreakSwi : function( _this, param, code, token ){
		if( _this._statSwiMode[_this._statSwiCnt] == 1 ){
			if( _this._statIfMode[_this._statIfCnt] == 1 ){
				_this._statSwiMode[_this._statSwiCnt] = 2;
			}
		}
		return 0x03;
	},
	_statContinue : function( _this, param, code, token ){
		switch( _this._statMode ){
		case 0:
			return 0x2129;
		case 2:
			_this._stat.doContinue();
			break;
		}
		return 0x03;
	},
	_statBreak : function( _this, param, code, token ){
		switch( _this._statMode ){
		case 0:
			return 0x212A;
		case 2:
			_this._doStatBreak();
			break;
		}
		return 0x03;
	},
	_statContinue2 : function( _this, param, code, token ){
		switch( _this._statMode ){
		case 0:
			return 0x2183;
		case 2:
			var ret;
			var tmpValue = new _Matrix();
			if( (ret = _this._const( param, code, token, tmpValue )) != 0x00 ){
				return 0x2181;
			}
			if( _this._curLine._token._get != null ){
				return 0x2181;
			}
			if( tmpValue.notEqual( 0.0 ) ){
				_this._stat.doContinue();
			}
			break;
		}
		return 0x03;
	},
	_statBreak2 : function( _this, param, code, token ){
		switch( _this._statMode ){
		case 0:
			return 0x2184;
		case 2:
			var ret;
			var tmpValue = new _Matrix();
			if( (ret = _this._const( param, code, token, tmpValue )) != 0x00 ){
				return 0x2181;
			}
			if( _this._curLine._token._get != null ){
				return 0x2181;
			}
			if( tmpValue.notEqual( 0.0 ) ){
				_this._doStatBreak();
			}
			break;
		}
		return 0x03;
	},
	_statAssert : function( _this, param, code, token ){
		if( _this._printAssert ){
			var ret;
			var tmpValue = new _Matrix();
			if( (ret = _this._const( param, code, token, tmpValue )) == 0x00 ){
				if( tmpValue.equal( 0.0 ) ){
					if( _this._assertProc( _this._curLine._num, param ) ){
						return 0x2001;
					}
				}
			} else {
				return ret;
			}
		}
		return 0x03;
	},
	_statReturn : function( _this, param, code, token ){
		if( _this._curLine._token.getTokenLock() ){
			var ret;
			var tmpValue = new _Matrix();
			if( (ret = _this._const( param, code, token, tmpValue )) == 0x00 ){
				if( param._printAns ){
					param._array.setMatrix( 0, tmpValue, true );
				} else {
					_this._errorProc( 0x100C, _this._curLine._num, param, 14, null );
				}
			} else {
				return ret;
			}
		}
		_this._quitFlag = true;
		return 0x03;
	},
	_statReturn2 : function( _this, param, code, token ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._const( param, code, token, tmpValue )) != 0x00 ){
			return 0x2181;
		}
		if( _this._curLine._token._get != null ){
			return 0x2181;
		}
		if( tmpValue.notEqual( 0.0 ) ){
			_this._quitFlag = true;
		}
		return 0x03;
	},
	_statReturn3 : function( _this, param, code, token ){
		var ret;
		var tmpValue = new _Matrix();
		if( (ret = _this._const( param, code, token, tmpValue )) != 0x00 ){
			return 0x2181;
		}
		if( tmpValue.notEqual( 0.0 ) ){
			if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != 0x00 ){
				return 0x2181;
			}
			if( _this._curLine._token._get != null ){
				return 0x2181;
			}
			if( param._printAns ){
				param._array.setMatrix( 0, tmpValue, true );
			} else {
				_this._errorProc( 0x100E, _this._curLine._num, param, 14, null );
			}
			_this._quitFlag = true;
		} else {
			if( (ret = _this._skipSeOperand( code, token )) != 0x00 ){
				return 0x2181;
			}
			if( _this._curLine._token._get != null ){
				return 0x2181;
			}
		}
		return 0x03;
	},
	_commandNull : function( _this, param, code, token ){
		return 0x2140;
	},
	_commandEFloat : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0010 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0010 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			param.setPrec( _INT( value._mat[0].toFloat() ) );
		}
		return 0x03;
	},
	_commandFFloat : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0011 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0011 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			param.setPrec( _INT( value._mat[0].toFloat() ) );
		}
		return 0x03;
	},
	_commandGFloat : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0012 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0012 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			param.setPrec( _INT( value._mat[0].toFloat() ) );
		}
		return 0x03;
	},
	_commandEComplex : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0020 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0020 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			param.setPrec( _INT( value._mat[0].toFloat() ) );
		}
		return 0x03;
	},
	_commandFComplex : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0021 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0021 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			param.setPrec( _INT( value._mat[0].toFloat() ) );
		}
		return 0x03;
	},
	_commandGComplex : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0022 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0022 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			param.setPrec( _INT( value._mat[0].toFloat() ) );
		}
		return 0x03;
	},
	_commandPrec : function( _this, param, code, token ){
		var value = new _Matrix();
		if( _this._const( param, code, token, value ) == 0x00 ){
			param.setPrec( _INT( value._mat[0].toFloat() ) );
			return 0x03;
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandIFract : function( _this, param, code, token ){
		param.setMode( 0x0040 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0040 );
		}
		return 0x03;
	},
	_commandMFract : function( _this, param, code, token ){
		param.setMode( 0x0041 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0041 );
		}
		return 0x03;
	},
	_commandHTime : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0080 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0080 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			var fps = value._mat[0].toFloat();
			param.setFps( fps );
			if( globalParam() != param ){
				globalParam().setFps( fps );
			}
		}
		return 0x03;
	},
	_commandMTime : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0081 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0081 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			var fps = value._mat[0].toFloat();
			param.setFps( fps );
			if( globalParam() != param ){
				globalParam().setFps( fps );
			}
		}
		return 0x03;
	},
	_commandSTime : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0082 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0082 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			var fps = value._mat[0].toFloat();
			param.setFps( fps );
			if( globalParam() != param ){
				globalParam().setFps( fps );
			}
		}
		return 0x03;
	},
	_commandFTime : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0083 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0083 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			var fps = value._mat[0].toFloat();
			param.setFps( fps );
			if( globalParam() != param ){
				globalParam().setFps( fps );
			}
		}
		return 0x03;
	},
	_commandFps : function( _this, param, code, token ){
		var value = new _Matrix();
		if( _this._const( param, code, token, value ) == 0x00 ){
			var fps = value._mat[0].toFloat();
			param.setFps( fps );
			if( globalParam() != param ){
				globalParam().setFps( fps );
			}
			return 0x03;
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandSChar : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0100 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0100 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			param.setRadix( _INT( value._mat[0].toFloat() ) );
		}
		return 0x03;
	},
	_commandUChar : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0101 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0101 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			param.setRadix( _INT( value._mat[0].toFloat() ) );
		}
		return 0x03;
	},
	_commandSShort : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0102 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0102 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			param.setRadix( _INT( value._mat[0].toFloat() ) );
		}
		return 0x03;
	},
	_commandUShort : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0103 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0103 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			param.setRadix( _INT( value._mat[0].toFloat() ) );
		}
		return 0x03;
	},
	_commandSLong : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0104 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0104 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			param.setRadix( _INT( value._mat[0].toFloat() ) );
		}
		return 0x03;
	},
	_commandULong : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0105 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0105 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			param.setRadix( _INT( value._mat[0].toFloat() ) );
		}
		return 0x03;
	},
	_commandSInt : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0104 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0104 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			param.setRadix( _INT( value._mat[0].toFloat() ) );
		}
		return 0x03;
	},
	_commandUInt : function( _this, param, code, token ){
		var value = new _Matrix();
		param.setMode( 0x0105 );
		if( globalParam() != param ){
			globalParam().setMode( 0x0105 );
		}
		if( _this._const( param, code, token, value ) == 0x00 ){
			param.setRadix( _INT( value._mat[0].toFloat() ) );
		}
		return 0x03;
	},
	_commandRadix : function( _this, param, code, token ){
		var value = new _Matrix();
		if( _this._const( param, code, token, value ) == 0x00 ){
			param.setRadix( _INT( value._mat[0].toFloat() ) );
			return 0x03;
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandPType : function( _this, param, code, token ){
		param.setMode( _this._parentMode );
		if( globalParam() != param ){
			globalParam().setMode( _this._parentMode );
		}
		return 0x03;
	},
	_commandRad : function( _this, param, code, token ){
		var value = new _Matrix();
		if( _this._const( param, code, token, value ) != 0x00 ){
			value.ass( 0.0 );
		}
		_this.setAngType( 0, value.notEqual( 0.0 ) );
		return 0x03;
	},
	_commandDeg : function( _this, param, code, token ){
		var value = new _Matrix();
		if( _this._const( param, code, token, value ) != 0x00 ){
			value.ass( 0.0 );
		}
		_this.setAngType( 1, value.notEqual( 0.0 ) );
		return 0x03;
	},
	_commandGrad : function( _this, param, code, token ){
		var value = new _Matrix();
		if( _this._const( param, code, token, value ) != 0x00 ){
			value.ass( 0.0 );
		}
		_this.setAngType( 2, value.notEqual( 0.0 ) );
		return 0x03;
	},
	_commandAngle : function( _this, param, code, token ){
		var value = newMatrixArray( 2 );
		if( _this._const( param, code, token, value[0] ) == 0x00 ){
			var tmp = _UNSIGNED( value[0]._mat[0].toFloat(), 256 );
			if( tmp < 10 ){
				value[1].ass( param._var.val( _UNSIGNED( _CHAR_CODE_0 + tmp, 256 ) ) );
				value[1]._mat[0].angToAng( _this._parentAngType, _this._angType );
				param._var.set( _UNSIGNED( _CHAR_CODE_0 + tmp, 256 ), value[1]._mat[0], true );
				return 0x03;
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandAns : function( _this, param, code, token ){
		var value = new _Matrix();
		if( _this._const( param, code, token, value ) == 0x00 ){
			param._printAns = (_INT( value._mat[0].toFloat() ) != 0);
			return 0x03;
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandAssert : function( _this, param, code, token ){
		var value = new _Matrix();
		if( _this._const( param, code, token, value ) == 0x00 ){
			_this.setAssertFlag( _INT( value._mat[0].toFloat() ) );
			return 0x03;
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandWarn : function( _this, param, code, token ){
		var lock;
		var newCode;
		var newToken;
		var error = new _String();
		lock = _this._curLine._token.lock();
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( newCode == 19 ){
				if( _this._printWarn ){
					_this._formatError(
						newToken,
						param._fileFlag ? param._funcName : null,
						error
						);
					printWarn( error.str(), param._parentNum, param._parentFunc );
				}
				return 0x03;
			} else if( (newCode & 0x40) != 0 ){
				if( _this._printWarn ){
					if( newCode == 0x46 ){
						param = globalParam();
					}
					_this._formatError(
						_this.strGet( param._array, _this.arrayIndexIndirect( param, newCode, newToken ) ),
						param._fileFlag ? param._funcName : null,
						error
						);
					printWarn( error.str(), param._parentNum, param._parentFunc );
				}
				return 0x03;
			} else {
				var value = new _Matrix();
				_this._curLine._token.unlock( lock );
				if( _this._const( param, code, token, value ) == 0x00 ){
					_this.setWarnFlag( _INT( value._mat[0].toFloat() ) );
					return 0x03;
				}
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandParam : function( _this, param, code, token ){
		var value = newMatrixArray( 2 );
		if( _this._const( param, code, token, value[0] ) == 0x00 ){
			if( _this._const( param, code, token, value[1] ) == 0x00 ){
				var tmp = _UNSIGNED( value[0]._mat[0].toFloat(), 256 );
				if( tmp < 10 ){
					param._updateParam[tmp] = (_INT( value[1]._mat[0].toFloat() ) != 0);
					return 0x03;
				}
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandParams : function( _this, param, code, token ){
		var i;
		var lock;
		var newCode;
		var newToken;
		var label;
		lock = _this._curLine._token.lock();
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( (newCode == 20) || ((newCode == 11) && (newToken >= 21)) ){
				if( !(_this._curLine._token.getTokenParam( param )) ){
					return _this._retError( 0x2141, code, token );
				}
				newCode = _get_code;
				newToken = _get_token;
				param._updateParam[0] = true;
			} else {
				param._updateParam[0] = false;
			}
			if( (newCode == 8) || (newCode == 0x23) || (newCode == 0x46) ){
				label = newToken;
				lock = _this._curLine._token.lock();
				if( _this._curLine._token.getToken() ){
					newCode = _get_code;
					newToken = _get_token;
					if( newCode == 21 ){
						param._array._label.setLabel( _CHAR_CODE_0, label, true );
					} else {
						_this._curLine._token.unlock( lock );
						param._var._label.setLabel( _CHAR_CODE_0, label, true );
					}
				} else {
					_this._curLine._token.unlock( lock );
					param._var._label.setLabel( _CHAR_CODE_0, label, true );
				}
				i = 1;
				while( _this._curLine._token.getTokenParam( param ) ){
					newCode = _get_code;
					newToken = _get_token;
					if( i > 9 ){
						return _this._retError( 0x2144, code, token );
					}
					if( (newCode == 20) || ((newCode == 11) && (newToken >= 21)) ){
						if( !(_this._curLine._token.getTokenParam( param )) ){
							return _this._retError( 0x2141, code, token );
						}
						newCode = _get_code;
						newToken = _get_token;
						param._updateParam[i] = true;
					} else {
						param._updateParam[i] = false;
					}
					switch( newCode ){
					case 0x22:
					case 0x45:
						return _this._retError( 0x2142, newCode, newToken );
					case 8:
					case 0x23:
					case 0x46:
						label = newToken;
						lock = _this._curLine._token.lock();
						if( _this._curLine._token.getToken() ){
							newCode = _get_code;
							newToken = _get_token;
							if( newCode == 21 ){
								param._array._label.setLabel( _CHAR_CODE_0 + i, label, true );
							} else {
								_this._curLine._token.unlock( lock );
								param._var._label.setLabel( _CHAR_CODE_0 + i, label, true );
							}
						} else {
							_this._curLine._token.unlock( lock );
							param._var._label.setLabel( _CHAR_CODE_0 + i, label, true );
						}
						i++;
						break;
					default:
						return _this._retError( 0x2141, code, token );
					}
				}
				return 0x03;
			}
		}
		var value = new _Matrix();
		_this._curLine._token.unlock( lock );
		i = 0;
		while( _this._const( param, code, token, value ) == 0x00 ){
			if( i > 9 ){
				return _this._retError( 0x2144, code, token );
			}
			param._updateParam[i] = (_INT( value._mat[0].toFloat() ) != 0);
			i++;
		}
		return 0x03;
	},
	_commandDefine : function( _this, param, code, token ){
		var newCode;
		var newToken;
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			switch( newCode ){
			case 0x22:
			case 0x45:
				return _this._retError( 0x2142, newCode, newToken );
			case 8:
			case 0x23:
			case 0x46:
				var value = new _Matrix();
				if( _this._const( param, code, token, value ) == 0x00 ){
					param._var.define( newToken, value._mat[0], true );
				} else {
					param._var.define( newToken, 1.0, true );
				}
				return 0x03;
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandEnum : function( _this, param, code, token ){
		var value = new _Matrix();
		var newCode;
		var newToken;
		var lock;
		var tmpCode;
		var tmpToken;
		value.ass( 0.0 );
		while( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			switch( newCode ){
			case 0x22:
			case 0x45:
				return _this._retError( 0x2142, newCode, newToken );
			case 8:
			case 0x23:
			case 0x46:
				lock = _this._curLine._token.lock();
				if( _this._curLine._token.getTokenParam( param ) ){
					tmpCode = _get_code;
					tmpToken = _get_token;
					if( (tmpCode == 8) || (tmpCode == 0x23) || (tmpCode == 0x46) ){
						_this._curLine._token.unlock( lock );
					} else {
						_this._curLine._token.unlock( lock );
						if( _this._const( param, tmpCode, tmpToken, value ) != 0x00 ){
							return _this._retError( 0x2141, code, token );
						}
					}
				} else {
					_this._curLine._token.unlock( lock );
				}
				param._var.define( newToken, _INT( value._mat[0].toFloat() ), true );
				value.addAndAss( 1.0 );
				break;
			default:
				return _this._retError( 0x2141, code, token );
			}
		}
		return 0x03;
	},
	_commandUnDef : function( _this, param, code, token ){
		var newCode;
		var newToken;
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( (newCode == 8) || (newCode == 0x23) || (newCode == 0x46) ){
				return _this._retError( 0x2143, newCode, newToken );
			} else if( (newCode & 0x20) != 0 ){
				param._var.undef( param._var._label._label[_this.varIndexIndirect( param, newCode, newToken )] );
				return 0x03;
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandVar : function( _this, param, code, token ){
		var newCode;
		var newToken;
		while( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			switch( newCode ){
			case 0x22:
			case 0x45:
				return _this._retError( 0x2142, newCode, newToken );
			case 8:
			case 0x23:
			case 0x46:
				param._var.define( newToken, 0.0, false );
				break;
			default:
				return _this._retError( 0x2141, code, token );
			}
		}
		return 0x03;
	},
	_commandArray : function( _this, param, code, token ){
		var newCode;
		var newToken;
		while( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			switch( newCode ){
			case 0x22:
			case 0x45:
				return _this._retError( 0x2142, newCode, newToken );
			case 8:
			case 0x23:
			case 0x46:
				param._array.define( newToken );
				break;
			default:
				return _this._retError( 0x2141, code, token );
			}
		}
		return 0x03;
	},
	_commandLocal : function( _this, param, code, token ){
		var lock;
		var newCode;
		var newToken;
		var label;
		while( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			switch( newCode ){
			case 0x22:
			case 0x45:
				return _this._retError( 0x2142, newCode, newToken );
			case 8:
			case 0x23:
			case 0x46:
				label = newToken;
				lock = _this._curLine._token.lock();
				if( _this._curLine._token.getToken() ){
					newCode = _get_code;
					newToken = _get_token;
					if( newCode == 21 ){
						param._array.define( label );
					} else {
						_this._curLine._token.unlock( lock );
						param._var.define( label, 0.0, false );
					}
				} else {
					_this._curLine._token.unlock( lock );
					param._var.define( label, 0.0, false );
				}
				break;
			default:
				return _this._retError( 0x2141, code, token );
			}
		}
		return 0x03;
	},
	_commandGlobal : function( _this, param, code, token ){
		var lock;
		var newCode;
		var newToken;
		var label;
		while( _this._curLine._token.getTokenParam( globalParam() ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( newCode == 8 ){
				label = newToken;
				lock = _this._curLine._token.lock();
				if( _this._curLine._token.getToken() ){
					newCode = _get_code;
					newToken = _get_token;
					if( newCode == 21 ){
						globalParam()._array.define( label );
					} else {
						_this._curLine._token.unlock( lock );
						globalParam()._var.define( label, 0.0, false );
					}
				} else {
					_this._curLine._token.unlock( lock );
					globalParam()._var.define( label, 0.0, false );
				}
			} else {
				lock = _this._curLine._token.lock();
				if( _this._curLine._token.getToken() ){
					if( _get_code == 21 ){
						if( (newCode & 0x40) == 0 ){
							return _this._retError( 0x2142, newCode, newToken );
						}
					} else {
						_this._curLine._token.unlock( lock );
					}
				} else {
					_this._curLine._token.unlock( lock );
					if( (newCode & 0x20) == 0 ){
						return _this._retError( 0x2142, newCode, newToken );
					}
				}
			}
		}
		return 0x03;
	},
	_commandLabel : function( _this, param, code, token ){
		var newCode;
		var newToken;
		var label;
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			switch( newCode ){
			case 0x22:
			case 0x45:
				return _this._retError( 0x2142, newCode, newToken );
			case 8:
			case 0x23:
			case 0x46:
				label = newToken;
				if( _this._curLine._token.getTokenParam( param ) ){
					newCode = _get_code;
					newToken = _get_token;
					if( newCode == 0x21 ){
						param._var._label.setLabel( _this.varIndexParam( param, newToken ), label, true );
						return 0x03;
					} else if( newCode == 0x44 ){
						param._array._label.setLabel( _this.arrayIndexParam( param, newToken ), label, true );
						return 0x03;
					}
				}
				break;
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandParent : function( _this, param, code, token ){
		var newCode;
		var newToken;
		var index;
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( newCode == 0x21 ){
				index = _this.varIndexParam( param, newToken );
				if( param._parent != null ){
					param.setVal( index, param._parent._var.val( index ), true );
					if( index == 0 ){
						_this._updateMatrix( param._parent, param._array._mat[index] );
					} else {
						_this._updateValue( param._parent, param._var.val( index ) );
					}
					param._updateParentVar[param._updateParentVar.length] = index;
				}
				if( _this._curLine._token.getTokenParam( param ) ){
					newCode = _get_code;
					newToken = _get_token;
					switch( newCode ){
					case 0x22:
					case 0x45:
						return _this._retError( 0x2142, newCode, newToken );
					case 8:
					case 0x23:
					case 0x46:
						param._var._label.setLabel( index, newToken, true );
						break;
					default:
						return _this._retError( 0x2141, code, token );
					}
				}
				return 0x03;
			} else if( newCode == 0x44 ){
				index = _this.arrayIndexParam( param, newToken );
				if( param._parent != null ){
					param._parent._array.dup( param._array, index, index, true );
					param._updateParentArray[param._updateParentArray.length] = index;
				}
				if( _this._curLine._token.getTokenParam( param ) ){
					newCode = _get_code;
					newToken = _get_token;
					switch( newCode ){
					case 0x22:
					case 0x45:
						return _this._retError( 0x2142, newCode, newToken );
					case 8:
					case 0x23:
					case 0x46:
						param._array._label.setLabel( index, newToken, true );
						break;
					default:
						return _this._retError( 0x2141, code, token );
					}
				}
				return 0x03;
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandReal : function( _this, param, code, token ){
		var newCode;
		var newToken;
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			var value = new _Matrix();
			if( _this._const( param, code, token, value ) == 0x00 ){
				if( (newCode & 0x20) != 0 ){
					if( newCode == 0x23 ){
						param = globalParam();
					}
					var moveFlag = new _Boolean();
					var index = _this.varIndexIndirectMove( param, newCode, newToken, moveFlag );
					if( !(param.setReal( index, value._mat[0].toFloat(), moveFlag._val )) ){
						return _this._retError( 0x210E, newCode, newToken );
					}
					return 0x03;
				}
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandImag : function( _this, param, code, token ){
		var newCode;
		var newToken;
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			var value = new _Matrix();
			if( _this._const( param, code, token, value ) == 0x00 ){
				if( (newCode & 0x20) != 0 ){
					if( newCode == 0x23 ){
						param = globalParam();
					}
					var moveFlag = new _Boolean();
					var index = _this.varIndexIndirectMove( param, newCode, newToken, moveFlag );
					if( !(param.setImag( index, value._mat[0].toFloat(), moveFlag._val )) ){
						return _this._retError( 0x210E, newCode, newToken );
					}
					return 0x03;
				}
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandNum : function( _this, param, code, token ){
		var newCode;
		var newToken;
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			var value = new _Matrix();
			if( _this._const( param, code, token, value ) == 0x00 ){
				if( (newCode & 0x20) != 0 ){
					if( newCode == 0x23 ){
						param = globalParam();
					}
					var moveFlag = new _Boolean();
					var index = _this.varIndexIndirectMove( param, newCode, newToken, moveFlag );
					if( !(param.setNum( index, _UNSIGNED( value._mat[0].toFloat(), 4294967296 ), moveFlag._val )) ){
						return _this._retError( 0x210E, newCode, newToken );
					}
					return 0x03;
				}
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandDenom : function( _this, param, code, token ){
		var newCode;
		var newToken;
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			var value = new _Matrix();
			if( _this._const( param, code, token, value ) == 0x00 ){
				if( (newCode & 0x20) != 0 ){
					if( newCode == 0x23 ){
						param = globalParam();
					}
					var moveFlag = new _Boolean();
					var index = _this.varIndexIndirectMove( param, newCode, newToken, moveFlag );
					if( !(param.setDenom( index, _UNSIGNED( value._mat[0].toFloat(), 4294967296 ), moveFlag._val )) ){
						return _this._retError( 0x210E, newCode, newToken );
					}
					return 0x03;
				}
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandMat : function( _this, param, code, token ){
		var value = newMatrixArray( 2 );
		var newCode;
		var newToken;
		if( _this._const( param, code, token, value[0] ) == 0x00 ){
			if( _this._const( param, code, token, value[1] ) == 0x00 ){
				if( _this._curLine._token.getTokenParam( param ) ){
					newCode = _get_code;
					newToken = _get_token;
					if( (newCode & 0x40) != 0 ){
						if( newCode == 0x46 ){
							param = globalParam();
						}
						var index = _this.arrayIndexIndirect( param, newCode, newToken );
						param._array._mat[index].resize( _INT( value[0]._mat[0].toFloat() ), _INT( value[1]._mat[0].toFloat() ) );
						return 0x03;
					} else if( (newCode == 8) || (newCode == 0x23) ){
						var index = param._array.define( newToken );
						param._array._mat[index].resize( _INT( value[0]._mat[0].toFloat() ), _INT( value[1]._mat[0].toFloat() ) );
						return 0x03;
					}
				}
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandTrans : function( _this, param, code, token ){
		var newCode;
		var newToken;
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( (newCode & 0x40) != 0 ){
				if( newCode == 0x46 ){
					param = globalParam();
				}
				var index = _this.arrayIndexIndirect( param, newCode, newToken );
				param._array.setMatrix( index, param._array._mat[index].trans(), false );
				return 0x03;
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandSRand : function( _this, param, code, token ){
		var value = new _Matrix();
		if( _this._const( param, code, token, value ) == 0x00 ){
			srand( _INT( value._mat[0].toFloat() ) );
			return 0x03;
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandLocalTime : function( _this, param, code, token ){
		var i;
		var value = new _Matrix();
		var newCode;
		var newToken;
		var format = new _String();
		var errFlag;
		var curIndex;
		var moveFlag = new _Boolean();
		if( _this._const( param, code, token, value ) != 0x00 ){
			return _this._retError( 0x2141, code, token );
		}
		_this._getString( param, format );
		if( format.isNull() ){
			return _this._retError( 0x210B, code, token );
		}
		var t = _INT( value._mat[0].toFloat() );
		var tm = localtime( t );
		errFlag = false;
		for( i = 0; i < format.str().length; i++ ){
			if( format.str().charAt( i ) == '%' ){
				i++;
				if( i >= format.str().length ){
					errFlag = true;
					break;
				}
				if( _this._curLine._token.getTokenParam( param ) ){
					newCode = _get_code;
					newToken = _get_token;
					if( (newCode & 0x20) != 0 ){
						if( newCode == 0x23 ){
							curIndex = _this.varIndexIndirectMove( globalParam(), newCode, newToken, moveFlag );
						} else {
							curIndex = _this.varIndexIndirectMove( param, newCode, newToken, moveFlag );
						}
					} else {
						errFlag = true;
						break;
					}
				}
				switch( format.str().charAt( i ) ){
				case 's': param._var.set( curIndex, tm._sec , moveFlag._val ); break;
				case 'm': param._var.set( curIndex, tm._min , moveFlag._val ); break;
				case 'h': param._var.set( curIndex, tm._hour, moveFlag._val ); break;
				case 'D': param._var.set( curIndex, tm._mday, moveFlag._val ); break;
				case 'M': param._var.set( curIndex, tm._mon , moveFlag._val ); break;
				case 'Y': param._var.set( curIndex, tm._year, moveFlag._val ); break;
				case 'w': param._var.set( curIndex, tm._wday, moveFlag._val ); break;
				case 'y': param._var.set( curIndex, tm._yday, moveFlag._val ); break;
				default:
					errFlag = true;
					break;
				}
				if( errFlag ){
					break;
				}
			}
		}
		format = null;
		if( errFlag ){
			return _this._retError( 0x2141, code, token );
		}
		return 0x03;
	},
	_commandArrayCopy : function( _this, param, code, token ){
		var i;
		var lock;
		var newCode;
		var newToken;
		var value = new _Matrix();
		var srcCode;
		var srcToken;
		var srcIndex = new Array();
		var dstCode;
		var dstToken;
		var dstIndex = new Array();
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( (newCode & 0x40) != 0 ){
				srcCode = newCode;
				srcToken = newToken;
			} else {
				return _this._retError( 0x2141, code, token );
			}
		} else {
			return _this._retError( 0x2141, code, token );
		}
		i = 0;
		if( _this._const( param, code, token, value ) == 0x00 ){
			srcIndex[i] = _INT( value._mat[0].toFloat() );
			i++;
		} else {
			return _this._retError( 0x2141, code, token );
		}
		while( true ){
			lock = _this._curLine._token.lock();
			if( _this._curLine._token.getTokenParam( param ) ){
				newCode = _get_code;
				newToken = _get_token;
				if( (newCode & 0x40) != 0 ){
					dstCode = newCode;
					dstToken = newToken;
					break;
				}
			}
			_this._curLine._token.unlock( lock );
			if( _this._const( param, code, token, value ) == 0x00 ){
				srcIndex[i] = _INT( value._mat[0].toFloat() );
				i++;
			} else {
				return _this._retError( 0x2141, code, token );
			}
		}
		i = 0;
		while( true ){
			if( _this._const( param, code, token, value ) == 0x00 ){
				dstIndex[i] = _INT( value._mat[0].toFloat() );
				i++;
			} else {
				if( i == 0 ){
					return _this._retError( 0x2141, code, token );
				}
				break;
			}
		}
		var dstIndexSize = dstIndex.length - 1;
		var len = dstIndex[dstIndexSize];
		if( len > 0 ){
			var srcIndexSize = srcIndex.length;
			var srcParam;
			var srcValue = newValueArray( len );
			for( i = 0; i < srcIndexSize; i++ ){
				srcIndex[i] -= param._base;
				if( srcIndex[i] < 0 ){
					return _this._retError( 0x2141, code, token );
				}
			}
			srcIndex[srcIndexSize] = -1;
			for( i = 0; i < dstIndexSize; i++ ){
				dstIndex[i] -= param._base;
				if( dstIndex[i] < 0 ){
					return _this._retError( 0x2141, code, token );
				}
			}
			dstIndex[dstIndexSize] = -1;
			srcIndex[srcIndexSize - 1] += len;
			for( i = 0; i < len; i++ ){
				srcIndex[srcIndexSize - 1]--;
				srcParam = (srcCode == 0x46) ? globalParam() : param;
				copyValue( srcValue[i], srcParam._array.val( _this.arrayIndexIndirect( srcParam, srcCode, srcToken ), srcIndex, srcIndexSize ) );
			}
			dstIndex[dstIndexSize - 1] += len;
			for( i = 0; i < len; i++ ){
				dstIndex[dstIndexSize - 1]--;
				switch( dstCode ){
				case 0x44:
					param._array.set( _this._index( param, dstCode, dstToken ), dstIndex, dstIndexSize, srcValue[i], true );
					break;
				case 0x45:
					param._array.set( _this.autoArrayIndex( param, dstToken ), dstIndex, dstIndexSize, srcValue[i], false );
					break;
				case 0x46:
					globalParam()._array.set( _this.autoArrayIndex( globalParam(), dstToken ), dstIndex, dstIndexSize, srcValue[i], false );
					break;
				}
			}
		}
		return 0x03;
	},
	_commandArrayFill : function( _this, param, code, token ){
		var i;
		var newCode;
		var newToken;
		var srcValue = new _Matrix();
		var tmpValue = new _Matrix();
		var dstCode;
		var dstToken;
		var dstIndex = new Array();
		if( _this._const( param, code, token, srcValue ) != 0x00 ){
			return _this._retError( 0x2141, code, token );
		}
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( (newCode & 0x40) != 0 ){
				dstCode = newCode;
				dstToken = newToken;
			} else {
				return _this._retError( 0x2141, code, token );
			}
		} else {
			return _this._retError( 0x2141, code, token );
		}
		i = 0;
		while( true ){
			if( _this._const( param, code, token, tmpValue ) == 0x00 ){
				dstIndex[i] = _INT( tmpValue._mat[0].toFloat() );
				i++;
			} else {
				if( i == 0 ){
					return _this._retError( 0x2141, code, token );
				}
				break;
			}
		}
		var dstIndexSize = dstIndex.length - 1;
		var len = dstIndex[dstIndexSize];
		if( len > 0 ){
			for( i = 0; i < dstIndexSize; i++ ){
				dstIndex[i] -= param._base;
				if( dstIndex[i] < 0 ){
					return _this._retError( 0x2141, code, token );
				}
			}
			dstIndex[dstIndexSize] = -1;
			dstIndex[dstIndexSize - 1] += len;
			for( i = 0; i < len; i++ ){
				dstIndex[dstIndexSize - 1]--;
				switch( dstCode ){
				case 0x44:
					param._array.set( _this._index( param, dstCode, dstToken ), dstIndex, dstIndexSize, srcValue._mat[0], true );
					break;
				case 0x45:
					param._array.set( _this.autoArrayIndex( param, dstToken ), dstIndex, dstIndexSize, srcValue._mat[0], false );
					break;
				case 0x46:
					globalParam()._array.set( _this.autoArrayIndex( globalParam(), dstToken ), dstIndex, dstIndexSize, srcValue._mat[0], false );
					break;
				}
			}
		}
		return 0x03;
	},
	_commandStrCpy : function( _this, param, code, token ){
		var newCode;
		var newToken;
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( (newCode & 0x40) != 0 ){
				var tmpParam = (newCode == 0x46) ? globalParam() : param;
				var _arrayIndex = _this.arrayIndexIndirect( tmpParam, newCode, newToken );
				var string = new _String();
				_this._getString( param, string );
				switch( token ){
				case 53:
					_this.strSet( tmpParam._array, _arrayIndex, string.str() );
					break;
				case 54:
					_this.strCat( tmpParam._array, _arrayIndex, string.str() );
					break;
				}
				return 0x03;
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandStrLwr : function( _this, param, code, token ){
		var newCode;
		var newToken;
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( (newCode & 0x40) != 0 ){
				var tmpParam = (newCode == 0x46) ? globalParam() : param;
				var _arrayIndex = _this.arrayIndexIndirect( tmpParam, newCode, newToken );
				_this.strLwr( tmpParam._array, _arrayIndex );
				return 0x03;
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandStrUpr : function( _this, param, code, token ){
		var newCode;
		var newToken;
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( (newCode & 0x40) != 0 ){
				var tmpParam = (newCode == 0x46) ? globalParam() : param;
				var _arrayIndex = _this.arrayIndexIndirect( tmpParam, newCode, newToken );
				_this.strUpr( tmpParam._array, _arrayIndex );
				return 0x03;
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandPrint : function( _this, param, code, token ){
		var newCode;
		var newToken;
		var _arrayIndex = new Array( 2 );
		var topPrint;
		var curPrint;
		var tmpPrint;
		var errFlag;
		var lock;
		var value = new _Matrix();
		var real = new _String();
		var imag = new _String();
		switch( token ){
		case 61:
			if( _this._curLine._token.getTokenParam( param ) ){
				newCode = _get_code;
				newToken = _get_token;
				if( (newCode & 0x40) != 0 ){
					if( newCode == 0x46 ){
						_arrayIndex[0] = _this.arrayIndexIndirect( globalParam(), newCode, newToken );
					} else {
						_arrayIndex[0] = _this.arrayIndexIndirect( param, newCode, newToken );
					}
				} else {
					return _this._retError( 0x2141, code, token );
				}
			} else {
				return _this._retError( 0x2141, code, token );
			}
			break;
		case 59:
		case 60:
			break;
		case 100:
			if( skipCommandLog() ){
				while( true ){
					if( !(_this._curLine._token.getTokenParam( param )) ){
						break;
					}
				}
				return 0x03;
			}
			break;
		}
		topPrint = null;
		errFlag = false;
		while( true ){
			lock = _this._curLine._token.lock();
			if( !(_this._curLine._token.getTokenParam( param )) ){
				break;
			}
			newCode = _get_code;
			newToken = _get_token;
			if( topPrint == null ){
				topPrint = new __ProcPrint();
				curPrint = topPrint;
			} else {
				tmpPrint = new __ProcPrint();
				curPrint._next = tmpPrint;
				curPrint = tmpPrint;
			}
			curPrint._string = null;
			if( newCode == 19 ){
				curPrint._string = new String();
				curPrint._string = newToken;
			} else if( (newCode & 0x40) != 0 ){
				var tmpParam = (newCode == 0x46) ? globalParam() : param;
				_arrayIndex[1] = _this.arrayIndexIndirect( tmpParam, newCode, newToken );
				curPrint._string = new String();
				curPrint._string = _this.strGet( tmpParam._array, _arrayIndex[1] );
			} else {
				_this._curLine._token.unlock( lock );
				if( _this._const( param, code, token, value ) == 0x00 ){
					_this._token.valueToString( param, value._mat[0], real, imag );
					curPrint._string = new String();
					curPrint._string = real.str() + imag.str();
				} else {
					errFlag = true;
					break;
				}
			}
		}
		if( !errFlag ){
			switch( token ){
			case 61:
				_this.strSet( param._array, _arrayIndex[0], "" );
				curPrint = topPrint;
				while( curPrint != null ){
					if( curPrint._string != null ){
						_this.strCat( param._array, _arrayIndex[0], curPrint._string );
					}
					curPrint = curPrint._next;
				}
				break;
			case 59:
				doCommandPrint( topPrint, false );
				break;
			case 60:
				doCommandPrint( topPrint, true );
				break;
			case 100:
				doCommandLog( topPrint );
				break;
			}
		}
		curPrint = topPrint;
		while( curPrint != null ){
			tmpPrint = curPrint;
			curPrint = curPrint._next;
			if( tmpPrint._string != null ){
				tmpPrint._string = null;
			}
			tmpPrint = null;
		}
		if( errFlag ){
			return _this._retError( 0x2141, code, token );
		}
		return 0x03;
	},
	_commandScan : function( _this, param, code, token ){
		var newCode;
		var newToken;
		var ret = 0x00;
		var topScan;
		var curScan;
		var tmpScan;
		topScan = new __ProcScan();
		curScan = topScan;
		while( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( newCode == 19 ){
				curScan._title = new String();
				curScan._title = newToken;
			} else if( ((newCode & 0x20) != 0) || ((newCode & 0x40) != 0) ){
				switch( newCode ){
				case 0x21:
					if( param._var.isLocked( _this.varIndexParam( param, newToken ) ) ){
						ret = _this._retError( 0x210E, code, token );
					}
					break;
				case 0x22:
					if( param._var.isLocked( _this.autoVarIndex( param, newToken ) ) ){
						ret = _this._retError( 0x210E, code, token );
					}
					break;
				case 0x23:
					if( globalParam()._var.isLocked( _this.autoVarIndex( globalParam(), newToken ) ) ){
						ret = _this._retError( 0x210E, code, token );
					}
					break;
				}
				_this._token.delToken( curScan._code, curScan._token );
				curScan._code = newCode;
				switch( newCode ){
				case 0x21:
					curScan._token = _this.varIndexParam( param, newToken );
					break;
				case 0x44:
					curScan._token = _this.arrayIndexParam( param, newToken );
					break;
				default:
					curScan._token = _this._token.newToken( newCode, newToken );
					break;
				}
				tmpScan = new __ProcScan();
				tmpScan._before = curScan;
				curScan._next = tmpScan;
				curScan = tmpScan;
			}
		}
		if( curScan._title != null ){
			curScan._title = null;
		}
		if( curScan._before != null ){
			curScan._before._next = null;
			if( ret == 0x00 ){
				doCommandScan( topScan, _this, param );
			}
			curScan = topScan;
			while( curScan != null ){
				tmpScan = curScan;
				curScan = curScan._next;
				if( tmpScan._title != null ){
					tmpScan._title = null;
				}
				tmpScan = null;
			}
		}
		if( ret != 0x00 ){
			return ret;
		}
		return 0x03;
	},
	_commandClear : function( _this, param, code, token ){
		doCommandClear();
		return 0x03;
	},
	_commandError : function( _this, param, code, token ){
		var newCode;
		var newToken;
		var error = new _String();
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( newCode == 19 ){
				_this._formatError(
					newToken,
					param._fileFlag ? param._funcName : null,
					error
					);
				printError( error.str(), param._parentNum, param._parentFunc );
				return 0x03;
			} else if( (newCode & 0x40) != 0 ){
				if( newCode == 0x46 ){
					param = globalParam();
				}
				_this._formatError(
					_this.strGet( param._array, _this.arrayIndexIndirect( param, newCode, newToken ) ),
					param._fileFlag ? param._funcName : null,
					error
					);
				printError( error.str(), param._parentNum, param._parentFunc );
				return 0x03;
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandGWorld : function( _this, param, code, token ){
		var ret = 0x00;
		var value = newMatrixArray( 2 );
		for( var i = 0; i < 2; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == 0x00 ){
			var width = _INT( value[0]._mat[0].toFloat() );
			var height = _INT( value[1]._mat[0].toFloat() );
			doCommandGWorld( width, height );
			procGWorld().create( width, height, true );
			return 0x03;
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandWindow : function( _this, param, code, token ){
		var ret = 0x00;
		var value = newMatrixArray( 4 );
		for( var i = 0; i < 4; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == 0x00 ){
			var left = value[0]._mat[0].toFloat();
			var bottom = value[1]._mat[0].toFloat();
			var right = value[2]._mat[0].toFloat();
			var top = value[3]._mat[0].toFloat();
			doCommandWindow( left, bottom, right, top );
			procGWorld().setWindowIndirect( left, bottom, right, top );
			return 0x03;
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandGClear : function( _this, param, code, token ){
		var value = new _Matrix();
		if( _this._const( param, code, token, value ) == 0x00 ){
			procGWorld().clear( _UNSIGNED( value._mat[0].toFloat(), 256 ) );
		} else {
			procGWorld().clear( 0 );
		}
		return 0x03;
	},
	_commandGColor : function( _this, param, code, token ){
		var value = newMatrixArray( 2 );
		if( _this._const( param, code, token, value[0] ) == 0x00 ){
			var color = _UNSIGNED( value[0]._mat[0].toFloat(), 256 );
			if( _this._const( param, code, token, value[1] ) == 0x00 ){
				doCommandGColor( color, _UNSIGNED( value[1]._mat[0].toFloat(), 16777216 ) );
			}
			procGWorld().setColor( color );
			return 0x03;
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandGFill : function( _this, param, code, token ){
		var ret = 0x00;
		var value = newMatrixArray( 5 );
		for( var i = 0; i < 4; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == 0x00 ){
			if( _this._const( param, code, token, value[4] ) == 0x00 ){
				procGWorld().setColor( _UNSIGNED( value[4]._mat[0].toFloat(), 256 ) );
			}
			procGWorld().fill(
				_INT( value[0]._mat[0].toFloat() ), _INT( value[1]._mat[0].toFloat() ),
				_INT( value[2]._mat[0].toFloat() ), _INT( value[3]._mat[0].toFloat() )
				);
			return 0x03;
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandWFill : function( _this, param, code, token ){
		var ret = 0x00;
		var value = newMatrixArray( 5 );
		for( var i = 0; i < 4; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == 0x00 ){
			if( _this._const( param, code, token, value[4] ) == 0x00 ){
				procGWorld().setColor( _UNSIGNED( value[4]._mat[0].toFloat(), 256 ) );
			}
			procGWorld().wndFill(
				value[0]._mat[0].toFloat(), value[1]._mat[0].toFloat(),
				value[2]._mat[0].toFloat(), value[3]._mat[0].toFloat()
				);
			return 0x03;
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandGMove : function( _this, param, code, token ){
		var ret = 0x00;
		var value = newMatrixArray( 2 );
		for( var i = 0; i < 2; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == 0x00 ){
			procGWorld().moveTo( _INT( value[0]._mat[0].toFloat() ), _INT( value[1]._mat[0].toFloat() ) );
			return 0x03;
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandWMove : function( _this, param, code, token ){
		var ret = 0x00;
		var value = newMatrixArray( 2 );
		for( var i = 0; i < 2; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == 0x00 ){
			procGWorld().wndMoveTo( value[0]._mat[0].toFloat(), value[1]._mat[0].toFloat() );
			return 0x03;
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandGText : function( _this, param, code, token ){
		var text = new _String();
		var ret = 0x00;
		var value = newMatrixArray( 3 );
		_this._getString( param, text );
		if( text.isNull() ){
			return _this._retError( 0x210B, code, token );
		}
		ret = _this._const( param, code, token, value[0] );
		if( _this._const( param, code, token, value[1] ) == 0x00 ){
			if( _this._const( param, code, token, value[2] ) == 0x00 ){
				procGWorld().setColor( _UNSIGNED( value[2]._mat[0].toFloat(), 256 ) );
			}
			procGWorld().drawText( text.str(), _INT( value[0]._mat[0].toFloat() ), _INT( value[1]._mat[0].toFloat() ), false );
		} else {
			if( ret == 0x00 ){
				procGWorld().setColor( _UNSIGNED( value[0]._mat[0].toFloat(), 256 ) );
			}
			procGWorld().drawTextTo( text.str(), false );
		}
		return 0x03;
	},
	_commandGTextR : function( _this, param, code, token ){
		var text = new _String();
		var ret = 0x00;
		var value = newMatrixArray( 3 );
		_this._getString( param, text );
		if( text.isNull() ){
			return _this._retError( 0x210B, code, token );
		}
		ret = _this._const( param, code, token, value[0] );
		if( _this._const( param, code, token, value[1] ) == 0x00 ){
			if( _this._const( param, code, token, value[2] ) == 0x00 ){
				procGWorld().setColor( _UNSIGNED( value[2]._mat[0].toFloat(), 256 ) );
			}
			procGWorld().drawText( text.str(), _INT( value[0]._mat[0].toFloat() ), _INT( value[1]._mat[0].toFloat() ), true );
		} else {
			if( ret == 0x00 ){
				procGWorld().setColor( _UNSIGNED( value[0]._mat[0].toFloat(), 256 ) );
			}
			procGWorld().drawTextTo( text.str(), true );
		}
		return 0x03;
	},
	_commandWText : function( _this, param, code, token ){
		var text = new _String();
		var ret = 0x00;
		var value = newMatrixArray( 3 );
		_this._getString( param, text );
		if( text.isNull() ){
			return _this._retError( 0x210B, code, token );
		}
		ret = _this._const( param, code, token, value[0] );
		if( _this._const( param, code, token, value[1] ) == 0x00 ){
			if( _this._const( param, code, token, value[2] ) == 0x00 ){
				procGWorld().setColor( _UNSIGNED( value[2]._mat[0].toFloat(), 256 ) );
			}
			procGWorld().wndDrawText( text.str(), value[0]._mat[0].toFloat(), value[1]._mat[0].toFloat(), false );
		} else {
			if( ret == 0x00 ){
				procGWorld().setColor( _UNSIGNED( value[0]._mat[0].toFloat(), 256 ) );
			}
			procGWorld().wndDrawTextTo( text.str(), false );
		}
		return 0x03;
	},
	_commandWTextR : function( _this, param, code, token ){
		var text = new _String();
		var ret = 0x00;
		var value = newMatrixArray( 3 );
		_this._getString( param, text );
		if( text.isNull() ){
			return _this._retError( 0x210B, code, token );
		}
		ret = _this._const( param, code, token, value[0] );
		if( _this._const( param, code, token, value[1] ) == 0x00 ){
			if( _this._const( param, code, token, value[2] ) == 0x00 ){
				procGWorld().setColor( _UNSIGNED( value[2]._mat[0].toFloat(), 256 ) );
			}
			procGWorld().wndDrawText( text.str(), value[0]._mat[0].toFloat(), value[1]._mat[0].toFloat(), true );
		} else {
			if( ret == 0x00 ){
				procGWorld().setColor( _UNSIGNED( value[0]._mat[0].toFloat(), 256 ) );
			}
			procGWorld().wndDrawTextTo( text.str(), true );
		}
		return 0x03;
	},
	_commandGTextL : function( _this, param, code, token ){
		procGWorld().selectCharSet( 1 );
		var ret = _this._commandGText( _this, param, code, token );
		procGWorld().selectCharSet( 0 );
		return ret;
	},
	_commandGTextRL : function( _this, param, code, token ){
		procGWorld().selectCharSet( 1 );
		var ret = _this._commandGTextR( _this, param, code, token );
		procGWorld().selectCharSet( 0 );
		return ret;
	},
	_commandWTextL : function( _this, param, code, token ){
		procGWorld().selectCharSet( 1 );
		var ret = _this._commandWText( _this, param, code, token );
		procGWorld().selectCharSet( 0 );
		return ret;
	},
	_commandWTextRL : function( _this, param, code, token ){
		procGWorld().selectCharSet( 1 );
		var ret = _this._commandWTextR( _this, param, code, token );
		procGWorld().selectCharSet( 0 );
		return ret;
	},
	_commandGLine : function( _this, param, code, token ){
		var ret = 0x00;
		var value = newMatrixArray( 5 );
		for( var i = 0; i < 2; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == 0x00 ){
			ret = _this._const( param, code, token, value[2] );
			if( _this._const( param, code, token, value[3] ) == 0x00 ){
				if( _this._const( param, code, token, value[4] ) == 0x00 ){
					procGWorld().setColor( _UNSIGNED( value[4]._mat[0].toFloat(), 256 ) );
				}
				procGWorld().line(
					_INT( value[0]._mat[0].toFloat() ), _INT( value[1]._mat[0].toFloat() ),
					_INT( value[2]._mat[0].toFloat() ), _INT( value[3]._mat[0].toFloat() )
					);
				return 0x03;
			} else {
				if( ret == 0x00 ){
					procGWorld().setColor( _UNSIGNED( value[2]._mat[0].toFloat(), 256 ) );
				}
				procGWorld().lineTo(
					_INT( value[0]._mat[0].toFloat() ), _INT( value[1]._mat[0].toFloat() )
					);
				return 0x03;
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandWLine : function( _this, param, code, token ){
		var ret = 0x00;
		var value = newMatrixArray( 5 );
		for( var i = 0; i < 2; i++ ){
			ret = _this._const(param, code, token, value[i] );
		}
		if( ret == 0x00 ){
			ret = _this._const( param, code, token, value[2] );
			if( _this._const( param, code, token, value[3] ) == 0x00 ){
				if( _this._const( param, code, token, value[4] ) == 0x00 ){
					procGWorld().setColor( _UNSIGNED( value[4]._mat[0].toFloat(), 256 ) );
				}
				procGWorld().wndLine(
					value[0]._mat[0].toFloat(), value[1]._mat[0].toFloat(),
					value[2]._mat[0].toFloat(), value[3]._mat[0].toFloat()
					);
				return 0x03;
			} else {
				if( ret == 0x00 ){
					procGWorld().setColor( _UNSIGNED( value[2]._mat[0].toFloat(), 256 ) );
				}
				procGWorld().wndLineTo(
					value[0]._mat[0].toFloat(), value[1]._mat[0].toFloat()
					);
				return 0x03;
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandGPut : function( _this, param, code, token ){
		var lock;
		var newCode;
		var newToken;
		lock = _this._curLine._token.lock();
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( (newCode & 0x40) != 0 ){
				if( newCode == 0x46 ){
					param = globalParam();
				}
				var width = procGWorld()._width;
				var height = procGWorld()._height;
				var _arrayIndex = _this.arrayIndexIndirect( param, newCode, newToken );
				var arrayList = new Array( 3 );
				arrayList[2] = -1;
				var x, y;
				for( y = 0; y < height; y++ ){
					arrayList[0] = y;
					for( x = 0; x < width; x++ ){
						arrayList[1] = x;
						procGWorld().putColor(
							x, y,
							_UNSIGNED( param._array.val( _arrayIndex, arrayList, 2 ).toFloat(), 256 )
							);
					}
				}
				return 0x03;
			} else {
				var ret = 0x00;
				var value = newMatrixArray( 3 );
				_this._curLine._token.unlock( lock );
				for( var i = 0; i < 2; i++ ){
					ret = _this._const( param, code, token, value[i] );
				}
				if( ret == 0x00 ){
					if( _this._const( param, code, token, value[2] ) == 0x00 ){
						procGWorld().setColor( _UNSIGNED( value[2]._mat[0].toFloat(), 256 ) );
					}
					procGWorld().put( _INT( value[0]._mat[0].toFloat() ), _INT( value[1]._mat[0].toFloat() ) );
					return 0x03;
				}
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandGPut24 : function( _this, param, code, token ){
		var newCode;
		var newToken;
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( (newCode & 0x40) != 0 ){
				if( newCode == 0x46 ){
					param = globalParam();
				}
				var width = procGWorld()._width;
				var height = procGWorld()._height;
				var _arrayIndex = _this.arrayIndexIndirect( param, newCode, newToken );
				var arrayList = new Array( 3 );
				arrayList[2] = -1;
				var x, y;
				doCommandGPut24Begin();
				for( y = 0; y < height; y++ ){
					arrayList[0] = y;
					for( x = 0; x < width; x++ ){
						arrayList[1] = x;
						doCommandGPut24(
							x, y,
							_UNSIGNED( param._array.val( _arrayIndex, arrayList, 2 ).toFloat(), 16777216 )
							);
					}
				}
				doCommandGPut24End();
				return 0x03;
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandWPut : function( _this, param, code, token ){
		var i;
		var ret = 0x00;
		var value = newMatrixArray( 3 );
		for( i = 0; i < 2; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == 0x00 ){
			if( _this._const( param, code, token, value[2] ) == 0x00 ){
				procGWorld().setColor( _UNSIGNED( value[2]._mat[0].toFloat(), 256 ) );
			}
			procGWorld().wndPut( value[0]._mat[0].toFloat(), value[1]._mat[0].toFloat() );
			return 0x03;
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandGGet : function( _this, param, code, token ){
		var lock;
		var newCode;
		var newToken;
		lock = _this._curLine._token.lock();
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( (newCode & 0x40) != 0 ){
				if( newCode == 0x46 ){
					param = globalParam();
				}
				var width = procGWorld()._width;
				var height = procGWorld()._height;
				var _arrayIndex = _this.arrayIndexIndirect( param, newCode, newToken );
				var arrayList = new Array( 3 );
				var resizeList = new Array( 3 );
				resizeList[0] = height - 1;
				resizeList[1] = width - 1;
				resizeList[2] = -1;
				arrayList [2] = -1;
				var moveFlag = (newCode == 0x44);
				var x, y;
				for( y = 0; y < height; y++ ){
					arrayList[0] = y;
					for( x = 0; x < width; x++ ){
						arrayList[1] = x;
						param._array.resize(
							_arrayIndex, resizeList, arrayList, 2,
							procGWorld().get( x, y ), moveFlag
							);
					}
				}
				return 0x03;
			} else {
				var ret = 0x00;
				var value = newMatrixArray( 2 );
				_this._curLine._token.unlock( lock );
				for( var i = 0; i < 2; i++ ){
					ret = _this._const( param, code, token, value[i] );
				}
				if( ret == 0x00 ){
					if( _this._curLine._token.getTokenParam( param ) ){
						newCode = _get_code;
						newToken = _get_token;
						if( (newCode & 0x20) != 0 ){
							if( newCode == 0x23 ){
								param = globalParam();
							}
							var moveFlag = new _Boolean();
							var index = _this.varIndexIndirectMove( param, newCode, newToken, moveFlag );
							if( !(param.setVal(
								index,
								procGWorld().get( _INT( value[0]._mat[0].toFloat() ), _INT( value[1]._mat[0].toFloat() ) ),
								moveFlag._val
							)) ){
								return _this._retError( 0x210E, code, token );
							}
							return 0x03;
						}
					}
				}
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandGGet24 : function( _this, param, code, token ){
		var newCode;
		var newToken;
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( (newCode & 0x40) != 0 ){
				if( newCode == 0x46 ){
					param = globalParam();
				}
				var w = new _Integer();
				var h = new _Integer();
				var data = doCommandGGet24Begin( w, h );
				if( data != null ){
					var width = w._val;
					var height = h._val;
					var _arrayIndex = _this.arrayIndexIndirect( param, newCode, newToken );
					var arrayList = new Array( 3 );
					var resizeList = new Array( 3 );
					resizeList[0] = height - 1;
					resizeList[1] = width - 1;
					resizeList[2] = -1;
					arrayList [2] = -1;
					var moveFlag = (newCode == 0x44);
					var x, y, r, g, b;
					var i = 0;
					for( y = 0; y < height; y++ ){
						arrayList[0] = y;
						for( x = 0; x < width; x++ ){
							arrayList[1] = x;
							r = data[i++];
							g = data[i++];
							b = data[i++];
							i++;
							param._array.resize(
								_arrayIndex, resizeList, arrayList, 2,
								(r << 16) + (g << 8) + b, moveFlag
								);
						}
					}
					doCommandGGet24End();
				}
				return 0x03;
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandWGet : function( _this, param, code, token ){
		var i;
		var ret = 0x00;
		var value = newMatrixArray( 2 );
		for( i = 0; i < 2; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == 0x00 ){
			var newCode;
			var newToken;
			if( _this._curLine._token.getTokenParam( param ) ){
				newCode = _get_code;
				newToken = _get_token;
				if( (newCode & 0x20) != 0 ){
					if( newCode == 0x23 ){
						param = globalParam();
					}
					var moveFlag = new _Boolean();
					var index = _this.varIndexIndirectMove( param, newCode, newToken, moveFlag );
					if( !(param.setVal(
						index,
						procGWorld().wndGet( value[0]._mat[0].toFloat(), value[1]._mat[0].toFloat() ),
						moveFlag._val
					)) ){
						return _this._retError( 0x210E, code, token );
					}
					return 0x03;
				}
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandGUpdate : function( _this, param, code, token ){
		var value = new _Matrix();
		if( _this._const( param, code, token, value ) == 0x00 ){
			_this.setGUpdateFlag( _INT( value._mat[0].toFloat() ) );
		} else {
			_this.setGUpdateFlag( 1 );
		}
		if( _this._gUpdateFlag ){
			doCommandGUpdate( procGWorld() );
		}
		return 0x03;
	},
	_commandRectangular : function( _this, param, code, token ){
		procGraph().setMode( 0 );
		return 0x03;
	},
	_commandParametric : function( _this, param, code, token ){
		procGraph().setMode( 1 );
		return 0x03;
	},
	_commandPolar : function( _this, param, code, token ){
		procGraph().setMode( 2 );
		return 0x03;
	},
	_commandLogScale : function( _this, param, code, token ){
		var newToken;
		if( _this._curLine._token.getToken() ){
			newToken = _get_token;
			if( _get_code == 8 ){
				var value = new _Matrix();
				if( _this._const( param, code, token, value ) == 0x00 ){
					if( value._mat[0].toFloat() <= 1.0 ){
						return _this._retError( 0x2141, code, token );
					}
				} else {
					value.ass( 10.0 );
				}
				if( newToken == "x" ){
					procGraph().setLogScaleX( value._mat[0].toFloat() );
				} else if( newToken == "y" ){
					procGraph().setLogScaleY( value._mat[0].toFloat() );
				} else if( newToken == "xy" ){
					procGraph().setLogScaleX( value._mat[0].toFloat() );
					procGraph().setLogScaleY( value._mat[0].toFloat() );
				} else {
					return _this._retError( 0x2141, code, token );
				}
				return 0x03;
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandNoLogScale : function( _this, param, code, token ){
		var newToken;
		if( _this._curLine._token.getToken() ){
			newToken = _get_token;
			if( _get_code == 8 ){
				if( newToken == "x" ){
					procGraph().setLogScaleX( 0.0 );
				} else if( newToken == "y" ){
					procGraph().setLogScaleY( 0.0 );
				} else if( newToken == "xy" ){
					procGraph().setLogScaleX( 0.0 );
					procGraph().setLogScaleY( 0.0 );
				} else {
					return _this._retError( 0x2141, code, token );
				}
				return 0x03;
			}
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandPlot : function( _this, param, code, token ){
		var lock;
		var newCode;
		var newToken;
		var value = newMatrixArray( 4 );
		switch( procGraph().mode() ){
		case 0:
		case 2:
			lock = _this._curLine._token.lock();
			if( _this._curLine._token.getTokenParam( param ) ){
				newCode = _get_code;
				newToken = _get_token;
				if( newCode == 19 ){
					procGraph().setExpr( newToken );
				} else if( (newCode & 0x40) != 0 ){
					var tmpParam = (newCode == 0x46) ? globalParam() : param;
					var _arrayIndex = _this.arrayIndexIndirect( tmpParam, newCode, newToken );
					procGraph().setExpr( _this.strGet( tmpParam._array, _arrayIndex ) );
				} else {
					_this._curLine._token.unlock( lock );
					break;
				}
			}
			break;
		case 1:
			lock = _this._curLine._token.lock();
			if( _this._curLine._token.getTokenParam( param ) ){
				newCode = _get_code;
				newToken = _get_token;
				if( newCode == 19 ){
					procGraph().setExpr1( newToken );
				} else if( (newCode & 0x40) != 0 ){
					var tmpParam = (newCode == 0x46) ? globalParam() : param;
					var _arrayIndex = _this.arrayIndexIndirect( tmpParam, newCode, newToken );
					procGraph().setExpr1( _this.strGet( tmpParam._array, _arrayIndex ) );
				} else {
					_this._curLine._token.unlock( lock );
					break;
				}
			}
			lock = _this._curLine._token.lock();
			if( _this._curLine._token.getTokenParam( param ) ){
				newCode = _get_code;
				newToken = _get_token;
				if( newCode == 19 ){
					procGraph().setExpr2( newToken );
				} else if( (newCode & 0x40) != 0 ){
					var tmpParam = (newCode == 0x46) ? globalParam() : param;
					var _arrayIndex = _this.arrayIndexIndirect( tmpParam, newCode, newToken );
					procGraph().setExpr2( _this.strGet( tmpParam._array, _arrayIndex ) );
				} else {
					return _this._retError( 0x2141, code, token );
				}
			} else {
				return _this._retError( 0x2141, code, token );
			}
			break;
		}
		procGraph().setColor( procGWorld()._color );
		if( _this._const( param, code, token, value[0] ) == 0x00 ){
			if( _this._const( param, code, token, value[1] ) == 0x00 ){
				switch( procGraph().mode() ){
				case 0:
					if( _this._const( param, code, token, value[2] ) == 0x00 ){
						procGraph().setColor( _UNSIGNED( value[2]._mat[0].toFloat(), 256 ) );
					} else {
					}
					break;
				case 1:
				case 2:
					if( _this._const( param, code, token, value[2] ) == 0x00 ){
						if( _this._const( param, code, token, value[3] ) == 0x00 ){
							procGraph().setColor( _UNSIGNED( value[3]._mat[0].toFloat(), 256 ) );
						} else {
						}
					} else {
						return _this._retError( 0x2141, code, token );
					}
					break;
				}
			} else {
				procGraph().setColor( _UNSIGNED( value[0]._mat[0].toFloat(), 256 ) );
				switch( procGraph().mode() ){
				case 0:
					value[0].ass( procGWorld().wndPosX( 0 ) );
					value[1].ass( procGWorld().wndPosX( procGWorld()._width - 1 ) );
					break;
				case 1:
				case 2:
					value[0].ass( 0.0 ); value[0]._mat[0].angToAng( 1, complexAngType() );
					value[1].ass( 360.0 ); value[1]._mat[0].angToAng( 1, complexAngType() );
					value[2].ass( 1.0 ); value[2]._mat[0].angToAng( 1, complexAngType() );
					break;
				}
			}
		} else {
			switch( procGraph().mode() ){
			case 0:
				value[0].ass( procGWorld().wndPosX( 0 ) );
				value[1].ass( procGWorld().wndPosX( procGWorld()._width - 1 ) );
				break;
			case 1:
			case 2:
				value[0].ass( 0.0 ); value[0]._mat[0].angToAng( 1, complexAngType() );
				value[1].ass( 360.0 ); value[1]._mat[0].angToAng( 1, complexAngType() );
				value[2].ass( 1.0 ); value[2]._mat[0].angToAng( 1, complexAngType() );
				break;
			}
		}
		doCommandPlot( _this, param, procGraph(), value[0]._mat[0].toFloat(), value[1]._mat[0].toFloat(), value[2]._mat[0].toFloat() );
		return 0x03;
	},
	_commandRePlot : function( _this, param, code, token ){
		var value = newMatrixArray( 4 );
		procGraph().setColor( procGWorld()._color );
		if( _this._const( param, code, token, value[0] ) == 0x00 ){
			if( _this._const( param, code, token, value[1] ) == 0x00 ){
				switch( procGraph().mode() ){
				case 0:
					if( _this._const( param, code, token, value[2] ) == 0x00 ){
						procGraph().setColor( _UNSIGNED( value[2]._mat[0].toFloat(), 256 ) );
					} else {
					}
					break;
				case 1:
				case 2:
					if( _this._const( param, code, token, value[2] ) == 0x00 ){
						if( _this._const( param, code, token, value[3] ) == 0x00 ){
							procGraph().setColor( _UNSIGNED( value[3]._mat[0].toFloat(), 256 ) );
						} else {
						}
					} else {
						return _this._retError( 0x2141, code, token );
					}
					break;
				}
			} else {
				procGraph().setColor( _UNSIGNED( value[0]._mat[0].toFloat(), 256 ) );
				switch( procGraph().mode() ){
				case 0:
					value[0].ass( procGWorld().wndPosX( 0 ) );
					value[1].ass( procGWorld().wndPosX( procGWorld()._width - 1 ) );
					break;
				case 1:
				case 2:
					value[0].ass( 0.0 ); value[0]._mat[0].angToAng( 1, complexAngType() );
					value[1].ass( 360.0 ); value[1]._mat[0].angToAng( 1, complexAngType() );
					value[2].ass( 1.0 ); value[2]._mat[0].angToAng( 1, complexAngType() );
					break;
				}
			}
		} else {
			switch( procGraph().mode() ){
			case 0:
				value[0].ass( procGWorld().wndPosX( 0 ) );
				value[1].ass( procGWorld().wndPosX( procGWorld()._width - 1 ) );
				break;
			case 1:
			case 2:
				value[0].ass( 0.0 ); value[0]._mat[0].angToAng( 1, complexAngType() );
				value[1].ass( 360.0 ); value[1]._mat[0].angToAng( 1, complexAngType() );
				value[2].ass( 1.0 ); value[2]._mat[0].angToAng( 1, complexAngType() );
				break;
			}
		}
		doCommandRePlot( _this, param, procGraph(), value[0]._mat[0].toFloat(), value[1]._mat[0].toFloat(), value[2]._mat[0].toFloat() );
		return 0x03;
	},
	_commandCalculator : function( _this, param, code, token ){
		var value = new _Matrix();
		if( _this._const( param, code, token, value ) == 0x00 ){
			param._calculator = value.notEqual( 0.0 );
			return 0x03;
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandInclude : function( _this, param, code, token ){
		var ret;
		var saveCurLine = _this._curLine;
		var saveProcLine = _this._procLine;
		var saveFuncName = param._funcName;
		var newToken;
		if( _this._curLine._token.getToken() ){
			newToken = _get_token;
			if( _get_code == 13 ){
				var name = newToken + ".inc";
				var func;
				if( (func = procFunc().search( name, true, null )) != null ){
					if( _this.mainLoop( func, param, null, null ) == 0x04 ){
						ret = 0x00;
					} else {
						ret = _this._retError( 0x2108, 13, name );
					}
				} else if( (func = _this.newFuncCache( name, param, null )) != null ){
					if( _this.mainLoop( func, param, null, null ) == 0x04 ){
						ret = 0x00;
					} else {
						ret = _this._retError( 0x2108, 13, name );
					}
				} else if( _this.mainLoop( name, param, null, null ) == 0x04 ){
					ret = 0x00;
				} else {
					ret = _this._retError( 0x2108, 13, name );
				}
			} else {
				ret = _this._retError( 0x2141, code, token );
			}
		} else {
			ret = _this._retError( 0x2141, code, token );
		}
		_this._curLine = saveCurLine;
		_this._procLine = saveProcLine;
		param._funcName = saveFuncName;
		return (ret == 0x00) ? 0x03 : ret;
	},
	_commandBase : function( _this, param, code, token ){
		var value = new _Matrix();
		if( _this._const( param, code, token, value ) == 0x00 ){
			param._base = value.notEqual( 0.0 ) ? 1 : 0;
			return 0x03;
		}
		return _this._retError( 0x2141, code, token );
	},
	_commandNameSpace : function( _this, param, code, token ){
		var newToken;
		if( _this._curLine._token.getToken() ){
			newToken = _get_token;
			if( _get_code == 8 ){
				param._nameSpace = newToken;
				return 0x03;
			}
			return _this._retError( 0x2141, code, token );
		}
		param.resetNameSpace();
		return 0x03;
	},
	_commandDump : function( _this, param, code, token ){
		var newCode;
		var newToken;
		if( skipCommandLog() ){
			while( true ){
				if( !(_this._curLine._token.getTokenParam( param )) ){
					break;
				}
			}
			return 0x03;
		}
		while( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			newToken = _get_token;
			if( (newCode & 0x20) != 0 ){
				if( newCode == 0x23 ){
					doCommandDumpVar( globalParam(), _this.varIndexIndirect( globalParam(), newCode, newToken ) );
				} else {
					doCommandDumpVar( param, _this.varIndexIndirect( param, newCode, newToken ) );
				}
			} else if( (newCode & 0x40) != 0 ){
				if( newCode == 0x46 ){
					doCommandDumpArray( globalParam(), _this.arrayIndexIndirect( globalParam(), newCode, newToken ) );
				} else {
					doCommandDumpArray( param, _this.arrayIndexIndirect( param, newCode, newToken ) );
				}
			} else {
				return _this._retError( 0x2141, code, token );
			}
		}
		return 0x03;
	},
	_procTop : function( _this, param, code, token, value ){
		var ret;
		param._subStep++;
		if( !param._seFlag ){
			value.ass( param._array._mat[0] );
		}
		ret = _this._processSub( param, value );
		param._subStep--;
		return ret;
	},
	_procVariableFirst : function( param, token, value ){
		this._curInfo._assToken = this.varIndexParam( param, token );
		value.ass( param.val( this._curInfo._assToken ) );
		this._updateMatrix( param, value );
		return 0x00;
	},
	_procVariable : function( _this, param, code, token, value ){
		value.ass( param.val( _this.varIndexParam( param, token ) ) );
		_this._updateMatrix( param, value );
		return 0x00;
	},
	_procAutoVar : function( _this, param, code, token, value ){
		value.ass( param.val( _this.autoVarIndex( param, token ) ) );
		_this._updateMatrix( param, value );
		return 0x00;
	},
	_procGlobalVar : function( _this, param, code, token, value ){
		value.ass( globalParam().val( _this.autoVarIndex( globalParam(), token ) ) );
		_this._updateMatrix( param, value );
		return 0x00;
	},
	_procArrayFirst : function( param, token, value ){
		this._curInfo._assToken = this.arrayIndexParam( param, token );
		if( this._curLine._token.getTokenLock() ){
			if( _get_code == 16 ){
				this._initArrayFlag = true;
				this._initArrayCnt = 0;
				this._initArrayMax = 0;
				this._initArrayIndex = this.arrayIndexDirectMove( param, this._curInfo._assCode, this._curInfo._assToken, this._initArrayMoveFlag );
				this._initArray = new _Token();
				return this._procInitArray( param );
			}
		}
		this._getArrayInfo( param, 0x44, token );
		if( this._curInfo._curArraySize == 0 ){
			value.ass( param._array._mat[this._curInfo._assToken] );
		} else {
			value.ass( param._array.val( this._curInfo._assToken, this._curInfo._curArray, this._curInfo._curArraySize ) );
		}
		this._updateMatrix( param, value );
		return 0x00;
	},
	_procArray : function( _this, param, code, token, value ){
		var index = _this.arrayIndexParam( param, token );
		if( _this._curLine._token.getTokenLock() ){
			if( _get_code == 16 ){
				_this._initArrayFlag = true;
				_this._initArrayCnt = 0;
				_this._initArrayMax = 0;
				_this._initArrayIndex = _this.arrayIndexDirectMove( param, _this._curInfo._assCode, _this._curInfo._assToken, _this._initArrayMoveFlag );
				_this._initArray = new _Token();
				return _this._procInitArray( param );
			}
		}
		_this._getArrayInfo( param, code, token );
		if( _this._curInfo._curArraySize == 0 ){
			value.ass( param._array._mat[index] );
		} else {
			value.ass( param._array.val( index, _this._curInfo._curArray, _this._curInfo._curArraySize ) );
		}
		_this._updateMatrix( param, value );
		return 0x00;
	},
	_procAutoArray : function( _this, param, code, token, value ){
		var curParam = param;
		if( code == 0x46 ){
			param = globalParam();
		}
		if( _this._curLine._token.getTokenLock() ){
			if( _get_code == 16 ){
				_this._initArrayFlag = true;
				_this._initArrayCnt = 0;
				_this._initArrayMax = 0;
				_this._initArrayIndex = _this.arrayIndexDirectMove( param, _this._curInfo._assCode, _this._curInfo._assToken, _this._initArrayMoveFlag );
				_this._initArray = new _Token();
				return _this._procInitArray( param );
			}
		}
		_this._getArrayInfo( curParam, code, token );
		if( _this._curInfo._curArraySize == 0 ){
			value.ass( param._array._mat[_this.autoArrayIndex( param, token )] );
		} else {
			value.ass( param._array.val( _this.autoArrayIndex( param, token ), _this._curInfo._curArray, _this._curInfo._curArraySize ) );
		}
		_this._updateMatrix( curParam, value );
		return 0x00;
	},
	_procConst : function( _this, param, code, token, value ){
		value.ass( token );
		_this._updateMatrix( param, value );
		return 0x00;
	},
	_procLabel : function( _this, parentParam, code, token, value ){
		var funcParam = new _Token();
		var func;
		_this._getParams( parentParam, code, token, funcParam );
		if( (func = parentParam._func.search( token, false, null )) != null ){
			var ret;
			var childProc = new _Proc( parentParam._mode, _this._printAssert, _this._printWarn, _this._gUpdateFlag );
			var childParam = new _Param( _this._curLine._num, parentParam, false );
			_this.initInternalProc( childProc, func, childParam, parentParam );
			if( mainProc( _this, parentParam, func, funcParam, childProc, childParam ) == 0x04 ){
				childProc.end();
				_this.getAns( childParam, value, parentParam );
				ret = 0x00;
			} else {
				childProc.end();
				ret = _this._retError( 0x2109, code, token );
			}
			childParam.end();
			return ret;
		} else {
			return _this._retError( 0x210A, code, token );
		}
	},
	_procCommand : function( _this, param, code, token, value ){
		var ret;
		if( token < 101 ){
			if( (ret = _procSubCommand[token]( _this, param, code, token )) != 0x03 ){
				return ret;
			}
		} else {
			if( (ret = doCustomCommand( _this, param, code, token )) != 0x00 ){
				return _this._retError( ret, code, token );
			}
		}
		var tmpValue = new _Matrix();
		if( _this._const( param, code, token, tmpValue ) == 0x00 ){
			return _this._retError( 0x2141, code, token );
		} else {
			return 0x03;
		}
	},
	_procStat : function( _this, param, code, token, value ){
		return _procSubStat[token]( _this, param, code, token );
	},
	_procUnary : function( _this, param, code, token, value ){
		if( token < 6 ){
			return _procSubOp[token]( _this, param, code, token, value );
		} else {
			return _this._retError( 0x2100, code, token );
		}
	},
	_procFunc : function( _this, param, code, token, value ){
		var ret;
		clearValueError();
		clearMatrixError();
		if( (ret = _procSubFunc[token]( _this, param, code, token, value, false )) != 0x00 ){
			return ret;
		}
		_this._updateMatrix( param, value );
		if( valueError() ){
			_this._errorProc( 0x100B, _this._curLine._num, param, code, token );
			clearValueError();
		}
		return 0x00;
	},
	_procFuncSe : function( _this, param, code, token, value ){
		var ret;
		clearValueError();
		clearMatrixError();
		if( (ret = _procSubFunc[token]( _this, param, code, token, value, true )) != 0x00 ){
			return ret;
		}
		_this._updateMatrix( param, value );
		if( valueError() ){
			_this._errorProc( 0x100B, _this._curLine._num, param, code, token );
			clearValueError();
		}
		return 0x00;
	},
	_procExtFunc : function( _this, parentParam, code, token, value ){
		var ret;
		var funcParam = new _Token();
		var func;
		_this._getParams( parentParam, code, token, funcParam );
		var childProc = new _Proc( parentParam._mode, _this._printAssert, _this._printWarn, _this._gUpdateFlag );
		var childParam = new _Param( _this._curLine._num, parentParam, false );
		if( (func = procFunc().search( token, true, (parentParam == null) ? null : parentParam._nameSpace )) != null ){
			if( mainProc( _this, parentParam, func, funcParam, childProc, childParam ) == 0x04 ){
				childProc.end();
				_this.getAns( childParam, value, parentParam );
				ret = 0x00;
			} else {
				childProc.end();
				ret = _this._retError( 0x2108, code, token );
			}
		} else if( (func = _this.newFuncCache( token, childParam, (parentParam == null) ? null : parentParam._nameSpace )) != null ){
			if( mainProc( _this, parentParam, func, funcParam, childProc, childParam ) == 0x04 ){
				childProc.end();
				_this.getAns( childParam, value, parentParam );
				ret = 0x00;
			} else {
				childProc.end();
				ret = _this._retError( 0x2108, code, token );
			}
		} else if( mainProc( _this, parentParam, token, funcParam, childProc, childParam ) == 0x04 ){
			childProc.end();
			_this.getAns( childParam, value, parentParam );
			ret = 0x00;
		} else {
			childProc.end();
			ret = _this._retError( 0x2108, code, token );
		}
		childParam.end();
		return ret;
	},
	_procMain1 : function( _this, func, childParam, step , err , ret ){
		if( childParam._fileDataGet >= childParam._fileData.length ){
			ret.set( 0x04 );
			return false;
		}
		step.set( _this.beginProcess( childParam._fileData[childParam._fileDataGet], childParam, err ) ? 1 : 2 );
		childParam._fileDataGet++;
		return true;
	},
	_procMain2 : function( _this, func, childParam, step , err , ret ){
		if( !_this.process( childParam, err ) ){
			step.set( 2 );
		}
		return true;
	},
	_procMain3 : function( _this, func, childParam, step , err , ret ){
		if( ret.set( _this.termProcess( childParam, err ) )._val != 0x02 ){
			return false;
		}
		step.set( 0 );
		childParam._lineNum++;
		return true;
	},
	_procMain1Cache : function( _this, func, childParam, step , err , ret ){
		step.set( _this.beginProcess( func._line, childParam, err ) ? 1 : 2 );
		return true;
	},
	_procMain2Cache : function( _this, func, childParam, step , err , ret ){
		if( !_this.process( childParam, err ) ){
			step.set( 2 );
		}
		return true;
	},
	_procMain3Cache : function( _this, func, childParam, step , err , ret ){
		if( ret.set( _this.termProcess( childParam, err ) )._val != 0x02 ){
			return false;
		}
		step.set( 0 );
		ret.set( 0x04 );
		return false;
	},
	_procTest1 : function( _this, func, childParam, step , err , ret ){
		if( childParam._fileDataGet >= childParam._fileData.length ){
			ret.set( 0x04 );
			return false;
		}
		step.set( _this.beginTestProcess( childParam._fileData[childParam._fileDataGet], childParam, err ) ? 1 : 2 );
		childParam._fileDataGet++;
		return true;
	},
	_procTest2 : function( _this, func, childParam, step , err , ret ){
		if( !_this.testProcess( childParam, err ) ){
			step.set( 2 );
		}
		return true;
	},
	_procTest3 : function( _this, func, childParam, step , err , ret ){
		if( ret.set( _this.termTestProcess( childParam, err ) )._val != 0x02 ){
			return false;
		}
		step.set( 0 );
		childParam._lineNum++;
		return true;
	}
};
var _procSubFunc = [
	_Proc.prototype._funcDefined,
	_Proc.prototype._funcIndexOf,
	_Proc.prototype._funcIsInf,
	_Proc.prototype._funcIsNaN,
	_Proc.prototype._funcRand,
	_Proc.prototype._funcTime,
	_Proc.prototype._funcMkTime,
	_Proc.prototype._funcTmSec,
	_Proc.prototype._funcTmMin,
	_Proc.prototype._funcTmHour,
	_Proc.prototype._funcTmMDay,
	_Proc.prototype._funcTmMon,
	_Proc.prototype._funcTmYear,
	_Proc.prototype._funcTmWDay,
	_Proc.prototype._funcTmYDay,
	_Proc.prototype._funcTmXMon,
	_Proc.prototype._funcTmXYear,
	_Proc.prototype._funcA2D,
	_Proc.prototype._funcA2G,
	_Proc.prototype._funcA2R,
	_Proc.prototype._funcD2A,
	_Proc.prototype._funcD2G,
	_Proc.prototype._funcD2R,
	_Proc.prototype._funcG2A,
	_Proc.prototype._funcG2D,
	_Proc.prototype._funcG2R,
	_Proc.prototype._funcR2A,
	_Proc.prototype._funcR2D,
	_Proc.prototype._funcR2G,
	_Proc.prototype._funcSin,
	_Proc.prototype._funcCos,
	_Proc.prototype._funcTan,
	_Proc.prototype._funcASin,
	_Proc.prototype._funcACos,
	_Proc.prototype._funcATan,
	_Proc.prototype._funcATan2,
	_Proc.prototype._funcSinH,
	_Proc.prototype._funcCosH,
	_Proc.prototype._funcTanH,
	_Proc.prototype._funcASinH,
	_Proc.prototype._funcACosH,
	_Proc.prototype._funcATanH,
	_Proc.prototype._funcExp,
	_Proc.prototype._funcExp10,
	_Proc.prototype._funcLn,
	_Proc.prototype._funcLog,
	_Proc.prototype._funcLog10,
	_Proc.prototype._funcPow,
	_Proc.prototype._funcSqr,
	_Proc.prototype._funcSqrt,
	_Proc.prototype._funcCeil,
	_Proc.prototype._funcFloor,
	_Proc.prototype._funcAbs,
	_Proc.prototype._funcLdexp,
	_Proc.prototype._funcFrexp,
	_Proc.prototype._funcModf,
	_Proc.prototype._funcInt,
	_Proc.prototype._funcReal,
	_Proc.prototype._funcImag,
	_Proc.prototype._funcArg,
	_Proc.prototype._funcNorm,
	_Proc.prototype._funcConjg,
	_Proc.prototype._funcPolar,
	_Proc.prototype._funcNum,
	_Proc.prototype._funcDenom,
	_Proc.prototype._funcRow,
	_Proc.prototype._funcCol,
	_Proc.prototype._funcTrans,
	_Proc.prototype._funcStrCmp,
	_Proc.prototype._funcStrCmp,
	_Proc.prototype._funcStrLen,
	_Proc.prototype._funcGWidth,
	_Proc.prototype._funcGHeight,
	_Proc.prototype._funcGColor,
	_Proc.prototype._funcGColor,
	_Proc.prototype._funcGCX,
	_Proc.prototype._funcGCY,
	_Proc.prototype._funcWCX,
	_Proc.prototype._funcWCY,
	_Proc.prototype._funcGGet,
	_Proc.prototype._funcWGet,
	_Proc.prototype._funcGX,
	_Proc.prototype._funcGY,
	_Proc.prototype._funcWX,
	_Proc.prototype._funcWY,
	_Proc.prototype._funcCall,
	_Proc.prototype._funcEval
];
var _procSubOp = [
	_Proc.prototype._unaryIncrement,
	_Proc.prototype._unaryDecrement,
	_Proc.prototype._unaryComplement,
	_Proc.prototype._unaryNot,
	_Proc.prototype._unaryMinus,
	_Proc.prototype._unaryPlus,
	_Proc.prototype._opPostfixInc,
	_Proc.prototype._opPostfixDec,
	_Proc.prototype._opMul,
	_Proc.prototype._opDiv,
	_Proc.prototype._opMod,
	_Proc.prototype._opAdd,
	_Proc.prototype._opSub,
	_Proc.prototype._opShiftL,
	_Proc.prototype._opShiftR,
	_Proc.prototype._opLess,
	_Proc.prototype._opLessOrEq,
	_Proc.prototype._opGreat,
	_Proc.prototype._opGreatOrEq,
	_Proc.prototype._opEqual,
	_Proc.prototype._opNotEqual,
	_Proc.prototype._opAND,
	_Proc.prototype._opXOR,
	_Proc.prototype._opOR,
	_Proc.prototype._opLogAND,
	_Proc.prototype._opLogOR,
	_Proc.prototype._opConditional,
	_Proc.prototype._opAss,
	_Proc.prototype._opMulAndAss,
	_Proc.prototype._opDivAndAss,
	_Proc.prototype._opModAndAss,
	_Proc.prototype._opAddAndAss,
	_Proc.prototype._opSubAndAss,
	_Proc.prototype._opShiftLAndAss,
	_Proc.prototype._opShiftRAndAss,
	_Proc.prototype._opANDAndAss,
	_Proc.prototype._opORAndAss,
	_Proc.prototype._opXORAndAss,
	_Proc.prototype._opComma,
	_Proc.prototype._opPow,
	_Proc.prototype._opPowAndAss
];
var _procSubLoop = [
	_Proc.prototype._loopBegin,
	_Proc.prototype._loopEnd,
	_Proc.prototype._loopEnd,
	_Proc.prototype._loopEnd,
	_Proc.prototype._loopEnd,
	_Proc.prototype._loopEnd,
	_Proc.prototype._loopEnd,
	_Proc.prototype._loopCont,
	_Proc.prototype._loopBegin,
	_Proc.prototype._loopUntil,
	_Proc.prototype._loopBegin,
	_Proc.prototype._loopEndWhile,
	_Proc.prototype._loopBegin,
	_Proc.prototype._loopBegin,
	_Proc.prototype._loopNext,
	_Proc.prototype._loopBegin,
	_Proc.prototype._loopEndFunc,
	_Proc.prototype._loopIf,
	_Proc.prototype._loopElIf,
	_Proc.prototype._loopElse,
	_Proc.prototype._loopEndIf,
	_Proc.prototype._loopSwitch,
	_Proc.prototype._loopCase,
	_Proc.prototype._loopDefault,
	_Proc.prototype._loopEndSwi,
	_Proc.prototype._loopBreakSwi,
	_Proc.prototype._loopContinue,
	_Proc.prototype._loopBreak,
	_Proc.prototype._loopContinue,
	_Proc.prototype._loopBreak,
	_Proc.prototype._loopAssert,
	_Proc.prototype._loopReturn,
	_Proc.prototype._loopReturn,
	_Proc.prototype._loopReturn
];
var _procSubStat = [
	_Proc.prototype._statStart,
	_Proc.prototype._statEnd,
	_Proc.prototype._statEndInc,
	_Proc.prototype._statEndDec,
	_Proc.prototype._statEndEq,
	_Proc.prototype._statEndEqInc,
	_Proc.prototype._statEndEqDec,
	_Proc.prototype._statCont,
	_Proc.prototype._statDo,
	_Proc.prototype._statUntil,
	_Proc.prototype._statWhile,
	_Proc.prototype._statEndWhile,
	_Proc.prototype._statFor,
	_Proc.prototype._statFor2,
	_Proc.prototype._statNext,
	_Proc.prototype._statFunc,
	_Proc.prototype._statEndFunc,
	_Proc.prototype._statIf,
	_Proc.prototype._statElIf,
	_Proc.prototype._statElse,
	_Proc.prototype._statEndIf,
	_Proc.prototype._statSwitch,
	_Proc.prototype._statCase,
	_Proc.prototype._statDefault,
	_Proc.prototype._statEndSwi,
	_Proc.prototype._statBreakSwi,
	_Proc.prototype._statContinue,
	_Proc.prototype._statBreak,
	_Proc.prototype._statContinue2,
	_Proc.prototype._statBreak2,
	_Proc.prototype._statAssert,
	_Proc.prototype._statReturn,
	_Proc.prototype._statReturn2,
	_Proc.prototype._statReturn3
];
var _procSubCommand = [
	_Proc.prototype._commandNull,
	_Proc.prototype._commandEFloat,
	_Proc.prototype._commandFFloat,
	_Proc.prototype._commandGFloat,
	_Proc.prototype._commandEComplex,
	_Proc.prototype._commandFComplex,
	_Proc.prototype._commandGComplex,
	_Proc.prototype._commandPrec,
	_Proc.prototype._commandIFract,
	_Proc.prototype._commandMFract,
	_Proc.prototype._commandHTime,
	_Proc.prototype._commandMTime,
	_Proc.prototype._commandSTime,
	_Proc.prototype._commandFTime,
	_Proc.prototype._commandFps,
	_Proc.prototype._commandSChar,
	_Proc.prototype._commandUChar,
	_Proc.prototype._commandSShort,
	_Proc.prototype._commandUShort,
	_Proc.prototype._commandSLong,
	_Proc.prototype._commandULong,
	_Proc.prototype._commandSInt,
	_Proc.prototype._commandUInt,
	_Proc.prototype._commandRadix,
	_Proc.prototype._commandPType,
	_Proc.prototype._commandRad,
	_Proc.prototype._commandDeg,
	_Proc.prototype._commandGrad,
	_Proc.prototype._commandAngle,
	_Proc.prototype._commandAns,
	_Proc.prototype._commandAssert,
	_Proc.prototype._commandWarn,
	_Proc.prototype._commandParam,
	_Proc.prototype._commandParams,
	_Proc.prototype._commandDefine,
	_Proc.prototype._commandEnum,
	_Proc.prototype._commandUnDef,
	_Proc.prototype._commandVar,
	_Proc.prototype._commandArray,
	_Proc.prototype._commandLocal,
	_Proc.prototype._commandGlobal,
	_Proc.prototype._commandLabel,
	_Proc.prototype._commandParent,
	_Proc.prototype._commandReal,
	_Proc.prototype._commandImag,
	_Proc.prototype._commandNum,
	_Proc.prototype._commandDenom,
	_Proc.prototype._commandMat,
	_Proc.prototype._commandTrans,
	_Proc.prototype._commandSRand,
	_Proc.prototype._commandLocalTime,
	_Proc.prototype._commandArrayCopy,
	_Proc.prototype._commandArrayFill,
	_Proc.prototype._commandStrCpy,
	_Proc.prototype._commandStrCpy,
	_Proc.prototype._commandStrLwr,
	_Proc.prototype._commandStrUpr,
	_Proc.prototype._commandClear,
	_Proc.prototype._commandError,
	_Proc.prototype._commandPrint,
	_Proc.prototype._commandPrint,
	_Proc.prototype._commandPrint,
	_Proc.prototype._commandScan,
	_Proc.prototype._commandGWorld,
	_Proc.prototype._commandGClear,
	_Proc.prototype._commandGColor,
	_Proc.prototype._commandGFill,
	_Proc.prototype._commandGMove,
	_Proc.prototype._commandGText,
	_Proc.prototype._commandGTextR,
	_Proc.prototype._commandGTextL,
	_Proc.prototype._commandGTextRL,
	_Proc.prototype._commandGLine,
	_Proc.prototype._commandGPut,
	_Proc.prototype._commandGPut24,
	_Proc.prototype._commandGGet,
	_Proc.prototype._commandGGet24,
	_Proc.prototype._commandGUpdate,
	_Proc.prototype._commandWindow,
	_Proc.prototype._commandWFill,
	_Proc.prototype._commandWMove,
	_Proc.prototype._commandWText,
	_Proc.prototype._commandWTextR,
	_Proc.prototype._commandWTextL,
	_Proc.prototype._commandWTextRL,
	_Proc.prototype._commandWLine,
	_Proc.prototype._commandWPut,
	_Proc.prototype._commandWGet,
	_Proc.prototype._commandRectangular,
	_Proc.prototype._commandParametric,
	_Proc.prototype._commandPolar,
	_Proc.prototype._commandLogScale,
	_Proc.prototype._commandNoLogScale,
	_Proc.prototype._commandPlot,
	_Proc.prototype._commandRePlot,
	_Proc.prototype._commandCalculator,
	_Proc.prototype._commandInclude,
	_Proc.prototype._commandBase,
	_Proc.prototype._commandNameSpace,
	_Proc.prototype._commandDump,
	_Proc.prototype._commandPrint
];
var _procSubSe = [
	_Proc.prototype._seNull,
	_Proc.prototype._seIncrement,
	_Proc.prototype._seDecrement,
	_Proc.prototype._seNegative,
	_Proc.prototype._seComplement,
	_Proc.prototype._seNot,
	_Proc.prototype._seMinus,
	_Proc.prototype._seSet,
	_Proc.prototype._seSetC,
	_Proc.prototype._seSetF,
	_Proc.prototype._seSetM,
	_Proc.prototype._seMul,
	_Proc.prototype._seDiv,
	_Proc.prototype._seMod,
	_Proc.prototype._seAdd,
	_Proc.prototype._seAddS,
	_Proc.prototype._seSub,
	_Proc.prototype._seSubS,
	_Proc.prototype._sePow,
	_Proc.prototype._seShiftL,
	_Proc.prototype._seShiftR,
	_Proc.prototype._seAND,
	_Proc.prototype._seOR,
	_Proc.prototype._seXOR,
	_Proc.prototype._seLess,
	_Proc.prototype._seLessOrEq,
	_Proc.prototype._seGreat,
	_Proc.prototype._seGreatOrEq,
	_Proc.prototype._seEqual,
	_Proc.prototype._seNotEqual,
	_Proc.prototype._seLogAND,
	_Proc.prototype._seLogOR,
	_Proc.prototype._seMulAndAss,
	_Proc.prototype._seDivAndAss,
	_Proc.prototype._seModAndAss,
	_Proc.prototype._seAddAndAss,
	_Proc.prototype._seAddSAndAss,
	_Proc.prototype._seSubAndAss,
	_Proc.prototype._seSubSAndAss,
	_Proc.prototype._sePowAndAss,
	_Proc.prototype._seShiftLAndAss,
	_Proc.prototype._seShiftRAndAss,
	_Proc.prototype._seANDAndAss,
	_Proc.prototype._seORAndAss,
	_Proc.prototype._seXORAndAss,
	_Proc.prototype._seLessAndAss,
	_Proc.prototype._seLessOrEqAndAss,
	_Proc.prototype._seGreatAndAss,
	_Proc.prototype._seGreatOrEqAndAss,
	_Proc.prototype._seEqualAndAss,
	_Proc.prototype._seNotEqualAndAss,
	_Proc.prototype._seLogANDAndAss,
	_Proc.prototype._seLogORAndAss,
	_Proc.prototype._seConditional,
	_Proc.prototype._seSetFALSE,
	_Proc.prototype._seSetTRUE,
	_Proc.prototype._seSetZero
];
var _procSub = [
	_Proc.prototype._procTop,
	_Proc.prototype._procVariable,
	_Proc.prototype._procAutoVar,
	_Proc.prototype._procGlobalVar,
	_Proc.prototype._procArray,
	_Proc.prototype._procAutoArray,
	_Proc.prototype._procAutoArray,
	_Proc.prototype._procConst,
	_Proc.prototype._procLabel,
	_Proc.prototype._procCommand,
	_Proc.prototype._procStat,
	_Proc.prototype._procUnary,
	_Proc.prototype._procFunc,
	_Proc.prototype._procExtFunc
];
var _procMain = [
	_Proc.prototype._procMain1,
	_Proc.prototype._procMain2,
	_Proc.prototype._procMain3
];
var _procMainCache = [
	_Proc.prototype._procMain1Cache,
	_Proc.prototype._procMain2Cache,
	_Proc.prototype._procMain3Cache
];
var _procTest = [
	_Proc.prototype._procTest1,
	_Proc.prototype._procTest2,
	_Proc.prototype._procTest3
];
function defProcFunction(){
	if( window.getExtFuncDataDirect == undefined ) window.getExtFuncDataDirect = function( func ){ return null; };
	if( window.getExtFuncDataNameSpace == undefined ) window.getExtFuncDataNameSpace = function( func ){ return null; };
	if( window.mainProc == undefined ) window.mainProc = function( parentProc, parentParam, func, funcParam, childProc, childParam ){};
	if( window.assertProc == undefined ) window.assertProc = function( num, func ){ return false; };
	if( window.errorProc == undefined ) window.errorProc = function( err, num, func, token ){};
	if( window.printTrace == undefined ) window.printTrace = function( param, line, num, comment, skipFlag ){};
	if( window.printTest == undefined ) window.printTest = function( param, line, num, comment ){};
	if( window.printAnsMatrix == undefined ) window.printAnsMatrix = function( param, array ){};
	if( window.printAnsComplex == undefined ) window.printAnsComplex = function( real, imag ){};
	if( window.printWarn == undefined ) window.printWarn = function( warn, num, func ){};
	if( window.printError == undefined ) window.printError = function( error, num, func ){};
	if( window.doFuncGColor == undefined ) window.doFuncGColor = function( rgb ){ return 0; };
	if( window.doFuncGColor24 == undefined ) window.doFuncGColor24 = function( index ){ return 0x000000; };
	if( window.doFuncEval == undefined ) window.doFuncEval = function( parentProc, childProc, childParam, string, value ){ return 0x00; };
	if( window.doCommandClear == undefined ) window.doCommandClear = function(){};
	if( window.doCommandPrint == undefined ) window.doCommandPrint = function( topPrint, flag ){};
	if( window.doCommandScan == undefined ) window.doCommandScan = function( topScan, proc, param ){};
	if( window.doCommandGWorld == undefined ) window.doCommandGWorld = function( width, height ){};
	if( window.doCommandWindow == undefined ) window.doCommandWindow = function( left, bottom, right, top ){};
	if( window.doCommandGColor == undefined ) window.doCommandGColor = function( index, rgb ){};
	if( window.doCommandGPut24Begin == undefined ) window.doCommandGPut24Begin = function(){};
	if( window.doCommandGPut24 == undefined ) window.doCommandGPut24 = function( x, y, rgb ){};
	if( window.doCommandGPut24End == undefined ) window.doCommandGPut24End = function(){};
	if( window.doCommandGGet24Begin == undefined ) window.doCommandGGet24Begin = function( width , height ){ return null; };
	if( window.doCommandGGet24End == undefined ) window.doCommandGGet24End = function(){};
	if( window.doCommandGUpdate == undefined ) window.doCommandGUpdate = function( gWorld ){};
	if( window.doCommandPlot == undefined ) window.doCommandPlot = function( parentProc, parentParam, graph, start, end, step ){};
	if( window.doCommandRePlot == undefined ) window.doCommandRePlot = function( parentProc, parentParam, graph, start, end, step ){};
	if( window.doCommandUsage == undefined ) window.doCommandUsage = function( topUsage ){};
	if( window.doCustomCommand == undefined ) window.doCustomCommand = function( _this, param, code, token ){ return 0x2140 ; };
	if( window.skipCommandLog == undefined ) window.skipCommandLog = function(){ return true; };
	if( window.doCommandLog == undefined ) window.doCommandLog = function( topPrint ){};
	if( window.doCommandDumpVar == undefined ) window.doCommandDumpVar = function( param, index ){};
	if( window.doCommandDumpArray == undefined ) window.doCommandDumpArray = function( param, index ){};
	if( window.onStartPlot == undefined ) window.onStartPlot = function(){};
	if( window.onEndPlot == undefined ) window.onEndPlot = function(){};
	if( window.onStartRePlot == undefined ) window.onStartRePlot = function(){};
	if( window.onEndRePlot == undefined ) window.onEndRePlot = function(){};
}
function doFuncGColorBGR( rgb, bgrColorArray ){
	var i, j;
	var r = (rgb & 0xFF0000) >> 16;
	var g = (rgb & 0x00FF00) >> 8;
	var b = rgb & 0x0000FF;
	var rr, gg, bb, tmp;
	var d = 766 ;
	for( i = 0, j = 0; i < 256; i++ ){
		rr = bgrColorArray[i] & 0x0000FF;
		gg = (bgrColorArray[i] & 0x00FF00) >> 8;
		bb = (bgrColorArray[i] & 0xFF0000) >> 16;
		tmp = _ABS( rr - r ) + _ABS( gg - g ) + _ABS( bb - b );
		if( tmp < d ){
			j = i;
			d = tmp;
		}
	}
	return j;
}
function _RGB2BGR( data ){
	return ((data & 0x0000FF) << 16) + (data & 0x00FF00) + ((data & 0xFF0000) >> 16);
}
var _TOKEN_OP = [
	"[++]",
	"[--]",
	"[~]",
	"[!]",
	"[-]",
	"[+]",
	"++",
	"--",
	"*",
	"/",
	"%",
	"+",
	"-",
	"<<",
	">>",
	"<",
	"<=",
	">",
	">=",
	"==",
	"!=",
	"&",
	"^",
	"|",
	"&&",
	"||",
	"?",
	"=",
	"*=",
	"/=",
	"%=",
	"+=",
	"-=",
	"<<=",
	">>=",
	"&=",
	"|=",
	"^=",
	",",
	"**",
	"**="
];
var _TOKEN_FUNC = [
	"defined",
	"indexof",
	"isinf",
	"isnan",
	"rand",
	"time",
	"mktime",
	"tm_sec",
	"tm_min",
	"tm_hour",
	"tm_mday",
	"tm_mon",
	"tm_year",
	"tm_wday",
	"tm_yday",
	"tm_xmon",
	"tm_xyear",
	"a2d",
	"a2g",
	"a2r",
	"d2a",
	"d2g",
	"d2r",
	"g2a",
	"g2d",
	"g2r",
	"r2a",
	"r2d",
	"r2g",
	"sin",
	"cos",
	"tan",
	"asin",
	"acos",
	"atan",
	"atan2",
	"sinh",
	"cosh",
	"tanh",
	"asinh",
	"acosh",
	"atanh",
	"exp",
	"exp10",
	"ln",
	"log",
	"log10",
	"pow",
	"sqr",
	"sqrt",
	"ceil",
	"floor",
	"abs",
	"ldexp",
	"frexp",
	"modf",
	"int",
	"real",
	"imag",
	"arg",
	"norm",
	"conjg",
	"polar",
	"num",
	"denom",
	"row",
	"col",
	"trans",
	"strcmp",
	"stricmp",
	"strlen",
	"gwidth",
	"gheight",
	"gcolor",
	"gcolor24",
	"gcx",
	"gcy",
	"wcx",
	"wcy",
	"gget",
	"wget",
	"gx",
	"gy",
	"wx",
	"wy",
	"call",
	"eval"
];
var _TOKEN_STAT = [
	"$LOOPSTART",
	"$LOOPEND",
	"$LOOPEND_I",
	"$LOOPEND_D",
	"$LOOPENDE",
	"$LOOPENDE_I",
	"$LOOPENDE_D",
	"$LOOPCONT",
	"do",
	"until",
	"while",
	"endwhile",
	"for",
	"for",
	"next",
	"func",
	"endfunc",
	"if",
	"elif",
	"else",
	"endif",
	"switch",
	"case",
	"default",
	"endswi",
	"breakswi",
	"continue",
	"break",
	"$CONTINUE",
	"$BREAK",
	"assert",
	"return",
	"$RETURN",
	"$RETURN_A"
];
var _TOKEN_COMMAND = [
	"efloat",
	"float",
	"gfloat",
	"ecomplex",
	"complex",
	"gcomplex",
	"prec",
	"fract",
	"mfract",
	"htime",
	"mtime",
	"time",
	"ftime",
	"fps",
	"char",
	"uchar",
	"short",
	"ushort",
	"long",
	"ulong",
	"int",
	"uint",
	"radix",
	"ptype",
	"rad",
	"deg",
	"grad",
	"angle",
	"ans",
	"assert",
	"warn",
	"param",
	"params",
	"define",
	"enum",
	"undef",
	"var",
	"array",
	"local",
	"global",
	"label",
	"parent",
	"real",
	"imag",
	"num",
	"denom",
	"mat",
	"trans",
	"srand",
	"localtime",
	"arraycopy",
	"arrayfill",
	"strcpy",
	"strcat",
	"strlwr",
	"strupr",
	"clear",
	"error",
	"print",
	"println",
	"sprint",
	"scan",
	"gworld",
	"gclear",
	"gcolor",
	"gfill",
	"gmove",
	"gtext",
	"gtextr",
	"gtextl",
	"gtextrl",
	"gline",
	"gput",
	"gput24",
	"gget",
	"gget24",
	"gupdate",
	"window",
	"wfill",
	"wmove",
	"wtext",
	"wtextr",
	"wtextl",
	"wtextrl",
	"wline",
	"wput",
	"wget",
	"rectangular",
	"parametric",
	"polar",
	"logscale",
	"nologscale",
	"plot",
	"replot",
	"calculator",
	"include",
	"base",
	"namespace",
	"dump",
	"log"
];
var _TOKEN_SE = [
	"inc",
	"dec",
	"neg",
	"cmp",
	"not",
	"minus",
	"set",
	"setc",
	"setf",
	"setm",
	"mul",
	"div",
	"mod",
	"add",
	"adds",
	"sub",
	"subs",
	"pow",
	"shiftl",
	"shiftr",
	"and",
	"or",
	"xor",
	"lt",
	"le",
	"gt",
	"ge",
	"eq",
	"neq",
	"logand",
	"logor",
	"mul_a",
	"div_a",
	"mod_a",
	"add_a",
	"adds_a",
	"sub_a",
	"subs_a",
	"pow_a",
	"shiftl_a",
	"shiftr_a",
	"and_a",
	"or_a",
	"xor_a",
	"lt_a",
	"le_a",
	"gt_a",
	"ge_a",
	"eq_a",
	"neq_a",
	"logand_a",
	"logor_a",
	"cnd",
	"set_f",
	"set_t",
	"set_z",
	"loopstart",
	"loopend",
	"loopend_i",
	"loopend_d",
	"loopende",
	"loopende_i",
	"loopende_d",
	"loopcont",
	"continue",
	"break",
	"return",
	"return_a"
];
var _TOKEN_DEFINE = [
	"DBL_EPSILON",
	"HUGE_VAL",
	"RAND_MAX",
	"FALSE",
	"TRUE",
	"BG_COLOR",
	"TIME_ZONE",
	"INFINITY",
	"NAN"
];
var _VALUE_DEFINE = new Array( _TOKEN_DEFINE.length );
function setDefineValue(){
	_VALUE_DEFINE[0] = _DBL_EPSILON;
	_VALUE_DEFINE[1] = Number.MAX_VALUE;
	_VALUE_DEFINE[2] = _RAND_MAX;
	_VALUE_DEFINE[3] = 0;
	_VALUE_DEFINE[4] = 1;
	_VALUE_DEFINE[5] = gWorldBgColor();
	_VALUE_DEFINE[6] = (new Date()).getTimezoneOffset() * -60;
	_VALUE_DEFINE[7] = Number.POSITIVE_INFINITY;
	_VALUE_DEFINE[8] = Number.NaN;
}
function _indexOf( stringArray, string ){
	var len = stringArray.length;
	for( var i = 0; i < len; i++ ){
		if( stringArray[i] == string ){
			return i;
		}
	}
	return -1;
}
var _get_code;
var _get_token;
function getCode(){
	return _get_code;
}
function getToken(){
	return _get_token;
}
function __Token(){
	this._code = 0;
	this._token = null;
	this._before = null;
	this._next = null;
}
var _custom_command = new Array();
var _custom_command_num = 0;
function __CustomCommand(){
	this._name = new String();
	this._id = -1;
}
function regCustomCommand( name, id ){
	_custom_command[_custom_command_num] = new __CustomCommand();
	_custom_command[_custom_command_num]._name = name;
	_custom_command[_custom_command_num]._id = id;
	_custom_command_num++;
}
function _Token(){
	this._top = null;
	this._end = null;
	this._get = null;
}
_Token.prototype = {
	checkSqOp : function( string, op ){
		switch( string.charAt( 0 ) ){
		case '+':
			if( string.length == 1 ){
				op.set( 5 );
				return true;
			}
			if( (string.length == 2) && (string.charAt( 1 ) == '+') ){
				op.set( 0 );
				return true;
			}
			break;
		case '-':
			if( string.length == 1 ){
				op.set( 4 );
				return true;
			}
			if( (string.length == 2) && (string.charAt( 1 ) == '-') ){
				op.set( 1 );
				return true;
			}
			break;
		case '~':
			if( string.length == 1 ){
				op.set( 2 );
				return true;
			}
			break;
		case '!':
			if( string.length == 1 ){
				op.set( 3 );
				return true;
			}
			if( (string.length == 2) && (string.charAt( 1 ) == '=') ){
				op.set( 20 );
				return true;
			}
			break;
		case '<':
			if( string.length == 1 ){
				op.set( 15 );
				return true;
			}
			if( (string.length == 2) && (string.charAt( 1 ) == '=') ){
				op.set( 16 );
				return true;
			}
			break;
		case '>':
			if( string.length == 1 ){
				op.set( 17 );
				return true;
			}
			if( (string.length == 2) && (string.charAt( 1 ) == '=') ){
				op.set( 18 );
				return true;
			}
			break;
		case '=':
			if( (string.length == 2) && (string.charAt( 1 ) == '=') ){
				op.set( 19 );
				return true;
			}
			break;
		case '&':
			if( (string.length == 2) && (string.charAt( 1 ) == '&') ){
				op.set( 24 );
				return true;
			}
			break;
		case '|':
			if( (string.length == 2) && (string.charAt( 1 ) == '|') ){
				op.set( 25 );
				return true;
			}
			break;
		}
		return false;
	},
	checkFunc : function( string, func ){
		func.set( _indexOf( _TOKEN_FUNC, string ) );
		return (func._val >= 0);
	},
	checkStat : function( string, stat ){
		stat.set( _indexOf( _TOKEN_STAT, string ) );
		return (stat._val >= 0);
	},
	checkCommand : function( string, command ){
		command.set( _indexOf( _TOKEN_COMMAND, string ) + 1 );
		if( command._val >= 1 ){
				return true;
		}
		for( var i = 0; i < _custom_command_num; i++ ){
			if( string == _custom_command[i]._name ){
				command.set( _custom_command[i]._id );
				return true;
			}
		}
		return false;
	},
	checkSe : function( string, se ){
		se.set( _indexOf( _TOKEN_SE, string ) + 1 );
		if( se._val >= 1 ){
				return true;
		}
		if( this.checkFunc( string, se ) ){
			se.set( 69 + se._val );
			return true;
		}
		return false;
	},
	checkDefine : function( string, value ){
		var define = _indexOf( _TOKEN_DEFINE, string );
		if( define >= 0 ){
			value.ass( _VALUE_DEFINE[define] );
			return true;
		}
		return false;
	},
	stringToValue : function( param, string, value ){
		var i, j;
		var swi;
		var top;
		var stop = new _Integer();
		var tmp = new Array( 4 );
		top = isCharEscape( string, 0 ) ? 1 : 0;
		switch( string.charAt( top ) ){
		case '+': top++ ; swi = false; break;
		case '-': top++ ; swi = true ; break;
		default : top = 0; swi = false; break;
		}
		if( string.charAt( top ) == '\'' ){
			value.ass( 0.0 );
			j = 0;
			for( i = 1; ; i++ ){
				if( top + i >= string.length ){
					break;
				}
				if( isCharEscape( string, top + i ) ){
					i++;
					if( top + i >= string.length ){
						break;
					}
					switch( string.charAt( top + i ) ){
					case 'b': tmp[0] = _CHAR( '\b' ); break;
					case 'f': tmp[0] = _CHAR( '\f' ); break;
					case 'n': tmp[0] = _CHAR( '\n' ); break;
					case 'r': tmp[0] = _CHAR( '\r' ); break;
					case 't': tmp[0] = _CHAR( '\t' ); break;
					case 'v': tmp[0] = _CHAR( '\v' ); break;
					default : tmp[0] = string.charCodeAt( top + i ); break;
					}
				} else {
					tmp[0] = string.charCodeAt( top + i );
				}
				value.ass( value.toFloat() * 256 + tmp[0] );
				j++;
				if( j >= 4 ){
					break;
				}
			}
			if( swi ){
				value.ass( value.minus() );
			}
		} else if( isCharEscape( string, top ) ){
			switch( string.charAt( top + 1 ) ){
			case 'b':
			case 'B':
				value.ass( stringToInt( string, top + 2, stop, 2 ) );
				if( stop._val < string.length ){
					return false;
				}
				break;
			case '0':
				value.ass( stringToInt( string, top + 2, stop, 8 ) );
				if( stop._val < string.length ){
					return false;
				}
				break;
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				value.ass( stringToInt( string, top + 1, stop, 10 ) );
				if( stop._val < string.length ){
					return false;
				}
				break;
			case 'x':
			case 'X':
				value.ass( stringToInt( string, top + 2, stop, 16 ) );
				if( stop._val < string.length ){
					return false;
				}
				break;
			default:
				return false;
			}
			if( swi ){
				value.ass( value.minus() );
			}
		} else {
			if( (param._mode & 0x0020) != 0 ){
				tmp[0] = stringToFloat( string, top, stop );
				switch( string.charAt( stop._val ) ){
				case '\\':
				case '¥':
				case '+':
				case '-':
					if( stop._val == top ){
						return false;
					}
					value.setReal( swi ? -tmp[0] : tmp[0] );
					if( isCharEscape( string, stop._val ) ){
						stop.add( 1 );
					}
					switch( string.charAt( stop._val ) ){
					case '+': swi = false; break;
					case '-': swi = true ; break;
					default : return false;
					}
					top = stop._val + 1;
					tmp[0] = stringToFloat( string, top, stop );
					if( (string.charAt( stop._val ) != 'i') && (string.charAt( stop._val ) != 'I') ){
						return false;
					} else {
						if( stop._val + 1 < string.length ){
							return false;
						}
						if( stop._val == top ){
							value.setImag( swi ? -1.0 : 1.0 );
						} else {
							value.setImag( swi ? -tmp[0] : tmp[0] );
						}
					}
					break;
				case 'i':
				case 'I':
					if( stop._val + 1 < string.length ){
						return false;
					}
					value.setReal( 0.0 );
					if( stop._val == top ){
						value.setImag( swi ? -1.0 : 1.0 );
					} else {
						value.setImag( swi ? -tmp[0] : tmp[0] );
					}
					break;
				default:
					if( stop._val == top ){
						return false;
					}
					value.ass( swi ? -tmp[0] : tmp[0] );
					if( stop._val < string.length ){
						switch( string.charAt( stop._val ) ){
						case 'd': case 'D': value.angToAng( 1 , complexAngType() ); break;
						case 'g': case 'G': value.angToAng( 2, complexAngType() ); break;
						case 'r': case 'R': value.angToAng( 0 , complexAngType() ); break;
						default : return false;
						}
					}
					break;
				}
			} else if( (param._mode & (0x0010 | 0x0040)) != 0 ){
				tmp[0] = stringToFloat( string, top, stop );
				switch( string.charAt( stop._val ) ){
				case '_':
				case '」':
					if( stop._val == top ){
						return false;
					}
					value.fractSetMinus( swi );
					value.setNum( tmp[0] );
					if( isCharEscape( string, stop._val + 1 ) ){
						top = stop._val + 2;
					} else {
						top = stop._val + 1;
					}
					tmp[0] = stringToFloat( string, top, stop );
					switch( string.charAt( stop._val ) ){
					case '_':
					case '」':
						if( stop._val == top ){
							return false;
						}
						if( isCharEscape( string, stop._val + 1 ) ){
							top = stop._val + 2;
						} else {
							top = stop._val + 1;
						}
						tmp[1] = stringToFloat( string, top, stop );
						if( (tmp[0] < 0.0) || (tmp[1] < 0.0) ){
							return false;
						}
						value.setDenom( tmp[1] );
						value.setNum ( value.num() * value.denom() + tmp[0] );
						value.fractReduce();
						break;
					default:
						if( tmp[0] < 0.0 ){
							return false;
						}
						value.setDenom( tmp[0] );
						value.fractReduce();
						break;
					}
					break;
				default:
					if( stop._val == top ){
						return false;
					}
					value.ass( swi ? -tmp[0] : tmp[0] );
					break;
				}
				if( stop._val < string.length ){
					switch( string.charAt( stop._val ) ){
					case 'd': case 'D': value.angToAng( 1 , complexAngType() ); break;
					case 'g': case 'G': value.angToAng( 2, complexAngType() ); break;
					case 'r': case 'R': value.angToAng( 0 , complexAngType() ); break;
					default : return false;
					}
				}
			} else if( (param._mode & 0x0080) != 0 ){
				var _break = false;
				for( i = 0; i < 4; i++ ){
					if( isCharEscape( string, top ) ){
						top++;
					}
					tmp[i] = stringToFloat( string, top, stop );
					if( stop._val == top ){
						return false;
					}
					if( stop._val >= string.length ){
						break;
					}
					switch( string.charAt( stop._val ) ){
					case 'h':
					case 'H':
					case 'm':
					case 'M':
					case 's':
					case 'S':
					case 'f':
					case 'F':
						if( stop._val + 1 < string.length ){
							return false;
						}
						_break = true;
						break;
					case ':':
						break;
					default:
						return false;
					}
					if( _break ){
						break;
					}
					top = stop._val + 1;
				}
				value.timeSetMinus( swi );
				switch( i ){
				case 0:
					if( stop._val < string.length ){
						switch( string.charAt( stop._val ) ){
						case 'h': case 'H': value.setHour ( tmp[0] ); value.timeReduce(); break;
						case 'm': case 'M': value.setMin ( tmp[0] ); value.timeReduce(); break;
						case 's': case 'S': value.setSec ( tmp[0] ); value.timeReduce(); break;
						case 'f': case 'F': value.setFrame( tmp[0] ); value.timeReduce(); break;
						}
					} else {
						value.setSec( tmp[0] );
						value.timeReduce();
					}
					break;
				case 1:
					if( stop._val < string.length ){
						switch( string.charAt( stop._val ) ){
						case 'h': case 'H': return false;
						case 'm': case 'M': value.setHour( tmp[0] ); value.setMin ( tmp[1] ); value.timeReduce(); break;
						case 's': case 'S': value.setMin ( tmp[0] ); value.setSec ( tmp[1] ); value.timeReduce(); break;
						case 'f': case 'F': value.setSec ( tmp[0] ); value.setFrame( tmp[1] ); value.timeReduce(); break;
						}
					} else {
						switch( param._mode ){
						case 0x0080:
						case 0x0081: value.setHour( tmp[0] ); value.setMin ( tmp[1] ); value.timeReduce(); break;
						case 0x0082: value.setMin ( tmp[0] ); value.setSec ( tmp[1] ); value.timeReduce(); break;
						case 0x0083: value.setSec ( tmp[0] ); value.setFrame( tmp[1] ); value.timeReduce(); break;
						}
					}
					break;
				case 2:
					if( stop._val < string.length ){
						switch( string.charAt( stop._val ) ){
						case 'h': case 'H':
						case 'm': case 'M': return false;
						case 's': case 'S': value.setHour( tmp[0] ); value.setMin( tmp[1] ); value.setSec ( tmp[2] ); value.timeReduce(); break;
						case 'f': case 'F': value.setMin ( tmp[0] ); value.setSec( tmp[1] ); value.setFrame( tmp[2] ); value.timeReduce(); break;
						}
					} else {
						switch( param._mode ){
						case 0x0080:
						case 0x0081:
						case 0x0082: value.setHour( tmp[0] ); value.setMin( tmp[1] ); value.setSec ( tmp[2] ); value.timeReduce(); break;
						case 0x0083: value.setMin ( tmp[0] ); value.setSec( tmp[1] ); value.setFrame( tmp[2] ); value.timeReduce(); break;
						}
					}
					break;
				case 3:
					if( stop._val < string.length ){
						switch( string.charAt( stop._val ) ){
						case 'h': case 'H':
						case 'm': case 'M':
						case 's': case 'S': return false;
						case 'f': case 'F': value.setHour( tmp[0] ); value.setMin( tmp[1] ); value.setSec( tmp[2] ); value.setFrame( tmp[3] ); value.timeReduce(); break;
						}
					} else {
						switch( param._mode ){
						case 0x0080:
						case 0x0081:
						case 0x0082:
						case 0x0083: value.setHour( tmp[0] ); value.setMin( tmp[1] ); value.setSec( tmp[2] ); value.setFrame( tmp[3] ); value.timeReduce(); break;
						}
					}
					break;
				}
			} else if( (param._mode & 0x0100) != 0 ){
				value.ass( stringToInt( string, top, stop, param._radix ) );
				if( stop._val < string.length ){
					return false;
				}
				if( swi ){
					value.ass( value.minus() );
				}
			}
		}
		return true;
	},
	_floatToString : function( param, value ){
		var str = "";
		var prec = param._prec;
		switch( param._mode ){
		case 0x0010:
		case 0x0020:
			str = floatToExponential( value, (prec == 0) ? _EPREC( value ) : prec );
			break;
		case 0x0011:
		case 0x0021:
			str = floatToFixed( value, (prec == 0) ? _FPREC( value ) : prec );
			break;
		case 0x0012:
		case 0x0022:
			str = floatToString( value, (prec == 0) ? 15 : prec );
			break;
		}
		return str;
	},
	valueToString : function( param, value, real , imag ){
		switch( param._mode ){
		case 0x0020:
		case 0x0021:
		case 0x0022:
			if( _ISZERO( value.imag() ) ){
				real.set( this._floatToString( param, value.real() ) );
				imag.set( "" );
			} else if( _ISZERO( value.real() ) ){
				real.set( "" );
				imag.set( this._floatToString( param, value.imag() ) + "i" );
			} else {
				real.set( this._floatToString( param, value.real() ) );
				imag.set( (value.imag() > 0.0) ? "+" : "" );
				imag.add( this._floatToString( param, value.imag() ) + "i" );
			}
			break;
		case 0x0010:
		case 0x0011:
		case 0x0012:
			real.set( this._floatToString( param, value.real() ) );
			imag.set( "" );
			break;
		case 0x0041:
			if( (value.denom() != 0) && (_DIV( value.num(), value.denom() ) != 0) ){
				if( _MOD( value.num(), value.denom() ) != 0 ){
					real.set( value.fractMinus() ? "-" : "" );
					real.add( _DIV( value.num(), value.denom() ) );
					real.add( "」" );
					real.add( _MOD( value.num(), value.denom() ) );
					real.add( "」" );
					real.add( value.denom() );
				} else {
					real.set( value.fractMinus() ? "-" : "" );
					real.add( _DIV( value.num(), value.denom() ) );
				}
				imag.set( "" );
				break;
			}
		case 0x0040:
			if( value.denom() == 0 ){
				real.set( value.toFloat() );
			} else if( value.denom() == 1 ){
				real.set( value.fractMinus() ? "-" : "" );
				real.add( value.num() );
			} else {
				real.set( value.fractMinus() ? "-" : "" );
				real.add( value.num() );
				real.add( "」" );
				real.add( value.denom() );
			}
			imag.set( "" );
			break;
		case 0x0080:
			real.set( value.timeMinus() ? "-" : "" );
			real.add( ((value.hour() < 10.0) ? "0" : "") + value.hour() );
			imag.set( "" );
			break;
		case 0x0081:
			if( _INT( value.hour() ) != 0 ){
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.hour() < 10.0) ? "0" : "") + _INT( value.hour() ) );
				real.add( ":" );
				real.add( ((value.min () < 10.0) ? "0" : "") + value.min() );
			} else {
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.min() < 10.0) ? "0" : "") + value.min() );
			}
			imag.set( "" );
			break;
		case 0x0082:
			if( _INT( value.hour() ) != 0 ){
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.hour() < 10.0) ? "0" : "") + _INT( value.hour() ) );
				real.add( ":" );
				real.add( ((value.min () < 10.0) ? "0" : "") + _INT( value.min() ) );
				real.add( ":" );
				real.add( ((value.sec () < 10.0) ? "0" : "") + value.sec() );
			} else if( _INT( value.min() ) != 0 ){
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.min() < 10.0) ? "0" : "") + _INT( value.min() ) );
				real.add( ":" );
				real.add( ((value.sec() < 10.0) ? "0" : "") + value.sec() );
			} else {
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.sec() < 10.0) ? "0" : "") + value.sec() );
			}
			imag.set( "" );
			break;
		case 0x0083:
			if( _INT( value.hour() ) != 0 ){
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.hour () < 10.0) ? "0" : "") + _INT( value.hour() ) );
				real.add( ":" );
				real.add( ((value.min () < 10.0) ? "0" : "") + _INT( value.min() ) );
				real.add( ":" );
				real.add( ((value.sec () < 10.0) ? "0" : "") + _INT( value.sec() ) );
				real.add( ":" );
				real.add( ((value.frame() < 10.0) ? "0" : "") + value.frame() );
			} else if( _INT( value.min() ) != 0 ){
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.min () < 10.0) ? "0" : "") + _INT( value.min() ) );
				real.add( ":" );
				real.add( ((value.sec () < 10.0) ? "0" : "") + _INT( value.sec() ) );
				real.add( ":" );
				real.add( ((value.frame() < 10.0) ? "0" : "") + value.frame() );
			} else if( _INT( value.sec() ) != 0 ){
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.sec () < 10.0) ? "0" : "") + _INT( value.sec() ) );
				real.add( ":" );
				real.add( ((value.frame() < 10.0) ? "0" : "") + value.frame() );
			} else {
				real.set( value.timeMinus() ? "-" : "" );
				real.add( ((value.frame() < 10.0) ? "0" : "") + value.frame() );
			}
			imag.set( "" );
			break;
		case 0x0100:
			real.set( intToString( _SIGNED( value.toFloat(), 256, -128, 127 ), param._radix ) );
			imag.set( "" );
			break;
		case 0x0101:
			real.set( intToString( _UNSIGNED( value.toFloat(), 256 ), param._radix ) );
			imag.set( "" );
			break;
		case 0x0102:
			real.set( intToString( _SIGNED( value.toFloat(), 65536, -32768, 32767 ), param._radix ) );
			imag.set( "" );
			break;
		case 0x0103:
			real.set( intToString( _UNSIGNED( value.toFloat(), 65536 ), param._radix ) );
			imag.set( "" );
			break;
		case 0x0104:
			real.set( intToString( _SIGNED( value.toFloat(), 4294967296, -2147483648, 2147483647 ), param._radix ) );
			imag.set( "" );
			break;
		case 0x0105:
			real.set( intToString( _UNSIGNED( value.toFloat(), 4294967296 ), param._radix ) );
			imag.set( "" );
			break;
		}
	},
	sepString : function( string , sep ){
		var src = new String();
		var dst = new String();
		var top;
		var end;
		var _float;
		var _break;
		var len;
		src = string.str();
		dst = "";
		top = 0;
		while( true ){
			_float = false;
			_break = false;
			for( ; top < src.length; top++ ){
				switch( src.charAt( top ) ){
				case '+':
				case '-':
				case '.':
				case 'e':
				case 'E':
				case 'i':
				case 'I':
				case '_':
				case '」':
				case ':':
					if( src.charAt( top ) == '.' ){
						_float = true;
					}
					dst += src.charAt( top );
					break;
				default:
					_break = true;
					break;
				}
				if( _break ){
					break;
				}
			}
			if( top >= src.length ){
				break;
			}
			_break = false;
			for( end = top + 1; end < src.length; end++ ){
				switch( src.charAt( end ) ){
				case '+':
				case '-':
				case '.':
				case 'e':
				case 'E':
				case 'i':
				case 'I':
				case '_':
				case '」':
				case ':':
					_break = true;
					break;
				}
				if( _break ){
					break;
				}
			}
			for( len = end - top; len > 0; len-- ){
				dst += src.charAt( top );
				top++;
				if( !_float && (len != 1) && ((len % 3) == 1) ){
					dst += sep;
				}
			}
		}
		string.set( dst );
	},
	newToken : function( code, token ){
		switch( code ){
		case 0:
		case 15:
		case 16:
		case 17:
		case 20:
		case 21:
			return null;
		case 7:
			return dupValue( token );
		case 18:
			return dupMatrix( token );
		}
		return token;
	},
	delToken : function( code, token ){
		if( token != null ){
			switch( code ){
			case 7:
				deleteValue( token );
				break;
			case 18:
				deleteMatrix( token );
				break;
			}
		}
	},
	_newToken : function( cur, param, token, len, strToVal ){
		var i;
		var tmp;
		var code = new _Integer();
		switch( token.charCodeAt( 0 ) ){
		case 0:
		case 15:
		case 16:
		case 17:
		case 21:
			cur._code = token.charCodeAt( 0 );
			cur._token = null;
			break;
		case 11:
			cur._code = token.charCodeAt( 0 );
			cur._token = token.charCodeAt( 1 );
			break;
		default:
			if( token.charAt( 0 ) == '@' ){
				if( len == 1 ){
					cur._code = 0x44;
					cur._token = 0;
				} else if( (len > 2) && (token.charAt( 1 ) == '@') ){
					cur._code = 0x44;
					cur._token = token.charCodeAt( 2 );
				} else {
					cur._code = 0x21;
					cur._token = token.charCodeAt( 1 );
				}
				break;
			}
			if( token.charAt( 0 ) == '&' ){
				if( len == 1 ){
					cur._code = 20;
					cur._token = null;
					break;
				}
			}
			tmp = token.substring( 0, len );
			if( tmp.charAt( 0 ) == '$' ){
				if( this.checkSe( tmp.substring( 1, len ).toLowerCase(), code ) ){
					switch( code._val ){
					case 57:
						cur._code = 10;
						cur._token = 0;
						break;
					case 58:
						cur._code = 10;
						cur._token = 1;
						break;
					case 59:
						cur._code = 10;
						cur._token = 2;
						break;
					case 60:
						cur._code = 10;
						cur._token = 3;
						break;
					case 61:
						cur._code = 10;
						cur._token = 4;
						break;
					case 62:
						cur._code = 10;
						cur._token = 5;
						break;
					case 63:
						cur._code = 10;
						cur._token = 6;
						break;
					case 64:
						cur._code = 10;
						cur._token = 7;
						break;
					case 65:
						cur._code = 10;
						cur._token = 28;
						break;
					case 66:
						cur._code = 10;
						cur._token = 29;
						break;
					case 67:
						cur._code = 10;
						cur._token = 32;
						break;
					case 68:
						cur._code = 10;
						cur._token = 33;
						break;
					default:
						cur._code = 22;
						cur._token = code._val;
						break;
					}
				} else {
					cur._code = 22;
					cur._token = 0;
				}
			} else if( this.checkSqOp( tmp, code ) ){
				cur._code = 11;
				cur._token = code._val;
			} else if( tmp.charAt( 0 ) == ':' ){
				cur._code = 9;
				if( this.checkCommand( tmp.substring( 1, len ), code ) ){
					cur._token = code._val;
				} else {
					cur._token = 0;
				}
			} else if( tmp.charAt( 0 ) == '!' ){
				cur._code = 13;
				cur._token = tmp.substring( 1, len );
			} else if( tmp.charAt( 0 ) == '"' ){
				cur._code = 19;
				cur._token = new String();
				for( i = 1; ; i++ ){
					if( i >= tmp.length ){
						break;
					}
					if( isCharEscape( tmp, i ) ){
						i++;
						if( i >= tmp.length ){
							break;
						}
						switch( tmp.charAt( i ) ){
						case 'b': cur._token += '\b'; break;
						case 'f': cur._token += '\f'; break;
						case 'n': cur._token += '\n'; break;
						case 'r': cur._token += '\r'; break;
						case 't': cur._token += '\t'; break;
						case 'v': cur._token += '\v'; break;
						default : cur._token += tmp.charAt( i ); break;
						}
					} else {
						cur._token += tmp.charAt( i );
					}
				}
			} else if( this.checkFunc( tmp, code ) ){
				cur._code = 12;
				cur._token = code._val;
			} else if( this.checkStat( tmp, code ) ){
				cur._code = 10;
				cur._token = code._val;
			} else {
				cur._code = 7;
				cur._token = new _Value();
				if( this.checkDefine( tmp, cur._token ) ){
				} else if( strToVal && this.stringToValue( param, tmp, cur._token ) ){
				} else {
					cur._code = 8;
					cur._topen = new String();
					cur._token = tmp;
				}
			}
			break;
		}
	},
	_newTokenValue : function( cur, value ){
		cur._code = 7;
		cur._token = dupValue( value );
	},
	_newTokenMatrix : function( cur, value ){
		cur._code = 18;
		cur._token = dupMatrix( value );
	},
	_delToken : function( cur ){
		this.delToken( cur._code, cur._token );
		cur._token = null;
	},
	_searchList : function( num ){
		var tmp = 0;
		var cur = this._top;
		while( true ){
			if( cur == null ){
				return null;
			}
			if( tmp == num ){
				break;
			}
			tmp++;
			cur = cur._next;
		}
		return cur;
	},
	_addToken : function(){
		var tmp = new __Token();
		if( this._top == null ){
			this._top = tmp;
			this._end = tmp;
		} else {
			tmp._before = this._end;
			this._end._next = tmp;
			this._end = tmp;
		}
		return tmp;
	},
	add : function( param, token, len, strToVal ){
		var tmp = this._addToken();
		this._newToken( tmp, param, token, len, strToVal );
	},
	addValue : function( value ){
		var tmp = this._addToken();
		this._newTokenValue( tmp, value );
	},
	addMatrix : function( value ){
		var tmp = this._addToken();
		this._newTokenMatrix( tmp, value );
	},
	addCode : function( code, token ){
		var tmp = this._addToken();
		tmp._code = code;
		tmp._token = this.newToken( code, token );
	},
	_insToken : function( cur ){
		var tmp = new __Token();
		tmp._before = cur._before;
		tmp._next = cur;
		if( cur._before != null ){
			cur._before._next = tmp;
		} else {
			this._top = tmp;
		}
		cur._before = tmp;
		return tmp;
	},
	_ins : function( cur, param, token, len, strToVal ){
		if( cur == null ){
			this.add( param, token, len, strToVal );
		} else {
			var tmp = this._insToken( cur );
			this._newToken( tmp, param, token, len, strToVal );
		}
	},
	_insValue : function( cur, value ){
		if( cur == null ){
			this.addValue( value );
		} else {
			var tmp = this._insToken( cur );
			this._newTokenValue( tmp, value );
		}
	},
	_insMatrix : function( cur, value ){
		if( cur == null ){
			this.addMatrix( value );
		} else {
			var tmp = this._insToken( cur );
			this._newTokenMatrix( tmp, value );
		}
	},
	_insCode : function( cur, code, token ){
		if( cur == null ){
			this.addCode( code, token );
		} else {
			var tmp = this._insToken( cur );
			tmp._code = code;
			tmp._token = this.newToken( code, token );
		}
	},
	ins : function( num, param, token, len, strToVal ){
		this._ins( this._searchList( num ), param, token, len, strToVal );
	},
	insValue : function( num, value ){
		this._insValue( this._searchList( num ), value );
	},
	insMatrix : function( num, value ){
		this._insMatrix( this._searchList( num ), value );
	},
	insCode : function( num, code, token ){
		this._insCode( this._searchList( num ), code, token );
	},
	del : function( num ){
		var tmp;
		if( num == 0 ){
			tmp = this._top;
		} else if( num < 0 ){
			tmp = this._end;
		} else {
			tmp = this._searchList( num );
		}
		if( tmp == null ){
			return 0x2000;
		}
		if( tmp._before != null ){
			tmp._before._next = tmp._next;
		} else {
			this._top = tmp._next;
		}
		if( tmp._next != null ){
			tmp._next._before = tmp._before;
		} else {
			this._end = tmp._before;
		}
		this._delToken( tmp );
		return 0x00;
	},
	delAll : function(){
		var cur;
		var tmp;
		cur = top;
		while( cur != null ){
			tmp = cur;
			cur = cur._next;
			this._delToken( tmp );
		}
		this._top = null;
	},
	separate : function( param, line, strToVal ){
		var cur;
		var token = new String();
		var len = 0;
		var strFlag = false;
		var topCount = 0;
		var formatSeFlag = false;
		this.delAll();
		cur = 0;
		while( cur < line.length ){
			if( isCharEscape( line, cur ) ){
				switch( line.charAt( cur + 1 ) ){
				case '0':
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
				case '9':
				case 'b':
				case 'B':
				case 'f':
				case 'n':
				case 'r':
				case 't':
				case 'v':
				case 'x':
				case 'X':
					break;
				case '\\':
				case '¥':
					if( len == 0 ) token = new String();
					token += line.charAt( cur );
					len++;
				default:
					cur++;
					if( cur >= line.length ){
						continue;
					}
					break;
				}
				if( len == 0 ) token = new String();
				token += line.charAt( cur );
				len++;
			} else if( (line.charAt( cur ) == '[') && !strFlag ){
				if( len > 0 ){
					this.add( param, token, len, strToVal );
					len = 0;
				}
				strFlag = true;
			} else if( (line.charAt( cur ) == ']') && strFlag ){
				if( len == 0 ){
					token = String.fromCharCode( 21 );
					this.add( param, token, 1, strToVal );
				} else {
					this.add( param, token, len, strToVal );
					len = 0;
				}
				strFlag = false;
			} else if( strFlag ){
				if( len == 0 ) token = new String();
				token += line.charAt( cur );
				len++;
			} else {
				var curChar = line.charAt( cur );
				if( line.charCodeAt( cur ) == 0xA0 ){
					curChar = ' ';
				}
				switch( curChar ){
				case ' ':
				case '\t':
				case '\r':
				case '\n':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					break;
				case '(':
				case ')':
				case '{':
				case '}':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					switch( curChar ){
					case '(':
						token = String.fromCharCode( 0 );
						if( !formatSeFlag ){
							if( topCount >= 0 ){
								topCount++;
							}
						}
						break;
					case ')':
						token = String.fromCharCode( 15 );
						if( !formatSeFlag ){
							topCount--;
						}
						break;
					case '{':
						token = String.fromCharCode( 16 );
						formatSeFlag = true;
						break;
					case '}':
						token = String.fromCharCode( 17 );
						formatSeFlag = false;
						break;
					}
					this.add( param, token, 1, strToVal );
					break;
				case ':':
					if( len == 0 ) token = new String();
					token += curChar;
					len++;
					if( token.charAt( 0 ) == '@' ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					break;
				case '?':
				case '=':
				case ',':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					token = String.fromCharCode( 11 );
					switch( curChar ){
					case '?': token += String.fromCharCode( 26 ); break;
					case ',': token += String.fromCharCode( 38 ); break;
					case '=':
						if( line.charAt( cur + 1 ) == '=' ){
							token += String.fromCharCode( 19 );
							cur++;
						} else {
							token += String.fromCharCode( 27 );
						}
						break;
					}
					this.add( param, token, 2, strToVal );
					break;
				case '&':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					token = String.fromCharCode( 11 );
					switch( line.charAt( cur + 1 ) ){
					case '&': token += String.fromCharCode( 24 ); cur++; break;
					case '=': token += String.fromCharCode( 35 ); cur++; break;
					default : token += String.fromCharCode( 21 ); break;
					}
					this.add( param, token, 2, strToVal );
					break;
				case '|':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					token = String.fromCharCode( 11 );
					switch( line.charAt( cur + 1 ) ){
					case '|': token += String.fromCharCode( 25 ); cur++; break;
					case '=': token += String.fromCharCode( 36 ); cur++; break;
					default : token += String.fromCharCode( 23 ); break;
					}
					this.add( param, token, 2, strToVal );
					break;
				case '*':
				case '/':
				case '%':
				case '^':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					token = String.fromCharCode( 11 );
					if( line.charAt( cur + 1 ) == '=' ){
						switch( curChar ){
						case '*': token += String.fromCharCode( 28 ); break;
						case '/': token += String.fromCharCode( 29 ); break;
						case '%': token += String.fromCharCode( 30 ); break;
						case '^':
							if( param._enableOpPow && ((param._mode & 0x0100) == 0) ){
								token += String.fromCharCode( 40 );
							} else {
								token += String.fromCharCode( 37 );
							}
							break;
						}
						cur++;
					} else {
						switch( curChar ){
						case '*':
							if( line.charAt( cur + 1 ) == '*' ){
								if( line.charAt( cur + 2 ) == '=' ){
									token += String.fromCharCode( 40 );
									cur += 2;
								} else {
									token += String.fromCharCode( 39 );
									cur++;
								}
							} else {
								token += String.fromCharCode( 8 );
							}
							break;
						case '/': token += String.fromCharCode( 9 ); break;
						case '%': token += String.fromCharCode( 10 ); break;
						case '^':
							if( param._enableOpPow && ((param._mode & 0x0100) == 0) ){
								token += String.fromCharCode( 39 );
							} else {
								token += String.fromCharCode( 22 );
							}
							break;
						}
					}
					this.add( param, token, 2, strToVal );
					break;
				case '+':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					token = String.fromCharCode( 11 );
					switch( line.charAt( cur + 1 ) ){
					case '=': token += String.fromCharCode( 31 ); cur++; break;
					case '+': token += String.fromCharCode( 6 ); cur++; break;
					default : token += String.fromCharCode( 11 ); break;
					}
					this.add( param, token, 2, strToVal );
					break;
				case '-':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					token = String.fromCharCode( 11 );
					switch( line.charAt( cur + 1 ) ){
					case '=': token += String.fromCharCode( 32 ); cur++; break;
					case '-': token += String.fromCharCode( 7 ); cur++; break;
					default : token += String.fromCharCode( 12 ); break;
					}
					this.add( param, token, 2, strToVal );
					break;
				case '<':
				case '>':
					if( len > 0 ){
						this.add( param, token, len, strToVal );
						len = 0;
					}
					token = String.fromCharCode( 11 );
					if( line.charAt( cur + 1 ) == curChar ){
						if( line.charAt( cur + 2 ) == '=' ){
							switch( curChar ){
							case '<': token += String.fromCharCode( 33 ); break;
							case '>': token += String.fromCharCode( 34 ); break;
							}
							cur += 2;
						} else {
							switch( curChar ){
							case '<': token += String.fromCharCode( 13 ); break;
							case '>': token += String.fromCharCode( 14 ); break;
							}
							cur++;
						}
					} else {
						if( line.charAt( cur + 1 ) == '=' ){
							switch( curChar ){
							case '<': token += String.fromCharCode( 16 ); break;
							case '>': token += String.fromCharCode( 18 ); break;
							}
							cur++;
						} else {
							switch( curChar ){
							case '<': token += String.fromCharCode( 15 ); break;
							case '>': token += String.fromCharCode( 17 ); break;
							}
						}
					}
					this.add( param, token, 2, strToVal );
					break;
				case '!':
					if( line.charAt( cur + 1 ) == '=' ){
						if( len > 0 ){
							this.add( param, token, len, strToVal );
							len = 0;
						}
						token = String.fromCharCode( 11 ) + String.fromCharCode( 20 );
						cur++;
						this.add( param, token, 2, strToVal );
					} else {
						if( len == 0 ) token = new String();
						token += curChar;
						len++;
					}
					break;
				case 'e':
				case 'E':
					if( ((param._mode & 0x0100) == 0) && (len > 0) ){
						if( (line.charAt( cur + 1 ) == '+') || (line.charAt( cur + 1 ) == '-') ){
							var _break = false;
							for( var i = 0; i < len; i++ ){
								switch( token.charAt( i ) ){
								case '+':
								case '-':
								case '0':
								case '1':
								case '2':
								case '3':
								case '4':
								case '5':
								case '6':
								case '7':
								case '8':
								case '9':
								case '.':
									break;
								default:
									_break = true;
									break;
								}
								if( _break ){
									break;
								}
							}
							if( !_break ){
								token += curChar;
								cur++;
								token += line.charAt( cur );
								len += 2;
								break;
							}
						}
					}
				default:
					if( len == 0 ) token = new String();
					token += curChar;
					len++;
					break;
				}
			}
			cur++;
		}
		if( len > 0 ){
			this.add( param, token, len, strToVal );
		}
		if( this._top != null ){
			if( this._top._code == 22 ){
				if( topCount != 0 ){
					return 0x2181;
				}
			}
		}
		return 0x00;
	},
	_checkOp : function( op ){
		switch( op ){
		case 6:
		case 7:
			return 15;
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 39:
			return 14;
		case 8:
		case 9:
		case 10:
			return 13;
		case 11:
		case 12:
			return 12;
		case 13:
		case 14:
			return 11;
		case 15:
		case 16:
		case 17:
		case 18:
			return 10;
		case 19:
		case 20:
			return 9;
		case 21:
			return 8;
		case 22:
			return 7;
		case 23:
			return 6;
		case 24:
			return 5;
		case 25:
			return 4;
		case 26:
			return 3;
		case 27:
		case 28:
		case 29:
		case 30:
		case 31:
		case 32:
		case 33:
		case 34:
		case 35:
		case 36:
		case 37:
		case 40:
			return 2;
		case 38:
			return 1;
		}
		return 0;
	},
	_format : function( top, param, strToVal ){
		var level, topLevel;
		var assLevel = this._checkOp( 27 );
		var retTop, retEnd;
		var tmpTop;
		var tmpEnd;
		var i;
		var cur = top;
		while( cur != null ){
			if( cur._code == 11 ){
				level = this._checkOp( cur._token );
				retTop = 0;
				retEnd = 0;
				i = 0;
				tmpTop = cur._before;
				while( tmpTop != null ){
					switch( tmpTop._code ){
					case 0:
						if( i > 0 ){
							i--;
						} else {
							retTop = 1;
						}
						break;
					case 15:
						i++;
						break;
					case 10:
						this._ins( tmpTop._next, param, String.fromCharCode( 0 ), 1, strToVal );
						retTop = 1;
						break;
					case 11:
						if( i == 0 ){
							topLevel = this._checkOp( tmpTop._token );
							if( ((topLevel == assLevel) && (level == assLevel)) || (topLevel < level) ){
								retTop = 2;
							}
						}
						break;
					}
					if( retTop == 2 ){
						i = 0;
						tmpEnd = cur._next;
						while( tmpEnd != null ){
							switch( tmpEnd._code ){
							case 0:
								i++;
								break;
							case 15:
								if( i > 0 ){
									i--;
								} else {
									retEnd = 1;
								}
								break;
							case 11:
								if( i == 0 ){
									if( this._checkOp( tmpEnd._token ) < topLevel ){
										retEnd = 2;
									}
								}
								break;
							}
							if( retEnd > 0 ){
								break;
							}
							tmpEnd = tmpEnd._next;
						}
						this._ins( tmpTop._next, param, String.fromCharCode( 0 ), 1, strToVal );
						if( retEnd > 0 ){
							this._ins( tmpEnd, param, String.fromCharCode( 15 ), 1, strToVal );
						}
					}
					if( retTop > 0 ){
						break;
					}
					tmpTop = tmpTop._before;
				}
			}
			cur = cur._next;
		}
		return 0x00;
	},
	_formatSe : function( param, strToVal ){
		var i;
		var tmpTop = null;
		var saveBefore;
		var saveNext;
		var ret;
		var cur = this._top;
		var cur2;
		while( cur != null ){
			if( cur._code == 16 ){
				cur._code = 0;
				tmpTop = cur._next;
			} else if( cur._code == 17 ){
				cur._code = 15;
				if( tmpTop == null ){
					return 0x2181;
				} else {
					saveBefore = tmpTop._before;
					tmpTop._before = null;
					saveNext = cur._before._next;
					cur._before._next = null;
					if( (ret = this._format( tmpTop, param, strToVal )) != 0x00 ){
						return ret;
					}
					tmpTop._before = saveBefore;
					i = 0;
					cur2 = tmpTop;
					while( cur2 != null ){
						switch( cur2._code ){
						case 0:
							i++;
							break;
						case 15:
							i--;
							for( ; i < 0; i++ ){
								this._ins( tmpTop, param, String.fromCharCode( 0 ), 1, strToVal );
							}
							break;
						}
						cur2 = cur2._next;
					}
					cur._before._next = saveNext;
					for( ; i > 0; i-- ){
						this._ins( cur, param, String.fromCharCode( 15 ), 1, strToVal );
					}
					tmpTop = null;
				}
			}
			cur = cur._next;
		}
		if( tmpTop != null ){
			return 0x2181;
		}
		return 0x00;
	},
	format : function( param, strToVal ){
		var ret;
		if( this._top != null ){
			if( this._top._code == 22 ){
				return this._formatSe( param, strToVal );
			} else if( this._top._code == 10 ){
				switch( this._top._token ){
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
				case 28:
				case 29:
				case 32:
				case 33:
					return this._formatSe( param, strToVal );
				case 8:
				case 11:
				case 14:
				case 16:
				case 19:
				case 20:
				case 23:
				case 24:
				case 25:
				case 26:
				case 27:
					if( this._top._next != null ){
						return 0x100D;
					}
					return 0x00;
				}
			}
		}
		if( (ret = this._format( this._top, param, strToVal )) != 0x00 ){
			return ret;
		}
		var i = 0;
		var cur = this._top;
		while( cur != null ){
			switch( cur._code ){
			case 0:
				i++;
				break;
			case 15:
				i--;
				for( ; i < 0; i++ ){
					this._ins( this._top, param, String.fromCharCode( 0 ), 1, strToVal );
				}
				break;
			}
			cur = cur._next;
		}
		for( ; i > 0; i-- ){
			this.add( param, String.fromCharCode( 15 ), 1, strToVal );
		}
		return 0x00;
	},
	regString : function( param, line, strToVal ){
		var ret;
		if( (ret = this.separate( param, line, strToVal )) != 0x00 ){
			return ret;
		}
		if( (ret = this.format( param, strToVal )) != 0x00 ){
			return ret;
		}
		return 0x00;
	},
	dup : function( dst ){
		var srcCur;
		var dstCur;
		var tmp;
		dst._top = null;
		dst._end = null;
		dst._get = null;
		if( this._top != null ){
			dstCur = new __Token();
			dst._top = dstCur;
			dstCur._code = this._top._code;
			dstCur._token = this.newToken( this._top._code, this._top._token );
			srcCur = this._top._next;
			while( srcCur != null ){
				tmp = new __Token();
				tmp._before = dstCur;
				dstCur._next = tmp;
				dstCur = tmp;
				dstCur._code = srcCur._code;
				dstCur._token = this.newToken( srcCur._code, srcCur._token );
				srcCur = srcCur._next;
			}
			dstCur._next = null;
			dst._end = dstCur;
		}
		return 0x00;
	},
	lock : function(){
		return this._get;
	},
	unlock : function( lock ){
		this._get = lock;
	},
	beginGetToken : function( num ){
		this._get = (num == undefined) ? this._top : this._searchList( num );
	},
	getToken : function(){
		if( this._get == null ){
			return false;
		}
		_get_code = this._get._code;
		_get_token = this._get._token;
		this._get = this._get._next;
		return true;
	},
	getTokenParam : function( param ){
		if( this._get == null ){
			return false;
		}
		if( this._get._code == 8 ){
			if( param._func.search( this._get._token, false, null ) != null ){
				_get_code = this._get._code;
			} else if( param._var._label.checkLabel( this._get._token ) >= 0 ){
				_get_code = 0x22;
			} else if( param._array._label.checkLabel( this._get._token ) >= 0 ){
				_get_code = 0x45;
			} else if( globalParam()._var._label.checkLabel( this._get._token ) >= 0 ){
				_get_code = 0x23;
			} else if( globalParam()._array._label.checkLabel( this._get._token ) >= 0 ){
				_get_code = 0x46;
			} else {
				var value = new _Value();
				if( this.stringToValue( param, this._get._token, value ) ){
					this._get._code = 7;
					this._get._token = dupValue( value );
				}
				_get_code = this._get._code;
			}
		} else {
			_get_code = this._get._code;
		}
		_get_token = this._get._token;
		this._get = this._get._next;
		return true;
	},
	getTokenLock : function(){
		if( this._get == null ){
			return false;
		}
		_get_code = this._get._code;
		_get_token = this._get._token;
		return true;
	},
	checkToken : function( code ){
		return (this._get != null) && (this._get._code != code);
	},
	skipToken : function(){
		if( this._get != null ){
			this._get = this._get._next;
		}
	},
	skipComma : function(){
		if( (this._get == null) || (this._get._code != 11) || (this._get._token != 38) ){
			return false;
		}
		this._get = this._get._next;
		return true;
	},
	count : function(){
		var ret = 0;
		var cur = this._top;
		while( cur != null ){
			ret++;
			cur = cur._next;
		}
		return ret;
	},
	tokenString : function( param, code, token ){
		var string = new String();
		var real = new _String();
		var imag = new _String();
		var tmp = new String();
		var cur;
		switch( code ){
		case 0:
			string = "(";
			break;
		case 15:
			string = ")";
			break;
		case 16:
			string = "{";
			break;
		case 17:
			string = "}";
			break;
		case 20:
			string = "&";
			break;
		case 21:
			string = "[]";
			break;
		case 0x21:
			if( param._var._label._label[token] != null ){
				string = param._var._label._label[token];
			} else if( token == 0 ){
				string = "@";
			} else {
				string = "@" + String.fromCharCode( token );
			}
			break;
		case 0x44:
			if( param._array._label._label[token] != null ){
				string = param._array._label._label[token];
			} else {
				string = "@@" + String.fromCharCode( token );
			}
			break;
		case 0x22:
		case 0x45:
		case 0x23:
		case 0x46:
		case 8:
			string = token;
			break;
		case 11:
			string = _TOKEN_OP[token];
			break;
		case 22:
			string = "$";
			if( token == 0 ){
				break;
			} else if( token - 1 < _TOKEN_SE.length ){
				string += _TOKEN_SE[token - 1];
				break;
			}
			token -= 69;
		case 12:
			string += _TOKEN_FUNC[token];
			break;
		case 10:
			string = _TOKEN_STAT[token];
			break;
		case 13:
			string = "!" + token;
			break;
		case 9:
			string = ":";
			if( token != 0 ){
				if( token - 1 < _TOKEN_COMMAND.length ){
					string += _TOKEN_COMMAND[token - 1];
				} else {
					for( var i = 0; i < _custom_command_num; i++ ){
						if( token == _custom_command[i]._id ){
							string += _custom_command[i]._name;
						}
					}
				}
			}
			break;
		case 7:
			this.valueToString( param, token, real, imag );
			tmp = real.str() + imag.str();
			cur = 0;
			do {
				switch( tmp.charAt( cur ) ){
				case '-':
				case '+':
					string += '\\';
					break;
				}
				string += tmp.charAt( cur );
				cur++;
			} while( cur < tmp.length );
			break;
		case 19:
			cur = 0;
			do {
				if( token.charAt( cur ) == ']' ){
					tmp += '\\';
				}
				tmp += token.charAt( cur );
				cur++;
			} while( cur < token.length );
			string = "[\"" + tmp + "]";
			break;
		default:
			string = "";
			break;
		}
		if( string.charAt( 0 ) == '$' ){
			return string.toUpperCase();
		}
		return string;
	}
};
function _Variable(){
	this._label = new _Label( this );
	this._var = newValueArray( 256 );
	this._lock = new Array( 256 );
	for( var i = 0; i < 256; i++ ){
		this._lock[i] = false;
	}
}
_Variable.prototype = {
	define : function( label, value, lockFlag ){
		var index;
		if( (index = this._label.define( label )) >= 0 ){
			this.set( index, value, false );
			if( lockFlag ){
				this.lock( index );
			}
		}
		return index;
	},
	undef : function( label ){
		var index;
		if( (index = this._label.undef( label )) >= 0 ){
			this.unlock( index );
			this.set( index, 0.0, false );
		}
		return index;
	},
	move : function( index ){
		if( this._label._flag[index] == _LABEL_MOVABLE ){
			this.define( this._label._label[index], this.val( index ), this.isLocked( index ) );
			this.unlock( index );
			this._label.setLabel( index, null, false );
		}
		this._label._flag[index] = _LABEL_USED;
	},
	set : function( index, value, moveFlag ){
assert( index != 0 );
		if( this.isLocked( index ) ){
			return false;
		}
		if( moveFlag ){
			this.move( index );
		}
		this._var[index].ass( value );
		return true;
	},
	setReal : function( index, value, moveFlag ){
assert( index != 0 );
		if( this.isLocked( index ) ){
			return false;
		}
		if( moveFlag ){
			this.move( index );
		}
		this._var[index].setReal( value );
		return true;
	},
	setImag : function( index, value, moveFlag ){
assert( index != 0 );
		if( this.isLocked( index ) ){
			return false;
		}
		if( moveFlag ){
			this.move( index );
		}
		this._var[index].setImag( value );
		return true;
	},
	fractSetMinus : function( index, isMinus, moveFlag ){
assert( index != 0 );
		if( this.isLocked( index ) ){
			return false;
		}
		if( moveFlag ){
			this.move( index );
		}
		this._var[index].fractSetMinus( isMinus );
		return true;
	},
	setNum : function( index, value, moveFlag ){
assert( index != 0 );
		if( this.isLocked( index ) ){
			return false;
		}
		if( moveFlag ){
			this.move( index );
		}
		this._var[index].setNum( value );
		return true;
	},
	setDenom : function( index, value, moveFlag ){
assert( index != 0 );
		if( this.isLocked( index ) ){
			return false;
		}
		if( moveFlag ){
			this.move( index );
		}
		this._var[index].setDenom( value );
		return true;
	},
	fractReduce : function( index, moveFlag ){
assert( index != 0 );
		if( this.isLocked( index ) ){
			return false;
		}
		if( moveFlag ){
			this.move( index );
		}
		this._var[index].fractReduce();
		return true;
	},
	val : function( index ){
assert( index != 0 );
		return this._var[index];
	},
	lock : function( index ){
		this._lock[index] = true;
	},
	unlock : function( index ){
		this._lock[index] = false;
	},
	isLocked : function( index ){
		return this._lock[index];
	}
};
window._EPS5 = _EPS5;
window._SQRT05 = _SQRT05;
window._Complex = _Complex;
window.getComplex = getComplex;
window.setComplex = setComplex;
window.dupComplex = dupComplex;
window.floatToComplex = floatToComplex;
window.fsin = fsin;
window.fcos = fcos;
window.ftan = ftan;
window.fasin = fasin;
window.facos = facos;
window.fatan = fatan;
window.fatan2 = fatan2;
window.fsinh = fsinh;
window.fcosh = fcosh;
window.ftanh = ftanh;
window.fasinh = fasinh;
window.facosh = facosh;
window.fatanh = fatanh;
window._FRACT_MAX = _FRACT_MAX;
window._Fract = _Fract;
window.getFract = getFract;
window.setFract = setFract;
window.dupFract = dupFract;
window.floatToFract = floatToFract;
window._DBL_EPSILON = _DBL_EPSILON;
window._NORMALIZE = _NORMALIZE;
window._RAND_MAX = _RAND_MAX;
window._ABS = _ABS;
window._ACOS = _ACOS;
window._ASIN = _ASIN;
window._ATAN = _ATAN;
window._ATAN2 = _ATAN2;
window._CEIL = _CEIL;
window._COS = _COS;
window._EXP = _EXP;
window._FLOOR = _FLOOR;
window._LOG = _LOG;
window._POW = _POW;
window._SIN = _SIN;
window._SQRT = _SQRT;
window._TAN = _TAN;
window.srand = srand;
window.rand = rand;
window.assert = assert;
window._INT = _INT;
window._DIV = _DIV;
window._MOD = _MOD;
window._SHIFTL = _SHIFTL;
window._SHIFTR = _SHIFTR;
window._AND = _AND;
window._OR = _OR;
window._XOR = _XOR;
window._SIGNED = _SIGNED;
window._UNSIGNED = _UNSIGNED;
window._CHAR = _CHAR;
window._CHAR_CODE_0 = _CHAR_CODE_0;
window._CHAR_CODE_9 = _CHAR_CODE_9;
window._CHAR_CODE_LA = _CHAR_CODE_LA;
window._CHAR_CODE_LZ = _CHAR_CODE_LZ;
window._CHAR_CODE_UA = _CHAR_CODE_UA;
window._CHAR_CODE_UZ = _CHAR_CODE_UZ;
window._CHAR_CODE_EX = _CHAR_CODE_EX;
window._CHAR_CODE_COLON = _CHAR_CODE_COLON;
window._ISINF = _ISINF;
window._ISNAN = _ISNAN;
window._ISZERO = _ISZERO;
window._APPROX = _APPROX;
window._APPROX_M = _APPROX_M;
window._EPREC = _EPREC;
window._FPREC = _FPREC;
window._GCD = _GCD;
window._LCM = _LCM;
window.stringToFloat = stringToFloat;
window.stringToInt = stringToInt;
window.floatToExponential = floatToExponential;
window.floatToFixed = floatToFixed;
window.floatToString = floatToString;
window.floatToStringPoint = floatToStringPoint;
window.intToString = intToString;
window._PI = _PI;
window._MathEnv = _MathEnv;
window.setMathEnv = setMathEnv;
window.setComplexAngType = setComplexAngType;
window.complexAngType = complexAngType;
window.complexIsRad = complexIsRad;
window.complexAngCoef = complexAngCoef;
window.setComplexIsReal = setComplexIsReal;
window.complexIsReal = complexIsReal;
window.clearComplexError = clearComplexError;
window.setComplexError = setComplexError;
window.complexError = complexError;
window.clearFractError = clearFractError;
window.setFractError = setFractError;
window.fractError = fractError;
window.clearMatrixError = clearMatrixError;
window.setMatrixError = setMatrixError;
window.matrixError = matrixError;
window.setTimeFps = setTimeFps;
window.timeFps = timeFps;
window.clearTimeError = clearTimeError;
window.setTimeError = setTimeError;
window.timeError = timeError;
window.setValueType = setValueType;
window.valueType = valueType;
window.clearValueError = clearValueError;
window.valueError = valueError;
window._Matrix = _Matrix;
window.deleteMatrix = deleteMatrix;
window.dupMatrix = dupMatrix;
window.arrayToMatrix = arrayToMatrix;
window.valueToMatrix = valueToMatrix;
window.floatToMatrix = floatToMatrix;
window.newMatrixArray = newMatrixArray;
window._Time = _Time;
window.getTime = getTime;
window.setTime = setTime;
window.dupTime = dupTime;
window.floatToTime = floatToTime;
window._Value = _Value;
window.deleteValue = deleteValue;
window.getValue = getValue;
window.setValue = setValue;
window.copyValue = copyValue;
window.dupValue = dupValue;
window.floatToValue = floatToValue;
window.complexToValue = complexToValue;
window.fractToValue = fractToValue;
window.timeToValue = timeToValue;
window.newValueArray = newValueArray;
window._Boolean = _Boolean;
window.newBooleanArray = newBooleanArray;
window._Float = _Float;
window.newFloatArray = newFloatArray;
window._Integer = _Integer;
window.newIntegerArray = newIntegerArray;
window._String = _String;
window.newStringArray = newStringArray;
window._Void = _Void;
window.newVoidArray = newVoidArray;
window._Tm = _Tm;
window.time = time;
window.mktime = mktime;
window.localtime = localtime;
window._Array = _Array;
window._FuncInfo = _FuncInfo;
window._Func = _Func;
window.isCharSpace = isCharSpace;
window.isCharEnter = isCharEnter;
window.isCharEscape = isCharEscape;
window._GraphAns = _GraphAns;
window.newGraphAnsArray = newGraphAnsArray;
window._Graph = _Graph;
window.newGWorldCharInfo = newGWorldCharInfo;
window.regGWorldCharInfo = regGWorldCharInfo;
window.regGWorldBgColor = regGWorldBgColor;
window.gWorldBgColor = gWorldBgColor;
window._GWorld = _GWorld;
window.defGWorldFunction = defGWorldFunction;
window._Label = _Label;
window._Line = _Line;
window._Loop = _Loop;
window._Param = _Param;
window._MIN_VALUE = _MIN_VALUE;
window._MAX_VALUE = _MAX_VALUE;
window._ProcEnv = _ProcEnv;
window.setProcEnv = setProcEnv;
window.procGraph = procGraph;
window.procGWorld = procGWorld;
window.procFunc = procFunc;
window.setGlobalParam = setGlobalParam;
window.globalParam = globalParam;
window.setProcWarnFlowFlag = setProcWarnFlowFlag;
window.procWarnFlowFlag = procWarnFlowFlag;
window.setProcTraceFlag = setProcTraceFlag;
window.procTraceFlag = procTraceFlag;
window.setProcLoopMax = setProcLoopMax;
window.procLoopMax = procLoopMax;
window.initProcLoopCount = initProcLoopCount;
window.resetProcLoopCount = resetProcLoopCount;
window.setProcLoopCount = setProcLoopCount;
window.procLoopCount = procLoopCount;
window.procLoopCountMax = procLoopCountMax;
window.incProcLoopTotal = incProcLoopTotal;
window.procLoopTotal = procLoopTotal;
window._Proc = _Proc;
window.defProcFunction = defProcFunction;
window.doFuncGColorBGR = doFuncGColorBGR;
window._RGB2BGR = _RGB2BGR;
window._TOKEN_OP = _TOKEN_OP;
window._TOKEN_FUNC = _TOKEN_FUNC;
window._TOKEN_STAT = _TOKEN_STAT;
window._TOKEN_COMMAND = _TOKEN_COMMAND;
window._TOKEN_SE = _TOKEN_SE;
window._TOKEN_DEFINE = _TOKEN_DEFINE;
window._VALUE_DEFINE = _VALUE_DEFINE;
window.setDefineValue = setDefineValue;
window.getCode = getCode;
window.getToken = getToken;
window.regCustomCommand = regCustomCommand;
window._Token = _Token;
window._Variable = _Variable;
window._CLIP_MODE_FLOAT = 0x0010;
window._CLIP_MODE_COMPLEX = 0x0020;
window._CLIP_MODE_FRACT = 0x0040;
window._CLIP_MODE_TIME = 0x0080;
window._CLIP_MODE_INT = 0x0100;
window._CLIP_MODE_E_FLOAT = 0x0010
window._CLIP_MODE_F_FLOAT = 0x0011
window._CLIP_MODE_G_FLOAT = 0x0012
window._CLIP_MODE_E_COMPLEX = 0x0020
window._CLIP_MODE_F_COMPLEX = 0x0021
window._CLIP_MODE_G_COMPLEX = 0x0022
window._CLIP_MODE_I_FRACT = 0x0040
window._CLIP_MODE_M_FRACT = 0x0041
window._CLIP_MODE_H_TIME = 0x0080
window._CLIP_MODE_M_TIME = 0x0081
window._CLIP_MODE_S_TIME = 0x0082
window._CLIP_MODE_F_TIME = 0x0083
window._CLIP_MODE_S_CHAR = 0x0100
window._CLIP_MODE_U_CHAR = 0x0101
window._CLIP_MODE_S_SHORT = 0x0102
window._CLIP_MODE_U_SHORT = 0x0103
window._CLIP_MODE_S_LONG = 0x0104
window._CLIP_MODE_U_LONG = 0x0105
window._CLIP_DEFMODE = window._CLIP_MODE_G_FLOAT;
window._CLIP_DEFFPS = 30.0;
window._CLIP_MINPREC = 0;
window._CLIP_DEFPREC = 6;
window._CLIP_MINRADIX = 2;
window._CLIP_MAXRADIX = 36;
window._CLIP_DEFRADIX = 10;
window._CLIP_CODE_MASK = 0x1F;
window._CLIP_CODE_VAR_MASK = 0x20;
window._CLIP_CODE_ARRAY_MASK = 0x40;
window._CLIP_CODE_TOP = 0;
window._CLIP_CODE_VARIABLE = 0x21
window._CLIP_CODE_AUTO_VAR = 0x22
window._CLIP_CODE_GLOBAL_VAR = 0x23
window._CLIP_CODE_ARRAY = 0x44
window._CLIP_CODE_AUTO_ARRAY = 0x45
window._CLIP_CODE_GLOBAL_ARRAY = 0x46
window._CLIP_CODE_CONSTANT = 7;
window._CLIP_CODE_LABEL = 8;
window._CLIP_CODE_COMMAND = 9;
window._CLIP_CODE_STATEMENT = 10;
window._CLIP_CODE_OPERATOR = 11;
window._CLIP_CODE_FUNCTION = 12;
window._CLIP_CODE_EXTFUNC = 13;
window._CLIP_CODE_PROC_END = 14;
window._CLIP_CODE_NULL = 14 ;
window._CLIP_CODE_END = 15;
window._CLIP_CODE_ARRAY_TOP = 16;
window._CLIP_CODE_ARRAY_END = 17;
window._CLIP_CODE_MATRIX = 18;
window._CLIP_CODE_STRING = 19;
window._CLIP_CODE_PARAM_ANS = 20;
window._CLIP_CODE_PARAM_ARRAY = 21;
window._CLIP_CODE_SE = 22;
window._CLIP_OP_INCREMENT = 0;
window._CLIP_OP_DECREMENT = 1;
window._CLIP_OP_COMPLEMENT = 2;
window._CLIP_OP_NOT = 3;
window._CLIP_OP_MINUS = 4;
window._CLIP_OP_PLUS = 5;
window._CLIP_OP_UNARY_END = 6;
window._CLIP_OP_POSTFIXINC = 6 ;
window._CLIP_OP_POSTFIXDEC = 7;
window._CLIP_OP_MUL = 8;
window._CLIP_OP_DIV = 9;
window._CLIP_OP_MOD = 10;
window._CLIP_OP_ADD = 11;
window._CLIP_OP_SUB = 12;
window._CLIP_OP_SHIFTL = 13;
window._CLIP_OP_SHIFTR = 14;
window._CLIP_OP_LESS = 15;
window._CLIP_OP_LESSOREQ = 16;
window._CLIP_OP_GREAT = 17;
window._CLIP_OP_GREATOREQ = 18;
window._CLIP_OP_EQUAL = 19;
window._CLIP_OP_NOTEQUAL = 20;
window._CLIP_OP_AND = 21;
window._CLIP_OP_XOR = 22;
window._CLIP_OP_OR = 23;
window._CLIP_OP_LOGAND = 24;
window._CLIP_OP_LOGOR = 25;
window._CLIP_OP_CONDITIONAL = 26;
window._CLIP_OP_ASS = 27;
window._CLIP_OP_MULANDASS = 28;
window._CLIP_OP_DIVANDASS = 29;
window._CLIP_OP_MODANDASS = 30;
window._CLIP_OP_ADDANDASS = 31;
window._CLIP_OP_SUBANDASS = 32;
window._CLIP_OP_SHIFTLANDASS = 33;
window._CLIP_OP_SHIFTRANDASS = 34;
window._CLIP_OP_ANDANDASS = 35;
window._CLIP_OP_ORANDASS = 36;
window._CLIP_OP_XORANDASS = 37;
window._CLIP_OP_COMMA = 38;
window._CLIP_OP_POW = 39;
window._CLIP_OP_POWANDASS = 40;
window._CLIP_FUNC_DEFINED = 0;
window._CLIP_FUNC_INDEXOF = 1;
window._CLIP_FUNC_ISINF = 2;
window._CLIP_FUNC_ISNAN = 3;
window._CLIP_FUNC_RAND = 4;
window._CLIP_FUNC_TIME = 5;
window._CLIP_FUNC_MKTIME = 6;
window._CLIP_FUNC_TM_SEC = 7;
window._CLIP_FUNC_TM_MIN = 8;
window._CLIP_FUNC_TM_HOUR = 9;
window._CLIP_FUNC_TM_MDAY = 10;
window._CLIP_FUNC_TM_MON = 11;
window._CLIP_FUNC_TM_YEAR = 12;
window._CLIP_FUNC_TM_WDAY = 13;
window._CLIP_FUNC_TM_YDAY = 14;
window._CLIP_FUNC_TM_XMON = 15;
window._CLIP_FUNC_TM_XYEAR = 16;
window._CLIP_FUNC_A2D = 17;
window._CLIP_FUNC_A2G = 18;
window._CLIP_FUNC_A2R = 19;
window._CLIP_FUNC_D2A = 20;
window._CLIP_FUNC_D2G = 21;
window._CLIP_FUNC_D2R = 22;
window._CLIP_FUNC_G2A = 23;
window._CLIP_FUNC_G2D = 24;
window._CLIP_FUNC_G2R = 25;
window._CLIP_FUNC_R2A = 26;
window._CLIP_FUNC_R2D = 27;
window._CLIP_FUNC_R2G = 28;
window._CLIP_FUNC_SIN = 29;
window._CLIP_FUNC_COS = 30;
window._CLIP_FUNC_TAN = 31;
window._CLIP_FUNC_ASIN = 32;
window._CLIP_FUNC_ACOS = 33;
window._CLIP_FUNC_ATAN = 34;
window._CLIP_FUNC_ATAN2 = 35;
window._CLIP_FUNC_SINH = 36;
window._CLIP_FUNC_COSH = 37;
window._CLIP_FUNC_TANH = 38;
window._CLIP_FUNC_ASINH = 39;
window._CLIP_FUNC_ACOSH = 40;
window._CLIP_FUNC_ATANH = 41;
window._CLIP_FUNC_EXP = 42;
window._CLIP_FUNC_EXP10 = 43;
window._CLIP_FUNC_LN = 44;
window._CLIP_FUNC_LOG = 45;
window._CLIP_FUNC_LOG10 = 46;
window._CLIP_FUNC_POW = 47;
window._CLIP_FUNC_SQR = 48;
window._CLIP_FUNC_SQRT = 49;
window._CLIP_FUNC_CEIL = 50;
window._CLIP_FUNC_FLOOR = 51;
window._CLIP_FUNC_ABS = 52;
window._CLIP_FUNC_LDEXP = 53;
window._CLIP_FUNC_FREXP = 54;
window._CLIP_FUNC_MODF = 55;
window._CLIP_FUNC_INT = 56;
window._CLIP_FUNC_REAL = 57;
window._CLIP_FUNC_IMAG = 58;
window._CLIP_FUNC_ARG = 59;
window._CLIP_FUNC_NORM = 60;
window._CLIP_FUNC_CONJG = 61;
window._CLIP_FUNC_POLAR = 62;
window._CLIP_FUNC_NUM = 63;
window._CLIP_FUNC_DENOM = 64;
window._CLIP_FUNC_ROW = 65;
window._CLIP_FUNC_COL = 66;
window._CLIP_FUNC_TRANS = 67;
window._CLIP_FUNC_STRCMP = 68;
window._CLIP_FUNC_STRICMP = 69;
window._CLIP_FUNC_STRLEN = 70;
window._CLIP_FUNC_GWIDTH = 71;
window._CLIP_FUNC_GHEIGHT = 72;
window._CLIP_FUNC_GCOLOR = 73;
window._CLIP_FUNC_GCOLOR24 = 74;
window._CLIP_FUNC_GCX = 75;
window._CLIP_FUNC_GCY = 76;
window._CLIP_FUNC_WCX = 77;
window._CLIP_FUNC_WCY = 78;
window._CLIP_FUNC_GGET = 79;
window._CLIP_FUNC_WGET = 80;
window._CLIP_FUNC_GX = 81;
window._CLIP_FUNC_GY = 82;
window._CLIP_FUNC_WX = 83;
window._CLIP_FUNC_WY = 84;
window._CLIP_FUNC_CALL = 85;
window._CLIP_FUNC_EVAL = 86;
window._CLIP_STAT_START = 0;
window._CLIP_STAT_END = 1;
window._CLIP_STAT_END_INC = 2;
window._CLIP_STAT_END_DEC = 3;
window._CLIP_STAT_ENDEQ = 4;
window._CLIP_STAT_ENDEQ_INC = 5;
window._CLIP_STAT_ENDEQ_DEC = 6;
window._CLIP_STAT_CONT = 7;
window._CLIP_STAT_DO = 8;
window._CLIP_STAT_UNTIL = 9;
window._CLIP_STAT_WHILE = 10;
window._CLIP_STAT_ENDWHILE = 11;
window._CLIP_STAT_FOR = 12;
window._CLIP_STAT_FOR2 = 13;
window._CLIP_STAT_NEXT = 14;
window._CLIP_STAT_FUNC = 15;
window._CLIP_STAT_ENDFUNC = 16;
window._CLIP_STAT_LOOP_END = 17;
window._CLIP_STAT_IF = 17 ;
window._CLIP_STAT_ELIF = 18;
window._CLIP_STAT_ELSE = 19;
window._CLIP_STAT_ENDIF = 20;
window._CLIP_STAT_SWITCH = 21;
window._CLIP_STAT_CASE = 22;
window._CLIP_STAT_DEFAULT = 23;
window._CLIP_STAT_ENDSWI = 24;
window._CLIP_STAT_BREAKSWI = 25;
window._CLIP_STAT_CONTINUE = 26;
window._CLIP_STAT_BREAK = 27;
window._CLIP_STAT_CONTINUE2 = 28;
window._CLIP_STAT_BREAK2 = 29;
window._CLIP_STAT_ASSERT = 30;
window._CLIP_STAT_RETURN = 31;
window._CLIP_STAT_RETURN2 = 32;
window._CLIP_STAT_RETURN3 = 33;
window._CLIP_COMMAND_NULL = 0;
window._CLIP_COMMAND_EFLOAT = 1;
window._CLIP_COMMAND_FFLOAT = 2;
window._CLIP_COMMAND_GFLOAT = 3;
window._CLIP_COMMAND_ECOMPLEX = 4;
window._CLIP_COMMAND_FCOMPLEX = 5;
window._CLIP_COMMAND_GCOMPLEX = 6;
window._CLIP_COMMAND_PREC = 7;
window._CLIP_COMMAND_IFRACT = 8;
window._CLIP_COMMAND_MFRACT = 9;
window._CLIP_COMMAND_HTIME = 10;
window._CLIP_COMMAND_MTIME = 11;
window._CLIP_COMMAND_STIME = 12;
window._CLIP_COMMAND_FTIME = 13;
window._CLIP_COMMAND_FPS = 14;
window._CLIP_COMMAND_SCHAR = 15;
window._CLIP_COMMAND_UCHAR = 16;
window._CLIP_COMMAND_SSHORT = 17;
window._CLIP_COMMAND_USHORT = 18;
window._CLIP_COMMAND_SLONG = 19;
window._CLIP_COMMAND_ULONG = 20;
window._CLIP_COMMAND_SINT = 21;
window._CLIP_COMMAND_UINT = 22;
window._CLIP_COMMAND_RADIX = 23;
window._CLIP_COMMAND_PTYPE = 24;
window._CLIP_COMMAND_RAD = 25;
window._CLIP_COMMAND_DEG = 26;
window._CLIP_COMMAND_GRAD = 27;
window._CLIP_COMMAND_ANGLE = 28;
window._CLIP_COMMAND_ANS = 29;
window._CLIP_COMMAND_ASSERT = 30;
window._CLIP_COMMAND_WARN = 31;
window._CLIP_COMMAND_PARAM = 32;
window._CLIP_COMMAND_PARAMS = 33;
window._CLIP_COMMAND_DEFINE = 34;
window._CLIP_COMMAND_ENUM = 35;
window._CLIP_COMMAND_UNDEF = 36;
window._CLIP_COMMAND_VAR = 37;
window._CLIP_COMMAND_ARRAY = 38;
window._CLIP_COMMAND_LOCAL = 39;
window._CLIP_COMMAND_GLOBAL = 40;
window._CLIP_COMMAND_LABEL = 41;
window._CLIP_COMMAND_PARENT = 42;
window._CLIP_COMMAND_REAL = 43;
window._CLIP_COMMAND_IMAG = 44;
window._CLIP_COMMAND_NUM = 45;
window._CLIP_COMMAND_DENOM = 46;
window._CLIP_COMMAND_MAT = 47;
window._CLIP_COMMAND_TRANS = 48;
window._CLIP_COMMAND_SRAND = 49;
window._CLIP_COMMAND_LOCALTIME = 50;
window._CLIP_COMMAND_ARRAYCOPY = 51;
window._CLIP_COMMAND_ARRAYFILL = 52;
window._CLIP_COMMAND_STRCPY = 53;
window._CLIP_COMMAND_STRCAT = 54;
window._CLIP_COMMAND_STRLWR = 55;
window._CLIP_COMMAND_STRUPR = 56;
window._CLIP_COMMAND_CLEAR = 57;
window._CLIP_COMMAND_ERROR = 58;
window._CLIP_COMMAND_PRINT = 59;
window._CLIP_COMMAND_PRINTLN = 60;
window._CLIP_COMMAND_SPRINT = 61;
window._CLIP_COMMAND_SCAN = 62;
window._CLIP_COMMAND_GWORLD = 63;
window._CLIP_COMMAND_GCLEAR = 64;
window._CLIP_COMMAND_GCOLOR = 65;
window._CLIP_COMMAND_GFILL = 66;
window._CLIP_COMMAND_GMOVE = 67;
window._CLIP_COMMAND_GTEXT = 68;
window._CLIP_COMMAND_GTEXTR = 69;
window._CLIP_COMMAND_GTEXTL = 70;
window._CLIP_COMMAND_GTEXTLR = 71;
window._CLIP_COMMAND_GLINE = 72;
window._CLIP_COMMAND_GPUT = 73;
window._CLIP_COMMAND_GPUT24 = 74;
window._CLIP_COMMAND_GGET = 75;
window._CLIP_COMMAND_GGET24 = 76;
window._CLIP_COMMAND_GUPDATE = 77;
window._CLIP_COMMAND_WINDOW = 78;
window._CLIP_COMMAND_WFILL = 79;
window._CLIP_COMMAND_WMOVE = 80;
window._CLIP_COMMAND_WTEXT = 81;
window._CLIP_COMMAND_WTEXTR = 82;
window._CLIP_COMMAND_WTEXTL = 83;
window._CLIP_COMMAND_WTEXTLR = 84;
window._CLIP_COMMAND_WLINE = 85;
window._CLIP_COMMAND_WPUT = 86;
window._CLIP_COMMAND_WGET = 87;
window._CLIP_COMMAND_RECTANGULAR = 88;
window._CLIP_COMMAND_PARAMETRIC = 89;
window._CLIP_COMMAND_POLAR = 90;
window._CLIP_COMMAND_LOGSCALE = 91;
window._CLIP_COMMAND_NOLOGSCALE = 92;
window._CLIP_COMMAND_PLOT = 93;
window._CLIP_COMMAND_REPLOT = 94;
window._CLIP_COMMAND_CALCULATOR = 95;
window._CLIP_COMMAND_INCLUDE = 96;
window._CLIP_COMMAND_BASE = 97;
window._CLIP_COMMAND_NAMESPACE = 98;
window._CLIP_COMMAND_DUMP = 99;
window._CLIP_COMMAND_LOG = 100;
window._CLIP_COMMAND_CUSTOM = 101;
window._CLIP_SE_NULL = 0;
window._CLIP_SE_INCREMENT = 1;
window._CLIP_SE_DECREMENT = 2;
window._CLIP_SE_NEGATIVE = 3;
window._CLIP_SE_COMPLEMENT = 4;
window._CLIP_SE_NOT = 5;
window._CLIP_SE_MINUS = 6;
window._CLIP_SE_SET = 7;
window._CLIP_SE_SETC = 8;
window._CLIP_SE_SETF = 9;
window._CLIP_SE_SETM = 10;
window._CLIP_SE_MUL = 11;
window._CLIP_SE_DIV = 12;
window._CLIP_SE_MOD = 13;
window._CLIP_SE_ADD = 14;
window._CLIP_SE_ADDS = 15;
window._CLIP_SE_SUB = 16;
window._CLIP_SE_SUBS = 17;
window._CLIP_SE_POW = 18;
window._CLIP_SE_SHIFTL = 19;
window._CLIP_SE_SHIFTR = 20;
window._CLIP_SE_AND = 21;
window._CLIP_SE_OR = 22;
window._CLIP_SE_XOR = 23;
window._CLIP_SE_LESS = 24;
window._CLIP_SE_LESSOREQ = 25;
window._CLIP_SE_GREAT = 26;
window._CLIP_SE_GREATOREQ = 27;
window._CLIP_SE_EQUAL = 28;
window._CLIP_SE_NOTEQUAL = 29;
window._CLIP_SE_LOGAND = 30;
window._CLIP_SE_LOGOR = 31;
window._CLIP_SE_MUL_A = 32;
window._CLIP_SE_DIV_A = 33;
window._CLIP_SE_MOD_A = 34;
window._CLIP_SE_ADD_A = 35;
window._CLIP_SE_ADDS_A = 36;
window._CLIP_SE_SUB_A = 37;
window._CLIP_SE_SUBS_A = 38;
window._CLIP_SE_POW_A = 39;
window._CLIP_SE_SHIFTL_A = 40;
window._CLIP_SE_SHIFTR_A = 41;
window._CLIP_SE_AND_A = 42;
window._CLIP_SE_OR_A = 43;
window._CLIP_SE_XOR_A = 44;
window._CLIP_SE_LESS_A = 45;
window._CLIP_SE_LESSOREQ_A = 46;
window._CLIP_SE_GREAT_A = 47;
window._CLIP_SE_GREATOREQ_A = 48;
window._CLIP_SE_EQUAL_A = 49;
window._CLIP_SE_NOTEQUAL_A = 50;
window._CLIP_SE_LOGAND_A = 51;
window._CLIP_SE_LOGOR_A = 52;
window._CLIP_SE_CONDITIONAL = 53;
window._CLIP_SE_SET_FALSE = 54;
window._CLIP_SE_SET_TRUE = 55;
window._CLIP_SE_SET_ZERO = 56;
window._CLIP_SE_LOOPSTART = 57;
window._CLIP_SE_LOOPEND = 58;
window._CLIP_SE_LOOPEND_INC = 59;
window._CLIP_SE_LOOPEND_DEC = 60;
window._CLIP_SE_LOOPENDEQ = 61;
window._CLIP_SE_LOOPENDEQ_INC = 62;
window._CLIP_SE_LOOPENDEQ_DEC = 63;
window._CLIP_SE_LOOPCONT = 64;
window._CLIP_SE_CONTINUE = 65;
window._CLIP_SE_BREAK = 66;
window._CLIP_SE_RETURN = 67;
window._CLIP_SE_RETURN_ANS = 68;
window._CLIP_SE_FUNC = 69;
window._CLIP_NO_ERR = 0x00;
window._CLIP_LOOP_STOP = 0x01;
window._CLIP_LOOP_CONT = 0x02;
window._CLIP_PROC_SUB_END = 0x03;
window._CLIP_PROC_END = 0x04;
window._CLIP_ERR_START = 0x100;
window._CLIP_LOOP_ERR = 0x100 ;
window._CLIP_LOOP_ERR_NULL = 0x100
window._CLIP_LOOP_ERR_COMMAND = 0x101
window._CLIP_LOOP_ERR_STAT = 0x102
window._CLIP_PROC_WARN = 0x1000;
window._CLIP_PROC_WARN_ARRAY = 0x1000
window._CLIP_PROC_WARN_DIV = 0x1001
window._CLIP_PROC_WARN_UNDERFLOW = 0x1002
window._CLIP_PROC_WARN_OVERFLOW = 0x1003
window._CLIP_PROC_WARN_ASIN = 0x1004
window._CLIP_PROC_WARN_ACOS = 0x1005
window._CLIP_PROC_WARN_ACOSH = 0x1006
window._CLIP_PROC_WARN_ATANH = 0x1007
window._CLIP_PROC_WARN_LOG = 0x1008
window._CLIP_PROC_WARN_LOG10 = 0x1009
window._CLIP_PROC_WARN_SQRT = 0x100A
window._CLIP_PROC_WARN_FUNCTION = 0x100B
window._CLIP_PROC_WARN_RETURN = 0x100C
window._CLIP_PROC_WARN_DEAD_TOKEN = 0x100D
window._CLIP_PROC_WARN_SE_RETURN = 0x100E
window._CLIP_ERROR = 0x2000;
window._CLIP_ERR_TOKEN = 0x2000
window._CLIP_ERR_ASSERT = 0x2001
window._CLIP_PROC_ERR = 0x2100
window._CLIP_PROC_ERR_UNARY = 0x2100
window._CLIP_PROC_ERR_OPERATOR = 0x2101
window._CLIP_PROC_ERR_ARRAY = 0x2102
window._CLIP_PROC_ERR_FUNCTION = 0x2103
window._CLIP_PROC_ERR_LVALUE = 0x2104
window._CLIP_PROC_ERR_RVALUE = 0x2105
window._CLIP_PROC_ERR_RVALUE_NULL = 0x2106
window._CLIP_PROC_ERR_CONDITIONAL = 0x2107
window._CLIP_PROC_ERR_EXTFUNC = 0x2108
window._CLIP_PROC_ERR_USERFUNC = 0x2109
window._CLIP_PROC_ERR_CONSTANT = 0x210A
window._CLIP_PROC_ERR_STRING = 0x210B
window._CLIP_PROC_ERR_COMPLEX = 0x210C
window._CLIP_PROC_ERR_FRACT = 0x210D
window._CLIP_PROC_ERR_ASS = 0x210E
window._CLIP_PROC_ERR_CALL = 0x210F
window._CLIP_PROC_ERR_STAT_IF = 0x2120
window._CLIP_PROC_ERR_STAT_ENDIF = 0x2121
window._CLIP_PROC_ERR_STAT_SWITCH = 0x2122
window._CLIP_PROC_ERR_STAT_ENDSWI = 0x2123
window._CLIP_PROC_ERR_STAT_UNTIL = 0x2124
window._CLIP_PROC_ERR_STAT_ENDWHILE = 0x2125
window._CLIP_PROC_ERR_STAT_FOR_CON = 0x2126
window._CLIP_PROC_ERR_STAT_FOR_EXP = 0x2127
window._CLIP_PROC_ERR_STAT_NEXT = 0x2128
window._CLIP_PROC_ERR_STAT_CONTINUE = 0x2129
window._CLIP_PROC_ERR_STAT_BREAK = 0x212A
window._CLIP_PROC_ERR_STAT_FUNC = 0x212B
window._CLIP_PROC_ERR_STAT_FUNC_NEST = 0x212C
window._CLIP_PROC_ERR_STAT_ENDFUNC = 0x212D
window._CLIP_PROC_ERR_STAT_FUNCNAME = 0x212E
window._CLIP_PROC_ERR_STAT_FUNCPARAM = 0x212F
window._CLIP_PROC_ERR_STAT_LOOP = 0x2130
window._CLIP_PROC_ERR_COMMAND_NULL = 0x2140
window._CLIP_PROC_ERR_COMMAND_PARAM = 0x2141
window._CLIP_PROC_ERR_COMMAND_DEFINE = 0x2142
window._CLIP_PROC_ERR_COMMAND_UNDEF = 0x2143
window._CLIP_PROC_ERR_COMMAND_PARAMS = 0x2144
window._CLIP_PROC_ERR_FUNC_OPEN = 0x2160
window._CLIP_PROC_ERR_FUNC_PARANUM = 0x2161
window._CLIP_PROC_ERR_FUNC_PARACODE = 0x2162
window._CLIP_PROC_ERR_SE_NULL = 0x2180
window._CLIP_PROC_ERR_SE_OPERAND = 0x2181
window._CLIP_PROC_ERR_SE_LOOPEND = 0x2182
window._CLIP_PROC_ERR_SE_CONTINUE = 0x2183
window._CLIP_PROC_ERR_SE_BREAK = 0x2184
window._CLIP_PROC_ERR_SE_LOOPCONT = 0x2185
window._GRAPH_MODE_RECT = 0;
window._GRAPH_MODE_PARAM = 1;
window._GRAPH_MODE_POLAR = 2;
window._LABEL_UNUSED = 0;
window._LABEL_USED = 1;
window._LABEL_MOVABLE = 2;
window._PROC_DEF_PARENT_MODE = window._CLIP_DEFMODE;
window._PROC_DEF_PRINT_ASSERT = false;
window._PROC_DEF_PRINT_WARN = true;
window._PROC_DEF_GUPDATE_FLAG = true;
window._CHAR_CODE_SPACE = 0xA0;
window._CHAR_UTF8_YEN = '¥' ;
window._INVALID_ARRAY_INDEX = 0xFFFFFFFF ;
window._ANG_TYPE_RAD = 0;
window._ANG_TYPE_DEG = 1;
window._ANG_TYPE_GRAD = 2;
window._VALUE_TYPE_COMPLEX = 0;
window._VALUE_TYPE_FRACT = 1;
window._VALUE_TYPE_TIME = 2;
window._UMAX_8 = 256;
window._UMAX_16 = 65536;
window._UMAX_24 = 16777216;
window._UMAX_32 = 4294967296;
window._SMIN_8 = -128;
window._SMAX_8 = 127;
window._SMIN_16 = -32768;
window._SMAX_16 = 32767;
window._SMIN_32 = -2147483648;
window._SMAX_32 = 2147483647;
})( window );
