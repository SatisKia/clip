/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Global.h"

var _MIN_VALUE = [ _SMIN_8, 0          , _SMIN_16, 0           , _SMIN_32, 0            ];
var _MAX_VALUE = [ _SMAX_8, _UMAX_8 - 1, _SMAX_16, _UMAX_16 - 1, _SMAX_32, _UMAX_32 - 1 ];

var _proc_env;
function _ProcEnv(){
	this._proc_graph          = new _Graph();				// グラフ描画サポート
	this._proc_gworld         = this._proc_graph._gWorld;	// グラフィック描画サポート
	this._proc_func           = new _Func();				// 外部関数キャッシュ
	this._global_param        = null;						// グローバル計算パラメータ
	this._proc_warn_flow      = false;						// オーバーフロー／アンダーフローの警告を発生させるかどうか
	this._proc_trace          = false;						// トレース表示するかどうか
	this._proc_loop_max       = 0;							// ループ回数
	this._proc_loop_count     = 0;
	this._proc_loop_count_max = 0;
	this._proc_loop_total     = 0;

	this._math_env = new _MathEnv();
}
function setProcEnv( env/*_ProcEnv*/ ){
	_proc_env = env;
	setMathEnv( env._math_env );
}

function procGraph(){
	return _proc_env._proc_graph;
}
function procGWorld(){
	return _proc_env._proc_gworld;
}
function procFunc(){
	return _proc_env._proc_func;
}

function setGlobalParam( param ){
	_proc_env._global_param = param;
}
function globalParam(){
	return _proc_env._global_param;
}

function setProcWarnFlowFlag( flag ){
	_proc_env._proc_warn_flow = flag;
}
function procWarnFlowFlag(){
	return _proc_env._proc_warn_flow;
}

function setProcTraceFlag( flag ){
	_proc_env._proc_trace = flag;
}
function procTraceFlag(){
	return _proc_env._proc_trace;
}

function setProcLoopMax( max ){
	_proc_env._proc_loop_max = max;
}
function procLoopMax(){
	return _proc_env._proc_loop_max;
}
function initProcLoopCount(){
	_proc_env._proc_loop_count     = 0;
	_proc_env._proc_loop_count_max = 0;
	_proc_env._proc_loop_total     = 0;
}
function resetProcLoopCount(){
	if( _proc_env._proc_loop_count_max < _proc_env._proc_loop_count ){
		_proc_env._proc_loop_count_max = _proc_env._proc_loop_count;
	}
	_proc_env._proc_loop_count = 0;
}
function setProcLoopCount( count ){
	_proc_env._proc_loop_count = count;
}
function procLoopCount(){
	return _proc_env._proc_loop_count;
}
function procLoopCountMax(){
	return _proc_env._proc_loop_count_max;
}
function incProcLoopTotal(){
	_proc_env._proc_loop_total++;
}
function procLoopTotal(){
	return _proc_env._proc_loop_total;
}

function _ProcVal( proc, param ){
	this._proc   = proc;
	this._param  = param;
	this._mat    = new _Matrix();
	this._mp     = new Array();
	this._mpFlag = false;
}
_ProcVal.prototype = {
	setParam : function( param ){
		this._param = param;
		return this;
	},
	mat : function(){
		if( this._mpFlag ){
			var str = _proc_mp.fnum2str( this._mp, this._param._mpPrec );
			var val = stringToFloat( str, 0, new _Integer() );
			this._mat.ass( val );
			this._proc._updateMatrix( this._param, this._mat );
		}
		this._mpFlag = false;
		return this._mat;
	},
	matAss : function( val ){
		this.mat().ass( val );
	},
	mp : function(){
		if( this._mpFlag ){
			if( (this._param._mode == _CLIP_MODE_I_MULTIPREC) && (_proc_mp.getPrec( this._mp ) > 0) ){
				_proc_mp.ftrunc( this._mp, this._mp );
			}
		} else {
			this._proc._updateMatrix( this._param, this._mat );
			var val = this._mat._mat[0].toFloat();
			var str = floatToFixed( val, _FPREC( val ) );
			_proc_mp.fstr2num( this._mp, str );
		}
		this._mpFlag = true;
		return this._mp;
	}
};
function newProcValArray( len, proc, param ){
	var a = new Array( len );
	for( var i = 0; i < len; i++ ){
		a[i] = new _ProcVal( proc, param );
	}
	return a;
}

function __Inc(){
	this._flag = false;

	this._code      = 0;
	this._token     = null;
	this._array     = null;
	this._arraySize = 0;

	this._next = null;
}

function __ProcPrint(){
	this._string = null;
	this._next   = null;
}
__ProcPrint.prototype = {
	string : function(){
		return this._string;
	},
	next : function(){
		return this._next;
	}
};

function __ProcScan(){
	this._title  = null;
	this._code   = 0;
	this._token  = null;
	this._before = null;
	this._next   = null;
}
__ProcScan.prototype = {
	title : function(){
		if( this._title == null ){
			return "";
		}
		return this._title;
	},
	next : function(){
		return this._next;
	},
	getDefString : function( proc, param ){
		var defString = new String();

		switch( this._code ){
		case _CLIP_CODE_GLOBAL_ARRAY:
			param = globalParam();
			// そのまま下に流す
		case _CLIP_CODE_ARRAY:
		case _CLIP_CODE_AUTO_ARRAY:
			defString = proc.strGet( param._array, proc.arrayIndexDirect( param, this._code, this._token ) );
			break;
		case _CLIP_CODE_GLOBAL_VAR:
			param = globalParam();
			// そのまま下に流す
		default:
			var real = new _String();
			var imag = new _String();
			_proc_token.valueToString( param, param.val( proc.varIndexDirect( param, this._code, this._token ) ), real, imag );
			defString = real.str() + imag.str();
			break;
		}

		return defString;
	},
	setNewValue : function( newString, proc, param ){
		switch( this._code ){
		case _CLIP_CODE_GLOBAL_ARRAY:
			param = globalParam();
			// そのまま下に流す
		case _CLIP_CODE_ARRAY:
		case _CLIP_CODE_AUTO_ARRAY:
			proc.strSet( param._array, proc.arrayIndexDirect( param, this._code, this._token ), newString );
			break;
		default:
			var value = new _Value();
			if( _proc_token.stringToValue( param, newString, value ) ){
				var moveFlag = new _Boolean();
				var index = proc.varIndexDirectMove( param, this._code, this._token, moveFlag );
				param.setVal( index, value, moveFlag._val );
			}
			break;
		}
	}
};

function __ProcUsage(){
	this._string = null;
	this._next   = null;
}

function __ProcInfo(){
	this._assCode  = _CLIP_CODE_NULL;
	this._assToken = null;

	this._curArray     = null;
	this._curArraySize = 0;
}

function __Index(){
	this._param = null;
	this._index = -1;
}
__Index.prototype = {
	set : function( param, index ){
		this._param = param;
		this._index = index;
	}
};

#define _STAT_IFMODE_DISABLE	0	// 無効（スキップ中）
#define _STAT_IFMODE_ENABLE		1	// 有効（開始前または実行中）
#define _STAT_IFMODE_PROCESSED	2	// 実行済み（スキップ中）
//#define _STAT_IFMODE_STARTED	3	// 開始した

#define _STAT_SWIMODE_DISABLE	0	// 無効（スキップ中）
#define _STAT_SWIMODE_ENABLE	1	// 有効（開始前または実行中）
#define _STAT_SWIMODE_PROCESSED	2	// 実行済み（スキップ中）
//#define _STAT_SWIMODE_STARTED	3	// 開始した

#define _STAT_MODE_NOT_START	0	// 開始前
#define _STAT_MODE_REGISTERING	1	// 行データの取り込み中
#define _STAT_MODE_PROCESSING	2	// 制御処理実行中

#define _PROC_END_TYPE_WHILE	0
#define _PROC_END_TYPE_FOR		1
#define _PROC_END_TYPE_IF		2
#define _PROC_END_TYPE_SWITCH	3

var _proc_token;	// 汎用_Tokenオブジェクト
var _proc_val;		// updateAns用
var _proc_mp;		// 多倍長演算サポート
function initProc(){
	_proc_token = new _Token();
	_proc_val   = new _Value();
	_proc_mp    = new _MultiPrec();
}
function procToken(){
	return _proc_token;
}
function procMultiPrec(){
	return _proc_mp;
}

// 計算クラス
function _Proc( parentMode, parentMpPrec, parentMpRound, printAns, printAssert, printWarn, gUpdateFlag ){
	this._valAns   = new _ProcVal( this );
	this._valSeAns = new _ProcVal( this );

	this._procLine = null;

	this._defLine = new __Line();
	this._curLine = this._defLine;

	this._defInfo = new __ProcInfo();
	this._curInfo = this._defInfo;

	this._errCode  = 0;
	this._errToken = null;

	this._parentMode    = parentMode;
	this._parentMpPrec  = parentMpPrec;
	this._parentMpRound = parentMpRound;
	this._angType       = _ANG_TYPE_RAD;
	this._angUpdateFlag = false;

	this._parentAngType = complexAngType();
	setComplexAngType( this._angType );

	// 各種フラグ
	this._quitFlag        = false;
	this._printAns        = printAns;
	this._printAssert     = printAssert;
	this._prevPrintAssert = printAssert;
	this._printWarn       = printWarn;
	this._prevPrintWarn   = printWarn;
	this._gUpdateFlag     = gUpdateFlag;
	this._prevGUpdateFlag = gUpdateFlag;

	// ifステートメント情報
	this._statIfMode    = new Array( 16 );
	this._statIfMode[0] = _STAT_IFMODE_ENABLE;
	this._statIfCnt     = 0;
	this._statIfMax     = 15;

	// switchステートメント情報
	this._statSwiMode    = new Array( 16 );
	this._statSwiMode[0] = _STAT_SWIMODE_ENABLE;
	this._statSwiVal     = newProcValArray( 16, this );
	this._statSwiCnt     = 0;
	this._statSwiMax     = 15;

	// ループ・ステートメント情報
	this._statMode = _STAT_MODE_NOT_START;
	this._stat     = null;
	this._loopCnt  = 0;

	// 配列の初期化データ情報
	this._initArrayFlag     = false;
	this._initArrayCnt      = 0;
	this._initArrayMax      = 0;
	this._initArrayIndex    = 0;
	this._initArrayMoveFlag = new _Boolean();
	this._initArray         = null;

	this._topInc = null;
	this._endInc = null;

	this._topUsage = null;
	this._curUsage = null;

	this._endType = new Array( 16 );
	this._endCnt  = 0;
}

