/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Global.h"

// 計算結果保持バッファ
function _GraphAns(){
	this._x  = 0.0;
	this._y1 = 0.0;
	this._y2 = 0.0;
}

_GraphAns.prototype = {
	set : function( src ){
		this._x  = src._x;
		this._y1 = src._y1;
		this._y2 = src._y2;
	}
};

function newGraphAnsArray( len ){
	var a = new Array( len );
	for( var i = 0; i < len; i++ ){
		a[i] = new _GraphAns();
	}
	return a;
}

// グラフ情報
function __GraphInfo(){
	this._draw = true;	// 描画するかどうかのフラグ

	this._color = 0;	// グラフの色

	this._mode = _GRAPH_MODE_RECT;	// グラフの種類

	this._expr1 = new String();	// 計算式
	this._expr2 = new String();	// 計算式
	this._index = 0;			// X座標に対応する変数のインデックス

	this._start = 0.0;
	this._end   = 0.0;
	this._step  = 0.0;

	this._ans = new Array();		// 計算結果保持バッファ
	this._ansNum = new _Integer();	// 計算結果保持バッファのサイズ

	this._baseX    = 0.0;	// 底
	this._baseY    = 0.0;	// 底
	this._logBaseX = 0.0;	// 1.0/log(底)をあらかじめ計算した値
	this._logBaseY = 0.0;	// 1.0/log(底)をあらかじめ計算した値

	// 各種フラグ
	this._isLogScaleX = false;	// 対数座標系かどうかのフラグ
	this._isLogScaleY = false;	// 対数座標系かどうかのフラグ
}

// テキスト描画情報
function __TextInfo(){
	this._width   = 0;
	this._ascent  = 0;
	this._descent = 0;
}

// グラフ描画クラス
function _Graph(){
	this._gWorld = new _GWorld();

	this._info = new Array();
	this._infoNum = 0;
	this._curIndex = 0;

	// グラフ情報1個は常に存在させる
	this.addGraph();
}

