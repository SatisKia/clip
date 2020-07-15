/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Math.h"

var _EPS5   = 0.001;						// _DBL_EPSILONの1/5乗程度
var _PI     = 3.14159265358979323846264;	// 円周率
var _SQRT05 = 0.7071067811865475244008444;	// √0.5

var _complex_ang_type = _ANG_TYPE_RAD;	// 角度の単位の種類
var _complex_israd    = true;			// 角度の単位の種類がラジアンかどうかのフラグ
var _complex_ang_coef = _PI;			// ラジアンから現在の単位への変換用係数
var _complex_isreal   = false;			// 実数計算を行うかどうかのフラグ
var _complex_err      = false;			// エラーが起こったかどうかのフラグ

function setComplexAngType( angType ){
	_complex_ang_type = angType;
	_complex_israd    = (_complex_ang_type == _ANG_TYPE_RAD);
	_complex_ang_coef = (_complex_ang_type == _ANG_TYPE_DEG) ? 180.0 : 200.0;
}
function complexAngType(){
	return _complex_ang_type;
}

function setComplexIsReal( isReal ){
	_complex_isreal = isReal;
}
function complexIsReal(){
	return _complex_isreal;
}

function clearComplexError(){
	_complex_err = false;
}
function complexError(){
	return _complex_err;
}

// 複素数型
function _Complex( re, im ){
	this._re = (re == undefined) ? 0.0 : re;	// 実数部 real
	this._im = (im == undefined) ? 0.0 : im;	// 虚数部 imaginary
}