_Proc.prototype = {

	end : function(){
		setComplexAngType( this._parentAngType );
	},

//	curLine : function(){
//		return this._curLine._token;
//	},
//	setCurLine : function( token ){
//		this._curLine._token = token;
//	},
//	curNum : function(){
//		return this._curLine._num;
//	},
//	curComment : function(){
//		return this._curLine._comment;
//	},

	// 外部関数キャッシュのサイズを設定する
	setFuncCacheSize : function( size ){
		procFunc().setMaxNum( size );
	},

	// 外部関数キャッシュのサイズを確認する
	funcCacheSize : function(){
		return procFunc()._max;
	},

	// 外部関数キャッシュをクリアする
	clearFuncCache : function( name ){
		var curFunc;
		if( (curFunc = procFunc().search( name, false, null )) != null ){
			procFunc().del( curFunc );
		}
	},
	clearAllFuncCache : function(){
		procFunc().delAll();
	},

	getFuncCacheInfo : function( num, info/*_FuncInfo*/ ){
		return procFunc().getInfo( num, info );
	},

	canClearFuncCache : function(){
		return procFunc().canDel();
	},

	// 終了要求
//	postQuit : function(){
//		this._quitFlag = true;
//	},

//	setAnsFlag : function( flag ){
//		this._printAns = flag;
//	},
//	ansFlag : function(){
//		return this._printAns;
//	},

	_setFlag : function( flag, newFlag/*_Boolean*/, prevFlag/*_Boolean*/ ){
		if( flag < 0 ){
			var tmpFlag = newFlag._val;
			newFlag .set( prevFlag._val );
			prevFlag.set( tmpFlag );
		} else {
			prevFlag.set( newFlag._val );
			newFlag .set( flag != 0 );
		}
	},

	setAssertFlag : function( flag ){
		var printAssert     = new _Boolean( this._printAssert     );
		var prevPrintAssert = new _Boolean( this._prevPrintAssert );
		this._setFlag( flag, printAssert, prevPrintAssert );
		this._printAssert     = printAssert    ._val;
		this._prevPrintAssert = prevPrintAssert._val;
	},
//	assertFlag : function(){
//		return this._printAssert;
//	},

	setWarnFlag : function( flag ){
		var printWarn     = new _Boolean( this._printWarn     );
		var prevPrintWarn = new _Boolean( this._prevPrintWarn );
		this._setFlag( flag, printWarn, prevPrintWarn );
		this._printWarn     = printWarn    ._val;
		this._prevPrintWarn = prevPrintWarn._val;
	},
//	warnFlag : function(){
//		return this._printWarn;
//	},

	setGUpdateFlag : function( flag ){
		var gUpdateFlag     = new _Boolean( this._gUpdateFlag     );
		var prevGUpdateFlag = new _Boolean( this._prevGUpdateFlag );
		this._setFlag( flag, gUpdateFlag, prevGUpdateFlag );
		this._gUpdateFlag     = gUpdateFlag    ._val;
		this._prevGUpdateFlag = prevGUpdateFlag._val;
	},
//	gUpdateFlag : function(){
//		return this._gUpdateFlag;
//	},

	setAngType : function( type, updateFlag ){
		this._angType       = type;
		this._angUpdateFlag = updateFlag;
		setComplexAngType( this._angType );
	},
	getAngType : function( type/*_Integer*/, updateFlag/*_Boolean*/ ){
		type.set( this._angType );
		updateFlag.set( this._angUpdateFlag );
	},

	_index : function( param, code, token ){
		if( token == _CHAR_CODE_COLON ){
			var value = new _ProcVal( this, param );
			if( this._const( param, code, token, value ) == _CLIP_NO_ERR ){
				return _UNSIGNED( value.mat()._mat[0].toFloat(), _UMAX_8 );
			}
		}
		return token;
	},
	varIndexParam : function( param, token ){
		return this._index( param, _CLIP_CODE_VARIABLE, token );
	},
	autoVarIndex : function( param, token ){
		return param._var._label.checkLabel( token );
	},
	varIndexIndirect : function( param, code, token ){
		return (code == _CLIP_CODE_VARIABLE) ? this._index( param, code, token ) : this.autoVarIndex( param, token );
	},
	varIndexIndirectMove : function( param, code, token, moveFlag/*_Boolean*/ ){
		moveFlag.set( code == _CLIP_CODE_VARIABLE );
		return moveFlag._val ? this._index( param, code, token ) : this.autoVarIndex( param, token );
	},
	varIndexDirect : function( param, code, token ){
		return (code == _CLIP_CODE_VARIABLE) ? token : this.autoVarIndex( param, token );
	},
	varIndexDirectMove : function( param, code, token, moveFlag/*_Boolean*/ ){
		moveFlag.set( code == _CLIP_CODE_VARIABLE );
		return moveFlag._val ? token : this.autoVarIndex( param, token );
	},
	arrayIndexParam : function( param, token ){
		return this._index( param, _CLIP_CODE_ARRAY, token );
	},
	autoArrayIndex : function( param, token ){
		return param._array._label.checkLabel( token );
	},
	arrayIndexIndirect : function( param, code, token ){
		return (code == _CLIP_CODE_ARRAY) ? this._index( param, code, token ) : this.autoArrayIndex( param, token );
	},
	arrayIndexIndirectMove : function( param, code, token, moveFlag/*_Boolean*/ ){
		moveFlag.set( code == _CLIP_CODE_ARRAY );
		return moveFlag._val ? this._index( param, code, token ) : this.autoArrayIndex( param, token );
	},
	arrayIndexDirect : function( param, code, token ){
		return (code == _CLIP_CODE_ARRAY) ? token : this.autoArrayIndex( param, token );
	},
	arrayIndexDirectMove : function( param, code, token, moveFlag/*_Boolean*/ ){
		moveFlag.set( code == _CLIP_CODE_ARRAY );
		return moveFlag._val ? token : this.autoArrayIndex( param, token );
	},

	// 文字列を設定する
	_strSet : function( array, index, top, str ){
		var src, dst;
		var dst2 = new Array( 1 );
		array.resizeVector( index, top + str.length, 0.0, false );
		for( src = 0, dst = top; src < str.length; src++, dst++ ){
			dst2[0] = dst;
			array.set( index, dst2, 1, str.charCodeAt( src ), false );
		}
	},
	strSet : function( array, index, str ){
		this._strSet( array, index, 0, str );
	},
	strCat : function( array, index, str ){
		this._strSet( array, index, this.strLen( array, index ), str );
	},

	// 文字列を取得する
	strGet : function( array, index ){
		var str = new String();
		var len = this.strLen( array, index );
		for( var i = 0; i < len; i++ ){
			str += String.fromCharCode( _INT( array.val( index, i ).toFloat() ) );
		}
		return str;
	},

	// 文字列の長さを取得する
	strLen : function( array, index ){
		var len;
		for( len = 0; ; len++ ){
			if( array.val( index, len ).toFloat() == 0 ){
				break;
			}
		}
		return len;
	},

	// 文字列中の文字を小文字に変換する
	strLwr : function( array, index ){
		var chr;
		var dst = new Array( 1 );
		for( var i = 0; ; i++ ){
			if( (chr = array.val( index, i ).toFloat()) == 0 ){
				break;
			}
			if( (chr >= _CHAR_CODE_UA) && (chr <= _CHAR_CODE_UZ) ){
				dst[0] = i;
				array.set( index, dst, 1, chr - _CHAR_CODE_UA + _CHAR_CODE_LA, false );
			}
		}
	},

	// 文字列中の文字を大文字に変換する
	strUpr : function( array, index ){
		var chr;
		var dst = new Array( 1 );
		for( var i = 0; ; i++ ){
			if( (chr = array.val( index, i ).toFloat()) == 0 ){
				break;
			}
			if( (chr >= _CHAR_CODE_LA) && (chr <= _CHAR_CODE_LZ) ){
				dst[0] = i;
				array.set( index, dst, 1, chr - _CHAR_CODE_LA + _CHAR_CODE_UA, false );
			}
		}
	},

	// 計算する
	_setError : function( code, token ){
		this._errCode  = code;
		this._errToken = token;
	},
	_retError : function( err, code, token ){
		this._setError( code, token );
		return err;
	},
	_updateMatrix : function( param, mat/*_Matrix*/ ){
		var i;

		if( (param._mode & _CLIP_MODE_FLOAT) != 0 ){
			for( i = 0; i < mat._len; i++ ){
				mat._mat[i].setImag( 0.0 );
			}
		} else if( (param._mode & _CLIP_MODE_INT) != 0 ){
			if( this._printWarn && procWarnFlowFlag() ){
				var index = (param._mode & 0x000F);
				var minValue = _MIN_VALUE[index];
				var maxValue = _MAX_VALUE[index];
				var intValue;
				for( i = 0; i < mat._len; i++ ){
					intValue = _INT( mat._mat[i].toFloat() );
					if( (intValue < minValue) || (intValue > maxValue) ){
						this._errorProc( (intValue < minValue) ? _CLIP_PROC_WARN_UNDERFLOW : _CLIP_PROC_WARN_OVERFLOW, this._curLine._num, param, _CLIP_CODE_LABEL, "" + intValue );
					}
				}
			}

			switch( param._mode & _CLIP_MODE_MASK ){
			case _CLIP_MODE_S_CHAR:
				for( i = 0; i < mat._len; i++ ){
					mat._mat[i].ass( _SIGNED( mat._mat[i].toFloat(), _UMAX_8, _SMIN_8, _SMAX_8 ) );
				}
				break;
			case _CLIP_MODE_U_CHAR:
				for( i = 0; i < mat._len; i++ ){
					mat._mat[i].ass( _UNSIGNED( mat._mat[i].toFloat(), _UMAX_8 ) );
				}
				break;
			case _CLIP_MODE_S_SHORT:
				for( i = 0; i < mat._len; i++ ){
					mat._mat[i].ass( _SIGNED( mat._mat[i].toFloat(), _UMAX_16, _SMIN_16, _SMAX_16 ) );
				}
				break;
			case _CLIP_MODE_U_SHORT:
				for( i = 0; i < mat._len; i++ ){
					mat._mat[i].ass( _UNSIGNED( mat._mat[i].toFloat(), _UMAX_16 ) );
				}
				break;
			case _CLIP_MODE_S_LONG:
				for( i = 0; i < mat._len; i++ ){
					mat._mat[i].ass( _SIGNED( mat._mat[i].toFloat(), _UMAX_32, _SMIN_32, _SMAX_32 ) );
				}
				break;
			case _CLIP_MODE_U_LONG:
				for( i = 0; i < mat._len; i++ ){
					mat._mat[i].ass( _UNSIGNED( mat._mat[i].toFloat(), _UMAX_32 ) );
				}
				break;
			}
		}
	},
	_updateArrayNode : function( param, node ){
		var i;

		if( node._nodeNum > 0 ){
			for( i = 0; i < node._nodeNum; i++ ){
				this._updateArrayNode( param, node._node[i] );
			}
		}

		if( node._vectorNum > 0 ){
			if( (param._mode & _CLIP_MODE_FLOAT) != 0 ){
				for( i = 0; i < node._vectorNum; i++ ){
					node._vector[i].setImag( 0.0 );
				}
			} else if( (param._mode & _CLIP_MODE_INT) != 0 ){
				if( this._printWarn && procWarnFlowFlag() ){
					var index = (param._mode & 0x000F);
					var minValue = _MIN_VALUE[index];
					var maxValue = _MAX_VALUE[index];
					var intValue;
					for( i = 0; i < node._vectorNum; i++ ){
						intValue = _INT( node._vector[i].toFloat() );
						if( (intValue < minValue) || (intValue > maxValue) ){
							this._errorProc( (intValue < minValue) ? _CLIP_PROC_WARN_UNDERFLOW : _CLIP_PROC_WARN_OVERFLOW, this._curLine._num, param, _CLIP_CODE_LABEL, "" + intValue );
						}
					}
				}

				switch( param._mode & _CLIP_MODE_MASK ){
				case _CLIP_MODE_S_CHAR:
					for( i = 0; i < node._vectorNum; i++ ){
						node._vector[i].ass( _SIGNED( node._vector[i].toFloat(), _UMAX_8, _SMIN_8, _SMAX_8 ) );
					}
					break;
				case _CLIP_MODE_U_CHAR:
					for( i = 0; i < node._vectorNum; i++ ){
						node._vector[i].ass( _UNSIGNED( node._vector[i].toFloat(), _UMAX_8 ) );
					}
					break;
				case _CLIP_MODE_S_SHORT:
					for( i = 0; i < node._vectorNum; i++ ){
						node._vector[i].ass( _SIGNED( node._vector[i].toFloat(), _UMAX_16, _SMIN_16, _SMAX_16 ) );
					}
					break;
				case _CLIP_MODE_U_SHORT:
					for( i = 0; i < node._vectorNum; i++ ){
						node._vector[i].ass( _UNSIGNED( node._vector[i].toFloat(), _UMAX_16 ) );
					}
					break;
				case _CLIP_MODE_S_LONG:
					for( i = 0; i < node._vectorNum; i++ ){
						node._vector[i].ass( _SIGNED( node._vector[i].toFloat(), _UMAX_32, _SMIN_32, _SMAX_32 ) );
					}
					break;
				case _CLIP_MODE_U_LONG:
					for( i = 0; i < node._vectorNum; i++ ){
						node._vector[i].ass( _UNSIGNED( node._vector[i].toFloat(), _UMAX_32 ) );
					}
					break;
				}
			}
		}
	},
	_updateArray : function( param, array, index ){
		this._updateArrayNode( param, array._node[index] );
		this._updateMatrix( param, array._mat[index] );
	},
	_updateValue : function( param, val/*_Value*/ ){
		if( (param._mode & _CLIP_MODE_FLOAT) != 0 ){
			val.setImag( 0.0 );
		} else if( (param._mode & _CLIP_MODE_INT) != 0 ){
			if( this._printWarn && procWarnFlowFlag() ){
				var index = (param._mode & 0x000F);
				var minValue = _MIN_VALUE[index];
				var maxValue = _MAX_VALUE[index];
				var intValue = _INT( val.toFloat() );
				if( (intValue < minValue) || (intValue > maxValue) ){
					this._errorProc( (intValue < minValue) ? _CLIP_PROC_WARN_UNDERFLOW : _CLIP_PROC_WARN_OVERFLOW, this._curLine._num, param, _CLIP_CODE_LABEL, "" + intValue );
				}
			}

			switch( param._mode & _CLIP_MODE_MASK ){
			case _CLIP_MODE_S_CHAR:
				val.ass( _SIGNED( val.toFloat(), _UMAX_8, _SMIN_8, _SMAX_8 ) );
				break;
			case _CLIP_MODE_U_CHAR:
				val.ass( _UNSIGNED( val.toFloat(), _UMAX_8 ) );
				break;
			case _CLIP_MODE_S_SHORT:
				val.ass( _SIGNED( val.toFloat(), _UMAX_16, _SMIN_16, _SMAX_16 ) );
				break;
			case _CLIP_MODE_U_SHORT:
				val.ass( _UNSIGNED( val.toFloat(), _UMAX_16 ) );
				break;
			case _CLIP_MODE_S_LONG:
				val.ass( _SIGNED( val.toFloat(), _UMAX_32, _SMIN_32, _SMAX_32 ) );
				break;
			case _CLIP_MODE_U_LONG:
				val.ass( _UNSIGNED( val.toFloat(), _UMAX_32 ) );
				break;
			}
		}
	},
	_procInitArray : function( param ){
		var flag;
		var code;
		var token;
		var ret = _CLIP_NO_ERR;
		var arrayList;
		var resizeList;
		var saveLine;
		var lock;
		var value = new _ProcVal( this, param );

		flag = false;
		while( this._curLine._token.getToken() ){
			code  = _get_code;
			token = _get_token;
			this._initArray.addCode( code, token );
			if( code == _CLIP_CODE_ARRAY_TOP ){
				this._initArrayCnt++;
				if( this._initArrayCnt > this._initArrayMax ){
					this._initArrayMax = this._initArrayCnt;
				}
			} else if( code == _CLIP_CODE_ARRAY_END ){
				if( this._initArrayCnt <= 0 ){
					ret = this._retError( _CLIP_PROC_ERR_ARRAY, code, token );
					flag = true;
					break;
				}
				this._initArrayCnt--;
				if( this._initArrayCnt <= 0 ){
					arrayList  = new Array( this._initArrayMax + 1 );
					resizeList = new Array( 3 );
					resizeList[0] = 0;
					resizeList[1] = 0;
					resizeList[2] = -1;
					saveLine = this._curLine._token;
					this._curLine._token = this._initArray;
					this._initArray.beginGetToken();
					while( true ){
						lock = this._initArray.lock();
						if( !(this._initArray.getToken()) ){
							break;
						}
						code  = _get_code;
						token = _get_token;
						if( code == _CLIP_CODE_ARRAY_TOP ){
							this._initArrayCnt++;
							arrayList[this._initArrayCnt - 1] = 0;
							arrayList[this._initArrayCnt    ] = -1;
						} else if( code == _CLIP_CODE_ARRAY_END ){
							this._initArrayCnt--;
							if( this._initArrayCnt > 0 ){
								arrayList[this._initArrayCnt - 1]++;
								arrayList[this._initArrayCnt    ] = -1;
							}
						} else {
							this._initArray.unlock( lock );
							if( this._const( param, code, token, value ) == _CLIP_NO_ERR ){
								if( this._initArrayCnt == 2 ){
									if( resizeList[0] < arrayList[0] ){
										resizeList[0] = arrayList[0];
									}
									if( resizeList[1] < arrayList[1] ){
										resizeList[1] = arrayList[1];
									}
								}
								param._array.resize(
									this._initArrayIndex,
									resizeList, arrayList, this._initArrayCnt,
									value.mat()._mat[0],
									this._initArrayMoveFlag._val
									);
								arrayList[this._initArrayCnt - 1]++;
							} else {
								ret = this._retError( _CLIP_PROC_ERR_ARRAY, code, token );
								flag = true;
								break;
							}
						}
					}
					this._curLine._token = saveLine;
					arrayList  = null;
					resizeList = null;

					flag = true;
					break;
				}
			}
		}
		if( flag ){
			this._initArrayFlag = false;
			this._initArray = null;
		}

		return (ret == _CLIP_NO_ERR) ? _CLIP_PROC_SUB_END : ret;
	},
	_getArrayInfo : function( param, code, token ){
		var lock;
		var value = new _ProcVal( this, param );
		var index;

		this._curInfo._curArray = new Array( 16 );
		for( this._curInfo._curArraySize = 0; ; this._curInfo._curArraySize++ ){
			lock = this._curLine._token.lock();
			if( this._const( param, code, token, value ) != _CLIP_NO_ERR ){
				this._curLine._token.unlock( lock );
				break;
			}
			index = _INT( value.mat()._mat[0].toFloat() ) - param._base;
			if( index < 0 ){
				this._errorProc( _CLIP_PROC_WARN_ARRAY, this._curLine._num, param, _CLIP_CODE_NULL, null );
				this._curInfo._curArray[this._curInfo._curArraySize] = _INVALID_ARRAY_INDEX;
			} else {
				this._curInfo._curArray[this._curInfo._curArraySize] = index;
			}
		}
		this._curInfo._curArray[this._curInfo._curArraySize] = -1;
	},
	_getParams : function( parentParam, code, token, funcParam/*_Token*/, seFlag ){
		var lock;
		var newCode;
		var newToken;
		var tmpValue = new _ProcVal( this, parentParam );

		while( this._curLine._token._get != null ){
			if( seFlag ){
				if( !(this._curLine._token.skipComma()) ){
					return false;
				}
			}

			lock = this._curLine._token.lock();
			if( !(this._curLine._token.getTokenParam( parentParam )) ){
				break;
			}
			newCode  = _get_code;
			newToken = _get_token;
			if(
				((newCode & (_CLIP_CODE_VAR_MASK | _CLIP_CODE_ARRAY_MASK)) != 0) ||
				(newCode == _CLIP_CODE_CONSTANT) ||
				(newCode == _CLIP_CODE_MULTIPREC) ||
				(newCode == _CLIP_CODE_STRING)
			){
				funcParam.addCode( newCode, newToken );
			} else {
				this._curLine._token.unlock( lock );
				if( this._const( parentParam, code, token, tmpValue ) == _CLIP_NO_ERR ){
					if( tmpValue._mpFlag ){
						funcParam.addMultiPrec( tmpValue._mp );
					} else if( tmpValue._mat._len > 1 ){
						funcParam.addMatrix( tmpValue._mat );
					} else {
						funcParam.addValue( tmpValue._mat._mat[0] );
					}
				} else {
					this._curLine._token.unlock( lock );
					break;
				}
			}
		}

		return true;
	},
	_formatError : function( format, funcName, error/*_String*/ ){
		if( funcName == null ){
			error.set( format );
		} else {
			this._formatFuncName( format, funcName, error );
		}
	},
	_checkSkipLoop : function(){
		return (this._statMode == _STAT_MODE_PROCESSING) && this._stat.checkBreak();
	},
	_checkSkipIf : function(){
		return ((this._statIfMode[this._statIfCnt] == _STAT_IFMODE_DISABLE) || (this._statIfMode[this._statIfCnt] == _STAT_IFMODE_PROCESSED)) ? true : this._checkSkipLoop();
	},
	_checkSkipSwi : function(){
		return ((this._statSwiMode[this._statSwiCnt] == _STAT_SWIMODE_DISABLE) || (this._statSwiMode[this._statSwiCnt] == _STAT_SWIMODE_PROCESSED)) ? true : this._checkSkipLoop();
	},
	_checkSkip : function(){
		return (
			((this._statIfMode [this._statIfCnt ] == _STAT_IFMODE_DISABLE ) || (this._statIfMode [this._statIfCnt ] == _STAT_IFMODE_PROCESSED )) ||
			((this._statSwiMode[this._statSwiCnt] == _STAT_SWIMODE_DISABLE) || (this._statSwiMode[this._statSwiCnt] == _STAT_SWIMODE_PROCESSED))
			) ? true : this._checkSkipLoop();
	},
	_processLoop : function( param ){
		var code;
		var token;

		this._curLine._token.beginGetToken();
		if( !(this._curLine._token.getTokenLock()) ){
			return _CLIP_PROC_SUB_END;
		}
		code  = _get_code;
		token = _get_token;

		switch( code ){
		case _CLIP_CODE_STATEMENT:
			if( !(param._enableStat) ){
				return _CLIP_LOOP_ERR_STAT;
			}

			this._setError( code, token );

			return _procSubLoop[token]( this );
		case _CLIP_CODE_COMMAND:
			if( !(param._enableCommand) ){
				return _CLIP_LOOP_ERR_COMMAND;
			}
			break;
		case _CLIP_CODE_SE:
			param._seFlag = true;
			param._seToken = token;
			break;
		}

		return this._checkSkip() ? _CLIP_PROC_SUB_END : _CLIP_NO_ERR;
	},
	_constFirst : function( param, code, token, value ){
		var newCode;
		var newToken;

		if( !(this._curLine._token.getTokenParam( param )) ){
			return this._retError( _CLIP_PROC_ERR_RVALUE_NULL, code, token );
		}
		newCode  = _get_code;
		newToken = _get_token;

		_proc_token.delToken( this._curInfo._assCode, this._curInfo._assToken );
		this._curInfo._assCode = newCode;
		this._curInfo._assToken = _proc_token.newToken( newCode, newToken );

		if( newCode == _CLIP_CODE_VARIABLE ){
			return this._procVariableFirst( param, newToken, value );
		} else if( newCode == _CLIP_CODE_ARRAY ){
			return this._procArrayFirst( param, newToken, value );
		} else if( (newCode & _CLIP_CODE_MASK) < _CLIP_CODE_PROC_END ){
			return _procSub[newCode & _CLIP_CODE_MASK]( this, param, newCode, newToken, value );
		} else {
			return this._retError( _CLIP_PROC_ERR_CONSTANT, newCode, newToken );
		}
	},
	_const : function( param, code, token, value ){
		var newCode;
		var newToken;

		if( !(this._curLine._token.getTokenParam( param )) ){
			return this._retError( _CLIP_PROC_ERR_RVALUE_NULL, code, token );
		}
		newCode  = _get_code;
		newToken = _get_token;

		if( (newCode & _CLIP_CODE_MASK) < _CLIP_CODE_PROC_END ){
			return _procSub[newCode & _CLIP_CODE_MASK]( this, param, newCode, newToken, value );
		} else {
			return this._retError( _CLIP_PROC_ERR_CONSTANT, newCode, newToken );
		}
	},
	_constSkip : function( code, token ){
		var subStep;
		var lock;

		subStep = 0;
		while( true ){
			lock = this._curLine._token.lock();
			if( this._curLine._token.getToken() ){
				switch( _get_code ){
				case _CLIP_CODE_TOP:
					subStep++;
					break;
				case _CLIP_CODE_END:
					subStep--;
					if( subStep < 0 ){
						this._curLine._token.unlock( lock );
						return _CLIP_NO_ERR;
					}
					break;
				case _CLIP_CODE_OPERATOR:
					if( subStep <= 0 ){
						this._curLine._token.unlock( lock );
						return _CLIP_NO_ERR;
					}
					break;
				}
			} else {
				break;
			}
		}

		return _CLIP_NO_ERR;
	},
	_constSkipConditional : function( code, token ){
		var subStep;

		subStep = 0;
		while( true ){
			if( this._curLine._token.getToken() ){
				switch( _get_code ){
				case _CLIP_CODE_TOP:
					subStep++;
					break;
				case _CLIP_CODE_END:
					subStep--;
					if( subStep < 0 ){
						return this._retError( _CLIP_PROC_ERR_RVALUE_NULL, code, token );
					}
					break;
				}
				if( subStep == 0 ){
					break;
				}
			} else {
				return this._retError( _CLIP_PROC_ERR_RVALUE_NULL, code, token );
			}
		}

		return _CLIP_NO_ERR;
	},
	_getString : function( param, string/*_String*/ ){
		var code;
		var token;
		if( this._curLine._token.getTokenParam( param ) ){
			code  = _get_code;
			token = _get_token;
			if( code == _CLIP_CODE_STRING ){
				string.set( token );
			} else if( (code & _CLIP_CODE_ARRAY_MASK) != 0 ){
				if( code == _CLIP_CODE_GLOBAL_ARRAY ){
					param = globalParam();
				}
				var arrayIndex = this.arrayIndexIndirect( param, code, token );
				string.set( this.strGet( param._array, arrayIndex ) );
			} else {
				string.set( null );
			}
		} else {
			string.set( null );
			return false;
		}
		return true;
	},
	_processOp : function( param, value ){
		var code;
		var token;

		if( !(this._curLine._token.getToken()) ){
			return this._retError( _CLIP_PROC_ERR_OPERATOR, _CLIP_CODE_NULL, null );
		}
		code  = _get_code;
		token = _get_token;

		if( (code == _CLIP_CODE_OPERATOR) && (token >= _CLIP_OP_UNARY_END) ){
			return _procSubOp[token]( this, param, code, token, value );
		} else {
			return this._retError( _CLIP_PROC_ERR_OPERATOR, code, token );
		}
	},
	_regInc : function( flag, param, code, token ){
		switch( this._curInfo._assCode ){
		case _CLIP_CODE_VARIABLE:
			if( param._var.isLocked( this._curInfo._assToken ) ){
				return this._retError( _CLIP_PROC_ERR_ASS, code, token );
			}
			this._regIncSub( flag, this._curInfo._assCode, this._curInfo._assToken, null, 0 );
			break;
		case _CLIP_CODE_GLOBAL_VAR:
			param = globalParam();
			// そのまま下に流す
		case _CLIP_CODE_AUTO_VAR:
			if( param._var.isLocked( this.autoVarIndex( param, this._curInfo._assToken ) ) ){
				return this._retError( _CLIP_PROC_ERR_ASS, code, token );
			}
			this._regIncSub( flag, this._curInfo._assCode, this._curInfo._assToken, null, 0 );
			break;
		case _CLIP_CODE_ARRAY:
		case _CLIP_CODE_AUTO_ARRAY:
		case _CLIP_CODE_GLOBAL_ARRAY:
			if( !(param._mpFlag) && (this._curInfo._curArraySize == 0) ){
				return this._retError( _CLIP_PROC_ERR_LVALUE, code, token );
			} else {
				this._regIncSub( flag, this._curInfo._assCode, this._curInfo._assToken, this._curInfo._curArray, this._curInfo._curArraySize );
			}
			break;
		default:
			return this._retError( _CLIP_PROC_ERR_LVALUE, code, token );
		}
		return _CLIP_NO_ERR;
	},
	_regIncSub : function( flag, code, token, array, arraySize ){
		var tmpInc = new __Inc();

		if( this._topInc == null ){
			// 先頭に登録する
			tmpInc._next = null;
			this._topInc = tmpInc;
			this._endInc = tmpInc;
		} else {
			// 最後尾に追加する
			tmpInc._next       = null;
			this._endInc._next = tmpInc;
			this._endInc       = tmpInc;
		}

		tmpInc._flag = flag;
		tmpInc._code  = code;
		tmpInc._token = _proc_token.newToken( code, token );
		if( array == null ){
			tmpInc._array = null;
		} else {
			tmpInc._array = new Array( arraySize + 1 );
			for( var i = 0; i < arraySize; i++ ){
				tmpInc._array[i] = array[i];
			}
			tmpInc._array[arraySize] = -1;
			tmpInc._arraySize = arraySize;
		}

		return tmpInc;
	},
	_delInc : function(){
		var cur;
		var tmp;

		cur = this._topInc;
		while( cur != null ){
			tmp = cur;
			cur = cur._next;

			_proc_token.delToken( tmp._code, tmp._token );
			if( tmp._array != null ){
				tmp._array = null;
			}
		}
		this._topInc = null;
	},
	_processInc : function( param ){
		var cur;
		var index;
		var val = new _Value();

		cur = this._topInc;
		while( cur != null ){
			switch( cur._code ){
			case _CLIP_CODE_VARIABLE:
				index = cur._token;
				val.ass( param.val( index ) );

				this._updateValue( param, val );
				if( cur._flag ){
					val.addAndAss( 1.0 );
				} else {
					val.subAndAss( 1.0 );
				}

				param.setVal( index, val, true );
				break;
			case _CLIP_CODE_AUTO_VAR:
				index = this.autoVarIndex( param, cur._token );
				val.ass( param.val( index ) );

				this._updateValue( param, val );
				if( cur._flag ){
					val.addAndAss( 1.0 );
				} else {
					val.subAndAss( 1.0 );
				}

				param.setVal( index, val, false );
				break;
			case _CLIP_CODE_GLOBAL_VAR:
				index = this.autoVarIndex( globalParam(), cur._token );
				val.ass( globalParam().val( index ) );

				this._updateValue( globalParam(), val );
				if( cur._flag ){
					val.addAndAss( 1.0 );
				} else {
					val.subAndAss( 1.0 );
				}

				globalParam().setVal( index, val, false );
				break;
			case _CLIP_CODE_ARRAY:
				index = cur._token;
				if( cur._arraySize == 0 ){
					param._array.move( index );
					if( cur._flag ){
						_proc_mp.fadd( param._array._mp[index], param._array._mp[index], _proc_mp.F( "1.0" ) );
					} else {
						_proc_mp.fsub( param._array._mp[index], param._array._mp[index], _proc_mp.F( "1.0" ) );
					}
				} else {
					val.ass( param._array.val( index, cur._array, cur._arraySize ) );

					this._updateValue( param, val );
					if( cur._flag ){
						val.addAndAss( 1.0 );
					} else {
						val.subAndAss( 1.0 );
					}

					param._array.set( index, cur._array, cur._arraySize, val, true );
				}
				break;
			case _CLIP_CODE_AUTO_ARRAY:
				index = this.autoArrayIndex( param, cur._token );
				if( cur._arraySize == 0 ){
					if( cur._flag ){
						_proc_mp.fadd( param._array._mp[index], param._array._mp[index], _proc_mp.F( "1.0" ) );
					} else {
						_proc_mp.fsub( param._array._mp[index], param._array._mp[index], _proc_mp.F( "1.0" ) );
					}
				} else {
					val.ass( param._array.val( index, cur._array, cur._arraySize ) );

					this._updateValue( param, val );
					if( cur._flag ){
						val.addAndAss( 1.0 );
					} else {
						val.subAndAss( 1.0 );
					}

					param._array.set( index, cur._array, cur._arraySize, val, false );
				}
				break;
			case _CLIP_CODE_GLOBAL_ARRAY:
				index = this.autoArrayIndex( globalParam(), cur._token );
				if( cur._arraySize == 0 ){
					if( cur._flag ){
						_proc_mp.fadd( globalParam()._array._mp[index], globalParam()._array._mp[index], _proc_mp.F( "1.0" ) );
					} else {
						_proc_mp.fsub( globalParam()._array._mp[index], globalParam()._array._mp[index], _proc_mp.F( "1.0" ) );
					}
				} else {
					val.ass( globalParam()._array.val( index, cur._array, cur._arraySize ) );

					this._updateValue( globalParam(), val );
					if( cur._flag ){
						val.addAndAss( 1.0 );
					} else {
						val.subAndAss( 1.0 );
					}

					globalParam()._array.set( index, cur._array, cur._arraySize, val, false );
				}
				break;
			}
			cur = cur._next;
		}

		this._delInc();
	},
	_processSub : function( param, value ){
		var ret = _CLIP_NO_ERR;
		var lock;
		var code;
		var token;

		var savInfo;
		var subInfo = new __ProcInfo();
		savInfo = this._curInfo;
		this._curInfo = subInfo;

		lock = this._curLine._token.lock();
		if( (ret = this._processOp( param, value )) != _CLIP_NO_ERR ){
			this._curLine._token.unlock( lock );
			if( (ret = this._constFirst( param, _CLIP_CODE_NULL, null, value )) != _CLIP_NO_ERR ){
				this._curInfo = savInfo;
				_proc_token.delToken( subInfo._assCode, subInfo._assToken );
				subInfo._curArray = null;
				return ret;
			}

			var tmpValue1 = new _ProcVal( this, param );

			lock = this._curLine._token.lock();
			if( this._const( param, _CLIP_CODE_NULL, null, tmpValue1 ) != _CLIP_NO_ERR ){
				this._curLine._token.unlock( lock );
			} else if( (param._mode & _CLIP_MODE_COMPLEX) != 0 ){
				if( this._curLine._token.checkToken( _CLIP_CODE_END ) ){
					this._curLine._token.getToken();
					code  = _get_code;
					token = _get_token;

					this._curInfo = savInfo;
					_proc_token.delToken( subInfo._assCode, subInfo._assToken );
					subInfo._curArray = null;
					return this._retError( _CLIP_PROC_ERR_COMPLEX, code, token );
				} else {
					value.mat()._mat[0].setImag( tmpValue1.mat()._mat[0].real() );

					this._curLine._token.getToken();

					this._curInfo = savInfo;
					_proc_token.delToken( subInfo._assCode, subInfo._assToken );
					subInfo._curArray = null;
					return _CLIP_NO_ERR;
				}
			} else if( (param._mode & (_CLIP_MODE_FLOAT | _CLIP_MODE_FRACT)) != 0 ){
				var tmpValue2 = new _ProcVal( this, param );

				lock = this._curLine._token.lock();
				if( this._const( param, _CLIP_CODE_NULL, null, tmpValue2 ) != _CLIP_NO_ERR ){
					value.mat().divAndAss( tmpValue1.mat()._mat[0].toFloat() );

					this._curLine._token.unlock( lock );
				} else if( this._curLine._token.checkToken( _CLIP_CODE_END ) ){
					this._curLine._token.getToken();
					code  = _get_code;
					token = _get_token;

					this._curInfo = savInfo;
					_proc_token.delToken( subInfo._assCode, subInfo._assToken );
					subInfo._curArray = null;
					return this._retError( _CLIP_PROC_ERR_FRACT, code, token );
				} else {
					tmpValue1.mat().divAndAss( tmpValue2.mat()._mat[0].toFloat() );
					value.mat().addAndAss( tmpValue1.mat() );

					this._curLine._token.getToken();

					this._curInfo = savInfo;
					_proc_token.delToken( subInfo._assCode, subInfo._assToken );
					subInfo._curArray = null;
					return _CLIP_NO_ERR;
				}
			}
		}

		while( this._curLine._token.checkToken( _CLIP_CODE_END ) ){
			if( (ret = this._processOp( param, value )) != _CLIP_NO_ERR ){
				this._curInfo = savInfo;
				_proc_token.delToken( subInfo._assCode, subInfo._assToken );
				subInfo._curArray = null;
				return ret;
			}
		}

		this._curLine._token.getToken();

		this._curInfo = savInfo;
		_proc_token.delToken( subInfo._assCode, subInfo._assToken );
		subInfo._curArray = null;
		return ret;
	},
	_processSe : function( param, value ){
		var ret;

		if( (ret = this._constFirst( param, _CLIP_CODE_SE, param._seToken, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		var saveArray     = this._curInfo._curArray;
		var saveArraySize = this._curInfo._curArraySize;

		if( param._seToken < _CLIP_SE_FUNC ){
			ret = _procSubSe[param._seToken]( this, param, _CLIP_CODE_SE, param._seToken, value );
		} else {
			ret = this._procFunc( this, param, _CLIP_CODE_FUNCTION, param._seToken - _CLIP_SE_FUNC, value, true );
		}

		if( ret == _CLIP_NO_ERR ){
			if( this._curLine._token._get != null ){
				ret = this._retError( _CLIP_PROC_ERR_SE_OPERAND, _CLIP_CODE_SE, param._seToken );
			} else {
				if( !(param._mpFlag) ){
					this._updateMatrix( param, value.mat() );
				}
				ret = this._assVal( param, _CLIP_CODE_SE, param._seToken, saveArray, saveArraySize, value );
			}
		}

		saveArray = null;

		return ret;
	},
	_processFirst : function( param, ret/*_Integer*/ ){
		if( this._curLine._token._top == null ){
			ret.set( _CLIP_PROC_END );
			return false;
		}

		// インクリメント情報を消去する
		if( this._topInc != null ){
			this._delInc();
		}

		if( procTraceFlag() ){
			printTrace( param, this._curLine._token, this._curLine._num, this._curLine._comment, this._checkSkip() );
		}

		return true;
	},
	_processNext : function( param, ret/*_Integer*/ ){
		while( true ){
			if( ret.set( this._processLoop( param ) )._val != _CLIP_NO_ERR ){
				break;
			}

			if( this._initArrayFlag ){
				this._curLine._token.beginGetToken();
				ret.set( this._procInitArray( param ) );
				break;
			}

			param._assFlag = false;
			param._subStep = 0;

			param._mpFlag = param.isMultiPrec();

			this._curLine._token.beginGetToken();
			if( param._seFlag ){
				this._curLine._token.skipToken();
				if( ret.set( this._processSe( param, this._valSeAns.setParam( param ) ) )._val != _CLIP_NO_ERR ){
					break;
				}

				param._mpFlag = this._valAns._mpFlag;
			} else {
				if( this._valAns._mpFlag ){
					this._valAns._mp = Array.from( param._array._mp[0] );
				} else {
					this._valAns._mat.ass( param._array._mat[0] );
				}

				if( ret.set( this._processSub( param, this._valAns.setParam( param ) ) )._val != _CLIP_NO_ERR ){
					break;
				}

				param._mpFlag = this._valAns._mpFlag;

				if( !(param._assFlag) ){
					// 計算結果用変数の値を更新
					param._array.move( 0 );
					if( this._valAns._mpFlag ){
						param._array._mp[0] = Array.from( this._valAns._mp );
					} else {
						param._array._mat[0].ass( this._valAns._mat );
						if( param.isMultiPrec() ){
							param._array._mp[0] = Array.from( this._valAns.mp() );
						}
					}
				}
			}

			ret.set( _CLIP_PROC_END );
			break;
		}

		// 計算結果の表示前に、インクリメントさせる
		if( this._topInc != null ){
			this._processInc( param );
		}

		if( param._seFlag ){
			param._seFlag = false;
		} else {
			if( (this._curLine._next == null) && this._printAns && !(param._assFlag) ){
				if( ret._val == _CLIP_PROC_END ){
					this.printAns( param );
				}
			}
		}
	},
	_regProcess : function( line, err/*_Integer*/ ){
		this._curLine = line;

		if( this._statMode == _STAT_MODE_REGISTERING ){
			err.set( this._stat.regLine( this._curLine ) );
			switch( err._val ){
			case _CLIP_LOOP_CONT:
				break;
			case _CLIP_PROC_END:
				this._statMode = _STAT_MODE_PROCESSING;
				break;
			default:
				this._statMode = _STAT_MODE_NOT_START;
				return false;
			}
		}
		return true;
	},
	_process : function( param, err/*_Integer*/ ){
		switch( this._statMode ){
		case _STAT_MODE_NOT_START:
			if( this._processFirst( param, err ) ){
				this._processNext( param, err );
				if( ((err._val != _CLIP_PROC_END) && (err._val != _CLIP_PROC_SUB_END)) || this._quitFlag ){
					return false;
				}
			}
			break;
		case _STAT_MODE_PROCESSING:
			var line;
			while( (line = this._stat.getLine()) != null ){
				this._curLine = line;
				if( this._processFirst( param, err ) ){
					this._processNext( param, err );
					if( ((err._val != _CLIP_PROC_END) && (err._val != _CLIP_PROC_SUB_END)) || this._quitFlag ){
						this._statMode = _STAT_MODE_NOT_START;
						return false;
					}
				}
			}
			this._statMode = _STAT_MODE_NOT_START;
			break;
		}
		return true;
	},
	beginProcess : function( line, param, err/*_Integer*/ ){
		if( line instanceof _Line ){
			this._procLine = line.dup();

			err.set( _CLIP_NO_ERR );
			this._procLine.beginGetLine();
			return true;
		}

		this._procLine = new _Line( param._lineNum );

		if( err.set( this._procLine.regString( param, line, this._statMode != _STAT_MODE_REGISTERING ) )._val == _CLIP_NO_ERR ){
			this._procLine.beginGetLine();
			return true;
		}

		return false;
	},
	process : function( param, err/*_Integer*/ ){
		var line;

		if( (line = this._procLine.getLine()) == null ){
			return false;
		}

		// 置き換え
		var cur = line._token._top;
		if( cur != null ){
			if( (cur._code != _CLIP_CODE_COMMAND) || ((cur._token != _CLIP_COMMAND_USE) && (cur._token != _CLIP_COMMAND_UNUSE)) ){
				while( cur != null ){
					switch( cur._code ){
					case _CLIP_CODE_LABEL:
					case _CLIP_CODE_FUNCTION:
					case _CLIP_CODE_EXTFUNC:
						param.replace( cur );
						break;
					}
					cur = cur._next;
				}
			}
		}

		if( !this._regProcess( line, err ) ){
			return false;
		}
		if( !this._process( param, err ) ){
			return false;
		}

		if( err._val >= _CLIP_ERR_START ){
			if( this._quitFlag ){
				this._errorProc( err._val, this._curLine._num, param, this._errCode, this._errToken );
			} else if( err._val == _CLIP_LOOP_STOP ){
			} else {
				this._errorProc( err._val, this._curLine._num, param, this._errCode, this._errToken );
			}
		}

		if( (this._statMode == _STAT_MODE_NOT_START) && (this._stat != null) ){
			// 制御構造管理クラスを消去する
			this._stat = null;
		}

		return true;
	},
	termProcess : function( param, err/*_Integer*/ ){
		var ret;

		if( this._quitFlag ){
			if( err._val >= _CLIP_ERR_START ){
				this._errorProc( err._val, this._curLine._num, param, this._errCode, this._errToken );
			}
			ret = _CLIP_PROC_END;
		} else if( err._val == _CLIP_LOOP_STOP ){
			ret = _CLIP_LOOP_STOP;
		} else {
			if( err._val >= _CLIP_ERR_START ){
				ret = this._errorProc( err._val, this._curLine._num, param, this._errCode, this._errToken ) ? _CLIP_LOOP_STOP : _CLIP_LOOP_CONT;
			} else {
				ret = _CLIP_LOOP_CONT;
			}
		}

		if( (this._statMode == _STAT_MODE_NOT_START) && (this._stat != null) ){
			// 制御構造管理クラスを消去する
			this._stat = null;
		}

		this._curLine = this._defLine;
		this._procLine = null;

		return ret;
	},
	resetLoopCount : function(){
		if( this._loopCnt > procLoopCount() ){
			setProcLoopCount( this._loopCnt );
		}
		this._loopCnt = 0;
	},
	processLoop : function( line, param ){
		this.resetLoopCount();

		var err = new _Integer();
		if( this.beginProcess( line, param, err ) ){
			while( this.process( param, err ) ){}
		}
		this.termProcess( param, err );

		return err._val;
	},

	// テストする
	beginTestProcess : function( line, param, err/*_Integer*/ ){
		this._procLine = new _Line( param._lineNum );

		if( err.set( this._procLine.regString( param, line, false ) )._val == _CLIP_NO_ERR ){
			this._procLine.beginGetLine();
			return true;
		}

		return false;
	},
	testProcess : function( param, err/*_Integer*/ ){
		var line;

		if( (line = this._procLine.getLine()) == null ){
			return false;
		}

		printTest( param, line._token, line._num, line._comment );

		return true;
	},
	termTestProcess : function( param, err/*_Integer*/ ){
		var ret;

		if( err._val >= _CLIP_ERR_START ){
			ret = this._errorProc( err._val, this._curLine._num, param, this._errCode, this._errToken ) ? _CLIP_LOOP_STOP : _CLIP_LOOP_CONT;
		} else {
			ret = _CLIP_LOOP_CONT;
		}

		this._procLine = null;

		return ret;
	},
	testProcessLoop : function( line, param ){
		this.resetLoopCount();

		var err = new _Integer();
		if( this.beginTestProcess( line, param, err ) ){
			while( this.testProcess( param, err ) ){}
		}
		this.termTestProcess( param, err );
		return err._val;
	},

	// 外部関数の引数を取り込む
	getParam : function( funcParam, parentParam, childParam ){
		var code;
		var token;
		var index;

		var saveLine = this._curLine._token;
		this._curLine._token = funcParam;

		var i = _CHAR_CODE_0;
		var j = 0;
		funcParam.beginGetToken();
		while( funcParam.getTokenParam( parentParam ) ){
			code  = _get_code;
			token = _get_token;
			if( j > 9 ){
				this._curLine._token = saveLine;
				return this._retError( _CLIP_PROC_ERR_FUNC_PARANUM, code, token );
			}
			childParam._updateParamCode[j] = code;
			switch( code ){
			case _CLIP_CODE_VARIABLE:
				index = this.varIndexParam( parentParam, token );
				childParam._updateParamIndex[j] = index;
				childParam._var.set( i, parentParam.val( index ), true );
				this._updateValue( parentParam, childParam._var.val( i ) );
				break;
			case _CLIP_CODE_AUTO_VAR:
				index = this.autoVarIndex( parentParam, token );
				childParam._updateParamIndex[j] = index;
				childParam._var.set( i, parentParam.val( index ), true );
				this._updateValue( parentParam, childParam._var.val( i ) );
				break;
			case _CLIP_CODE_GLOBAL_VAR:
				index = this.autoVarIndex( globalParam(), token );
				childParam._updateParamIndex[j] = index;
				childParam._var.set( i, globalParam().val( index ), true );
				this._updateValue( globalParam(), childParam._var.val( i ) );
				break;
			case _CLIP_CODE_ARRAY:
				index = this.arrayIndexParam( parentParam, token );
				childParam._updateParamIndex[j] = index;
				parentParam._array.dup( childParam._array, index, i, true );
				this._updateArray( parentParam, childParam._array, i );
				if( token == 0 ){
					childParam._var.set( i, parentParam.val( 0 ), true );
					this._updateValue( parentParam, childParam._var.val( i ) );
				}
				break;
			case _CLIP_CODE_AUTO_ARRAY:
				index = this.autoArrayIndex( parentParam, token );
				childParam._updateParamIndex[j] = index;
				parentParam._array.dup( childParam._array, index, i, true );
				this._updateArray( parentParam, childParam._array, i );
				break;
			case _CLIP_CODE_GLOBAL_ARRAY:
				index = this.autoArrayIndex( globalParam(), token );
				childParam._updateParamIndex[j] = index;
				globalParam()._array.dup( childParam._array, index, i, true );
				this._updateArray( globalParam(), childParam._array, i );
				break;
			case _CLIP_CODE_STRING:
				this.strSet( childParam._array, i, token );
				break;
			case _CLIP_CODE_CONSTANT:
				childParam._var.set( i, token, true );
				this._updateValue( parentParam, childParam._var.val( i ) );
				break;
			case _CLIP_CODE_MATRIX:
				childParam._array.setMatrix( i, token, true );
				this._updateMatrix( parentParam, childParam._array._mat[i] );
				break;
			case _CLIP_CODE_MULTIPREC:
				childParam._array.move( i );
				childParam._array._mp[i] = Array.from( token );

				{
					var str = _proc_mp.fnum2str( childParam._array._mp[i], parentParam._mpPrec );
					var val = stringToFloat( str, 0, new _Integer() );
					childParam._var.set( i, val, true );
					this._updateValue( parentParam, childParam._var.val( i ) );
				}

				break;
			default:
				this._curLine._token = saveLine;
				return this._retError( _CLIP_PROC_ERR_FUNC_PARACODE, code, token );
			}
			i++;
			j++;
		}

		this._curLine._token = saveLine;

		childParam._var.set( _CHAR_CODE_EX, j, true );

		return _CLIP_NO_ERR;
	},

	// 外部関数の引数に指定されている変数の値を更新する
	updateParam : function( parentParam, childParam ){
		var i, j;
		var index;

		j = childParam._updateParamCode.length;
		for( i = 0; i < j; i++ ){
			if( childParam._updateParam[i] ){
				switch( childParam._updateParamCode[i] ){
				case _CLIP_CODE_VARIABLE:
					index = childParam._updateParamIndex[i];
					if( parentParam.repVal( index, childParam._var.val( i + _CHAR_CODE_0 ), true ) ){
						if( index == 0 ){
							this._updateMatrix( childParam, parentParam._array._mat[index] );
						} else {
							this._updateValue( childParam, parentParam._var.val( index ) );
						}
					}
					break;
				case _CLIP_CODE_AUTO_VAR:
					index = childParam._updateParamIndex[i];
					if( parentParam.repVal( index, childParam._var.val( i + _CHAR_CODE_0 ), false ) ){
						if( index == 0 ){
							this._updateMatrix( childParam, parentParam._array._mat[index] );
						} else {
							this._updateValue( childParam, parentParam._var.val( index ) );
						}
					}
					break;
				case _CLIP_CODE_GLOBAL_VAR:
					index = childParam._updateParamIndex[i];
					if( globalParam().repVal( index, childParam._var.val( i + _CHAR_CODE_0 ), false ) ){
						if( index == 0 ){
							this._updateMatrix( childParam, globalParam()._array._mat[index] );
						} else {
							this._updateValue( childParam, globalParam()._var.val( index ) );
						}
					}
					break;
				case _CLIP_CODE_ARRAY:
					childParam._array.rep( parentParam._array, i + _CHAR_CODE_0, childParam._updateParamIndex[i], true );
					break;
				case _CLIP_CODE_AUTO_ARRAY:
					childParam._array.rep( parentParam._array, i + _CHAR_CODE_0, childParam._updateParamIndex[i], false );
					break;
				case _CLIP_CODE_GLOBAL_ARRAY:
					childParam._array.rep( globalParam()._array, i + _CHAR_CODE_0, childParam._updateParamIndex[i], false );
					break;
				}
			}
		}

		return _CLIP_NO_ERR;
	},

	// 親プロセスの変数・配列を更新する
	updateParent : function( parentParam, childParam ){
		var i, j;
		var index;

		// 変数
		j = childParam._updateParentVar.length;
		for( i = 0; i < j; i++ ){
			index = childParam._updateParentVar[i];
			parentParam.repVal( index, childParam._var.val( index ), true );
			if( index == 0 ){
				this._updateMatrix( childParam, parentParam._array._mat[index] );
			} else {
				this._updateValue( childParam, parentParam._var.val( index ) );
			}
		}

		// 配列
		j = childParam._updateParentArray.length;
		for( i = 0; i < j; i++ ){
			index = childParam._updateParentArray[i];
			childParam._array.rep( parentParam._array, index, index, true );
		}
	},

	// 計算結果の値を更新する
	updateAns : function( childParam ){
		if( this._angUpdateFlag && (complexAngType() != this._parentAngType) ){
			// 計算結果を親プロセスの角度の単位に変換する
			_proc_val.ass( childParam._array._mat[0]._mat[0] );
			_proc_val.angToAng( this._angType, this._parentAngType );
			childParam._array.setMatrix( 0, _proc_val, true );
		}
	},

	getExtFuncData : function( func/*_String*/, nameSpace ){
		var saveFunc = new String();
		saveFunc = func.str();
		var data = getExtFuncDataDirect( saveFunc );
		if( data != null ){
			return data;
		}
		var tmp = saveFunc.indexOf( ":" );
		if( tmp == 0 ){
			func.set( saveFunc.slice( 1 ) );
		} else if( (nameSpace != null) && (tmp < 0) ){
			func.set( nameSpace + ":" + saveFunc );
		}
		return getExtFuncDataNameSpace( func.str() );
	},

	newFuncCache : function( func, childParam, nameSpace ){
		var curFunc;

		if( procFunc()._max == 0 ){
			return null;
		}

		var func2 = new _String( func );
		var fileData = this.getExtFuncData( func2, nameSpace );
		if( fileData == null ){
			return null;
		}

		curFunc = procFunc().create( func2.str() );
		for( var i = 0; i < fileData.length; i++ ){
			if( curFunc._line.regString( childParam, fileData[i], false ) == _CLIP_PROC_WARN_DEAD_TOKEN ){
				errorProc( _CLIP_PROC_WARN_DEAD_TOKEN, curFunc._line._nextNum - 1, func, "" );
			}
		}

		return curFunc;
	},

	// 外部関数を実行する
	_beginMain : function( func, childParam, step/*_Integer*/, err/*_Integer*/, ret/*_Integer*/, funcParam, parentParam ){
		if( parentParam != null ){
			parentParam.updateMode();
			parentParam.updateFps ();

			childParam._parent = parentParam;
		}

		childParam._fileFlag = false;
		childParam._fileData = null;

		if( (parentParam != null) && (funcParam != null) ){
			// 外部関数の引数を取り込む
			if( err.set( this.getParam( funcParam, parentParam, childParam ) )._val != _CLIP_NO_ERR ){
				this._errorProc( err._val, 0, childParam, this._errCode, this._errToken );
				ret.set( _CLIP_LOOP_STOP );
				return false;
			}
		}

		childParam.updateMode();
		childParam.updateFps ();

		var func2 = new _String( func );
		childParam._fileData = this.getExtFuncData( func2, (parentParam == null) ? null : parentParam._nameSpace );
		childParam._fileDataGet = 0;

		if( childParam._fileData == null ){
			this._errorProc( _CLIP_PROC_ERR_FUNC_OPEN, 0, childParam, _CLIP_CODE_EXTFUNC, func );
			ret.set( _CLIP_LOOP_STOP );
			return false;
		}

		childParam._fileFlag = true;
		childParam._fileLine = null;

		childParam.setFunc( func2.str(), 0 );
		childParam._lineNum = 1;

		step.set( 0 );
		return true;
	},
	_beginMainCache : function( func, childParam, step/*_Integer*/, err/*_Integer*/, ret/*_Integer*/, funcParam, parentParam ){
		if( parentParam != null ){
			parentParam.updateMode();
			parentParam.updateFps ();

			childParam._parent = parentParam;
		}

		childParam._fileFlag = true;
		childParam._fileData = null;
		childParam._fileLine = func._line;

		if( (parentParam != null) && (funcParam != null) ){
			// 外部関数の引数を取り込む
			if( err.set( this.getParam( funcParam, parentParam, childParam ) )._val != _CLIP_NO_ERR ){
				this._errorProc( err._val, 0, childParam, this._errCode, this._errToken );
				ret.set( _CLIP_LOOP_STOP );
				return false;
			}
		}

		childParam.updateMode();
		childParam.updateFps ();

		childParam.setFunc( func._info._name, func._topNum );
		childParam._lineNum = 1;

		step.set( 0 );
		return true;
	},
	_termMain : function( func, childParam, parentParam ){
		if( childParam._fileFlag ){
			childParam._fileData = null;

			if( parentParam != null ){
				// 外部関数の引数に指定されている変数の値を更新する
				this.updateParam( parentParam, childParam );

				// 親プロセスの変数・配列を更新する
				this.updateParent( parentParam, childParam );
			}
		}

		// 計算結果の値を更新する
		this.updateAns( childParam );

		if( parentParam != null ){
			parentParam.updateMode();
			parentParam.updateFps ();
		}
	},
	_termMainCache : function( func, childParam, parentParam ){
		if( parentParam != null ){
			// 外部関数の引数に指定されている変数の値を更新する
			this.updateParam( parentParam, childParam );

			// 親プロセスの変数・配列を更新する
			this.updateParent( parentParam, childParam );
		}

		// 計算結果の値を更新する
		this.updateAns( childParam );

		if( parentParam != null ){
			parentParam.updateMode();
			parentParam.updateFps ();
		}
	},
	beginMain : function( func, childParam, step/*_Integer*/, err/*_Integer*/, ret/*_Integer*/, funcParam, parentParam ){
		if( func instanceof __Func ){
			return this._beginMainCache( func, childParam, step, err, ret, funcParam, parentParam );
		}
		return this._beginMain( func, childParam, step, err, ret, funcParam, parentParam );
	},
	main : function( func, childParam, step/*_Integer*/, err/*_Integer*/, ret/*_Integer*/ ){
		if( func instanceof __Func ){
			return _procMainCache[step._val]( this, func, childParam, step, err, ret );
		}
		return _procMain[step._val]( this, func, childParam, step, err, ret );
	},
	termMain : function( func, childParam, parentParam ){
		if( func instanceof __Func ){
			this._termMainCache( func, childParam, parentParam );
		} else {
			this._termMain( func, childParam, parentParam );
		}
	},
	getFuncName : function( func ){
		if( func instanceof __Func ){
			return func._info._name;
		}
		return func;
	},
	mpRound : function( param, val ){
		var tmp = new Array();
		if( (param._mode == _CLIP_MODE_I_MULTIPREC) && (_proc_mp.getPrec( val ) > 0) ){
			_proc_mp.ftrunc( tmp, val );
		} else {
			_proc_mp.fset( tmp, val );
			_proc_mp.fround( tmp, param._mpPrec, param._mpRound );
		}
		return tmp;
	},
	mpNum2Str : function( param, val ){
		var tmp = this.mpRound( param, val );
		return _proc_mp.fnum2str( tmp, param._mpPrec );
	},
	mpfCmp : function( param, val1, val2 ){
		var tmp1 = this.mpRound( param, val1 );
		var tmp2 = this.mpRound( param, val2 );
		return _proc_mp.fcmp( tmp1, tmp2 );
	},
	printAns : function( childParam ){
		if( childParam._mpFlag ){
			printAnsMultiPrec( this.mpNum2Str( childParam, childParam._array._mp[0] ) );
		} else if( childParam._array._mat[0]._len > 1 ){
			printAnsMatrix( childParam, childParam._array.makeToken( new _Token(), 0 ) );
		} else {
			var real = new _String();
			var imag = new _String();
			_proc_token.valueToString( childParam, childParam.val( 0 ), real, imag );
			printAnsComplex( real.str(), imag.str() );
		}
	},
	initInternalProc : function( childProc, func, childParam, parentParam ){
		if( parentParam != null ){
			// 定義定数をコピーする
			parentParam.dupDefine( childParam );

			// ユーザー定義関数を取り込む
			childParam._func.openAll( parentParam._func );

			childParam.setDefNameSpace( parentParam._defNameSpace );
		}

		// 関数の引数用変数にラベルを設定する
		childParam.setLabel( func._label );
	},
	mainLoop : function( func, childParam, funcParam, parentParam ){
		this.resetLoopCount();

		var step = new _Integer();
		var err = new _Integer();
		var ret = new _Integer();
		if( this.beginMain( func, childParam, step, err, ret, funcParam, parentParam ) ){
			while( this.main( func, childParam, step, err, ret ) ){}
		}
		this.termMain( func, childParam, parentParam );
		return ret._val;
	},

	// 外部関数をテストする
	beginTest : function( func, childParam, step/*_Integer*/, err/*_Integer*/, ret/*_Integer*/ ){
		return this._beginMain( func, childParam, step, err, ret, null, null );
	},
	test : function( func, childParam, step/*_Integer*/, err/*_Integer*/, ret/*_Integer*/ ){
		return _procTest[step._val]( this, func, childParam, step, err, ret );
	},
	termTest : function( func, childParam ){
		this._termMain( func, childParam, null );
	},
	testLoop : function( func, childParam ){
		this.resetLoopCount();

		var step = new _Integer();
		var err = new _Integer();
		var ret = new _Integer();
		if( this.beginTest( func, childParam, step, err, ret ) ){
			while( this.test( func, childParam, step, err, ret ) ){}
		}
		this.termTest( func, childParam );
		return ret._val;
	},

	_firstChar : function( line ){
		var i = 0;
		if( i < line.length ){
			while( isCharSpace( line, i ) || (line.charAt( i ) == '\t') ){
				i++;
				if( i >= line.length ){
					break;
				}
			}
		}
		return i;
	},
	_formatFuncName : function( format, funcName, usage/*_String*/ ){
		var i;

		var cur = 0;
		while( true ){
			if( (cur >= format.length) || isCharEnter( format, cur ) ){
				break;
			} else if( isCharEscape( format, cur ) ){
				cur++;
				if( (cur >= format.length) || isCharEnter( format, cur ) ){
					break;
				}
				usage.add( format.charAt( cur ) );
			} else if( format.charAt( cur ) == '-' ){
				for( i = 0; i < funcName.length; i++ ){
					usage.add( funcName.charAt( i ) );
				}
			} else {
				usage.add( format.charAt( cur ) );
			}
			cur++;
		}
	},
	_addUsage : function( format, funcName ){
		var usage = new _String();
		var tmpUsage;

		this._formatFuncName( format, funcName, usage );

		if( this._topUsage == null ){
			this._topUsage = new __ProcUsage();
			this._curUsage = this._topUsage;
		} else {
			tmpUsage = new __ProcUsage();
			this._curUsage._next = tmpUsage;
			this._curUsage = tmpUsage;
		}
		this._curUsage._string = new String();
		this._curUsage._string = usage.str();
	},
	usage : function( func, childParam, cacheFlag ){
		var curFunc;

		if( (curFunc = procFunc().search( func, false, null )) == null ){
			if( cacheFlag ){
				curFunc = this.newFuncCache( func, childParam, null );
			}
		}

		this._topUsage = null;

		if( curFunc != null ){
			var line;
			curFunc._line.beginGetLine();
			while( (line = curFunc._line.getLine()) != null ){
				if( (line._token.count() == 0) && (line._comment != null) ){
					if( line._comment.charAt( 0 ) != '!' ){
						this._addUsage( line._comment, func );
					}
				} else {
					break;
				}
			}
		} else {
			var cur;

			var func2 = new _String( func );
			var fileData = this.getExtFuncData( func2, null );
			if( fileData == null ){
				this._errorProc( _CLIP_PROC_ERR_FUNC_OPEN, 0, childParam, _CLIP_CODE_EXTFUNC, func );
				return;
			}

			for( var i = 0; i < fileData.length; i++ ){
				var string = fileData[i];
				cur = this._firstChar( string );
				if( (cur < string.length) && (string.charAt( cur ) == '#') ){
					cur++;
					if( (cur < string.length) && (string.charAt( cur ) == '!') ){
					} else if( cur >= string.length ){
						this._addUsage( "", func );
					} else {
						this._addUsage( string.slice( cur ), func );
					}
				} else {
					break;
				}
			}
		}

		doCommandUsage( this._topUsage );

		var tmpUsage;
		this._curUsage = this._topUsage;
		while( this._curUsage != null ){
			tmpUsage = this._curUsage;
			this._curUsage = this._curUsage._next;
			if( tmpUsage._string != null ){
				tmpUsage._string = null;
			}
		}
	},

	getAns : function( childParam, value, parentParam ){
		if( childParam._printAns ){
			if( childParam._mpFlag && parentParam._mpFlag ){
				if( (parentParam._mode == _CLIP_MODE_I_MULTIPREC) && (_proc_mp.getPrec( childParam._array._mp[0] ) > 0) ){
					_proc_mp.ftrunc( value.mp(), childParam._array._mp[0] );
				} else {
					_proc_mp.fset( value.mp(), childParam._array._mp[0] );
				}
			} else {
				if( childParam._mpFlag ){
					_proc_mp.fset( value.mp(), childParam._array._mp[0] );
				} else {
					value.matAss( childParam._array._mat[0] );
				}
				this._updateMatrix( parentParam, value.mat() );
			}
		} else {
			if( parentParam._subStep == 0 ){
				parentParam._assFlag = true;
			}
		}
	},

	_assertProc : function( num, param ){
		return assertProc(
			param._fileFlag ? ((param._topNum > 0) ? num - param._topNum + 1 : num) : 0,
			(param._funcName == null) ? "" : param._funcName
			);
	},
	_errorProc : function( err, num, param, code, token ){
		if( (err & _CLIP_PROC_WARN) != 0 ){
			if( !this._printWarn ){
				// 警告レベルで、警告メッセージOFFの場合は処理を行わない
				return false;
			}
			errorProc(
				err,
				param._fileFlag ? ((param._topNum > 0) ? num - param._topNum + 1 : num) : 0,
				(param._funcName == null) ? "" : param._funcName,
				_proc_token.tokenString( param, code, token )
				);
		} else if( (err & _CLIP_PROC_ERR) != 0 ){
			errorProc(
				err,
				param._fileFlag ? ((param._topNum > 0) ? num - param._topNum + 1 : num) : 0,
				(param._funcName == null) ? "" : param._funcName,
				_proc_token.tokenString( param, code, token )
				);
		} else if( err >= _CLIP_ERR_START ){
			errorProc(
				err,
				param._fileFlag ? ((param._topNum > 0) ? num - param._topNum + 1 : num) : 0,
				(param._funcName == null) ? "" : param._funcName,
				""
				);
		}
		return (((err & _CLIP_ERROR) != 0) && param._fileFlag);
	},
	doCommandPlot : function( childProc, childParam, graph, start, end, step ){
		childProc.setAngType( this._angType, false );
		switch( graph.mode() ){
		case _GRAPH_MODE_RECT:
			childParam._var._label.setLabel( _CHAR( 'x' ), "x", true );
			graph.setIndex( _CHAR( 'x' ) );
			break;
		case _GRAPH_MODE_PARAM:
		case _GRAPH_MODE_POLAR:
			childParam._var._label.setLabel( _CHAR( 't' ), "t", true );
			graph.setIndex( _CHAR( 't' ) );
			break;
		}
		graph.setStart( start );
		graph.setEnd  ( end   );
		graph.setStep ( step  );
		onStartPlot();
		graph.plot( childProc, childParam );
		onEndPlot();
	},
	doCommandRePlot : function( childProc, childParam, graph, start, end, step ){
		childProc.setAngType( this._angType, false );
		switch( graph.mode() ){
		case _GRAPH_MODE_RECT:
			childParam._var._label.setLabel( _CHAR( 'x' ), "x", true );
			graph.setIndex( _CHAR( 'x' ) );
			break;
		case _GRAPH_MODE_PARAM:
		case _GRAPH_MODE_POLAR:
			childParam._var._label.setLabel( _CHAR( 't' ), "t", true );
			graph.setIndex( _CHAR( 't' ) );
			break;
		}
		graph.setStart( start );
		graph.setEnd  ( end   );
		graph.setStep ( step  );
		onStartRePlot();
		graph.rePlot( childProc, childParam );
		onEndRePlot();
	},

	_getSeOperand : function( param, code, token, value/*_ProcVal*/ ){
		if( this._curLine._token.skipComma() ){
			return this._const( param, code, token, value );
		}
		return this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
	},
	_skipSeOperand : function( code, token ){
		if( this._curLine._token.skipComma() ){
			return this._constSkip( code, token );
		}
		return this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
	},

	_seNull : function( _this, param, code, token, value ){
		return _CLIP_PROC_ERR_SE_NULL;
	},
	_seIncrement : function( _this, param, code, token, value ){
		if( param._mpFlag ){
			_proc_mp.fadd( value.mp(), value.mp(), _proc_mp.F( "1.0" ) );
		} else {
			value.mat().addAndAss( 1.0 );
		}
		return _CLIP_NO_ERR;
	},
	_seDecrement : function( _this, param, code, token, value ){
		if( param._mpFlag ){
			_proc_mp.fsub( value.mp(), value.mp(), _proc_mp.F( "1.0" ) );
		} else {
			value.mat().subAndAss( 1.0 );
		}
		return _CLIP_NO_ERR;
	},
	_seNegative : function( _this, param, code, token, value ){
		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				_proc_mp.fneg( value.mp() );
			} else {
				_proc_mp.neg( value.mp() );
			}
		} else {
			value.matAss( value.mat().minus() );
		}
		return _CLIP_NO_ERR;
	},
	_seComplement : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( ~_INT( tmpValue.mat()._mat[0].toFloat() ) );
		return _CLIP_NO_ERR;
	},
	_seNot : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( (_INT( tmpValue.mat()._mat[0].toFloat() ) == 0) ? 1 : 0 );
		return _CLIP_NO_ERR;
	},
	_seMinus : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				_proc_mp.fneg( value.mp(), tmpValue.mp() );
			} else {
				_proc_mp.neg( value.mp(), tmpValue.mp() );
			}
		} else {
			value.matAss( tmpValue.mat().minus() );
		}
		return _CLIP_NO_ERR;
	},
	_seSet : function( _this, param, code, token, value ){
		var ret;

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		return _CLIP_NO_ERR;
	},
	_seSetC : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.mat()._mat[0].setImag( tmpValue.mat()._mat[0].real() );
		return _CLIP_NO_ERR;
	},
	_seSetF : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.mat().divAndAss( tmpValue.mat()._mat[0].toFloat() );
		return _CLIP_NO_ERR;
	},
	_seSetM : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = newProcValArray( 2, _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[0] )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != _CLIP_NO_ERR ){
			return ret;
		}

		tmpValue[0].mat().divAndAss( tmpValue[1].mat()._mat[0].toFloat() );
		value.mat().addAndAss( tmpValue[0].mat()._mat[0].toFloat() );
		return _CLIP_NO_ERR;
	},
	_seMul : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				_proc_mp.fmul( value.mp(), value.mp(), tmpValue.mp(), param._mpPrec + 1 );
			} else {
				_proc_mp.mul( value.mp(), value.mp(), tmpValue.mp() );
			}
		} else {
			value.mat().mulAndAss( tmpValue.mat() );
		}
		return _CLIP_NO_ERR;
	},
	_seDiv : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				if( _this._printWarn && (_proc_mp.fcmp( tmpValue.mp(), _proc_mp.F( "0.0" ) ) == 0) ){
					_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
				}
				_proc_mp.fdiv2( value.mp(), value.mp(), tmpValue.mp(), param._mpPrec + 1 );
			} else {
				if( _this._printWarn && (_proc_mp.cmp( tmpValue.mp(), _proc_mp.I( "0" ) ) == 0) ){
					_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
				}
				_proc_mp.div( value.mp(), value.mp(), tmpValue.mp() );
			}
		} else {
			if( _this._printWarn && tmpValue.mat().equal( 0.0 ) ){
				_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
			}
			value.mat().divAndAss( tmpValue.mat() );
		}
		return _CLIP_NO_ERR;
	},
	_seMod : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( _proc_mp.getPrec( value.mp() ) > 0 ){
				_proc_mp.ftrunc( value.mp(), value.mp() );
			}
			if( _proc_mp.getPrec( tmpValue.mp() ) > 0 ){
				_proc_mp.ftrunc( tmpValue.mp(), tmpValue.mp() );
			}
			if( _this._printWarn && (_proc_mp.cmp( tmpValue.mp(), _proc_mp.I( "0" ) ) == 0) ){
				_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
			}
			_proc_mp.div( new Array(), value.mp(), tmpValue.mp(), value.mp() );
		} else {
			if( _this._printWarn && tmpValue.mat().equal( 0.0 ) ){
				_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
			}
			value.mat().modAndAss( tmpValue.mat() );
		}
		return _CLIP_NO_ERR;
	},
	_seAdd : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				_proc_mp.fadd( value.mp(), value.mp(), tmpValue.mp() );
			} else {
				_proc_mp.add( value.mp(), value.mp(), tmpValue.mp() );
			}
		} else {
			value.mat().addAndAss( tmpValue.mat() );
		}
		return _CLIP_NO_ERR;
	},
	_seAddS : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = newProcValArray( 3, _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[0] )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[2] )) != _CLIP_NO_ERR ){
			return ret;
		}

		var a = value.mat()._mat[0].toFloat() + tmpValue[0].mat()._mat[0].toFloat();
		var b = tmpValue[1].mat()._mat[0].toFloat();
		var c = tmpValue[2].mat()._mat[0].toFloat();
		if( a < b ){
			value.matAss( b );
		} else if( a > c ){
			value.matAss( c );
		} else {
			value.matAss( a );
		}

		return _CLIP_NO_ERR;
	},
	_seSub : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				_proc_mp.fsub( value.mp(), value.mp(), tmpValue.mp() );
			} else {
				_proc_mp.sub( value.mp(), value.mp(), tmpValue.mp() );
			}
		} else {
			value.mat().subAndAss( tmpValue.mat() );
		}
		return _CLIP_NO_ERR;
	},
	_seSubS : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = newProcValArray( 3, _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[0] )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[2] )) != _CLIP_NO_ERR ){
			return ret;
		}

		var a = value.mat()._mat[0].toFloat() - tmpValue[0].mat()._mat[0].toFloat();
		var b = tmpValue[1].mat()._mat[0].toFloat();
		var c = tmpValue[2].mat()._mat[0].toFloat();
		if( a < b ){
			value.matAss( b );
		} else if( a > c ){
			value.matAss( c );
		} else {
			value.matAss( a );
		}

		return _CLIP_NO_ERR;
	},
	_sePow : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			var y = _INT( tmpValue.mat()._mat[0].toFloat() );
			var x = new Array();
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				_proc_mp.fset( x, value.mp() );
				for( var i = 1; i < y; i++ ){
					_proc_mp.fmul( value.mp(), value.mp(), x, param._mpPrec + 1 );
				}
			} else {
				_proc_mp.set( x, value.mp() );
				for( var i = 1; i < y; i++ ){
					_proc_mp.mul( value.mp(), value.mp(), x );
				}
			}
		} else {
			value.matAss( value.mat()._mat[0].pow( tmpValue.mat()._mat[0] ) );
		}
		return _CLIP_NO_ERR;
	},
	_seShiftL : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( _SHIFTL( _INT( value.mat()._mat[0].toFloat() ), _INT( tmpValue.mat()._mat[0].toFloat() ) ) );
		return _CLIP_NO_ERR;
	},
	_seShiftR : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( _SHIFTR( _INT( value.mat()._mat[0].toFloat() ), _INT( tmpValue.mat()._mat[0].toFloat() ) ) );
		return _CLIP_NO_ERR;
	},
	_seAND : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( _AND( _INT( value.mat()._mat[0].toFloat() ), _INT( tmpValue.mat()._mat[0].toFloat() ) ) );
		return _CLIP_NO_ERR;
	},
	_seOR : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( _OR( _INT( value.mat()._mat[0].toFloat() ), _INT( tmpValue.mat()._mat[0].toFloat() ) ) );
		return _CLIP_NO_ERR;
	},
	_seXOR : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( _XOR( _INT( value.mat()._mat[0].toFloat() ), _INT( tmpValue.mat()._mat[0].toFloat() ) ) );
		return _CLIP_NO_ERR;
	},
	_seLess : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				value.matAss( (_this.mpfCmp( param, value.mp(), tmpValue.mp() ) < 0) ? 1 : 0 );
			} else {
				value.matAss( (_proc_mp.cmp( value.mp(), tmpValue.mp() ) < 0) ? 1 : 0 );
			}
		} else {
			value.matAss( (value.mat()._mat[0].toFloat() < tmpValue.mat()._mat[0].toFloat()) ? 1 : 0 );
		}
		return _CLIP_NO_ERR;
	},
	_seLessOrEq : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				value.matAss( (_this.mpfCmp( param, value.mp(), tmpValue.mp() ) <= 0) ? 1 : 0 );
			} else {
				value.matAss( (_proc_mp.cmp( value.mp(), tmpValue.mp() ) <= 0) ? 1 : 0 );
			}
		} else {
			value.matAss( (value.mat()._mat[0].toFloat() <= tmpValue.mat()._mat[0].toFloat()) ? 1 : 0 );
		}
		return _CLIP_NO_ERR;
	},
	_seGreat : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				value.matAss( (_this.mpfCmp( param, value.mp(), tmpValue.mp() ) > 0) ? 1 : 0 );
			} else {
				value.matAss( (_proc_mp.cmp( value.mp(), tmpValue.mp() ) > 0) ? 1 : 0 );
			}
		} else {
			value.matAss( (value.mat()._mat[0].toFloat() > tmpValue.mat()._mat[0].toFloat()) ? 1 : 0 );
		}
		return _CLIP_NO_ERR;
	},
	_seGreatOrEq : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				value.matAss( (_this.mpfCmp( param, value.mp(), tmpValue.mp() ) >= 0) ? 1 : 0 );
			} else {
				value.matAss( (_proc_mp.cmp( value.mp(), tmpValue.mp() ) >= 0) ? 1 : 0 );
			}
		} else {
			value.matAss( (value.mat()._mat[0].toFloat() >= tmpValue.mat()._mat[0].toFloat()) ? 1 : 0 );
		}
		return _CLIP_NO_ERR;
	},
	_seEqual : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				value.matAss( (_this.mpfCmp( param, value.mp(), tmpValue.mp() ) == 0) ? 1 : 0 );
			} else {
				value.matAss( (_proc_mp.cmp( value.mp(), tmpValue.mp() ) == 0) ? 1 : 0 );
			}
		} else {
			value.matAss( value.mat().equal( tmpValue.mat() ) ? 1 : 0 );
		}
		return _CLIP_NO_ERR;
	},
	_seNotEqual : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				value.matAss( (_this.mpfCmp( param, value.mp(), tmpValue.mp() ) != 0) ? 1 : 0 );
			} else {
				value.matAss( (_proc_mp.cmp( value.mp(), tmpValue.mp() ) != 0) ? 1 : 0 );
			}
		} else {
			value.matAss( value.mat().notEqual( tmpValue.mat() ) ? 1 : 0 );
		}
		return _CLIP_NO_ERR;
	},
	_seLogAND : function( _this, param, code, token, value ){
		var ret;

		if( value.mat().notEqual( 0.0 ) ){
			var tmpValue = new _ProcVal( _this, param );

			if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
				return ret;
			}

			value.matAss( tmpValue.mat().notEqual( 0.0 ) ? 1 : 0 );
		} else {
			if( (ret = _this._skipSeOperand( code, token )) != _CLIP_NO_ERR ){
				return ret;
			}

			value.matAss( 0 );
		}
		return _CLIP_NO_ERR;
	},
	_seLogOR : function( _this, param, code, token, value ){
		var ret;

		if( value.mat().notEqual( 0.0 ) ){
			if( (ret = _this._skipSeOperand( code, token )) != _CLIP_NO_ERR ){
				return ret;
			}

			value.matAss( 1 );
		} else {
			var tmpValue = new _ProcVal( _this, param );

			if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
				return ret;
			}

			value.matAss( tmpValue.mat().notEqual( 0.0 ) ? 1 : 0 );
		}
		return _CLIP_NO_ERR;
	},
	_seMulAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				_proc_mp.fmul( value.mp(), value.mp(), tmpValue.mp(), param._mpPrec + 1 );
			} else {
				_proc_mp.mul( value.mp(), value.mp(), tmpValue.mp() );
			}
		} else {
			value.mat().mulAndAss( tmpValue.mat() );
		}
		return _CLIP_NO_ERR;
	},
	_seDivAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				if( _this._printWarn && (_proc_mp.fcmp( tmpValue.mp(), _proc_mp.F( "0.0" ) ) == 0) ){
					_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
				}
				_proc_mp.fdiv2( value.mp(), value.mp(), tmpValue.mp(), param._mpPrec + 1 );
			} else {
				if( _this._printWarn && (_proc_mp.cmp( tmpValue.mp(), _proc_mp.I( "0" ) ) == 0) ){
					_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
				}
				_proc_mp.div( value.mp(), value.mp(), tmpValue.mp() );
			}
		} else {
			if( _this._printWarn && tmpValue.mat().equal( 0.0 ) ){
				_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
			}
			value.mat().divAndAss( tmpValue.mat() );
		}
		return _CLIP_NO_ERR;
	},
	_seModAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( _proc_mp.getPrec( value.mp() ) > 0 ){
				_proc_mp.ftrunc( value.mp(), value.mp() );
			}
			if( _proc_mp.getPrec( tmpValue.mp() ) > 0 ){
				_proc_mp.ftrunc( tmpValue.mp(), tmpValue.mp() );
			}
			if( _this._printWarn && (_proc_mp.cmp( tmpValue.mp(), _proc_mp.I( "0" ) ) == 0) ){
				_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
			}
			_proc_mp.div( new Array(), value.mp(), tmpValue.mp(), value.mp() );
		} else {
			if( _this._printWarn && tmpValue.mat().equal( 0.0 ) ){
				_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
			}
			value.mat().modAndAss( tmpValue.mat() );
		}
		return _CLIP_NO_ERR;
	},
	_seAddAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				_proc_mp.fadd( value.mp(), value.mp(), tmpValue.mp() );
			} else {
				_proc_mp.add( value.mp(), value.mp(), tmpValue.mp() );
			}
		} else {
			value.mat().addAndAss( tmpValue.mat() );
		}
		return _CLIP_NO_ERR;
	},
	_seAddSAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = newProcValArray( 3, _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[0] )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[2] )) != _CLIP_NO_ERR ){
			return ret;
		}

		var a = value.mat()._mat[0].toFloat() + tmpValue[0].mat()._mat[0].toFloat();
		var b = tmpValue[1].mat()._mat[0].toFloat();
		var c = tmpValue[2].mat()._mat[0].toFloat();
		if( a < b ){
			value.matAss( b );
		} else if( a > c ){
			value.matAss( c );
		} else {
			value.matAss( a );
		}

		return _CLIP_NO_ERR;
	},
	_seSubAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				_proc_mp.fsub( value.mp(), value.mp(), tmpValue.mp() );
			} else {
				_proc_mp.sub( value.mp(), value.mp(), tmpValue.mp() );
			}
		} else {
			value.mat().subAndAss( tmpValue.mat() );
		}
		return _CLIP_NO_ERR;
	},
	_seSubSAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = newProcValArray( 3, _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[0] )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[2] )) != _CLIP_NO_ERR ){
			return ret;
		}

		var a = value.mat()._mat[0].toFloat() - tmpValue[0].mat()._mat[0].toFloat();
		var b = tmpValue[1].mat()._mat[0].toFloat();
		var c = tmpValue[2].mat()._mat[0].toFloat();
		if( a < b ){
			value.matAss( b );
		} else if( a > c ){
			value.matAss( c );
		} else {
			value.matAss( a );
		}

		return _CLIP_NO_ERR;
	},
	_sePowAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			var y = _INT( tmpValue.mat()._mat[0].toFloat() );
			var x = new Array();
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				_proc_mp.fset( x, value.mp() );
				for( var i = 1; i < y; i++ ){
					_proc_mp.fmul( value.mp(), value.mp(), x, param._mpPrec + 1 );
				}
			} else {
				_proc_mp.set( x, value.mp() );
				for( var i = 1; i < y; i++ ){
					_proc_mp.mul( value.mp(), value.mp(), x );
				}
			}
		} else {
			value.matAss( value.mat()._mat[0].pow( tmpValue.mat()._mat[0] ) );
		}
		return _CLIP_NO_ERR;
	},
	_seShiftLAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( _SHIFTL( _INT( value.mat()._mat[0].toFloat() ), _INT( tmpValue.mat()._mat[0].toFloat() ) ) );
		return _CLIP_NO_ERR;
	},
	_seShiftRAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( _SHIFTR( _INT( value.mat()._mat[0].toFloat() ), _INT( tmpValue.mat()._mat[0].toFloat() ) ) );
		return _CLIP_NO_ERR;
	},
	_seANDAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( _AND( _INT( value.mat()._mat[0].toFloat() ), _INT( tmpValue.mat()._mat[0].toFloat() ) ) );
		return _CLIP_NO_ERR;
	},
	_seORAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( _OR( _INT( value.mat()._mat[0].toFloat() ), _INT( tmpValue.mat()._mat[0].toFloat() ) ) );
		return _CLIP_NO_ERR;
	},
	_seXORAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( _XOR( _INT( value.mat()._mat[0].toFloat() ), _INT( tmpValue.mat()._mat[0].toFloat() ) ) );
		return _CLIP_NO_ERR;
	},
	_seLessAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				value.matAss( (_this.mpfCmp( param, value.mp(), tmpValue.mp() ) < 0) ? 1 : 0 );
			} else {
				value.matAss( (_proc_mp.cmp( value.mp(), tmpValue.mp() ) < 0) ? 1 : 0 );
			}
		} else {
			value.matAss( (value.mat()._mat[0].toFloat() < tmpValue.mat()._mat[0].toFloat()) ? 1 : 0 );
		}
		return _CLIP_NO_ERR;
	},
	_seLessOrEqAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				value.matAss( (_this.mpfCmp( param, value.mp(), tmpValue.mp() ) <= 0) ? 1 : 0 );
			} else {
				value.matAss( (_proc_mp.cmp( value.mp(), tmpValue.mp() ) <= 0) ? 1 : 0 );
			}
		} else {
			value.matAss( (value.mat()._mat[0].toFloat() <= tmpValue.mat()._mat[0].toFloat()) ? 1 : 0 );
		}
		return _CLIP_NO_ERR;
	},
	_seGreatAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				value.matAss( (_this.mpfCmp( param, value.mp(), tmpValue.mp() ) > 0) ? 1 : 0 );
			} else {
				value.matAss( (_proc_mp.cmp( value.mp(), tmpValue.mp() ) > 0) ? 1 : 0 );
			}
		} else {
			value.matAss( (value.mat()._mat[0].toFloat() > tmpValue.mat()._mat[0].toFloat()) ? 1 : 0 );
		}
		return _CLIP_NO_ERR;
	},
	_seGreatOrEqAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				value.matAss( (_this.mpfCmp( param, value.mp(), tmpValue.mp() ) >= 0) ? 1 : 0 );
			} else {
				value.matAss( (_proc_mp.cmp( value.mp(), tmpValue.mp() ) >= 0) ? 1 : 0 );
			}
		} else {
			value.matAss( (value.mat()._mat[0].toFloat() >= tmpValue.mat()._mat[0].toFloat()) ? 1 : 0 );
		}
		return _CLIP_NO_ERR;
	},
	_seEqualAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				value.matAss( (_this.mpfCmp( param, value.mp(), tmpValue.mp() ) == 0) ? 1 : 0 );
			} else {
				value.matAss( (_proc_mp.cmp( value.mp(), tmpValue.mp() ) == 0) ? 1 : 0 );
			}
		} else {
			value.matAss( value.mat().equal( tmpValue.mat() ) ? 1 : 0 );
		}
		return _CLIP_NO_ERR;
	},
	_seNotEqualAndAss : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				value.matAss( (_this.mpfCmp( param, value.mp(), tmpValue.mp() ) != 0) ? 1 : 0 );
			} else {
				value.matAss( (_proc_mp.cmp( value.mp(), tmpValue.mp() ) != 0) ? 1 : 0 );
			}
		} else {
			value.matAss( value.mat().notEqual( tmpValue.mat() ) ? 1 : 0 );
		}
		return _CLIP_NO_ERR;
	},
	_seLogANDAndAss : function( _this, param, code, token, value ){
		var ret;

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( value.mat().notEqual( 0.0 ) ){
			var tmpValue = new _ProcVal( _this, param );

			if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
				return ret;
			}

			value.matAss( tmpValue.mat().notEqual( 0.0 ) ? 1 : 0 );
		} else {
			if( (ret = _this._skipSeOperand( code, token )) != _CLIP_NO_ERR ){
				return ret;
			}

			value.matAss( 0 );
		}
		return _CLIP_NO_ERR;
	},
	_seLogORAndAss : function( _this, param, code, token, value ){
		var ret;

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( value.mat().notEqual( 0.0 ) ){
			if( (ret = _this._skipSeOperand( code, token )) != _CLIP_NO_ERR ){
				return ret;
			}

			value.matAss( 1 );
		} else {
			var tmpValue = new _ProcVal( _this, param );

			if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
				return ret;
			}

			value.matAss( tmpValue.mat().notEqual( 0.0 ) ? 1 : 0 );
		}
		return _CLIP_NO_ERR;
	},
	_seConditional : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );
		if( (ret = _this._getSeOperand( param, code, token, tmpValue )) == _CLIP_NO_ERR ){
			if( tmpValue.mat().notEqual( 0.0 ) ){
				if( (ret = _this._getSeOperand( param, code, token, value )) == _CLIP_NO_ERR ){
					ret = _this._skipSeOperand( code, token );
				}
			} else {
				if( (ret = _this._skipSeOperand( code, token )) == _CLIP_NO_ERR ){
					ret = _this._getSeOperand( param, code, token, value );
				}
			}
		}
		return ret;
	},
	_seSetFALSE : function( _this, param, code, token, value ){
		value.matAss( 0 );
		return _CLIP_NO_ERR;
	},
	_seSetTRUE : function( _this, param, code, token, value ){
		value.matAss( 1 );
		return _CLIP_NO_ERR;
	},
	_seSetZero : function( _this, param, code, token, value ){
		if( param._mpFlag ){
			_proc_mp.fset( value.mp(), _proc_mp.F( "0.0" ) );
		} else {
			value.matAss( 0.0 );
		}
		return _CLIP_NO_ERR;
	},
	_seSaturate : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = newProcValArray( 2, _this, param );

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[0] )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != _CLIP_NO_ERR ){
			return ret;
		}

		var a = value.mat()._mat[0].toFloat();
		var b = tmpValue[0].mat()._mat[0].toFloat();
		var c = tmpValue[1].mat()._mat[0].toFloat();
		if( a < b ){
			value.matAss( b );
		} else if( a > c ){
			value.matAss( c );
		}

		return _CLIP_NO_ERR;
	},
	_seSetS : function( _this, param, code, token, value ){
		var ret;
		var tmpValue = newProcValArray( 2, _this, param );

		if( (ret = _this._getSeOperand( param, code, token, value )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[0] )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != _CLIP_NO_ERR ){
			return ret;
		}

		var a = value.mat()._mat[0].toFloat();
		var b = tmpValue[0].mat()._mat[0].toFloat();
		var c = tmpValue[1].mat()._mat[0].toFloat();
		if( a < b ){
			value.matAss( b );
		} else if( a > c ){
			value.matAss( c );
		}

		return _CLIP_NO_ERR;
	},

	mpPow : function( param, ret/*Array*/, x/*Array*/, y ){
		x = _proc_mp.clone( x );
		if( param._mode == _CLIP_MODE_F_MULTIPREC ){
/*
			_proc_mp.fset( ret, x );
			for( var i = 1; i < y; i++ ){
				_proc_mp.fmul( ret, ret, x, param._mpPrec + 1 );
			}
*/
			_proc_mp.fset( ret, _proc_mp.F( "1.0" ) );
			while( y > 0 ){
				if( (y % 2) == 0 ){
					_proc_mp.fmul( x, x, x, param._mpPrec + 1 );
					y /= 2;
				} else {
					_proc_mp.fmul( ret, ret, x, param._mpPrec + 1 );
					y--;
				}
			}
		} else {
/*
			_proc_mp.set( ret, x );
			for( var i = 1; i < y; i++ ){
				_proc_mp.mul( ret, ret, x );
			}
*/
			_proc_mp.set( ret, _proc_mp.I( "1" ) );
			while( y > 0 ){
				if( (y % 2) == 0 ){
					_proc_mp.mul( x, x, x );
					y /= 2;
				} else {
					_proc_mp.mul( ret, ret, x );
					y--;
				}
			}
		}
	},
	_mpCombination : function( n, r ){
		n = _INT( n );
		r = _INT( r );

		var ret;

		ret = new Array();
		if( n < r ){
			_proc_mp.set( ret, _proc_mp.I( "0" ) );
			return ret;
		}
		if( n - r < r ) r = n - r;
		if( r == 0 ){
			_proc_mp.set( ret, _proc_mp.I( "1" ) );
			return ret;
		}
		if( r == 1 ){
			_proc_mp.str2num( ret, "" + n );
			return ret;
		}

		var numer = new Array( r );
		var denom = new Array( r );

		var i, k;
		var pivot;
		var offset;

		for( i = 0; i < r; i++ ){
			numer[i] = n - r + i + 1;
			denom[i] = i + 1;
		}

		for( k = 2; k <= r; k++ ){
			pivot = denom[k - 1];
			if( pivot > 1 ){
				offset = _MOD( n - r, k );
				for( i = k - 1; i < r; i += k ){
					numer[i - offset] = _DIV( numer[i - offset], pivot );
					denom[i] = _DIV( denom[i], pivot );
				}
			}
		}

		ret = new Array();
		_proc_mp.set( ret, _proc_mp.I( "1" ) );
		var ii = new Array();
		for( i = 0; i < r; i++ ){
			if( numer[i] > 1 ){
				_proc_mp.str2num( ii, "" + numer[i] );
				_proc_mp.mul( ret, ret, ii );
			}
		}
		return ret;
	},
	_mpFactorial : function( _this, n ){
		if( n == 0 ){
			var ret = new Array();
			_proc_mp.set( ret, _proc_mp.I( "1" ) );
			return ret;
		}
		var value = _this._mpFactorial( _this, _DIV( n, 2 ) );
		_proc_mp.mul( value, value, value );
		_proc_mp.mul( value, value, _this._mpCombination( n, _DIV( n, 2 ) ) );
		if( (n & 1) != 0 ){
			var tmp = new Array();
			_proc_mp.str2num( tmp, "" + _DIV( n + 1, 2 ) );
			_proc_mp.mul( value, value, tmp );
		}
		return value;
	},
	mpFactorial : function( ret/*Array*/, x ){
		var m = false;
		if( x < 0 ){
			m = true;
			x = 0 - x;
		}
//		_proc_mp.str2num( ret, "1" );
//		var ii = new Array();
//		for( var i = 2; i <= x; i++ ){
//			_proc_mp.str2num( ii, "" + i );
//			_proc_mp.mul( ret, ret, ii );
//		}
		_proc_mp.set( ret, this._mpFactorial( this, x ) );
		if( m ){
			_proc_mp.neg( ret );
		}
	},

	_getFuncParam : function( param, code, token, value/*_ProcVal*/, seFlag ){
		var ret;

		if( seFlag ){
			if( !(this._curLine._token.skipComma()) ){
				return this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}
		}

		ret = this._const( param, code, token, value );
		if( ret == _CLIP_PROC_ERR_RVALUE_NULL ){
			return this._retError( _CLIP_PROC_ERR_FUNCTION, code, token );
		}
		return ret;
	},
	_getFuncParamIndex : function( param, code, token, index/*__Index*/, moveFlag/*_Boolean*/, seFlag ){
		var newToken;

		if( seFlag ){
			if( !(this._curLine._token.skipComma()) ){
				return this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}
		}

		if( !(this._curLine._token.getTokenParam( param )) ){
			return this._retError( _CLIP_PROC_ERR_FUNCTION, code, token );
		}
		newToken = _get_token;
		switch( _get_code ){
		case _CLIP_CODE_VARIABLE:
			index.set( param, this.varIndexParam( param, newToken ) );
			moveFlag.set( true );
			break;
		case _CLIP_CODE_GLOBAL_VAR:
			param = globalParam();
			// そのまま下に流す
		case _CLIP_CODE_AUTO_VAR:
			index.set( param, this.autoVarIndex( param, newToken ) );
			moveFlag.set( false );
			break;
		default:
			return this._retError( _CLIP_PROC_ERR_FUNCTION, code, token );
		}

		return _CLIP_NO_ERR;
	},
	_getFuncParamArray : function( param, code, token, moveFlag/*_Boolean*/, seFlag ){
		var lock = this._curLine._token.lock();
		if( seFlag ){
			if( !(this._curLine._token.skipComma()) ){
				this._curLine._token.unlock( lock );
				return null;
			}
		}
		var index = new __Index();
		if( this._curLine._token.getTokenParam( param ) ){
			var newCode  = _get_code;
			var newToken = _get_token;
			switch( newCode ){
			case _CLIP_CODE_GLOBAL_ARRAY:
				param = globalParam();
				// そのまま下に流す
			case _CLIP_CODE_ARRAY:
			case _CLIP_CODE_AUTO_ARRAY:
				index.set( param, this.arrayIndexIndirectMove( param, newCode, newToken, moveFlag ) );
				break;
			case _CLIP_CODE_LABEL:
			case _CLIP_CODE_GLOBAL_VAR:
				index.set( param, param._array._label.checkLabel( newToken ) );
				moveFlag.set( false );
				break;
			default:
				this._curLine._token.unlock( lock );
				return null;
			}
		} else {
			this._curLine._token.unlock( lock );
			return null;
		}
		if( index._index < 0 ){
			return null;
		}
		return index;
	},

	_funcDefined : function( _this, param, code, token, value, seFlag ){
		var newCode;

		if( seFlag ){
			if( !(_this._curLine._token.skipComma()) ){
				return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}
		}

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode = _get_code;
			value.matAss( ((newCode == _CLIP_CODE_LABEL) || (newCode == _CLIP_CODE_GLOBAL_VAR) || (newCode == _CLIP_CODE_GLOBAL_ARRAY)) ? 0.0 : 1.0 );
			return _CLIP_NO_ERR;
		}

		return _this._retError( _CLIP_PROC_ERR_FUNCTION, code, token );
	},
	_funcIndexOf : function( _this, param, code, token, value, seFlag ){
		var newToken;

		if( seFlag ){
			if( !(_this._curLine._token.skipComma()) ){
				return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}
		}

		if( _this._curLine._token.getTokenParam( param ) ){
			newToken = _get_token;
			switch( _get_code ){
			case _CLIP_CODE_AUTO_VAR:
				value.matAss( _this.autoVarIndex( param, newToken ) );
				return _CLIP_NO_ERR;
			case _CLIP_CODE_AUTO_ARRAY:
				value.matAss( _this.autoArrayIndex( param, newToken ) );
				return _CLIP_NO_ERR;
			case _CLIP_CODE_GLOBAL_VAR:
			case _CLIP_CODE_GLOBAL_ARRAY:
				break;
			}
		}

		return _this._retError( _CLIP_PROC_ERR_FUNCTION, code, token );
	},
	_funcIsInf : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( _ISINF( tmpValue.mat()._mat[0].toFloat() ) ? 1.0 : 0.0 );
		return _CLIP_NO_ERR;
	},
	_funcIsNaN : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( _ISNAN( tmpValue.mat()._mat[0].toFloat() ) ? 1.0 : 0.0 );
		return _CLIP_NO_ERR;
	},
	_funcRand : function( _this, param, code, token, value, seFlag ){
		value.matAss( rand() );
		return _CLIP_NO_ERR;
	},
	_funcTime : function( _this, param, code, token, value, seFlag ){
		value.matAss( (new Date()).getTime() / 1000.0 );
		return _CLIP_NO_ERR;
	},
	_funcMkTime : function( _this, param, code, token, value, seFlag ){
		var i;
		var format = new _String();
		var errFlag;
		var tmpValue = new _ProcVal( _this, param );

		if( seFlag ){
			if( !(_this._curLine._token.skipComma()) ){
				return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}
		}

		// 書式制御文字列の取得
		_this._getString( param, format );
		if( format.isNull() ){
			return _this._retError( _CLIP_PROC_ERR_STRING, code, token );
		}

		var t = time();
		var tm = localtime( t );

		errFlag = false;
		for( i = 0; i < format.str().length; i++ ){
			if( format.str().charAt( i ) == '%' ){
				i++;
				if( i >= format.str().length ){
					errFlag = true;
					break;
				}

				if( _this._getFuncParam( param, code, token, tmpValue, seFlag ) != _CLIP_NO_ERR ){
					errFlag = true;
					break;
				}

				switch( format.str().charAt( i ) ){
				case 's': tm._sec  = _INT( tmpValue.mat()._mat[0].toFloat() ); break;
				case 'm': tm._min  = _INT( tmpValue.mat()._mat[0].toFloat() ); break;
				case 'h': tm._hour = _INT( tmpValue.mat()._mat[0].toFloat() ); break;
				case 'D': tm._mday = _INT( tmpValue.mat()._mat[0].toFloat() ); break;
				case 'M': tm._mon  = _INT( tmpValue.mat()._mat[0].toFloat() ); break;
				case 'Y': tm._year = _INT( tmpValue.mat()._mat[0].toFloat() ); break;
				case 'w': tm._wday = _INT( tmpValue.mat()._mat[0].toFloat() ); break;
				case 'y': tm._yday = _INT( tmpValue.mat()._mat[0].toFloat() ); break;
				default:
					errFlag = true;
					break;
				}

				if( errFlag ){
					break;
				}
			}
		}

		// 書式制御文字列の解放
		format = null;

		if( errFlag ){
			return _this._retError( _CLIP_PROC_ERR_FUNCTION, code, token );
		}

		value.matAss( mktime( tm ) );

		return _CLIP_NO_ERR;
	},
	_funcTmSec : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.matAss( localtime( t )._sec );
		return _CLIP_NO_ERR;
	},
	_funcTmMin : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.matAss( localtime( t )._min );
		return _CLIP_NO_ERR;
	},
	_funcTmHour : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.matAss( localtime( t )._hour );
		return _CLIP_NO_ERR;
	},
	_funcTmMDay : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.matAss( localtime( t )._mday );
		return _CLIP_NO_ERR;
	},
	_funcTmMon : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.matAss( localtime( t )._mon );
		return _CLIP_NO_ERR;
	},
	_funcTmYear : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.matAss( localtime( t )._year );
		return _CLIP_NO_ERR;
	},
	_funcTmWDay : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.matAss( localtime( t )._wday );
		return _CLIP_NO_ERR;
	},
	_funcTmYDay : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.matAss( localtime( t )._yday );
		return _CLIP_NO_ERR;
	},
	_funcTmXMon : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.matAss( localtime( t )._mon + 1 );
		return _CLIP_NO_ERR;
	},
	_funcTmXYear : function( _this, param, code, token, value, seFlag ){
		var t = time();
		value.matAss( 1900 + localtime( t )._year );
		return _CLIP_NO_ERR;
	},
	_funcA2D : function( _this, param, code, token, value, seFlag ){
		var ret;

		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != _CLIP_NO_ERR ){
			return ret;

		}

		value.mat()._mat[0].angToAng( complexAngType(), _ANG_TYPE_DEG );
		return _CLIP_NO_ERR;
	},
	_funcA2G : function( _this, param, code, token, value, seFlag ){
		var ret;

		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.mat()._mat[0].angToAng( complexAngType(), _ANG_TYPE_GRAD );
		return _CLIP_NO_ERR;
	},
	_funcA2R : function( _this, param, code, token, value, seFlag ){
		var ret;

		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.mat()._mat[0].angToAng( complexAngType(), _ANG_TYPE_RAD );
		return _CLIP_NO_ERR;
	},
	_funcD2A : function( _this, param, code, token, value, seFlag ){
		var ret;

		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.mat()._mat[0].angToAng( _ANG_TYPE_DEG, complexAngType() );
		return _CLIP_NO_ERR;
	},
	_funcD2G : function( _this, param, code, token, value, seFlag ){
		var ret;

		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.mat()._mat[0].angToAng( _ANG_TYPE_DEG, _ANG_TYPE_GRAD );
		return _CLIP_NO_ERR;
	},
	_funcD2R : function( _this, param, code, token, value, seFlag ){
		var ret;

		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.mat()._mat[0].angToAng( _ANG_TYPE_DEG, _ANG_TYPE_RAD );
		return _CLIP_NO_ERR;
	},
	_funcG2A : function( _this, param, code, token, value, seFlag ){
		var ret;

		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.mat()._mat[0].angToAng( _ANG_TYPE_GRAD, complexAngType() );
		return _CLIP_NO_ERR;
	},
	_funcG2D : function( _this, param, code, token, value, seFlag ){
		var ret;

		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.mat()._mat[0].angToAng( _ANG_TYPE_GRAD, _ANG_TYPE_DEG );
		return _CLIP_NO_ERR;
	},
	_funcG2R : function( _this, param, code, token, value, seFlag ){
		var ret;

		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.mat()._mat[0].angToAng( _ANG_TYPE_GRAD, _ANG_TYPE_RAD );
		return _CLIP_NO_ERR;
	},
	_funcR2A : function( _this, param, code, token, value, seFlag ){
		var ret;

		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.mat()._mat[0].angToAng( _ANG_TYPE_RAD, complexAngType() );
		return _CLIP_NO_ERR;
	},
	_funcR2D : function( _this, param, code, token, value, seFlag ){
		var ret;

		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.mat()._mat[0].angToAng( _ANG_TYPE_RAD, _ANG_TYPE_DEG );
		return _CLIP_NO_ERR;
	},
	_funcR2G : function( _this, param, code, token, value, seFlag ){
		var ret;

		if( (ret = _this._getFuncParam( param, code, token, value, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.mat()._mat[0].angToAng( _ANG_TYPE_RAD, _ANG_TYPE_GRAD );
		return _CLIP_NO_ERR;
	},
	_funcSin : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].sin() );
		return _CLIP_NO_ERR;
	},
	_funcCos : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].cos() );
		return _CLIP_NO_ERR;
	},
	_funcTan : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].tan() );
		return _CLIP_NO_ERR;
	},
	_funcASin : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].asin() );
		if( valueError() ){
			_this._errorProc( _CLIP_PROC_WARN_ASIN, _this._curLine._num, param, _CLIP_CODE_NULL, null );
			clearValueError();
		}
		return _CLIP_NO_ERR;
	},
	_funcACos : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].acos() );
		if( valueError() ){
			_this._errorProc( _CLIP_PROC_WARN_ACOS, _this._curLine._num, param, _CLIP_CODE_NULL, null );
			clearValueError();
		}
		return _CLIP_NO_ERR;
	},
	_funcATan : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].atan() );
		return _CLIP_NO_ERR;
	},
	_funcATan2 : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = newProcValArray( 2, _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[0], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[1], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( fatan2( tmpValue[0].mat()._mat[0].toFloat(), tmpValue[1].mat()._mat[0].toFloat() ) );
		return _CLIP_NO_ERR;
	},
	_funcSinH : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].sinh() );
		return _CLIP_NO_ERR;
	},
	_funcCosH : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].cosh() );
		return _CLIP_NO_ERR;
	},
	_funcTanH : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].tanh() );
		return _CLIP_NO_ERR;
	},
	_funcASinH : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].asinh() );
		return _CLIP_NO_ERR;
	},
	_funcACosH : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].acosh() );
		if( valueError() ){
			_this._errorProc( _CLIP_PROC_WARN_ACOSH, _this._curLine._num, param, _CLIP_CODE_NULL, null );
			clearValueError();
		}
		return _CLIP_NO_ERR;
	},
	_funcATanH : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].atanh() );
		if( valueError() ){
			_this._errorProc( _CLIP_PROC_WARN_ATANH, _this._curLine._num, param, _CLIP_CODE_NULL, null );
			clearValueError();
		}
		return _CLIP_NO_ERR;
	},
	_funcExp : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].exp() );
		return _CLIP_NO_ERR;
	},
	_funcExp10 : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].exp10() );
		return _CLIP_NO_ERR;
	},
	_funcLn : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].log() );
		if( valueError() ){
			_this._errorProc( _CLIP_PROC_WARN_LOG, _this._curLine._num, param, _CLIP_CODE_NULL, null );
			clearValueError();
		}
		return _CLIP_NO_ERR;
	},
	_funcLog : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._calculator ){
			value.matAss( tmpValue.mat()._mat[0].log10() );
		} else {
			value.matAss( tmpValue.mat()._mat[0].log() );
		}
		if( valueError() ){
			_this._errorProc( param._calculator ? _CLIP_PROC_WARN_LOG10 : _CLIP_PROC_WARN_LOG, _this._curLine._num, param, _CLIP_CODE_NULL, null );
			clearValueError();
		}
		return _CLIP_NO_ERR;
	},
	_funcLog10 : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].log10() );
		if( valueError() ){
			_this._errorProc( _CLIP_PROC_WARN_LOG10, _this._curLine._num, param, _CLIP_CODE_NULL, null );
			clearValueError();
		}
		return _CLIP_NO_ERR;
	},
	_funcPow : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = newProcValArray( 2, _this, param );

		var index;
		var moveFlag = new _Boolean();

		if( param._mpFlag && ((index = _this._getFuncParamArray( param, code, token, moveFlag, seFlag )) != null) ){
			tmpValue[0]._mp = Array.from( index._param._array._mp[index._index] );
			tmpValue[0]._mpFlag = true;
		} else if( (ret = _this._getFuncParam( param, code, token, tmpValue[0], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[1], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			_this.mpPow( param, value.mp(), tmpValue[0].mp(), _INT( tmpValue[1].mat()._mat[0].toFloat() ) );
		} else {
			value.matAss( tmpValue[0].mat()._mat[0].pow( tmpValue[1].mat()._mat[0] ) );
		}
		return _CLIP_NO_ERR;
	},
	_funcSqr : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				_proc_mp.fmul( value.mp(), tmpValue.mp(), tmpValue.mp(), param._mpPrec + 1 );
			} else {
				_proc_mp.mul( value.mp(), tmpValue.mp(), tmpValue.mp() );
			}
		} else {
			value.matAss( tmpValue.mat()._mat[0].sqr() );
		}
		return _CLIP_NO_ERR;
	},
	_funcSqrt : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				if( _proc_mp.fsqrt2( value.mp(), tmpValue.mp(), param._mpPrec + 1, 4 ) ){
					_this._errorProc( _CLIP_PROC_WARN_SQRT, _this._curLine._num, param, _CLIP_CODE_NULL, null );
				}
			} else {
				if( _proc_mp.sqrt( value.mp(), tmpValue.mp() ) ){
					_this._errorProc( _CLIP_PROC_WARN_SQRT, _this._curLine._num, param, _CLIP_CODE_NULL, null );
				}
			}
		} else {
			value.matAss( tmpValue.mat()._mat[0].sqrt() );
			if( valueError() ){
				_this._errorProc( _CLIP_PROC_WARN_SQRT, _this._curLine._num, param, _CLIP_CODE_NULL, null );
				clearValueError();
			}
		}
		return _CLIP_NO_ERR;
	},
	_funcCeil : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].ceil() );
		return _CLIP_NO_ERR;
	},
	_funcFloor : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].floor() );
		return _CLIP_NO_ERR;
	},
	_funcAbs : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				_proc_mp.fabs( value.mp(), tmpValue.mp() );
			} else {
				_proc_mp.abs( value.mp(), tmpValue.mp() );
			}
		} else {
			value.matAss( tmpValue.mat()._mat[0].abs() );
		}
		return _CLIP_NO_ERR;
	},
	_funcLdexp : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = newProcValArray( 2, _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[0], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[1], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue[0].mat()._mat[0].ldexp( _INT( tmpValue[1].mat()._mat[0].toFloat() ) ) );
		return _CLIP_NO_ERR;
	},
	_funcFrexp : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );
		var index = new __Index();
		var moveFlag = new _Boolean();

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getFuncParamIndex( param, code, token, index, moveFlag, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		var _n = new _Integer();
		value.matAss( tmpValue.mat()._mat[0].frexp( _n ) );
		if( !(index._param.setVal( index._index, _n._val, moveFlag._val )) ){
			return _this._retError( _CLIP_PROC_ERR_ASS, code, token );
		}
		return _CLIP_NO_ERR;
	},
	_funcModf : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );
		var index = new __Index();
		var moveFlag = new _Boolean();

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getFuncParamIndex( param, code, token, index, moveFlag, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		var _f = new _Float();
		value.matAss( tmpValue.mat()._mat[0].modf( _f ) );
		if( !(index._param.setVal( index._index, _f._val, moveFlag._val )) ){
			return _this._retError( _CLIP_PROC_ERR_ASS, code, token );
		}
		return _CLIP_NO_ERR;
	},
	_funcFact : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			_this.mpFactorial( value.mp(), _INT( tmpValue.mat()._mat[0].toFloat() ) );
		} else {
			value.matAss( tmpValue.mat()._mat[0].factorial() );
		}
		return _CLIP_NO_ERR;
	},
	_funcInt : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( param._mpFlag ){
			if( _proc_mp.getPrec( tmpValue.mp() ) > 0 ){
				_proc_mp.ftrunc( value.mp(), tmpValue.mp() );
			} else {
				_proc_mp.fset( value.mp(), tmpValue.mp() );
			}
		} else {
			value.mat()._mat[0].setReal( _INT( tmpValue.mat()._mat[0].real() ) );
			value.mat()._mat[0].setImag( _INT( tmpValue.mat()._mat[0].imag() ) );
		}
		return _CLIP_NO_ERR;
	},
	_funcReal : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].real() );
		return _CLIP_NO_ERR;
	},
	_funcImag : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].imag() );
		return _CLIP_NO_ERR;
	},
	_funcArg : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].farg() );
		return _CLIP_NO_ERR;
	},
	_funcNorm : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].fnorm() );
		return _CLIP_NO_ERR;
	},
	_funcConjg : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].conjg() );
		return _CLIP_NO_ERR;
	},
	_funcPolar : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = newProcValArray( 2, _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[0], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[1], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.mat()._mat[0].polar( tmpValue[0].mat()._mat[0].toFloat(), tmpValue[1].mat()._mat[0].toFloat() );
		return _CLIP_NO_ERR;
	},
	_funcNum : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( tmpValue.mat()._mat[0].fractMinus() ){
			value.matAss( -tmpValue.mat()._mat[0].num() );
		} else {
			value.matAss( tmpValue.mat()._mat[0].num() );
		}
		return _CLIP_NO_ERR;
	},
	_funcDenom : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( tmpValue.mat()._mat[0].denom() );
		return _CLIP_NO_ERR;
	},
	_funcRow : function( _this, param, code, token, value, seFlag ){
		var index;
		var moveFlag = new _Boolean();

		if( (index = _this._getFuncParamArray( param, code, token, moveFlag, seFlag )) != null ){
			value.matAss( index._param._array._mat[index._index]._row );
		} else {
			var ret;
			var tmpValue = new _ProcVal( _this, param );

			if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
				return ret;
			}

			value.matAss( tmpValue.mat()._row );
		}
		return _CLIP_NO_ERR;
	},
	_funcCol : function( _this, param, code, token, value, seFlag ){
		var index;
		var moveFlag = new _Boolean();

		if( (index = _this._getFuncParamArray( param, code, token, moveFlag, seFlag )) != null ){
			value.matAss( index._param._array._mat[index._index]._col );
		} else {
			var ret;
			var tmpValue = new _ProcVal( _this, param );

			if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
				return ret;
			}

			value.matAss( tmpValue.mat()._col );
		}
		return _CLIP_NO_ERR;
	},
	_funcTrans : function( _this, param, code, token, value, seFlag ){
		var index;
		var moveFlag = new _Boolean();

		if( (index = _this._getFuncParamArray( param, code, token, moveFlag, seFlag )) != null ){
			value.matAss( index._param._array._mat[index._index].trans() );
		} else {
			var ret;
			var tmpValue = new _ProcVal( _this, param );

			if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
				return ret;
			}

			value.matAss( tmpValue.mat().trans() );
		}
		return _CLIP_NO_ERR;
	},
	_funcStrCmp : function( _this, param, code, token, value, seFlag ){
		if( seFlag ){
			if( !(_this._curLine._token.skipComma()) ){
				return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}
		}

		var string1 = new _String();
		if( _this._getString( param, string1 ) ){
			if( seFlag ){
				if( !(_this._curLine._token.skipComma()) ){
					return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
				}
			}

			var string2 = new _String();
			if( _this._getString( param, string2 ) ){
				var str1 = string1.str();
				var str2 = string2.str();
				var val = str1.length - str2.length;
				if( val == 0 ){
					var i;
					switch( token ){
					case _CLIP_FUNC_STRCMP:
						for( i = 0; i < str1.length; i++ ){
							val = str1.charCodeAt( i ) - str2.charCodeAt( i );
							if( val != 0 ){
								break;
							}
						}
						break;
					case _CLIP_FUNC_STRICMP:
						var chr1, chr2;
						for( i = 0; i < str1.length; i++ ){
							chr1 = str1.charCodeAt( i );
							if( (chr1 >= _CHAR_CODE_UA) && (chr1 <= _CHAR_CODE_UZ) ){
								chr1 = chr1 - _CHAR_CODE_UA + _CHAR_CODE_LA;
							}
							chr2 = str2.charCodeAt( i );
							if( (chr2 >= _CHAR_CODE_UA) && (chr2 <= _CHAR_CODE_UZ) ){
								chr2 = chr2 - _CHAR_CODE_UA + _CHAR_CODE_LA;
							}
							val = chr1 - chr2;
							if( val != 0 ){
								break;
							}
						}
						break;
					}
				}
				value.matAss( val );
				return _CLIP_NO_ERR;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_FUNCTION, code, token );
	},
	_funcStrLen : function( _this, param, code, token, value, seFlag ){
		if( seFlag ){
			if( !(_this._curLine._token.skipComma()) ){
				return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}
		}

		var string = new _String();
		if( _this._getString( param, string ) ){
			value.matAss( string.str().length );
			return _CLIP_NO_ERR;
		}
		return _this._retError( _CLIP_PROC_ERR_FUNCTION, code, token );
	},
	_funcGWidth : function( _this, param, code, token, value, seFlag ){
		value.matAss( procGWorld()._width );
		return _CLIP_NO_ERR;
	},
	_funcGHeight : function( _this, param, code, token, value, seFlag ){
		value.matAss( procGWorld()._height );
		return _CLIP_NO_ERR;
	},
	_funcGColor : function( _this, param, code, token, value, seFlag ){
		if( procGWorld()._rgbFlag ){
			value.matAss( procGWorld()._color );
			return _CLIP_NO_ERR;
		}

		var lock;
		var tmpValue = new _ProcVal( _this, param );

		lock = _this._curLine._token.lock();
		if( _this._getFuncParam( param, code, token, tmpValue, seFlag ) == _CLIP_NO_ERR ){
			procGWorld().setColor( doFuncGColor( _UNSIGNED( tmpValue.mat()._mat[0].toFloat(), _UMAX_24 ) ) );
		} else {
			_this._curLine._token.unlock( lock );
		}

		value.matAss( (token == _CLIP_FUNC_GCOLOR) ? procGWorld()._color : doFuncGColor24( procGWorld()._color ) );
		return _CLIP_NO_ERR;
	},
	_funcGCX : function( _this, param, code, token, value, seFlag ){
		value.matAss( procGWorld()._imgMoveX );
		return _CLIP_NO_ERR;
	},
	_funcGCY : function( _this, param, code, token, value, seFlag ){
		value.matAss( procGWorld()._imgMoveY );
		return _CLIP_NO_ERR;
	},
	_funcWCX : function( _this, param, code, token, value, seFlag ){
		value.matAss( procGWorld()._wndMoveX );
		return _CLIP_NO_ERR;
	},
	_funcWCY : function( _this, param, code, token, value, seFlag ){
		value.matAss( procGWorld()._wndMoveY );
		return _CLIP_NO_ERR;
	},
	_funcGGet : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = newProcValArray( 2, _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[0], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[1], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( procGWorld().get( _INT( tmpValue[0].mat()._mat[0].toFloat() ), _INT( tmpValue[1].mat()._mat[0].toFloat() ) ) );
		return _CLIP_NO_ERR;
	},
	_funcWGet : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = newProcValArray( 2, _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[0], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[1], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( procGWorld().wndGet( tmpValue[0].mat()._mat[0].toFloat(), tmpValue[1].mat()._mat[0].toFloat() ) );
		return _CLIP_NO_ERR;
	},
	_funcGX : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( procGWorld().imgPosX( tmpValue.mat()._mat[0].toFloat() ) );
		return _CLIP_NO_ERR;
	},
	_funcGY : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( procGWorld().imgPosY( tmpValue.mat()._mat[0].toFloat() ) );
		return _CLIP_NO_ERR;
	},
	_funcWX : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( procGWorld().wndPosX( _INT( tmpValue.mat()._mat[0].toFloat() ) ) );
		return _CLIP_NO_ERR;
	},
	_funcWY : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( procGWorld().wndPosY( _INT( tmpValue.mat()._mat[0].toFloat() ) ) );
		return _CLIP_NO_ERR;
	},
	_funcMkColor : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = newProcValArray( 3, _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[0], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[1], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[2], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		var r = _INT( tmpValue[0].mat()._mat[0].toFloat() );
		var g = _INT( tmpValue[1].mat()._mat[0].toFloat() );
		var b = _INT( tmpValue[2].mat()._mat[0].toFloat() );
		value.matAss( _SHIFTL( r, 16 ) + _SHIFTL( g, 8 ) + b );
		return _CLIP_NO_ERR;
	},
	_funcMkColorS : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = newProcValArray( 3, _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[0], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[1], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (ret = _this._getFuncParam( param, code, token, tmpValue[2], seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		var r = _INT( tmpValue[0].mat()._mat[0].toFloat() );
		var g = _INT( tmpValue[1].mat()._mat[0].toFloat() );
		var b = _INT( tmpValue[2].mat()._mat[0].toFloat() );
		if( r < 0 ){ r = 0; } else if( r > 255 ){ r = 255; }
		if( g < 0 ){ g = 0; } else if( g > 255 ){ g = 255; }
		if( b < 0 ){ b = 0; } else if( b > 255 ){ b = 255; }
		value.matAss( _SHIFTL( r, 16 ) + _SHIFTL( g, 8 ) + b );
		return _CLIP_NO_ERR;
	},
	_funcColGetR : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( _SHIFTR( _AND( _INT( tmpValue.mat()._mat[0].toFloat() ), 0xFF0000 ), 16 ) );
		return _CLIP_NO_ERR;
	},
	_funcColGetG : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( _SHIFTR( _AND( _INT( tmpValue.mat()._mat[0].toFloat() ), 0x00FF00 ), 8 ) );
		return _CLIP_NO_ERR;
	},
	_funcColGetB : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		value.matAss( _AND( _INT( tmpValue.mat()._mat[0].toFloat() ), 0x0000FF ) );
		return _CLIP_NO_ERR;
	},
	_funcCall : function( _this, param, code, token, value, seFlag ){
		var ret;

		if( seFlag ){
			if( !(_this._curLine._token.skipComma()) ){
				return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}
		}

		var func = new _String();
		_this._getString( param, func );
		if( func.isNull() ){
			return _this._retError( _CLIP_PROC_ERR_STRING, code, token );
		}

		if( func.str().charAt( 0 ) == '!' ){
			ret = _this._procExtFunc( _this, param, _CLIP_CODE_EXTFUNC, func.str().slice( 1 ), value, seFlag );
			if( ret != _CLIP_NO_ERR ){
				ret = _this._retError( _CLIP_PROC_ERR_CALL, code, token );
			}
		} else {
			var _func = new _Integer();
			if( _proc_token.checkFunc( func.str(), _func ) ){
				ret = _this._procFunc( _this, param, _CLIP_CODE_FUNCTION, _func._val, value, seFlag );
			} else {
				ret = _this._procLabel( _this, param, _CLIP_CODE_LABEL, func.str(), value, seFlag );
				if( ret != _CLIP_NO_ERR ){
					ret = _this._retError( _CLIP_PROC_ERR_CALL, code, token );
				}
			}
		}
		return ret;
	},
	initEvalProc : function( childParam, parentParam ){
		childParam._enableCommand = false;
		childParam._enableStat = false;

		// ユーザー定義関数を取り込む
		childParam._func.openAll( parentParam._func );

		childParam.setDefNameSpace( parentParam._defNameSpace );
	},
	_funcEval : function( _this, param, code, token, value, seFlag ){
		var ret;

		if( seFlag ){
			if( !(_this._curLine._token.skipComma()) ){
				return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}
		}

		var string = new _String();
		_this._getString( param, string );
		if( string.isNull() ){
			return _this._retError( _CLIP_PROC_ERR_STRING, code, token );
		}

		// 親プロセスの環境を受け継いで、子プロセスを実行する
		var childProc = new _Proc( param._mode, param._mpPrec, param._mpRound, false, _this._printAssert, _this._printWarn, _this._gUpdateFlag );
		var childParam = new _Param( _this._curLine._num, param, true );
		_this.initEvalProc( childParam, param );
		ret = doFuncEval( _this, childProc, childParam, string.str(), value );
		childProc.end();
		childParam.end();

		return (ret == _CLIP_NO_ERR) ? _CLIP_NO_ERR : _this._retError( _CLIP_PROC_ERR_EVAL, code, token );
	},
	doFuncEval : function( childProc, childParam, string, value ){
		var ret;
		childProc.setAngType( this._angType, false );
		if( (ret = childProc.processLoop( string, childParam )) == _CLIP_PROC_END ){
			value.matAss( childParam._array._mat[0] );
			return _CLIP_NO_ERR;
		}
		return ret;
	},
	_funcMp : function( _this, param, code, token, value, seFlag ){
		var ret;

		if( seFlag ){
			if( !(_this._curLine._token.skipComma()) ){
				return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}
		}

		var string = new _String();
		_this._getString( param, string );
		if( string.isNull() ){
			return _this._retError( _CLIP_PROC_ERR_STRING, code, token );
		}

		if( param._mode == _CLIP_MODE_F_MULTIPREC ){
			ret = _proc_mp.fstr2num( value.mp(), string.str() );
		} else {
			ret = _proc_mp.str2num( value.mp(), string.str() );
		}

		return ret ? _CLIP_NO_ERR : _this._retError( _CLIP_PROC_ERR_MULTIPREC, _CLIP_CODE_LABEL, string.str() );
	},
	_funcMRound : function( _this, param, code, token, value, seFlag ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._getFuncParam( param, code, token, tmpValue, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( (param._mode == _CLIP_MODE_I_MULTIPREC) && (_proc_mp.getPrec( tmpValue.mp() ) > 0) ){
			_proc_mp.ftrunc( value.mp(), tmpValue.mp() );
		} else {
			_proc_mp.fset( value.mp(), tmpValue.mp() );
			_proc_mp.fround( value.mp(), param._mpPrec, param._mpRound );
		}
		return _CLIP_NO_ERR;
	},

	_incVal : function( param, code, token, value, incFlag ){
		switch( this._curInfo._assCode ){
		case _CLIP_CODE_VARIABLE:
			if( incFlag ){
				value.mat().addAndAss( 1.0 );
			} else {
				value.mat().subAndAss( 1.0 );
			}
			if( !(param.setVal( this._curInfo._assToken, value.mat()._mat[0], true )) ){
				return this._retError( _CLIP_PROC_ERR_ASS, code, token );
			}
			break;
		case _CLIP_CODE_GLOBAL_VAR:
			param = globalParam();
			// そのまま下に流す
		case _CLIP_CODE_AUTO_VAR:
			if( incFlag ){
				value.mat().addAndAss( 1.0 );
			} else {
				value.mat().subAndAss( 1.0 );
			}
			if( !(param.setVal( this.autoVarIndex( param, this._curInfo._assToken ), value.mat()._mat[0], false )) ){
				return this._retError( _CLIP_PROC_ERR_ASS, code, token );
			}
			break;
		case _CLIP_CODE_ARRAY:
			if( this._curInfo._curArraySize == 0 ){
				if( param._mpFlag ){
					param._array.move( this._curInfo._assToken );
					if( incFlag ){
						_proc_mp.fadd( param._array._mp[this._curInfo._assToken], value.mp(), _proc_mp.F( "1.0" ) );
					} else {
						_proc_mp.fsub( param._array._mp[this._curInfo._assToken], value.mp(), _proc_mp.F( "1.0" ) );
					}
				} else {
					return this._retError( _CLIP_PROC_ERR_RVALUE, code, token );
				}
			} else {
				if( incFlag ){
					value.mat().addAndAss( 1.0 );
				} else {
					value.mat().subAndAss( 1.0 );
				}
				param._array.set(
					this._curInfo._assToken,
					this._curInfo._curArray, this._curInfo._curArraySize,
					value.mat()._mat[0], true
					);
			}
			break;
		case _CLIP_CODE_GLOBAL_ARRAY:
			param = globalParam();
			// そのまま下に流す
		case _CLIP_CODE_AUTO_ARRAY:
			if( this._curInfo._curArraySize == 0 ){
				if( param._mpFlag ){
					var index = this.autoArrayIndex( param, this._curInfo._assToken );
					if( incFlag ){
						_proc_mp.fadd( param._array._mp[index], value.mp(), _proc_mp.F( "1.0" ) );
					} else {
						_proc_mp.fsub( param._array._mp[index], value.mp(), _proc_mp.F( "1.0" ) );
					}
				} else {
					return this._retError( _CLIP_PROC_ERR_RVALUE, code, token );
				}
			} else {
				if( incFlag ){
					value.mat().addAndAss( 1.0 );
				} else {
					value.mat().subAndAss( 1.0 );
				}
				param._array.set(
					this.autoArrayIndex( param, this._curInfo._assToken ),
					this._curInfo._curArray, this._curInfo._curArraySize,
					value.mat()._mat[0], false
					);
			}
			break;
		default:
			return this._retError( _CLIP_PROC_ERR_RVALUE, code, token );
		}
		return _CLIP_NO_ERR;
	},
	_assVal : function( param, code, token, array, arraySize, value ){
		switch( this._curInfo._assCode ){
		case _CLIP_CODE_VARIABLE:
			if( !(param.setVal( this._curInfo._assToken, value.mat()._mat[0], true )) ){
				return this._retError( _CLIP_PROC_ERR_ASS, code, token );
			}
			break;
		case _CLIP_CODE_GLOBAL_VAR:
			param = globalParam();
			// そのまま下に流す
		case _CLIP_CODE_AUTO_VAR:
			if( !(param.setVal( this.autoVarIndex( param, this._curInfo._assToken ), value.mat()._mat[0], false )) ){
				return this._retError( _CLIP_PROC_ERR_ASS, code, token );
			}
			break;
		case _CLIP_CODE_ARRAY:
			if( arraySize == 0 ){
				if( param._mpFlag ){
					param._array.move( this._curInfo._assToken );
					param._array._mp[this._curInfo._assToken] = Array.from( value.mp() );
				} else {
					param._array.setMatrix( this._curInfo._assToken, value.mat(), true );
				}
			} else {
				param._array.set( this._curInfo._assToken, array, arraySize, value.mat()._mat[0], true );
			}
			break;
		case _CLIP_CODE_GLOBAL_ARRAY:
			param = globalParam();
			// そのまま下に流す
		case _CLIP_CODE_AUTO_ARRAY:
			if( arraySize == 0 ){
				if( param._mpFlag ){
					param._array._mp[this.autoArrayIndex( param, this._curInfo._assToken )] = Array.from( value.mp() );
				} else {
					param._array.setMatrix( this.autoArrayIndex( param, this._curInfo._assToken ), value.mat(), false );
				}
			} else {
				param._array.set( this.autoArrayIndex( param, this._curInfo._assToken ), array, arraySize, value.mat()._mat[0], false );
			}
			break;
		default:
			return this._retError( _CLIP_PROC_ERR_LVALUE, code, token );
		}
		return _CLIP_NO_ERR;
	},

	_unaryIncrement : function( _this, param, code, token, value ){
		var ret;

		if( param._subStep == 0 ){
			param._assFlag = true;
		}
		if( (ret = _this._constFirst( param, code, token, value )) == _CLIP_NO_ERR ){
			return _this._incVal( param, code, token, value, true );
		}
		return ret;
	},
	_unaryDecrement : function( _this, param, code, token, value ){
		var ret;

		if( param._subStep == 0 ){
			param._assFlag = true;
		}
		if( (ret = _this._constFirst( param, code, token, value )) == _CLIP_NO_ERR ){
			return _this._incVal( param, code, token, value, false );
		}
		return ret;
	},
	_unaryComplement : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			value.matAss( ~_INT( rightValue.mat()._mat[0].toFloat() ) );
			_this._updateMatrix( param, value.mat() );
		}
		return ret;
	},
	_unaryNot : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			value.matAss( (_INT( rightValue.mat()._mat[0].toFloat() ) == 0) ? 1 : 0 );
			_this._updateMatrix( param, value.mat() );
		}
		return ret;
	},
	_unaryMinus : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( param._mode == _CLIP_MODE_F_MULTIPREC ){
					_proc_mp.fneg( value.mp(), rightValue.mp() );
				} else {
					_proc_mp.neg( value.mp(), rightValue.mp() );
				}
			} else {
				value.matAss( rightValue.mat().minus() );
				_this._updateMatrix( param, value.mat() );
			}
		}
		return ret;
	},
	_unaryPlus : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( param._mode == _CLIP_MODE_F_MULTIPREC ){
					_proc_mp.fset( value.mp(), rightValue.mp() );
				} else {
					_proc_mp.set( value.mp(), rightValue.mp() );
				}
			} else {
				value.matAss( rightValue.mat() );
				_this._updateMatrix( param, value.mat() );
			}
		}
		return ret;
	},

	_opPostfixInc : function( _this, param, code, token, value ){
		return _this._regInc( true/*インクリメント*/, param, code, token );
	},
	_opPostfixDec : function( _this, param, code, token, value ){
		return _this._regInc( false/*デクリメント*/, param, code, token );
	},
	_opMul : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( param._mode == _CLIP_MODE_F_MULTIPREC ){
					_proc_mp.fmul( value.mp(), value.mp(), rightValue.mp(), param._mpPrec + 1 );
				} else {
					_proc_mp.mul( value.mp(), value.mp(), rightValue.mp() );
				}
			} else {
				value.mat().mulAndAss( rightValue.mat() );
				_this._updateMatrix( param, value.mat() );
			}
		}
		return ret;
	},
	_opDiv : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( param._mode == _CLIP_MODE_F_MULTIPREC ){
					if( _this._printWarn && (_proc_mp.fcmp( rightValue.mp(), _proc_mp.F( "0.0" ) ) == 0) ){
						_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
					}
					_proc_mp.fdiv2( value.mp(), value.mp(), rightValue.mp(), param._mpPrec + 1 );
				} else {
					if( _this._printWarn && (_proc_mp.cmp( rightValue.mp(), _proc_mp.I( "0" ) ) == 0) ){
						_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
					}
					_proc_mp.div( value.mp(), value.mp(), rightValue.mp() );
				}
			} else {
				if( _this._printWarn && rightValue.mat().equal( 0.0 ) ){
					_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
				}
				value.mat().divAndAss( rightValue.mat() );
				_this._updateMatrix( param, value.mat() );
			}
		}
		return ret;
	},
	_opMod : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( _proc_mp.getPrec( value.mp() ) > 0 ){
					_proc_mp.ftrunc( value.mp(), value.mp() );
				}
				if( _proc_mp.getPrec( rightValue.mp() ) > 0 ){
					_proc_mp.ftrunc( rightValue.mp(), rightValue.mp() );
				}
				if( _this._printWarn && (_proc_mp.cmp( rightValue.mp(), _proc_mp.I( "0" ) ) == 0) ){
					_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
				}
				_proc_mp.div( new Array(), value.mp(), rightValue.mp(), value.mp() );
			} else {
				if( _this._printWarn && rightValue.mat().equal( 0.0 ) ){
					_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
				}
				value.mat().modAndAss( rightValue.mat() );
				_this._updateMatrix( param, value.mat() );
			}
		}
		return ret;
	},
	_opAdd : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( param._mode == _CLIP_MODE_F_MULTIPREC ){
					_proc_mp.fadd( value.mp(), value.mp(), rightValue.mp() );
				} else {
					_proc_mp.add( value.mp(), value.mp(), rightValue.mp() );
				}
			} else {
				value.mat().addAndAss( rightValue.mat() );
				_this._updateMatrix( param, value.mat() );
			}
		}
		return ret;
	},
	_opSub : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( param._mode == _CLIP_MODE_F_MULTIPREC ){
					_proc_mp.fsub( value.mp(), value.mp(), rightValue.mp() );
				} else {
					_proc_mp.sub( value.mp(), value.mp(), rightValue.mp() );
				}
			} else {
				value.mat().subAndAss( rightValue.mat() );
				_this._updateMatrix( param, value.mat() );
			}
		}
		return ret;
	},
	_opShiftL : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			value.matAss( _SHIFTL( _INT( value.mat()._mat[0].toFloat() ), _INT( rightValue.mat()._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value.mat() );
		}
		return ret;
	},
	_opShiftR : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			value.matAss( _SHIFTR( _INT( value.mat()._mat[0].toFloat() ), _INT( rightValue.mat()._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value.mat() );
		}
		return ret;
	},
	_opLess : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( param._mode == _CLIP_MODE_F_MULTIPREC ){
					value.matAss( (_this.mpfCmp( param, value.mp(), rightValue.mp() ) < 0) ? 1 : 0 );
				} else {
					value.matAss( (_proc_mp.cmp( value.mp(), rightValue.mp() ) < 0) ? 1 : 0 );
				}
			} else {
				value.matAss( (value.mat()._mat[0].toFloat() < rightValue.mat()._mat[0].toFloat()) ? 1 : 0 );
			}
		}
		return ret;
	},
	_opLessOrEq : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( param._mode == _CLIP_MODE_F_MULTIPREC ){
					value.matAss( (_this.mpfCmp( param, value.mp(), rightValue.mp() ) <= 0) ? 1 : 0 );
				} else {
					value.matAss( (_proc_mp.cmp( value.mp(), rightValue.mp() ) <= 0) ? 1 : 0 );
				}
			} else {
				value.matAss( (value.mat()._mat[0].toFloat() <= rightValue.mat()._mat[0].toFloat()) ? 1 : 0 );
			}
		}
		return ret;
	},
	_opGreat : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( param._mode == _CLIP_MODE_F_MULTIPREC ){
					value.matAss( (_this.mpfCmp( param, value.mp(), rightValue.mp() ) > 0) ? 1 : 0 );
				} else {
					value.matAss( (_proc_mp.cmp( value.mp(), rightValue.mp() ) > 0) ? 1 : 0 );
				}
			} else {
				value.matAss( (value.mat()._mat[0].toFloat() > rightValue.mat()._mat[0].toFloat()) ? 1 : 0 );
			}
		}
		return ret;
	},
	_opGreatOrEq : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( param._mode == _CLIP_MODE_F_MULTIPREC ){
					value.matAss( (_this.mpfCmp( param, value.mp(), rightValue.mp() ) >= 0) ? 1 : 0 );
				} else {
					value.matAss( (_proc_mp.cmp( value.mp(), rightValue.mp() ) >= 0) ? 1 : 0 );
				}
			} else {
				value.matAss( (value.mat()._mat[0].toFloat() >= rightValue.mat()._mat[0].toFloat()) ? 1 : 0 );
			}
		}
		return ret;
	},
	_opEqual : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( param._mode == _CLIP_MODE_F_MULTIPREC ){
					value.matAss( (_this.mpfCmp( param, value.mp(), rightValue.mp() ) == 0) ? 1 : 0 );
				} else {
					value.matAss( (_proc_mp.cmp( value.mp(), rightValue.mp() ) == 0) ? 1 : 0 );
				}
			} else {
				value.matAss( value.mat().equal( rightValue.mat() ) ? 1 : 0 );
			}
		}
		return ret;
	},
	_opNotEqual : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( param._mode == _CLIP_MODE_F_MULTIPREC ){
					value.matAss( (_this.mpfCmp( param, value.mp(), rightValue.mp() ) != 0) ? 1 : 0 );
				} else {
					value.matAss( (_proc_mp.cmp( value.mp(), rightValue.mp() ) != 0) ? 1 : 0 );
				}
			} else {
				value.matAss( value.mat().notEqual( rightValue.mat() ) ? 1 : 0 );
			}
		}
		return ret;
	},
	_opAND : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			value.matAss( _AND( _INT( value.mat()._mat[0].toFloat() ), _INT( rightValue.mat()._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value.mat() );
		}
		return ret;
	},
	_opXOR : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			value.matAss( _XOR( _INT( value.mat()._mat[0].toFloat() ), _INT( rightValue.mat()._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value.mat() );
		}
		return ret;
	},
	_opOR : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			value.matAss( _OR( _INT( value.mat()._mat[0].toFloat() ), _INT( rightValue.mat()._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value.mat() );
		}
		return ret;
	},
	_opLogAND : function( _this, param, code, token, value ){
		var ret;

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( value.mat().notEqual( 0.0 ) ){
			var rightValue = new _ProcVal( _this, param );

			if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
				value.matAss( rightValue.mat().notEqual( 0.0 ) ? 1 : 0 );
			}
		} else {
			if( (ret = _this._constSkip( code, token )) == _CLIP_NO_ERR ){
				value.matAss( 0 );
			}
		}
		return ret;
	},
	_opLogOR : function( _this, param, code, token, value ){
		var ret;

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( value.mat().notEqual( 0.0 ) ){
			if( (ret = _this._constSkip( code, token )) == _CLIP_NO_ERR ){
				value.matAss( 1 );
			}
		} else {
			var rightValue = new _ProcVal( _this, param );

			if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
				value.matAss( rightValue.mat().notEqual( 0.0 ) ? 1 : 0 );
			}
		}
		return ret;
	},
	_opConditional : function( _this, param, code, token, value ){
		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				if( _proc_mp.fcmp( value.mp(), _proc_mp.F( "0.0" ) ) != 0 ){
					if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
						if( _this._constSkipConditional( code, token ) == _CLIP_NO_ERR ){
							return _CLIP_NO_ERR;
						}
					}
				} else {
					if( _this._constSkipConditional( code, token ) == _CLIP_NO_ERR ){
						if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
							return _CLIP_NO_ERR;
						}
					}
				}
			} else {
				if( _proc_mp.cmp( value.mp(), _proc_mp.I( "0" ) ) != 0 ){
					if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
						if( _this._constSkipConditional( code, token ) == _CLIP_NO_ERR ){
							return _CLIP_NO_ERR;
						}
					}
				} else {
					if( _this._constSkipConditional( code, token ) == _CLIP_NO_ERR ){
						if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
							return _CLIP_NO_ERR;
						}
					}
				}
			}
		} else {
			if( value.mat().notEqual( 0.0 ) ){
				if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
					_this._updateMatrix( param, value.mat() );
					if( _this._constSkipConditional( code, token ) == _CLIP_NO_ERR ){
						return _CLIP_NO_ERR;
					}
				}
			} else {
				if( _this._constSkipConditional( code, token ) == _CLIP_NO_ERR ){
					if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
						_this._updateMatrix( param, value.mat() );
						return _CLIP_NO_ERR;
					}
				}
			}
		}
		return _this._retError( _CLIP_PROC_ERR_CONDITIONAL, code, token );
	},
	_opAss : function( _this, param, code, token, value ){
		var ret;

		if( param._subStep == 0 ){
			param._assFlag = true;
		}

		var saveArray     = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;

		if( (ret = _this._const( param, code, token, value )) == _CLIP_NO_ERR ){
			if( !(param._mpFlag) ){
				_this._updateMatrix( param, value.mat() );
			}
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}

		saveArray = null;

		return ret;
	},
	_opMulAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = true;
		}

		var saveArray     = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( param._mode == _CLIP_MODE_F_MULTIPREC ){
					_proc_mp.fmul( value.mp(), value.mp(), rightValue.mp(), param._mpPrec + 1 );
				} else {
					_proc_mp.mul( value.mp(), value.mp(), rightValue.mp() );
				}
			} else {
				value.mat().mulAndAss( rightValue.mat() );
				_this._updateMatrix( param, value.mat() );
			}
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}

		saveArray = null;

		return ret;
	},
	_opDivAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = true;
		}

		var saveArray     = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( param._mode == _CLIP_MODE_F_MULTIPREC ){
					if( _this._printWarn && (_proc_mp.fcmp( rightValue.mp(), _proc_mp.F( "0.0" ) ) == 0) ){
						_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
					}
					_proc_mp.fdiv2( value.mp(), value.mp(), rightValue.mp(), param._mpPrec + 1 );
				} else {
					if( _this._printWarn && (_proc_mp.cmp( rightValue.mp(), _proc_mp.I( "0" ) ) == 0) ){
						_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
					}
					_proc_mp.div( value.mp(), value.mp(), rightValue.mp() );
				}
			} else {
				if( _this._printWarn && rightValue.mat().equal( 0.0 ) ){
					_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
				}
				value.mat().divAndAss( rightValue.mat() );
				_this._updateMatrix( param, value.mat() );
			}
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}

		saveArray = null;

		return ret;
	},
	_opModAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = true;
		}

		var saveArray     = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( _proc_mp.getPrec( value.mp() ) > 0 ){
					_proc_mp.ftrunc( value.mp(), value.mp() );
				}
				if( _proc_mp.getPrec( rightValue.mp() ) > 0 ){
					_proc_mp.ftrunc( rightValue.mp(), rightValue.mp() );
				}
				if( _this._printWarn && (_proc_mp.cmp( rightValue.mp(), _proc_mp.I( "0" ) ) == 0) ){
					_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
				}
				_proc_mp.div( new Array(), value.mp(), rightValue.mp(), value.mp() );
			} else {
				if( _this._printWarn && rightValue.mat().equal( 0.0 ) ){
					_this._errorProc( _CLIP_PROC_WARN_DIV, _this._curLine._num, param, _CLIP_CODE_NULL, null );
				}
				value.mat().modAndAss( rightValue.mat() );
				_this._updateMatrix( param, value.mat() );
			}
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}

		saveArray = null;

		return ret;
	},
	_opAddAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = true;
		}

		var saveArray     = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( param._mode == _CLIP_MODE_F_MULTIPREC ){
					_proc_mp.fadd( value.mp(), value.mp(), rightValue.mp() );
				} else {
					_proc_mp.add( value.mp(), value.mp(), rightValue.mp() );
				}
			} else {
				value.mat().addAndAss( rightValue.mat() );
				_this._updateMatrix( param, value.mat() );
			}
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}

		saveArray = null;

		return ret;
	},
	_opSubAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = true;
		}

		var saveArray     = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				if( param._mode == _CLIP_MODE_F_MULTIPREC ){
					_proc_mp.fsub( value.mp(), value.mp(), rightValue.mp() );
				} else {
					_proc_mp.sub( value.mp(), value.mp(), rightValue.mp() );
				}
			} else {
				value.mat().subAndAss( rightValue.mat() );
				_this._updateMatrix( param, value.mat() );
			}
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}

		saveArray = null;

		return ret;
	},
	_opShiftLAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = true;
		}

		var saveArray     = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			value.matAss( _SHIFTL( _INT( value.mat()._mat[0].toFloat() ), _INT( rightValue.mat()._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value.mat() );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}

		saveArray = null;

		return ret;
	},
	_opShiftRAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = true;
		}

		var saveArray     = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			value.matAss( _SHIFTR( _INT( value.mat()._mat[0].toFloat() ), _INT( rightValue.mat()._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value.mat() );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}

		saveArray = null;

		return ret;
	},
	_opANDAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = true;
		}

		var saveArray     = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			value.matAss( _AND( _INT( value.mat()._mat[0].toFloat() ), _INT( rightValue.mat()._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value.mat() );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}

		saveArray = null;

		return ret;
	},
	_opORAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = true;
		}

		var saveArray     = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			value.matAss( _OR( _INT( value.mat()._mat[0].toFloat() ), _INT( rightValue.mat()._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value.mat() );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}

		saveArray = null;

		return ret;
	},
	_opXORAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = true;
		}

		var saveArray     = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			value.matAss( _XOR( _INT( value.mat()._mat[0].toFloat() ), _INT( rightValue.mat()._mat[0].toFloat() ) ) );
			_this._updateMatrix( param, value.mat() );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}

		saveArray = null;

		return ret;
	},
	_opComma : function( _this, param, code, token, value ){
		var ret;

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, value )) == _CLIP_NO_ERR ){
			if( !(param._mpFlag) ){
				_this._updateMatrix( param, value.mat() );
			}
		}
		return ret;
	},
	_opPow : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				_this.mpPow( param, value.mp(), value.mp(), _INT( rightValue.mat()._mat[0].toFloat() ) );
			} else {
				value.matAss( value.mat()._mat[0].pow( rightValue.mat()._mat[0] ) );
				_this._updateMatrix( param, value.mat() );
			}
		}
		return ret;
	},
	_opPowAndAss : function( _this, param, code, token, value ){
		var ret;
		var rightValue = new _ProcVal( _this, param );

		if( param._subStep == 0 ){
			param._assFlag = false;
		}

		var saveArray     = _this._curInfo._curArray;
		var saveArraySize = _this._curInfo._curArraySize;

		if( (ret = _this._const( param, code, token, rightValue )) == _CLIP_NO_ERR ){
			if( param._mpFlag ){
				_this.mpPow( param, value.mp(), value.mp(), _INT( rightValue.mat()._mat[0].toFloat() ) );
			} else {
				value.matAss( value.mat()._mat[0].pow( rightValue.mat()._mat[0] ) );
				_this._updateMatrix( param, value.mat() );
			}
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, value );
		}

		saveArray = null;

		return ret;
	},
	_opFact : function( _this, param, code, token, value ){
		if( param._mpFlag ){
			var tmp = _INT( value.mat()._mat[0].toFloat() );
			_this.mpFactorial( value.mp(), tmp );
		} else {
			value.matAss( value.mat()._mat[0].factorial() );
		}
		return _CLIP_NO_ERR;
	},

	_loopBegin : function( _this ){
		if( _this._statMode == _STAT_MODE_NOT_START ){
			var ret;

			_this._statMode = _STAT_MODE_REGISTERING;
			_this._stat = new _Loop();
			if( (ret = _this._stat.regLine( _this._curLine )) != _CLIP_LOOP_CONT ){
				_this._stat = null;
				_this._statMode = _STAT_MODE_NOT_START;
				return ret;
			}
			return _CLIP_PROC_SUB_END;
		} else if( _this._statMode == _STAT_MODE_PROCESSING ){
			if( _this._checkSkip() ){
				_this._stat.doBreak();
				return _CLIP_PROC_SUB_END;
			}
		}
		return _CLIP_NO_ERR;
	},
	_loopEnd : function( _this ){
		if( _this._statMode == _STAT_MODE_PROCESSING ){
			if( _this._checkSkip() ){
				var _continue = _this._stat.checkContinue();

				_this._stat.doBreak();
				_this._stat.doEnd();

				if( !_continue ){
					return _CLIP_PROC_SUB_END;
				}
			}
		}
		return _CLIP_NO_ERR;
	},
	_loopCont : function( _this ){
		if( _this._statMode == _STAT_MODE_PROCESSING ){
			if( _this._checkSkip() ){
				_this._stat.doBreak();
				_this._stat.doEnd();
				return _CLIP_PROC_SUB_END;
			}
		}
		return _CLIP_NO_ERR;
	},
	_loopUntil : function( _this ){
		if( _this._statMode == _STAT_MODE_PROCESSING ){
			if( _this._checkSkip() ){
				var _continue = _this._stat.checkContinue();

				_this._stat.doBreak();
				_this._stat.doEnd();

				if( !_continue ){
					return _CLIP_PROC_SUB_END;
				}
			}
		}
		return _CLIP_NO_ERR;
	},
	_loopWhile : function( _this ){
		if( _this._statMode == _STAT_MODE_PROCESSING ){
			_this._endType[_this._endCnt] = _PROC_END_TYPE_WHILE;
			_this._endCnt++;
		}

		return _this._loopBegin( _this );
	},
	_loopEndWhile : function( _this ){
		if( _this._statMode == _STAT_MODE_PROCESSING ){
			if( _this._endCnt > 0 ){
				_this._endCnt--;
			}

			if( _this._checkSkip() ){
				_this._stat.doBreak();
				_this._stat.doEnd();
				return _CLIP_PROC_SUB_END;
			}
		}
		return _CLIP_NO_ERR;
	},
	_loopFor : function( _this ){
		if( _this._statMode == _STAT_MODE_PROCESSING ){
			_this._endType[_this._endCnt] = _PROC_END_TYPE_FOR;
			_this._endCnt++;
		}

		return _this._loopBegin( _this );
	},
	_loopNext : function( _this ){
		if( _this._statMode == _STAT_MODE_PROCESSING ){
			if( _this._endCnt > 0 ){
				_this._endCnt--;
			}

			if( _this._checkSkip() ){
				_this._stat.doBreak();
				_this._stat.doEnd();
				return _CLIP_PROC_SUB_END;
			}
		}
		return _CLIP_NO_ERR;
	},
	_loopFunc : function( _this ){
		return _this._loopBegin( _this );
	},
	_loopEndFunc : function( _this ){
		if( _this._statMode == _STAT_MODE_PROCESSING ){
			if( _this._checkSkip() ){
				_this._stat.doBreak();
				_this._stat.doEnd();
				return _CLIP_PROC_SUB_END;
			}
		}
		return _CLIP_NO_ERR;
	},
	_loopMultiEnd : function( _this ){
		if( _this._endCnt > 0 ){
			switch( _this._endType[_this._endCnt - 1] ){
			case _PROC_END_TYPE_WHILE:
				return _this._loopEndWhile( _this );
			case _PROC_END_TYPE_FOR:
				return _this._loopNext( _this );
			case _PROC_END_TYPE_IF:
				return _this._loopEndIf( _this );
			case _PROC_END_TYPE_SWITCH:
				return _this._loopEndSwi( _this );
			}
		}
		return _CLIP_PROC_ERR_STAT_END;
	},
	_loopIf : function( _this ){
		_this._endType[_this._endCnt] = _PROC_END_TYPE_IF;
		_this._endCnt++;

//		if( _this._statIfMode[_this._statIfCnt] != _STAT_IFMODE_STARTED ){
			_this._statIfCnt++;
			if( _this._statIfCnt > _this._statIfMax ){
				_this._statIfCnt--;
				return _CLIP_PROC_ERR_STAT_IF;
			}
			if( _this._checkSkipSwi() || ((_this._statIfMode[_this._statIfCnt - 1] == _STAT_IFMODE_DISABLE) || (_this._statIfMode[_this._statIfCnt - 1] == _STAT_IFMODE_PROCESSED)) ){
				_this._statIfMode[_this._statIfCnt] = _STAT_IFMODE_PROCESSED;
				return _CLIP_PROC_SUB_END;
			} else {
//				_this._statIfMode[_this._statIfCnt] = _STAT_IFMODE_STARTED;
				_this._statIfMode[_this._statIfCnt] = _STAT_IFMODE_ENABLE;
			}
//		}
		return _CLIP_NO_ERR;
	},
	_loopElIf : function( _this ){
		if( _this._statIfCnt == 0 ){
			return _CLIP_PROC_ERR_STAT_ENDIF;
		}
		if( _this._statIfMode[_this._statIfCnt] == _STAT_IFMODE_PROCESSED ){
			return _CLIP_PROC_SUB_END;
		}
		return _CLIP_NO_ERR;
	},
	_loopElse : function( _this ){
		if( _this._statIfCnt == 0 ){
			return _CLIP_PROC_ERR_STAT_ENDIF;
		}
		if( _this._statIfMode[_this._statIfCnt] == _STAT_IFMODE_PROCESSED ){
			return _CLIP_PROC_SUB_END;
		}
		return _CLIP_NO_ERR;
	},
	_loopEndIf : function( _this ){
		if( _this._endCnt > 0 ){
			_this._endCnt--;
		}

		if( _this._statIfCnt == 0 ){
			return _CLIP_PROC_ERR_STAT_ENDIF;
		}
		_this._statIfCnt--;
		if( _this._statIfMode[_this._statIfCnt] == _STAT_IFMODE_PROCESSED ){
			return _CLIP_PROC_SUB_END;
		}
		return _CLIP_NO_ERR;
	},
	_loopSwitch : function( _this ){
		_this._endType[_this._endCnt] = _PROC_END_TYPE_SWITCH;
		_this._endCnt++;

//		if( _this._statSwiMode[_this._statSwiCnt] != _STAT_SWIMODE_STARTED ){
			_this._statSwiCnt++;
			if( _this._statSwiCnt > _this._statSwiMax ){
				_this._statSwiCnt--;
				return _CLIP_PROC_ERR_STAT_SWITCH;
			}
			if( _this._checkSkipIf() || ((_this._statSwiMode[_this._statSwiCnt - 1] == _STAT_SWIMODE_DISABLE) || (_this._statSwiMode[_this._statSwiCnt - 1] == _STAT_SWIMODE_PROCESSED)) ){
				_this._statSwiMode[_this._statSwiCnt] = _STAT_SWIMODE_PROCESSED;
				return _CLIP_PROC_SUB_END;
			} else {
//				_this._statSwiMode[_this._statSwiCnt] = _STAT_SWIMODE_STARTED;
				_this._statSwiMode[_this._statSwiCnt] = _STAT_SWIMODE_ENABLE;
			}
//		}
		return _CLIP_NO_ERR;
	},
	_loopCase : function( _this ){
		if( _this._statSwiCnt == 0 ){
			return _CLIP_PROC_ERR_STAT_ENDSWI;
		}
		if( _this._statSwiMode[_this._statSwiCnt] == _STAT_SWIMODE_PROCESSED ){
			return _CLIP_PROC_SUB_END;
		}
		return _CLIP_NO_ERR;
	},
	_loopDefault : function( _this ){
		if( _this._statSwiCnt == 0 ){
			return _CLIP_PROC_ERR_STAT_ENDSWI;
		}
		if( _this._statSwiMode[_this._statSwiCnt] == _STAT_SWIMODE_PROCESSED ){
			return _CLIP_PROC_SUB_END;
		}
		return _CLIP_NO_ERR;
	},
	_loopEndSwi : function( _this ){
		if( _this._endCnt > 0 ){
			_this._endCnt--;
		}

		if( _this._statSwiCnt == 0 ){
			return _CLIP_PROC_ERR_STAT_ENDSWI;
		}
		_this._statSwiCnt--;
		if( _this._statSwiMode[_this._statSwiCnt] == _STAT_SWIMODE_PROCESSED ){
			return _CLIP_PROC_SUB_END;
		}
		return _CLIP_NO_ERR;
	},
	_loopBreakSwi : function( _this ){
		if( _this._statSwiCnt == 0 ){
			return _CLIP_PROC_ERR_STAT_ENDSWI;
		}
		if( _this._statSwiMode[_this._statSwiCnt] == _STAT_SWIMODE_PROCESSED ){
			return _CLIP_PROC_SUB_END;
		}
		return _CLIP_NO_ERR;
	},
	_loopContinue : function( _this ){
		if( _this._statMode == _STAT_MODE_PROCESSING ){
			if( _this._checkSkip() ){
				return _CLIP_PROC_SUB_END;
			}
		}
		return _CLIP_NO_ERR;
	},
	_loopBreak : function( _this ){
		for( var i = _this._endCnt; i > 0; i-- ){
			if( _this._endType[i - 1] == _PROC_END_TYPE_IF ){
			} else if( _this._endType[i - 1] == _PROC_END_TYPE_SWITCH ){
				return _this._loopBreakSwi( _this );
			} else {
				break;
			}
		}

		if( _this._statMode == _STAT_MODE_PROCESSING ){
			if( _this._checkSkip() ){
				return _CLIP_PROC_SUB_END;
			}
		}
		return _CLIP_NO_ERR;
	},
	_loopAssert : function( _this ){
		if( _this._checkSkip() ){
			return _CLIP_PROC_SUB_END;
		}
		return _CLIP_NO_ERR;
	},
	_loopReturn : function( _this ){
		if( _this._checkSkip() ){
			return _CLIP_PROC_SUB_END;
		}
		return _CLIP_NO_ERR;
	},

	_doStatBreak : function(){
		this._stat.doBreak();

		this.resetLoopCount();
	},
	_statStart : function( _this, param, code, token ){
		if( _this._statMode == _STAT_MODE_PROCESSING ){
			_this._loopCnt++;
			incProcLoopTotal();
			if( (procLoopMax() > 0) && (_this._loopCnt > procLoopMax()) ){
				return _CLIP_PROC_ERR_STAT_LOOP;
			}
		}
		return _CLIP_PROC_SUB_END;
	},
	_statEnd : function( _this, param, code, token ){
		if( _this._statMode == _STAT_MODE_NOT_START ){
			return _CLIP_PROC_ERR_SE_LOOPEND;
		} else if( _this._statMode == _STAT_MODE_PROCESSING ){
			var ret;
			var tmpValue = newProcValArray( 2, _this, param );

			if( (ret = _this._constFirst( param, code, token, tmpValue[0] )) != _CLIP_NO_ERR ){
				return ret;
			}

			var saveArray     = _this._curInfo._curArray;
			var saveArraySize = _this._curInfo._curArraySize;

			if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != _CLIP_NO_ERR ){
				return ret;
			}
			var stop = _INT( tmpValue[1].mat()._mat[0].toFloat() );

			if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != _CLIP_NO_ERR ){
				return ret;
			}
			var step = _INT( tmpValue[1].mat()._mat[0].toFloat() );
			if( step == 0 ){
				return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}

			if( _this._curLine._token._get != null ){
				return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}

			tmpValue[0].mat().addAndAss( step );
