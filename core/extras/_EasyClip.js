/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

var _cur_clip;
function setClip( clip ){
	_cur_clip = clip;
}
function curClip(){
	return _cur_clip;
}
function curCanvas(){
	return _cur_clip._canvas;
}

function _EasyClip(){
	if( window.loopMax == undefined ) window.loopMax = 65536;
	if( window.arrayTokenStringSpace == undefined ) window.arrayTokenStringSpace = "&nbsp;";
	if( window.arrayTokenStringBreak == undefined ) window.arrayTokenStringBreak = "<br>";
	if( window.mainProc == undefined ){
		window.mainProc = function( parentProc, parentParam, func, funcParam, childProc, childParam ){
			var ret = childProc.mainLoop( func, childParam, funcParam, parentParam );
			resetProcLoopCount();
			return ret;
		};
	}
	if( window.doFuncGColor == undefined ){
		window.doFuncGColor = function( rgb ){
			return doFuncGColorBGR( rgb, curClip()._palette );
		};
	}
	if( window.doFuncGColor24 == undefined ){
		window.doFuncGColor24 = function( index ){
			return _RGB2BGR( curClip()._palette[index] );
		};
	}
	if( window.doFuncEval == undefined ){
		window.doFuncEval = function( parentProc, childProc, childParam, string, value ){
			return parentProc.doFuncEval( childProc, childParam, string, value );
		};
	}
	if( window.doCommandGColor == undefined ){
		window.doCommandGColor = function( index, rgb ){
			curClip()._palette[index] = _RGB2BGR( rgb );
		};
	}
	if( window.doCommandGPut24 == undefined ){
		window.doCommandGPut24 = function( x, y, rgb ){
			curClip()._canvas.setColorRGB( rgb );
			curClip()._canvas.put( x, y );
		};
	}
	if( window.doCommandGPut24End == undefined ){
		window.doCommandGPut24End = function(){
			// キャンバスの現在色を戻す
			curClip()._canvas.setColorBGR( curClip()._palette[procGWorld()._color] );
		};
	}
	if( window.doCommandGGet24Begin == undefined ){
		window.doCommandGGet24Begin = function( w/*_Integer*/, h/*_Integer*/ ){
			var width  = procGWorld()._width;
			var height = procGWorld()._height;
			if( (width > 0) && (height > 0) ){
				w.set( width  );
				h.set( height );
				return curClip()._canvas.imageData( width, height ).data;
			}
			return null;
		};
	}
	if( window.doCommandPlot == undefined ){
		window.doCommandPlot = function( parentProc, parentParam, graph, start, end, step ){
			// 親プロセスの環境を受け継いで、子プロセスを実行する
			var childProc = new _Proc( parentParam._mode, parentParam._mpPrec, parentParam._mpRound, parentProc._printAssert, parentProc._printWarn, false/*グラフィック画面更新OFF*/ );
			var childParam = new _Param( parentProc._curLine._num, parentParam, true );
			childParam._enableCommand = false;
			childParam._enableStat = false;
			parentProc.doCommandPlot( childProc, childParam, graph, start, end, step );
			childParam.end();
			childProc.end();
		};
	}
	if( window.doCommandRePlot == undefined ){
		window.doCommandRePlot = function( parentProc, parentParam, graph, start, end, step ){
			// 親プロセスの環境を受け継いで、子プロセスを実行する
			var childProc = new _Proc( parentParam._mode, parentParam._mpPrec, parentParam._mpRound, parentProc._printAssert, parentProc._printWarn, false/*グラフィック画面更新OFF*/ );
			var childParam = new _Param( parentProc._curLine._num, parentParam, true );
			childParam._enableCommand = false;
			childParam._enableStat = false;
			parentProc.doCommandRePlot( childProc, childParam, graph, start, end, step );
			childParam.end();
			childProc.end();
		};
	}
	defGWorldFunction();
	defProcFunction();

	// 定義定数の値
	setDefineValue();

	// 多倍長演算サポート
	newProcMultiPrec();

	// 計算処理メイン・クラスを生成する
	this._procEnv = new _ProcEnv();
	setProcEnv( this._procEnv );
	this._proc = new _Proc( _PROC_DEF_PARENT_MODE, _PROC_DEF_PARENT_MP_PREC, _PROC_DEF_PARENT_MP_ROUND, _PROC_DEF_PRINT_ASSERT, _PROC_DEF_PRINT_WARN, false/*_PROC_DEF_GUPDATE_FLAG*/ );
	this._proc._printAns = false;
	setProcWarnFlowFlag( true );
	setProcTraceFlag( false );
	setProcLoopMax( loopMax );

	// 計算パラメータ・クラスを生成する
	this._param = new _Param();
	this._param._enableCommand = true;
	this._param._enableOpPow = false;
	this._param._enableStat = true;
	setGlobalParam( this._param );

	// 乱数を初期化する
	srand( time() );
	rand();

	// カラー・パレット
	this._palette = null;

	// キャンバス
	this._canvasEnv = null;
	this._canvas = null;
}

