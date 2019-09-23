/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 文字情報クラス
function __CharInfo(){
	this._width   = 0;		//
	this._ascent  = 0;		//
	this._descent = 0;		//
	this._sizeX   = 0;		// データのメモリ幅
	this._sizeY   = 0;		// データのbaselineからのオフセット
	this._data    = null;	// データ
							//
							// +---------+-+-------
							// |         | |     ↑
							// +---------+-+---  ｜
							// | ■■■  | | ↑ ascent
							// |■   ■  | | ｜  ｜
							// |■   ■  | |sizeY｜
							// | ■■  ■| | ↓  ↓
							// +---------+-+------- baseline
							// |         | |    descent
							// +---------+-+-------
							// |←sizeX→| |     ↑
							// |← width →|
							//
							// +-----+-+-------
							// +-----+-+---  ↑
							// |   ■| | ↑  ｜
							// |     | | ｜ ascent
							// |   ■| |sizeY｜
							// |   ■| | ｜  ｜
							// |   ■| | ↓  ↓
							// +---■+-+------- baseline
							// |■■ | |    descent
							// +-----+-+-------
							// |sizeX| |     ↑
							// | width |
}

var _gworld_char_info = new Array();	// 文字情報

function newGWorldCharInfo( charSet ){
	_gworld_char_info[charSet] = new Array( 256 );
	for( var i = 0; i < 256; i++ ){
		_gworld_char_info[charSet][i] = new __CharInfo();
	}
}

// 文字情報を登録する
function regGWorldCharInfo( charSet, chr, width, ascent, descent, sizeX, sizeY, data ){
	_gworld_char_info[charSet][chr]._width   = width;
	_gworld_char_info[charSet][chr]._ascent  = ascent;
	_gworld_char_info[charSet][chr]._descent = descent;
	_gworld_char_info[charSet][chr]._sizeX   = sizeX;
	_gworld_char_info[charSet][chr]._sizeY   = sizeY;

	_gworld_char_info[charSet][chr]._data = new String();
	_gworld_char_info[charSet][chr]._data = data;
}

// システムの背景色
var _gworld_bg_color = 0;
function regGWorldBgColor( rgbColor ){
	_gworld_bg_color = rgbColor;
}
function gWorldBgColor(){
	return _gworld_bg_color;
}

// イメージ・メモリ管理クラス
function _GWorld(){
	// イメージ情報
	this._image      = null;	// イメージ・メモリ
	this._offset     = 0;		// イメージ・メモリの幅
	this._width      = 0;		// イメージの論理幅
	this._height     = 0;		// イメージの高さ
	this._createFlag = false;	// イメージが新規作成か登録されたかのフラグ

	// ウィンドウ情報
	this._offsetX = 0.0;	// Ｘ方向オフセット
	this._offsetY = 0.0;	// Ｙ方向オフセット
	this._ratioX  = 1.0;	// Ｘ方向比率
	this._ratioY  = 1.0;	// Ｙ方向比率
	this._ratioX2 = 1.0;	// Ｘ方向比率の絶対値
	this._ratioY2 = 1.0;	// Ｙ方向比率の絶対値

	// スクロール情報
	this._beginScroll = false;
	this._scrollPosX  = 0.0;
	this._scrollPosY  = 0.0;
	this._scrollOffX  = 0.0;
	this._scrollOffY  = 0.0;

	// 現在点
	this._imgMoveX = 0;		// 現在のＸ座標(イメージ用)
	this._imgMoveY = 0;		// 現在のＹ座標(イメージ用)
	this._wndMoveX = 0.0;	// 現在のＸ座標(ウィンドウ用)
	this._wndMoveY = 0.0;	// 現在のＹ座標(ウィンドウ用)

	// カレントカラー
	this._color = 0;

	// 文字セット
	this._charSet = 0;

	this._gWorldLine = false;
}

