/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// エラー
function _Error(){
	if( window.onError == undefined ) window.onError = function( e ){};

	this._message = new String();
	this._name    = new String();

	// Microsoft
	this._description = new String();
	this._number      = new String();

	// Mozilla
	this._file   = new String();
	this._line   = new String();
	this._column = new String();
	this._stack  = new String();
}

_Error.prototype = {
	message : function(){
		return this._message;
	},
	name : function(){
		return this._name;
	},
	description : function(){
		return this._description;
	},
	number : function(){
		return this._number;
	},
	file : function(){
		return this._file;
	},
	line : function(){
		return this._line;
	},
	column : function(){
		return this._column;
	},
	stack : function(){
		return this._stack;
	}
};

function catchError( e ){
	var _e = new _Error();

	_e._message = e.message;
	_e._name    = e.name;

	// Microsoft
	if( e.description ) _e._description = e.description;
	if( e.number      ) _e._number      = "" + e.number;

	// Mozilla
	if( e.fileName     ) _e._file   = e.fileName;
	if( e.lineNumber   ) _e._line   = "" + e.lineNumber;
	if( e.columnNumber ) _e._column = "" + e.columnNumber;
	if( e.stack        ) _e._stack  = e.stack;

	onError( _e );
}

function clip_onerror( message, url, line ){
	var e = new _Error();

	e._message = message;
	e._file    = url;
	e._line    = line;

	onError( e );

	return true;
}