//			_this._updateMatrix( param, tmpValue[0].mat() );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, tmpValue[0] );

			saveArray = null;

			if( ret != _CLIP_NO_ERR ){
				return ret;
			}

			var _break;
			if( step < 0 ){
				_break = (_INT( tmpValue[0].mat()._mat[0].toFloat() ) <= stop);
			} else {
				_break = (_INT( tmpValue[0].mat()._mat[0].toFloat() ) >= stop);
			}
			if( _break ){
				_this._doStatBreak();
			}
			_this._stat.doEnd();
		}
		return _CLIP_PROC_SUB_END;
	},
	_statEndInc : function( _this, param, code, token ){
		if( _this._statMode == _STAT_MODE_NOT_START ){
			return _CLIP_PROC_ERR_SE_LOOPEND;
		} else if( _this._statMode == _STAT_MODE_PROCESSING ){
			var ret;
			var tmpValue = newProcValArray( 2, _this, param );

			if( (ret = _this._constFirst( param, code, token, tmpValue[0] )) != _CLIP_NO_ERR ){
				return ret;
			}

			var saveArray     = _this._curInfo._curArray;
			var saveArraySize = _this._curInfo._curArraySize;

			if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != _CLIP_NO_ERR ){
				return ret;
			}

			if( _this._curLine._token._get != null ){
				return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}

			tmpValue[0].mat().addAndAss( 1 );
//			_this._updateMatrix( param, tmpValue[0].mat() );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, tmpValue[0] );

			saveArray = null;

			if( ret != _CLIP_NO_ERR ){
				return ret;
			}

			if( _INT( tmpValue[0].mat()._mat[0].toFloat() ) >= _INT( tmpValue[1].mat()._mat[0].toFloat() ) ){
				_this._doStatBreak();
			}
			_this._stat.doEnd();
		}
		return _CLIP_PROC_SUB_END;
	},
	_statEndDec : function( _this, param, code, token ){
		if( _this._statMode == _STAT_MODE_NOT_START ){
			return _CLIP_PROC_ERR_SE_LOOPEND;
		} else if( _this._statMode == _STAT_MODE_PROCESSING ){
			var ret;
			var tmpValue = newProcValArray( 2, _this, param );

			if( (ret = _this._constFirst( param, code, token, tmpValue[0] )) != _CLIP_NO_ERR ){
				return ret;
			}

			var saveArray     = _this._curInfo._curArray;
			var saveArraySize = _this._curInfo._curArraySize;

			if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != _CLIP_NO_ERR ){
				return ret;
			}

			if( _this._curLine._token._get != null ){
				return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}

			tmpValue[0].mat().subAndAss( 1 );
//			_this._updateMatrix( param, tmpValue[0].mat() );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, tmpValue[0] );

			saveArray = null;

			if( ret != _CLIP_NO_ERR ){
				return ret;
			}

			if( _INT( tmpValue[0].mat()._mat[0].toFloat() ) <= _INT( tmpValue[1].mat()._mat[0].toFloat() ) ){
				_this._doStatBreak();
			}
			_this._stat.doEnd();
		}
		return _CLIP_PROC_SUB_END;
	},
	_statEndEq : function( _this, param, code, token ){
		if( _this._statMode == _STAT_MODE_NOT_START ){
			return _CLIP_PROC_ERR_SE_LOOPEND;
		} else if( _this._statMode == _STAT_MODE_PROCESSING ){
			var ret;
			var tmpValue = newProcValArray( 2, _this, param );

			if( (ret = _this._constFirst( param, code, token, tmpValue[0] )) != _CLIP_NO_ERR ){
				return ret;
			}

			var saveArray     = _this._curInfo._curArray;
			var saveArraySize = _this._curInfo._curArraySize;

			if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != _CLIP_NO_ERR ){
				return ret;
			}
			var stop = _INT( tmpValue[1].mat()._mat[0].toFloat() );

			if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != _CLIP_NO_ERR ){
				return ret;
			}
			var step = _INT( tmpValue[1].mat()._mat[0].toFloat() );
			if( step == 0 ){
				return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}

			if( _this._curLine._token._get != null ){
				return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}

			tmpValue[0].mat().addAndAss( step );
