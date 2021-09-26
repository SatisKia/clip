/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 数値入力ボックス
function _InputNumber( id, min, max ){
	if( window.onInputNumberChange == undefined ) window.onInputNumberChange = function( element ){};

	this._input = document.getElementById( id );
	this._min = min;
	this._max = max;

	// フォーカスアウト
	this._input.addEventListener( "focusout", _onInputNumberChange, false );
}

_InputNumber.prototype = {
	element : function(){
		return this._input;
	},
	value : function( value ){
		if( value != undefined ){
			this._input.value = value;
		}
		if( this._input.value < this._min ){
			this._input.value = this._min;
		}
		if( this._input.value > this._max ){
			this._input.value = this._max;
		}
		return Number( this._input.value );
	}
};

function _onInputNumberChange( event ){
	onInputNumberChange( event.target );
}
