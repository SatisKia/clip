/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

function _EasyCanvas( window ){
	this._su = new _StringUtil();

	var _this = this;
	window.gWorldClear = function( gWorld, color ){
		var canvas = curClip()._canvas;
		canvas.setColorRGB( gWorldBgColor() );
		canvas.fill( 0, 0, canvas.width(), canvas.height() );
		canvas.setColorBGR( curClip()._palette[color] );
		canvas.fill( 0, 0, gWorld._width, gWorld._height );
		canvas.setColorBGR( curClip()._palette[gWorld._color] );
	};
	window.gWorldSetColor = function( gWorld, color ){
		curClip()._canvas.setColorBGR( curClip()._palette[color] );
	};
	window.gWorldPutColor = function( gWorld, x, y, color ){
		var canvas = curClip()._canvas;
		canvas.setColorBGR( curClip()._palette[color] );
		canvas.put( x, y );
		canvas.setColorBGR( curClip()._palette[gWorld._color] );
	};
	window.gWorldPut = function( gWorld, x, y ){
		curClip()._canvas.put( x, y );
	};
	window.gWorldFill = function( gWorld, x, y, w, h ){
		curClip()._canvas.fill( x, y, w, h );
	};
	window.gWorldLine = function( gWorld, x1, y1, x2, y2 ){
		curClip()._canvas.line( x1, y1, x2, y2 );
	};
	window.gWorldTextColor = function( gWorld, text, x, y, color, right ){
		if( right ){
			x -= _this._su.stringWidth( text );
		}
		var canvas = curClip()._canvas;
		canvas.setColorBGR( curClip()._palette[color] );
		canvas.drawString( text, x, y + 2 );
		canvas.setColorBGR( curClip()._palette[gWorld._color] );
	};
}

_EasyCanvas.prototype = {

	setFont : function( canvas, size, family ){
		canvas.setFont( size, family );
		this._su.setFont( size, family );
	}

};
