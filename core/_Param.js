/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Global.h"

// 計算パラメータ
function _Param( num, parentParam, inherit ){
	var i;

	// 呼び出し元情報
	this._parentNum = (parentParam == undefined) ? 0 : (
		parentParam._fileFlag ? (num - parentParam._topNum + 1) : 0
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

	if( parentParam != undefined ){
		this._saveMode = parentParam._mode;
		this._saveFps  = parentParam._fps;
	}
	this.updateMode();
	this.updateFps();

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
	this._enableOpPow   = false;	// 累乗演算子が使用できるかどうかのフラグ
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

	setEnableCommand : function( flag ){
		this._enableCommand = flag;
	},
	setEnableOpPow : function( flag ){
		this._enableOpPow = flag;
	},
	setEnableStat : function( flag ){
		this._enableStat = flag;
	},

	setCalculator : function( flag ){
		this._calculator = flag;
	},
	isCalculator : function(){
		return this._calculator;
	},

	setBase : function( base ){
		this._base = base;
	},
	base : function(){
		return this._base;
	},

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
		this._mode = mode;
		this.updateMode();
	},
	mode : function(){
		return this._mode;
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
	fps : function(){
		return this._fps;
	},

	setPrec : function( prec ){
		if( prec < _CLIP_MINPREC ){
			this._prec = _CLIP_DEFPREC;
		} else {
			this._prec = prec;
		}
	},
	prec : function(){
		return this._prec;
	},

	setRadix : function( radix ){
		if( radix < _CLIP_MINRADIX ){
			this._radix = _CLIP_DEFRADIX;
		} else if( radix > _CLIP_MAXRADIX ){
			this._radix = _CLIP_MAXRADIX;
		} else {
			this._radix = radix;
		}
	},
	radix : function(){
		return this._radix;
	},

	setAnsFlag : function( flag ){
		this._printAns = (flag != 0);
	},
	ansFlag : function(){
		return this._printAns;
	},

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

	// 値を確認する
	val : function( index ){
		return (index == 0) ? this._array._mat[index]._mat[0] : this._var.val( index );
	},
	isZero : function( index ){
		return _ISZERO( this.val( index ).real() ) && _ISZERO( this.val( index ).imag() );
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
		var code = new _Integer();
		var token = new _Void();
		var strLabel = new String();
		var lock;

		i = 0;
		label.beginGetToken();
		while( label.getToken( code, token ) ){
			// &かどうかをチェックする
			if( (code.val() == _CLIP_CODE_PARAM_ANS) || ((code.val() == _CLIP_CODE_OPERATOR) && (token.obj() >= _CLIP_OP_AND)) ){
				if( !(label.getToken( code, token )) ){
					break;
				}
				this._updateParam[i] = true;
			} else {
				this._updateParam[i] = false;
			}

			if( code.val() == _CLIP_CODE_LABEL ){
				strLabel = token.obj();

				// ラベルを設定する
				lock = label.lock();
				if( label.getToken( code, token ) ){
					if( code.val() == _CLIP_CODE_PARAM_ARRAY ){
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
	defNameSpace : function(){
		return this._defNameSpace;
	},
	setNameSpace : function( nameSpace ){
		this._nameSpace = nameSpace;
	},
	nameSpace : function(){
		return this._nameSpace;
	},
	resetNameSpace : function(){
		this._nameSpace = this._defNameSpace;
	}

};
