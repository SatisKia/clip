/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Math.h"

var _value_type = _VALUE_TYPE_COMPLEX;	// 型（グローバル）

function setValueType( type ){
	_value_type = type;
}
function valueType(){
	return _value_type;
}

function clearValueError(){
	clearComplexError();
	clearFractError();
	clearTimeError();
}
function valueError(){
	return complexError() || fractError() || timeError();
}

// 基本型
function _Value(){
	this._type = _value_type;		// 型（ローカル）
	this._c    = new _Complex();	// 複素数型
	this._f    = new _Fract();		// 分数型
	this._t    = new _Time();		// 時間型
}

_Value.prototype = {

	type : function(){
		if( _value_type != this._type ){
			switch( _value_type ){
			case _VALUE_TYPE_COMPLEX:
				switch( this._type ){
				case _VALUE_TYPE_FRACT: this._c.ass( this._f.toFloat() ); break;
				case _VALUE_TYPE_TIME : this._c.ass( this._t.toFloat() ); break;
				}
				break;
			case _VALUE_TYPE_FRACT:
				switch( this._type ){
				case _VALUE_TYPE_COMPLEX: this._f.ass( this._c.toFloat() ); break;
				case _VALUE_TYPE_TIME   : this._f.ass( this._t.toFloat() ); break;
				}
				break;
			case _VALUE_TYPE_TIME:
				switch( this._type ){
				case _VALUE_TYPE_COMPLEX: this._t.ass( this._c.toFloat() ); break;
				case _VALUE_TYPE_FRACT  : this._t.ass( this._f.toFloat() ); break;
				}
				break;
			}
			this._type = _value_type;
		}
		return this._type;
	},

	angToAng : function( old_type, new_type ){
		this._complex().angToAng( old_type, new_type );
	},

	_complex : function(){
		switch( this._type ){
		case _VALUE_TYPE_FRACT: this._c.ass( this._f.toFloat() ); this._type = _VALUE_TYPE_COMPLEX; break;
		case _VALUE_TYPE_TIME : this._c.ass( this._t.toFloat() ); this._type = _VALUE_TYPE_COMPLEX; break;
		}
		return this._c;
	},
	_tmpComplex : function(){
		if( this._type == _VALUE_TYPE_FRACT ) return floatToComplex( this._f.toFloat() );
		if( this._type == _VALUE_TYPE_TIME  ) return floatToComplex( this._t.toFloat() );
		return this._c;
	},
	_fract : function(){
		switch( this._type ){
		case _VALUE_TYPE_COMPLEX: this._f.ass( this._c.toFloat() ); this._type = _VALUE_TYPE_FRACT; break;
		case _VALUE_TYPE_TIME   : this._f.ass( this._t.toFloat() ); this._type = _VALUE_TYPE_FRACT; break;
		}
		return this._f;
	},
	_tmpFract : function(){
		if( this._type == _VALUE_TYPE_COMPLEX ) return floatToFract( this._c.toFloat() );
		if( this._type == _VALUE_TYPE_TIME    ) return floatToFract( this._t.toFloat() );
		return this._f;
	},
	_time : function(){
		switch( this._type ){
		case _VALUE_TYPE_COMPLEX: this._t.ass( this._c.toFloat() ); this._type = _VALUE_TYPE_TIME; break;
		case _VALUE_TYPE_FRACT  : this._t.ass( this._f.toFloat() ); this._type = _VALUE_TYPE_TIME; break;
		}
		return this._t;
	},
	_tmpTime : function(){
		if( this._type == _VALUE_TYPE_COMPLEX ) return floatToTime( this._c.toFloat() );
		if( this._type == _VALUE_TYPE_FRACT   ) return floatToTime( this._f.toFloat() );
		return this._t;
	},

	setFloat : function( x ){
		switch( this._type ){
		case _VALUE_TYPE_COMPLEX: this._c.ass( x ); break;
		case _VALUE_TYPE_FRACT  : this._f.ass( x ); break;
		case _VALUE_TYPE_TIME   : this._t.ass( x ); break;
		}
		return this;
	},
	setComplex : function( x ){
		switch( this._type ){
		case _VALUE_TYPE_COMPLEX: this._c.ass( x           ); break;
		case _VALUE_TYPE_FRACT  : this._f.ass( x.toFloat() ); break;
		case _VALUE_TYPE_TIME   : this._t.ass( x.toFloat() ); break;
		}
		return this;
	},
	setFract : function( x ){
		switch( this._type ){
		case _VALUE_TYPE_COMPLEX: this._c.ass( x.toFloat() ); break;
		case _VALUE_TYPE_FRACT  : this._f.ass( x           ); break;
		case _VALUE_TYPE_TIME   : this._t.ass( x.toFloat() ); break;
		}
		return this;
	},
	setTime : function( x ){
		switch( this._type ){
		case _VALUE_TYPE_COMPLEX: this._c.ass( x.toFloat() ); break;
		case _VALUE_TYPE_FRACT  : this._f.ass( x.toFloat() ); break;
		case _VALUE_TYPE_TIME   : this._t.ass( x           ); break;
		}
		return this;
	},

	// 設定
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

	// 確認
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

	// 型変換
	toFloat : function(){
		if( this._type == _VALUE_TYPE_COMPLEX ) return this._c.toFloat();
		if( this._type == _VALUE_TYPE_FRACT   ) return this._f.toFloat();
		return this._t.toFloat();
	},

	// 代入
	ass : function( r ){
		this._type = _value_type;	// 代入の場合は左辺値の変換は不要なのでtype関数は使わない
		if( r instanceof _Value ){
			switch( r._type ){
			case _VALUE_TYPE_COMPLEX:
				switch( this._type ){
				case _VALUE_TYPE_COMPLEX: this._c.ass( r._c           ); break;
				case _VALUE_TYPE_FRACT  : this._f.ass( r._c.toFloat() ); break;
				case _VALUE_TYPE_TIME   : this._t.ass( r._c.toFloat() ); break;
				}
				break;
			case _VALUE_TYPE_FRACT:
				switch( this._type ){
				case _VALUE_TYPE_COMPLEX: this._c.ass( r._f.toFloat() ); break;
				case _VALUE_TYPE_FRACT  : this._f.ass( r._f           ); break;
				case _VALUE_TYPE_TIME   : this._t.ass( r._f.toFloat() ); break;
				}
				break;
			case _VALUE_TYPE_TIME:
				switch( this._type ){
				case _VALUE_TYPE_COMPLEX: this._c.ass( r._t.toFloat() ); break;
				case _VALUE_TYPE_FRACT  : this._f.ass( r._t.toFloat() ); break;
				case _VALUE_TYPE_TIME   : this._t.ass( r._t           ); break;
				}
				break;
			}
		} else {
			switch( this._type ){
			case _VALUE_TYPE_COMPLEX: this._c.ass( r ); break;
			case _VALUE_TYPE_FRACT  : this._f.ass( r ); break;
			case _VALUE_TYPE_TIME   : this._t.ass( r ); break;
			}
		}
		return this;
	},

	// 単項マイナス
	minus : function(){
		this.type();
		if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.minus() );
		if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.minus() );
		return timeToValue( this._t.minus() );
	},

	// 加算
	add : function( r ){
		this.type();
		if( r instanceof _Value ){
			if( r._type == _VALUE_TYPE_COMPLEX ){
				if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.add( r._c           ) );
				if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.add( r._c.toFloat() ) );
				return timeToValue( this._t.add( r._c.toFloat() ) );
			}
			if( r._type == _VALUE_TYPE_FRACT ){
				if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.add( r._f.toFloat() ) );
				if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.add( r._f           ) );
				return timeToValue( this._t.add( r._f.toFloat() ) );
			}
			if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.add( r._t.toFloat() ) );
			if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.add( r._t.toFloat() ) );
			return timeToValue( this._t.add( r._t ) );
		}
		if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.add( r ) );
		if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.add( r ) );
		return timeToValue( this._t.add( r ) );
	},
	addAndAss : function( r ){
		if( r instanceof _Value ){
			switch( r._type ){
			case _VALUE_TYPE_COMPLEX:
				switch( this.type() ){
				case _VALUE_TYPE_COMPLEX: this._c.addAndAss( r._c           ); break;
				case _VALUE_TYPE_FRACT  : this._f.addAndAss( r._c.toFloat() ); break;
				case _VALUE_TYPE_TIME   : this._t.addAndAss( r._c.toFloat() ); break;
				}
				break;
			case _VALUE_TYPE_FRACT:
				switch( this.type() ){
				case _VALUE_TYPE_COMPLEX: this._c.addAndAss( r._f.toFloat() ); break;
				case _VALUE_TYPE_FRACT  : this._f.addAndAss( r._f           ); break;
				case _VALUE_TYPE_TIME   : this._t.addAndAss( r._f.toFloat() ); break;
				}
				break;
			case _VALUE_TYPE_TIME:
				switch( this.type() ){
				case _VALUE_TYPE_COMPLEX: this._c.addAndAss( r._t.toFloat() ); break;
				case _VALUE_TYPE_FRACT  : this._f.addAndAss( r._t.toFloat() ); break;
				case _VALUE_TYPE_TIME   : this._t.addAndAss( r._t           ); break;
				}
				break;
			}
		} else {
			switch( this.type() ){
			case _VALUE_TYPE_COMPLEX: this._c.addAndAss( r ); break;
			case _VALUE_TYPE_FRACT  : this._f.addAndAss( r ); break;
			case _VALUE_TYPE_TIME   : this._t.addAndAss( r ); break;
			}
		}
		return this;
	},

	// 減算
	sub : function( r ){
		this.type();
		if( r instanceof _Value ){
			if( r._type == _VALUE_TYPE_COMPLEX ){
				if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.sub( r._c           ) );
				if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.sub( r._c.toFloat() ) );
				return timeToValue( this._t.sub( r._c.toFloat() ) );
			}
			if( r._type == _VALUE_TYPE_FRACT ){
				if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.sub( r._f.toFloat() ) );
				if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.sub( r._f           ) );
				return timeToValue( this._t.sub( r._f.toFloat() ) );
			}
			if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.sub( r._t.toFloat() ) );
			if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.sub( r._t.toFloat() ) );
			return timeToValue( this._t.sub( r._t ) );
		}
		if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.sub( r ) );
		if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.sub( r ) );
		return timeToValue( this._t.sub( r ) );
	},
	subAndAss : function( r ){
		if( r instanceof _Value ){
			switch( r._type ){
			case _VALUE_TYPE_COMPLEX:
				switch( this.type() ){
				case _VALUE_TYPE_COMPLEX: this._c.subAndAss( r._c           ); break;
				case _VALUE_TYPE_FRACT  : this._f.subAndAss( r._c.toFloat() ); break;
				case _VALUE_TYPE_TIME   : this._t.subAndAss( r._c.toFloat() ); break;
				}
				break;
			case _VALUE_TYPE_FRACT:
				switch( this.type() ){
				case _VALUE_TYPE_COMPLEX: this._c.subAndAss( r._f.toFloat() ); break;
				case _VALUE_TYPE_FRACT  : this._f.subAndAss( r._f           ); break;
				case _VALUE_TYPE_TIME   : this._t.subAndAss( r._f.toFloat() ); break;
				}
				break;
			case _VALUE_TYPE_TIME:
				switch( this.type() ){
				case _VALUE_TYPE_COMPLEX: this._c.subAndAss( r._t.toFloat() ); break;
				case _VALUE_TYPE_FRACT  : this._f.subAndAss( r._t.toFloat() ); break;
				case _VALUE_TYPE_TIME   : this._t.subAndAss( r._t           ); break;
				}
				break;
			}
		} else {
			switch( this.type() ){
			case _VALUE_TYPE_COMPLEX: this._c.subAndAss( r ); break;
			case _VALUE_TYPE_FRACT  : this._f.subAndAss( r ); break;
			case _VALUE_TYPE_TIME   : this._t.subAndAss( r ); break;
			}
		}
		return this;
	},

	// 乗算
	mul : function( r ){
		this.type();
		if( r instanceof _Value ){
			if( r._type == _VALUE_TYPE_COMPLEX ){
				if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.mul( r._c           ) );
				if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.mul( r._c.toFloat() ) );
				return timeToValue( this._t.mul( r._c.toFloat() ) );
			}
			if( r._type == _VALUE_TYPE_FRACT ){
				if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.mul( r._f.toFloat() ) );
				if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.mul( r._f           ) );
				return timeToValue( this._t.mul( r._f.toFloat() ) );
			}
			if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.mul( r._t.toFloat() ) );
			if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.mul( r._t.toFloat() ) );
			return timeToValue( this._t.mul( r._t ) );
		}
		if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.mul( r ) );
		if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.mul( r ) );
		return timeToValue( this._t.mul( r ) );
	},
	mulAndAss : function( r ){
		if( r instanceof _Value ){
			switch( r._type ){
			case _VALUE_TYPE_COMPLEX:
				switch( this.type() ){
				case _VALUE_TYPE_COMPLEX: this._c.mulAndAss( r._c           ); break;
				case _VALUE_TYPE_FRACT  : this._f.mulAndAss( r._c.toFloat() ); break;
				case _VALUE_TYPE_TIME   : this._t.mulAndAss( r._c.toFloat() ); break;
				}
				break;
			case _VALUE_TYPE_FRACT:
				switch( this.type() ){
				case _VALUE_TYPE_COMPLEX: this._c.mulAndAss( r._f.toFloat() ); break;
				case _VALUE_TYPE_FRACT  : this._f.mulAndAss( r._f           ); break;
				case _VALUE_TYPE_TIME   : this._t.mulAndAss( r._f.toFloat() ); break;
				}
				break;
			case _VALUE_TYPE_TIME:
				switch( this.type() ){
				case _VALUE_TYPE_COMPLEX: this._c.mulAndAss( r._t.toFloat() ); break;
				case _VALUE_TYPE_FRACT  : this._f.mulAndAss( r._t.toFloat() ); break;
				case _VALUE_TYPE_TIME   : this._t.mulAndAss( r._t           ); break;
				}
				break;
			}
		} else {
			switch( this.type() ){
			case _VALUE_TYPE_COMPLEX: this._c.mulAndAss( r ); break;
			case _VALUE_TYPE_FRACT  : this._f.mulAndAss( r ); break;
			case _VALUE_TYPE_TIME   : this._t.mulAndAss( r ); break;
			}
		}
		return this;
	},

	// 除算
	div : function( r ){
		this.type();
		if( r instanceof _Value ){
			if( r._type == _VALUE_TYPE_COMPLEX ){
				if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.div( r._c           ) );
				if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.div( r._c.toFloat() ) );
				return timeToValue( this._t.div( r._c.toFloat() ) );
			}
			if( r._type == _VALUE_TYPE_FRACT ){
				if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.div( r._f.toFloat() ) );
				if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.div( r._f           ) );
				return timeToValue( this._t.div( r._f.toFloat() ) );
			}
			if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.div( r._t.toFloat() ) );
			if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.div( r._t.toFloat() ) );
			return timeToValue( this._t.div( r._t ) );
		}
		if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.div( r ) );
		if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.div( r ) );
		return timeToValue( this._t.div( r ) );
	},
	divAndAss : function( r ){
		if( r instanceof _Value ){
			switch( r._type ){
			case _VALUE_TYPE_COMPLEX:
				switch( this.type() ){
				case _VALUE_TYPE_COMPLEX: this._c.divAndAss( r._c           ); break;
				case _VALUE_TYPE_FRACT  : this._f.divAndAss( r._c.toFloat() ); break;
				case _VALUE_TYPE_TIME   : this._t.divAndAss( r._c.toFloat() ); break;
				}
				break;
			case _VALUE_TYPE_FRACT:
				switch( this.type() ){
				case _VALUE_TYPE_COMPLEX: this._c.divAndAss( r._f.toFloat() ); break;
				case _VALUE_TYPE_FRACT  : this._f.divAndAss( r._f           ); break;
				case _VALUE_TYPE_TIME   : this._t.divAndAss( r._f.toFloat() ); break;
				}
				break;
			case _VALUE_TYPE_TIME:
				switch( this.type() ){
				case _VALUE_TYPE_COMPLEX: this._c.divAndAss( r._t.toFloat() ); break;
				case _VALUE_TYPE_FRACT  : this._f.divAndAss( r._t.toFloat() ); break;
				case _VALUE_TYPE_TIME   : this._t.divAndAss( r._t           ); break;
				}
				break;
			}
		} else {
			switch( this.type() ){
			case _VALUE_TYPE_COMPLEX: this._c.divAndAss( r ); break;
			case _VALUE_TYPE_FRACT  : this._f.divAndAss( r ); break;
			case _VALUE_TYPE_TIME   : this._t.divAndAss( r ); break;
			}
		}
		return this;
	},

	// 剰余
	mod : function( r ){
		this.type();
		if( r instanceof _Value ){
			if( r._type == _VALUE_TYPE_COMPLEX ){
				if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.mod( r._c           ) );
				if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.mod( r._c.toFloat() ) );
				return timeToValue( this._t.mod( r._c.toFloat() ) );
			}
			if( r._type == _VALUE_TYPE_FRACT ){
				if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.mod( r._f.toFloat() ) );
				if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.mod( r._f           ) );
				return timeToValue( this._t.mod( r._f.toFloat() ) );
			}
			if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.mod( r._t.toFloat() ) );
			if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.mod( r._t.toFloat() ) );
			return timeToValue( this._t.mod( r._t ) );
		}
		if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.mod( r ) );
		if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.mod( r ) );
		return timeToValue( this._t.mod( r ) );
	},
	modAndAss : function( r ){
		if( r instanceof _Value ){
			switch( r._type ){
			case _VALUE_TYPE_COMPLEX:
				switch( this.type() ){
				case _VALUE_TYPE_COMPLEX: this._c.modAndAss( r._c           ); break;
				case _VALUE_TYPE_FRACT  : this._f.modAndAss( r._c.toFloat() ); break;
				case _VALUE_TYPE_TIME   : this._t.modAndAss( r._c.toFloat() ); break;
				}
				break;
			case _VALUE_TYPE_FRACT:
				switch( this.type() ){
				case _VALUE_TYPE_COMPLEX: this._c.modAndAss( r._f.toFloat() ); break;
				case _VALUE_TYPE_FRACT  : this._f.modAndAss( r._f           ); break;
				case _VALUE_TYPE_TIME   : this._t.modAndAss( r._f.toFloat() ); break;
				}
				break;
			case _VALUE_TYPE_TIME:
				switch( this.type() ){
				case _VALUE_TYPE_COMPLEX: this._c.modAndAss( r._t.toFloat() ); break;
				case _VALUE_TYPE_FRACT  : this._f.modAndAss( r._t.toFloat() ); break;
				case _VALUE_TYPE_TIME   : this._t.modAndAss( r._t           ); break;
				}
				break;
			}
		} else {
			switch( this.type() ){
			case _VALUE_TYPE_COMPLEX: this._c.modAndAss( r ); break;
			case _VALUE_TYPE_FRACT  : this._f.modAndAss( r ); break;
			case _VALUE_TYPE_TIME   : this._t.modAndAss( r ); break;
			}
		}
		return this;
	},

	// 等値
	equal : function( r ){
		this.type();
		if( r instanceof _Value ){
			if( r._type == _VALUE_TYPE_COMPLEX ){
				if( this._type == _VALUE_TYPE_COMPLEX ) return this._c.equal( r._c           );
				if( this._type == _VALUE_TYPE_FRACT   ) return this._f.equal( r._c.toFloat() );
				return this._t.equal( r._c.toFloat() );
			}
			if( r._type == _VALUE_TYPE_FRACT ){
				if( this._type == _VALUE_TYPE_COMPLEX ) return this._c.equal( r._f.toFloat() );
				if( this._type == _VALUE_TYPE_FRACT   ) return this._f.equal( r._f           );
				return this._t.equal( r._f.toFloat() );
			}
			if( this._type == _VALUE_TYPE_COMPLEX ) return this._c.equal( r._t.toFloat() );
			if( this._type == _VALUE_TYPE_FRACT   ) return this._f.equal( r._t.toFloat() );
			return this._t.equal( r._t );
		}
		if( this._type == _VALUE_TYPE_COMPLEX ) return this._c.equal( r );
		if( this._type == _VALUE_TYPE_FRACT   ) return this._f.equal( r );
		return this._t.equal( r );
	},
	notEqual : function( r ){
		this.type();
		if( r instanceof _Value ){
			if( r._type == _VALUE_TYPE_COMPLEX ){
				if( this._type == _VALUE_TYPE_COMPLEX ) return this._c.notEqual( r._c           );
				if( this._type == _VALUE_TYPE_FRACT   ) return this._f.notEqual( r._c.toFloat() );
				return this._t.notEqual( r._c.toFloat() );
			}
			if( r._type == _VALUE_TYPE_FRACT ){
				if( this._type == _VALUE_TYPE_COMPLEX ) return this._c.notEqual( r._f.toFloat() );
				if( this._type == _VALUE_TYPE_FRACT   ) return this._f.notEqual( r._f           );
				return this._t.notEqual( r._f.toFloat() );
			}
			if( this._type == _VALUE_TYPE_COMPLEX ) return this._c.notEqual( r._t.toFloat() );
			if( this._type == _VALUE_TYPE_FRACT   ) return this._f.notEqual( r._t.toFloat() );
			return this._t.notEqual( r._t );
		}
		if( this._type == _VALUE_TYPE_COMPLEX ) return this._c.notEqual( r );
		if( this._type == _VALUE_TYPE_FRACT   ) return this._f.notEqual( r );
		return this._t.notEqual( r );
	},

	// 各種関数
	abs : function(){
		this.type();
		if( this._type == _VALUE_TYPE_COMPLEX ) return floatToValue( this._c.fabs() );
		if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue( this._f.abs () );
		return fractToValue( this._tmpFract().abs() );
	},
	pow : function( y ){
		this.type();
		if( y instanceof _Value ){
			if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.pow( y._tmpComplex() ) );
			if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.pow( y._tmpFract  () ) );
			return fractToValue( this._tmpFract().pow( y._tmpFract() ) );
		}
		if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.pow( y ) );
		if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.pow( y ) );
		return fractToValue( this._tmpFract().pow( y ) );
	},
	sqr : function(){
		this.type();
		if( this._type == _VALUE_TYPE_COMPLEX ) return complexToValue( this._c.sqr() );
		if( this._type == _VALUE_TYPE_FRACT   ) return fractToValue  ( this._f.sqr() );
		return fractToValue( this._tmpFract().sqr() );
	},
	ldexp : function( exp ){ // load exponent
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
	frexp : function( exp/*_Integer*/ ){ // fraction and exponent
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
	modf : function( _int/*_Float*/ ){
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

function getValue( v, type/*_Integer*/, c/*_Complex*/, f/*_Fract*/, t/*_Time*/ ){
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
	case _VALUE_TYPE_COMPLEX: setComplex( v._c, x._c._re, x._c._im ); break;
	case _VALUE_TYPE_FRACT  : setFract( v._f, x._f._mi, x._f._nu, x._f._de ); break;
	case _VALUE_TYPE_TIME   : setTime( v._t, x._t._fps, x._t._minus, x._t._hour, x._t._min, x._t._sec, x._t._frame ); break;
	}
	return v;
}
function dupValue( x ){
//	return setValue( new _Value(), x._type, x._c, x._f, x._t );
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
