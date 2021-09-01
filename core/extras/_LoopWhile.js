/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// whileループ
function _LoopWhile( cond, stat, end ){
	this.c = cond;
	this.s = stat;
	this.e = end;
	this.i = 0;
	this.l = true;
	this.t = 0;
}

_LoopWhile.prototype = {
	start : function( time, doFlag ){
		this.t = time;
		if( (doFlag == undefined) || (doFlag == false) ){
			window.setTimeout( this._cond, 0, this );
		} else {
			window.setTimeout( this._stat, 0, this );
		}
	},
	end : function(){
		this.l = false;
	},
	_cond : function( _this ){
		if( _this.c( _this, _this.i ) ){
			_this.i++;
			if( _this.l ){
				window.setTimeout( _this._cond, _this.t, _this );
			} else {
				_this.e();
			}
		} else {
			_this.i = 0;
			if( _this.l ){
				window.setTimeout( _this._stat, _this.t, _this );
			} else {
				_this.e();
			}
		}
	},
	_stat : function( _this ){
		if( _this.s( _this, _this.i ) ){
			_this.i++;
			if( _this.l ){
				window.setTimeout( _this._stat, _this.t, _this );
			} else {
				_this.e();
			}
		} else {
			_this.i = 0;
			if( _this.l ){
				window.setTimeout( _this._cond, _this.t, _this );
			} else {
				_this.e();
			}
		}
	}
};
