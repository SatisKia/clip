/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

var _timer_busy = new Array();
var _timer_id = 0;

// タイマー
function _Timer(){
	this._id = _timer_id++;
	_timer_busy[this._id] = false;
	this._frame = 1000 / 60;
	this._stop = true;
}

_Timer.prototype = {

	id : function(){
		return this._id;
	},

	setFrameTime : function( frameTime ){
		this._frame = frameTime;
	},

	start : function(){
		this._stop = false;
		this._loop( this );
	},

	stop : function(){
		this._stop = true;
	},

	_loop : function( _this ){
		if( _this._stop ){
			_this._stop = false;
			return;
		}
		var startTime = (new Date()).getTime();
		var i;
		do {
			for( i = 0; i < _timer_busy.length; i++ ){
				if( _timer_busy[i] ){
					break;
				}
			}
		} while( i < _timer_busy.length );
		_timer_busy[_this._id] = true;
		onTimer( _this._id );
		_timer_busy[_this._id] = false;
		var sleepTime = _this._frame - ((new Date()).getTime() - startTime);
		if( (sleepTime < 0) || (sleepTime > _this._frame) ){
			sleepTime = 0;
		}
		window.setTimeout( _this._loop, sleepTime, _this );
	}

};

//function onTimer( id ){}