_EasyClip.prototype = {

	_setEnv : function(){
		setClip( this );
		setProcEnv( this._procEnv );
		if( this._canvasEnv != null ){
			setCanvasEnv( this._canvasEnv );
		}
	},

	proc : function(){
		this._setEnv();
		return this._proc;
	},
	param : function(){
		this._setEnv();
		return this._param;
	},
	canvas : function(){
		this._setEnv();
		return this._canvas;
	},
	gWorld : function(){
		this._setEnv();
		return procGWorld();
	},

	// 変数・配列に値を設定する
	setValue : function( chr, value ){
		this._setEnv();
		this._param.setVal( _CHAR( chr ), value, false );
		return this;
	},
	setComplex : function( chr, real, imag ){
		this._setEnv();
		var index = _CHAR( chr );
		this._param.setReal( index, real, false );
		this._param.setImag( index, imag, false );
		return this;
	},
	setFract : function( chr, num, denom ){
		this._setEnv();
		var index = _CHAR( chr );
		var isMinus = ((num < 0) && (denom >= 0)) || ((num >= 0) && (denom < 0));
		this._param.fractSetMinus( index, isMinus      , false );
		this._param.setNum       ( index, _ABS( num   ), false );
		this._param.setDenom     ( index, _ABS( denom ), false );
		this._param.fractReduce  ( index, false );
		return this;
	},
	setVector : function( chr, value/*Array*/ ){
		this._setEnv();
		this._param._array.setVector( _CHAR( chr ), value, value.length );
		return this;
	},
	setComplexVector : function( chr, real/*Array*/, imag/*Array*/ ){
		this._setEnv();
		this._param._array.setComplexVector( _CHAR( chr ), real, imag, (real.length < imag.length) ? real.length : imag.length );
		return this;
	},
	setFractVector : function( chr, value/*Array*/, denom/*Array*/ ){
		this._setEnv();
		this._param._array.setFractVector( _CHAR( chr ), value, denom, (value.length < denom.length) ? value.length : denom.length );
		return this;
	},
	setMatrix : function( chr, value/*Array or _Matrix*/ ){
		this._setEnv();
		if( !(value instanceof _Matrix) ){
			value = arrayToMatrix( value );
		}
		this._param._array.setMatrix( _CHAR( chr ), value, false );
		return this;
	},
	setComplexMatrix : function( chr, real/*Array*/, imag/*Array*/ ){
		this._setEnv();
		this._param._array.setComplexMatrix( _CHAR( chr ), arrayToMatrix( real ), arrayToMatrix( imag ), false );
		return this;
	},
	setFractMatrix : function( chr, value/*Array*/, denom/*Array*/ ){
		this._setEnv();
		this._param._array.setFractMatrix( _CHAR( chr ), arrayToMatrix( value ), arrayToMatrix( denom ), false );
		return this;
	},
	setArrayValue : function( chr, subIndex/*Array*/, value ){
		this._setEnv();
		for( var i = 0; i < subIndex.length; i++ ){
			subIndex[i] -= this._param._base;
		}
		subIndex[subIndex.length] = -1;
		this._param._array.set( _CHAR( chr ), subIndex, subIndex.length - 1, value, false );
		return this;
	},
	setArrayComplex : function( chr, subIndex/*Array*/, real, imag ){
		this._setEnv();
		var value = new _Value();
		value.setReal( real );
		value.setImag( imag );
		this.setArrayValue( chr, subIndex, value );
		return this;
	},
	setArrayFract : function( chr, subIndex/*Array*/, num, denom ){
		this._setEnv();
		var value = new _Value();
		var isMinus = ((num < 0) && (denom >= 0)) || ((num >= 0) && (denom < 0));
		value.fractSetMinus( isMinus       );
		value.setNum       ( _ABS( num   ) );
		value.setDenom     ( _ABS( denom ) );
		value.fractReduce  ();
		this._param.fractReduce  ( _CHAR( chr ), false );
		this.setArrayValue( chr, subIndex, value );
		return this;
	},
	setString : function( chr, string ){
		this._setEnv();
		this._proc.strSet( this._param._array, _CHAR( chr ), string );
		return this;
	},
	setMultiPrec : function( chr, n/*Array*/ ){
		this._setEnv();
		this._param._array._mp[_CHAR( chr )] = Array.from( n );
	},

	// 変数・配列の値を確認する
	getAnsValue : function(){
		this._setEnv();
		return this._param.val( 0 );
	},
	getAnsMatrix : function(){
		this._setEnv();
		return this._param._array._mat[0];
	},
	getAnsMatrixString : function( indent ){
		this._setEnv();
		return this.getArrayTokenString( this._param, this._param._array.makeToken( new _Token(), 0 ), indent );
	},
	getAnsMultiPrec : function(){
		this._setEnv();
		return this._param._array._mp[0];
	},
	getValue : function( chr ){
		this._setEnv();
		return this._param.val( _CHAR( chr ) );
	},
	getComplexString : function( chr ){
		var string = new String();
		var value = this.getValue( chr );
		if( _ISZERO( value.imag() ) ){
			string = "" + value.real();
		} else if( _ISZERO( value.real() ) ){
			string = "" + value.imag() + "i";
		} else if( value.imag() > 0.0 ){
			string = "" + value.real() + "+" + value.imag() + "i";
		} else {
			string = "" + value.real() + value.imag() + "i";
		}
		return string;
	},
	getFractString : function( chr, mixed ){
		var string = new String();
		var value = this.getValue( chr );
		if( mixed && (value.denom() != 0) && (_DIV( value.num(), value.denom() ) != 0) ){
			if( _MOD( value.num(), value.denom() ) != 0 ){
				string = value.fractMinus() ? "-" : "";
				string += "" + _DIV( value.num(), value.denom() );
				string += "」" + _MOD( value.num(), value.denom() );
				string += "」" + value.denom();
			} else {
				string = value.fractMinus() ? "-" : "";
				string += "" + _DIV( value.num(), value.denom() );
			}
		} else {
			if( value.denom() == 0 ){
				string = "" + value.toFloat();
			} else if( value.denom() == 1 ){
				string = value.fractMinus() ? "-" : "";
				string += "" + value.num();
			} else {
				string = value.fractMinus() ? "-" : "";
				string += "" + value.num() + "」" + value.denom();
			}
		}
		return string;
	},
	getArray : function( chr, dim ){
		this._setEnv();

		var _array = new Array();
		var _dim   = -1;
		var _index = new Array();

		var code;
		var token;

		var array = this._param._array.makeToken( new _Token(), _CHAR( chr ) );
		array.beginGetToken();
		while( array.getToken() ){
			code  = getCode();
			token = getToken();
			if( code == _CLIP_CODE_ARRAY_TOP ){
				_index[++_dim] = 0;
			} else if( code == _CLIP_CODE_ARRAY_END ){
				_index[--_dim]++;
			} else if( code == _CLIP_CODE_CONSTANT ){
				if( (dim == undefined) || (dim == _dim + 1) ){
					if( _dim > 0 ){
						if( !(_array[_index[0]] instanceof Array) ){
							_array[_index[0]] = new Array();
						}
					}
					if( _dim > 1 ){
						if( !(_array[_index[0]][_index[1]] instanceof Array) ){
							_array[_index[0]][_index[1]] = new Array();
						}
					}
					if( _dim > 2 ){
						if( !(_array[_index[0]][_index[1]][_index[2]] instanceof Array) ){
							_array[_index[0]][_index[1]][_index[2]] = new Array();
						}
					}
					switch( _dim ){
					case 0:
						if( !(_array[_index[0]] instanceof Array) ){
							_array[_index[0]] = token.toFloat();
						}
						break;
					case 1:
						if( !(_array[_index[0]][_index[1]] instanceof Array) ){
							_array[_index[0]][_index[1]] = token.toFloat();
						}
						break;
					case 2:
						if( !(_array[_index[0]][_index[1]][_index[2]] instanceof Array) ){
							_array[_index[0]][_index[1]][_index[2]] = token.toFloat();
						}
						break;
					case 3:
						if( !(_array[_index[0]][_index[1]][_index[2]][_index[3]] instanceof Array) ){
							_array[_index[0]][_index[1]][_index[2]][_index[3]] = token.toFloat();
						}
						break;
					}
				}
				_index[_dim]++;
			}
		}

		return _array;
	},
	getArrayTokenString : function( param, array/*_Token*/, indent ){
		this._setEnv();

		var _token = new _Token();

		var i;
		var code;
		var token;
		var string = new String();
		var enter  = false;

		array.beginGetToken();
		while( array.getToken() ){
			code  = getCode();
			token = getToken();
			if( enter ){
				if( code == _CLIP_CODE_ARRAY_TOP ){
					string += arrayTokenStringBreak;
					for( i = 0; i < indent; i++ ){
						string += arrayTokenStringSpace;
					}
				}
				enter = false;
			}
			string += _token.tokenString( param, code, token );
			string += arrayTokenStringSpace;
			if( code == _CLIP_CODE_ARRAY_TOP ){
				indent += 2;
			}
			if( code == _CLIP_CODE_ARRAY_END ){
				indent -= 2;
				enter = true;
			}
		}

		return string;
	},
	getArrayString : function( chr, indent ){
		this._setEnv();
		return this.getArrayTokenString( this._param, this._param._array.makeToken( new _Token(), _CHAR( chr ) ), indent );
	},
	getString : function( chr ){
		this._setEnv();
		return this._proc.strGet( this._param._array, _CHAR( chr ) );
	},
	getMultiPrec : function( chr ){
		this._setEnv();
		return this._param._array._mp[_CHAR( chr )];
	},

	// 各種設定
	setMode : function( mode, param1, param2 ){
		this._setEnv();
		this._param.setMode( mode );
		if( (mode & _CLIP_MODE_MULTIPREC) != 0 ){
			if( param1 != undefined ){
				if( param2 != undefined ){
					this._param.mpSetPrec( param1 );
					param1 = param2;
				}
				if( !(this._param.mpSetRound( param1 )) ){
					this._param.mpSetPrec( param1 );
				}
			}
		} else if( ((mode & _CLIP_MODE_FLOAT) != 0) || ((mode & _CLIP_MODE_COMPLEX) != 0) ){
			if( param1 != undefined ){
				this._param.setPrec( param1 );
			}
		} else if( (mode & _CLIP_MODE_TIME) != 0 ){
			if( param1 != undefined ){
				this._param.setFps( param1 );
			}
		} else if( (mode & _CLIP_MODE_INT) != 0 ){
			if( param1 != undefined ){
				this._param.setRadix( param1 );
			}
		}
		return this;
	},
	setPrec : function( prec ){
		this._setEnv();
		this._param.setPrec( prec );
		return this;
	},
	setFps : function( fps ){
		this._setEnv();
		this._param.setFps( fps );
		return this;
	},
	setRadix : function( radix ){
		this._setEnv();
		this._param.setRadix( radix );
		return this;
	},
	setAngType : function( type ){
		this._setEnv();
		this._proc.setAngType( type, false );
		return this;
	},
	setCalculator : function( flag ){
		this._setEnv();
		this._param._calculator = flag;
		return this;
	},
	setBase : function( base ){
		this._setEnv();
		this._param._base = (base != 0) ? 1 : 0;
		return this;
	},
	setAnsFlag : function( flag ){
		this._setEnv();
		this._proc._printAns = flag;
		return this;
	},
	setAssertFlag : function( flag ){
		this._setEnv();
		this._proc.setAssertFlag( flag );
		return this;
	},
	setWarnFlag : function( flag ){
		this._setEnv();
		this._proc.setWarnFlag( flag );
		return this;
	},

	// コマンド
	commandGWorld : function( width, height ){
		this._setEnv();
		doCommandGWorld( width, height );
		procGWorld().create( width, height, true );
		return this;
	},
	commandWindow : function( left, bottom, right, top ){
		this._setEnv();
		doCommandWindow( left, bottom, right, top );
		procGWorld().setWindowIndirect( left, bottom, right, top );
		return this;
	},
	commandGClear : function( index ){
		this._setEnv();
		procGWorld().clear( index );
		return this;
	},
	commandGColor : function( index ){
		this._setEnv();
		procGWorld().setColor( index );
		return this;
	},
	commandGPut : function( array/*Array*/ ){
		this._setEnv();
		var gWorld = procGWorld();
		var x, y;
		for( y = 0; y < gWorld._height; y++ ){
			for( x = 0; x < gWorld._width; x++ ){
				gWorld.putColor(
					x, y,
					(y < array.length) ? ((x < array[y].length) ? array[y][x] : 0) : 0
					);
			}
		}
		return this;
	},
	commandGPut24 : function( array/*Array*/ ){
		this._setEnv();
		var gWorld = procGWorld();
		var x, y;
		doCommandGPut24Begin();
		for( y = 0; y < gWorld._height; y++ ){
			for( x = 0; x < gWorld._width; x++ ){
				doCommandGPut24(
					x, y,
					(y < array.length) ? ((x < array[y].length) ? array[y][x] : 0) : 0
					);
			}
		}
		doCommandGPut24End();
		return this;
	},
	commandGGet : function(){
		this._setEnv();
		var gWorld = procGWorld();
		var width  = gWorld._width;
		var height = gWorld._height;
		if( (width > 0) && (height > 0) ){
			var x, y;
			var array = new Array( height );
			for( y = 0; y < height; y++ ){
				array[y] = new Array( width );
				for( x = 0; x < width; x++ ){
					array[y][x] = gWorld.get( x, y );
				}
			}
			return array;
		}
		return null;
	},
	commandGGet24 : function(){
		this._setEnv();
		var w = new _Integer();
		var h = new _Integer();
		var data = doCommandGGet24Begin( w, h );
		if( data != null ){
			var width  = w._val;
			var height = h._val;
			if( (width > 0) && (height > 0) ){
				var x, y, r, g, b;
				var i = 0;
				var array = new Array( height );
				for( y = 0; y < height; y++ ){
					array[y] = new Array( width );
					for( x = 0; x < width; x++ ){
						r = data[i++];
						g = data[i++];
						b = data[i++];
						i++;
						array[y][x] = (r << 16) + (g << 8) + b;
					}
				}
				doCommandGGet24End();
				return array;
			}
		}
		return null;
	},

	// 計算
	procLine : function( line/*String*/ ){
		this._setEnv();
		initProcLoopCount();
		return this._proc.processLoop( line, this._param );
	},
	procScript : function( script/*Array*/ ){
		this._setEnv();
		var saveFunc = window.getExtFuncDataDirect;
		window.getExtFuncDataDirect = function( func ){
			return script;
		};
		initProcLoopCount();
		var ret = this._proc.mainLoop( "", this._param, null, null );
		window.getExtFuncDataDirect = saveFunc;
		return ret;
	},

	// カラー・パレット
	newPalette : function(){
		if( this._palette == null ){
			this._palette = new Array( 256 );
		}
		return this;
	},
	setPalette : function( bgrColorArray ){
		this.newPalette();
		for( var i = 0; i < 256; i++ ){
			this._palette[i] = bgrColorArray[i];
		}
		return this;
	},
	setPaletteColor : function( index, bgrColor ){
		this._palette[index] = bgrColor;
		return this;
	},
	paletteColor : function( index ){
		return this._palette[index];
	},

	// キャンバス
	_useCanvas : function(){
		if( this._canvasEnv == null ){
			this._canvasEnv = new _CanvasEnv();
		}
		setCanvasEnv( this._canvasEnv );
	},
	setCanvas : function( id ){
		this._useCanvas();
		this._canvas = new _Canvas( id );
		return this._canvas;
	},
	createCanvas : function( width, height ){
		this._useCanvas();
		this._canvas = new _Canvas();
		this._canvas.setSize( width, height );
		return this._canvas;
	},
	resizeCanvas : function( width, height ){
		setCanvasEnv( this._canvasEnv );
		this._canvas.setSize( width, height );
		return this._canvas;
	},
	updateCanvas : function( scale ){
		this._setEnv();

		if( scale == undefined ){
			scale = 1;
		}

		this._canvas.setColorRGB( gWorldBgColor() );
		this._canvas.fill( 0, 0, this._canvas.width(), this._canvas.height() );

		var gWorld = procGWorld();
		var image  = gWorld._image;
		var offset = gWorld._offset;
		var width  = gWorld._width;
		var height = gWorld._height;
		var x, y, yy, sy;
		for( y = 0; y < height; y++ ){
			yy = y * offset;
			sy = y * scale;
			for( x = 0; x < width; x++ ){
				this._canvas.setColorBGR( this._palette[image[yy + x]] );
				this._canvas.fill( x * scale, sy, scale, scale );
			}
		}

		return this._canvas;
	},

	// イメージを構築して表示する
	createImage : function( script/*Array*/, id, type, encoderOptions ){
		var saveFunc = window.doCommandGWorld;
		window.doCommandGWorld = function( width, height ){
			curClip().createCanvas( width, height );
		};
		var ret = this.procScript( script );
		window.doCommandGWorld = saveFunc;

		if( ret == _CLIP_PROC_END ){
			var canvas = this.updateCanvas();

			var img = document.getElementById( id );
			if( type == undefined ){
				img.src = canvas.element().toDataURL();
			} else if( encoderOptions == undefined ){
				img.src = canvas.element().toDataURL( type );
			} else {
				img.src = canvas.element().toDataURL( type, encoderOptions );
			}
		}

		return ret;
	}

};
