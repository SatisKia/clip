/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Global.h"

// 空白文字かどうかチェック
function isCharSpace( str, index ){
	return ((str.charAt( index ) == ' ') || (str.charCodeAt( index ) == _CHAR_CODE_SPACE));
}

// 改行文字かどうかチェック
function isCharEnter( str, index ){
	var chr = str.charAt( index );
	return ((chr == '\r') || (chr == '\n'));
}

// エスケープ文字かどうかチェック
function isCharEscape( str, index ){
	var chr = str.charAt( index );
	return ((chr == '\\') || (chr == _CHAR_UTF8_YEN));
}
