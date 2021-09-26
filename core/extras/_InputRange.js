/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// スライダー
function _InputRange( id ){
	if( window.onInputRangeChange == undefined ) window.onInputRangeChange = function( element ){};

	this._input = document.getElementById( id );

	// マウスでの操作
	this._input.addEventListener( "mouseup", _onInputRangeChange, false );

	// キーでの操作
	this._input.addEventListener( "keyup", _onInputRangeChange, false );
}

_InputRange.prototype = {
	element : function(){
		return this._input;
	},
	value : function( value ){
		if( value != undefined ){
			this._input.value = value;
		}
		return Number( this._input.value );
	}
};

function _onInputRangeChange( event ){
	onInputRangeChange( event.target );
}
