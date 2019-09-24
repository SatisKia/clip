/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// ユーザー定義関数情報
function _FuncInfo(){
	this._name = new String();	// 関数名
	this._cnt  = 0;
}

// ユーザー定義関数データ
function __Func(){
	this._createFlag = true;
	this._info       = new _FuncInfo();
	this._label      = new _Token();	// 引数のラベル
	this._line       = new _Line();
	this._topNum     = 1;
	this._before     = null;	// 前のユーザー定義関数データ
	this._next       = null;	// 次のユーザー定義関数データ
}

// ユーザー定義関数管理クラス
function _Func(){
	// ユーザー定義関数リスト
	this._top     = null;
	this._end     = null;

	this._funcNum = 0;		// ユーザー定義関数の個数
	this._funcMax = -1;		// ユーザー定義関数の登録可能数
}

_Func.prototype = {

	setMaxNum : function( max ){
		if( max >= 0 ){
			for( var i = this._funcNum - max; i > 0; i-- ){
				// 優先度の最も低いユーザー定義関数を削除する
				this._del();
			}
		}

		this._funcMax = max;
	},
	maxNum : function(){
		return this._funcMax;
	},

	getInfo : function( num, info/*_FuncInfo*/ ){
		var tmp = 0;
		var cur = this._top;
		while( true ){
			if( cur == null ){
				return false;
			}
			if( tmp == num ){
				break;
			}
			tmp++;
			cur = cur._next;
		}
		info._name = cur._info._name;
		info._cnt  = cur._info._cnt;
		return true;
	},

	canDel : function(){
		return (this._top != null);
	},

	_add : function(){
		var tmp = new __Func();

		if( this._top == null ){
			// 先頭に登録する
			this._top = tmp;
			this._end = tmp;
		} else {
			// 最後尾に追加する
			tmp._before     = this._end;
			this._end._next = tmp;
			this._end       = tmp;
		}

		return tmp;
	},
	_ins : function(){
		var tmp = new __Func();

		if( this._top == null ){
			// 先頭に登録する
			this._top = tmp;
			this._end = tmp;
		} else {
			// 先頭に追加する
			tmp._next         = this._top;
			this._top._before = tmp;
			this._top         = tmp;
		}

		return tmp;
	},

	create : function( name, topNum ){
		if( this._funcMax == 0 ){
			return null;
		}

		if( this._funcNum == this._funcMax ){
			// 優先度の最も低いユーザー定義関数を削除する
			this._del();
		}

		var tmp = this._ins();

		tmp._createFlag = true;
		tmp._info._name = name;
		tmp._info._cnt  = 0;
		tmp._topNum     = (topNum == undefined) ? 1 : topNum;

		this._funcNum++;

		return tmp;
	},

	open : function( srcFunc ){
		if( this._funcMax == 0 ){
			return null;
		}

		if( this._funcNum == this._funcMax ){
			// 優先度の最も低いユーザー定義関数を削除する
			this._del();
		}

		var tmp = this._ins();

		tmp._createFlag = false;
		tmp._info       = srcFunc._info;
		tmp._label      = srcFunc._label;
		tmp._line       = srcFunc._line;
		tmp._topNum     = srcFunc._topNum;

		this._funcNum++;

		return tmp;
	},
	openAll : function( src ){
		var srcFunc;
		var dstFunc;

		// 全ユーザー定義関数を削除する
		this.delAll();

		srcFunc = src._top;
		while( srcFunc != null ){
			dstFunc = this._add();

			dstFunc._createFlag = false;
			dstFunc._info       = srcFunc._info;
			dstFunc._label      = srcFunc._label;
			dstFunc._line       = srcFunc._line;
			dstFunc._topNum     = srcFunc._topNum;

			srcFunc = srcFunc._next;
		}

		this._funcNum = src._funcNum;
		this._funcMax = src._funcMax;
	},

	// ユーザー定義関数を削除する
	del : function( func ){
		// リストから切り離す
		if( func._before != null ){
			func._before._next = func._next;
		} else {
			this._top = func._next;
		}
		if( func._next != null ){
			func._next._before = func._before;
		} else {
			this._end = func._before;
		}

		this._funcNum--;
	},

	// 優先度の最も低いユーザー定義関数を削除する
	_del : function(){
		if( this._top == null ){
			return;
		}

		// 優先度の最も低いユーザー定義関数を検索する
		var tmp = this._top;
		var cur = this._top._next;
		while( cur != null ){
			if( cur._info._cnt <= tmp._info._cnt ){
				tmp = cur;
			}
			cur = cur.next;
		}

		this.del( tmp );
	},

	// 全ユーザー定義関数を削除する
	delAll : function(){
		this._top     = null;
		this._funcNum = 0;
	},

	// 関数を検索する
	search : function( name, updateCnt, nameSpace ){
		if( name.startsWith( ":" ) ){
			name = name.slice( 1 );
		} else if( (nameSpace != null) && (name.indexOf( ":" ) < 0) ){
			name = nameSpace + ":" + name;
		}
		var cur = this._top;
		while( cur != null ){
			if( name == cur._info._name ){
				if( updateCnt ){
					cur._info._cnt++;
				}
				return cur;
			}
			cur = cur._next;
		}
		return null;
	}

};