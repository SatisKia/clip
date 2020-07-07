/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

function _EasyClip(){
	var _this = this;
	if( window.loopMax == undefined ) window.loopMax = 65536;
	if( window.canvasPut == undefined ) window.canvasPut = function( x, y, index ){};
	if( window.mainProc == undefined ){
		window.mainProc = function( parentProc, parentParam, func, funcParam, childProc, childParam ){
			var ret = childProc.mainLoop( func, childParam, funcParam, parentParam );
			resetProcLoopCount();
			return ret;
		};
	}
	if( window.doFuncEval == undefined ){
		window.doFuncEval = function( parentProc, childProc, childParam, string, value ){
			return parentProc.doFuncEval( childProc, childParam, string, value );
		};
	}
	if( window.doCommandWindow == undefined ){
		window.doCommandWindow = function( gWorld, left, bottom, right, top ){
			gWorld.setWindowIndirect( left, bottom, right, top );
		};
	}
	if( window.doCommandGPut24 == undefined ){
		window.doCommandGPut24 = function( x, y, rgb ){
			_this._canvas.setColor( (rgb & 0xFF0000) >> 16, (rgb & 0x00FF00) >> 8, rgb & 0x0000FF );
			_this._canvas.put( x, y );
		};
	}
	if( window.doCommandGGet24Begin == undefined ){
		window.doCommandGGet24Begin = function( w/*_Integer*/, h/*_Integer*/ ){
			var width  = _this._proc.gWorld().width ();
			var height = _this._proc.gWorld().height();
			if( (width > 0) && (height > 0) ){
				w.set( width  );
				h.set( height );
				return _this._canvas.imageData( width, height ).data;
			}
			return null;
		};
	}
	if( window.doCommandPlot == undefined ){
		window.doCommandPlot = function( parentProc, parentParam, graph, start, end, step ){
			// 親プロセスの環境を受け継いで、子プロセスを実行する
			var childProc = new _Proc( parentParam.mode(), parentProc.assertFlag(), parentProc.warnFlag(), false/*グラフィック画面更新OFF*/ );
			var childParam = new _Param( parentProc.curNum(), parentParam, true );
			childParam.setEnableCommand( false );
			childParam.setEnableStat( false );
			parentProc.doCommandPlot( childProc, childParam, graph, start, end, step );
			childParam.end();
			childProc.end();
		};
	}
	if( window.doCommandRePlot == undefined ){
		window.doCommandRePlot = function( parentProc, parentParam, graph, start, end, step ){
			// 親プロセスの環境を受け継いで、子プロセスを実行する
			var childProc = new _Proc( parentParam.mode(), parentProc.assertFlag(), parentProc.warnFlag(), false/*グラフィック画面更新OFF*/ );
			var childParam = new _Param( parentProc.curNum(), parentParam, true );
			childParam.setEnableCommand( false );
			childParam.setEnableStat( false );
			parentProc.doCommandRePlot( childProc, childParam, graph, start, end, step );
			childParam.end();
			childProc.end();
		};
	}
	defGWorldFunction();
	defProcFunction();

	// 計算処理メイン・クラスを生成する
	this._proc = new _Proc( _PROC_DEF_PARENT_MODE, _PROC_DEF_PRINT_ASSERT, _PROC_DEF_PRINT_WARN, false/*_PROC_DEF_GUPDATE_FLAG*/ );
	this._proc.setAnsFlag( false );
	setProcWarnFlowFlag( true );
	setProcTraceFlag( false );
	setProcLoopMax( loopMax );

	// 計算パラメータ・クラスを生成する
	this._param = new _Param();
	this._param.setEnableCommand( true );
	this._param.setEnableOpPow( false );
	this._param.setEnableStat( true );
	setGlobalParam( this._param );

	// 乱数を初期化する
	srand( time() );
	rand();

	// キャンバス
	this._canvas = null;
}

