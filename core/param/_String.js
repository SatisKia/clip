/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 文字列の受け渡し用
function _String( str ){
	this._str = (str == undefined) ? "" : ((str == null) ? null : "" + str);
}

_String.prototype = {
	set : function( str ){
		this._str = (str == null) ? null : "" + str;
		return this;
	},
	add : function( str ){
		if( str != null ){
			if( this._str == null ){
				this.set( str );
			} else {
				this._str += "" + str;
			}
		}
		return this;
	},
	str : function(){
		return (this._str == null) ? "" : this._str;
	},
	isNull : function(){
		return (this._str == null);
	},
	replace : function( word, replacement ){
		var end = word.length;
		if( end > 0 ){
			var top = 0;
			while( top < this.str().length ){
				if( this.str().substring( top, end ) == word ){
					var forward = (top > 0) ? this.str().substring( 0, top ) : "";
					var after   = (end < this.str().length) ? this.str().slice( end ) : "";
					this.set( forward + replacement + after );
					top += replacement.length;
					end += replacement.length;
				} else {
					top++;
					end++;
				}
			}
		}
		return this;
	},
	replaceNewLine : function( replacement ){
		this.replace( "\r\n", "\n" );
		this.replace( "\r"  , "\n" );
		if( replacement != undefined ){
			this.replace( "\n", replacement );
		}
		return this;
	},
	escape : function(){
		this.replace( "&" , "&amp;"  );	// 重要：一番最初に行うこと！
		this.replace( "<" , "&lt;"   );
		this.replace( ">" , "&gt;"   );
		this.replace( "\"", "&quot;" );
		this.replace( " " , "&nbsp;" );
		return this;
	},
	unescape : function(){
		this.replace( "&lt;"  , "<"  );
		this.replace( "&gt;"  , ">"  );
		this.replace( "&quot;", "\"" );
		this.replace( "&nbsp;", " "  );
		this.replace( "&amp;" , "&"  );	// 重要：一番最後に行うこと！
		return this;
	}
};

function newStringArray( len ){
	var a = new Array( len );
	for( var i = 0; i < len; i++ ){
		a[i] = new _String();
	}
	return a;
}