_Complex.prototype = {

	// 角度の単位を指定の単位に変換する
	angToAng : function( oldType, newType ){
		if( oldType != newType ){
			switch( oldType ){
			case _ANG_TYPE_RAD:
				this.mulAndAss( (newType == _ANG_TYPE_DEG) ? 180.0 : 200.0 );
				this.divAndAss( _PI );
				break;
			case _ANG_TYPE_DEG:
				this.mulAndAss( (newType == _ANG_TYPE_RAD) ? _PI : 200.0 );
				this.divAndAss( 180.0 );
				break;
			case _ANG_TYPE_GRAD:
				this.mulAndAss( (newType == _ANG_TYPE_RAD) ? _PI : 180.0 );
				this.divAndAss( 200.0 );
				break;
			}
		}
	},

	// 設定
	setReal : function( re ){
#ifdef DEBUG
assert( re != undefined );
#endif // DEBUG
		this._re = re;
	},
	setImag : function( im ){
#ifdef DEBUG
assert( im != undefined );
#endif // DEBUG
		this._im = im;
	},
	polar : function( rho, theta ){
		theta = _angToRad( theta );
		this._re = rho * _COS( theta );
		this._im = rho * _SIN( theta );
	},

	// 確認
	real : function(){
		return this._re;
	},
	imag : function(){
		return this._im;
	},

	// 型変換
	toFloat : function(){
		return this._re;
	},

	// 代入
	ass : function( r ){
#ifdef DEBUG
assert( r != undefined );
#endif // DEBUG
		if( r instanceof _Complex ){
			this._re = r._re;
			this._im = r._im;
		} else {
			this._re = r;
			this._im = 0.0;
		}
		return this;
	},

	// 単項マイナス
	minus : function(){
		return new _Complex( -this._re, -this._im );
	},

	// 加算
	add : function( r ){
#ifdef DEBUG
assert( r != undefined );
#endif // DEBUG
		if( r instanceof _Complex ){
			return new _Complex( this._re + r._re, this._im + r._im );
		}
		return new _Complex( this._re + r, this._im );
	},
	addAndAss : function( r ){
#ifdef DEBUG
assert( r != undefined );
#endif // DEBUG
		if( r instanceof _Complex ){
			this._re += r._re;
			this._im += r._im;
		} else {
			this._re += r;
		}
		return this;
	},

	// 減算
	sub : function( r ){
#ifdef DEBUG
assert( r != undefined );
#endif // DEBUG
		if( r instanceof _Complex ){
			return new _Complex( this._re - r._re, this._im - r._im );
		}
		return new _Complex( this._re - r, this._im );
	},
	subAndAss : function( r ){
#ifdef DEBUG
assert( r != undefined );
#endif // DEBUG
		if( r instanceof _Complex ){
			this._re -= r._re;
			this._im -= r._im;
		} else {
			this._re -= r;
		}
		return this;
	},

	// 乗算
	mul : function( r ){
#ifdef DEBUG
assert( r != undefined );
#endif // DEBUG
		if( r instanceof _Complex ){
			if( r._im == 0.0 ){
				return new _Complex( this._re * r._re, this._im * r._re );
			}
			return new _Complex( this._re * r._re - this._im * r._im, this._re * r._im + this._im * r._re );
		}
		return new _Complex( this._re * r, this._im * r );
	},
	mulAndAss : function( r ){
#ifdef DEBUG
assert( r != undefined );
#endif // DEBUG
		if( r instanceof _Complex ){
			if( r._im == 0.0 ){
				this._re *= r._re;
				this._im *= r._re;
			} else {
				var t    = this._re * r._re - this._im * r._im;
				this._im = this._re * r._im + this._im * r._re;
				this._re = t;
			}
		} else {
			this._re *= r;
			this._im *= r;
		}
		return this;
	},

	// 除算
	div : function( r ){
#ifdef DEBUG
assert( r != undefined );
#endif // DEBUG
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
#ifdef DEBUG
assert( r != undefined );
#endif // DEBUG
		if( r instanceof _Complex ){
			if( r._im == 0.0 ){
				this._re /= r._re;
				this._im /= r._re;
			} else if( _ABS( r._re ) < _ABS( r._im ) ){
				var w    = r._re / r._im;
				var d    = r._re * w + r._im;
				var t    = (this._re * w + this._im) / d;
				this._im = (this._im * w - this._re) / d;
				this._re = t;
			} else {
				var w    = r._im / r._re;
				var d    = r._re + r._im * w;
				var t    = (this._re + this._im * w) / d;
				this._im = (this._im - this._re * w) / d;
				this._re = t;
			}
		} else {
			this._re /= r;
			this._im /= r;
		}
		return this;
	},

	// 剰余
	mod : function( r ){
#ifdef DEBUG
assert( r != undefined );
#endif // DEBUG
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
#ifdef DEBUG
assert( r != undefined );
#endif // DEBUG
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

	// 等値
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

	// 絶対値
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

	// 位相角度
	farg : function(){
		return fatan2( this._im, this._re );
	},

	// 絶対値の自乗
	fnorm : function(){
		return this._re * this._re + this._im * this._im;
	},

	// 共役複素数
	conjg : function(){
		return new _Complex( this._re, -this._im );
	},

	// 正弦
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

	// 余弦
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

	// 正接
	tan : function(){
		if( this._im == 0.0 ){
			return floatToComplex( ftan( this._re ) );
		}
		var re2 = _angToRad( this._re ) * 2.0;
		var im2 = _angToRad( this._im ) * 2.0;
		var d   = _COS( re2 ) + fcosh( im2 );
		if( d == 0.0 ){
			_complex_err = true;
		}
		return new _Complex(
			_SIN( re2 ) / d,
			fsinh( im2 ) / d
			);
	},

	// 逆正弦
	asin : function(){
		if( this._im == 0.0 ){
			if( (this._re < -1.0) || (this._re > 1.0) ){
				if( _complex_isreal ){
					_complex_err = true;
					return floatToComplex( fasin( this._re ) );
				}
			} else {
				return floatToComplex( fasin( this._re ) );
			}
		}
		// -i * log( i * this + sqrt( -sqr() + 1.0 ) )
		var i = new _Complex( 0.0, 1.0 );
		var c = i.minus().mul( i.mul( this ).add( this.sqr().minus().add( 1.0 ).sqrt() ).log() );
		c._re = _radToAng( c._re );
		c._im = _radToAng( c._im );
		return c;
	},

	// 逆余弦
	acos : function(){
		if( this._im == 0.0 ){
			if( (this._re < -1.0) || (this._re > 1.0) ){
				if( _complex_isreal ){
					_complex_err = true;
					return floatToComplex( facos( this._re ) );
				}
			} else {
				return floatToComplex( facos( this._re ) );
			}
		}
/*
		// -i * log( this + sqrt( sqr() - 1.0 ) )
		var c = (new _Complex( 0.0, 1.0 )).minus().mul( this.add( this.sqr().sub( 1.0 ).sqrt() ).log() );
*/
		// i * log( this - i * sqrt( -sqr() + 1.0 ) )
		var i = new _Complex( 0.0, 1.0 );
		var c = i.mul( this.sub( i.mul( this.sqr().minus().add( 1.0 ).sqrt() ) ).log() );
		c._re = _radToAng( c._re );
		c._im = _radToAng( c._im );
		return c;
	},

	// 逆正接
	atan : function(){
		if( this._im == 0.0 ){
			return floatToComplex( fatan( this._re ) );
		}
		var d = new _Complex( -this._re, 1.0 - this._im );
		if( d.equal( 0.0 ) ){
			_complex_err = true;
		}
		// i * log( (i + this) / d ) * 0.5
		var i = new _Complex( 0.0, 1.0 );
		var c = i.mul( i.add( this ).div( d ).log() ).mul( 0.5 );
		c._re = _radToAng( c._re );
		c._im = _radToAng( c._im );
		return c;
	},

	// 双曲線正弦
	sinh : function(){
		if( this._im == 0.0 ){
			return floatToComplex( fsinh( this._re ) );
		}
		return new _Complex(
			fsinh( this._re ) * _COS( this._im ),
			fcosh( this._re ) * _SIN( this._im )
			);
	},

	// 双曲線余弦
	cosh : function(){
		if( this._im == 0.0 ){
			return floatToComplex( fcosh( this._re ) );
		}
		return new _Complex(
			fcosh( this._re ) * _COS( this._im ),
			fsinh( this._re ) * _SIN( this._im )
			);
	},

	// 双曲線正接
	tanh : function(){
		if( this._im == 0.0 ){
			return floatToComplex( ftanh( this._re ) );
		}
		var re2 = this._re * 2.0;
		var im2 = this._im * 2.0;
		var d   = fcosh( re2 ) + _COS( im2 );
		if( d == 0.0 ){
			_complex_err = true;
		}
		return new _Complex(
			fsinh( re2 ) / d,
			_SIN( im2 ) / d
			);
	},

	// 逆双曲線正弦
	asinh : function(){
		if( this._im == 0.0 ){
			return floatToComplex( fasinh( this._re ) );
		}
		// log( this + sqrt( sqr() + 1.0 ) )
		return this.add( this.sqr().add( 1.0 ).sqrt() ).log();
	},

	// 逆双曲線余弦
	acosh : function(){
		if( this._im == 0.0 ){
			if( this._re < 1.0 ){
				if( _complex_isreal ){
					_complex_err = true;
					return floatToComplex( facosh( this._re ) );
				}
			} else {
				return floatToComplex( facosh( this._re ) );
			}
		}
		// log( this + sqrt( sqr() - 1.0 ) )
		return this.add( this.sqr().sub( 1.0 ).sqrt() ).log();
	},

	// 逆双曲線正接
	atanh : function(){
		if( this._im == 0.0 ){
			if( (this._re <= -1.0) || (this._re >= 1.0) ){
				if( _complex_isreal ){
					_complex_err = true;
					return floatToComplex( fatanh( this._re ) );
				}
			} else {
				return floatToComplex( fatanh( this._re ) );
			}
		}
		var d = new _Complex( 1.0 - this._re, -this._im );
		if( d.equal( 0.0 ) ){
			_complex_err = true;
		}
		// log( (this + 1.0) / d ) * 0.5
		return this.add( 1.0 ).div( d ).log().mul( 0.5 );
	},

	// 切り上げ
	ceil : function(){
		return new _Complex(
			_CEIL( this._re ),
			_CEIL( this._im )
			);
	},

	// 切り捨て
	floor : function(){
		return new _Complex(
			_FLOOR( this._re ),
			_FLOOR( this._im )
			);
	},

	// 指数
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
		var e  = _EXP( this._re / _NORMALIZE );
		return new _Complex(
			e * _COS( im ),
			e * _SIN( im )
			);
	},

	// 対数
	log : function(){
		if( this._im == 0.0 ){
			if( this._re <= 0.0 ){
				if( _complex_isreal ){
					_complex_err = true;
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
				if( _complex_isreal ){
					_complex_err = true;
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

	// べき乗
	pow : function( y ){
		if( y instanceof _Complex ){
			if( y._im == 0.0 ){
				if( this._im == 0.0 ){
					return floatToComplex( _POW( this._re, y._re ) );
				}
				// exp( log( this ) * y._re )
				return this.log().mul( y._re ).exp();
			}
			if( this._im == 0.0 ){
				// exp( y * _LOG( this._re ) )
				return y.mul( _LOG( this._re ) ).exp();
			}
			// exp( log( this ) * y )
			return this.log().mul( y ).exp();
		}
		if( this._im == 0.0 ){
			return floatToComplex( _POW( this._re, y ) );
		}
		// exp( log( this ) * y )
		return this.log().mul( y ).exp();
	},

	// 自乗
	sqr : function(){
		if( this._im == 0.0 ){
			return floatToComplex( this._re * this._re );
		}
		return new _Complex( this._re * this._re - this._im * this._im, this._re * this._im + this._im * this._re );
	},

	// 平方根
	sqrt : function(){
		if( this._im == 0.0 ){
			if( this._re < 0.0 ){
				if( _complex_isreal ){
					_complex_err = true;
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

function getComplex( c, re/*_Float*/, im/*_Float*/ ){
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

// ラジアンを現在の角度の単位に変換する
function _radToAng( rad ){
	return _complex_israd ? rad : rad * _complex_ang_coef / _PI;
}

// 現在の角度の単位をラジアンに変換する
function _angToRad( ang ){
	return _complex_israd ? ang : ang * _PI / _complex_ang_coef;
}

// 各種関数
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
