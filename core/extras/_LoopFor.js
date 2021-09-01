/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// forループ
function _LoopFor( init, cond, expr, stat, end ){
	this.i = init;
	this.c = cond;
	this.e = expr;
	this.s = stat;
	this.n = end;
	this.j = 0;
	this.l = true;
	this.t = 0;
}

_LoopFor.prototype = {
	start : function( time ){
		this.t = time;
		window.setTimeout( this._init, this.t, this );
	},
	end : function(){
		this.l = false;
	},
	_init : function( _this ){
		if( _this.i( _this, _this.j ) ){
			_this.j++;
			if( _this.l ){
				window.setTimeout( _this._init, _this.t, _this );
			} else {
				_this.n();
			}
		} else {
			_this.j = 0;
			if( _this.l ){
				window.setTimeout( _this._cond, _this.t, _this );
			} else {
				_this.n();
			}
		}
	},
	_cond : function( _this ){
		if( _this.c( _this, _this.j ) ){
			_this.j++;
			if( _this.l ){
				window.setTimeout( _this._cond, _this.t, _this );
			} else {
				_this.n();
			}
		} else {
			_this.j = 0;
			if( _this.l ){
				window.setTimeout( _this._stat, _this.t, _this );
			} else {
				_this.n();
			}
		}
	},
	_stat : function( _this ){
		if( _this.s( _this, _this.j ) ){
			_this.j++;
			if( _this.l ){
				window.setTimeout( _this._stat, _this.t, _this );
			} else {
				_this.n();
			}
		} else {
			_this.j = 0;
			if( _this.l ){
				window.setTimeout( _this._expr, _this.t, _this );
			} else {
				_this.n();
			}
		}
	},
	_expr : function( _this ){
		if( _this.e( _this, _this.j ) ){
			_this.j++;
			if( _this.l ){
				window.setTimeout( _this._expr, _this.t, _this );
			} else {
				_this.n();
			}
		} else {
			_this.j = 0;
			if( _this.l ){
				window.setTimeout( _this._cond, _this.t, _this );
			} else {
				_this.n();
			}
		}
	}
};