//			_this._updateMatrix( param, tmpValue[0].mat() );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, tmpValue[0] );

			saveArray = null;

			if( ret != _CLIP_NO_ERR ){
				return ret;
			}

			var _break;
			if( step < 0 ){
				_break = (_INT( tmpValue[0].mat()._mat[0].toFloat() ) < stop);
			} else {
				_break = (_INT( tmpValue[0].mat()._mat[0].toFloat() ) > stop);
			}
			if( _break ){
				_this._doStatBreak();
			}
			_this._stat.doEnd();
		}
		return _CLIP_PROC_SUB_END;
	},
	_statEndEqInc : function( _this, param, code, token ){
		if( _this._statMode == _STAT_MODE_NOT_START ){
			return _CLIP_PROC_ERR_SE_LOOPEND;
		} else if( _this._statMode == _STAT_MODE_PROCESSING ){
			var ret;
			var tmpValue = newProcValArray( 2, _this, param );

			if( (ret = _this._constFirst( param, code, token, tmpValue[0] )) != _CLIP_NO_ERR ){
				return ret;
			}

			var saveArray     = _this._curInfo._curArray;
			var saveArraySize = _this._curInfo._curArraySize;

			if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != _CLIP_NO_ERR ){
				return ret;
			}

			if( _this._curLine._token._get != null ){
				return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}

			tmpValue[0].mat().addAndAss( 1 );
//			_this._updateMatrix( param, tmpValue[0].mat() );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, tmpValue[0] );

			saveArray = null;

			if( ret != _CLIP_NO_ERR ){
				return ret;
			}

			if( _INT( tmpValue[0].mat()._mat[0].toFloat() ) > _INT( tmpValue[1].mat()._mat[0].toFloat() ) ){
				_this._doStatBreak();
			}
			_this._stat.doEnd();
		}
		return _CLIP_PROC_SUB_END;
	},
	_statEndEqDec : function( _this, param, code, token ){
		if( _this._statMode == _STAT_MODE_NOT_START ){
			return _CLIP_PROC_ERR_SE_LOOPEND;
		} else if( _this._statMode == _STAT_MODE_PROCESSING ){
			var ret;
			var tmpValue = newProcValArray( 2, _this, param );

			if( (ret = _this._constFirst( param, code, token, tmpValue[0] )) != _CLIP_NO_ERR ){
				return ret;
			}

			var saveArray     = _this._curInfo._curArray;
			var saveArraySize = _this._curInfo._curArraySize;

			if( (ret = _this._getSeOperand( param, code, token, tmpValue[1] )) != _CLIP_NO_ERR ){
				return ret;
			}

			if( _this._curLine._token._get != null ){
				return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
			}

			tmpValue[0].mat().subAndAss( 1 );
//			_this._updateMatrix( param, tmpValue[0].mat() );
			ret = _this._assVal( param, code, token, saveArray, saveArraySize, tmpValue[0] );

			saveArray = null;

			if( ret != _CLIP_NO_ERR ){
				return ret;
			}

			if( _INT( tmpValue[0].mat()._mat[0].toFloat() ) < _INT( tmpValue[1].mat()._mat[0].toFloat() ) ){
				_this._doStatBreak();
			}
			_this._stat.doEnd();
		}
		return _CLIP_PROC_SUB_END;
	},
	_statCont : function( _this, param, code, token ){
		switch( _this._statMode ){
		case _STAT_MODE_NOT_START:
			return _CLIP_PROC_ERR_SE_LOOPCONT;
		case _STAT_MODE_PROCESSING:
			_this._stat.doEnd();
			break;
		}
		return _CLIP_PROC_SUB_END;
	},
	_statDo : function( _this, param, code, token ){
		if( _this._statMode == _STAT_MODE_PROCESSING ){
			_this._loopCnt++;
			incProcLoopTotal();
			if( (procLoopMax() > 0) && (_this._loopCnt > procLoopMax()) ){
				return _CLIP_PROC_ERR_STAT_LOOP;
			}
		}
		return _CLIP_PROC_SUB_END;
	},
	_statUntil : function( _this, param, code, token ){
		if( _this._statMode == _STAT_MODE_NOT_START ){
			return _CLIP_PROC_ERR_STAT_UNTIL;
		} else if( _this._statMode == _STAT_MODE_PROCESSING ){
			var ret;
			var tmpValue = new _ProcVal( _this, param );

			if( (ret = _this._const( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
				return ret;
			}
			if( tmpValue.mat().equal( 0.0 ) ){
				_this._doStatBreak();
			}
			_this._stat.doEnd();
		}
		return _CLIP_PROC_SUB_END;
	},
	_statWhile : function( _this, param, code, token ){
		if( _this._statMode == _STAT_MODE_PROCESSING ){
			_this._loopCnt++;
			incProcLoopTotal();
			if( (procLoopMax() > 0) && (_this._loopCnt > procLoopMax()) ){
				return _CLIP_PROC_ERR_STAT_LOOP;
			}

			var ret;
			var tmpValue = new _ProcVal( _this, param );

			if( (ret = _this._const( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
				return ret;
			}
			if( tmpValue.mat().equal( 0.0 ) ){
				_this._doStatBreak();
			}
		}
		return _CLIP_PROC_SUB_END;
	},
	_statEndWhile : function( _this, param, code, token ){
		switch( _this._statMode ){
		case _STAT_MODE_NOT_START:
			return _CLIP_PROC_ERR_STAT_ENDWHILE;
		case _STAT_MODE_PROCESSING:
			_this._stat.doEnd();
			break;
		}
		return _CLIP_PROC_SUB_END;
	},
	_statFor : function( _this, param, code, token ){
		if( _this._statMode == _STAT_MODE_PROCESSING ){
			_this._loopCnt++;
			incProcLoopTotal();
			if( (procLoopMax() > 0) && (_this._loopCnt > procLoopMax()) ){
				return _CLIP_PROC_ERR_STAT_LOOP;
			}

			var ret;
			var tmpValue = new _ProcVal( _this, param );

			if( (ret = _this._const( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
				return ret;
			}
			if( tmpValue.mat().equal( 0.0 ) ){
				_this._doStatBreak();
			}
		}
		return _CLIP_PROC_SUB_END;
	},
	_statFor2 : function( _this, param, code, token ){
		if( _this._statMode == _STAT_MODE_PROCESSING ){
			_this._loopCnt++;
			incProcLoopTotal();
			if( (procLoopMax() > 0) && (_this._loopCnt > procLoopMax()) ){
				return _CLIP_PROC_ERR_STAT_LOOP;
			}
		}
		return _CLIP_PROC_SUB_END;
	},
	_statNext : function( _this, param, code, token ){
		switch( _this._statMode ){
		case _STAT_MODE_NOT_START:
			return _CLIP_PROC_ERR_STAT_NEXT;
		case _STAT_MODE_PROCESSING:
			_this._stat.doEnd();
			break;
		}
		return _CLIP_PROC_SUB_END;
	},
	_statFunc : function( _this, param, code, token ){
		var i;

		if( _this._statMode == _STAT_MODE_PROCESSING ){
			var newCode;
			var newToken;

			if( _this._curLine._token.getTokenParam( param ) ){
				newCode  = _get_code;
				newToken = _get_token;
				if( newCode == _CLIP_CODE_TOP ){
					if( !(_this._curLine._token.getTokenParam( param )) ){
						return _this._retError( _CLIP_PROC_ERR_STAT_FUNCNAME, newCode, newToken );
					}
					newCode  = _get_code;
					newToken = _get_token;
				}
				if( (newCode == _CLIP_CODE_LABEL) || (newCode == _CLIP_CODE_GLOBAL_VAR) || (newCode == _CLIP_CODE_GLOBAL_ARRAY) ){
					_this._stat.doBreak();

					if( param._func.search( newToken, false, null ) != null ){
						return _this._retError( _CLIP_PROC_ERR_STAT_FUNCNAME, newCode, newToken );
					}
					var func;
					if( (func = param._func.create( newToken, _this._curLine._num + 1 )) != null ){
						// 関数パラメータのラベルを取り込む
						i = 0;
						while( _this._curLine._token.getToken() ){
							newCode  = _get_code;
							newToken = _get_token;
							switch( newCode ){
							case _CLIP_CODE_TOP:
							case _CLIP_CODE_END:
								break;
							case _CLIP_CODE_PARAM_ANS:
							case _CLIP_CODE_PARAM_ARRAY:
							case _CLIP_CODE_OPERATOR:
								func._label.addCode( newCode, newToken );
								break;
							case _CLIP_CODE_LABEL:
								if( i <= 9 ){
									func._label.addCode( newCode, newToken );
									i++;
									break;
								}
								// そのまま下に流す
							default:
								param._func.del( func );
								return _this._retError( _CLIP_PROC_ERR_STAT_FUNCPARAM, newCode, newToken );
							}
						}

						// 関数の記述を取り込む
						var line;
						while( (line = _this._stat.getLine()) != null ){
							_this._curLine = line;
							func._line.regLine( _this._curLine );
						}
					} else {
						return _CLIP_PROC_ERR_STAT_FUNC;
					}

					return _CLIP_PROC_SUB_END;
				}
			}
			return _this._retError( _CLIP_PROC_ERR_STAT_FUNCNAME, newCode, newToken );
		}
		return _CLIP_PROC_SUB_END;
	},
	_statEndFunc : function( _this, param, code, token ){
		switch( _this._statMode ){
		case _STAT_MODE_NOT_START:
			return _CLIP_PROC_ERR_STAT_ENDFUNC;
		case _STAT_MODE_PROCESSING:
			_this._stat.doEnd();
			break;
		}
		return _CLIP_PROC_SUB_END;
	},
	_statMultiEnd : function( _this, param, code, token ){
		switch( _this._endType[_this._endCnt] ){
		case _PROC_END_TYPE_WHILE:
			return _this._statEndWhile( _this, param, code, token );
		case _PROC_END_TYPE_FOR:
			return _this._statNext( _this, param, code, token );
		case _PROC_END_TYPE_IF:
			return _this._statEndIf( _this, param, code, token );
		case _PROC_END_TYPE_SWITCH:
			return _this._statEndSwi( _this, param, code, token );
		}

		switch( _this._statMode ){
		case _STAT_MODE_NOT_START:
			return _CLIP_PROC_ERR_STAT_END;
		case _STAT_MODE_PROCESSING:
			_this._stat.doEnd();
			break;
		}
		return _CLIP_PROC_SUB_END;
	},
	_statIf : function( _this, param, code, token ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._const( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			_this._statIfCnt--;
			return ret;
		}
		_this._statIfMode[_this._statIfCnt] = (tmpValue.mat().notEqual( 0.0 ) ? _STAT_IFMODE_ENABLE : _STAT_IFMODE_DISABLE);
		return _CLIP_PROC_SUB_END;
	},
	_statElIf : function( _this, param, code, token ){
		if( _this._statIfMode[_this._statIfCnt] == _STAT_IFMODE_DISABLE ){
			var ret;
			var tmpValue = new _ProcVal( _this, param );

			if( (ret = _this._const( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
				return ret;
			}
			if( tmpValue.mat().notEqual( 0.0 ) ){
				_this._statIfMode[_this._statIfCnt] = _STAT_IFMODE_ENABLE;
			}
		} else if( _this._statIfMode[_this._statIfCnt] == _STAT_IFMODE_ENABLE ){
			_this._statIfMode[_this._statIfCnt] = _STAT_IFMODE_PROCESSED;
		}
		return _CLIP_PROC_SUB_END;
	},
	_statElse : function( _this, param, code, token ){
		if( _this._statIfMode[_this._statIfCnt] == _STAT_IFMODE_DISABLE ){
			_this._statIfMode[_this._statIfCnt] = _STAT_IFMODE_ENABLE;
		} else if( _this._statIfMode[_this._statIfCnt] == _STAT_IFMODE_ENABLE ){
			_this._statIfMode[_this._statIfCnt] = _STAT_IFMODE_PROCESSED;
		}
		return _CLIP_PROC_SUB_END;
	},
	_statEndIf : function( _this, param, code, token ){
		return _CLIP_PROC_SUB_END;
	},
	_statSwitch : function( _this, param, code, token ){
		var ret;

		if( (ret = _this._const( param, code, token, _this._statSwiVal[_this._statSwiCnt].setParam( param ) )) != _CLIP_NO_ERR ){
			_this._statSwiCnt--;
			return ret;
		}
		_this._statSwiMode[_this._statSwiCnt] = _STAT_SWIMODE_DISABLE;
		return _CLIP_PROC_SUB_END;
	},
	_statCase : function( _this, param, code, token ){
		if( _this._statSwiMode[_this._statSwiCnt] == _STAT_SWIMODE_DISABLE ){
			var ret;
			var tmpValue = new _ProcVal( _this, param );

			if( (ret = _this._const( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
				return ret;
			}
			if( tmpValue.mat().equal( _this._statSwiVal[_this._statSwiCnt].setParam( param ).mat() ) ){
				_this._statSwiMode[_this._statSwiCnt] = _STAT_SWIMODE_ENABLE;
			}
		}
		return _CLIP_PROC_SUB_END;
	},
	_statDefault : function( _this, param, code, token ){
		if( _this._statSwiMode[_this._statSwiCnt] == _STAT_SWIMODE_DISABLE ){
			_this._statSwiMode[_this._statSwiCnt] = _STAT_SWIMODE_ENABLE;
		}
		return _CLIP_PROC_SUB_END;
	},
	_statEndSwi : function( _this, param, code, token ){
		return _CLIP_PROC_SUB_END;
	},
	_statBreakSwi : function( _this, param, code, token ){
		if( _this._statSwiMode[_this._statSwiCnt] == _STAT_SWIMODE_ENABLE ){
			if( _this._statIfMode[_this._statIfCnt] == _STAT_IFMODE_ENABLE ){
				_this._statSwiMode[_this._statSwiCnt] = _STAT_SWIMODE_PROCESSED;
			}
		}
		return _CLIP_PROC_SUB_END;
	},
	_statContinue : function( _this, param, code, token ){
		switch( _this._statMode ){
		case _STAT_MODE_NOT_START:
			return _CLIP_PROC_ERR_STAT_CONTINUE;
		case _STAT_MODE_PROCESSING:
			_this._stat.doContinue();
			break;
		}
		return _CLIP_PROC_SUB_END;
	},
	_statBreak : function( _this, param, code, token ){
		for( var i = _this._endCnt; i > 0; i-- ){
			if( _this._endType[i - 1] == _PROC_END_TYPE_IF ){
			} else if( _this._endType[i - 1] == _PROC_END_TYPE_SWITCH ){
				return _this._statBreakSwi( _this, param, code, token );
			} else {
				break;
			}
		}

		switch( _this._statMode ){
		case _STAT_MODE_NOT_START:
			return _CLIP_PROC_ERR_STAT_BREAK;
		case _STAT_MODE_PROCESSING:
			_this._doStatBreak();
			break;
		}
		return _CLIP_PROC_SUB_END;
	},
	_statContinue2 : function( _this, param, code, token ){
		switch( _this._statMode ){
		case _STAT_MODE_NOT_START:
			return _CLIP_PROC_ERR_SE_CONTINUE;
		case _STAT_MODE_PROCESSING:
			var ret;
			var tmpValue = new _ProcVal( _this, param );

			if( (ret = _this._const( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
				return _CLIP_PROC_ERR_SE_OPERAND;
			}

			if( _this._curLine._token._get != null ){
				return _CLIP_PROC_ERR_SE_OPERAND;
			}

			if( tmpValue.mat().notEqual( 0.0 ) ){
				_this._stat.doContinue();
			}

			break;
		}
		return _CLIP_PROC_SUB_END;
	},
	_statBreak2 : function( _this, param, code, token ){
		switch( _this._statMode ){
		case _STAT_MODE_NOT_START:
			return _CLIP_PROC_ERR_SE_BREAK;
		case _STAT_MODE_PROCESSING:
			var ret;
			var tmpValue = new _ProcVal( _this, param );

			if( (ret = _this._const( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
				return _CLIP_PROC_ERR_SE_OPERAND;
			}

			if( _this._curLine._token._get != null ){
				return _CLIP_PROC_ERR_SE_OPERAND;
			}

			if( tmpValue.mat().notEqual( 0.0 ) ){
				_this._doStatBreak();
			}

			break;
		}
		return _CLIP_PROC_SUB_END;
	},
	_statAssert : function( _this, param, code, token ){
		// 診断メッセージONの場合のみ処理を行う
		if( _this._printAssert ){
			var ret;
			var tmpValue = new _ProcVal( _this, param );

			if( (ret = _this._const( param, code, token, tmpValue )) == _CLIP_NO_ERR ){
				if( tmpValue.mat().equal( 0.0 ) ){
					if( _this._assertProc( _this._curLine._num, param ) ){
						return _CLIP_ERR_ASSERT;
					}
				}
			} else {
				return ret;
			}
		}

		return _CLIP_PROC_SUB_END;
	},
	_statReturn : function( _this, param, code, token ){
		if( _this._curLine._token.getTokenLock() ){
			var ret;
			var tmpValue = new _ProcVal( _this, param );

			if( (ret = _this._const( param, code, token, tmpValue )) == _CLIP_NO_ERR ){
				if( param._printAns ){
					if( param._mpFlag ){
						param._array.move( 0 );
						param._array._mp[0] = Array.from( tmpValue.mp() );
					} else {
						param._array.setMatrix( 0, tmpValue.mat(), true );
					}
				} else {
					_this._errorProc( _CLIP_PROC_WARN_RETURN, _this._curLine._num, param, _CLIP_CODE_NULL, null );
				}
			} else {
				return ret;
			}
		}

		// 終了要求
		_this._quitFlag = true;

		return _CLIP_PROC_SUB_END;
	},
	_statReturn2 : function( _this, param, code, token ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._const( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return _CLIP_PROC_ERR_SE_OPERAND;
		}

		if( _this._curLine._token._get != null ){
			return _CLIP_PROC_ERR_SE_OPERAND;
		}

		if( tmpValue.mat().notEqual( 0.0 ) ){
			// 終了要求
			_this._quitFlag = true;
		}

		return _CLIP_PROC_SUB_END;
	},
	_statReturn3 : function( _this, param, code, token ){
		var ret;
		var tmpValue = new _ProcVal( _this, param );

		if( (ret = _this._const( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
			return _CLIP_PROC_ERR_SE_OPERAND;
		}

		var tmp;
		if( param._mpFlag ){
			if( param._mode == _CLIP_MODE_F_MULTIPREC ){
				tmp = (_proc_mp.fcmp( tmpValue.mp(), _proc_mp.F( "0.0" ) ) != 0);
			} else {
				tmp = (_proc_mp.cmp( tmpValue.mp(), _proc_mp.I( "0" ) ) != 0);
			}
		} else {
			tmp = tmpValue.mat().notEqual( 0.0 );
		}
		if( tmp ){
			if( (ret = _this._getSeOperand( param, code, token, tmpValue )) != _CLIP_NO_ERR ){
				return _CLIP_PROC_ERR_SE_OPERAND;
			}

			if( _this._curLine._token._get != null ){
				return _CLIP_PROC_ERR_SE_OPERAND;
			}

			if( param._printAns ){
				if( param._mpFlag ){
					param._array.move( 0 );
					param._array._mp[0] = Array.from( tmpValue.mp() );
				} else {
					param._array.setMatrix( 0, tmpValue.mat(), true );
				}
			} else {
				_this._errorProc( _CLIP_PROC_WARN_SE_RETURN, _this._curLine._num, param, _CLIP_CODE_NULL, null );
			}

			// 終了要求
			_this._quitFlag = true;
		} else {
			if( (ret = _this._skipSeOperand( code, token )) != _CLIP_NO_ERR ){
				return _CLIP_PROC_ERR_SE_OPERAND;
			}

			if( _this._curLine._token._get != null ){
				return _CLIP_PROC_ERR_SE_OPERAND;
			}
		}

		return _CLIP_PROC_SUB_END;
	},

	_commandNull : function( _this, param, code, token ){
		return _CLIP_PROC_ERR_COMMAND_NULL;
	},
	_commandEFloat : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_E_FLOAT );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_E_FLOAT );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param.setPrec( _INT( value.mat()._mat[0].toFloat() ) );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandFFloat : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_F_FLOAT );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_F_FLOAT );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param.setPrec( _INT( value.mat()._mat[0].toFloat() ) );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandGFloat : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_G_FLOAT );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_G_FLOAT );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param.setPrec( _INT( value.mat()._mat[0].toFloat() ) );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandEComplex : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_E_COMPLEX );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_E_COMPLEX );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param.setPrec( _INT( value.mat()._mat[0].toFloat() ) );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandFComplex : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_F_COMPLEX );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_F_COMPLEX );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param.setPrec( _INT( value.mat()._mat[0].toFloat() ) );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandGComplex : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_G_COMPLEX );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_G_COMPLEX );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param.setPrec( _INT( value.mat()._mat[0].toFloat() ) );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandPrec : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param.setPrec( _INT( value.mat()._mat[0].toFloat() ) );
			return _CLIP_PROC_SUB_END;
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandIFract : function( _this, param, code, token ){
		param.setMode( _CLIP_MODE_I_FRACT );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_I_FRACT );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandMFract : function( _this, param, code, token ){
		param.setMode( _CLIP_MODE_M_FRACT );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_M_FRACT );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandHTime : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_H_TIME );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_H_TIME );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			var fps = value.mat()._mat[0].toFloat();
			param.setFps( fps );
			if( globalParam() != param ){
				globalParam().setFps( fps );
			}
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandMTime : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_M_TIME );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_M_TIME );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			var fps = value.mat()._mat[0].toFloat();
			param.setFps( fps );
			if( globalParam() != param ){
				globalParam().setFps( fps );
			}
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandSTime : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_S_TIME );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_S_TIME );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			var fps = value.mat()._mat[0].toFloat();
			param.setFps( fps );
			if( globalParam() != param ){
				globalParam().setFps( fps );
			}
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandFTime : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_F_TIME );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_F_TIME );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			var fps = value.mat()._mat[0].toFloat();
			param.setFps( fps );
			if( globalParam() != param ){
				globalParam().setFps( fps );
			}
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandFps : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			var fps = value.mat()._mat[0].toFloat();
			param.setFps( fps );
			if( globalParam() != param ){
				globalParam().setFps( fps );
			}
			return _CLIP_PROC_SUB_END;
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandSChar : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_S_CHAR );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_S_CHAR );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param.setRadix( _INT( value.mat()._mat[0].toFloat() ) );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandUChar : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_U_CHAR );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_U_CHAR );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param.setRadix( _INT( value.mat()._mat[0].toFloat() ) );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandSShort : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_S_SHORT );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_S_SHORT );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param.setRadix( _INT( value.mat()._mat[0].toFloat() ) );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandUShort : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_U_SHORT );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_U_SHORT );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param.setRadix( _INT( value.mat()._mat[0].toFloat() ) );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandSLong : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_S_LONG );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_S_LONG );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param.setRadix( _INT( value.mat()._mat[0].toFloat() ) );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandULong : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_U_LONG );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_U_LONG );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param.setRadix( _INT( value.mat()._mat[0].toFloat() ) );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandSInt : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_S_LONG );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_S_LONG );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param.setRadix( _INT( value.mat()._mat[0].toFloat() ) );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandUInt : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_U_LONG );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_U_LONG );
		}
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param.setRadix( _INT( value.mat()._mat[0].toFloat() ) );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandRadix : function( _this, param, code, token ){
		if( param._mode == _CLIP_MODE_I_MULTIPREC ){
			return _this._retError( _CLIP_PROC_ERR_COMMAND_RADIX, code, token );
		}

		var value = new _ProcVal( _this, param );

		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param.setRadix( _INT( value.mat()._mat[0].toFloat() ) );
			return _CLIP_PROC_SUB_END;
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandFMultiPrec : function( _this, param, code, token ){
		var lock;
		var value = new _ProcVal( _this, param );

		param.setMode( _CLIP_MODE_F_MULTIPREC );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_F_MULTIPREC );
		}

		lock = _this._curLine._token.lock();
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			var prec = _INT( value.mat()._mat[0].toFloat() );
			param.mpSetPrec( prec );
			if( globalParam() != param ){
				globalParam().mpSetPrec( prec );
			}
		} else {
			_this._curLine._token.unlock( lock );
		}

		if( _this._curLine._token.getToken() ){
			if( _get_code == _CLIP_CODE_LABEL ){
				if( !(param.mpSetRound( _get_token )) ){
					return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
				}
			}
		}

		return _CLIP_PROC_SUB_END;
	},
	_commandIMultiPrec : function( _this, param, code, token ){
		param.setMode( _CLIP_MODE_I_MULTIPREC );
		if( globalParam() != param ){
			globalParam().setMode( _CLIP_MODE_I_MULTIPREC );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandPType : function( _this, param, code, token ){
		param.setMode( _this._parentMode );
		param.mpSetPrec( _this._parentMpPrec );
		param._mpRound = _this._parentMpRound;
		if( globalParam() != param ){
			globalParam().setMode( _this._parentMode );
			globalParam().mpSetPrec( _this._parentMpPrec );
			globalParam()._mpRound = _this._parentMpRound;
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandRad : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		if( _this._const( param, code, token, value ) != _CLIP_NO_ERR ){
			value.matAss( 0.0 );
		}
		_this.setAngType( _ANG_TYPE_RAD, value.mat().notEqual( 0.0 ) );
		return _CLIP_PROC_SUB_END;
	},
	_commandDeg : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		if( _this._const( param, code, token, value ) != _CLIP_NO_ERR ){
			value.matAss( 0.0 );
		}
		_this.setAngType( _ANG_TYPE_DEG, value.mat().notEqual( 0.0 ) );
		return _CLIP_PROC_SUB_END;
	},
	_commandGrad : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		if( _this._const( param, code, token, value ) != _CLIP_NO_ERR ){
			value.matAss( 0.0 );
		}
		_this.setAngType( _ANG_TYPE_GRAD, value.mat().notEqual( 0.0 ) );
		return _CLIP_PROC_SUB_END;
	},
	_commandAngle : function( _this, param, code, token ){
		var value = newProcValArray( 2, _this, param );

		if( _this._const( param, code, token, value[0] ) == _CLIP_NO_ERR ){
			var tmp = _UNSIGNED( value[0].mat()._mat[0].toFloat(), _UMAX_8 );
			if( tmp < 10 ){
				value[1].matAss( param._var.val( _UNSIGNED( _CHAR_CODE_0 + tmp, _UMAX_8 ) ) );
				value[1].mat()._mat[0].angToAng( _this._parentAngType, _this._angType );
				param._var.set( _UNSIGNED( _CHAR_CODE_0 + tmp, _UMAX_8 ), value[1].mat()._mat[0], true );
				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandAns : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param._printAns = (_INT( value.mat()._mat[0].toFloat() ) != 0);
			return _CLIP_PROC_SUB_END;
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandAssert : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			_this.setAssertFlag( _INT( value.mat()._mat[0].toFloat() ) );
			return _CLIP_PROC_SUB_END;
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandWarn : function( _this, param, code, token ){
		var lock;
		var newCode;
		var newToken;
		var error = new _String();

		lock = _this._curLine._token.lock();
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( newCode == _CLIP_CODE_STRING ){
				if( _this._printWarn ){
					_this._formatError(
						newToken,
						param._fileFlag ? param._funcName : null,
						error
						);
					printWarn( error.str(), param._parentNum, param._parentFunc );
				}
				return _CLIP_PROC_SUB_END;
			} else if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				if( _this._printWarn ){
					if( newCode == _CLIP_CODE_GLOBAL_ARRAY ){
						param = globalParam();
					}
					_this._formatError(
						_this.strGet( param._array, _this.arrayIndexIndirect( param, newCode, newToken ) ),
						param._fileFlag ? param._funcName : null,
						error
						);
					printWarn( error.str(), param._parentNum, param._parentFunc );
				}
				return _CLIP_PROC_SUB_END;
			} else {
				var value = new _ProcVal( _this, param );

				_this._curLine._token.unlock( lock );
				if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
					_this.setWarnFlag( _INT( value.mat()._mat[0].toFloat() ) );
					return _CLIP_PROC_SUB_END;
				}
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandParam : function( _this, param, code, token ){
		var value = newProcValArray( 2, _this, param );

		if( _this._const( param, code, token, value[0] ) == _CLIP_NO_ERR ){
			if( _this._const( param, code, token, value[1] ) == _CLIP_NO_ERR ){
				var tmp = _UNSIGNED( value[0].mat()._mat[0].toFloat(), _UMAX_8 );
				if( tmp < 10 ){
					param._updateParam[tmp] = (_INT( value[1].mat()._mat[0].toFloat() ) != 0);
					return _CLIP_PROC_SUB_END;
				}
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandParams : function( _this, param, code, token ){
		var i;
		var lock;
		var newCode;
		var newToken;
		var label;

		lock = _this._curLine._token.lock();
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;

			// &かどうかをチェックする
			if( (newCode == _CLIP_CODE_PARAM_ANS) || ((newCode == _CLIP_CODE_OPERATOR) && (newToken >= _CLIP_OP_AND)) ){
				if( !(_this._curLine._token.getTokenParam( param )) ){
					return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
				}
				newCode  = _get_code;
				newToken = _get_token;
				param._updateParam[0] = true;
			} else {
				param._updateParam[0] = false;
			}

			if( (newCode == _CLIP_CODE_LABEL) || (newCode == _CLIP_CODE_GLOBAL_VAR) || (newCode == _CLIP_CODE_GLOBAL_ARRAY) ){
				label = newToken;

				// ラベルを設定する
				lock = _this._curLine._token.lock();
				if( _this._curLine._token.getToken() ){
					newCode  = _get_code;
					newToken = _get_token;
					if( newCode == _CLIP_CODE_PARAM_ARRAY ){
						param._array._label.setLabel( _CHAR_CODE_0, label, true );
					} else {
						_this._curLine._token.unlock( lock );
						param._var._label.setLabel( _CHAR_CODE_0, label, true );
					}
				} else {
					_this._curLine._token.unlock( lock );
					param._var._label.setLabel( _CHAR_CODE_0, label, true );
				}

				i = 1;
				while( _this._curLine._token.getTokenParam( param ) ){
					newCode  = _get_code;
					newToken = _get_token;

					if( i > 9 ){
						return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAMS, code, token );
					}

					// &かどうかをチェックする
					if( (newCode == _CLIP_CODE_PARAM_ANS) || ((newCode == _CLIP_CODE_OPERATOR) && (newToken >= _CLIP_OP_AND)) ){
						if( !(_this._curLine._token.getTokenParam( param )) ){
							return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
						}
						newCode  = _get_code;
						newToken = _get_token;
						param._updateParam[i] = true;
					} else {
						param._updateParam[i] = false;
					}

					switch( newCode ){
					case _CLIP_CODE_AUTO_VAR:
					case _CLIP_CODE_AUTO_ARRAY:
						return _this._retError( _CLIP_PROC_ERR_COMMAND_DEFINE, newCode, newToken );
					case _CLIP_CODE_LABEL:
					case _CLIP_CODE_GLOBAL_VAR:
					case _CLIP_CODE_GLOBAL_ARRAY:
						label = newToken;

						// ラベルを設定する
						lock = _this._curLine._token.lock();
						if( _this._curLine._token.getToken() ){
							newCode  = _get_code;
							newToken = _get_token;
							if( newCode == _CLIP_CODE_PARAM_ARRAY ){
								param._array._label.setLabel( _CHAR_CODE_0 + i, label, true );
							} else {
								_this._curLine._token.unlock( lock );
								param._var._label.setLabel( _CHAR_CODE_0 + i, label, true );
							}
						} else {
							_this._curLine._token.unlock( lock );
							param._var._label.setLabel( _CHAR_CODE_0 + i, label, true );
						}

						i++;

						break;
					default:
						return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
					}
				}
				return _CLIP_PROC_SUB_END;
			}
		}

		var value = new _ProcVal( _this, param );

		_this._curLine._token.unlock( lock );
		i = 0;
		while( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			if( i > 9 ){
				return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAMS, code, token );
			}
			param._updateParam[i] = (_INT( value.mat()._mat[0].toFloat() ) != 0);
			i++;
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandDefine : function( _this, param, code, token ){
		var newCode;
		var newToken;

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			switch( newCode ){
			case _CLIP_CODE_AUTO_VAR:
			case _CLIP_CODE_AUTO_ARRAY:
				return _this._retError( _CLIP_PROC_ERR_COMMAND_DEFINE, newCode, newToken );
			case _CLIP_CODE_LABEL:
			case _CLIP_CODE_GLOBAL_VAR:
			case _CLIP_CODE_GLOBAL_ARRAY:
				var value = new _ProcVal( _this, param );
				if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
					param._var.define( newToken, value.mat()._mat[0], true );
				} else {
					param._var.define( newToken, 1.0, true );
				}
				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandEnum : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );
		var newCode;
		var newToken;
		var lock;
		var tmpCode;
		var tmpToken;

		value.matAss( 0.0 );
		while( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			switch( newCode ){
			case _CLIP_CODE_AUTO_VAR:
			case _CLIP_CODE_AUTO_ARRAY:
				return _this._retError( _CLIP_PROC_ERR_COMMAND_DEFINE, newCode, newToken );
			case _CLIP_CODE_LABEL:
			case _CLIP_CODE_GLOBAL_VAR:
			case _CLIP_CODE_GLOBAL_ARRAY:
				lock = _this._curLine._token.lock();
				if( _this._curLine._token.getTokenParam( param ) ){
					tmpCode  = _get_code;
					tmpToken = _get_token;
					if( (tmpCode == _CLIP_CODE_LABEL) || (tmpCode == _CLIP_CODE_GLOBAL_VAR) || (tmpCode == _CLIP_CODE_GLOBAL_ARRAY) ){
						_this._curLine._token.unlock( lock );
					} else {
						_this._curLine._token.unlock( lock );
						if( _this._const( param, tmpCode, tmpToken, value ) != _CLIP_NO_ERR ){
							return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
						}
					}
				} else {
					_this._curLine._token.unlock( lock );
				}
				param._var.define( newToken, _INT( value.mat()._mat[0].toFloat() ), true );
				value.mat().addAndAss( 1.0 );
				break;
			default:
				return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
			}
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandUnDef : function( _this, param, code, token ){
		var newCode;
		var newToken;

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( newCode == _CLIP_CODE_LABEL ){
				return _this._retError( _CLIP_PROC_ERR_COMMAND_UNDEF, newCode, newToken );
			} else if( (newCode & _CLIP_CODE_VAR_MASK) != 0 ){
				if( newCode == _CLIP_CODE_GLOBAL_VAR ){
					param = globalParam();
				}
				param._var.undef( param._var._label._label[_this.varIndexIndirect( param, newCode, newToken )] );
				return _CLIP_PROC_SUB_END;
			} else if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				if( newCode == _CLIP_CODE_GLOBAL_ARRAY ){
					param = globalParam();
				}
				param._array.undef( param._array._label._label[_this.arrayIndexIndirect( param, newCode, newToken )] );
				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandVar : function( _this, param, code, token ){
		var newCode;
		var newToken;

		while( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			switch( newCode ){
			case _CLIP_CODE_AUTO_VAR:
			case _CLIP_CODE_AUTO_ARRAY:
				return _this._retError( _CLIP_PROC_ERR_COMMAND_DEFINE, newCode, newToken );
			case _CLIP_CODE_LABEL:
			case _CLIP_CODE_GLOBAL_VAR:
			case _CLIP_CODE_GLOBAL_ARRAY:
				param._var.define( newToken, 0.0, false );
				break;
			default:
				return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
			}
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandArray : function( _this, param, code, token ){
		var newCode;
		var newToken;

		while( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			switch( newCode ){
			case _CLIP_CODE_AUTO_VAR:
			case _CLIP_CODE_AUTO_ARRAY:
				return _this._retError( _CLIP_PROC_ERR_COMMAND_DEFINE, newCode, newToken );
			case _CLIP_CODE_LABEL:
			case _CLIP_CODE_GLOBAL_VAR:
			case _CLIP_CODE_GLOBAL_ARRAY:
				param._array.define( newToken );
				break;
			default:
				return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
			}
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandLocal : function( _this, param, code, token ){
		var lock;
		var newCode;
		var newToken;
		var label;

		while( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			switch( newCode ){
			case _CLIP_CODE_AUTO_VAR:
			case _CLIP_CODE_AUTO_ARRAY:
				return _this._retError( _CLIP_PROC_ERR_COMMAND_DEFINE, newCode, newToken );
			case _CLIP_CODE_LABEL:
			case _CLIP_CODE_GLOBAL_VAR:
			case _CLIP_CODE_GLOBAL_ARRAY:
				label = newToken;

				lock = _this._curLine._token.lock();
				if( _this._curLine._token.getToken() ){
					newCode  = _get_code;
					newToken = _get_token;
					if( newCode == _CLIP_CODE_PARAM_ARRAY ){
						param._array.define( label );
					} else {
						_this._curLine._token.unlock( lock );
						param._var.define( label, 0.0, false );
					}
				} else {
					_this._curLine._token.unlock( lock );
					param._var.define( label, 0.0, false );
				}

				break;
			default:
				return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
			}
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandGlobal : function( _this, param, code, token ){
		var lock;
		var newCode;
		var newToken;
		var label;

		while( _this._curLine._token.getTokenParam( globalParam() ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( newCode == _CLIP_CODE_LABEL ){
				label = newToken;

				lock = _this._curLine._token.lock();
				if( _this._curLine._token.getToken() ){
					newCode  = _get_code;
					newToken = _get_token;
					if( newCode == _CLIP_CODE_PARAM_ARRAY ){
						globalParam()._array.define( label );
					} else {
						_this._curLine._token.unlock( lock );
						globalParam()._var.define( label, 0.0, false );
					}
				} else {
					_this._curLine._token.unlock( lock );
					globalParam()._var.define( label, 0.0, false );
				}
			} else {
				lock = _this._curLine._token.lock();
				if( _this._curLine._token.getToken() ){
					if( _get_code == _CLIP_CODE_PARAM_ARRAY ){
						if( (newCode & _CLIP_CODE_ARRAY_MASK) == 0 ){
							return _this._retError( _CLIP_PROC_ERR_COMMAND_DEFINE, newCode, newToken );
						}
					} else {
						_this._curLine._token.unlock( lock );
					}
				} else {
					_this._curLine._token.unlock( lock );
					if( (newCode & _CLIP_CODE_VAR_MASK) == 0 ){
						return _this._retError( _CLIP_PROC_ERR_COMMAND_DEFINE, newCode, newToken );
					}
				}
			}
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandLabel : function( _this, param, code, token ){
		var newCode;
		var newToken;
		var label;

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			switch( newCode ){
			case _CLIP_CODE_AUTO_VAR:
			case _CLIP_CODE_AUTO_ARRAY:
				return _this._retError( _CLIP_PROC_ERR_COMMAND_DEFINE, newCode, newToken );
			case _CLIP_CODE_LABEL:
			case _CLIP_CODE_GLOBAL_VAR:
			case _CLIP_CODE_GLOBAL_ARRAY:
				label = newToken;
				if( _this._curLine._token.getTokenParam( param ) ){
					newCode  = _get_code;
					newToken = _get_token;
					if( newCode == _CLIP_CODE_VARIABLE ){
						param._var._label.setLabel( _this.varIndexParam( param, newToken ), label, true );
						return _CLIP_PROC_SUB_END;
					} else if( newCode == _CLIP_CODE_ARRAY ){
						param._array._label.setLabel( _this.arrayIndexParam( param, newToken ), label, true );
						return _CLIP_PROC_SUB_END;
					}
				}
				break;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandParent : function( _this, param, code, token ){
		var newCode;
		var newToken;
		var index;

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( newCode == _CLIP_CODE_VARIABLE ){
				index = _this.varIndexParam( param, newToken );

				if( param._parent != null ){
					// 親プロセスの変数を取り込む
					param.setVal( index, param._parent._var.val( index ), true );
					if( index == 0 ){
						_this._updateMatrix( param._parent, param._array._mat[index] );
					} else {
						_this._updateValue( param._parent, param._var.val( index ) );
					}

					param._updateParentVar[param._updateParentVar.length] = index;
				}

				if( _this._curLine._token.getTokenParam( param ) ){
					newCode  = _get_code;
					newToken = _get_token;
					switch( newCode ){
					case _CLIP_CODE_AUTO_VAR:
					case _CLIP_CODE_AUTO_ARRAY:
						return _this._retError( _CLIP_PROC_ERR_COMMAND_DEFINE, newCode, newToken );
					case _CLIP_CODE_LABEL:
					case _CLIP_CODE_GLOBAL_VAR:
					case _CLIP_CODE_GLOBAL_ARRAY:
						param._var._label.setLabel( index, newToken, true );
						break;
					default:
						return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
					}
				}

				return _CLIP_PROC_SUB_END;
			} else if( newCode == _CLIP_CODE_ARRAY ){
				index = _this.arrayIndexParam( param, newToken );

				if( param._parent != null ){
					// 親プロセスの配列を取り込む
					param._parent._array.dup( param._array, index, index, true );

					param._updateParentArray[param._updateParentArray.length] = index;
				}

				if( _this._curLine._token.getTokenParam( param ) ){
					newCode  = _get_code;
					newToken = _get_token;
					switch( newCode ){
					case _CLIP_CODE_AUTO_VAR:
					case _CLIP_CODE_AUTO_ARRAY:
						return _this._retError( _CLIP_PROC_ERR_COMMAND_DEFINE, newCode, newToken );
					case _CLIP_CODE_LABEL:
					case _CLIP_CODE_GLOBAL_VAR:
					case _CLIP_CODE_GLOBAL_ARRAY:
						param._array._label.setLabel( index, newToken, true );
						break;
					default:
						return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
					}
				}

				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandReal : function( _this, param, code, token ){
		var newCode;
		var newToken;

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;

			var value = new _ProcVal( _this, param );

			if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
				if( (newCode & _CLIP_CODE_VAR_MASK) != 0 ){
					if( newCode == _CLIP_CODE_GLOBAL_VAR ){
						param = globalParam();
					}
					var moveFlag = new _Boolean();
					var index = _this.varIndexIndirectMove( param, newCode, newToken, moveFlag );
					if( !(param.setReal( index, value.mat()._mat[0].toFloat(), moveFlag._val )) ){
						return _this._retError( _CLIP_PROC_ERR_ASS, newCode, newToken );
					}
					return _CLIP_PROC_SUB_END;
				}
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandImag : function( _this, param, code, token ){
		var newCode;
		var newToken;

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;

			var value = new _ProcVal( _this, param );

			if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
				if( (newCode & _CLIP_CODE_VAR_MASK) != 0 ){
					if( newCode == _CLIP_CODE_GLOBAL_VAR ){
						param = globalParam();
					}
					var moveFlag = new _Boolean();
					var index = _this.varIndexIndirectMove( param, newCode, newToken, moveFlag );
					if( !(param.setImag( index, value.mat()._mat[0].toFloat(), moveFlag._val )) ){
						return _this._retError( _CLIP_PROC_ERR_ASS, newCode, newToken );
					}
					return _CLIP_PROC_SUB_END;
				}
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandNum : function( _this, param, code, token ){
		var newCode;
		var newToken;

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;

			var value = new _ProcVal( _this, param );

			if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
				if( (newCode & _CLIP_CODE_VAR_MASK) != 0 ){
					if( newCode == _CLIP_CODE_GLOBAL_VAR ){
						param = globalParam();
					}
					var moveFlag = new _Boolean();
					var index = _this.varIndexIndirectMove( param, newCode, newToken, moveFlag );
					if( !(param.setNum( index, _UNSIGNED( value.mat()._mat[0].toFloat(), _UMAX_32 ), moveFlag._val )) ){
						return _this._retError( _CLIP_PROC_ERR_ASS, newCode, newToken );
					}
					return _CLIP_PROC_SUB_END;
				}
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandDenom : function( _this, param, code, token ){
		var newCode;
		var newToken;

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;

			var value = new _ProcVal( _this, param );

			if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
				if( (newCode & _CLIP_CODE_VAR_MASK) != 0 ){
					if( newCode == _CLIP_CODE_GLOBAL_VAR ){
						param = globalParam();
					}
					var moveFlag = new _Boolean();
					var index = _this.varIndexIndirectMove( param, newCode, newToken, moveFlag );
					if( !(param.setDenom( index, _UNSIGNED( value.mat()._mat[0].toFloat(), _UMAX_32 ), moveFlag._val )) ){
						return _this._retError( _CLIP_PROC_ERR_ASS, newCode, newToken );
					}
					return _CLIP_PROC_SUB_END;
				}
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandMat : function( _this, param, code, token ){
		var value = newProcValArray( 2, _this, param );
		var newCode;
		var newToken;

		if( _this._const( param, code, token, value[0] ) == _CLIP_NO_ERR ){
			if( _this._const( param, code, token, value[1] ) == _CLIP_NO_ERR ){
				if( _this._curLine._token.getTokenParam( param ) ){
					newCode  = _get_code;
					newToken = _get_token;
					if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
						if( newCode == _CLIP_CODE_GLOBAL_ARRAY ){
							param = globalParam();
						}
						var index = _this.arrayIndexIndirect( param, newCode, newToken );
						param._array._mat[index].resize( _INT( value[0].mat()._mat[0].toFloat() ), _INT( value[1].mat()._mat[0].toFloat() ) );
						return _CLIP_PROC_SUB_END;
					} else if( (newCode == _CLIP_CODE_LABEL) || (newCode == _CLIP_CODE_GLOBAL_VAR) ){
						var index = param._array.define( newToken );
						param._array._mat[index].resize( _INT( value[0].mat()._mat[0].toFloat() ), _INT( value[1].mat()._mat[0].toFloat() ) );
						return _CLIP_PROC_SUB_END;
					}
				}
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandTrans : function( _this, param, code, token ){
		var newCode;
		var newToken;

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				if( newCode == _CLIP_CODE_GLOBAL_ARRAY ){
					param = globalParam();
				}
				var index = _this.arrayIndexIndirect( param, newCode, newToken );
				param._array.setMatrix( index, param._array._mat[index].trans(), false );
				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandSRand : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			srand( _INT( value.mat()._mat[0].toFloat() ) );
			return _CLIP_PROC_SUB_END;
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandLocalTime : function( _this, param, code, token ){
		var i;
		var value = new _ProcVal( _this, param );
		var newCode;
		var newToken;
		var format = new _String();
		var errFlag;
		var curIndex;
		var moveFlag = new _Boolean();

		if( _this._const( param, code, token, value ) != _CLIP_NO_ERR ){
			return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
		}

		// 書式制御文字列の取得
		_this._getString( param, format );
		if( format.isNull() ){
			return _this._retError( _CLIP_PROC_ERR_STRING, code, token );
		}

		var t = _INT( value.mat()._mat[0].toFloat() );
		var tm = localtime( t );

		errFlag = false;
		for( i = 0; i < format.str().length; i++ ){
			if( format.str().charAt( i ) == '%' ){
				i++;
				if( i >= format.str().length ){
					errFlag = true;
					break;
				}
				if( _this._curLine._token.getTokenParam( param ) ){
					newCode  = _get_code;
					newToken = _get_token;
					if( (newCode & _CLIP_CODE_VAR_MASK) != 0 ){
						if( newCode == _CLIP_CODE_GLOBAL_VAR ){
							curIndex = _this.varIndexIndirectMove( globalParam(), newCode, newToken, moveFlag );
						} else {
							curIndex = _this.varIndexIndirectMove( param, newCode, newToken, moveFlag );
						}
					} else {
						errFlag = true;
						break;
					}
				}
				switch( format.str().charAt( i ) ){
				case 's': param._var.set( curIndex, tm._sec , moveFlag._val ); break;
				case 'm': param._var.set( curIndex, tm._min , moveFlag._val ); break;
				case 'h': param._var.set( curIndex, tm._hour, moveFlag._val ); break;
				case 'D': param._var.set( curIndex, tm._mday, moveFlag._val ); break;
				case 'M': param._var.set( curIndex, tm._mon , moveFlag._val ); break;
				case 'Y': param._var.set( curIndex, tm._year, moveFlag._val ); break;
				case 'w': param._var.set( curIndex, tm._wday, moveFlag._val ); break;
				case 'y': param._var.set( curIndex, tm._yday, moveFlag._val ); break;
				default:
					errFlag = true;
					break;
				}
				if( errFlag ){
					break;
				}
			}
		}

		// 書式制御文字列の解放
		format = null;

		if( errFlag ){
			return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
		}

		return _CLIP_PROC_SUB_END;
	},
	_commandArrayCopy : function( _this, param, code, token ){
		var i;
		var lock;
		var newCode;
		var newToken;
		var value = new _ProcVal( _this, param );
		var srcCode;
		var srcToken;
		var srcIndex = new Array();
		var dstCode;
		var dstToken;
		var dstIndex = new Array();

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				srcCode  = newCode;
				srcToken = newToken;
			} else {
				return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
			}
		} else {
			return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
		}

		i = 0;
		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			srcIndex[i] = _INT( value.mat()._mat[0].toFloat() );
			i++;
		} else {
			return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
		}

		while( true ){
			lock = _this._curLine._token.lock();
			if( _this._curLine._token.getTokenParam( param ) ){
				newCode  = _get_code;
				newToken = _get_token;
				if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
					dstCode  = newCode;
					dstToken = newToken;
					break;
				}
			}
			_this._curLine._token.unlock( lock );
			if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
				srcIndex[i] = _INT( value.mat()._mat[0].toFloat() );
				i++;
			} else {
				return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
			}
		}

		i = 0;
		while( true ){
			if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
				dstIndex[i] = _INT( value.mat()._mat[0].toFloat() );
				i++;
			} else {
				if( i == 0 ){
					return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
				}
				break;
			}
		}

		var dstIndexSize = dstIndex.length - 1;
		var len = dstIndex[dstIndexSize];
		if( len > 0 ){
			var srcIndexSize = srcIndex.length;
			var srcParam;
			var srcValue = newValueArray( len );

			for( i = 0; i < srcIndexSize; i++ ){
				srcIndex[i] -= param._base;
				if( srcIndex[i] < 0 ){
					return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
				}
			}
			srcIndex[srcIndexSize] = -1;

			for( i = 0; i < dstIndexSize; i++ ){
				dstIndex[i] -= param._base;
				if( dstIndex[i] < 0 ){
					return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
				}
			}
			dstIndex[dstIndexSize] = -1;

			srcIndex[srcIndexSize - 1] += len;
			for( i = 0; i < len; i++ ){
				srcIndex[srcIndexSize - 1]--;
				srcParam = (srcCode == _CLIP_CODE_GLOBAL_ARRAY) ? globalParam() : param;
				copyValue( srcValue[i], srcParam._array.val( _this.arrayIndexIndirect( srcParam, srcCode, srcToken ), srcIndex, srcIndexSize ) );
			}

			dstIndex[dstIndexSize - 1] += len;
			for( i = 0; i < len; i++ ){
				dstIndex[dstIndexSize - 1]--;
				switch( dstCode ){
				case _CLIP_CODE_ARRAY:
					param._array.set( _this._index( param, dstCode, dstToken ), dstIndex, dstIndexSize, srcValue[i], true );
					break;
				case _CLIP_CODE_AUTO_ARRAY:
					param._array.set( _this.autoArrayIndex( param, dstToken ), dstIndex, dstIndexSize, srcValue[i], false );
					break;
				case _CLIP_CODE_GLOBAL_ARRAY:
					globalParam()._array.set( _this.autoArrayIndex( globalParam(), dstToken ), dstIndex, dstIndexSize, srcValue[i], false );
					break;
				}
			}
		}

		return _CLIP_PROC_SUB_END;
	},
	_commandArrayFill : function( _this, param, code, token ){
		var i;
		var newCode;
		var newToken;
		var srcValue = new _ProcVal( _this, param );
		var tmpValue = new _ProcVal( _this, param );
		var dstCode;
		var dstToken;
		var dstIndex = new Array();

		if( _this._const( param, code, token, srcValue ) != _CLIP_NO_ERR ){
			return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
		}

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				dstCode  = newCode;
				dstToken = newToken;
			} else {
				return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
			}
		} else {
			return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
		}

		i = 0;
		while( true ){
			if( _this._const( param, code, token, tmpValue ) == _CLIP_NO_ERR ){
				dstIndex[i] = _INT( tmpValue.mat()._mat[0].toFloat() );
				i++;
			} else {
				if( i == 0 ){
					return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
				}
				break;
			}
		}

		var dstIndexSize = dstIndex.length - 1;
		var len = dstIndex[dstIndexSize];
		if( len > 0 ){
			for( i = 0; i < dstIndexSize; i++ ){
				dstIndex[i] -= param._base;
				if( dstIndex[i] < 0 ){
					return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
				}
			}
			dstIndex[dstIndexSize] = -1;

			dstIndex[dstIndexSize - 1] += len;
			for( i = 0; i < len; i++ ){
				dstIndex[dstIndexSize - 1]--;
				switch( dstCode ){
				case _CLIP_CODE_ARRAY:
					param._array.set( _this._index( param, dstCode, dstToken ), dstIndex, dstIndexSize, srcValue.mat()._mat[0], true );
					break;
				case _CLIP_CODE_AUTO_ARRAY:
					param._array.set( _this.autoArrayIndex( param, dstToken ), dstIndex, dstIndexSize, srcValue.mat()._mat[0], false );
					break;
				case _CLIP_CODE_GLOBAL_ARRAY:
					globalParam()._array.set( _this.autoArrayIndex( globalParam(), dstToken ), dstIndex, dstIndexSize, srcValue.mat()._mat[0], false );
					break;
				}
			}
		}

		return _CLIP_PROC_SUB_END;
	},
	_commandStrCpy : function( _this, param, code, token ){
		var newCode;
		var newToken;

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				var tmpParam = (newCode == _CLIP_CODE_GLOBAL_ARRAY) ? globalParam() : param;
				var _arrayIndex = _this.arrayIndexIndirect( tmpParam, newCode, newToken );

				var string = new _String();
				_this._getString( param, string );

				switch( token ){
				case _CLIP_COMMAND_STRCPY:
					_this.strSet( tmpParam._array, _arrayIndex, string.str() );
					break;
				case _CLIP_COMMAND_STRCAT:
					_this.strCat( tmpParam._array, _arrayIndex, string.str() );
					break;
				}

				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandStrLwr : function( _this, param, code, token ){
		var newCode;
		var newToken;

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				var tmpParam = (newCode == _CLIP_CODE_GLOBAL_ARRAY) ? globalParam() : param;
				var _arrayIndex = _this.arrayIndexIndirect( tmpParam, newCode, newToken );

				_this.strLwr( tmpParam._array, _arrayIndex );

				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandStrUpr : function( _this, param, code, token ){
		var newCode;
		var newToken;

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				var tmpParam = (newCode == _CLIP_CODE_GLOBAL_ARRAY) ? globalParam() : param;
				var _arrayIndex = _this.arrayIndexIndirect( tmpParam, newCode, newToken );

				_this.strUpr( tmpParam._array, _arrayIndex );

				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandPrint : function( _this, param, code, token ){
		var newCode;
		var newToken;
		var _arrayIndex = new Array( 2 );
		var topPrint;
		var curPrint;
		var tmpPrint;
		var errFlag;
		var lock;
		var value = new _ProcVal( _this, param );
		var real = new _String();
		var imag = new _String();

		switch( token ){
		case _CLIP_COMMAND_SPRINT:
			if( _this._curLine._token.getTokenParam( param ) ){
				newCode  = _get_code;
				newToken = _get_token;
				if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
					if( newCode == _CLIP_CODE_GLOBAL_ARRAY ){
						_arrayIndex[0] = _this.arrayIndexIndirect( globalParam(), newCode, newToken );
					} else {
						_arrayIndex[0] = _this.arrayIndexIndirect( param, newCode, newToken );
					}
				} else {
					return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
				}
			} else {
				return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
			}
			break;
		case _CLIP_COMMAND_PRINT:
		case _CLIP_COMMAND_PRINTLN:
			break;
		case _CLIP_COMMAND_LOG:
			if( skipCommandLog() ){
				while( true ){
					if( !(_this._curLine._token.getTokenParam( param )) ){
						break;
					}
				}
				return _CLIP_PROC_SUB_END;
			}
			break;
		}

		topPrint = null;
		errFlag = false;
		while( true ){
			lock = _this._curLine._token.lock();
			if( !(_this._curLine._token.getTokenParam( param )) ){
				break;
			}
			newCode  = _get_code;
			newToken = _get_token;

			if( topPrint == null ){
				topPrint = new __ProcPrint();
				curPrint = topPrint;
			} else {
				tmpPrint = new __ProcPrint();
				curPrint._next = tmpPrint;
				curPrint = tmpPrint;
			}
			curPrint._string = null;

			if( newCode == _CLIP_CODE_STRING ){
				curPrint._string = new String();
				curPrint._string = newToken;
			} else if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				var tmpParam = (newCode == _CLIP_CODE_GLOBAL_ARRAY) ? globalParam() : param;
				_arrayIndex[1] = _this.arrayIndexIndirect( tmpParam, newCode, newToken );
				curPrint._string = _this.strGet( tmpParam._array, _arrayIndex[1] );
				if( (curPrint._string.length == 0) && param._mpFlag ){
					curPrint._string = _this.mpNum2Str( tmpParam, tmpParam._array._mp[_arrayIndex[1]] );
				}
			} else {
				_this._curLine._token.unlock( lock );
				if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
					if( param._mpFlag ){
						curPrint._string = _this.mpNum2Str( param, value.mp() );
					} else {
						_proc_token.valueToString( param, value.mat()._mat[0], real, imag );
						curPrint._string = new String();
						curPrint._string = real.str() + imag.str();
					}
				} else {
					errFlag = true;
					break;
				}
			}
		}

		if( !errFlag ){
			switch( token ){
			case _CLIP_COMMAND_SPRINT:
				_this.strSet( param._array, _arrayIndex[0], "" );
				curPrint = topPrint;
				while( curPrint != null ){
					if( curPrint._string != null ){
						_this.strCat( param._array, _arrayIndex[0], curPrint._string );
					}
					curPrint = curPrint._next;
				}
				break;
			case _CLIP_COMMAND_PRINT:
				doCommandPrint( topPrint, false/*改行なし*/ );
				break;
			case _CLIP_COMMAND_PRINTLN:
				doCommandPrint( topPrint, true/*改行付き*/ );
				break;
			case _CLIP_COMMAND_LOG:
				doCommandLog( topPrint );
				break;
			}
		}

		curPrint = topPrint;
		while( curPrint != null ){
			tmpPrint = curPrint;
			curPrint = curPrint._next;
			if( tmpPrint._string != null ){
				tmpPrint._string = null;
			}
			tmpPrint = null;
		}

		if( errFlag ){
			return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
		}

		return _CLIP_PROC_SUB_END;
	},
	_commandScan : function( _this, param, code, token ){
		var newCode;
		var newToken;
		var ret = _CLIP_NO_ERR;

		var topScan;
		var curScan;
		var tmpScan;

		topScan = new __ProcScan();
		curScan = topScan;

		while( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( newCode == _CLIP_CODE_STRING ){
				curScan._title = new String();
				curScan._title = newToken;
			} else if( ((newCode & _CLIP_CODE_VAR_MASK) != 0) || ((newCode & _CLIP_CODE_ARRAY_MASK) != 0) ){
				switch( newCode ){
				case _CLIP_CODE_VARIABLE:
					if( param._var.isLocked( _this.varIndexParam( param, newToken ) ) ){
						ret = _this._retError( _CLIP_PROC_ERR_ASS, code, token );
					}
					break;
				case _CLIP_CODE_AUTO_VAR:
					if( param._var.isLocked( _this.autoVarIndex( param, newToken ) ) ){
						ret = _this._retError( _CLIP_PROC_ERR_ASS, code, token );
					}
					break;
				case _CLIP_CODE_GLOBAL_VAR:
					if( globalParam()._var.isLocked( _this.autoVarIndex( globalParam(), newToken ) ) ){
						ret = _this._retError( _CLIP_PROC_ERR_ASS, code, token );
					}
					break;
				}
				_proc_token.delToken( curScan._code, curScan._token );
				curScan._code = newCode;
				switch( newCode ){
				case _CLIP_CODE_VARIABLE:
					curScan._token = _this.varIndexParam( param, newToken );
					break;
				case _CLIP_CODE_ARRAY:
					curScan._token = _this.arrayIndexParam( param, newToken );
					break;
				default:
					curScan._token = _proc_token.newToken( newCode, newToken );
					break;
				}

				tmpScan         = new __ProcScan();
				tmpScan._before = curScan;
				curScan._next   = tmpScan;
				curScan         = tmpScan;
			}
		}

		if( curScan._title != null ){
			curScan._title = null;
		}

		if( curScan._before != null ){
			curScan._before._next = null;

			if( ret == _CLIP_NO_ERR ){
				doCommandScan( topScan, _this, param );
			}

			curScan = topScan;
			while( curScan != null ){
				tmpScan = curScan;
				curScan = curScan._next;
				if( tmpScan._title != null ){
					tmpScan._title = null;
				}
				tmpScan = null;
			}
		}

		if( ret != _CLIP_NO_ERR ){
			return ret;
		}
		return _CLIP_PROC_SUB_END;
	},
/*
	_commandChar2Esc : function( _this, param, code, token ){
		var newCode;
		var newToken;

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				if( newCode == _CLIP_CODE_GLOBAL_ARRAY ){
					param = globalParam();
				}

				var _arrayIndex = _this.arrayIndexIndirect( param, newCode, newToken );
				var string = new _String();

				string.set( _this.strGet( param._array, _arrayIndex ) );
				_this.strSet( param._array, _arrayIndex, string.escape().str() );

				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandEsc2Char : function( _this, param, code, token ){
		var newCode;
		var newToken;

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				if( newCode == _CLIP_CODE_GLOBAL_ARRAY ){
					param = globalParam();
				}

				var _arrayIndex = _this.arrayIndexIndirect( param, newCode, newToken );
				var string = new _String();

				string.set( _this.strGet( param._array, _arrayIndex ) );
				_this.strSet( param._array, _arrayIndex, string.unescape().str() );

				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
*/
	_commandClear : function( _this, param, code, token ){
		doCommandClear();
		return _CLIP_PROC_SUB_END;
	},
	_commandError : function( _this, param, code, token ){
		var newCode;
		var newToken;
		var error = new _String();

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( newCode == _CLIP_CODE_STRING ){
				_this._formatError(
					newToken,
					param._fileFlag ? param._funcName : null,
					error
					);
				printError( error.str(), param._parentNum, param._parentFunc );
				return _CLIP_PROC_SUB_END;
			} else if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				if( newCode == _CLIP_CODE_GLOBAL_ARRAY ){
					param = globalParam();
				}
				_this._formatError(
					_this.strGet( param._array, _this.arrayIndexIndirect( param, newCode, newToken ) ),
					param._fileFlag ? param._funcName : null,
					error
					);
				printError( error.str(), param._parentNum, param._parentFunc );
				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandGWorld : function( _this, param, code, token ){
		var ret = _CLIP_NO_ERR;
		var value = newProcValArray( 2, _this, param );

		for( var i = 0; i < 2; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == _CLIP_NO_ERR ){
			var width  = _INT( value[0].mat()._mat[0].toFloat() );
			var height = _INT( value[1].mat()._mat[0].toFloat() );
			if( token == _CLIP_COMMAND_GWORLD ){
				doCommandGWorld( width, height );
				procGWorld().create( width, height, true, false );
			} else {
				doCommandGWorld24( width, height );
				procGWorld().create( width, height, true, true );
			}
			return _CLIP_PROC_SUB_END;
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandWindow : function( _this, param, code, token ){
		var ret = _CLIP_NO_ERR;
		var value = newProcValArray( 4, _this, param );

		for( var i = 0; i < 4; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == _CLIP_NO_ERR ){
			var left   = value[0].mat()._mat[0].toFloat();
			var bottom = value[1].mat()._mat[0].toFloat();
			var right  = value[2].mat()._mat[0].toFloat();
			var top    = value[3].mat()._mat[0].toFloat();
			doCommandWindow( left, bottom, right, top );
			procGWorld().setWindowIndirect( left, bottom, right, top );
			return _CLIP_PROC_SUB_END;
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandGClear : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			procGWorld().clear( _UNSIGNED( value.mat()._mat[0].toFloat(), procGWorld().umax() ) );
		} else {
			procGWorld().clear( 0 );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandGColor : function( _this, param, code, token ){
		var value = newProcValArray( 2, _this, param );

		if( _this._const( param, code, token, value[0] ) == _CLIP_NO_ERR ){
			var color = _UNSIGNED( value[0].mat()._mat[0].toFloat(), procGWorld().umax() );
			if( procGWorld()._rgbFlag ){
				if( _this._const( param, code, token, value[1] ) == _CLIP_NO_ERR ){
					return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
				}
			} else {
				if( _this._const( param, code, token, value[1] ) == _CLIP_NO_ERR ){
					doCommandGColor( color, _UNSIGNED( value[1].mat()._mat[0].toFloat(), _UMAX_24 ) );
				}
			}
			procGWorld().setColor( color );
			return _CLIP_PROC_SUB_END;
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandGFill : function( _this, param, code, token ){
		var ret = _CLIP_NO_ERR;
		var value = newProcValArray( 5, _this, param );

		for( var i = 0; i < 4; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == _CLIP_NO_ERR ){
			if( _this._const( param, code, token, value[4] ) == _CLIP_NO_ERR ){
				procGWorld().setColor( _UNSIGNED( value[4].mat()._mat[0].toFloat(), procGWorld().umax() ) );
			}
			procGWorld().fill(
				_INT( value[0].mat()._mat[0].toFloat() ), _INT( value[1].mat()._mat[0].toFloat() ),
				_INT( value[2].mat()._mat[0].toFloat() ), _INT( value[3].mat()._mat[0].toFloat() )
				);
			return _CLIP_PROC_SUB_END;
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandWFill : function( _this, param, code, token ){
		var ret = _CLIP_NO_ERR;
		var value = newProcValArray( 5, _this, param );

		for( var i = 0; i < 4; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == _CLIP_NO_ERR ){
			if( _this._const( param, code, token, value[4] ) == _CLIP_NO_ERR ){
				procGWorld().setColor( _UNSIGNED( value[4].mat()._mat[0].toFloat(), procGWorld().umax() ) );
			}
			procGWorld().wndFill(
				value[0].mat()._mat[0].toFloat(), value[1].mat()._mat[0].toFloat(),
				value[2].mat()._mat[0].toFloat(), value[3].mat()._mat[0].toFloat()
				);
			return _CLIP_PROC_SUB_END;
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandGMove : function( _this, param, code, token ){
		var ret = _CLIP_NO_ERR;
		var value = newProcValArray( 2, _this, param );

		for( var i = 0; i < 2; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == _CLIP_NO_ERR ){
			procGWorld().moveTo( _INT( value[0].mat()._mat[0].toFloat() ), _INT( value[1].mat()._mat[0].toFloat() ) );
			return _CLIP_PROC_SUB_END;
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandWMove : function( _this, param, code, token ){
		var ret = _CLIP_NO_ERR;
		var value = newProcValArray( 2, _this, param );

		for( var i = 0; i < 2; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == _CLIP_NO_ERR ){
			procGWorld().wndMoveTo( value[0].mat()._mat[0].toFloat(), value[1].mat()._mat[0].toFloat() );
			return _CLIP_PROC_SUB_END;
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandGText : function( _this, param, code, token ){
		var text = new _String();
		var ret = _CLIP_NO_ERR;
		var value = newProcValArray( 3, _this, param );

		_this._getString( param, text );
		if( text.isNull() ){
			return _this._retError( _CLIP_PROC_ERR_STRING, code, token );
		}

		ret = _this._const( param, code, token, value[0] );
		if( _this._const( param, code, token, value[1] ) == _CLIP_NO_ERR ){
			if( _this._const( param, code, token, value[2] ) == _CLIP_NO_ERR ){
				procGWorld().setColor( _UNSIGNED( value[2].mat()._mat[0].toFloat(), procGWorld().umax() ) );
			}
			procGWorld().drawText( text.str(), _INT( value[0].mat()._mat[0].toFloat() ), _INT( value[1].mat()._mat[0].toFloat() ), false );
		} else {
			if( ret == _CLIP_NO_ERR ){
				procGWorld().setColor( _UNSIGNED( value[0].mat()._mat[0].toFloat(), procGWorld().umax() ) );
			}
			procGWorld().drawTextTo( text.str(), false );
		}

		return _CLIP_PROC_SUB_END;
	},
	_commandGTextR : function( _this, param, code, token ){
		var text = new _String();
		var ret = _CLIP_NO_ERR;
		var value = newProcValArray( 3, _this, param );

		_this._getString( param, text );
		if( text.isNull() ){
			return _this._retError( _CLIP_PROC_ERR_STRING, code, token );
		}

		ret = _this._const( param, code, token, value[0] );
		if( _this._const( param, code, token, value[1] ) == _CLIP_NO_ERR ){
			if( _this._const( param, code, token, value[2] ) == _CLIP_NO_ERR ){
				procGWorld().setColor( _UNSIGNED( value[2].mat()._mat[0].toFloat(), procGWorld().umax() ) );
			}
			procGWorld().drawText( text.str(), _INT( value[0].mat()._mat[0].toFloat() ), _INT( value[1].mat()._mat[0].toFloat() ), true );
		} else {
			if( ret == _CLIP_NO_ERR ){
				procGWorld().setColor( _UNSIGNED( value[0].mat()._mat[0].toFloat(), procGWorld().umax() ) );
			}
			procGWorld().drawTextTo( text.str(), true );
		}

		return _CLIP_PROC_SUB_END;
	},
	_commandWText : function( _this, param, code, token ){
		var text = new _String();
		var ret = _CLIP_NO_ERR;
		var value = newProcValArray( 3, _this, param );

		_this._getString( param, text );
		if( text.isNull() ){
			return _this._retError( _CLIP_PROC_ERR_STRING, code, token );
		}

		ret = _this._const( param, code, token, value[0] );
		if( _this._const( param, code, token, value[1] ) == _CLIP_NO_ERR ){
			if( _this._const( param, code, token, value[2] ) == _CLIP_NO_ERR ){
				procGWorld().setColor( _UNSIGNED( value[2].mat()._mat[0].toFloat(), procGWorld().umax() ) );
			}
			procGWorld().wndDrawText( text.str(), value[0].mat()._mat[0].toFloat(), value[1].mat()._mat[0].toFloat(), false );
		} else {
			if( ret == _CLIP_NO_ERR ){
				procGWorld().setColor( _UNSIGNED( value[0].mat()._mat[0].toFloat(), procGWorld().umax() ) );
			}
			procGWorld().wndDrawTextTo( text.str(), false );
		}

		return _CLIP_PROC_SUB_END;
	},
	_commandWTextR : function( _this, param, code, token ){
		var text = new _String();
		var ret = _CLIP_NO_ERR;
		var value = newProcValArray( 3, _this, param );

		_this._getString( param, text );
		if( text.isNull() ){
			return _this._retError( _CLIP_PROC_ERR_STRING, code, token );
		}

		ret = _this._const( param, code, token, value[0] );
		if( _this._const( param, code, token, value[1] ) == _CLIP_NO_ERR ){
			if( _this._const( param, code, token, value[2] ) == _CLIP_NO_ERR ){
				procGWorld().setColor( _UNSIGNED( value[2].mat()._mat[0].toFloat(), procGWorld().umax() ) );
			}
			procGWorld().wndDrawText( text.str(), value[0].mat()._mat[0].toFloat(), value[1].mat()._mat[0].toFloat(), true );
		} else {
			if( ret == _CLIP_NO_ERR ){
				procGWorld().setColor( _UNSIGNED( value[0].mat()._mat[0].toFloat(), procGWorld().umax() ) );
			}
			procGWorld().wndDrawTextTo( text.str(), true );
		}

		return _CLIP_PROC_SUB_END;
	},
	_commandGTextL : function( _this, param, code, token ){
		procGWorld().selectCharSet( 1 );
		var ret = _this._commandGText( _this, param, code, token );
		procGWorld().selectCharSet( 0 );
		return ret;
	},
	_commandGTextRL : function( _this, param, code, token ){
		procGWorld().selectCharSet( 1 );
		var ret = _this._commandGTextR( _this, param, code, token );
		procGWorld().selectCharSet( 0 );
		return ret;
	},
	_commandWTextL : function( _this, param, code, token ){
		procGWorld().selectCharSet( 1 );
		var ret = _this._commandWText( _this, param, code, token );
		procGWorld().selectCharSet( 0 );
		return ret;
	},
	_commandWTextRL : function( _this, param, code, token ){
		procGWorld().selectCharSet( 1 );
		var ret = _this._commandWTextR( _this, param, code, token );
		procGWorld().selectCharSet( 0 );
		return ret;
	},
	_commandGLine : function( _this, param, code, token ){
		var ret = _CLIP_NO_ERR;
		var value = newProcValArray( 5, _this, param );

		for( var i = 0; i < 2; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == _CLIP_NO_ERR ){
			ret = _this._const( param, code, token, value[2] );
			if( _this._const( param, code, token, value[3] ) == _CLIP_NO_ERR ){
				if( _this._const( param, code, token, value[4] ) == _CLIP_NO_ERR ){
					procGWorld().setColor( _UNSIGNED( value[4].mat()._mat[0].toFloat(), procGWorld().umax() ) );
				}
				procGWorld().line(
					_INT( value[0].mat()._mat[0].toFloat() ), _INT( value[1].mat()._mat[0].toFloat() ),
					_INT( value[2].mat()._mat[0].toFloat() ), _INT( value[3].mat()._mat[0].toFloat() )
					);
				return _CLIP_PROC_SUB_END;
			} else {
				if( ret == _CLIP_NO_ERR ){
					procGWorld().setColor( _UNSIGNED( value[2].mat()._mat[0].toFloat(), procGWorld().umax() ) );
				}
				procGWorld().lineTo(
					_INT( value[0].mat()._mat[0].toFloat() ), _INT( value[1].mat()._mat[0].toFloat() )
					);
				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandWLine : function( _this, param, code, token ){
		var ret = _CLIP_NO_ERR;
		var value = newProcValArray( 5, _this, param );

		for( var i = 0; i < 2; i++ ){
			ret = _this._const(param, code, token, value[i] );
		}
		if( ret == _CLIP_NO_ERR ){
			ret = _this._const( param, code, token, value[2] );
			if( _this._const( param, code, token, value[3] ) == _CLIP_NO_ERR ){
				if( _this._const( param, code, token, value[4] ) == _CLIP_NO_ERR ){
					procGWorld().setColor( _UNSIGNED( value[4].mat()._mat[0].toFloat(), procGWorld().umax() ) );
				}
				procGWorld().wndLine(
					value[0].mat()._mat[0].toFloat(), value[1].mat()._mat[0].toFloat(),
					value[2].mat()._mat[0].toFloat(), value[3].mat()._mat[0].toFloat()
					);
				return _CLIP_PROC_SUB_END;
			} else {
				if( ret == _CLIP_NO_ERR ){
					procGWorld().setColor( _UNSIGNED( value[2].mat()._mat[0].toFloat(), procGWorld().umax() ) );
				}
				procGWorld().wndLineTo(
					value[0].mat()._mat[0].toFloat(), value[1].mat()._mat[0].toFloat()
					);
				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandGPut : function( _this, param, code, token ){
		var lock;
		var newCode;
		var newToken;

		lock = _this._curLine._token.lock();
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				if( newCode == _CLIP_CODE_GLOBAL_ARRAY ){
					param = globalParam();
				}

				var width  = procGWorld()._width;
				var height = procGWorld()._height;

				var _arrayIndex = _this.arrayIndexIndirect( param, newCode, newToken );
				var arrayList = new Array( 3 );
				arrayList[2] = -1;

				var x, y;
				for( y = 0; y < height; y++ ){
					arrayList[0] = y;
					for( x = 0; x < width; x++ ){
						arrayList[1] = x;
						procGWorld().putColor(
							x, y,
							_UNSIGNED( param._array.val( _arrayIndex, arrayList, 2 ).toFloat(), procGWorld().umax() )
							);
					}
				}

				return _CLIP_PROC_SUB_END;
			} else {
				var ret = _CLIP_NO_ERR;
				var value = newProcValArray( 3, _this, param );

				_this._curLine._token.unlock( lock );
				for( var i = 0; i < 2; i++ ){
					ret = _this._const( param, code, token, value[i] );
				}
				if( ret == _CLIP_NO_ERR ){
					if( _this._const( param, code, token, value[2] ) == _CLIP_NO_ERR ){
						procGWorld().setColor( _UNSIGNED( value[2].mat()._mat[0].toFloat(), procGWorld().umax() ) );
					}
					procGWorld().put( _INT( value[0].mat()._mat[0].toFloat() ), _INT( value[1].mat()._mat[0].toFloat() ) );
					return _CLIP_PROC_SUB_END;
				}
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandGPut24 : function( _this, param, code, token ){
		if( procGWorld()._rgbFlag ){
			return _this._commandGPut( _this, param, code, token );
		}

		var newCode;
		var newToken;

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				if( newCode == _CLIP_CODE_GLOBAL_ARRAY ){
					param = globalParam();
				}

				var width  = procGWorld()._width;
				var height = procGWorld()._height;

				var _arrayIndex = _this.arrayIndexIndirect( param, newCode, newToken );
				var arrayList = new Array( 3 );
				arrayList[2] = -1;

				var x, y;
				doCommandGPut24Begin();
				for( y = 0; y < height; y++ ){
					arrayList[0] = y;
					for( x = 0; x < width; x++ ){
						arrayList[1] = x;
						doCommandGPut24(
							x, y,
							_UNSIGNED( param._array.val( _arrayIndex, arrayList, 2 ).toFloat(), _UMAX_24 )
							);
					}
				}
				doCommandGPut24End();

				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandWPut : function( _this, param, code, token ){
		var i;
		var ret = _CLIP_NO_ERR;
		var value = newProcValArray( 3, _this, param );

		for( i = 0; i < 2; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == _CLIP_NO_ERR ){
			if( _this._const( param, code, token, value[2] ) == _CLIP_NO_ERR ){
				procGWorld().setColor( _UNSIGNED( value[2].mat()._mat[0].toFloat(), procGWorld().umax() ) );
			}
			procGWorld().wndPut( value[0].mat()._mat[0].toFloat(), value[1].mat()._mat[0].toFloat() );
			return _CLIP_PROC_SUB_END;
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandGGet : function( _this, param, code, token ){
		var lock;
		var newCode;
		var newToken;

		lock = _this._curLine._token.lock();
		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				if( newCode == _CLIP_CODE_GLOBAL_ARRAY ){
					param = globalParam();
				}

				var width  = procGWorld()._width;
				var height = procGWorld()._height;

				var _arrayIndex = _this.arrayIndexIndirect( param, newCode, newToken );
				var arrayList = new Array( 3 );
				var resizeList = new Array( 3 );
				resizeList[0] = height - 1;
				resizeList[1] = width  - 1;
				resizeList[2] = -1;
				arrayList [2] = -1;
				var moveFlag = (newCode == _CLIP_CODE_ARRAY);

				var x, y;
				for( y = 0; y < height; y++ ){
					arrayList[0] = y;
					for( x = 0; x < width; x++ ){
						arrayList[1] = x;
						param._array.resize(
							_arrayIndex, resizeList, arrayList, 2,
							procGWorld().get( x, y ), moveFlag
							);
					}
				}

				return _CLIP_PROC_SUB_END;
			} else {
				var ret = _CLIP_NO_ERR;
				var value = newProcValArray( 2, _this, param );

				_this._curLine._token.unlock( lock );
				for( var i = 0; i < 2; i++ ){
					ret = _this._const( param, code, token, value[i] );
				}
				if( ret == _CLIP_NO_ERR ){
					if( _this._curLine._token.getTokenParam( param ) ){
						newCode  = _get_code;
						newToken = _get_token;
						if( (newCode & _CLIP_CODE_VAR_MASK) != 0 ){
							if( newCode == _CLIP_CODE_GLOBAL_VAR ){
								param = globalParam();
							}
							var moveFlag = new _Boolean();
							var index = _this.varIndexIndirectMove( param, newCode, newToken, moveFlag );
							if( !(param.setVal(
								index,
								procGWorld().get( _INT( value[0].mat()._mat[0].toFloat() ), _INT( value[1].mat()._mat[0].toFloat() ) ),
								moveFlag._val
							)) ){
								return _this._retError( _CLIP_PROC_ERR_ASS, code, token );
							}
							return _CLIP_PROC_SUB_END;
						}
					}
				}
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandGGet24 : function( _this, param, code, token ){
		if( procGWorld()._rgbFlag ){
			return _this._commandGGet( _this, param, code, token );
		}

		var newCode;
		var newToken;

		if( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				if( newCode == _CLIP_CODE_GLOBAL_ARRAY ){
					param = globalParam();
				}

				var w = new _Integer();
				var h = new _Integer();
				var data = doCommandGGet24Begin( w, h );
				if( data != null ){
					var width  = w._val;
					var height = h._val;

					var _arrayIndex = _this.arrayIndexIndirect( param, newCode, newToken );
					var arrayList = new Array( 3 );
					var resizeList = new Array( 3 );
					resizeList[0] = height - 1;
					resizeList[1] = width  - 1;
					resizeList[2] = -1;
					arrayList [2] = -1;
					var moveFlag = (newCode == _CLIP_CODE_ARRAY);

					var x, y, r, g, b;
					var i = 0;
					for( y = 0; y < height; y++ ){
						arrayList[0] = y;
						for( x = 0; x < width; x++ ){
							arrayList[1] = x;
							r = data[i++];
							g = data[i++];
							b = data[i++];
							i++;
							param._array.resize(
								_arrayIndex, resizeList, arrayList, 2,
								(r << 16) + (g << 8) + b, moveFlag
								);
						}
					}

					doCommandGGet24End();
				}

				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandWGet : function( _this, param, code, token ){
		var i;
		var ret = _CLIP_NO_ERR;
		var value = newProcValArray( 2, _this, param );

		for( i = 0; i < 2; i++ ){
			ret = _this._const( param, code, token, value[i] );
		}
		if( ret == _CLIP_NO_ERR ){
			var newCode;
			var newToken;

			if( _this._curLine._token.getTokenParam( param ) ){
				newCode  = _get_code;
				newToken = _get_token;
				if( (newCode & _CLIP_CODE_VAR_MASK) != 0 ){
					if( newCode == _CLIP_CODE_GLOBAL_VAR ){
						param = globalParam();
					}
					var moveFlag = new _Boolean();
					var index = _this.varIndexIndirectMove( param, newCode, newToken, moveFlag );
					if( !(param.setVal(
						index,
						procGWorld().wndGet( value[0].mat()._mat[0].toFloat(), value[1].mat()._mat[0].toFloat() ),
						moveFlag._val
					)) ){
						return _this._retError( _CLIP_PROC_ERR_ASS, code, token );
					}
					return _CLIP_PROC_SUB_END;
				}
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandGUpdate : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			_this.setGUpdateFlag( _INT( value.mat()._mat[0].toFloat() ) );
		} else {
			_this.setGUpdateFlag( 1 );
		}
		if( _this._gUpdateFlag ){
			doCommandGUpdate( procGWorld() );
		}
		return _CLIP_PROC_SUB_END;
	},
	_commandRectangular : function( _this, param, code, token ){
		procGraph().setMode( _GRAPH_MODE_RECT );
		return _CLIP_PROC_SUB_END;
	},
	_commandParametric : function( _this, param, code, token ){
		procGraph().setMode( _GRAPH_MODE_PARAM );
		return _CLIP_PROC_SUB_END;
	},
	_commandPolar : function( _this, param, code, token ){
		procGraph().setMode( _GRAPH_MODE_POLAR );
		return _CLIP_PROC_SUB_END;
	},
	_commandLogScale : function( _this, param, code, token ){
		var newToken;

		if( _this._curLine._token.getToken() ){
			newToken = _get_token;
			if( _get_code == _CLIP_CODE_LABEL ){
				var value = new _ProcVal( _this, param );

				if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
					if( value.mat()._mat[0].toFloat() <= 1.0 ){
						return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
					}
				} else {
					value.matAss( 10.0 );
				}
				if( newToken == "x" ){
					procGraph().setLogScaleX( value.mat()._mat[0].toFloat() );
				} else if( newToken == "y" ){
					procGraph().setLogScaleY( value.mat()._mat[0].toFloat() );
				} else if( newToken == "xy" ){
					procGraph().setLogScaleX( value.mat()._mat[0].toFloat() );
					procGraph().setLogScaleY( value.mat()._mat[0].toFloat() );
				} else {
					return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
				}
				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandNoLogScale : function( _this, param, code, token ){
		var newToken;

		if( _this._curLine._token.getToken() ){
			newToken = _get_token;
			if( _get_code == _CLIP_CODE_LABEL ){
				if( newToken == "x" ){
					procGraph().setLogScaleX( 0.0 );
				} else if( newToken == "y" ){
					procGraph().setLogScaleY( 0.0 );
				} else if( newToken == "xy" ){
					procGraph().setLogScaleX( 0.0 );
					procGraph().setLogScaleY( 0.0 );
				} else {
					return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
				}
				return _CLIP_PROC_SUB_END;
			}
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandPlot : function( _this, param, code, token ){
		var lock;
		var newCode;
		var newToken;
		var value = newProcValArray( 4, _this, param );

		// 計算式の取り込み
		switch( procGraph().mode() ){
		case _GRAPH_MODE_RECT:
		case _GRAPH_MODE_POLAR:
			lock = _this._curLine._token.lock();
			if( _this._curLine._token.getTokenParam( param ) ){
				newCode  = _get_code;
				newToken = _get_token;
				if( newCode == _CLIP_CODE_STRING ){
					procGraph().setExpr( newToken );
				} else if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
					var tmpParam = (newCode == _CLIP_CODE_GLOBAL_ARRAY) ? globalParam() : param;
					var _arrayIndex = _this.arrayIndexIndirect( tmpParam, newCode, newToken );
					procGraph().setExpr( _this.strGet( tmpParam._array, _arrayIndex ) );
				} else {
					_this._curLine._token.unlock( lock );
					break;
				}
			}
			break;
		case _GRAPH_MODE_PARAM:
			lock = _this._curLine._token.lock();
			if( _this._curLine._token.getTokenParam( param ) ){
				newCode  = _get_code;
				newToken = _get_token;
				if( newCode == _CLIP_CODE_STRING ){
					procGraph().setExpr1( newToken );
				} else if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
					var tmpParam = (newCode == _CLIP_CODE_GLOBAL_ARRAY) ? globalParam() : param;
					var _arrayIndex = _this.arrayIndexIndirect( tmpParam, newCode, newToken );
					procGraph().setExpr1( _this.strGet( tmpParam._array, _arrayIndex ) );
				} else {
					_this._curLine._token.unlock( lock );
					break;
				}
			}
			lock = _this._curLine._token.lock();
			if( _this._curLine._token.getTokenParam( param ) ){
				newCode  = _get_code;
				newToken = _get_token;
				if( newCode == _CLIP_CODE_STRING ){
					procGraph().setExpr2( newToken );
				} else if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
					var tmpParam = (newCode == _CLIP_CODE_GLOBAL_ARRAY) ? globalParam() : param;
					var _arrayIndex = _this.arrayIndexIndirect( tmpParam, newCode, newToken );
					procGraph().setExpr2( _this.strGet( tmpParam._array, _arrayIndex ) );
				} else {
					return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
				}
			} else {
				return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
			}
			break;
		}

		procGraph().setColor( procGWorld()._color );

		if( _this._const( param, code, token, value[0] ) == _CLIP_NO_ERR ){
			if( _this._const( param, code, token, value[1] ) == _CLIP_NO_ERR ){
				switch( procGraph().mode() ){
				case _GRAPH_MODE_RECT:
					if( _this._const( param, code, token, value[2] ) == _CLIP_NO_ERR ){
						// パラメータが3個指定されている...
						procGraph().setColor( _UNSIGNED( value[2].mat()._mat[0].toFloat(), procGWorld().umax() ) );
					} else {
						// パラメータが2個指定されている...
					}
					break;
				case _GRAPH_MODE_PARAM:
				case _GRAPH_MODE_POLAR:
					if( _this._const( param, code, token, value[2] ) == _CLIP_NO_ERR ){
						if( _this._const( param, code, token, value[3] ) == _CLIP_NO_ERR ){
							// パラメータが4個指定されている...
							procGraph().setColor( _UNSIGNED( value[3].mat()._mat[0].toFloat(), procGWorld().umax() ) );
						} else {
							// パラメータが3個指定されている...
						}
					} else {
						// パラメータが2個しか指定されていない...
						return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
					}
					break;
				}
			} else {
				// パラメータが1個指定されている...
				procGraph().setColor( _UNSIGNED( value[0].mat()._mat[0].toFloat(), procGWorld().umax() ) );

				switch( procGraph().mode() ){
				case _GRAPH_MODE_RECT:
					value[0].matAss( procGWorld().wndPosX( 0 ) );
					value[1].matAss( procGWorld().wndPosX( procGWorld()._width - 1 ) );
					break;
				case _GRAPH_MODE_PARAM:
				case _GRAPH_MODE_POLAR:
					value[0].matAss(   0.0 ); value[0].mat()._mat[0].angToAng( _ANG_TYPE_DEG, complexAngType() );
					value[1].matAss( 360.0 ); value[1].mat()._mat[0].angToAng( _ANG_TYPE_DEG, complexAngType() );
					value[2].matAss(   1.0 ); value[2].mat()._mat[0].angToAng( _ANG_TYPE_DEG, complexAngType() );
					break;
				}
			}
		} else {
			// パラメータが指定されていない...
			switch( procGraph().mode() ){
			case _GRAPH_MODE_RECT:
				value[0].matAss( procGWorld().wndPosX( 0 ) );
				value[1].matAss( procGWorld().wndPosX( procGWorld()._width - 1 ) );
				break;
			case _GRAPH_MODE_PARAM:
			case _GRAPH_MODE_POLAR:
				value[0].matAss(   0.0 ); value[0].mat()._mat[0].angToAng( _ANG_TYPE_DEG, complexAngType() );
				value[1].matAss( 360.0 ); value[1].mat()._mat[0].angToAng( _ANG_TYPE_DEG, complexAngType() );
				value[2].matAss(   1.0 ); value[2].mat()._mat[0].angToAng( _ANG_TYPE_DEG, complexAngType() );
				break;
			}
		}

		// 親プロセスの環境を受け継いで、子プロセスを実行する
		var childProc = new _Proc( param._mode, param._mpPrec, param._mpRound, false, _this._printAssert, _this._printWarn, false/*グラフィック画面更新OFF*/ );
		var childParam = new _Param( _this._curLine._num, param, true );
		_this.initEvalProc( childParam, param );
		doCommandPlot( _this, childProc, childParam, procGraph(), value[0].mat()._mat[0].toFloat(), value[1].mat()._mat[0].toFloat(), value[2].mat()._mat[0].toFloat() );
		childProc.end();
		childParam.end();

		return _CLIP_PROC_SUB_END;
	},
	_commandRePlot : function( _this, param, code, token ){
		var value = newProcValArray( 4, _this, param );

		procGraph().setColor( procGWorld()._color );

		if( _this._const( param, code, token, value[0] ) == _CLIP_NO_ERR ){
			if( _this._const( param, code, token, value[1] ) == _CLIP_NO_ERR ){
				switch( procGraph().mode() ){
				case _GRAPH_MODE_RECT:
					if( _this._const( param, code, token, value[2] ) == _CLIP_NO_ERR ){
						// パラメータが3個指定されている...
						procGraph().setColor( _UNSIGNED( value[2].mat()._mat[0].toFloat(), procGWorld().umax() ) );
					} else {
						// パラメータが2個指定されている...
					}
					break;
				case _GRAPH_MODE_PARAM:
				case _GRAPH_MODE_POLAR:
					if( _this._const( param, code, token, value[2] ) == _CLIP_NO_ERR ){
						if( _this._const( param, code, token, value[3] ) == _CLIP_NO_ERR ){
							// パラメータが4個指定されている...
							procGraph().setColor( _UNSIGNED( value[3].mat()._mat[0].toFloat(), procGWorld().umax() ) );
						} else {
							// パラメータが3個指定されている...
						}
					} else {
						// パラメータが2個しか指定されていない...
						return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
					}
					break;
				}
			} else {
				// パラメータが1個指定されている...
				procGraph().setColor( _UNSIGNED( value[0].mat()._mat[0].toFloat(), procGWorld().umax() ) );

				switch( procGraph().mode() ){
				case _GRAPH_MODE_RECT:
					value[0].matAss( procGWorld().wndPosX( 0 ) );
					value[1].matAss( procGWorld().wndPosX( procGWorld()._width - 1 ) );
					break;
				case _GRAPH_MODE_PARAM:
				case _GRAPH_MODE_POLAR:
					value[0].matAss(   0.0 ); value[0].mat()._mat[0].angToAng( _ANG_TYPE_DEG, complexAngType() );
					value[1].matAss( 360.0 ); value[1].mat()._mat[0].angToAng( _ANG_TYPE_DEG, complexAngType() );
					value[2].matAss(   1.0 ); value[2].mat()._mat[0].angToAng( _ANG_TYPE_DEG, complexAngType() );
					break;
				}
			}
		} else {
			// パラメータが指定されていない...
			switch( procGraph().mode() ){
			case _GRAPH_MODE_RECT:
				value[0].matAss( procGWorld().wndPosX( 0 ) );
				value[1].matAss( procGWorld().wndPosX( procGWorld()._width - 1 ) );
				break;
			case _GRAPH_MODE_PARAM:
			case _GRAPH_MODE_POLAR:
				value[0].matAss(   0.0 ); value[0].mat()._mat[0].angToAng( _ANG_TYPE_DEG, complexAngType() );
				value[1].matAss( 360.0 ); value[1].mat()._mat[0].angToAng( _ANG_TYPE_DEG, complexAngType() );
				value[2].matAss(   1.0 ); value[2].mat()._mat[0].angToAng( _ANG_TYPE_DEG, complexAngType() );
				break;
			}
		}

		// 親プロセスの環境を受け継いで、子プロセスを実行する
		var childProc = new _Proc( param._mode, param._mpPrec, param._mpRound, false, _this._printAssert, _this._printWarn, false/*グラフィック画面更新OFF*/ );
		var childParam = new _Param( _this._curLine._num, param, true );
		_this.initEvalProc( childParam, param );
		doCommandRePlot( _this, childProc, childParam, procGraph(), value[0].mat()._mat[0].toFloat(), value[1].mat()._mat[0].toFloat(), value[2].mat()._mat[0].toFloat() );
		childProc.end();
		childParam.end();

		return _CLIP_PROC_SUB_END;
	},
	_commandCalculator : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param._calculator = value.mat().notEqual( 0.0 );
			return _CLIP_PROC_SUB_END;
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandInclude : function( _this, param, code, token ){
		var ret;

		var saveCurLine  = _this._curLine;
		var saveProcLine = _this._procLine;
		var saveFuncName = param._funcName;
		var saveDefNameSpace = param._defNameSpace;
		var saveNameSpace = param._nameSpace;

		var newToken;
		if( _this._curLine._token.getToken() ){
			newToken = _get_token;
			if( _get_code == _CLIP_CODE_EXTFUNC ){
				var name = newToken + ".inc";
				var func;
				if( (func = procFunc().search( name, true, null )) != null ){
					if( _this.mainLoop( func, param, null, null ) == _CLIP_PROC_END ){
						ret = _CLIP_NO_ERR;
					} else {
						ret = _this._retError( _CLIP_PROC_ERR_EXTFUNC, _CLIP_CODE_EXTFUNC, name );
					}
				} else if( (func = _this.newFuncCache( name, param, null )) != null ){
					if( _this.mainLoop( func, param, null, null ) == _CLIP_PROC_END ){
						ret = _CLIP_NO_ERR;
					} else {
						ret = _this._retError( _CLIP_PROC_ERR_EXTFUNC, _CLIP_CODE_EXTFUNC, name );
					}
				} else if( _this.mainLoop( name, param, null, null ) == _CLIP_PROC_END ){
					ret = _CLIP_NO_ERR;
				} else {
					ret = _this._retError( _CLIP_PROC_ERR_EXTFUNC, _CLIP_CODE_EXTFUNC, name );
				}
			} else {
				ret = _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
			}
		} else {
			ret = _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
		}

		_this._curLine  = saveCurLine;
		_this._procLine = saveProcLine;
		param._funcName = saveFuncName;
		param._defNameSpace = saveDefNameSpace;
		param._nameSpace = saveNameSpace;

		return (ret == _CLIP_NO_ERR) ? _CLIP_PROC_SUB_END : ret;
	},
	_commandBase : function( _this, param, code, token ){
		var value = new _ProcVal( _this, param );

		if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
			param._base = value.mat().notEqual( 0.0 ) ? 1 : 0;
			return _CLIP_PROC_SUB_END;
		}
		return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
	},
	_commandNameSpace : function( _this, param, code, token ){
		if( _this._curLine._token.getToken() ){
			var nameSpace = _proc_token.tokenString( param, _get_code, _get_token );
			if( nameSpace.length > 0 ){
				param._nameSpace = nameSpace;
				return _CLIP_PROC_SUB_END;
			}
			return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
		}
		param.resetNameSpace();
		return _CLIP_PROC_SUB_END;
	},
	_commandUse : function( _this, param, code, token ){
		var descCode;
		var descToken;
		var realCode;
		var realToken;
		if( _this._curLine._token.getToken() ){
			descCode  = _get_code;
			descToken = _get_token;
			switch( descCode ){
			case _CLIP_CODE_LABEL:
			case _CLIP_CODE_FUNCTION:
			case _CLIP_CODE_EXTFUNC:
				break;
			default:
				return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
			}
			if( _this._curLine._token.getToken() ){
				realCode  = _get_code;
				realToken = _get_token;
				switch( realCode ){
				case _CLIP_CODE_LABEL:
				case _CLIP_CODE_FUNCTION:
				case _CLIP_CODE_EXTFUNC:
					break;
				default:
					return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
				}
			} else {
				return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
			}
		} else {
			return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
		}
		param.setReplace( descCode, descToken, realCode, realToken );
		return _CLIP_PROC_SUB_END;
	},
	_commandUnuse : function( _this, param, code, token ){
		var descCode;
		var descToken;
		if( _this._curLine._token.getToken() ){
			descCode  = _get_code;
			descToken = _get_token;
			switch( descCode ){
			case _CLIP_CODE_LABEL:
			case _CLIP_CODE_FUNCTION:
			case _CLIP_CODE_EXTFUNC:
				break;
			default:
				return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
			}
		}
		param.delReplace( descCode, descToken );
		return _CLIP_PROC_SUB_END;
	},
	_commandDump : function( _this, param, code, token ){
		var newCode;
		var newToken;

		if( skipCommandLog() ){
			while( true ){
				if( !(_this._curLine._token.getTokenParam( param )) ){
					break;
				}
			}
			return _CLIP_PROC_SUB_END;
		}

		while( _this._curLine._token.getTokenParam( param ) ){
			newCode  = _get_code;
			newToken = _get_token;
			if( (newCode & _CLIP_CODE_VAR_MASK) != 0 ){
				if( newCode == _CLIP_CODE_GLOBAL_VAR ){
					doCommandDumpVar( globalParam(), _this.varIndexIndirect( globalParam(), newCode, newToken ) );
				} else {
					doCommandDumpVar( param, _this.varIndexIndirect( param, newCode, newToken ) );
				}
			} else if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
				if( newCode == _CLIP_CODE_GLOBAL_ARRAY ){
					doCommandDumpArray( globalParam(), _this.arrayIndexIndirect( globalParam(), newCode, newToken ) );
				} else {
					doCommandDumpArray( param, _this.arrayIndexIndirect( param, newCode, newToken ) );
				}
			} else {
				return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
			}
		}

		return _CLIP_PROC_SUB_END;
	},

	_procTop : function( _this, param, code, token, value ){
		var ret;

		param._subStep++;
		if( !param._seFlag ){
			value.matAss( param._array._mat[0] );
		}
		ret = _this._processSub( param, value );
		param._subStep--;

		return ret;
	},
	_procVariableFirst : function( param, token, value ){
		this._curInfo._assToken = this.varIndexParam( param, token );
		value.matAss( param.val( this._curInfo._assToken ) );
		this._updateMatrix( param, value.mat() );
		return _CLIP_NO_ERR;
	},
	_procVariable : function( _this, param, code, token, value ){
		value.matAss( param.val( _this.varIndexParam( param, token ) ) );
		_this._updateMatrix( param, value.mat() );
		return _CLIP_NO_ERR;
	},
	_procAutoVar : function( _this, param, code, token, value ){
		value.matAss( param.val( _this.autoVarIndex( param, token ) ) );
		_this._updateMatrix( param, value.mat() );
		return _CLIP_NO_ERR;
	},
	_procGlobalVar : function( _this, param, code, token, value ){
		value.matAss( globalParam().val( _this.autoVarIndex( globalParam(), token ) ) );
		_this._updateMatrix( param, value.mat() );
		return _CLIP_NO_ERR;
	},
	_procArrayFirst : function( param, token, value ){
		this._curInfo._assToken = this.arrayIndexParam( param, token );

		if( this._curLine._token.getTokenLock() ){
			if( _get_code == _CLIP_CODE_ARRAY_TOP ){
				this._initArrayFlag  = true;
				this._initArrayCnt   = 0;
				this._initArrayMax   = 0;
				this._initArrayIndex = this.arrayIndexDirectMove( param, this._curInfo._assCode, this._curInfo._assToken, this._initArrayMoveFlag );
				this._initArray      = new _Token();
				return this._procInitArray( param );
			}
		}

		this._getArrayInfo( param, _CLIP_CODE_ARRAY, token );

		if( this._curInfo._curArraySize == 0 ){
			if( param._mpFlag ){
				value._mp = Array.from( param._array._mp[this._curInfo._assToken] );
				value._mpFlag = true;
			} else {
				value.matAss( param._array._mat[this._curInfo._assToken] );
				this._updateMatrix( param, value.mat() );
			}
		} else {
			value.matAss( param._array.val( this._curInfo._assToken, this._curInfo._curArray, this._curInfo._curArraySize ) );
			this._updateMatrix( param, value.mat() );
		}
		return _CLIP_NO_ERR;
	},
	_procArray : function( _this, param, code, token, value ){
		var index = _this.arrayIndexParam( param, token );

		if( _this._curLine._token.getTokenLock() ){
			if( _get_code == _CLIP_CODE_ARRAY_TOP ){
				_this._initArrayFlag  = true;
				_this._initArrayCnt   = 0;
				_this._initArrayMax   = 0;
				_this._initArrayIndex = _this.arrayIndexDirectMove( param, _this._curInfo._assCode, _this._curInfo._assToken, _this._initArrayMoveFlag );
				_this._initArray      = new _Token();
				return _this._procInitArray( param );
			}
		}

		_this._getArrayInfo( param, code, token );

		if( _this._curInfo._curArraySize == 0 ){
			if( param._mpFlag ){
				value._mp = Array.from( param._array._mp[index] );
				value._mpFlag = true;
			} else {
				value.matAss( param._array._mat[index] );
				_this._updateMatrix( param, value.mat() );
			}
		} else {
			value.matAss( param._array.val( index, _this._curInfo._curArray, _this._curInfo._curArraySize ) );
			_this._updateMatrix( param, value.mat() );
		}
		return _CLIP_NO_ERR;
	},
	_procAutoArray : function( _this, param, code, token, value ){
		var curParam = param;
		if( code == _CLIP_CODE_GLOBAL_ARRAY ){
			param = globalParam();
		}

		if( _this._curLine._token.getTokenLock() ){
			if( _get_code == _CLIP_CODE_ARRAY_TOP ){
				_this._initArrayFlag  = true;
				_this._initArrayCnt   = 0;
				_this._initArrayMax   = 0;
				_this._initArrayIndex = _this.arrayIndexDirectMove( param, _this._curInfo._assCode, _this._curInfo._assToken, _this._initArrayMoveFlag );
				_this._initArray      = new _Token();
				return _this._procInitArray( param );
			}
		}

		_this._getArrayInfo( curParam, code, token );

		if( _this._curInfo._curArraySize == 0 ){
			if( param._mpFlag ){
				value._mp = Array.from( param._array._mp[_this.autoArrayIndex( param, token )] );
				value._mpFlag = true;
			} else {
				value.matAss( param._array._mat[_this.autoArrayIndex( param, token )] );
				_this._updateMatrix( curParam, value.mat() );
			}
		} else {
			value.matAss( param._array.val( _this.autoArrayIndex( param, token ), _this._curInfo._curArray, _this._curInfo._curArraySize ) );
			_this._updateMatrix( curParam, value.mat() );
		}
		return _CLIP_NO_ERR;
	},
	_procConst : function( _this, param, code, token, value ){
		value.matAss( token );
		_this._updateMatrix( param, value.mat() );
		return _CLIP_NO_ERR;
	},
	_procMultiPrec : function( _this, param, code, token, value ){
		_proc_mp.fset( value.mp(), token );
		return _CLIP_NO_ERR;
	},
	_procLabel : function( _this, parentParam, code, token, value, seFlag ){
		var funcParam = new _Token();
		var func;

		// 関数のパラメータを取得する
		if( !(_this._getParams( parentParam, code, token, funcParam, seFlag )) ){
			return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
		}

		if( (func = parentParam._func.search( token, false, null )) != null ){
			var ret;

			// 親プロセスの環境を受け継いで、子プロセスを実行する
			var childProc = new _Proc( parentParam._mode, parentParam._mpPrec, parentParam._mpRound, false, _this._printAssert, _this._printWarn, _this._gUpdateFlag );
			var childParam = new _Param( _this._curLine._num, parentParam, false );
			_this.initInternalProc( childProc, func, childParam, parentParam );
			if( mainProc( _this, parentParam, func, funcParam, childProc, childParam ) == _CLIP_PROC_END ){
				childProc.end();
				_this.getAns( childParam, value, parentParam );
				ret = _CLIP_NO_ERR;
			} else {
				childProc.end();
				ret = _this._retError( _CLIP_PROC_ERR_USERFUNC, code, token );
			}
			childParam.end();

			return ret;
		} else {
			return _this._retError( _CLIP_PROC_ERR_CONSTANT, code, token );
		}
	},
	_procCommand : function( _this, param, code, token, value ){
		var ret;

		if( (ret = _procSubCommand[token]( _this, param, code, token )) != _CLIP_PROC_SUB_END ){
			return ret;
		}

		var tmpValue = new _ProcVal( _this, param );

		if( _this._const( param, code, token, tmpValue ) == _CLIP_NO_ERR ){
			return _this._retError( _CLIP_PROC_ERR_COMMAND_PARAM, code, token );
		} else {
			return _CLIP_PROC_SUB_END;
		}
	},
	_procStat : function( _this, param, code, token, value ){
		return _procSubStat[token]( _this, param, code, token );
	},
	_procUnary : function( _this, param, code, token, value ){
		if( token < _CLIP_OP_UNARY_END ){
			return _procSubOp[token]( _this, param, code, token, value );
		} else {
			return _this._retError( _CLIP_PROC_ERR_UNARY, code, token );
		}
	},
	_procFunc : function( _this, param, code, token, value, seFlag ){
		var ret;

		clearValueError();
		clearMatrixError();

		if( (ret = _procSubFunc[token]( _this, param, code, token, value, seFlag )) != _CLIP_NO_ERR ){
			return ret;
		}
		if( !(param._mpFlag) ){
			_this._updateMatrix( param, value.mat() );

			if( valueError() ){
				_this._errorProc( _CLIP_PROC_WARN_FUNCTION, _this._curLine._num, param, code, token );
				clearValueError();
			}
		}

		return _CLIP_NO_ERR;
	},
	_procExtFunc : function( _this, parentParam, code, token, value, seFlag ){
		var ret;

		var funcParam = new _Token();
		var func;

		// 関数のパラメータを取得する
		if( !(_this._getParams( parentParam, code, token, funcParam, seFlag )) ){
			return _this._retError( _CLIP_PROC_ERR_SE_OPERAND, code, token );
		}

		// 親プロセスの環境を受け継いで、子プロセスを実行する
		var childProc = new _Proc( parentParam._mode, parentParam._mpPrec, parentParam._mpRound, false, _this._printAssert, _this._printWarn, _this._gUpdateFlag );
		var childParam = new _Param( _this._curLine._num, parentParam, false );

		if( (func = procFunc().search( token, true, parentParam._nameSpace )) != null ){
			if( mainProc( _this, parentParam, func, funcParam, childProc, childParam ) == _CLIP_PROC_END ){
				childProc.end();
				_this.getAns( childParam, value, parentParam );
				ret = _CLIP_NO_ERR;
			} else {
				childProc.end();
				ret = _this._retError( _CLIP_PROC_ERR_EXTFUNC, code, token );
			}
		} else if( (func = _this.newFuncCache( token, childParam, parentParam._nameSpace )) != null ){
			if( mainProc( _this, parentParam, func, funcParam, childProc, childParam ) == _CLIP_PROC_END ){
				childProc.end();
				_this.getAns( childParam, value, parentParam );
				ret = _CLIP_NO_ERR;
			} else {
				childProc.end();
				ret = _this._retError( _CLIP_PROC_ERR_EXTFUNC, code, token );
			}
		} else if( mainProc( _this, parentParam, token, funcParam, childProc, childParam ) == _CLIP_PROC_END ){
			childProc.end();
			_this.getAns( childParam, value, parentParam );
			ret = _CLIP_NO_ERR;
		} else {
			childProc.end();
			ret = _this._retError( _CLIP_PROC_ERR_EXTFUNC, code, token );
		}

		childParam.end();

		return ret;
	},

	_procMain1 : function( _this, func, childParam, step/*_Integer*/, err/*_Integer*/, ret/*_Integer*/ ){
		if( childParam._fileDataGet >= childParam._fileData.length ){
			ret.set( _CLIP_PROC_END );
			return false;
		}
		step.set( _this.beginProcess( childParam._fileData[childParam._fileDataGet], childParam, err ) ? 1 : 2 );
		childParam._fileDataGet++;
		return true;
	},
	_procMain2 : function( _this, func, childParam, step/*_Integer*/, err/*_Integer*/, ret/*_Integer*/ ){
		if( !_this.process( childParam, err ) ){
			step.set( 2 );
		}
		return true;
	},
	_procMain3 : function( _this, func, childParam, step/*_Integer*/, err/*_Integer*/, ret/*_Integer*/ ){
		if( ret.set( _this.termProcess( childParam, err ) )._val != _CLIP_LOOP_CONT ){
			return false;
		}
		step.set( 0 );

		childParam._lineNum++;
		return true;
	},

	_procMain1Cache : function( _this, func, childParam, step/*_Integer*/, err/*_Integer*/, ret/*_Integer*/ ){
		step.set( _this.beginProcess( func._line, childParam, err ) ? 1 : 2 );
		return true;
	},
	_procMain2Cache : function( _this, func, childParam, step/*_Integer*/, err/*_Integer*/, ret/*_Integer*/ ){
		if( !_this.process( childParam, err ) ){
			step.set( 2 );
		}
		return true;
	},
	_procMain3Cache : function( _this, func, childParam, step/*_Integer*/, err/*_Integer*/, ret/*_Integer*/ ){
		if( ret.set( _this.termProcess( childParam, err ) )._val != _CLIP_LOOP_CONT ){
			return false;
		}
		step.set( 0 );

		ret.set( _CLIP_PROC_END );
		return false;
	},

	_procTest1 : function( _this, func, childParam, step/*_Integer*/, err/*_Integer*/, ret/*_Integer*/ ){
		if( childParam._fileDataGet >= childParam._fileData.length ){
			ret.set( _CLIP_PROC_END );
			return false;
		}
		step.set( _this.beginTestProcess( childParam._fileData[childParam._fileDataGet], childParam, err ) ? 1 : 2 );
		childParam._fileDataGet++;
		return true;
	},
	_procTest2 : function( _this, func, childParam, step/*_Integer*/, err/*_Integer*/, ret/*_Integer*/ ){
		if( !_this.testProcess( childParam, err ) ){
			step.set( 2 );
		}
		return true;
	},
	_procTest3 : function( _this, func, childParam, step/*_Integer*/, err/*_Integer*/, ret/*_Integer*/ ){
		if( ret.set( _this.termTestProcess( childParam, err ) )._val != _CLIP_LOOP_CONT ){
			return false;
		}
		step.set( 0 );

		childParam._lineNum++;
		return true;
	}

};

var _procSubFunc = [
	_Proc.prototype._funcDefined,
	_Proc.prototype._funcIndexOf,

	_Proc.prototype._funcIsInf,
	_Proc.prototype._funcIsNaN,

	_Proc.prototype._funcRand,
	_Proc.prototype._funcTime,
	_Proc.prototype._funcMkTime,
	_Proc.prototype._funcTmSec,
	_Proc.prototype._funcTmMin,
	_Proc.prototype._funcTmHour,
	_Proc.prototype._funcTmMDay,
	_Proc.prototype._funcTmMon,
	_Proc.prototype._funcTmYear,
	_Proc.prototype._funcTmWDay,
	_Proc.prototype._funcTmYDay,
	_Proc.prototype._funcTmXMon,
	_Proc.prototype._funcTmXYear,

	_Proc.prototype._funcA2D,
	_Proc.prototype._funcA2G,
	_Proc.prototype._funcA2R,
	_Proc.prototype._funcD2A,
	_Proc.prototype._funcD2G,
	_Proc.prototype._funcD2R,
	_Proc.prototype._funcG2A,
	_Proc.prototype._funcG2D,
	_Proc.prototype._funcG2R,
	_Proc.prototype._funcR2A,
	_Proc.prototype._funcR2D,
	_Proc.prototype._funcR2G,

	_Proc.prototype._funcSin,
	_Proc.prototype._funcCos,
	_Proc.prototype._funcTan,
	_Proc.prototype._funcASin,
	_Proc.prototype._funcACos,
	_Proc.prototype._funcATan,
	_Proc.prototype._funcATan2,
	_Proc.prototype._funcSinH,
	_Proc.prototype._funcCosH,
	_Proc.prototype._funcTanH,
	_Proc.prototype._funcASinH,
	_Proc.prototype._funcACosH,
	_Proc.prototype._funcATanH,
	_Proc.prototype._funcExp,
	_Proc.prototype._funcExp10,
	_Proc.prototype._funcLn,
	_Proc.prototype._funcLog,
	_Proc.prototype._funcLog10,
	_Proc.prototype._funcPow,
	_Proc.prototype._funcSqr,
	_Proc.prototype._funcSqrt,
	_Proc.prototype._funcCeil,
	_Proc.prototype._funcFloor,
	_Proc.prototype._funcAbs,
	_Proc.prototype._funcLdexp,
	_Proc.prototype._funcFrexp,
	_Proc.prototype._funcModf,
	_Proc.prototype._funcFact,

	_Proc.prototype._funcInt,
	_Proc.prototype._funcReal,
	_Proc.prototype._funcImag,
	_Proc.prototype._funcArg,
	_Proc.prototype._funcNorm,
	_Proc.prototype._funcConjg,
	_Proc.prototype._funcPolar,

	_Proc.prototype._funcNum,
	_Proc.prototype._funcDenom,

	_Proc.prototype._funcRow,
	_Proc.prototype._funcCol,
	_Proc.prototype._funcTrans,

	_Proc.prototype._funcStrCmp,
	_Proc.prototype._funcStrCmp,
	_Proc.prototype._funcStrLen,

	_Proc.prototype._funcGWidth,
	_Proc.prototype._funcGHeight,
	_Proc.prototype._funcGColor,
	_Proc.prototype._funcGColor,
	_Proc.prototype._funcGCX,
	_Proc.prototype._funcGCY,
	_Proc.prototype._funcWCX,
	_Proc.prototype._funcWCY,
	_Proc.prototype._funcGGet,
	_Proc.prototype._funcWGet,
	_Proc.prototype._funcGX,
	_Proc.prototype._funcGY,
	_Proc.prototype._funcWX,
	_Proc.prototype._funcWY,
	_Proc.prototype._funcMkColor,
	_Proc.prototype._funcMkColorS,
	_Proc.prototype._funcColGetR,
	_Proc.prototype._funcColGetG,
	_Proc.prototype._funcColGetB,

	_Proc.prototype._funcCall,
	_Proc.prototype._funcEval,

	_Proc.prototype._funcMp,
	_Proc.prototype._funcMRound
];

var _procSubOp = [
	_Proc.prototype._unaryIncrement,
	_Proc.prototype._unaryDecrement,
	_Proc.prototype._unaryComplement,
	_Proc.prototype._unaryNot,
	_Proc.prototype._unaryMinus,
	_Proc.prototype._unaryPlus,

	_Proc.prototype._opPostfixInc,
	_Proc.prototype._opPostfixDec,

	_Proc.prototype._opMul,
	_Proc.prototype._opDiv,
	_Proc.prototype._opMod,

	_Proc.prototype._opAdd,
	_Proc.prototype._opSub,

	_Proc.prototype._opShiftL,
	_Proc.prototype._opShiftR,

	_Proc.prototype._opLess,
	_Proc.prototype._opLessOrEq,
	_Proc.prototype._opGreat,
	_Proc.prototype._opGreatOrEq,

	_Proc.prototype._opEqual,
	_Proc.prototype._opNotEqual,

	_Proc.prototype._opAND,

	_Proc.prototype._opXOR,

	_Proc.prototype._opOR,

	_Proc.prototype._opLogAND,

	_Proc.prototype._opLogOR,

	_Proc.prototype._opConditional,

	_Proc.prototype._opAss,
	_Proc.prototype._opMulAndAss,
	_Proc.prototype._opDivAndAss,
	_Proc.prototype._opModAndAss,
	_Proc.prototype._opAddAndAss,
	_Proc.prototype._opSubAndAss,
	_Proc.prototype._opShiftLAndAss,
	_Proc.prototype._opShiftRAndAss,
	_Proc.prototype._opANDAndAss,
	_Proc.prototype._opORAndAss,
	_Proc.prototype._opXORAndAss,

	_Proc.prototype._opComma,

	_Proc.prototype._opPow,
	_Proc.prototype._opPowAndAss,

	_Proc.prototype._opFact
];

var _procSubLoop = [
	_Proc.prototype._loopBegin,
	_Proc.prototype._loopEnd,
	_Proc.prototype._loopEnd,
	_Proc.prototype._loopEnd,
	_Proc.prototype._loopEnd,
	_Proc.prototype._loopEnd,
	_Proc.prototype._loopEnd,
	_Proc.prototype._loopCont,

	_Proc.prototype._loopBegin,
	_Proc.prototype._loopUntil,

	_Proc.prototype._loopWhile,
	_Proc.prototype._loopEndWhile,

	_Proc.prototype._loopFor,
	_Proc.prototype._loopFor,
	_Proc.prototype._loopNext,

	_Proc.prototype._loopFunc,
	_Proc.prototype._loopEndFunc,

	_Proc.prototype._loopMultiEnd,

	_Proc.prototype._loopIf,
	_Proc.prototype._loopElIf,
	_Proc.prototype._loopElse,
	_Proc.prototype._loopEndIf,

	_Proc.prototype._loopSwitch,
	_Proc.prototype._loopCase,
	_Proc.prototype._loopDefault,
	_Proc.prototype._loopEndSwi,
	_Proc.prototype._loopBreakSwi,

	_Proc.prototype._loopContinue,
	_Proc.prototype._loopBreak,
	_Proc.prototype._loopContinue,
	_Proc.prototype._loopBreak,

	_Proc.prototype._loopAssert,
	_Proc.prototype._loopReturn,
	_Proc.prototype._loopReturn,
	_Proc.prototype._loopReturn
];

var _procSubStat = [
	_Proc.prototype._statStart,
	_Proc.prototype._statEnd,
	_Proc.prototype._statEndInc,
	_Proc.prototype._statEndDec,
	_Proc.prototype._statEndEq,
	_Proc.prototype._statEndEqInc,
	_Proc.prototype._statEndEqDec,
	_Proc.prototype._statCont,

	_Proc.prototype._statDo,
	_Proc.prototype._statUntil,

	_Proc.prototype._statWhile,
	_Proc.prototype._statEndWhile,

	_Proc.prototype._statFor,
	_Proc.prototype._statFor2,
	_Proc.prototype._statNext,

	_Proc.prototype._statFunc,
	_Proc.prototype._statEndFunc,

	_Proc.prototype._statMultiEnd,

	_Proc.prototype._statIf,
	_Proc.prototype._statElIf,
	_Proc.prototype._statElse,
	_Proc.prototype._statEndIf,

	_Proc.prototype._statSwitch,
	_Proc.prototype._statCase,
	_Proc.prototype._statDefault,
	_Proc.prototype._statEndSwi,
	_Proc.prototype._statBreakSwi,

	_Proc.prototype._statContinue,
	_Proc.prototype._statBreak,
	_Proc.prototype._statContinue2,
	_Proc.prototype._statBreak2,

	_Proc.prototype._statAssert,
	_Proc.prototype._statReturn,
	_Proc.prototype._statReturn2,
	_Proc.prototype._statReturn3
];

var _procSubCommand = [
	_Proc.prototype._commandNull,

	_Proc.prototype._commandEFloat,
	_Proc.prototype._commandFFloat,
	_Proc.prototype._commandGFloat,
	_Proc.prototype._commandEComplex,
	_Proc.prototype._commandFComplex,
	_Proc.prototype._commandGComplex,
	_Proc.prototype._commandPrec,

	_Proc.prototype._commandIFract,
	_Proc.prototype._commandMFract,

	_Proc.prototype._commandHTime,
	_Proc.prototype._commandMTime,
	_Proc.prototype._commandSTime,
	_Proc.prototype._commandFTime,
	_Proc.prototype._commandFps,

	_Proc.prototype._commandSChar,
	_Proc.prototype._commandUChar,
	_Proc.prototype._commandSShort,
	_Proc.prototype._commandUShort,
	_Proc.prototype._commandSLong,
	_Proc.prototype._commandULong,
	_Proc.prototype._commandSInt,
	_Proc.prototype._commandUInt,
	_Proc.prototype._commandRadix,

	_Proc.prototype._commandFMultiPrec,
	_Proc.prototype._commandIMultiPrec,

	_Proc.prototype._commandPType,

	_Proc.prototype._commandRad,
	_Proc.prototype._commandDeg,
	_Proc.prototype._commandGrad,

	_Proc.prototype._commandAngle,

	_Proc.prototype._commandAns,
	_Proc.prototype._commandAssert,
	_Proc.prototype._commandWarn,

	_Proc.prototype._commandParam,
	_Proc.prototype._commandParams,

	_Proc.prototype._commandDefine,
	_Proc.prototype._commandEnum,
	_Proc.prototype._commandUnDef,
	_Proc.prototype._commandVar,
	_Proc.prototype._commandArray,
	_Proc.prototype._commandLocal,
	_Proc.prototype._commandGlobal,
	_Proc.prototype._commandLabel,
	_Proc.prototype._commandParent,

	_Proc.prototype._commandReal,
	_Proc.prototype._commandImag,

	_Proc.prototype._commandNum,
	_Proc.prototype._commandDenom,

	_Proc.prototype._commandMat,
	_Proc.prototype._commandTrans,

	_Proc.prototype._commandSRand,
	_Proc.prototype._commandLocalTime,
	_Proc.prototype._commandArrayCopy,
	_Proc.prototype._commandArrayFill,

	_Proc.prototype._commandStrCpy,
	_Proc.prototype._commandStrCpy,
	_Proc.prototype._commandStrLwr,
	_Proc.prototype._commandStrUpr,

	_Proc.prototype._commandClear,
	_Proc.prototype._commandError,
	_Proc.prototype._commandPrint,
	_Proc.prototype._commandPrint,
	_Proc.prototype._commandPrint,
	_Proc.prototype._commandScan,

	_Proc.prototype._commandGWorld,
	_Proc.prototype._commandGWorld,
	_Proc.prototype._commandGClear,
	_Proc.prototype._commandGColor,
	_Proc.prototype._commandGFill,
	_Proc.prototype._commandGMove,
	_Proc.prototype._commandGText,
	_Proc.prototype._commandGTextR,
	_Proc.prototype._commandGTextL,
	_Proc.prototype._commandGTextRL,
	_Proc.prototype._commandGLine,
	_Proc.prototype._commandGPut,
	_Proc.prototype._commandGPut24,
	_Proc.prototype._commandGGet,
	_Proc.prototype._commandGGet24,
	_Proc.prototype._commandGUpdate,

	_Proc.prototype._commandWindow,
	_Proc.prototype._commandWFill,
	_Proc.prototype._commandWMove,
	_Proc.prototype._commandWText,
	_Proc.prototype._commandWTextR,
	_Proc.prototype._commandWTextL,
	_Proc.prototype._commandWTextRL,
	_Proc.prototype._commandWLine,
	_Proc.prototype._commandWPut,
	_Proc.prototype._commandWGet,

	_Proc.prototype._commandRectangular,
	_Proc.prototype._commandParametric,
	_Proc.prototype._commandPolar,
	_Proc.prototype._commandLogScale,
	_Proc.prototype._commandNoLogScale,
	_Proc.prototype._commandPlot,
	_Proc.prototype._commandRePlot,

	_Proc.prototype._commandCalculator,

	_Proc.prototype._commandInclude,

	_Proc.prototype._commandBase,

	_Proc.prototype._commandNameSpace,

	_Proc.prototype._commandUse,
	_Proc.prototype._commandUnuse,

	_Proc.prototype._commandDump,
	_Proc.prototype._commandPrint
];

var _procSubSe = [
	_Proc.prototype._seNull,

	_Proc.prototype._seIncrement,
	_Proc.prototype._seDecrement,
	_Proc.prototype._seNegative,

	_Proc.prototype._seComplement,
	_Proc.prototype._seNot,
	_Proc.prototype._seMinus,

	_Proc.prototype._seSet,
	_Proc.prototype._seSetC,
	_Proc.prototype._seSetF,
	_Proc.prototype._seSetM,

	_Proc.prototype._seMul,
	_Proc.prototype._seDiv,
	_Proc.prototype._seMod,
	_Proc.prototype._seAdd,
	_Proc.prototype._seAddS,
	_Proc.prototype._seSub,
	_Proc.prototype._seSubS,
	_Proc.prototype._sePow,
	_Proc.prototype._seShiftL,
	_Proc.prototype._seShiftR,
	_Proc.prototype._seAND,
	_Proc.prototype._seOR,
	_Proc.prototype._seXOR,

	_Proc.prototype._seLess,
	_Proc.prototype._seLessOrEq,
	_Proc.prototype._seGreat,
	_Proc.prototype._seGreatOrEq,
	_Proc.prototype._seEqual,
	_Proc.prototype._seNotEqual,
	_Proc.prototype._seLogAND,
	_Proc.prototype._seLogOR,

	_Proc.prototype._seMulAndAss,
	_Proc.prototype._seDivAndAss,
	_Proc.prototype._seModAndAss,
	_Proc.prototype._seAddAndAss,
	_Proc.prototype._seAddSAndAss,
	_Proc.prototype._seSubAndAss,
	_Proc.prototype._seSubSAndAss,
	_Proc.prototype._sePowAndAss,
	_Proc.prototype._seShiftLAndAss,
	_Proc.prototype._seShiftRAndAss,
	_Proc.prototype._seANDAndAss,
	_Proc.prototype._seORAndAss,
	_Proc.prototype._seXORAndAss,

	_Proc.prototype._seLessAndAss,
	_Proc.prototype._seLessOrEqAndAss,
	_Proc.prototype._seGreatAndAss,
	_Proc.prototype._seGreatOrEqAndAss,
	_Proc.prototype._seEqualAndAss,
	_Proc.prototype._seNotEqualAndAss,
	_Proc.prototype._seLogANDAndAss,
	_Proc.prototype._seLogORAndAss,

	_Proc.prototype._seConditional,

	_Proc.prototype._seSetFALSE,
	_Proc.prototype._seSetTRUE,
	_Proc.prototype._seSetZero,

	_Proc.prototype._seSaturate,
	_Proc.prototype._seSetS
];

var _procSub = [
	_Proc.prototype._procTop,

	_Proc.prototype._procVariable,
	_Proc.prototype._procAutoVar,
	_Proc.prototype._procGlobalVar,

	_Proc.prototype._procArray,
	_Proc.prototype._procAutoArray,
	_Proc.prototype._procAutoArray,

	_Proc.prototype._procConst,
	_Proc.prototype._procMultiPrec,
	_Proc.prototype._procLabel,
	_Proc.prototype._procCommand,
	_Proc.prototype._procStat,
	_Proc.prototype._procUnary,
	_Proc.prototype._procFunc,
	_Proc.prototype._procExtFunc
];

var _procMain = [
	_Proc.prototype._procMain1,
	_Proc.prototype._procMain2,
	_Proc.prototype._procMain3
];

var _procMainCache = [
	_Proc.prototype._procMain1Cache,
	_Proc.prototype._procMain2Cache,
	_Proc.prototype._procMain3Cache
];

var _procTest = [
	_Proc.prototype._procTest1,
	_Proc.prototype._procTest2,
	_Proc.prototype._procTest3
];

function defProcFunction( window ){
	if( window.getExtFuncDataDirect == undefined ) window.getExtFuncDataDirect = function( func ){ return null; };
	if( window.getExtFuncDataNameSpace == undefined ) window.getExtFuncDataNameSpace = function( func ){ return null; };

	if( window.mainProc == undefined ) window.mainProc = function( parentProc, parentParam, func, funcParam, childProc, childParam ){ return _CLIP_PROC_END; };
	if( window.assertProc == undefined ) window.assertProc = function( num, func ){ return false; };
	if( window.errorProc == undefined ) window.errorProc = function( err, num, func, token ){};

	if( window.printTrace == undefined ) window.printTrace = function( param, line, num, comment, skipFlag ){};
	if( window.printTest == undefined ) window.printTest = function( param, line, num, comment ){};
	if( window.printAnsComplex == undefined ) window.printAnsComplex = function( real, imag ){};
	if( window.printAnsMultiPrec == undefined ) window.printAnsMultiPrec = function( str ){};
	if( window.printAnsMatrix == undefined ) window.printAnsMatrix = function( param, array/*_Token*/ ){};
	if( window.printWarn == undefined ) window.printWarn = function( warn, num, func ){};
	if( window.printError == undefined ) window.printError = function( error, num, func ){};

	if( window.doFuncGColor == undefined ) window.doFuncGColor = function( rgb ){ return 0; };
	if( window.doFuncGColor24 == undefined ) window.doFuncGColor24 = function( index ){ return 0x000000; };
	if( window.doFuncEval == undefined ) window.doFuncEval = function( parentProc, childProc, childParam, string, value ){ return _CLIP_NO_ERR; };

	if( window.doCommandClear == undefined ) window.doCommandClear = function(){};
	if( window.doCommandPrint == undefined ) window.doCommandPrint = function( topPrint, flag ){};
	if( window.doCommandScan == undefined ) window.doCommandScan = function( topScan, proc, param ){};
	if( window.doCommandGWorld == undefined ) window.doCommandGWorld = function( width, height ){};
	if( window.doCommandGWorld24 == undefined ) window.doCommandGWorld24 = function( width, height ){};
	if( window.doCommandWindow == undefined ) window.doCommandWindow = function( left, bottom, right, top ){};
	if( window.doCommandGColor == undefined ) window.doCommandGColor = function( index, rgb ){};
	if( window.doCommandGPut24Begin == undefined ) window.doCommandGPut24Begin = function(){};
	if( window.doCommandGPut24 == undefined ) window.doCommandGPut24 = function( x, y, rgb ){};
	if( window.doCommandGPut24End == undefined ) window.doCommandGPut24End = function(){};
	if( window.doCommandGGet24Begin == undefined ) window.doCommandGGet24Begin = function( width/*_Integer*/, height/*_Integer*/ ){ return null; };
	if( window.doCommandGGet24End == undefined ) window.doCommandGGet24End = function(){};
	if( window.doCommandGUpdate == undefined ) window.doCommandGUpdate = function( gWorld ){};
	if( window.doCommandPlot == undefined ) window.doCommandPlot = function( parentProc, childProc, childParam, graph, start, end, step ){};
	if( window.doCommandRePlot == undefined ) window.doCommandRePlot = function( parentProc, childProc, childParam, graph, start, end, step ){};
	if( window.doCommandUsage == undefined ) window.doCommandUsage = function( topUsage ){};

	if( window.skipCommandLog == undefined ) window.skipCommandLog = function(){ return true; };
	if( window.doCommandLog == undefined ) window.doCommandLog = function( topPrint ){};
	if( window.doCommandDumpVar == undefined ) window.doCommandDumpVar = function( param, index ){};
	if( window.doCommandDumpArray == undefined ) window.doCommandDumpArray = function( param, index ){};

	if( window.onStartPlot == undefined ) window.onStartPlot = function(){};
	if( window.onEndPlot == undefined ) window.onEndPlot = function(){};
	if( window.onStartRePlot == undefined ) window.onStartRePlot = function(){};
	if( window.onEndRePlot == undefined ) window.onEndRePlot = function(){};
}

function doFuncGColorBGR( rgb, bgrColorArray ){
	var i, j;
	var r = (rgb & 0xFF0000) >> 16;
	var g = (rgb & 0x00FF00) >> 8;
	var b =  rgb & 0x0000FF;
	var rr, gg, bb, tmp;
	var d = 766/*255*3+1*/;
	for( i = 0, j = 0; i < 256; i++ ){
		rr =  bgrColorArray[i] & 0x0000FF;
		gg = (bgrColorArray[i] & 0x00FF00) >> 8;
		bb = (bgrColorArray[i] & 0xFF0000) >> 16;
		tmp = _ABS( rr - r ) + _ABS( gg - g ) + _ABS( bb - b );
		if( tmp < d ){
			j = i;
			d = tmp;
		}
	}
	return j;
}

function _RGB2BGR( data ){
	return ((data & 0x0000FF) << 16) + (data & 0x00FF00) + ((data & 0xFF0000) >> 16);
}
