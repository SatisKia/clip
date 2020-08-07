/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

var _console_break = "<br>";

function consoleBreak(){
	return _console_break;
}

// コンソール
function _Console( id ){
	if( window.onConsoleUpdate == undefined ) window.onConsoleUpdate = function( id ){};

	this._id         = id;
	this._div        = document.getElementById( this._id );
	this._html       = "";
	this._blankLine  = "";
	this._maxLen     = 0;
	this._color      = "";
	this._lastColor  = "";
	this._bold       = false;
	this._italic     = false;
	this._lock       = false;
	this._needUpdate = false;
}

_Console.prototype = {

	setMaxBlankLine : function( num ){
		this._blankLine = "";
		for( var i = 0; i <= num; i++ ){
			this._blankLine += _console_break;
		}
	},
	setMaxLen : function( len ){
		this._maxLen = len;
	},

	setColor : function( color ){
		this._color = (color == undefined) ? "" : color;
	},
	setBold : function( f ){
		this._bold = f;
	},
	setItalic : function( f ){
		this._italic = f;
	},

	lock : function(){
		this._lock       = true;
		this._needUpdate = false;
	},
	unlock : function(){
		this._lock = false;
		if( this._needUpdate ){
			this._update();
			this._needUpdate = false;
		}
	},

	_update : function(){
		if( this._lock ){
			this._needUpdate = true;
			return;
		}
		if( this._maxLen > 0 ){
			while( this._html.length > this._maxLen ){
				var index = this._html.indexOf( _console_break );
				if( index < 0 ){
					break;
				}
				this._html = this._html.slice( index + _console_break.length );
			}
		}
		this._div.innerHTML = this._html;
		if( this._html.length > 0 ){
			onConsoleUpdate( this._id );
		}
	},
	_add : function( str ){
		if( str.length > 0 ){
			if( this._bold ){
				if( this._html.slice( -4 ) == "</b>" ){
					this._html = this._html.substring( 0, this._html.length - 4 );
				} else {
					this._html += "<b>";
				}
			}

			if( this._italic ){
				if( this._html.slice( -4 ) == "</i>" ){
					this._html = this._html.substring( 0, this._html.length - 4 );
				} else {
					this._html += "<i>";
				}
			}

			if( this._color.length > 0 ){
				if( (this._html.slice( -7 ) == "</span>") && (this._color == this._lastColor) ){
					this._html = this._html.substring( 0, this._html.length - 7 );
				} else {
					this._html += "<span style='color:#" + this._color + "'>";
				}
				this._lastColor = this._color;
			}

			this._html += str;

			if( this._color.length > 0 ){
				this._html += "</span>";
			}

			if( this._italic ){
				this._html += "</i>";
			}

			if( this._bold ){
				this._html += "</b>";
			}
		}
	},

	clear : function(){
		this._html = "";
		this._update();
	},

	newLine : function(){
		if( this._html.length >= _console_break.length ){
			if( this._html.slice( -_console_break.length ) != _console_break ){
				this._html += _console_break;
				this._update();
			}
		}
	},

	print : function( str ){
		if( str != undefined ){
			this._add( str );
			this._update();
		}
	},
	println : function( str ){
		var needUpdate = false;
		if( str != undefined ){
			this._add( str );
			needUpdate = true;
		}
		if( (this._blankLine.length > 0) && (this._html.length >= this._blankLine.length) ){
			if( this._html.slice( -this._blankLine.length ) != this._blankLine ){
				this._html += _console_break;
				needUpdate = true;
			}
		} else {
			this._html += _console_break;
			needUpdate = true;
		}
		if( needUpdate ){
			this._update();
		}
	},

	scrollBottom : function(){
		// 一番下までスクロール
		this._div.scrollTop = this._div.scrollHeight;
	}

};
