/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Global.h"

// 置き換え
function __Replace( descCode, descToken, realCode, realToken ){
	this._descCode  = descCode;
	this._descToken = descToken;
	this._realCode  = realCode;
	this._realToken = realToken;
}

// 計算パラメータ
function _Param( num, parentParam, inherit ){
	var i;

	// 呼び出し元情報
	this._parentNum = (parentParam == undefined) ? 0 : (
		parentParam._fileFlag ? ((parentParam._topNum > 0) ? num - parentParam._topNum + 1 : num) : 0
		);
	this._parentFunc = (parentParam == undefined) ? "" : (
		(parentParam._funcName == null) ? "" : parentParam._funcName
		);

	if( parentParam == undefined ){
		inherit = false;
	}
	this._calculator = inherit ? parentParam._calculator : false;
	this._base       = inherit ? parentParam._base       : 0;
	this._mode       = inherit ? parentParam._mode       : _CLIP_DEFMODE;
	this._fps        = inherit ? parentParam._fps        : _CLIP_DEFFPS;
	this._prec       = inherit ? parentParam._prec       : _CLIP_DEFPREC;
	this._radix      = inherit ? parentParam._radix      : _CLIP_DEFRADIX;
	this._mpPrec     = inherit ? parentParam._mpPrec     : _CLIP_DEFMPPREC;
	this._mpRound    = inherit ? parentParam._mpRound    : _CLIP_DEFMPROUND;

	if( parentParam != undefined ){
		this._saveMode = parentParam._mode;
		this._saveFps  = parentParam._fps;
	}
	this.updateMode();
	this.updateFps();

	this._saveRadix = this._radix;

	this._var   = new _Variable();	// 変数
	this._array = new _Array();		// 配列
	this._func  = new _Func();		// ユーザー定義関数

	// 外部関数関連
	this._funcName    = null;	// 外部関数名
	this._fileData    = null;	// 計算対象のファイル内容
	this._fileDataGet = 0;
	this._fileLine    = null;	// 計算対象の行管理クラス
	this._fileFlag    = false;	// ファイルか標準入力かのフラグ
	this._topNum      = 0;
	this._lineNum     = 1;		// 行番号

	// 各種フラグ
	this._enableCommand = true;		// コマンドが使用できるかどうかのフラグ
	this._enableOpPow   = false;	// 累乗演算子"^"が使用できるかどうかのフラグ
	this._enableStat    = true;		// ステートメントが使用できるかどうかのフラグ
	this._printAns      = true;		// 一行の計算が終了した時に計算結果を表示するかどうかのフラグ
	this._assFlag       = false;	// 最後の計算が代入かどうかのフラグ
	this._subStep       = 0;		// 括弧内の計算中かどうかのフラグ

	this._parent = null;	// 親プロセスの計算パラメータ

	// 親プロセスのパラメータ値を更新するかどうかのフラグ
	this._updateParam = new Array( 10 );
	for( i = 0; i < 10; i++ ){
		this._updateParam[i] = false;
	}
	this._updateParamCode  = new Array();
	this._updateParamIndex = new Array();

	// 親プロセスの変数・配列を更新するかどうかのフラグ
	this._updateParentVar   = new Array();
	this._updateParentArray = new Array();

	this._defNameSpace = null;
	this._nameSpace    = null;

	this._seFlag  = false;
	this._seToken = _CLIP_SE_NULL;

	this._mpFlag = false;

	this._replace = new Array();
	if( parentParam != undefined ){
		for( i = 0; i < parentParam._replace.length; i++ ){
			this._replace[this._replace.length] = new __Replace(
				parentParam._replace[i]._descCode,
				parentParam._replace[i]._descToken,
				parentParam._replace[i]._realCode,
				parentParam._replace[i]._realToken
				);
		}
	}
}

