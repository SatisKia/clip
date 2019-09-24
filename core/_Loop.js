/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Global.h"

// 行データ
function __Loop(){
	this._line    = null;
	this._subFlag = false;
	this._next    = null;	// 次の行データ
}

// 制御構造管理クラスの種類
#define _LOOP_TYPE_BASE		0
#define _LOOP_TYPE_SE		1
#define _LOOP_TYPE_DO		2
#define _LOOP_TYPE_WHILE	3
#define _LOOP_TYPE_FOR		4
#define _LOOP_TYPE_FUNC		5

// ループ制御構造管理クラス
function _Loop(){
	this._beforeLoop = null;
	this._curLoop    = this;
	this._loopType   = _LOOP_TYPE_BASE;

	// 行リスト
	this._top = null;
	this._end = null;
	this._cur = null;

	this._getFlag = false;

	this._breakFlag = false;
	this._contFlag = false;

	this._loopSub = [
		this._loopStart,
		this._loopEnd,
		this._loopEnd,
		this._loopEnd,
		this._loopEnd,
		this._loopEnd,
		this._loopEnd,

		this._loopDo,
		this._loopUntil,

		this._loopWhile,
		this._loopEndWhile,

		this._loopFor,
		this._loopFor,
		this._loopNext,

		this._loopFunc,
		this._loopEndFunc
	];
}

