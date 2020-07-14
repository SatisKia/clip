/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 変数管理クラス
function _Variable(){
	this._label = new _Label( this );

	this._var  = newValueArray( 256 );
	this._lock = new Array( 256 );

	for( var i = 0; i < 256; i++ ){
		this._lock[i] = false;
	}
}

_Variable.prototype = {

//	label : function(){ return this._label; },

	// 動的変数を定義する
	define : function( label, value, lockFlag ){
		var index;
		if( (index = this._label.define( label )) >= 0 ){
			// 値を代入する
			this.set( index, value, false );
			if( lockFlag ){
				this.lock( index );
			}
		}
		return index;
	},

	// 定義を削除する
	undef : function( label ){
		var index;
		if( (index = this._label.undef( label )) >= 0 ){
			// 値を初期化する
			this.unlock( index );
			this.set( index, 0.0, false );
		}
		return index;
	},

	move : function( index ){
		if( this._label.flag( index ) == _LABEL_MOVABLE ){
			// 動的変数の実体を移す
			this.define( this._label._label[index], this.val( index ), this.isLocked( index ) );
			this.unlock( index );

			this._label.setLabel( index, null, false );
		}
		this._label.setFlag( index, _LABEL_USED );
	},

	// 値を代入する
	set : function( index, value, moveFlag ){
#ifdef DEBUG
assert( index != 0 );
#endif // DEBUG
		if( this.isLocked( index ) ){
			return false;
		}
		if( moveFlag ){
			this.move( index );
		}
		this._var[index].ass( value );
		return true;
	},
	setReal : function( index, value, moveFlag ){
#ifdef DEBUG
assert( index != 0 );
#endif // DEBUG
		if( this.isLocked( index ) ){
			return false;
		}
		if( moveFlag ){
			this.move( index );
		}
		this._var[index].setReal( value );
		return true;
	},
	setImag : function( index, value, moveFlag ){
#ifdef DEBUG
assert( index != 0 );
#endif // DEBUG
		if( this.isLocked( index ) ){
			return false;
		}
		if( moveFlag ){
			this.move( index );
		}
		this._var[index].setImag( value );
		return true;
	},
	fractSetMinus : function( index, isMinus, moveFlag ){
#ifdef DEBUG
assert( index != 0 );
#endif // DEBUG
		if( this.isLocked( index ) ){
			return false;
		}
		if( moveFlag ){
			this.move( index );
		}
		this._var[index].fractSetMinus( isMinus );
		return true;
	},
	setNum : function( index, value, moveFlag ){
#ifdef DEBUG
assert( index != 0 );
#endif // DEBUG
		if( this.isLocked( index ) ){
			return false;
		}
		if( moveFlag ){
			this.move( index );
		}
		this._var[index].setNum( value );
		return true;
	},
	setDenom : function( index, value, moveFlag ){
#ifdef DEBUG
assert( index != 0 );
#endif // DEBUG
		if( this.isLocked( index ) ){
			return false;
		}
		if( moveFlag ){
			this.move( index );
		}
		this._var[index].setDenom( value );
		return true;
	},
	fractReduce : function( index, moveFlag ){
#ifdef DEBUG
assert( index != 0 );
#endif // DEBUG
		if( this.isLocked( index ) ){
			return false;
		}
		if( moveFlag ){
			this.move( index );
		}
		this._var[index].fractReduce();
		return true;
	},

	// 値を確認する
	val : function( index ){
#ifdef DEBUG
assert( index != 0 );
#endif // DEBUG
		return this._var[index];
	},

	// ロックする
	lock : function( index ){
		this._lock[index] = true;
	},
	unlock : function( index ){
		this._lock[index] = false;
	},

	// ロックされているかどうか確認する
	isLocked : function( index ){
		return this._lock[index];
	}

};
