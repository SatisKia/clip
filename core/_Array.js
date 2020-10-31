/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Global.h"

// ノード・クラス
function __ArrayNode(){
	this._node    = null;					// 子ノード
	this._nodeNum = 0;						// 子ノードの数

	this._vector    = newValueArray( 1 );	// このノードの要素
	this._vectorNum = 0;					// このノードの要素数
}

__ArrayNode.prototype = {

//	node : function( index ){ return this._node[index]; },
//	nodeNum : function(){ return this._nodeNum; },

//	vector : function( index ){ return this._vector[index]; },
//	vectorNum : function(){ return this._vectorNum; },

	// ノードをコピーする
	dup : function( dst/*__ArrayNode*/ ){
		var i;

		if( this._nodeNum > 0 ){
			dst._node    = _newArrayNodeArray( this._nodeNum );
			dst._nodeNum = this._nodeNum;
			for( i = 0; i < this._nodeNum; i++ ){
				this._node[i].dup( dst._node[i] );
			}
		} else {
			dst._node    = null;
			dst._nodeNum = 0;
		}

		if( this._vectorNum > 0 ){
//			dst._vector = newValueArray( this._vectorNum + 1 );
			for( i = this._vectorNum; i >= dst._vectorNum; i-- ){
				dst._vector[i] = new _Value();
			}
			dst._vectorNum = this._vectorNum;
			for( i = 0; i < this._vectorNum; i++ ){
				copyValue( dst._vector[i], this._vector[i] );
			}
		} else {
			dst._vector    = newValueArray( 1 );
			dst._vectorNum = 0;
		}
	},

	// ノード構造からトークンを構築する
	makeToken : function( dst/*_Token*/, flag ){
		var i;

		if( this._nodeNum > 0 ){
			dst.addCode( _CLIP_CODE_ARRAY_TOP, null );
			for( i = 0; i < this._nodeNum; i++ ){
				this._node[i].makeToken( dst, true );
			}
			dst.addCode( _CLIP_CODE_ARRAY_END, null );
		}

		if( this._vectorNum > 0 ){
			dst.addCode( _CLIP_CODE_ARRAY_TOP, null );
			for( i = 0; i < this._vectorNum; i++ ){
				dst.addValue( this._vector[i] );
			}
			dst.addCode( _CLIP_CODE_ARRAY_END, null );
		}

		if( flag && (this._nodeNum == 0) && (this._vectorNum == 0) ){
			dst.addCode( _CLIP_CODE_ARRAY_TOP, null );
			dst.addCode( _CLIP_CODE_ARRAY_END, null );
		}
	},

	// 値を代入する
	_newVector : function( index ){
		if( this._vectorNum == 0 ){
			this._vector = newValueArray( index + 2 );
		} else {
#if 0
			var tmp = newValueArray( index + 2 );

			// 既存の配列をコピーする
			for( var i = 0; i < this._vectorNum; i++ ){
//				copyValue( tmp[i], this._vector[i] );
				tmp[i] = this._vector[i];
			}

			this._vector = tmp;
#endif
			for( var i = index + 1; i >= this._vectorNum; i-- ){
				this._vector[i] = new _Value();
			}
		}

		this._vectorNum = index + 1;
	},
	_resizeVector : function( index ){
		// 番人
//		copyValue( this._vector[index + 1], this._vector[this._vectorNum] );
		this._vector[index + 1] = new _Value();

		this._vectorNum = index + 1;
	},
	_newNode : function( index ){
		if( this._nodeNum == 0 ){
			this._node = _newArrayNodeArray( index + 1 );
		} else {
#if 0
			var tmp = _newArrayNodeArray( index + 1 );

			// 既存の配列をコピーする
			for( var i = 0; i < this._nodeNum; i++ ){
//				this._node[i].dup( tmp[i] );
				tmp[i] = this._node[i];
			}

			this._node = tmp;
#endif
			for( var i = index; i >= this._nodeNum; i-- ){
				this._node[i] = new __ArrayNode();
			}
		}

		this._nodeNum = index + 1;
	},
	_resizeNode : function( index ){
		this._nodeNum = index + 1;
	},
	_copyArray : function( src, i ){
		var dst = new Array( src.length - i );
		for( var j = 0; j < dst.length; j++ ){
			dst[j] = src[i + j];
		}
		return dst;
	},
	set : function( index, value ){
		if( index instanceof Array ){
			if( index[1] < 0 ){	// 負数でターミネートされた要素番号配列
				this.set( index[0], value );
			} else if( (index[0] >= 0) && (index[0] != _INVALID_ARRAY_INDEX) ){
				if( index[0] >= this._nodeNum ){
					this._newNode( index[0] );
				}
				this._node[index[0]].set( this._copyArray( index, 1 ), value );
			}
		} else if( (index >= 0) && (index != _INVALID_ARRAY_INDEX) ){
			if( index >= this._vectorNum ){
				this._newVector( index );
			}
			this._vector[index].ass( value );
		}
	},
	resize : function( index, value ){
		if( index instanceof Array ){
			if( index[1] < 0 ){	// 負数でターミネートされた要素番号配列
				this.resize( index[0], value );
			} else if( (index[0] >= 0) && (index[0] != _INVALID_ARRAY_INDEX) ){
				if( index[0] >= this._nodeNum ){
					this._newNode( index[0] );
				} else {
					this._resizeNode( index[0] );
				}
				this._node[index[0]].set( this._copyArray( index, 1 ), value );
			}
		} else if( (index >= 0) && (index != _INVALID_ARRAY_INDEX) ){
			if( index >= this._vectorNum ){
				this._newVector( index );
			} else {
				this._resizeVector( index );
			}
			this._vector[index].ass( value );
		}
	},
	setVector : function( value, num ){
		if( num > this._vectorNum ){
			this._newVector( num - 1 );
		} else {
			this._resizeVector( num - 1 );
		}

		for( var i = 0; i < num; i++ ){
			this._vector[i].ass( value[i] );
		}
	},
	setComplexVector : function( real, imag, num ){
		if( num > this._vectorNum ){
			this._newVector( num - 1 );
		} else {
			this._resizeVector( num - 1 );
		}

		for( var i = 0; i < num; i++ ){
			this._vector[i].setReal( real[i] );
			this._vector[i].setImag( imag[i] );
		}
	},
	setFractVector : function( value, denom, num ){
		if( num > this._vectorNum ){
			this._newVector( num - 1 );
		} else {
			this._resizeVector( num - 1 );
		}

		var nu;
		for( var i = 0; i < num; i++ ){
			nu = value[i];
			if( nu < 0 ){
				this._vector[i].fractSetMinus( true );
				nu = -nu;
			} else {
				this._vector[i].fractSetMinus( false );
			}
			this._vector[i].setNum( nu );
			this._vector[i].setDenom( denom[i] );
		}
	},

	// 値を確認する
	val : function( index ){
		if( index instanceof Array ){
			if( index[1] < 0 ){	// 負数でターミネートされた要素番号配列
				return this.val( index[0] );
			}
			if( index[0] < this._nodeNum ){
				return this._node[index[0]].val( this._copyArray( index, 1 ) );
			}
			return this._vector[this._vectorNum];	// 番人
		}
		return this._vector[(index < this._vectorNum) ? index : this._vectorNum/*番人*/];
	}

};