_Loop.prototype = {

	// 行を確保する
	_newLine : function(){
		var tmp = new __Loop();

		if( this._top == null ){
			// 先頭に登録する
			this._top = tmp;
		} else {
			// 最後尾に追加する
			this._end._next = tmp;
		}
		this._end       = tmp;
		this._end._next = this._top;

		tmp._line = null;

		return tmp;
	},

	// 行を削除する
	_del : function( cur, before ){
		if( cur == null ){
			return null;
		}

		var tmp = cur;
		if( before != null ){
			before._next = tmp._next;
			cur          = tmp._next;
		} else if( tmp == this._end ){
			this._top = null;
			cur       = null;
		} else {
			this._top       = tmp._next;
			this._end._next = this._top;
			cur             = tmp._next;
		}

		if( tmp._subFlag ){
			tmp._line = null;
		} else {
			tmp._line._line = null;
			if( tmp._line._comment != null ){
				tmp._line._comment = null;
			}
			tmp._line = null;
		}

		return cur;
	},

	_loopStart : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._loopType != _LOOP_TYPE_FUNC ){
			line.obj()._subFlag = true;
			line.obj()._line = new _Loop();
			line.obj()._line._loopType   = _LOOP_TYPE_SE;
			line.obj()._line._beforeLoop = _this._curLoop;
			_this._curLoop = line.obj()._line;

			line.set( _this._curLoop._newLine() );
		}
		return _CLIP_NO_ERR;
	},
	_loopDo : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._loopType != _LOOP_TYPE_FUNC ){
			line.obj()._subFlag = true;
			line.obj()._line = new _Loop();
			line.obj()._line._loopType   = _LOOP_TYPE_DO;
			line.obj()._line._beforeLoop = _this._curLoop;
			_this._curLoop = line.obj()._line;

			line.set( _this._curLoop._newLine() );
		}
		return _CLIP_NO_ERR;
	},
	_loopWhile : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._loopType != _LOOP_TYPE_FUNC ){
			line.obj()._subFlag = true;
			line.obj()._line = new _Loop();
			line.obj()._line._loopType   = _LOOP_TYPE_WHILE;
			line.obj()._line._beforeLoop = _this._curLoop;
			_this._curLoop = line.obj()._line;

			line.set( _this._curLoop._newLine() );
		}
		return _CLIP_NO_ERR;
	},
	_loopFor : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._loopType != _LOOP_TYPE_FUNC ){
			line.obj()._subFlag = true;
			line.obj()._line = new _Loop();
			line.obj()._line._loopType   = _LOOP_TYPE_FOR;
			line.obj()._line._beforeLoop = _this._curLoop;
			_this._curLoop = line.obj()._line;

			line.set( _this._curLoop._newLine() );
		}
		return _CLIP_NO_ERR;
	},
	_loopFunc : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._loopType == _LOOP_TYPE_FUNC ){
			return _CLIP_PROC_ERR_STAT_FUNC_NEST;
		}

		line.obj()._subFlag = true;
		line.obj()._line = new _Loop();
		line.obj()._line._loopType   = _LOOP_TYPE_FUNC;
		line.obj()._line._beforeLoop = _this._curLoop;
		_this._curLoop = line.obj()._line;

		line.set( _this._curLoop._newLine() );

		return _CLIP_NO_ERR;
	},
	_loopEnd : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._loopType == _LOOP_TYPE_SE ){
			beforeFlag.set( true );
		}
		return _CLIP_NO_ERR;
	},
	_loopUntil : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._loopType == _LOOP_TYPE_DO ){
			beforeFlag.set( true );
		}
		return _CLIP_NO_ERR;
	},
	_loopEndWhile : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._loopType == _LOOP_TYPE_WHILE ){
			beforeFlag.set( true );
		}
		return _CLIP_NO_ERR;
	},
	_loopNext : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		var tmp;
		var ret;

		if( _this._curLoop._loopType == _LOOP_TYPE_FOR ){
			// for(<初期設定文>)を<初期設定文>に加工する
			tmp = _this._curLoop._top._line._line;
			tmp.del( 0               );	// "for"
			tmp.del( 0               );	// "("
			tmp.del( tmp.count() - 1 );	// ")"

			// <条件部>をfor(<条件部>)に加工する
			if( _this._curLoop._top._next == _this._curLoop._end ){
				return _CLIP_PROC_ERR_STAT_FOR_CON;
			} else if( _this._curLoop._top._next._subFlag ){
				return _CLIP_PROC_ERR_STAT_FOR_CON;
			}
			tmp = _this._curLoop._top._next._line._line;
			if( tmp.count() > 0 ){
				var stat = _CLIP_STAT_FOR;
				tmp.insCode( 0, _CLIP_CODE_STATEMENT, stat );	// "for"
				tmp.insCode( 1, _CLIP_CODE_TOP,       null );	// "("
				tmp.addCode(    _CLIP_CODE_END,       null );	// ")"
			} else {
				tmp.insCode( 0, _CLIP_CODE_STATEMENT, _CLIP_STAT_FOR2 );
			}

			// <更新式>行を最後尾に移す
			if( _this._curLoop._top._next._next == _this._curLoop._end ){
				return _CLIP_PROC_ERR_STAT_FOR_EXP;
			} else if( _this._curLoop._top._next._next._subFlag ){
				return _CLIP_PROC_ERR_STAT_FOR_EXP;
			}
			if( (ret = _this._curLoop.regLine( _this._curLoop._top._next._next._line )) != _CLIP_LOOP_CONT ){
				return ret;
			}
			_this._curLoop._top._next._next = _this._curLoop._del( _this._curLoop._top._next._next, _this._curLoop._top._next );

			beforeFlag.set( true );
		}
		return _CLIP_NO_ERR;
	},
	_loopEndFunc : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._loopType == _LOOP_TYPE_FUNC ){
			beforeFlag.set( true );
		}
		return _CLIP_NO_ERR;
	},

	regLine : function( line ){
		var code  = new _Integer();
		var token = new _Void();
		var ret;

		var tmp = new _Void( this._curLoop._newLine() );
		var beforeFlag = new _Boolean( false );

		line._line.beginGetToken();
		if( line._line.getToken( code, token ) ){
			if( (code.val() == _CLIP_CODE_STATEMENT) && (token.obj() < _CLIP_STAT_LOOP_END) ){
				if( (ret = this._loopSub[token.obj()]( this, tmp, beforeFlag )) != _CLIP_NO_ERR ){
					return ret;
				}
			}
		}

		tmp.obj()._line = new __Line();
		tmp.obj()._line._line = new _Token();
		line._line.dup( tmp.obj()._line._line );
		tmp.obj()._line._num = line._num;
		if( line._comment != null ){
			tmp.obj()._line._comment = new String();
			tmp.obj()._line._comment = line._comment;
		}
		tmp.obj()._line._next = line._next;
		tmp.obj()._subFlag = false;

		if( beforeFlag.val() ){
			this._curLoop._getFlag = false;
			this._curLoop = this._curLoop._beforeLoop;
			if( this._curLoop._loopType == _LOOP_TYPE_BASE ){
				return _CLIP_PROC_END;
			}
		}

		return _CLIP_LOOP_CONT;
	},

	_getNextLine : function(){
		if( this._curLoop._loopType == _LOOP_TYPE_SE ){
			this._curLoop._cur = this._curLoop._cur._next;
			return true;
		} else if( this._curLoop._loopType == _LOOP_TYPE_DO ){
			this._curLoop._cur = this._curLoop._cur._next;
			return true;
		} else if( this._curLoop._loopType == _LOOP_TYPE_WHILE ){
			this._curLoop._cur = this._curLoop._cur._next;
			return true;
		} else if( this._curLoop._loopType == _LOOP_TYPE_FOR ){
			this._curLoop._cur = (this._curLoop._cur == this._curLoop._end) ?
				this._curLoop._top._next/*初期設定行を飛ばして次の行に行く*/ :
				this._curLoop._cur._next;
			return true;
		} else if( this._curLoop._loopType == _LOOP_TYPE_FUNC ){
			if( this._curLoop._cur == this._curLoop._end ){
				return false;
			} else {
				this._curLoop._cur = this._curLoop._cur._next;
				return true;
			}
		}
		this._curLoop._cur = (this._curLoop._cur == this._curLoop._end) ?
			null :
			this._curLoop._cur._next;
		return true;
	},
	getLine : function(){
		if( !(this._curLoop._getFlag) ){
			this._curLoop._getFlag = true;
			this._curLoop._cur = this._curLoop._top;
		}

		if( this._curLoop._cur == null ){
			return null;
		} else if( this._curLoop._cur._subFlag ){
			var nextLoop = this._curLoop._cur._line;
			nextLoop._breakFlag = this._curLoop._breakFlag;
			this._curLoop = nextLoop;
			return this._curLoop.getLine();
		}
		var line = this._curLoop._cur._line;
		if( this._curLoop._getNextLine() ){
			return line;
		}
		return null;
	},

	doEnd : function(){
		if( this._curLoop._contFlag ){
			this._curLoop._breakFlag = false;
			this._curLoop._contFlag = false;
		} else if( this._curLoop._breakFlag ){
			this._curLoop._breakFlag = false;

			this._curLoop._getFlag = false;
			this._curLoop = this._curLoop._beforeLoop;

			this._curLoop._getNextLine();
		}
	},
	doBreak : function(){
		if( !(this._curLoop._contFlag) ){
			this._curLoop._breakFlag = true;
		}
	},
	doContinue : function(){
		if( !(this._curLoop._breakFlag) ){
			this._curLoop._breakFlag = true;
			this._curLoop._contFlag = true;
		}
	},

	checkBreak : function(){
		return this._curLoop._breakFlag;
	},
	checkContinue : function(){
		return this._curLoop._contFlag;
	}

};