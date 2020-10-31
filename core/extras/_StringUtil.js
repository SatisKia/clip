/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

function _StringUtil(){
	this._fontSize   = 0;
	this._fontFamily = "";

	// stringWidth用
	this._text = document.createElement( "span" );
	this._textStyle = "visibility:hidden;position:absolute;left:0;top:0";
	this._text.style.cssText = this._textStyle;
	document.body.appendChild( this._text );

	this._h = "";
	this._e = "";
}

_StringUtil.prototype = {

	setFont : function( size, family ){
		this._fontSize = size;
		this._fontFamily = (family.indexOf( " " ) >= 0) ? "'" + family + "'" : family;

		this._text.style.cssText = this._textStyle + ";font:" + this._fontSize + "px " + this._fontFamily;
	},
	stringWidth : function( str ){
		this._text.innerHTML = "'";
		var tmp = this._text.offsetWidth;
		str = str.replace( new RegExp( "<", "igm" ), "&lt;" );
		str = str.replace( new RegExp( ">", "igm" ), "&gt;" );
		this._text.innerHTML = "'" + str + "'";
		return this._text.offsetWidth - tmp * 2;
	},
	fontHeight : function(){
		return this._fontSize;
	},

	trim : function( str ){
		var ret = "";
		var i;
		var top = 0;
		for( i = 0; i < str.length; i++ ){
			if( (str.charAt( i ) != " ") && (str.charAt( i ) != "　") ){
				break;
			}
			top++;
		}
		if( top < str.length ){
			var end = str.length - 1;
			for( i = end; i >= 0; i-- ){
				if( (str.charAt( i ) != " ") && (str.charAt( i ) != "　") ){
					break;
				}
				end--;
			}
			ret = str.substring( top, end + 1 );
		}
		return ret;
	},

	truncate : function( str, width, truncation ){
		if( this.stringWidth( str ) <= width ){
			return str;
		}
		width -= this.stringWidth( truncation );
		var ret = "";
		for( var i = 0; i < str.length; i++ ){
			ret += str.charAt( i );
			if( this.stringWidth( ret ) > width ){
				if( ret.length > 1 ){
					ret = ret.substring( 0, ret.length - 1 );
					break;
				}
			}
		}
		return ret + truncation;
	},

	setHeadWrap : function( str ){
		this._h = str;
	},
	setEndWrap : function( str ){
		this._e = str;
	},
	wrap : function( str, width ){
		var ret = new Array();

		var chr;

		var j = 0;
		ret[j] = "";
		for( var i = 0; i < str.length; i++ ){
			ret[j] += str.charAt( i );
			if( this.stringWidth( ret[j] ) > width ){
				if( ret[j].length > 1 ){
					ret[j] = ret[j].substring( 0, ret[j].length - 1 );
					i--;

					// 行頭禁則
					if( this._h.length > 0 ){
						while( true ){
							if( i + 1 < str.length ){
								chr = str.charAt( i + 1 );
								if( this._h.indexOf( chr ) >= 0 ){
									ret[j] += chr;
									i++;
								} else {
									break;
								}
							} else {
								break;
							}
						}
					}

					// 行末禁則
					if( this._e.length > 0 ){
						while( true ){
							if( ret[j].length > 1 ){
								chr = ret[j].charAt( ret[j].length - 1 );
								if( this._e.indexOf( chr ) >= 0 ){
									ret[j] = ret[j].substring( 0, ret[j].length - 1 );
									i--;
								} else {
									break;
								}
							} else {
								break;
							}
						}
					}
				}

				j++;
				ret[j] = "";
			}
		}

		return ret;
	}

};