_Graph.prototype = {

	gWorld : function(){
		return this._gWorld;
	},

	graphIndex : function(){
		return this._curIndex;
	},

	addGraph : function(){
		this._curIndex = this._infoNum;
		this._infoNum++;

		this._info[this._curIndex] = new __GraphInfo();

		this._info[this._curIndex]._draw = true;

		this._info[this._curIndex]._mode = _GRAPH_MODE_RECT;

		this._info[this._curIndex]._expr1 = "";
		this._info[this._curIndex]._expr2 = "";

		this._info[this._curIndex]._ans = new Array();
		this._info[this._curIndex]._ansNum.set( 0 );

		this.setLogScaleX( 10.0 );
		this.setLogScaleY( 10.0 );

		// 各種フラグ
		this._info[this._curIndex]._isLogScaleX = false;
		this._info[this._curIndex]._isLogScaleY = false;

		return true;
	},

	delGraph : function(){
		this._info[this._curIndex]._expr1 = "";
		this._info[this._curIndex]._expr2 = "";

		// 計算結果保持バッファを解放
		this._info[this._curIndex]._ans = new Array();
		this._info[this._curIndex]._ansNum.set( 0 );

		// 後ろのグラフ情報を前に詰める
		for( var i = this._curIndex + 1; i < this._infoNum; i++ ){
			this._info[i - 1] = this._info[i];
		}

		this._infoNum--;
		if( this._curIndex == this._infoNum ){
			this.selGraph( this._infoNum - 1 );
		}
		if( this._infoNum == 0 ){
			// グラフ情報1個は常に存在させる
			this.addGraph();
		}
	},

	selGraph : function( index ){
		if( (index < 0) || (index >= this._infoNum) ){
			return false;
		}
		this._curIndex = index;
		return true;
	},

	setDrawFlag : function( draw ){
		this._info[this._curIndex]._draw = draw;
	},
	drawFlag : function(){
		return this._info[this._curIndex]._draw;
	},

	// グラフの色を設定する
	setColor : function( color ){
		this._info[this._curIndex]._color = color;
	},

	// グラフの色を確認する
	color : function(){
		return this._info[this._curIndex]._color;
	},

	// グラフの種類を設定する
	setMode : function( mode ){
		this._info[this._curIndex]._mode = mode;
	},

	// グラフの種類を確認する
	mode : function(){
		return this._info[this._curIndex]._mode;
	},

	setExpr : function( expr ){
		// 計算式を取り込む
		this._info[this._curIndex]._expr1 = expr;
		this._info[this._curIndex]._expr2 = "";
	},
	setExpr1 : function( expr1 ){
		// 計算式を取り込む
		this._info[this._curIndex]._expr1 = expr1;
	},
	setExpr2 : function( expr2 ){
		// 計算式を取り込む
		this._info[this._curIndex]._expr2 = expr2;
	},

	// 計算式を確認する
	expr : function(){
		return this._info[this._curIndex]._expr1;
	},
	expr1 : function(){
		return this._info[this._curIndex]._expr1;
	},
	expr2 : function(){
		return this._info[this._curIndex]._expr2;
	},

	setIndex : function( index ){
		// X座標に対応する変数のインデックスを保持
		this._info[this._curIndex]._index = index;
	},

	// X座標に対応する変数のインデックスを確認する
	index : function(){
		return this._info[this._curIndex]._index;
	},

	setStart : function( start ){
		this._info[this._curIndex]._start = start;
	},
	setEnd : function( end ){
		this._info[this._curIndex]._end = end;
	},
	setStep : function( step ){
		this._info[this._curIndex]._step = step;
	},

	//
	start : function(){
		return this._info[this._curIndex]._start;
	},
	end : function(){
		return this._info[this._curIndex]._end;
	},
	step : function(){
		return this._info[this._curIndex]._step;
	},

	// 対数座標系に設定する
	setLogScaleX : function( base ){
		if( base <= 1.0 ){
			this._info[this._curIndex]._isLogScaleX = false;
		} else {
			this._info[this._curIndex]._isLogScaleX = true;
			this._info[this._curIndex]._baseX       = base;
			this._info[this._curIndex]._logBaseX    = 1.0 / Math.log( base );
		}
	},
	setLogScaleY : function( base ){
		if( base <= 1.0 ){
			this._info[this._curIndex]._isLogScaleY = false;
		} else {
			this._info[this._curIndex]._isLogScaleY = true;
			this._info[this._curIndex]._baseY       = base;
			this._info[this._curIndex]._logBaseY    = 1.0 / Math.log( base );
		}
	},

	// 対数座標系かどうか確認する
	isLogScaleX : function(){
		return this._info[this._curIndex]._isLogScaleX;
	},
	isLogScaleY : function(){
		return this._info[this._curIndex]._isLogScaleY;
	},

	// 底を確認する
	logBaseX : function(){
		return this._info[this._curIndex]._baseX;
	},
	logBaseY : function(){
		return this._info[this._curIndex]._baseY;
	},

	logX : function( x ){
		return this._info[this._curIndex]._isLogScaleX ? Math.log( x ) * this._info[this._curIndex]._logBaseX : x;
	},
	logY : function( y ){
		return this._info[this._curIndex]._isLogScaleY ? Math.log( y ) * this._info[this._curIndex]._logBaseY : y;
	},
	expX : function( x ){
		return this._info[this._curIndex]._isLogScaleX ? Math.exp( x / this._info[this._curIndex]._logBaseX ) : x;
	},
	expY : function( y ){
		return this._info[this._curIndex]._isLogScaleY ? Math.exp( y / this._info[this._curIndex]._logBaseY ) : y;
	},

	// 計算結果を消去する
	delAns : function(){
		// 計算結果保持バッファを解放
		this._info[this._curIndex]._ans = new Array();
		this._info[this._curIndex]._ansNum.set( 0 );
	},

	// グラフイメージを確保する
	create : function( width, height ){
		this._gWorld.scroll(
			(width  - this._gWorld.width ()) / 2.0,
			(height - this._gWorld.height()) / 2.0
			);
		return this._gWorld.create( width, height, false );
	},

	// グラフイメージを登録する
	open : function( image/*Array*/, offset, width, height ){
		this._gWorld.scroll(
			(width  - this._gWorld.width ()) / 2.0,
			(height - this._gWorld.height()) / 2.0
			);
		return this._gWorld.open( image, offset, width, height, false );
	},

	// グラフイメージをクリアする
	_drawHLine : function( y ){
		var yy = this._gWorld.imgPosY( y );
		gWorldLine( this._gWorld, 0, yy, this._gWorld.width() - 1, yy );
		this._gWorld._gWorldLine = true;
		for( var i = 0; i < this._gWorld.width(); i++ ){
			this._gWorld.put( i, yy );
		}
		this._gWorld._gWorldLine = false;
	},
	_drawVLine : function( x ){
		var xx = this._gWorld.imgPosX( x );
		gWorldLine( this._gWorld, xx, 0, xx, this._gWorld.height() - 1 );
		this._gWorld._gWorldLine = true;
		for( var i = 0; i < this._gWorld.height(); i++ ){
			this._gWorld.put( xx, i );
		}
		this._gWorld._gWorldLine = false;
	},
	_drawXText : function( x, y ){
		var yy;

		var text = floatToString( x, 15 );
		var tmp = new __TextInfo();
		this._gWorld.getTextInfo( text, tmp );
		var width   = tmp._width;
		var ascent  = tmp._ascent;
		var descent = tmp._descent;

		if( this._gWorld.imgPosY( y ) < 0 ){
			yy = ascent + 1;
		} else if( (this._gWorld.imgPosY( y ) + (ascent + descent + 1)) >= this._gWorld.height() ){
			yy = this._gWorld.height() - descent;
		} else {
			yy = this._gWorld.imgPosY( y ) + ascent + 2;
		}
		this._gWorld.drawText(
			text,
			this._gWorld.imgPosX( x ) + 2,
			yy
			);
	},
	_drawYText : function( x, y ){
		var xx;

		var text = floatToString( y, 15 );
		var tmp = new __TextInfo();
		this._gWorld.getTextInfo( text, tmp );
		var width   = tmp._width;
		var ascent  = tmp._ascent;
		var descent = tmp._descent;

		if( (this._gWorld.imgPosX( x ) - (width + 1)) < 0 ){
			xx = 1;
		} else if( this._gWorld.imgPosX( x ) >= this._gWorld.width() ){
			xx = this._gWorld.width() - width;
		} else {
			xx = this._gWorld.imgPosX( x ) - width;
		}
		this._gWorld.drawText(
			text,
			xx,
			this._gWorld.imgPosY( y ) - descent
			);
	},
	clear : function( backColor, scaleColor, unitColor, unitX, unitY, textColor, textX, textY ){
		var i;
		var tmp;
		var pos, end;

		if( unitX > 0.0 ){
			while( true ){
				tmp = this._gWorld.imgSizX( unitX );
				if( (tmp < 0) || (tmp >= 2) ){
					break;
				}
				unitX *= 10.0;
			}
		}
		if( unitY > 0.0 ){
			while( true ){
				tmp = this._gWorld.imgSizY( unitY );
				if( (tmp < 0) || (tmp >= 2) ){
					break;
				}
				unitY *= 10.0;
			}
		}

		// グラフ画面の背景塗りつぶし
		this._gWorld.clear( backColor );

		var saveColor = this._gWorld.color();
		this._gWorld.setColor( unitColor );

		// 水平方向目盛り線の描画
		if( unitX > 0.0 ){
			pos = this._gWorld.wndPosX( 0 );
			end = this._gWorld.wndPosX( this._gWorld.width() - 1 );
			i = _DIV( pos, unitX );
			if( (this._gWorld.wndPosX( 1 ) - pos) > 0.0 ){
				while( (pos = i * unitX) <= end ){
					this._drawVLine( pos );
					i++;
				}
			} else {
				while( (pos = i * unitX) >= end ){
					this._drawVLine( pos );
					i--;
				}
			}
		}

		// 垂直方向目盛り線の描画
		if( unitY > 0.0 ){
			pos = this._gWorld.wndPosY( 0 );
			end = this._gWorld.wndPosY( this._gWorld.height() - 1 );
			i = _DIV( pos, unitY );
			if( (this._gWorld.wndPosY( 1 ) - pos) > 0.0 ){
				while( (pos = i * unitY) <= end ){
					this._drawHLine( pos );
					i++;
				}
			} else {
				while( (pos = i * unitY) >= end ){
					this._drawHLine( pos );
					i--;
				}
			}
		}

		this._gWorld.setColor( scaleColor );

		// X軸の描画
		this._drawHLine( 0.0 );

		// Y軸の描画
		this._drawVLine( 0.0 );

		this._gWorld.setColor( textColor );

		// 水平方向目盛り文字の描画
		unitX *= textX;
		if( unitX > 0.0 ){
			pos = this._gWorld.wndPosX( 0 );
			end = this._gWorld.wndPosX( this._gWorld.width() - 1 );
			i = _DIV( pos, unitX );
			if( (this._gWorld.wndPosX( 1 ) - pos) > 0.0 ){
				while( (pos = i * unitX) <= end ){
					this._drawXText( pos, 0.0 );
					i++;
				}
			} else {
				while( (pos = i * unitX) >= end ){
					this._drawXText( pos, 0.0 );
					i--;
				}
			}
		}

		// 垂直方向目盛り文字の描画
		unitY *= textY;
		if( unitY > 0.0 ){
			pos = this._gWorld.wndPosY( 0 );
			end = this._gWorld.wndPosY( this._gWorld.height() - 1 );
			i = _DIV( pos, unitY );
			if( (this._gWorld.wndPosY( 1 ) - pos) > 0.0 ){
				while( (pos = i * unitY) <= end ){
					this._drawYText( 0.0, pos );
					i++;
				}
			} else {
				while( (pos = i * unitY) >= end ){
					this._drawYText( 0.0, pos );
					i--;
				}
			}
		}

		this._gWorld.setColor( saveColor );
	},

	// グラフを描画する
	_process : function( proc, param, expr, x, y/*_Float*/ ){
		var ret = false;

		// X座標をセット
		param._var.set( this._info[this._curIndex]._index, x, false );

		// Y座標を計算する
		var saveAnsFlag = proc.ansFlag();
		proc.setAnsFlag( false );
		if( proc.processLoop( expr, param ) == _CLIP_PROC_END ){
			// Y座標をセット
			if( param.val( 0 ).imag() == 0.0 ){
				y.set( param.val( 0 ).toFloat() );
			} else {
				y.set( NaN );
			}
			ret = true;
		}
		proc.setAnsFlag( saveAnsFlag );

		return ret;
	},
	_drawLine : function( x1, y1, x2, y2 ){
		var xx1 = new _Integer( x1 );
		var yy1 = new _Integer( y1 );
		var xx2 = new _Integer( x2 );
		var yy2 = new _Integer( y2 );
		if( this._gWorld.clipLine( xx1, yy1, xx2, yy2 ) == 1 ){
			this._gWorld.drawLine( xx1.val(), yy1.val(), xx2.val(), yy2.val() );
			return true;
		}
		return false;
	},
	_plot : function( proc, param, start, end, ans/*Array*/, ansNum/*_Integer*/, startAns, startIndex ){
		var i;
		var drawFlag = false;
		var posX, posY;
		var oldX, oldY;
		var yy = new _Float();

		if( start > end ){
			var tmp = start; start = end; end = tmp;
		}
		ansNum.set( end - start + 1 );
		if( ansNum.val() <= 0 ){
			ansNum.set( 0 );
		} else {
			var saveFlag = param._fileFlag;
			param._fileFlag = false;

			// 計算結果保持バッファを確保
			for( i = 0; i < ansNum.val(); i++ ){
				ans[i] = new _GraphAns();
			}

			this._gWorld.setColor( this._info[this._curIndex]._color );

			if( startIndex > 0 ){
				drawFlag = true;
				posX = this._gWorld.imgPosX( this.logX( startAns[startIndex]._x  ) );
				posY = this._gWorld.imgPosY( this.logY( startAns[startIndex]._y1 ) );
			}
			for( i = 0; i < ansNum.val(); i++ ){
				ans[i]._x = this.expX( this._gWorld.wndPosX( start + i ) );
				if( this._process( proc, param, this._info[this._curIndex]._expr1, ans[i]._x, yy ) ){
					ans[i]._y1 = yy.val();
					var tmp = this.logY( ans[i]._y1 );
					if( _ISINF( tmp ) || _ISNAN( tmp ) ){
						drawFlag = false;
					} else {
						// 計算結果をプロット
						if( drawFlag ){
							oldX = posX;
							oldY = posY;
							posX = this._gWorld.imgPosX( this.logX( ans[i]._x  ) );
							posY = this._gWorld.imgPosY( this.logY( ans[i]._y1 ) );
							this._drawLine( oldX, oldY, posX, posY );
						} else {
							drawFlag = true;
							posX = this._gWorld.imgPosX( this.logX( ans[i]._x  ) );
							posY = this._gWorld.imgPosY( this.logY( ans[i]._y1 ) );
						}
					}
				} else {
					ansNum.set( i );
					break;
				}
			}
			if( startIndex == 0 ){
				if( drawFlag ){
					oldX = posX;
					oldY = posY;
					posX = this._gWorld.imgPosX( this.logX( startAns[startIndex]._x  ) );
					posY = this._gWorld.imgPosY( this.logY( startAns[startIndex]._y1 ) );
					this._drawLine( oldX, oldY, posX, posY );
				}
			}

			param._fileFlag = saveFlag;
		}
	},
	_plotStep : function( proc, param, start, end, step, ans/*Array*/, ansNum/*_Integer*/, startAns, startIndex ){
		var i;
		var drawFlag = false;
		var posX, posY;
		var oldX, oldY;
		var yy = new _Float();

		if( start > end ){
			var tmp = start; start = end; end = tmp;
		}
		if( step < 0.0 ){
			step = -step;
		}
		if( step == 0.0 ){
			ansNum.set( 0 );
		} else {
			ansNum.set( _INT( (end - start) / step ) + 1 );
		}
		if( ansNum.val() <= 0 ){
			ansNum.set( 0 );
		} else {
			var saveFlag = param._fileFlag;
			param._fileFlag = false;

			// 計算結果保持バッファを確保
			for( i = 0; i < ansNum.val(); i++ ){
				ans[i] = new _GraphAns();
			}

			this._gWorld.setColor( this._info[this._curIndex]._color );

			switch( this._info[this._curIndex]._mode ){
			case _GRAPH_MODE_PARAM:
				if( startIndex > 0 ){
					drawFlag = true;
					posX = this._gWorld.imgPosX( startAns[startIndex]._y1 );
					posY = this._gWorld.imgPosY( startAns[startIndex]._y2 );
				}
				for( i = 0; i < ansNum.val(); i++ ){
					ans[i]._x = start + step * i;
					if( this._process( proc, param, this._info[this._curIndex]._expr1, ans[i]._x, yy ) ){
						ans[i]._y1 = yy.val();
						if( this._process( proc, param, this._info[this._curIndex]._expr2, ans[i]._x, yy ) ){
							ans[i]._y2 = yy.val();
							// 計算結果をプロット
							if( drawFlag ){
								oldX = posX;
								oldY = posY;
								posX = this._gWorld.imgPosX( ans[i]._y1 );
								posY = this._gWorld.imgPosY( ans[i]._y2 );
								this._drawLine( oldX, oldY, posX, posY );
							} else {
								drawFlag = true;
								posX = this._gWorld.imgPosX( ans[i]._y1 );
								posY = this._gWorld.imgPosY( ans[i]._y2 );
							}
						} else {
							ansNum.set( i );
							break;
						}
					} else {
						ansNum.set( i );
						break;
					}
				}
				if( startIndex == 0 ){
					if( drawFlag ){
						oldX = posX;
						oldY = posY;
						posX = this._gWorld.imgPosX( startAns[startIndex]._y1 );
						posY = this._gWorld.imgPosY( startAns[startIndex]._y2 );
						this._drawLine( oldX, oldY, posX, posY );
					}
				}
				break;
			case _GRAPH_MODE_POLAR:
				if( startIndex > 0 ){
					drawFlag = true;
					posX = this._gWorld.imgPosX( startAns[startIndex]._y1 * fcos( startAns[startIndex]._x ) );
					posY = this._gWorld.imgPosY( startAns[startIndex]._y1 * fsin( startAns[startIndex]._x ) );
				}
				for( i = 0; i < ansNum.val(); i++ ){
					ans[i]._x = start + step * i;
					if( this._process( proc, param, this._info[this._curIndex]._expr1, ans[i]._x, yy ) ){
						ans[i]._y1 = yy.val();
						var tmp = ans[i]._y1;
						if( _ISINF( tmp ) || _ISNAN( tmp ) ){
							drawFlag = false;
						} else {
							// 計算結果をプロット
							if( drawFlag ){
								oldX = posX;
								oldY = posY;
								posX = this._gWorld.imgPosX( ans[i]._y1 * fcos( ans[i]._x ) );
								posY = this._gWorld.imgPosY( ans[i]._y1 * fsin( ans[i]._x ) );
								this._drawLine( oldX, oldY, posX, posY );
							} else {
								drawFlag = true;
								posX = this._gWorld.imgPosX( ans[i]._y1 * fcos( ans[i]._x ) );
								posY = this._gWorld.imgPosY( ans[i]._y1 * fsin( ans[i]._x ) );
							}
						}
					} else {
						ansNum.set( i );
						break;
					}
				}
				if( startIndex == 0 ){
					if( drawFlag ){
						oldX = posX;
						oldY = posY;
						posX = this._gWorld.imgPosX( startAns[startIndex]._y1 * fcos( startAns[startIndex]._x ) );
						posY = this._gWorld.imgPosY( startAns[startIndex]._y1 * fsin( startAns[startIndex]._x ) );
						this._drawLine( oldX, oldY, posX, posY );
					}
				}
				break;
			}

			param._fileFlag = saveFlag;
		}
	},
	plot : function( proc, param ){
		// 計算結果保持バッファを解放
		this.delAns();

		switch( this._info[this._curIndex]._mode ){
		case _GRAPH_MODE_RECT:
			this._plot(
				proc, param,
				this._gWorld.imgPosX( this._info[this._curIndex]._start ),
				this._gWorld.imgPosX( this._info[this._curIndex]._end   ),
				this._info[this._curIndex]._ans, this._info[this._curIndex]._ansNum,
				null, -1
				);
			break;
		case _GRAPH_MODE_PARAM:
		case _GRAPH_MODE_POLAR:
			this._plotStep(
				proc, param,
				this._info[this._curIndex]._start,
				this._info[this._curIndex]._end,
				this._info[this._curIndex]._step,
				this._info[this._curIndex]._ans, this._info[this._curIndex]._ansNum,
				null, -1
				);
			break;
		}

		return (this._info[this._curIndex]._ansNum.val() != 0);
	},
	_plotPos : function( proc, param, pos ){
		var i;
		var start, end, step;
		var beforeFlag;
		var tmpAns = new Array();
		var tmpAnsNum = new _Integer();

		if( this._info[this._curIndex]._ansNum.val() <= 0 ){
			return false;
		}

		switch( this._info[this._curIndex]._mode ){
		case _GRAPH_MODE_RECT:
			// 既存データの前・後どちらに追加するのかを調べる
			if( this._info[this._curIndex]._ans[0]._x < this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum.val() - 1]._x ){
				if( pos < this.logX( this._info[this._curIndex]._ans[0]._x ) ){
					start = this._gWorld.imgPosX( pos );
					end   = this._gWorld.imgPosX( this.logX( this._info[this._curIndex]._ans[0]._x ) ) - 1;
					beforeFlag = true;
				} else if( pos > this.logX( this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum.val() - 1]._x ) ){
					start = this._gWorld.imgPosX( this.logX( this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum.val() - 1]._x ) ) + 1;
					end   = this._gWorld.imgPosX( pos );
					beforeFlag = false;
				} else {
					return false;
				}
			} else {
				if( pos > this.logX( this._info[this._curIndex]._ans[0]._x ) ){
					start = this._gWorld.imgPosX( pos );
					end   = this._gWorld.imgPosX( this.logX( this._info[this._curIndex]._ans[0]._x ) ) - 1;
					beforeFlag = true;
				} else if( pos < this.logX( this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum.val() - 1]._x ) ){
					start = this._gWorld.imgPosX( this.logX( this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum.val() - 1]._x ) ) + 1;
					end   = this._gWorld.imgPosX( pos );
					beforeFlag = false;
				} else {
					return false;
				}
			}

			this._plot(
				proc, param,
				start, end,
				tmpAns, tmpAnsNum,
				this._info[this._curIndex]._ans, beforeFlag ? 0 : this._info[this._curIndex]._ansNum.val() - 1
				);

			break;
		case _GRAPH_MODE_PARAM:
		case _GRAPH_MODE_POLAR:
			step = this._info[this._curIndex]._step;

			// 既存データの前・後どちらに追加するのかを調べる
			if( step < 0.0 ){
				step = -step;
			}
			if( this._info[this._curIndex]._ans[0]._x < this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum.val() - 1]._x ){
				if( pos < this._info[this._curIndex]._ans[0]._x ){
					start = pos;
					end   = this._info[this._curIndex]._ans[0]._x - step;
					beforeFlag = true;
				} else if( pos > this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum.val() - 1]._x ){
					start = this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum.val() - 1]._x + step;
					end   = pos;
					beforeFlag = false;
				} else {
					return false;
				}
			} else {
				if( pos > this._info[this._curIndex]._ans[0]._x ){
					start = pos;
					end   = this._info[this._curIndex]._ans[0]._x - step;
					beforeFlag = true;
				} else if( pos < this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum.val() - 1]._x ){
					start = this._info[this._curIndex]._ans[this._info[this._curIndex]._ansNum.val() - 1]._x + step;
					end   = pos;
					beforeFlag = false;
				} else {
					return false;
				}
			}

			this._plotStep(
				proc, param,
				start, end, step,
				tmpAns, tmpAnsNum,
				this._info[this._curIndex]._ans, beforeFlag ? 0 : this._info[this._curIndex]._ansNum.val() - 1
				);

			break;
		}

		if( tmpAnsNum == 0 ){
			return false;
		}

		var newAnsNum = this._info[this._curIndex]._ansNum.val() + tmpAnsNum.val();
		var newAns    = newGraphAnsArray( newAnsNum );
		if( beforeFlag ){
			// 既存データの前に追加
			for( i = 0; i < tmpAnsNum.val(); i++ ){
				newAns[i].set( tmpAns[i] );
			}
			for( ; i < newAnsNum; i++ ){
				newAns[i].set( this._info[this._curIndex]._ans[i - tmpAnsNum.val()] );
			}
		} else {
			// 既存データの後ろに追加
			for( i = 0; i < this._info[this._curIndex]._ansNum.val(); i++ ){
				newAns[i].set( this._info[this._curIndex]._ans[i] );
			}
			for( ; i < newAnsNum; i++ ){
				newAns[i].set( tmpAns[i - this._info[this._curIndex]._ansNum.val()] );
			}
		}

		this._info[this._curIndex]._ans = newAns;
		this._info[this._curIndex]._ansNum.set( newAnsNum );

		return true;
	},
	_rePlot : function(){
		var i;
		var drawFlag = false;
		var posX, posY;
		var oldX, oldY;

		this._gWorld.setColor( this._info[this._curIndex]._color );

		if( this._info[this._curIndex]._ansNum.val() > 0 ){
			switch( this._info[this._curIndex]._mode ){
			case _GRAPH_MODE_RECT:
				for( i = 0; i < this._info[this._curIndex]._ansNum.val(); i++ ){
					var tmp = this.logY( this._info[this._curIndex]._ans[i]._y1 );
					if( _ISINF( tmp ) || _ISNAN( tmp ) ){
						drawFlag = false;
					} else {
						// 計算結果をプロット
						if( drawFlag ){
							oldX = posX;
							oldY = posY;
							posX = this._gWorld.imgPosX( this.logX( this._info[this._curIndex]._ans[i]._x  ) );
							posY = this._gWorld.imgPosY( this.logY( this._info[this._curIndex]._ans[i]._y1 ) );
							this._drawLine( oldX, oldY, posX, posY );
						} else {
							drawFlag = true;
							posX = this._gWorld.imgPosX( this.logX( this._info[this._curIndex]._ans[i]._x  ) );
							posY = this._gWorld.imgPosY( this.logY( this._info[this._curIndex]._ans[i]._y1 ) );
						}
					}
				}
				break;
			case _GRAPH_MODE_PARAM:
				for( i = 0; i < this._info[this._curIndex]._ansNum.val(); i++ ){
					// 計算結果をプロット
					if( drawFlag ){
						oldX = posX;
						oldY = posY;
						posX = this._gWorld.imgPosX( this._info[this._curIndex]._ans[i]._y1 );
						posY = this._gWorld.imgPosY( this._info[this._curIndex]._ans[i]._y2 );
						this._drawLine( oldX, oldY, posX, posY );
					} else {
						drawFlag = true;
						posX = this._gWorld.imgPosX( this._info[this._curIndex]._ans[i]._y1 );
						posY = this._gWorld.imgPosY( this._info[this._curIndex]._ans[i]._y2 );
					}
				}
				break;
			case _GRAPH_MODE_POLAR:
				for( i = 0; i < this._info[this._curIndex]._ansNum.val(); i++ ){
					var tmp = this._info[this._curIndex]._ans[i]._y1;
					if( _ISINF( tmp ) || _ISNAN( tmp ) ){
						drawFlag = false;
					} else {
						// 計算結果をプロット
						if( drawFlag ){
							oldX = posX;
							oldY = posY;
							posX = this._gWorld.imgPosX( this._info[this._curIndex]._ans[i]._y1 * fcos( this._info[this._curIndex]._ans[i]._x ) );
							posY = this._gWorld.imgPosY( this._info[this._curIndex]._ans[i]._y1 * fsin( this._info[this._curIndex]._ans[i]._x ) );
							this._drawLine( oldX, oldY, posX, posY );
						} else {
							drawFlag = true;
							posX = this._gWorld.imgPosX( this._info[this._curIndex]._ans[i]._y1 * fcos( this._info[this._curIndex]._ans[i]._x ) );
							posY = this._gWorld.imgPosY( this._info[this._curIndex]._ans[i]._y1 * fsin( this._info[this._curIndex]._ans[i]._x ) );
						}
					}
				}
				break;
			}
			return true;
		}
		return false;
	},
	rePlot : function( proc, param ){
		if( proc == undefined ){
			return this._rePlot();
		} else if( this._info[this._curIndex]._ansNum.val() <= 0 ){
			return this.plot( proc, param );
		} else {
			var ret = new Array( 3 );
			ret[0] = this._rePlot();
			ret[1] = this._plotPos( proc, param, this._info[this._curIndex]._start );
			ret[2] = this._plotPos( proc, param, this._info[this._curIndex]._end   );
			return ret[0] || ret[1] || ret[2];
		}
	},

	// 目印を描画する
	mark : function( x, y1, y2 ){
		var i;
		var posX, posY;

		switch( this._info[this._curIndex]._mode ){
		case _GRAPH_MODE_RECT:
			// 垂直方向の線の描画
			posX = this._gWorld.imgPosX( this.logX( x ) );
			for( i = 0; i < this._gWorld.height(); i++ ){
				this._gWorld.putXOR( posX, i );
			}

			// 水平方向の線の描画
			posY = this._gWorld.imgPosY( this.logY( y1 ) );
			for( i = 0; i < this._gWorld.width(); i++ ){
				this._gWorld.putXOR( i, posY );
			}

			break;
		case _GRAPH_MODE_PARAM:
			// 垂直方向の線の描画
			posX = this._gWorld.imgPosX( y1 );
			for( i = 0; i < this._gWorld.height(); i++ ){
				this._gWorld.putXOR( posX, i );
			}

			// 水平方向の線の描画
			posY = this._gWorld.imgPosY( y2 );
			for( i = 0; i < this._gWorld.width(); i++ ){
				this._gWorld.putXOR( i, posY );
			}

			break;
		case _GRAPH_MODE_POLAR:
			// 垂直方向の線の描画
			posX = this._gWorld.imgPosX( y1 * fcos( x ) );
			for( i = 0; i < this._gWorld.height(); i++ ){
				this._gWorld.putXOR( posX, i );
			}

			// 水平方向の線の描画
			posY = this._gWorld.imgPosY( y1 * fsin( x ) );
			for( i = 0; i < this._gWorld.width(); i++ ){
				this._gWorld.putXOR( i, posY );
			}

			break;
		}
	},
	markRect : function( sx, sy, ex, ey ){
		var i;
		var tmp;

		var posX = this._gWorld.imgPosX( sx );
		var posY = this._gWorld.imgPosY( sy );
		var endX = this._gWorld.imgPosX( ex );
		var endY = this._gWorld.imgPosY( ey );
		if( posX > endX ){
			tmp = posX; posX = endX; endX = tmp;
		}
		if( posY > endY ){
			tmp = posY; posY = endY; endY = tmp;
		}

		for( i = posX; i <= endX; i++ ){
			this._gWorld.putXOR( i, posY );
			this._gWorld.putXOR( i, endY );
		}
		for( i = posY + 1; i < endY; i++ ){
			this._gWorld.putXOR( posX, i );
			this._gWorld.putXOR( endX, i );
		}
	},

	// 計算結果を確認する
	_search : function( x, ratio/*_Float*/ ){
		var i;

		if( this._info[this._curIndex]._ansNum.val() > 0 ){
			var num = this._info[this._curIndex]._ansNum.val() - 1;
			if( this._info[this._curIndex]._ans[0]._x < this._info[this._curIndex]._ans[1]._x ){
				if( x < this._info[this._curIndex]._ans[0]._x ){
					return -1;
				} else if( x > this._info[this._curIndex]._ans[num]._x ){
					return this._info[this._curIndex]._ansNum.val();
				} else if( x == this._info[this._curIndex]._ans[num]._x ){
					ratio.set( 0.0 );
					return num;
				}
				for( i = 1; i <= num; i++ ){
					if( (x >= this._info[this._curIndex]._ans[i - 1]._x) && (x < this._info[this._curIndex]._ans[i]._x) ){
						ratio.set( (x - this._info[this._curIndex]._ans[i - 1]._x) / (this._info[this._curIndex]._ans[i]._x - this._info[this._curIndex]._ans[i - 1]._x) );
						return i - 1;
					}
				}
			} else {
				if( x > this._info[this._curIndex]._ans[0]._x ){
					return -1;
				} else if( x < this._info[this._curIndex]._ans[num]._x ){
					return this._info[this._curIndex]._ansNum.val();
				} else if( x == this._info[this._curIndex]._ans[num]._x ){
					ratio.set( 0.0 );
					return num;
				}
				for( i = 1; i <= num; i++ ){
					if( (x <= this._info[this._curIndex]._ans[i - 1]._x) && (x > this._info[this._curIndex]._ans[i]._x) ){
						ratio.set( (x - this._info[this._curIndex]._ans[i - 1]._x) / (this._info[this._curIndex]._ans[i]._x - this._info[this._curIndex]._ans[i - 1]._x) );
						return i - 1;
					}
				}
			}
		}
		return -2;
	},
	_dist : function( x1, y1, x2, y2 ){
		if( _ISINF( x2 ) || _ISNAN( x2 ) || _ISINF( y2 ) || _ISNAN( y2 ) ){
			return -1.0;
		}
		return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
	},
	_searchParam : function( x, y ){
		var i;
		var tmp;

		if( this._info[this._curIndex]._ansNum.val() > 0 ){
			// 最も距離の短いデータを検索する
			var num  = 0;
			var dist = this._dist( x, y, this._info[this._curIndex]._ans[0]._y1, this._info[this._curIndex]._ans[0]._y2 );
			for( i = 1; i < this._info[this._curIndex]._ansNum.val(); i++ ){
				tmp = this._dist( x, y, this._info[this._curIndex]._ans[i]._y1, this._info[this._curIndex]._ans[i]._y2 );
				if( (tmp >= 0.0) && ((dist < 0.0) || (tmp < dist)) ){
					num  = i;
					dist = tmp;
				}
			}

			return num;
		}
		return -2;
	},
	_searchPolar : function( x, y, ratio/*_Float*/ ){
		var tmp;

		if( this._info[this._curIndex]._ansNum.val() > 0 ){
			// 最も距離の短いデータを検索する
			var num  = 0;
			var dist = this._dist(
				x, y,
				this._info[this._curIndex]._ans[0]._y1 * fcos( this._info[this._curIndex]._ans[0]._x ),
				this._info[this._curIndex]._ans[0]._y1 * fsin( this._info[this._curIndex]._ans[0]._x )
				);
			for( var i = 1; i < this._info[this._curIndex]._ansNum.val(); i++ ){
				tmp = this._dist(
					x, y,
					this._info[this._curIndex]._ans[i]._y1 * fcos( this._info[this._curIndex]._ans[i]._x ),
					this._info[this._curIndex]._ans[i]._y1 * fsin( this._info[this._curIndex]._ans[i]._x )
					);
				if( (tmp >= 0.0) && ((dist < 0.0) || (tmp < dist)) ){
					num  = i;
					dist = tmp;
				}
			}

//			var c = new _Complex();
//			c.ass( 360.0 );
//			c.angToAng( _ANG_TYPE_DEG, complexAngType() );
//			var t1 = fatan2( y, x );
//				:

//			ratio.set( Math.abs( (t1 - t2) / (t3 - t2) ) );
			ratio.set( 0.0 );
			return num;
		}
		return -2;
	},
	getAns : function( x, y, ans/*_GraphAns*/ ){
		var num;
		var ratio = new _Float();

		switch( this._info[this._curIndex]._mode ){
		case _GRAPH_MODE_RECT:
			ans._x = this.expX( this._gWorld.wndPosX( x ) );
			if( (num = this._search( ans._x, ratio )) < -1 ){
				return false;
			}
			if( num == -1 ){
				return false;
			} else if( num == this._info[this._curIndex]._ansNum.val() ){
				return false;
			} else if( ratio.val() == 0.0 ){
				ans._y1 = this._info[this._curIndex]._ans[num]._y1;
				ans._y2 = this._info[this._curIndex]._ans[num]._y2;
			} else {
				ans._y1 = this._info[this._curIndex]._ans[num]._y1 + (this._info[this._curIndex]._ans[num + 1]._y1 - this._info[this._curIndex]._ans[num]._y1) * ratio.val();
				ans._y2 = this._info[this._curIndex]._ans[num]._y2 + (this._info[this._curIndex]._ans[num + 1]._y2 - this._info[this._curIndex]._ans[num]._y2) * ratio.val();
			}
			break;
		case _GRAPH_MODE_PARAM:
			if( (num = this._searchParam( this._gWorld.wndPosX( x ), this._gWorld.wndPosY( y ) )) < -1 ){
				return false;
			}
			if( num == -1 ){
				return false;
			} else if( num == this._info[this._curIndex]._ansNum.val() ){
				return false;
			} else {
				ans._x  = this._info[this._curIndex]._ans[num]._x ;
				ans._y1 = this._info[this._curIndex]._ans[num]._y1;
				ans._y2 = this._info[this._curIndex]._ans[num]._y2;
			}
			break;
		case _GRAPH_MODE_POLAR:
			if( (num = this._searchPolar( this._gWorld.wndPosX( x ), this._gWorld.wndPosY( y ), ratio )) < -1 ){
				return false;
			}
			if( num == -1 ){
				return false;
			} else if( num == this._info[this._curIndex]._ansNum.val() ){
				return false;
			} else if( ratio.val() == 0.0 ){
				ans._x  = this._info[this._curIndex]._ans[num]._x ;
				ans._y1 = this._info[this._curIndex]._ans[num]._y1;
			} else {
				ans._x  = this._info[this._curIndex]._ans[num]._x  + (this._info[this._curIndex]._ans[num + 1]._x  - this._info[this._curIndex]._ans[num]._x ) * ratio.val();
				ans._y1 = this._info[this._curIndex]._ans[num]._y1 + (this._info[this._curIndex]._ans[num + 1]._y1 - this._info[this._curIndex]._ans[num]._y1) * ratio.val();
			}
			break;
		}

		return true;
	},
	get : function( proc, param, x, y1/*_Float*/, y2/*_Float*/ ){
		var i;
		var num;
		var ratio = new _Float();
		var tmp;

		if( (num = this._search( x, ratio )) < -1 ){
			return false;
		}
		if( num == -1 ){
			if( !this._process( proc, param, this._info[this._curIndex]._expr1, x, y1 ) ){
				return false;
			}
			if( this._info[this._curIndex]._mode == _GRAPH_MODE_PARAM ){
				if( !this._process( proc, param, this._info[this._curIndex]._expr2, x, y2 ) ){
					return false;
				}
			}

			// 既存のデータをコピー
			tmp = newGraphAnsArray( this._info[this._curIndex]._ansNum.val() + 1 );
			for( i = 0; i < this._info[this._curIndex]._ansNum.val(); i++ ){
				tmp[i + 1].set( this._info[this._curIndex]._ans[i] );
			}

			num = 0;
		} else if( num == this._info[this._curIndex]._ansNum.val() ){
			if( !this._process( proc, param, this._info[this._curIndex]._expr1, x, y1 ) ){
				return false;
			}
			if( this._info[this._curIndex]._mode == _GRAPH_MODE_PARAM ){
				if( !this._process( proc, param, this._info[this._curIndex]._expr2, x, y2 ) ){
					return false;
				}
			}

			// 既存のデータをコピー
			tmp = newGraphAnsArray( this._info[this._curIndex]._ansNum.val() + 1 );
			for( i = 0; i < this._info[this._curIndex]._ansNum.val(); i++ ){
				tmp[i].set( this._info[this._curIndex]._ans[i] );
			}

			num = this._info[this._curIndex]._ansNum.val();
		} else if( ratio.val() == 0.0 ){
			y1.set( this._info[this._curIndex]._ans[num]._y1 );
			y2.set( this._info[this._curIndex]._ans[num]._y2 );
			return true;
		} else {
			if( !this._process( proc, param, this._info[this._curIndex]._expr1, x, y1 ) ){
				return false;
			}
			if( this._info[this._curIndex]._mode == _GRAPH_MODE_PARAM ){
				if( !this._process( proc, param, this._info[this._curIndex]._expr2, x, y2 ) ){
					return false;
				}
			}

			// 既存のデータをコピー
			tmp = newGraphAnsArray( this._info[this._curIndex]._ansNum.val() + 1 );
			for( i = 0; i <= num; i++ ){
				tmp[i].set( this._info[this._curIndex]._ans[i] );
			}
			for( ; i < this._info[this._curIndex]._ansNum.val(); i++ ){
				tmp[i + 1].set( this._info[this._curIndex]._ans[i] );
			}

			num++;
		}

		// 新規データをセット
		tmp[num]._x  = x;
		tmp[num]._y1 = y1.val();
		tmp[num]._y2 = y2.val();
		this._info[this._curIndex]._ansNum.set( this._info[this._curIndex]._ansNum.val() + 1 );
		this._info[this._curIndex]._ans = tmp;

		return true;
	}

};
