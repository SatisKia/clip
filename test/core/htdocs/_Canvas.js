/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

var _canvas_env;
function _CanvasEnv(){
	// _setColor用
	this._color_r = 0;
	this._color_g = 0;
	this._color_b = 0;
	this._color_a = 255;

	// _setFont用
	this._font = "";

	// _setStrokeWidth用
	this._stroke_width = 1.0;
}
function setCanvasEnv( env/*_CanvasEnv*/ ){
	_canvas_env = env;
}

// キャンバス
function _Canvas( id ){
	if( id == undefined ){
		this._canvas = document.createElement( "canvas" );
		this._create = true;
	} else {
		this._canvas = document.getElementById( id );
		this._create = false;
	}

	this._context = this._canvas.getContext( "2d" );
	this._resetContext();
}

_Canvas.prototype = {

	element : function(){
		return this._canvas;
	},
	context : function(){
		return this._context;
	},

	_resetContext : function(){
		this._context.textAlign    = "left";
		this._context.textBaseline = "bottom";
		this._setColor();
		this._setFont();
		this._setStrokeWidth();
	},

	setSize : function( width, height ){
		if( this._create ){
			this._canvas.width  = width;
			this._canvas.height = height;
		} else {
			this._canvas.setAttribute( "width" , "" + width  );
			this._canvas.setAttribute( "height", "" + height );
		}
		this._resetContext();
	},
	left : function(){
		if( this._create ){
			return 0;
		}
		var e = this._canvas;
		var left = 0;
		while( e ){
			left += e.offsetLeft;
			e = e.offsetParent;
		}
		return left;
	},
	top : function(){
		if( this._create ){
			return 0;
		}
		var e = this._canvas;
		var top = 0;
		while( e ){
			top += e.offsetTop;
			e = e.offsetParent;
		}
		return top;
	},
	width : function(){
		return parseInt( this._canvas.width );
	},
	height : function(){
		return parseInt( this._canvas.height );
	},

	_setColor : function(){
		var color;
		if( _canvas_env._color_a == 255 ){
			color = "rgb(" + _canvas_env._color_r + "," + _canvas_env._color_g + "," + _canvas_env._color_b + ")";
		} else {
			color = "rgba(" + _canvas_env._color_r + "," + _canvas_env._color_g + "," + _canvas_env._color_b + "," + (_canvas_env._color_a / 255.0) + ")";
		}
		this._context.fillStyle   = color;
		this._context.strokeStyle = color;
	},
	setColor : function( r, g, b, a ){
		if( a == undefined ){
			a = 255;
		}
		if( (r != _canvas_env._color_r) || (g != _canvas_env._color_g) || (b != _canvas_env._color_b) || (a != _canvas_env._color_a) ){
			_canvas_env._color_r = r;
			_canvas_env._color_g = g;
			_canvas_env._color_b = b;
			_canvas_env._color_a = a;
			this._setColor();
		}
	},
	setColorRGB : function( rgb ){
		this.setColor( (rgb & 0xFF0000) >> 16, (rgb & 0x00FF00) >> 8, rgb & 0x0000FF );
	},
	setColorBGR : function( bgr ){
		this.setColor( bgr & 0x0000FF, (bgr & 0x00FF00) >> 8, (bgr & 0xFF0000) >> 16 );
	},

	_setFont : function(){
		if( _canvas_env._font.length > 0 ){
			this._context.font = _canvas_env._font;
		}
	},
	setFont : function( size, family ){
		_canvas_env._font = "" + size + "px " + ((family.indexOf( " " ) >= 0) ? "'" + family + "'" : family);
		this._setFont();
	},

	_setStrokeWidth : function(){
		this._context.lineWidth = _canvas_env._stroke_width;
	},
	setStrokeWidth : function( width ){
		_canvas_env._stroke_width = width;
		this._setStrokeWidth();
	},

	clearClip : function()
	{
		this._context.restore();
		this._resetContext();
	},
	setClip : function( x, y, width, height )
	{
		if( !!this._context.clip )
		{
			this.clearClip();
			this._context.save();

			this._context.beginPath();
			this._context.moveTo( x, y );
			this._context.lineTo( x + width, y );
			this._context.lineTo( x + width, y + height );
			this._context.lineTo( x, y + height );
			this._context.closePath();
			this._context.clip();
		}
	},

	clear : function( x, y, w, h ){
		if( (x == undefined) && (y == undefined) && (w == undefined) && (h == undefined) ){
//			this._context.clearRect( 0, 0, this.width() + 1, this.height() + 1 );
			this._canvas.width = this._canvas.width;
		} else if( (w == undefined) && (h == undefined) ){
			this._context.clearRect( x, y, 1, 1 );
		} else {
			this._context.clearRect( x, y, w, h );
		}
		this._resetContext();
	},
	put : function( x, y ){
		this._context.fillRect( x, y, 1, 1 );
	},
	fill : function( x, y, w, h ){
		this._context.fillRect( x, y, w, h );
	},
	line : function( x1, y1, x2, y2 ){
		this._context.beginPath();
		this._context.moveTo( x1 + 0.5, y1 + 0.5 );
		this._context.lineTo( x2 + 0.5, y2 + 0.5 );
		this._context.stroke();
		this._context.closePath();
	},
	rect : function( x, y, w, h ){
		this._context.strokeRect( x + 0.5, y + 0.5, w, h );
	},
	circle : function( cx, cy, r ){
		this._context.beginPath();
		this._context.arc( cx, cy, r, 0.0, Math.PI * 2.0, false );
//		this._context.closePath();
		this._context.stroke();
	},
	drawString : function( str, x, y ){
		if( !!this._context.fillText ){
			this._context.fillText( str, x, y );
		}
	},
	drawImage : function( image, w, h ){
		if( (w == image.width) && (h == image.height) ){
			this._context.drawImage( image, 0, 0 );
		} else {
			this._context.drawImage( image, 0, 0, image.width, image.height, 0, 0, w, h );
		}
	},

	imageData : function( w, h ){
		return this._context.getImageData( 0, 0, w, h );
	}

};
