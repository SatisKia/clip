/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

var _timer_busy = new Array();

// タイマー
function _Timer(){
	this._index = _timer_busy.length;
	_timer_busy[this._index] = false;
	this._object = null;	// 紐付けられたオブジェクト
	this._frame  = 0;	// 1フレームの時間（ミリ秒）
	this._last   = 0;	// 前のフレーム処理にかかった時間
	this._stop   = true;
}

_Timer.prototype = {

	setObject : function( object ){
		this._object = object;
		return this;
	},
	setFrameTime : function( frameTime ){
		this._frame = frameTime;
		return this;
	},

	object : function(){
		return this._object;
	},
	lastTime : function(){
		return this._last;
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
		_timer_busy[_this._index] = true;
		if( onTimer( _this ) ){
			_this._last = (new Date()).getTime() - startTime;
			var sleepTime = _this._frame - _this._last;
			if( (sleepTime < 0) || (sleepTime > _this._frame) ){
				sleepTime = 0;
			}
			window.setTimeout( _this._loop, sleepTime, _this );
		}
		_timer_busy[_this._index] = false;
	}

};

//function onTimer( timer ){ return true; }
