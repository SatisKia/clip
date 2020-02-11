/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Global.h"

// 行データ
function __Line(){
	this._line    = null;	// トークン・リスト
	this._num     = 0;		// 行番号
	this._comment = null;	// コメント
	this._next    = null;	// 次の行データ
}

// 行管理クラス
function _Line( num ){
	// 行リスト
	this._top = null;
	this._end = null;
	this._get = null;

	this._nextNum = (num == undefined) ? 1 : ((num > 0) ? num : 1);
}

_Line.prototype = {

	// 行を確保する
	_newLine : function(){
		var tmp = new __Line();

		if( this._top == null ){
			// 先頭に登録する
			this._top = tmp;
			this._end = tmp;
		} else {
			// 最後尾に追加する
			this._end._next = tmp;
			this._end = tmp;
		}

		tmp._num = this._nextNum;

		return tmp;
	},

	dup : function(){
		var dst = new _Line();

		var line;
		this._get = this._top;
		while( this._get != null ){
			dst.regLine( this._get );
			this._get = this._get._next;
		}

		dst._nextNum = this._nextNum;

		return dst;
	},

	// 行を登録する
	_checkEscape : function( line, top, cur ){
		cur--;
		if( cur < top ){
			return false;
		}

		var check = false;
		while( isCharEscape( line, top + cur ) ){
			check = check ? false : true;
			cur--;
			if( cur < top ){
				break;
			}
		}
		return check;
	},
	regString : function( param, line, strToVal ){
		var i;
		var ret;
		var len;
		var curLine = "";

		var tmp = this._newLine();
		tmp._line = new _Token();

		var top = 0;
		var cur = 0;

		while( top + cur < line.length ){
			if( line.charAt( top + cur ) == ';' ){
				if( !this._checkEscape( line, top, cur ) ){
					curLine = line.substr( top, cur );

					if( (ret = tmp._line.regString( param, curLine, strToVal )) != _CLIP_NO_ERR ){
						return ret;
					}

					tmp       = this._newLine();
					tmp._line = new _Token;

					top = top + cur + 1;
					cur = 0;

					continue;
				}
			} else if( line.charAt( top + cur ) == '#' ){
				if( !this._checkEscape( line, top, cur ) ){
					// コメントを登録する
					len = line.length - (top + cur + 1);
					tmp._comment = new String();
					for( i = 0; i < len; i++ ){
						var tmp2 = top + cur + 1 + i;
						if( isCharEnter( line, tmp2 ) ){
							break;
						}
						tmp._comment += line.charAt( tmp2 );
					}

					line = line.substr( top, cur );
					curLine = line;
					continue;
				}
			}
			cur++;
			curLine = line.substr( top, cur );
		}

		this._nextNum++;

		return tmp._line.regString( param, curLine, strToVal );
	},
	regLine : function( line ){
		var ret;

		var tmp = this._newLine();

		tmp._line = new _Token();
		if( (ret = line._line.dup( tmp._line )) != _CLIP_NO_ERR ){
			return ret;
		}

		if( line._num > 0 ){
			tmp._num = line._num;
			this._nextNum = tmp._num + 1;
		} else {
			this._nextNum++;
		}

		if( line._comment != null ){
			tmp._comment = line._comment;
		}

		return _CLIP_NO_ERR;
	},

	// 行を確認する
	beginGetLine : function(){
		this._get = this._top;
	},
	getLine : function(){
		if( this._get == null ){
			return null;
		}
		var line = this._get;
		this._get = this._get._next;
		return line;
	}

};
