/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

function _Tm(){
	this._sec  = 0;	// 秒 0～
	this._min  = 0;	// 分 0～
	this._hour = 0;	// 時 0～
	this._mday = 1;	// 日 1～
	this._mon  = 0;	// 1月からの月数
	this._year = 0;	// 1900年からの年数
	this._wday = 0;	// 日曜日からの日数
	this._yday = 0;	// 1月1日からの日数
}

function time(){
	return _DIV( (new Date()).getTime(), 1000 );
}

function mktime( tm ){
	var date = new Date();
	date.setFullYear( 1900 + tm._year );
	date.setMonth   ( tm._mon  );
	date.setDate    ( tm._mday );
	date.setHours   ( tm._hour );
	date.setMinutes ( tm._min  );
	date.setSeconds ( tm._sec  );
	return _DIV( date.getTime(), 1000 );
}

function localtime( t ){
	var date = new Date( t * 1000 );

	var startDate = new Date();
	startDate.setFullYear( date.getFullYear() );
	startDate.setMonth   ( 0 );
	startDate.setDate    ( 1 );
	startDate.setHours   ( 0 );
	startDate.setMinutes ( 0 );
	startDate.setSeconds ( 0 );

	var tm = new _Tm();
	tm._sec  = date.getSeconds ();
	tm._min  = date.getMinutes ();
	tm._hour = date.getHours   ();
	tm._mday = date.getDate    ();
	tm._mon  = date.getMonth   ();
	tm._year = date.getFullYear() - 1900;
	tm._wday = date.getDay     ();
	tm._yday = _DIV( date.getTime() - startDate.getTime(), 86400000 );
	return tm;
}
