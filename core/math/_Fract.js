/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

var _FRACT_MAX = Number.MAX_SAFE_INTEGER/*4294967295*/;

var _fract_err = false;	// エラーが起こったかどうかのフラグ

function clearFractError(){
	_fract_err = false;
}
function fractError(){
	return _fract_err;
}

// 分数
function _Fract( mi, nu, de ){
	this._mi = (mi == undefined) ? false : mi;			// 負かどうかのフラグ
	this._nu = (nu == undefined) ? 0     : _INT( nu );	// 分子 numerator
	this._de = (de == undefined) ? 1     : _INT( de );	// 分母 denominator
}

_Fract.prototype = {

	// 約分する
	reduce : function(){
		var g = _GCD( this._nu, this._de );
		if( g != 0 ){
			this._nu = _DIV( this._nu, g );
			this._de = _DIV( this._de, g );
		}
	},

	// 循環小数を分数に変換する
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
			this._de = (Math.pow( 10.0, p ) - 1) * Math.pow( 10.0, k );
			return 1;
		}
		return 0;
	},
	_recurring : function( x ){
		var xx = x;

		var k = 1;
		var i;
		for( i = 0; ; i++ ){
			if( xx / Math.pow( 10.0, i ) < 10 ){
				k = Math.pow( 10.0, i );
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
				this._de *= Math.pow( 10.0, i );
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
			var de = Math.pow( 10.0, _FPREC( x ) );
			this._set( x * de, de );
		}
	},

	// 設定
	setMinus : function( mi ){
		this._mi = mi;
	},
	setNum : function( nu ){
		this._nu = _INT( nu );
	},
	setDenom : function( de ){
		this._de = _INT( de );
	},

	// 確認
	getMinus : function(){
		return this._mi && (this._nu != 0);
	},
	num : function(){
		return this._nu;
	},
	denom : function(){
		return this._de;
	},

	// 型変換
	toFloat : function(){
		if( this._de == 0 ){
			return Number.POSITIVE_INFINITY;
		}
		return (this._mi ? -this._nu : this._nu) / this._de;
	},

	// 代入
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

	// 単項マイナス
	minus : function(){
		return new _Fract( this._mi ? false : true, this._nu, this._de );
	},

	// 加算
	add : function( r ){
		if( r instanceof _Fract ){
			if( this._mi != r._mi ){
				// this - -r;
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
			// this - -r
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
				// this -= -r
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
				// this -= -r
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

	// 減算
	sub : function( r ){
		if( r instanceof _Fract ){
			if( this._mi != r._mi ){
				// this + -r
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
			// this + -r
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
				// this += -r
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
				// this += -r
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

	// 乗算
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

	// 除算
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

	// 剰余
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

	// 等値
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

	// 絶対値
	abs : function(){
		return new _Fract( false, this._nu, this._de );
	},

	// べき乗
	_powInt : function( y ){
		var nu = Math.pow( this._nu, y );
		var de = Math.pow( this._de, y );
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
			return floatToFract( Math.pow( this.toFloat(), y.toFloat() ) );
		}
		if( y == _INT( y ) ){
			return this._powInt( y );
		}
		return floatToFract( Math.pow( this.toFloat(), y ) );
	},

	// 自乗
	sqr : function(){
		return new _Fract(
			false,
			this._nu * this._nu,
			this._de * this._de
			);
	}

};

function getFract( f, mi/*_Boolean*/, nu/*_Integer*/, de/*_Integer*/ ){
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