_Param.prototype = {

	end : function(){
		if( this._saveMode != undefined ){
			globalParam().setMode( this._saveMode );
		}
		if( this._saveFps != undefined ){
			globalParam().setFps( this._saveFps );
		}
	},

//	variable : function(){ return this._var; },
//	array : function(){ return this._array; },

//	fileFlag : function(){ return this._fileFlag; },

//	setEnableCommand : function( flag ){
//		this._enableCommand = flag;
//	},
//	setEnableOpPow : function( flag ){
//		this._enableOpPow = flag;
//	},
//	setEnableStat : function( flag ){
//		this._enableStat = flag;
//	},

//	setCalculator : function( flag ){
//		this._calculator = flag;
//	},
//	isCalculator : function(){
//		return this._calculator;
//	},

//	setBase : function( base ){
//		this._base = base;
//	},
//	base : function(){
//		return this._base;
//	},

	updateMode : function(){
		setComplexIsReal( (this._mode & _CLIP_MODE_COMPLEX) == 0 );
		if( (this._mode & _CLIP_MODE_FRACT) != 0 ){
			setValueType( _VALUE_TYPE_FRACT );
		} else if( (this._mode & _CLIP_MODE_TIME) != 0 ){
			setValueType( _VALUE_TYPE_TIME );
		} else {
			setValueType( _VALUE_TYPE_COMPLEX );
		}
	},
	setMode : function( mode ){
		if( this._mode == _CLIP_MODE_I_MULTIPREC ){
			this._radix = this._saveRadix;
		}
		this._mode = mode;
		if( this._mode == _CLIP_MODE_I_MULTIPREC ){
			this._saveRadix = this._radix;
			this._radix = 10;
		}
		this.updateMode();
	},
//	mode : function(){
//		return this._mode;
//	},

	isMultiPrec : function(){
		return ((this._mode & _CLIP_MODE_MULTIPREC) != 0);
	},

	updateFps : function(){
		setTimeFps( this._fps );
	},
	setFps : function( fps ){
		if( fps < 0.0 ){
			this._fps = _CLIP_DEFFPS;
		} else {
			this._fps = fps;
		}
		this.updateFps();
	},
//	fps : function(){
//		return this._fps;
//	},

	setPrec : function( prec ){
		if( prec < _CLIP_MINPREC ){
			this._prec = _CLIP_DEFPREC;
		} else {
			this._prec = prec;
		}
	},
//	prec : function(){
//		return this._prec;
//	},

	setRadix : function( radix ){
		if( radix < _CLIP_MINRADIX ){
			this._radix = _CLIP_DEFRADIX;
		} else if( radix > _CLIP_MAXRADIX ){
			this._radix = _CLIP_MAXRADIX;
		} else {
			this._radix = radix;
		}
	},
//	radix : function(){
//		return this._radix;
//	},

	mpSetPrec : function( prec ){
		if( prec < _CLIP_MINMPPREC ){
			this._mpPrec = _CLIP_DEFMPPREC;
		} else {
			this._mpPrec = prec;
		}
	},
//	mpPrec : function(){
//		return this._mpPrec;
//	},

	mpSetRound : function( mode ){
		if( mode == "up" ){
			this._mpRound = _MP_FROUND_UP;
		} else if( mode == "down" ){
			this._mpRound = _MP_FROUND_DOWN;
		} else if( mode == "ceiling" ){
			this._mpRound = _MP_FROUND_CEILING;
		} else if( mode == "floor" ){
			this._mpRound = _MP_FROUND_FLOOR;
		} else if( mode == "h_up" ){
			this._mpRound = _MP_FROUND_HALF_UP;
		} else if( mode == "h_down" ){
			this._mpRound = _MP_FROUND_HALF_DOWN;
		} else if( mode == "h_even" ){
			this._mpRound = _MP_FROUND_HALF_EVEN;
		} else if( mode == "h_down2" ){
			this._mpRound = _MP_FROUND_HALF_DOWN2;
		} else if( mode == "h_even2" ){
			this._mpRound = _MP_FROUND_HALF_EVEN2;
		} else {
			return false;
		}
		return true;
	},
//	mpRound : function(){
//		return this._mpRound;
//	},

//	setAnsFlag : function( flag ){
//		this._printAns = (flag != 0);
//	},
//	ansFlag : function(){
//		return this._printAns;
//	},

	setVal : function( index, value, moveFlag ){
		if( index == 0 ){
			this._array._mat[index]._mat[0].ass( value );
			return true;
		} else {
			return this._var.set( index, value, moveFlag );
		}
	},
	setReal : function( index, value, moveFlag ){
		if( index == 0 ){
			this._array._mat[index]._mat[0].setReal( value );
			return true;
		} else {
			return this._var.setReal( index, value, moveFlag );
		}
	},
	setImag : function( index, value, moveFlag ){
		if( index == 0 ){
			this._array._mat[index]._mat[0].setImag( value );
			return true;
		} else {
			return this._var.setImag( index, value, moveFlag );
		}
	},
	fractSetMinus : function( index, isMinus, moveFlag ){
		if( index == 0 ){
			this._array._mat[index]._mat[0].fractSetMinus( isMinus );
			return true;
		} else {
			return this._var.fractSetMinus( index, isMinus, moveFlag );
		}
	},
	setNum : function( index, value, moveFlag ){
		if( index == 0 ){
			this._array._mat[index]._mat[0].setNum( value );
			return true;
		} else {
			return this._var.setNum( index, value, moveFlag );
		}
	},
	setDenom : function( index, value, moveFlag ){
		if( index == 0 ){
			this._array._mat[index]._mat[0].setDenom( value );
			return true;
		} else {
			return this._var.setDenom( index, value, moveFlag );
		}
	},
	fractReduce : function( index, moveFlag ){
		if( index == 0 ){
			this._array._mat[index]._mat[0].fractReduce();
			return true;
		} else {
			return this._var.fractReduce( index, moveFlag );
		}
	},

	// 値を確認する
	val : function( index ){
		return (index == 0) ? this._array._mat[index]._mat[0] : this._var.val( index );
	},
	isZero : function( index ){
		return _ISZERO( this.val( index ).real() ) && _ISZERO( this.val( index ).imag() );
	},

	// 置き換え
	repVal : function( index, value/*_Value*/, moveFlag ){
		if( index == 0 ){
			this._array._mat[index]._mat[0] = value;
			return true;
		} else {
			return this._var.rep( index, value, moveFlag );
		}
	},

	// 外部関数情報を登録する
	setFunc : function( funcName, topNum ){
		if( this._funcName != null ){
			this._funcName = null;
		}
		if( funcName != null ){
			this._funcName = new String();
			this._funcName = funcName;

			var end = this._funcName.indexOf( ":" );
			if( end > 0 ){
				this.setDefNameSpace( this._funcName.substring( 0, end ) );
			}
		}
		this._topNum = topNum;
	},

	// 外部関数情報を確認する
//	funcName : function(){ return this._funcName; },
//	topNum : function(){ return this._topNum; },

	// 定義定数をコピーする
	dupDefine : function( dst/*_Param*/ ){
		for( var i = 1; i < 256; i++ ){	// 0は計算結果用に予約されている...
			if( this._var.isLocked( i ) ){
				dst._var.define( this._var._label._label[i], this._var.val( i ), true );
			}
		}
	},

	// 関数の引数用変数にラベルを設定する
	setLabel : function( label ){
		var i;
		var code;
		var token;
		var strLabel = new String();
		var lock;

		i = 0;
		label.beginGetToken();
		while( label.getToken() ){
			code  = _get_code;
			token = _get_token;
			// &かどうかをチェックする
			if( (code == _CLIP_CODE_PARAM_ANS) || ((code == _CLIP_CODE_OPERATOR) && (token >= _CLIP_OP_AND)) ){
				if( !(label.getToken()) ){
					break;
				}
				code  = _get_code;
				token = _get_token;
				this._updateParam[i] = true;
			} else {
				this._updateParam[i] = false;
			}

			if( code == _CLIP_CODE_LABEL ){
				strLabel = token;

				// ラベルを設定する
				lock = label.lock();
				if( label.getToken() ){
					code  = _get_code;
					token = _get_token;
					if( code == _CLIP_CODE_PARAM_ARRAY ){
						this._array._label.setLabel( _CHAR_CODE_0 + i, strLabel, true );
					} else {
						label.unlock( lock );
						this._var._label.setLabel( _CHAR_CODE_0 + i, strLabel, true );
					}
				} else {
					label.unlock( lock );
					this._var._label.setLabel( _CHAR_CODE_0 + i, strLabel, true );
				}

				i++;
			}
		}
	},

	setDefNameSpace : function( defNameSpace ){
		this._defNameSpace = defNameSpace;
		this._nameSpace = this._defNameSpace;
	},
//	defNameSpace : function(){
//		return this._defNameSpace;
//	},
//	setNameSpace : function( nameSpace ){
//		this._nameSpace = nameSpace;
//	},
//	nameSpace : function(){
//		return this._nameSpace;
//	},
	resetNameSpace : function(){
		this._nameSpace = this._defNameSpace;
	},

	setReplace : function( descCode, descToken, realCode, realToken ){
		var i;
		var tmp;
		for( i = 0; i < this._replace.length; i++ ){
			tmp = this._replace[i];
			if( descCode == tmp._descCode && descToken == tmp._descToken ){
				tmp._realCode  = realCode;
				tmp._realToken = realToken;
				return;
			}
		}
		this._replace[i] = new __Replace( descCode, descToken, realCode, realToken );
	},
	delReplace : function( descCode, descToken ){
		var replace = new Array();
		var tmp;
		for( var i = 0; i < this._replace.length; i++ ){
			tmp = this._replace[i];
			if( descCode != tmp._descCode || descToken != tmp._descToken ){
				replace[replace.length] = tmp;
			}
		}
		this._replace = replace;
	},
	replace : function( cur ){
		var tmp;
		for( var i = 0; i < this._replace.length; i++ ){
			tmp = this._replace[i];
			if( cur._code == tmp._descCode && cur._token == tmp._descToken ){
				cur._code  = tmp._realCode;
				cur._token = tmp._realToken;
				break;
			}
		}
	}

};
