/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// キャンバス
function _Canvas( id ){
	this._canvas  = document.getElementById( id );
	this._context = this._canvas.getContext( "2d" );

	this._r = 0;
	this._g = 0;
	this._b = 0;
	this._a = 255;
	this._setColor();
}

_Canvas.prototype = {

	element : function(){
		return this._canvas;
	},

	left : function(){
		var e = this._canvas;
		var left = 0;
		while( e ){
			left += e.offsetLeft;
			e = e.offsetParent;
		}
		return left;
	},
	top : function(){
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
		if( this._r >= 0 ){
			var color;
			if( this._a == 255 ){
				color = "rgb(" + this._r + "," + this._g + "," + this._b + ")";
			} else {
				color = "rgba(" + this._r + "," + this._g + "," + this._b + "," + (this._a / 255.0) + ")";
			}
			this._context.fillStyle   = color;
			this._context.strokeStyle = color;
		}
	},
	setColor : function( r, g, b, a ){
		if( r == undefined ){
			this._r = -1;
		} else {
			if( a == undefined ){
				a = 255;
			}
			if( (r != this._r) || (g != this._g) || (b != this._b) || (a != this._a) ){
				this._r = r;
				this._g = g;
				this._b = b;
				this._a = a;
				this._setColor();
			}
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
