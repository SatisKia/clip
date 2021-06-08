/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */
(function( window, undefined ){
var document = window.document;
var _canvas_env;
function _CanvasEnv(){
	this._color_r = 0;
	this._color_g = 0;
	this._color_b = 0;
	this._color_a = 255;
	this._font = "";
	this._stroke_width = 1.0;
}
function setCanvasEnv( env ){
	_canvas_env = env;
}
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
		this._context.textAlign = "left";
		this._context.textBaseline = "bottom";
		this._setColor();
		this._setFont();
		this._setStrokeWidth();
	},
	setSize : function( width, height ){
		if( this._create ){
			this._canvas.width = width;
			this._canvas.height = height;
		} else {
			this._canvas.setAttribute( "width" , "" + width );
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
		this._context.fillStyle = color;
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
	line : function( x1, y1, x2, y2, scale ){
		this._context.beginPath();
		if( scale == undefined ){
			this._context.moveTo( x1 + 0.5, y1 + 0.5 );
			this._context.lineTo( x2 + 0.5, y2 + 0.5 );
		} else {
			this._context.moveTo( (x1 + 0.5) * scale, (y1 + 0.5) * scale );
			this._context.lineTo( (x2 + 0.5) * scale, (y2 + 0.5) * scale );
		}
		this._context.stroke();
		this._context.closePath();
	},
	rect : function( x, y, w, h, scale ){
		if( scale == undefined ){
			this._context.strokeRect( x + 0.5, y + 0.5, w, h );
		} else {
			this._context.strokeRect( (x + 0.5) * scale, (y + 0.5) * scale, w * scale, h * scale );
		}
	},
	circle : function( cx, cy, r ){
		this._context.beginPath();
		this._context.arc( cx, cy, r, 0.0, Math.PI * 2.0, false );
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
function _EasyCanvas(){
	this._su = new _StringUtil();
	var _this = this;
	if( window.gWorldClear == undefined ){
		window.gWorldClear = function( gWorld, color ){
			var canvas = curClip()._canvas;
			canvas.setColorRGB( gWorldBgColor() );
			canvas.fill( 0, 0, canvas.width(), canvas.height() );
			canvas.setColorBGR( curClip()._palette[color] );
			canvas.fill( 0, 0, gWorld._width, gWorld._height );
			canvas.setColorBGR( curClip()._palette[gWorld._color] );
		};
	}
	if( window.gWorldSetColor == undefined ){
		window.gWorldSetColor = function( gWorld, color ){
			curClip()._canvas.setColorBGR( curClip()._palette[color] );
		};
	}
	if( window.gWorldPutColor == undefined ){
		window.gWorldPutColor = function( gWorld, x, y, color ){
			var canvas = curClip()._canvas;
			canvas.setColorBGR( curClip()._palette[color] );
			canvas.put( x, y );
			canvas.setColorBGR( curClip()._palette[gWorld._color] );
		};
	}
	if( window.gWorldPut == undefined ){
		window.gWorldPut = function( gWorld, x, y ){
			curClip()._canvas.put( x, y );
		};
	}
	if( window.gWorldFill == undefined ){
		window.gWorldFill = function( gWorld, x, y, w, h ){
			curClip()._canvas.fill( x, y, w, h );
		};
	}
	if( window.gWorldLine == undefined ){
		window.gWorldLine = function( gWorld, x1, y1, x2, y2 ){
			curClip()._canvas.line( x1, y1, x2, y2 );
		};
	}
	if( window.gWorldTextColor == undefined ){
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
}
_EasyCanvas.prototype = {
	setFont : function( canvas, size, family ){
		canvas.setFont( size, family );
		this._su.setFont( size, family );
	}
};
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
			curClip()._canvas.setColorBGR( curClip()._palette[procGWorld()._color] );
		};
	}
	if( window.doCommandGGet24Begin == undefined ){
		window.doCommandGGet24Begin = function( w , h ){
			var width = procGWorld()._width;
			var height = procGWorld()._height;
			if( (width > 0) && (height > 0) ){
				w.set( width );
				h.set( height );
				return curClip()._canvas.imageData( width, height ).data;
			}
			return null;
		};
	}
	if( window.doCommandPlot == undefined ){
		window.doCommandPlot = function( parentProc, childProc, childParam, graph, start, end, step ){
			parentProc.doCommandPlot( childProc, childParam, graph, start, end, step );
		};
	}
	if( window.doCommandRePlot == undefined ){
		window.doCommandRePlot = function( parentProc, childProc, childParam, graph, start, end, step ){
			parentProc.doCommandRePlot( childProc, childParam, graph, start, end, step );
		};
	}
	defGWorldFunction();
	defProcFunction();
	setDefineValue();
	this._procEnv = new _ProcEnv();
	setProcEnv( this._procEnv );
	this._proc = new _Proc( _PROC_DEF_PARENT_MODE, _PROC_DEF_PARENT_MP_PREC, _PROC_DEF_PARENT_MP_ROUND, false, _PROC_DEF_PRINT_ASSERT, _PROC_DEF_PRINT_WARN, false );
	setProcWarnFlowFlag( true );
	setProcTraceFlag( false );
	setProcLoopMax( loopMax );
	this._param = new _Param();
	setGlobalParam( this._param );
	initProc();
	srand( time() );
	rand();
	this._palette = null;
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
		this._param.fractSetMinus( index, isMinus , false );
		this._param.setNum ( index, _ABS( num ), false );
		this._param.setDenom ( index, _ABS( denom ), false );
		this._param.fractReduce ( index, false );
		return this;
	},
	setMultiPrec : function( chr, n ){
		this._setEnv();
		this._param._array._mp[_CHAR( chr )] = Array.from( n );
	},
	setVector : function( chr, value ){
		this._setEnv();
		this._param._array.setVector( _CHAR( chr ), value, value.length );
		return this;
	},
	setComplexVector : function( chr, real , imag ){
		this._setEnv();
		this._param._array.setComplexVector( _CHAR( chr ), real, imag, (real.length < imag.length) ? real.length : imag.length );
		return this;
	},
	setFractVector : function( chr, value , denom ){
		this._setEnv();
		this._param._array.setFractVector( _CHAR( chr ), value, denom, (value.length < denom.length) ? value.length : denom.length );
		return this;
	},
	setMatrix : function( chr, value ){
		this._setEnv();
		if( !(value instanceof _Matrix) ){
			value = arrayToMatrix( value );
		}
		this._param._array.setMatrix( _CHAR( chr ), value, false );
		return this;
	},
	setComplexMatrix : function( chr, real , imag ){
		this._setEnv();
		this._param._array.setComplexMatrix( _CHAR( chr ), arrayToMatrix( real ), arrayToMatrix( imag ), false );
		return this;
	},
	setFractMatrix : function( chr, value , denom ){
		this._setEnv();
		this._param._array.setFractMatrix( _CHAR( chr ), arrayToMatrix( value ), arrayToMatrix( denom ), false );
		return this;
	},
	setArrayValue : function( chr, subIndex , value ){
		this._setEnv();
		for( var i = 0; i < subIndex.length; i++ ){
			subIndex[i] -= this._param._base;
		}
		subIndex[subIndex.length] = -1;
		this._param._array.set( _CHAR( chr ), subIndex, subIndex.length - 1, value, false );
		return this;
	},
	setArrayComplex : function( chr, subIndex , real, imag ){
		this._setEnv();
		var value = new _Value();
		value.setReal( real );
		value.setImag( imag );
		this.setArrayValue( chr, subIndex, value );
		return this;
	},
	setArrayFract : function( chr, subIndex , num, denom ){
		this._setEnv();
		var value = new _Value();
		var isMinus = ((num < 0) && (denom >= 0)) || ((num >= 0) && (denom < 0));
		value.fractSetMinus( isMinus );
		value.setNum ( _ABS( num ) );
		value.setDenom ( _ABS( denom ) );
		value.fractReduce ();
		this._param.fractReduce ( _CHAR( chr ), false );
		this.setArrayValue( chr, subIndex, value );
		return this;
	},
	setString : function( chr, string ){
		this._setEnv();
		this._proc.strSet( this._param._array, _CHAR( chr ), string );
		return this;
	},
	getAnsValue : function(){
		this._setEnv();
		return this._param.val( 0 );
	},
	getAnsMultiPrec : function(){
		this._setEnv();
		return this._param._array._mp[0];
	},
	getAnsMatrix : function(){
		this._setEnv();
		return this._param._array._mat[0];
	},
	getAnsMatrixString : function( indent ){
		this._setEnv();
		return this.getArrayTokenString( this._param, this._param._array.makeToken( new _Token(), 0 ), indent );
	},
	getAnsMultiPrecString : function(){
		var array = this.getAnsMultiPrec();
		var mp = procMultiPrec();
		if( mp.getPrec( array ) == 0 ){
			return mp.num2str( array );
		}
		return mp.fnum2str( array, this._param._mpPrec );
	},
	getValue : function( chr ){
		this._setEnv();
		return this._param.val( _CHAR( chr ) );
	},
	getMultiPrec : function( chr ){
		this._setEnv();
		return this._param._array._mp[_CHAR( chr )];
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
				string += "" + _CHAR_FRACT + _MOD( value.num(), value.denom() );
				string += "" + _CHAR_FRACT + value.denom();
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
				string += "" + value.num() + _CHAR_FRACT + value.denom();
			}
		}
		return string;
	},
	getMultiPrecString : function( chr ){
		var array = this.getMultiPrec( chr );
		var mp = procMultiPrec();
		if( mp.getPrec( array ) == 0 ){
			return mp.num2str( array );
		}
		return mp.fnum2str( array, this._param._mpPrec );
	},
	getArray : function( chr, dim ){
		this._setEnv();
		var _array = new Array();
		var _dim = -1;
		var _index = new Array();
		var code;
		var token;
		var array = this._param._array.makeToken( new _Token(), _CHAR( chr ) );
		array.beginGetToken();
		while( array.getToken() ){
			code = getCode();
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
	getArrayTokenString : function( param, array , indent ){
		this._setEnv();
		var i;
		var code;
		var token;
		var string = new String();
		var enter = false;
		array.beginGetToken();
		while( array.getToken() ){
			code = getCode();
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
			string += procToken().tokenString( param, code, token );
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
	commandGPut : function( array ){
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
	commandGPut24 : function( array ){
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
		var width = gWorld._width;
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
			var width = w._val;
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
	procLine : function( line ){
		this._setEnv();
		initProcLoopCount();
		return this._proc.processLoop( line, this._param );
	},
	procScript : function( script ){
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
		var image = gWorld._image;
		var offset = gWorld._offset;
		var width = gWorld._width;
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
	createImage : function( script , id, type, encoderOptions ){
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
function _StringUtil(){
	this._fontSize = 0;
	this._fontFamily = "";
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
window._CanvasEnv = _CanvasEnv;
window.setCanvasEnv = setCanvasEnv;
window._Canvas = _Canvas;
window._EasyCanvas = _EasyCanvas;
window.setClip = setClip;
window.curClip = curClip;
window.curCanvas = curCanvas;
window._EasyClip = _EasyClip;
window._StringUtil = _StringUtil;
})( window );
