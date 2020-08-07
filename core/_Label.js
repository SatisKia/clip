/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// ラベル管理クラス
function _Label( obj ){
	this._obj = obj;

	this._label = new Array( 256 );
	this._flag  = new Array( 256 );

	for( var i = 0; i < 256; i++ ){
		this._label[i] = null;
		this._flag [i] = _LABEL_UNUSED;
	}

	this._index = {};
}

_Label.prototype = {

	// 未使用インデックスを検索し、使用状態にする
	define : function( label ){
		if( label != null ){
			for( var i = 255; i >= 0; i-- ){
				if( this._flag[i] == _LABEL_UNUSED ){
					this._flag[i] = _LABEL_MOVABLE;
					this.setLabel( i, label, false );
					return i;
				}
			}
		}
		return -1;
	},

	// ラベルを検索し、未使用状態にする
	undef : function( label ){
		var index;
		if( (index = this.checkLabel( label )) >= 0 ){
			this.setLabel( index, null, false );
			this._flag[index] = _LABEL_UNUSED;
		}
		return index;
	},

	// ラベルを設定する
	setLabel : function( index, label, moveFlag ){
		if( this.moveFlag ){
			this._obj.move( index );
		}

		if( this._label[index] != null ){
			if( this._index[this._label[index]] == index ){
				delete this._index[this._label[index]];
			}
			this._label[index] = null;
		}
		if( label != null ){
			if( label.length > 0 ){
				this._label[index] = label;
				this._index[label] = index;
			}
		}
	},

	// ラベルを確認する
//	label : function( index ){ return this._label[index]; },

//	setFlag : function( index, flag ){
//		this._flag[index] = flag;
//	},
//	flag : function( index ){
//		return this._flag[index];
//	},

	// ラベルを検索する
	checkLabel : function( label ){
//		for( var i = 0; i < 256; i++ ){
//			if( this._label[i] != null ){
//				if( this._label[i] == label ){
//					return i;
//				}
//			}
//		}
		if( label in this._index ){
			return this._index[label];
		}
		return -1;
	}

};
