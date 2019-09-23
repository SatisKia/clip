/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

function cssGetPropertyValue( selector, property ){
	var i, j;
	var value = new String();
	var styleSheets = document.styleSheets;
	var styleSheet;
	var rules;
	var rule;
	for( i = 0; i < styleSheets.length; i++ ){
		styleSheet = styleSheets[i];
		rules = styleSheet.rules || styleSheet.cssRules;
		for( j = 0; j < rules.length; j++ ){
			rule = rules[j];
			if( rule.selectorText == selector ){
				value = rule.style.getPropertyValue( property );
				// 最後まで検索して新しい設定を有効にするため、break しない
			}
		}
	}
	return value;
}

function cssSetPropertyValue( selector, property, value ){
	var i, j;
	var styleSheets = document.styleSheets;
	var styleSheet;
	var rules;
	var rule;
	for( i = 0; i < styleSheets.length; i++ ){
		styleSheet = styleSheets[i];
		rules = styleSheet.rules || styleSheet.cssRules;
		for( j = 0; j < rules.length; j++ ){
			rule = rules[j];
			if( rule.selectorText == selector ){
				rule.style.setProperty( property, value );
				// 最後まで検索して全て更新するため、break しない
			}
		}
	}
}

var _css_display_none  = null;
var _css_display_block = null;

function cssLockStyleDisplay(){
	_css_display_none  = new Array();
	_css_display_block = new Array();
}

function cssSetStyleDisplay( element, flag ){
	if( _css_display_none == null ){
		element.style.display = flag ? "block" : "none";
	} else if( flag ){
		_css_display_block[_css_display_block.length] = element;
	} else {
		_css_display_none[_css_display_none.length] = element;
	}
}
function cssSetStyleDisplayById( id, flag ){
	cssSetStyleDisplay( document.getElementById( id ), flag );
}

function cssUnlockStyleDisplay(){
	var i;
	for( i = 0; i < _css_display_none.length; i++ ){
		_css_display_none[i].style.display = "none";
	}
	for( i = 0; i < _css_display_block.length; i++ ){
		_css_display_block[i].style.display = "block";
	}
	_css_display_none  = null;
	_css_display_block = null;
}