_GWorld.prototype = {

	// イメージを確保する
	create : function( width, height, initWindow ){
		// イメージを開放する
		this._dispose();

		if( (width <= 0) || (height <= 0) ){
			return false;
		}

		// イメージを確保する
		this._image      = new Array( width * height );
		this._offset     = width;
		this._width      = width;
		this._height     = height;
		this._createFlag = true;

		// ウィンドウ情報
		if( initWindow ){
			this.setWindow( 0.0, 0.0, 1.0, 1.0 );
		} else {
			// 現在点を更新する
			this._wndMoveX = this.wndPosX( this._imgMoveX );
			this._wndMoveY = this.wndPosY( this._imgMoveY );
		}

		// イメージをクリアする
		this.clear( 0 );

		return true;
	},

	// イメージを登録する
	open : function( image, offset, width, height, initWindow ){
		// イメージを開放する
		this._dispose();

		if( (width <= 0) || (height <= 0) ){
			return false;
		}

		// イメージを登録する
		this._image      = image;
		this._offset     = offset;
		this._width      = width;
		this._height     = height;
		this._createFlag = false;

		// ウィンドウ情報
		if( initWindow ){
			this.setWindow( 0.0, 0.0, 1.0, 1.0 );
		} else {
			// 現在点を更新する
			this._wndMoveX = this.wndPosX( this._imgMoveX );
			this._wndMoveY = this.wndPosY( this._imgMoveY );
		}

		// イメージをクリアする
		this.clear( 0 );

		return true;
	},

	// イメージを開放する
	_dispose : function(){
		// イメージ情報
		this._image      = null;
		this._offset     = 0;
		this._width      = 0;
		this._height     = 0;
		this._createFlag = false;
	},

	// ウィンドウを設定する
	setWindow : function( offsetX, offsetY, ratioX, ratioY ){
		this._offsetX = offsetX;
		this._offsetY = offsetY;
		this._ratioX  = ratioX;
		this._ratioY  = ratioY;
		this._ratioX2 = (this._ratioX >= 0.0) ? this._ratioX : -this._ratioX;
		this._ratioY2 = (this._ratioY >= 0.0) ? this._ratioY : -this._ratioY;

		// 現在点を更新する
		this._wndMoveX = this.wndPosX( this._imgMoveX );
		this._wndMoveY = this.wndPosY( this._imgMoveY );
	},
	setWindowIndirect : function( left, bottom, right, top ){
		var sizeX, sizeY;

		if( ((sizeX = right - left) == 0.0) || ((sizeY = bottom - top) == 0.0) ){
			return false;
		}

		this._ratioX  = (this._width  - 1) / sizeX;
		this._ratioY  = (this._height - 1) / sizeY;
		this._ratioX2 = (this._ratioX >= 0.0) ? this._ratioX : -this._ratioX;
		this._ratioY2 = (this._ratioY >= 0.0) ? this._ratioY : -this._ratioY;
		this._offsetX = 0.5 - left * this._ratioX;
		this._offsetY = 0.5 - top  * this._ratioY;

		// 現在点を更新する
		this._wndMoveX = this.wndPosX(this._imgMoveX);
		this._wndMoveY = this.wndPosY(this._imgMoveY);

		return true;
	},

	// ウィンドウ位置をスクロールさせる
	scroll : function( scrollX, scrollY ){
		if( this._beginScroll ){
			this._offsetX = this._scrollOffX + (scrollX - this._scrollPosX);
			this._offsetY = this._scrollOffY + (scrollY - this._scrollPosY);
		} else {
			this._offsetX += scrollX;
			this._offsetY += scrollY;
		}
	},
	beginScroll : function( scrollX, scrollY ){
		this._beginScroll = true;
		this._scrollPosX = scrollX;
		this._scrollPosY = scrollY;
		this._scrollOffX = this._offsetX;
		this._scrollOffY = this._offsetY;
	},
	endScroll : function(){
		this._beginScroll = false;
	},

	// ウィンドウ情報を確認する
	getWindow : function( offsetX/*_Float*/, offsetY/*_Float*/, ratioX/*_Float*/, ratioY/*_Float*/ ){
		if( offsetX != null ) offsetX.set( this._offsetX );
		if( offsetY != null ) offsetY.set( this._offsetY );
		if( ratioX  != null ) ratioX .set( this._ratioX  );
		if( ratioY  != null ) ratioY .set( this._ratioY  );
	},

	// 論理座標から実座標を求める
	imgPosX : function( x ){
		return _INT( x * this._ratioX + this._offsetX );
	},
	imgPosY : function( y ){
		return _INT( y * this._ratioY + this._offsetY );
	},
	imgSizX : function( x ){
		x *= this._ratioX2;
		if( _ISINF( x ) || _ISNAN( x ) ){
			return -1;
		}
		return _INT( x );
	},
	imgSizY : function( y ){
		y *= this._ratioY2;
		if( _ISINF( y ) || _ISNAN( y ) ){
			return -1;
		}
		return _INT( y );
	},

	// 実座標から論理座標を求める
	wndPosX : function( x ){
		return (x - this._offsetX) / this._ratioX;
	},
	wndPosY : function( y ){
		return (y - this._offsetY) / this._ratioY;
	},
	wndSizX : function( x ){
		return x / this._ratioX2;
	},
	wndSizY : function( y ){
		return y / this._ratioY2;
	},

	// カレントカラーを設定する
	setColor : function( color ){
		this._color = color;
		gWorldSetColor( this, this._color );
	},

	// カレントカラーを確認する
	color : function(){
		return this._color;
	},

	// ドットを描画する
	putColor : function( x, y, color ){
		if( (x < 0) || (x >= _INT( this._width )) || (y < 0) || (y >= _INT( this._height )) ){
			return false;
		}
		this._image[y * this._offset + x] = color;
		if( !this._gWorldLine ){
			if( color == this._color ){
				gWorldPut( this, x, y );
			} else {
				gWorldPutColor( this, x, y, color, this._color );
			}
		}
		return true;
	},
	put : function( x, y ){
		return this.putColor( x, y, this._color );
	},
	wndPut : function( x, y ){
		// 論理座標から実座標に変換
		return this.put( this.imgPosX( x ), this.imgPosY( y ) );
	},
	putXOR : function( x, y ){
		if( (x < 0) || (x >= _INT( this._width )) || (y < 0) || (y >= _INT( this._height )) ){
			return false;
		}
		var color = 255 - this._image[y * this._offset + x];
		this._image[y * this._offset + x] = color;
		if( !this._gWorldLine ){
			gWorldPutColor( this, x, y, color );
		}
		return true;
	},

	// ドット値を確認する
	get : function( x, y ){
		if( (x < 0) || (x >= _INT( this._width )) || (y < 0) || (y >= _INT( this._height )) ){
			return 0;
		}
		return this._image[y * this._offset + x];
	},
	wndGet : function( x, y ){
		// 論理座標から実座標に変換
		return this.get( this.imgPosX( x ), this.imgPosY( y ) );
	},

	// イメージをクリアする
	clear : function( color ){
		var ix, iy, yy;
		for( iy = 0; iy < this._height; iy++ ){
			yy = iy * this._offset;
			for( ix = 0; ix < this._width; ix++ ){
				this._image[yy + ix] = color;
			}
		}
		gWorldClear( this, color );
	},

	// イメージを塗りつぶす
	fill : function( x, y, w, h ){
		var ix, iy, yy;

		// クリッピング
		if( x < 0 ){
			w += x;
			x = 0;
		}
		if( y < 0 ){
			h += y;
			y = 0;
		}
		if( (x + w) > _INT( this._width ) ){
			w = _INT( this._width - x );
		}
		if( (y + h) > _INT( this._height ) ){
			h = _INT( this._height - y );
		}

		for( iy = y; iy < y + h; iy++ ){
			yy = iy * this._offset;
			for( ix = x; ix < x + w; ix++ ){
				this._image[yy + ix] = this._color;
			}
		}

		gWorldFill( this, x, y, w, h );
	},
	wndFill : function( x, y, w, h ){
		// 論理座標から実座標に変換
		var gx = imgPosX( x );
		var gy = imgPosY( y );
		var gw = imgPosX( x + w ) - gx;
		var gh = imgPosY( y + h ) - gy;
		if( gw < 0 ){
			gx += (gw + 1);
			gw = -gw;
		}
		if( gh < 0 ){
			gy += (gh + 1);
			gh = -gh;
		}

		this.fill( gx, gy, gw, gh );
	},

	// ラインを描画する
	_clipLine : function( x1, y1, x2, y2, x/*_Integer*/, y/*_Integer*/ ){
		var a, b;

		if( x.val() < 0 ){
			if( y1 == y2 ){
				x.set( 0 );
			} else {
				a = (y1 - y2) / (x1 - x2);
				b = y1 - a * x1;
				x.set( 0 );
				y.set( _INT( b ) );
			}
		} else if( x.val() > this.width() ){
			if( y1 == y2 ){
				x.set( this.width() );
			} else {
				a = (y1 - y2) / (x1 - x2);
				b = y1 - a * x1;
				x.set( this.width() );
				y.set( _INT( a * this.width() + b ) );
			}
		}
		if( y.val() < 0 ){
			if( x1 == x2 ){
				y.set( 0 );
			} else {
				a = (y1 - y2) / (x1 - x2);
				b = y1 - a * x1;
				x.set( _INT( -b / a ) );
				y.set( 0 );
			}
		} else if( y.val() > this.height() ){
			if( x1 == x2 ){
				y.set( this.height() );
			} else {
				a = (y1 - y2) / (x1 - x2);
				b = y1 - a * x1;
				x.set( _INT( (this.height() - b) / a ) );
				y.set( this.height() );
			}
		}
	},
	clipLine : function( x1/*_Integer*/, y1/*_Integer*/, x2/*_Integer*/, y2/*_Integer*/ ){
		var ret;

		if(
			(x1.val() >= 0) && (x1.val() <= this.width ()) &&
			(y1.val() >= 0) && (y1.val() <= this.height()) &&
			(x2.val() >= 0) && (x2.val() <= this.width ()) &&
			(y2.val() >= 0) && (y2.val() <= this.height())
		){
			return 1;
		} else {
			if(
				(x1.val() >= 0) && (x1.val() <= this.width ()) &&
				(y1.val() >= 0) && (y1.val() <= this.height())
			){
				// (x2,y2)を修正
				this._clipLine( x1.val(), y1.val(), x2.val(), y2.val(), x2, y2 );
				ret = 1;
			} else if(
				(x2.val() >= 0) && (x2.val() <= this.width ()) &&
				(y2.val() >= 0) && (y2.val() <= this.height())
			){
				// (x1,y1)を修正
				this._clipLine( x1.val(), y1.val(), x2.val(), y2.val(), x1, y1 );
				ret = 1;
			} else {
				// (x1,y1),(x2,y2)を修正
				this._clipLine( x1.val(), y1.val(), x2.val(), y2.val(), x1, y1 );
				this._clipLine( x1.val(), y1.val(), x2.val(), y2.val(), x2, y2 );
				ret = 2;
			}
			if(
				((x1.val() <= 0            ) && (x2.val() <= 0            )) ||
				((y1.val() <= 0            ) && (y2.val() <= 0            )) ||
				((x1.val() >= this.width ()) && (x2.val() >= this.width ())) ||
				((y1.val() >= this.height()) && (y2.val() >= this.height()))
			){
				return 0;
			}
		}
		return ret;
	},
	drawLine : function( x1, y1, x2, y2 ){
		gWorldLine( this, x1, y1, x2, y2 );
		this._gWorldLine = true;

		var dx, dy;
		var step;
		var temp;
		var s;

		dx = Math.abs( x2 - x1 );
		dy = Math.abs( y2 - y1 );
		if( dx > dy ){
			if( x1 > x2 ){
				step = (y1 > y2) ? 1 : -1;
				temp = x1; x1 = x2; x2 = temp;
				y1 = y2;
			} else {
				step = (y1 < y2) ? 1 : -1;
			}
			this.put( x1, y1 );
			s = _DIV( dx, 2 );
			while( ++x1 <= x2 ){
				if( (s -= dy) < 0 ){
					s += dx;
					y1 += step;
				}
				this.put( x1, y1 );
			}
		} else {
			if( y1 > y2 ){
				step = (x1 > x2) ? 1 : -1;
				temp = y1; y1 = y2; y2 = temp;
				x1 = x2;
			} else {
				step = (x1 < x2) ? 1 : -1;
			}
			this.put( x1, y1 );
			s = _DIV( dy, 2 );
			while( ++y1 <= y2 ){
				if( (s -= dx) < 0 ){
					s += dy;
					x1 += step;
				}
				this.put( x1, y1 );
			}
		}

		this._gWorldLine = false;
	},
	drawLineXOR : function( x1, y1, x2, y2 ){
		var dx, dy;
		var step;
		var temp;
		var s;

		dx = Math.abs( x2 - x1 );
		dy = Math.abs( y2 - y1 );
		if( dx > dy ){
			if( x1 > x2 ){
				step = (y1 > y2) ? 1 : -1;
				temp = x1; x1 = x2; x2 = temp;
				y1 = y2;
			} else {
				step = (y1 < y2) ? 1 : -1;
			}
			this.putXOR( x1, y1 );
			s = _DIV( dx, 2 );
			while( ++x1 <= x2 ){
				if( (s -= dy) < 0 ){
					s += dx;
					y1 += step;
				}
				this.putXOR( x1, y1 );
			}
		} else {
			if( y1 > y2 ){
				step = (x1 > x2) ? 1 : -1;
				temp = y1; y1 = y2; y2 = temp;
				x1 = x2;
			} else {
				step = (x1 < x2) ? 1 : -1;
			}
			this.putXOR( x1, y1 );
			s = _DIV( dy, 2 );
			while( ++y1 <= y2 ){
				if( (s -= dx) < 0 ){
					s += dy;
					x1 += step;
				}
				this.putXOR( x1, y1 );
			}
		}
	},
	line : function( x1, y1, x2, y2 ){
		var xx1 = new _Integer( x1 );
		var yy1 = new _Integer( y1 );
		var xx2 = new _Integer( x2 );
		var yy2 = new _Integer( y2 );
		if( this.clipLine( xx1, yy1, xx2, yy2 ) == 0 ){
			return false;
		}
		this.drawLine( xx1.val(), yy1.val(), xx2.val(), yy2.val() );
		this.moveTo( x2, y2 );
		return true;
	},
	lineXOR : function( x1, y1, x2, y2 ){
		var xx1 = new _Integer( x1 );
		var yy1 = new _Integer( y1 );
		var xx2 = new _Integer( x2 );
		var yy2 = new _Integer( y2 );
		if( this.clipLine( xx1, yy1, xx2, yy2 ) == 0 ){
			return false;
		}
		this.drawLineXOR( xx1.val(), yy1.val(), xx2.val(), yy2.val() );
		this.moveTo( x2, y2 );
		return true;
	},
	wndLine : function( x1, y1, x2, y2 ){
		// 論理座標から実座標に変換
		var gx1 = new _Integer( this.imgPosX( x1 ) );
		var gy1 = new _Integer( this.imgPosY( y1 ) );
		var gx2 = new _Integer( this.imgPosX( x2 ) );
		var gy2 = new _Integer( this.imgPosY( y2 ) );

		if( this.clipLine( gx1, gy1, gx2, gy2 ) == 0 ){
			return false;
		}
		this.drawLine( gx1.val(), gy1.val(), gx2.val(), gy2.val() );
		this.wndMoveTo( x2, y2 );
		return true;
	},
	moveTo : function( x, y ){
		this._imgMoveX = x;
		this._imgMoveY = y;
		this._wndMoveX = this.wndPosX( this._imgMoveX );
		this._wndMoveY = this.wndPosY( this._imgMoveY );
	},
	wndMoveTo : function( x, y ){
		this._wndMoveX = x;
		this._wndMoveY = y;
		this._imgMoveX = this.imgPosX( this._wndMoveX );
		this._imgMoveY = this.imgPosY( this._wndMoveY );
	},
	lineTo : function( x, y ){
		return this.line( this._imgMoveX, this._imgMoveY, x, y );
	},
	wndLineTo : function( x, y ){
		return this.wndLine( this._wndMoveX, this._wndMoveY, x, y );
	},

	// 文字セットを選択する
	selectCharSet : function( charSet ){
		this._charSet = charSet;
	},

	// テキストを描画する
	getTextInfo : function( text, info ){
		info._width   = 0;
		info._ascent  = 0;
		info._descent = 0;

		var chr;
		for( var i = 0; i < text.length; i++ ){
			chr = text.charCodeAt( i );
			if( _gworld_char_info[this._charSet][chr]._data != null ){
				info._width += _gworld_char_info[this._charSet][chr]._width;
				if( _gworld_char_info[this._charSet][chr]._ascent > info._ascent ){
					info._ascent = _gworld_char_info[this._charSet][chr]._ascent;
				}
				if( _gworld_char_info[this._charSet][chr]._descent > info._descent ){
					info._descent = _gworld_char_info[this._charSet][chr]._descent;
				}
			}
		}
	},
	drawTextColor : function( text, x, y, color ){
		this._imgMoveX = x;
		this._imgMoveY = y;

		var xx, yy;
		var top;

		var chr;
		for( var i = 0; i < text.length; i++ ){
			chr = text.charCodeAt( i );
			if( _gworld_char_info[this._charSet][chr]._data != null ){
				// 文字の描画
				top = 0;
				for( yy = this._imgMoveY - _gworld_char_info[this._charSet][chr]._sizeY; ; yy++ ){
					for( xx = 0; xx < _gworld_char_info[this._charSet][chr]._sizeX; xx++ ){
						if( _gworld_char_info[this._charSet][chr]._data.length == top + xx ){
							break;
						}
						if( _gworld_char_info[this._charSet][chr]._data.charAt( top + xx ) == '1' ){
							this.putColor( this._imgMoveX + xx, yy, color );
						}
					}
					if( _gworld_char_info[this._charSet][chr]._data.length == top + xx ){
						break;
					}
					top += _gworld_char_info[this._charSet][chr]._sizeX;
				}

				// 現在点を移動させる
				this._imgMoveX += _gworld_char_info[this._charSet][chr]._width;
			}
		}

		// 現在点の更新に伴う処理
		this._wndMoveX = this.wndPosX( this._imgMoveX );
	},
	drawText : function( text, x, y ){
		this.drawTextColor( text, x, y, this._color );
	},
	drawTextTo : function( text ){
		this.drawTextColor( text, this._imgMoveX, this._imgMoveY, this._color );
	},
	wndDrawTextColor : function( text, x, y, color ){
		// 論理座標から実座標に変換
		var gx = this.imgPosX( x );
		var gy = this.imgPosY( y );

		this.drawTextColor( text, gx, gy, color );
	},
	wndDrawText : function( text, x, y ){
		this.wndDrawTextColor( text, x, y, this._color );
	},
	wndDrawTextTo : function( text ){
		this.wndDrawTextColor( text, this._wndMoveX, this._wndMoveY, this._color );
	},

	imgMoveX : function(){
		return this._imgMoveX;
	},
	imgMoveY : function(){
		return this._imgMoveY;
	},
	wndMoveX : function(){
		return this._wndMoveX;
	},
	wndMoveY : function(){
		return this._wndMoveY;
	},

	// イメージ情報を確認する
	image : function(){
		return this._image;
	},
	offset : function(){
		return this._offset;
	},
	width : function(){
		return this._width;
	},
	height : function(){
		return this._height;
	}

};

//function gWorldClear( gWorld, color ){}
//function gWorldSetColor( gWorld, color ){}
//function gWorldPutColor( gWorld, x, y, color ){}
//function gWorldPut( gWorld, x, y ){}
//function gWorldFill( gWorld, x, y, w, h ){}
//function gWorldLine( gWorld, x1, y1, x2, y2 ){}
