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

#define _LOOP_END_TYPE_WHILE	0
#define _LOOP_END_TYPE_FOR		1
#define _LOOP_END_TYPE_FUNC		2
#define _LOOP_END_TYPE_IF		3
#define _LOOP_END_TYPE_SWITCH	4

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

	this._endType = new Array( 16 );
	this._endCnt  = 0;
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
			tmp._line._token = null;
			if( tmp._line._comment != null ){
				tmp._line._comment = null;
			}
			tmp._line = null;
		}

		return cur;
	},

	_loopStart : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._loopType != _LOOP_TYPE_FUNC ){
			line._obj._subFlag = true;
			line._obj._line = new _Loop();
			line._obj._line._loopType   = _LOOP_TYPE_SE;
			line._obj._line._beforeLoop = _this._curLoop;
			_this._curLoop = line._obj._line;

			line.set( _this._curLoop._newLine() );
		}
		return _CLIP_NO_ERR;
	},
	_loopDo : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._loopType != _LOOP_TYPE_FUNC ){
			line._obj._subFlag = true;
			line._obj._line = new _Loop();
			line._obj._line._loopType   = _LOOP_TYPE_DO;
			line._obj._line._beforeLoop = _this._curLoop;
			_this._curLoop = line._obj._line;

			line.set( _this._curLoop._newLine() );
		}
		return _CLIP_NO_ERR;
	},
	_loopWhile : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._loopType != _LOOP_TYPE_FUNC ){
			line._obj._subFlag = true;
			line._obj._line = new _Loop();
			line._obj._line._loopType   = _LOOP_TYPE_WHILE;
			line._obj._line._beforeLoop = _this._curLoop;
			_this._curLoop = line._obj._line;

			_this._curLoop._endType[_this._curLoop._endCnt] = _LOOP_END_TYPE_WHILE;
			_this._curLoop._endCnt++;

			line.set( _this._curLoop._newLine() );
		} else {
			_this._curLoop._endType[_this._curLoop._endCnt] = _LOOP_END_TYPE_WHILE;
			_this._curLoop._endCnt++;
		}
		return _CLIP_NO_ERR;
	},
	_loopFor : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._loopType != _LOOP_TYPE_FUNC ){
			line._obj._subFlag = true;
			line._obj._line = new _Loop();
			line._obj._line._loopType   = _LOOP_TYPE_FOR;
			line._obj._line._beforeLoop = _this._curLoop;
			_this._curLoop = line._obj._line;

			_this._curLoop._endType[_this._curLoop._endCnt] = _LOOP_END_TYPE_FOR;
			_this._curLoop._endCnt++;

			line.set( _this._curLoop._newLine() );
		} else {
			_this._curLoop._endType[_this._curLoop._endCnt] = _LOOP_END_TYPE_FOR;
			_this._curLoop._endCnt++;
		}
		return _CLIP_NO_ERR;
	},
	_loopFunc : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._loopType == _LOOP_TYPE_FUNC ){
			return _CLIP_PROC_ERR_STAT_FUNC_NEST;
		}

		line._obj._subFlag = true;
		line._obj._line = new _Loop();
		line._obj._line._loopType   = _LOOP_TYPE_FUNC;
		line._obj._line._beforeLoop = _this._curLoop;
		_this._curLoop = line._obj._line;

		_this._curLoop._endType[_this._curLoop._endCnt] = _LOOP_END_TYPE_FUNC;
		_this._curLoop._endCnt++;

		line.set( _this._curLoop._newLine() );

		return _CLIP_NO_ERR;
	},
	_loopEnd : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._loopType == _LOOP_TYPE_SE ){
			beforeFlag.set( true );
		}
		return _CLIP_NO_ERR;
	},
	_loopCont : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
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
		if( _this._curLoop._endCnt > 0 ){
			_this._curLoop._endCnt--;
		}

		if( _this._curLoop._loopType == _LOOP_TYPE_WHILE ){
			beforeFlag.set( true );
		}
		return _CLIP_NO_ERR;
	},
	_loopNext : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._endCnt > 0 ){
			_this._curLoop._endCnt--;
		}

		var tmp;
		var ret;

		if( _this._curLoop._loopType == _LOOP_TYPE_FOR ){
			// for(<初期設定文>)を<初期設定文>に加工する
			tmp = _this._curLoop._top._line._token;
			tmp.del(  0 );	// "for"
			tmp.del(  0 );	// "("
			tmp.del( -1 );	// ")"

			// <条件部>をfor(<条件部>)に加工する
			if( _this._curLoop._top._next == _this._curLoop._end ){
				return _CLIP_PROC_ERR_STAT_FOR_CON;
			} else if( _this._curLoop._top._next._subFlag ){
				return _CLIP_PROC_ERR_STAT_FOR_CON;
			}
			tmp = _this._curLoop._top._next._line._token;
			if( tmp.count() > 0 ){
				tmp.insCode( 0, _CLIP_CODE_STATEMENT, _CLIP_STAT_FOR );	// "for"
				tmp.insCode( 1, _CLIP_CODE_TOP,       null           );	// "("
				tmp.addCode(    _CLIP_CODE_END,       null           );	// ")"
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
		if( _this._curLoop._endCnt > 0 ){
			_this._curLoop._endCnt--;
		}

		if( _this._curLoop._loopType == _LOOP_TYPE_FUNC ){
			beforeFlag.set( true );
		}
		return _CLIP_NO_ERR;
	},
	_loopMultiEnd : function( _this, line/*_Void*/, beforeFlag/*_Boolean*/ ){
		if( _this._curLoop._endCnt > 0 ){
			switch( _this._curLoop._endType[_this._curLoop._endCnt - 1] ){
			case _LOOP_END_TYPE_WHILE:
				return _this._loopEndWhile( _this, line, beforeFlag );
			case _LOOP_END_TYPE_FOR:
				return _this._loopNext( _this, line, beforeFlag );
			case _LOOP_END_TYPE_FUNC:
				return _this._loopEndFunc( _this, line, beforeFlag );
			}
			_this._curLoop._endCnt--;
		}
		return _CLIP_NO_ERR;
	},

	regLine : function( line ){
		var code;
		var token;
		var ret;

		var tmp = new _Void( this._curLoop._newLine() );
		var beforeFlag = new _Boolean( false );

		line._token.beginGetToken();
		if( line._token.getToken() ){
			code  = _get_code;
			token = _get_token;

			if( code == _CLIP_CODE_STATEMENT ){
				switch( token ){
				case _CLIP_STAT_IF:
					this._curLoop._endType[this._curLoop._endCnt] = _LOOP_END_TYPE_IF;
					this._curLoop._endCnt++;
					break;
				case _CLIP_STAT_ENDIF:
					if( this._curLoop._endCnt > 0 ){
						this._curLoop._endCnt--;
					}
					break;
				case _CLIP_STAT_SWITCH:
					this._curLoop._endType[this._curLoop._endCnt] = _LOOP_END_TYPE_SWITCH;
					this._curLoop._endCnt++;
					break;
				case _CLIP_STAT_ENDSWI:
					if( this._curLoop._endCnt > 0 ){
						this._curLoop._endCnt--;
					}
					break;
				}
			}

			if( (code == _CLIP_CODE_STATEMENT) && (token < _CLIP_STAT_LOOP_END) ){
				if( (ret = _loopSub[token]( this, tmp, beforeFlag )) != _CLIP_NO_ERR ){
					return ret;
				}
			}
		}

		tmp._obj._line = new __Line();
		tmp._obj._line._token = new _Token();
		line._token.dup( tmp._obj._line._token );
		tmp._obj._line._num = line._num;
		if( line._comment != null ){
			tmp._obj._line._comment = new String();
			tmp._obj._line._comment = line._comment;
		}
		tmp._obj._line._next = line._next;
		tmp._obj._subFlag = false;

		if( beforeFlag._val ){
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

var _loopSub = [
	_Loop.prototype._loopStart,
	_Loop.prototype._loopEnd,
	_Loop.prototype._loopEnd,
	_Loop.prototype._loopEnd,
	_Loop.prototype._loopEnd,
	_Loop.prototype._loopEnd,
	_Loop.prototype._loopEnd,
	_Loop.prototype._loopCont,

	_Loop.prototype._loopDo,
	_Loop.prototype._loopUntil,

	_Loop.prototype._loopWhile,
	_Loop.prototype._loopEndWhile,

	_Loop.prototype._loopFor,
	_Loop.prototype._loopFor,
	_Loop.prototype._loopNext,

	_Loop.prototype._loopFunc,
	_Loop.prototype._loopEndFunc,

	_Loop.prototype._loopMultiEnd
];
