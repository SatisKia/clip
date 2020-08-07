/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 時間
function _Time( i, h, m, s, f ){
	this._fps   = timeFps();					// 秒間フレーム数（ローカル）
	this._minus = (i == undefined) ? false : i;	// 負かどうかのフラグ
	this._hour  = (h == undefined) ? 0.0   : h;	// 時
	this._min   = (m == undefined) ? 0.0   : m;	// 分
	this._sec   = (s == undefined) ? 0.0   : s;	// 秒
	this._frame = (f == undefined) ? 0.0   : f;	// フレーム数
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

		// 時の小数部を取り除く
		_m = this._hour - _INT( this._hour );
		this._hour = _INT( this._hour );
		this._min += _m * 60.0;

		// 分の小数部を取り除く
		_s = this._min - _INT( this._min );
		this._min = _INT( this._min );
		this._sec += _s * 60.0;

		// 秒の小数部を取り除く
		_f = this._sec - _INT( this._sec );
		this._sec = _INT( this._sec );
		this._frame += _f * this._fps;
	},
	_reduce2 : function(){
		var _s, _m, _h;

		// フレームを秒間フレーム数未満の値にする
		_s = _INT( this._frame / this._fps );
		if( (this._frame < 0.0) && ((this._frame - _s * this._fps) != 0.0) ){
			_s -= 1.0;
		}
		this._sec   += _s;
		this._frame -= _s * this._fps;

		// 秒を60未満の値にする
		_m = _INT( this._sec / 60.0 );
		if( (this._sec < 0.0) && ((this._sec % 60.0) != 0.0) ){
			_m -= 1.0;
		}
		this._min += _m;
		this._sec -= _m * 60.0;

		// 分を60未満の値にする
		_h = _INT( this._min / 60.0 );
		if( (this._min < 0.0) && ((this._min % 60.0) != 0.0) ){
			_h -= 1.0;
		}
		this._hour += _h;
		this._min  -= _h * 60.0;

		// 時が正の値になるまで繰り返す
		if( this._hour < 0.0 ){
			this._minus = this._minus ? false : true;
			this._hour  = -this._hour;
			this._min   = -this._min;
			this._sec   = -this._sec;
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
		this._hour  = _DIV( x, 3600 ); x -= _INT( this._hour ) * 3600;
		this._min   = _DIV( x,   60 ); x -= _INT( this._min  ) *   60;
		this._sec   = _INT( x       );
		this._frame = (x - this._sec) * this._fps;
	},

	// 設定
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

	// 確認
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

	// 型変換
	toFloat : function(){
		if( this._minus ){
			return -(this._hour * 3600.0 + this._min * 60.0 + this._sec + this._frame / this._fps);
		}
		return this._hour * 3600.0 + this._min * 60.0 + this._sec + this._frame / this._fps;
	},

	// 代入
	ass : function( r ){
		if( r instanceof _Time ){
			this._fps   = r._fps;
			this._minus = r._minus;
			this._hour  = r._hour;
			this._min   = r._min;
			this._sec   = r._sec;
			this._frame = r._frame;
			this._update();
		} else {
			this._set( r );
		}
		return this;
	},

	// 単項マイナス
	minus : function(){
		return new _Time( this._minus ? false : true, this._hour, this._min, this._sec, this._frame );
	},

	// 加算
	add : function( r ){
		if( r instanceof _Time ){
			if( this._minus != r._minus ){
				// this - -r
				return this.sub( r.minus() );
			}
			var ll = dupTime( this );
			ll._update();
			var rr = dupTime( r );
			rr._update();
			var t = new _Time(
				ll._minus,
				ll._hour  + rr._hour,
				ll._min   + rr._min,
				ll._sec   + rr._sec,
				ll._frame + rr._frame
				);
			t.reduce();
			return t;
		}
		if( this._minus != (r < 0.0) ){
			// this - -r
			return this.sub( -r );
		}
		var ll = dupTime( this );
		ll._update();
		var rr = floatToTime( r );
		var t = new _Time(
			ll._minus,
			ll._hour  + rr._hour,
			ll._min   + rr._min,
			ll._sec   + rr._sec,
			ll._frame + rr._frame
			);
		t.reduce();
		return t;
	},
	addAndAss : function( r ){
		if( r instanceof _Time ){
			if( this._minus != r._minus ){
				// this -= -r
				this.subAndAss( r.minus() );
			} else {
				this._update();
				var rr = dupTime( r );
				rr._update();
				this._hour  += rr._hour;
				this._min   += rr._min;
				this._sec   += rr._sec;
				this._frame += rr._frame;
				this.reduce();
			}
		} else {
			if( this._minus != (r < 0.0) ){
				// this -= -r
				this.subAndAss( -r );
			} else {
				this._update();
				var rr = floatToTime( r );
				this._hour  += rr._hour;
				this._min   += rr._min;
				this._sec   += rr._sec;
				this._frame += rr._frame;
				this.reduce();
			}
		}
		return this;
	},

	// 減算
	sub : function( r ){
		if( r instanceof _Time ){
			if( this._minus != r._minus ){
				// this + -r
				return this.add( r.minus() );
			}
			var ll = dupTime( this );
			ll._update();
			var rr = dupTime( r );
			rr._update();
			var t = new _Time(
				ll._minus,
				ll._hour  - rr._hour,
				ll._min   - rr._min,
				ll._sec   - rr._sec,
				ll._frame - rr._frame
				);
			t.reduce();
			return t;
		}
		if( this._minus != (r < 0.0) ){
			// this + -r
			return this.add( -r );
		}
		var ll = dupTime( this );
		ll._update();
		var rr = floatToTime( r );
		var t = new _Time(
			ll._minus,
			ll._hour  - rr._hour,
			ll._min   - rr._min,
			ll._sec   - rr._sec,
			ll._frame - rr._frame
			);
		t.reduce();
		return t;
	},
	subAndAss : function( r ){
		if( r instanceof _Time ){
			if( this._minus != r._minus ){
				// this += -r
				this.addAndAss( r.minus() );
			} else {
				this._update();
				var rr = dupTime( r );
				rr._update();
				this._hour  -= rr._hour;
				this._min   -= rr._min;
				this._sec   -= rr._sec;
				this._frame -= rr._frame;
				this.reduce();
			}
		} else {
			if( this._minus != (r < 0.0) ){
				// this += -r
				this.addAndAss( -r );
			} else {
				this._update();
				var rr = floatToTime( r );
				this._hour  -= rr._hour;
				this._min   -= rr._min;
				this._sec   -= rr._sec;
				this._frame -= rr._frame;
				this.reduce();
			}
		}
		return this;
	},

	// 乗算
	mul : function( r ){
		if( r instanceof _Time ){
			var ll = dupTime( this );
			ll._update();
			var rr = r.toFloat();
			var t = new _Time(
				ll._minus,
				ll._hour  * rr,
				ll._min   * rr,
				ll._sec   * rr,
				ll._frame * rr
				);
			t.reduce();
			return t;
		}
		var ll = dupTime( this );
		ll._update();
		var t = new _Time(
			ll._minus,
			ll._hour  * r,
			ll._min   * r,
			ll._sec   * r,
			ll._frame * r
			);
		t.reduce();
		return t;
	},
	mulAndAss : function( r ){
		this._update();
		if( r instanceof _Time ){
			var rr = r.toFloat();
			this._hour  *= rr;
			this._min   *= rr;
			this._sec   *= rr;
			this._frame *= rr;
		} else {
			this._hour  *= r;
			this._min   *= r;
			this._sec   *= r;
			this._frame *= r;
		}
		this.reduce();
		return this;
	},

	// 除算
	div : function( r ){
		if( r instanceof _Time ){
			var ll = dupTime( this );
			ll._update();
			var rr = r.toFloat();
			var t = new _Time(
				ll._minus,
				ll._hour  / rr,
				ll._min   / rr,
				ll._sec   / rr,
				ll._frame / rr
				);
			t.reduce();
			return t;
		}
		var ll = dupTime( this );
		ll._update();
		var t = new _Time(
			ll._minus,
			ll._hour  / r,
			ll._min   / r,
			ll._sec   / r,
			ll._frame / r
			);
		t.reduce();
		return t;
	},
	divAndAss : function( r ){
		this._update();
		if( r instanceof _Time ){
			var rr = r.toFloat();
			this._hour  /= rr;
			this._min   /= rr;
			this._sec   /= rr;
			this._frame /= rr;
		} else {
			this._hour  /= r;
			this._min   /= r;
			this._sec   /= r;
			this._frame /= r;
		}
		this.reduce();
		return this;
	},

	// 剰余
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

	// 等値
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

function getTime( t, fps/*_Float*/, minus/*_Boolean*/, hour/*_Float*/, min/*_Float*/, sec/*_Float*/, frame/*_Float*/ ){
	fps  .set( t._fps   );
	minus.set( t._minus );
	hour .set( t._hour  );
	min  .set( t._min   );
	sec  .set( t._sec   );
	frame.set( t._frame );
}
function setTime( t, fps, minus, hour, min, sec, frame ){
	t._fps   = fps;
	t._minus = minus;
	t._hour  = hour;
	t._min   = min;
	t._sec   = sec;
	t._frame = frame;
	return t;
}

function dupTime( x ){
	return setTime( new _Time(), x._fps, x._minus, x._hour, x._min, x._sec, x._frame );
}

function floatToTime( x ){
	return (new _Time()).ass( x );
}