function _newArrayNodeArray( len ){
	var a = new Array( len );
	for( var i = 0; i < len; i++ ){
		a[i] = new __ArrayNode();
	}
	return a;
}

// 配列管理クラス
function _Array(){
	this._label = new _Label( this );

	this._node = _newArrayNodeArray( 256 );
	this._mat  = newMatrixArray    ( 256 );
}

_Array.prototype = {

//	label : function(){ return this._label; },

//	node : function( index ){ return this._node[index]; },
//	matrix : function( index ){ return this._mat[index]; },

	// 未使用インデックスを検索し、使用状態にする
	define : function( label ){
		var index;
		if( (index = this._label.define( label )) >= 0 ){
			// 値を初期化する
			this._node[index] = new __ArrayNode();
			this._mat [index] = new _Matrix();
		}
		return index;
	},

	_moveData : function( index ){
		var newIndex;

		// 動的配列の実体を移す
		if( (newIndex = this._label.define( this._label._label[index] )) >= 0 ){
			this.dup( this, index, newIndex, false );
		}
	},
	move : function( index ){
		if( this._label._flag[index] == _LABEL_MOVABLE ){
			this._moveData( index );
			this._label.setLabel( index, null, false );
		}
		this._label._flag[index] = _LABEL_USED;
	},

	// 値を代入する
	set : function( index, subIndex, dim, value, moveFlag ){
		if( moveFlag ){
			this.move( index );
		}
		if( dim == 1 ){
			this._node[index].set( subIndex[0], value );
		} else if( dim == 2 ){
			if(
				(subIndex[0] < 0) || (subIndex[0] == _INVALID_ARRAY_INDEX) ||
				(subIndex[1] < 0) || (subIndex[1] == _INVALID_ARRAY_INDEX)
			){
				return;
			}
			this._mat[index].set( subIndex[0], subIndex[1], value );
		} else {
			this._node[index].set( subIndex, value );
		}
	},
	setVector : function( index, value, num, moveFlag ){
		if( moveFlag ){
			this.move( index );
		}
		this._node[index].setVector( value, num );
	},
	setComplexVector : function( index, real, imag, num, moveFlag ){
		if( moveFlag ){
			this.move( index );
		}
		this._node[index].setComplexVector( real, imag, num );
	},
	setFractVector : function( index, value, denom, num, moveFlag ){
		if( moveFlag ){
			this.move( index );
		}
		this._node[index].setFractVector( value, denom, num );
	},
	setMatrix : function( index, src, moveFlag ){
		if( moveFlag ){
			this.move( index );
		}
		this._mat[index].ass( src );
	},
	setComplexMatrix : function( index, real, imag, moveFlag ){
		if( real._len == imag._len ){
			var src = new _Matrix( real._row, real._col );
			for( var i = 0; i < real._len; i++ ){
				src._mat[i].setReal( real._mat[i].toFloat() );
				src._mat[i].setImag( imag._mat[i].toFloat() );
			}
			if( moveFlag ){
				this.move( index );
			}
			this._mat[index].ass( src );
		}
	},
	setFractMatrix : function( index, value, denom, moveFlag ){
		if( value._len == denom._len ){
			var src = new _Matrix( value._row, value._col );
			var nu;
			for( var i = 0; i < value._len; i++ ){
				nu = value._mat[i].toFloat();
				if( nu < 0 ){
					src._mat[i].fractSetMinus( true );
					nu = -nu;
				} else {
					src._mat[i].fractSetMinus( false );
				}
				src._mat[i].setNum( nu );
				src._mat[i].setDenom( denom._mat[i].toFloat() );
			}
			if( moveFlag ){
				this.move( index );
			}
			this._mat[index].ass( src );
		}
	},
	resize : function( index, resIndex, subIndex, dim, value, moveFlag ){
		if( moveFlag ){
			this.move( index );
		}
		if( dim == 1 ){
			this._node[index].resize( subIndex[0], value );
		} else if( dim == 2 ){
			this._mat[index].resize( resIndex[0] + 1, resIndex[1] + 1 );
			this._mat[index].set( subIndex[0], subIndex[1], value );
		} else {
			this._node[index].resize( subIndex, value );
		}
	},
	resizeVector : function( index, subIndex, value, moveFlag ){
		if( moveFlag ){
			this.move( index );
		}
		this._node[index].resize( subIndex, value );
	},

	// 値を確認する
	val : function( index, subIndex, dim ){
		if( dim != undefined ){
			if( dim == 1 ){
				return this._node[index].val( subIndex[0] );
			} else if( dim == 2 ){
				return this._mat[index].val(
					((subIndex[0] < 0) || (subIndex[0] == _INVALID_ARRAY_INDEX)) ? this._mat[index]._row : subIndex[0],
					((subIndex[1] < 0) || (subIndex[1] == _INVALID_ARRAY_INDEX)) ? this._mat[index]._col : subIndex[1]
					);
			}
		}
		return this._node[index].val( subIndex );
	},

	// 配列をコピーする
	dup : function( dst/*_Array*/, srcIndex, dstIndex, moveFlag ){
		if( moveFlag ){
			dst.move( dstIndex );
		}
		this._node[srcIndex].dup( dst._node[dstIndex] );
		dst._mat[dstIndex].ass( this._mat[srcIndex] );
	},

	// 配列を置き換える
	rep : function( dst/*_Array*/, srcIndex, dstIndex, moveFlag ){
		if( moveFlag ){
			dst.move( dstIndex );
		}
		dst._node[dstIndex] = this._node[srcIndex];
		dst._mat[dstIndex] = this._mat[srcIndex];
	},

	// 配列からトークンを構築する
	makeToken : function( dst/*_Token*/, srcIndex ){
		var row, col;

		dst.delAll();

		if( (this._mat[srcIndex]._len > 1) || this._mat[srcIndex]._mat[0].notEqual( 0.0 ) ){
			dst.addCode( _CLIP_CODE_ARRAY_TOP, null );
			for( row = 0; row < this._mat[srcIndex]._row; row++ ){
				dst.addCode( _CLIP_CODE_ARRAY_TOP, null );
				for( col = 0; col < this._mat[srcIndex]._col; col++ ){
					dst.addValue( this._mat[srcIndex].val( row, col ) );
				}
				dst.addCode( _CLIP_CODE_ARRAY_END, null );
			}
			dst.addCode( _CLIP_CODE_ARRAY_END, null );

			this._node[srcIndex].makeToken( dst, false );
		} else {
			this._node[srcIndex].makeToken( dst, true );
		}

		return dst;
	}

};