_EasyClip.prototype = {

	// 変数・配列に値を設定する
	setValue : function( chr, value ){
		this._param.setVal( _CHAR( chr ), value, false );
	},
	setComplex : function( chr, real, imag ){
		this._param.setReal( _CHAR( chr ), real, false );
		this._param.setImag( _CHAR( chr ), imag, false );
	},
	setMatrix : function( chr, array/*Array*/ ){
		this._param._array.setMatrix( _CHAR( chr ), arrayToMatrix( array ), false );
	},
	setArrayValue : function( chr, subIndex/*Array*/, value ){
		for( var i = 0; i < subIndex.length; i++ ){
			subIndex[i] -= this._param.base();
		}
		subIndex[subIndex.length] = -1;
		this._param._array.set( _CHAR( chr ), subIndex, subIndex.length - 1, value, false );
	},
	setString : function( chr, string ){
		this._proc.strSet( this._param._array, _CHAR( chr ), string );
	},

	// 変数・配列の値を確認する
	getAnsValue : function(){
		return this._param.val( 0 );
	},
	getAnsMatrix : function(){
		return this._param._array._mat[0];
	},
	getAnsMatrixString : function( indent ){
		return this.getArrayTokenString( this._param, this._param._array.makeToken( new _Token(), 0 ), indent );
	},
	getValue : function( chr ){
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
	getArray : function( chr, dim ){
		var _array = new Array();
		var _dim   = -1;
		var _index = new Array();

		var code  = new _Integer();
		var token = new _Void();

		var array = this._param._array.makeToken( new _Token(), _CHAR( chr ) );
		array.beginGetToken();
		while( array.getToken( code, token ) ){
			if( code.val() == _CLIP_CODE_ARRAY_TOP ){
				_index[++_dim] = 0;
			} else if( code.val() == _CLIP_CODE_ARRAY_END ){
				_index[--_dim]++;
			} else if( code.val() == _CLIP_CODE_CONSTANT ){
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
							_array[_index[0]] = token.obj().toFloat();
						}
						break;
					case 1:
						if( !(_array[_index[0]][_index[1]] instanceof Array) ){
							_array[_index[0]][_index[1]] = token.obj().toFloat();
						}
						break;
					case 2:
						if( !(_array[_index[0]][_index[1]][_index[2]] instanceof Array) ){
							_array[_index[0]][_index[1]][_index[2]] = token.obj().toFloat();
						}
						break;
					case 3:
						if( !(_array[_index[0]][_index[1]][_index[2]][_index[3]] instanceof Array) ){
							_array[_index[0]][_index[1]][_index[2]][_index[3]] = token.obj().toFloat();
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
		var _token = new _Token();

		var i;
		var code   = new _Integer();
		var token  = new _Void();
		var string = new String();
		var enter  = false;

		array.beginGetToken();
		while( array.getToken( code, token ) ){
			if( enter ){
				if( code.val() == _CLIP_CODE_ARRAY_TOP ){
					string += "<br>";
					for( i = 0; i < indent; i++ ){
						string += "&nbsp;";
					}
				}
				enter = false;
			}
			string += _token.tokenString( param, code.val(), token.obj() );
			string += "&nbsp;";
			if( code.val() == _CLIP_CODE_ARRAY_TOP ){
				indent += 2;
			}
			if( code.val() == _CLIP_CODE_ARRAY_END ){
				indent -= 2;
				enter = true;
			}
		}

		return string;
	},
	getArrayString : function( chr, indent ){
		return this.getArrayTokenString( this._param, this._param._array.makeToken( new _Token(), _CHAR( chr ) ), indent );
	},
	getString : function( chr ){
		var string = new _String();
		this._proc.strGet( this._param._array, _CHAR( chr ), string );
		return string.str();
	},

	// 各種設定
	setMode : function( mode ){
		this._param.setMode( mode );
	},
	setPrec : function( prec ){
		this._param.setPrec( prec );
	},
	setFps : function( fps ){
		this._param.setFps( fps );
	},
	setRadix : function( radix ){
		this._param.setRadix( radix );
	},
	setAngType : function( type ){
		this._proc.setAngType( type, false );
	},
	setCalculator : function( flag ){
		this._param.setCalculator( flag );
	},
	setBase : function( base ){
		this._param.setBase( (base != 0) ? 1 : 0 );
	},
	setAssertFlag : function( flag ){
		this._proc.setAssertFlag( flag );
	},
	setWarnFlag : function( flag ){
		this._proc.setWarnFlag( flag );
	},

	// コマンド
	commandGWorld : function( width, height ){
		doCommandGWorld( this._proc.gWorld(), width, height );
	},
	commandWindow : function( left, bottom, right, top ){
		doCommandWindow( this._proc.gWorld(), left, bottom, right, top );
	},
	commandGClear : function( color ){
		this._proc.gWorld().clear( color );
	},
	commandGColor : function( color ){
		this._proc.gWorld().setColor( color );
	},
	commandGPut : function( array/*Array*/ ){
		var gWorld = this._proc.gWorld();
		var x, y;
		for( y = 0; y < gWorld.height(); y++ ){
			for( x = 0; x < gWorld.width(); x++ ){
				gWorld.putColor(
					x, y,
					(y < array.length) ? ((x < array[y].length) ? array[y][x] : 0) : 0
					);
			}
		}
	},
	commandGPut24 : function( array/*Array*/ ){
		var gWorld = this._proc.gWorld();
		var x, y;
		for( y = 0; y < gWorld.height(); y++ ){
			for( x = 0; x < gWorld.width(); x++ ){
				doCommandGPut24(
					x, y,
					(y < array.length) ? ((x < array[y].length) ? array[y][x] : 0) : 0
					);
			}
		}
		doCommandGPut24End();
	},
	commandGGet : function( array/*_Void*/ ){
		var gWorld = this._proc.gWorld();
		var width  = gWorld.width ();
		var height = gWorld.height();

		var x, y;
		var _array = new Array( height );
		for( y = 0; y < height; y++ ){
			_array[y] = new Array( width );
			for( x = 0; x < width; x++ ){
				_array[y][x] = gWorld.get( x, y );
			}
		}
		array.set( _array );
	},
	commandGGet24 : function( array/*_Void*/ ){
		var w = new _Integer();
		var h = new _Integer();
		var data = doCommandGGet24Begin( w, h );
		if( data != null ){
			var width  = w.val();
			var height = h.val();

			var x, y, r, g, b;
			var i = 0;
			var _array = new Array( height );
			for( y = 0; y < height; y++ ){
				_array[y] = new Array( width );
				for( x = 0; x < width; x++ ){
					r = data[i++];
					g = data[i++];
					b = data[i++];
					i++;
					_array[y][x] = (r << 16) + (g << 8) + b;
				}
			}
			array.set( _array );

			doCommandGGet24End();
		}
	},

	// 計算
	procLine : function( line/*String*/ ){
		initProcLoopCount();
		return this._proc.processLoop( line, this._param );
	},
	procScript : function( script/*Array*/ ){
		window.getExtFuncDataDirect = function( func ){
			return script;
		};
		initProcLoopCount();
		return this._proc.mainLoop( "", this._param, null, null );
	},

	// キャンバス
	setCanvas : function( id ){
		if( this._canvas == null ){
			this._canvas = new _Canvas( id );
			return true;
		}
		return false;
	},
	updateCanvas : function(){
		var rgbColor = gWorldBgColor();
		this._canvas.setColor( (rgbColor & 0xFF0000) >> 16, (rgbColor & 0x00FF00) >> 8, rgbColor & 0x0000FF );
		this._canvas.fill( 0, 0, this._canvas.width(), this._canvas.height() );

		var gWorld = this._proc.gWorld();
		var image  = gWorld.image ();
		var offset = gWorld.offset();
		var width  = gWorld.width ();
		var height = gWorld.height();
		var x, y, yy;
		for( y = 0; y < height; y++ ){
			yy = y * offset;
			for( x = 0; x < width; x++ ){
				canvasPut( this._canvas, x, y, image[yy + x] );
			}
		}
	}

};
