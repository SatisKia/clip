/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

var _matrix_err = false;	// エラーが起こったかどうかのフラグ

function clearMatrixError(){
	_matrix_err = false;
}
function matrixError(){
	return _matrix_err;
}

// 行列
function _Matrix( row, col ){
	this._row = (row == undefined) ? 1 : row;	// 行数
	this._col = (col == undefined) ? 1 : col;	// 列数
	this._len = this._row * this._col;			// 行×列をあらかじめ計算した値
	this._mat = newValueArray( this._len + 1/*番人*/ );
}

_Matrix.prototype = {

	// 行列のサイズ変更
	resize : function( row, col ){
		// サイズが同じ場合、何もしない
		if( (row == this._row) && (col == this._col) ){
			return;
		}

		if( (this._len = row * col) > 0 ){
			var i, j;

			var mat = newValueArray( this._len + 1/*番人*/ );

			// 既存データをコピーする
			var m = (row < this._row) ? row : this._row;
			var n = (col < this._col) ? col : this._col;
			for( i = 0; i < m; i++ ){
				for( j = 0; j < n; j++ ){
					mat[i * col + j].ass( this._val( i, j ) );
				}
			}

			this._mat = mat;
			this._row = row;
			this._col = col;
		} else {
			// 元に戻す
			this._len = this._row * this._col;
		}
	},
	_resize : function( ini ){
		if( ini._len > this._len ){
			this._mat = newValueArray( ini._len + 1/*番人*/ );
		} else {
			// 番人
			this._mat[ini._len].ass( this._mat[this._len] );
		}
		this._row = ini._row;
		this._col = ini._col;
		this._len = ini._len;
	},
	_resize1 : function(){
		if( this._len > 1 ){
			// 番人
			this._mat[1].ass( this._mat[this._len] );

			this._row = 1;
			this._col = 1;
			this._len = 1;
		}
	},

	// 行列の拡張
	expand : function( row, col ){
		if( (row >= this._row) || (col >= this._col) ){
			this.resize(
				(row >= this._row) ? row + 1 : this._row,
				(col >= this._col) ? col + 1 : this._col
				);
		}
		return this._val( row, col );
	},

	// 値の設定
	set : function( row, col, val ){
		this.expand( row, col ).ass( val );
	},
	setReal : function( row, col, val ){
		this.expand( row, col ).setReal( val );
	},
	setImag : function( row, col, val ){
		this.expand( row, col ).setImag( val );
	},
	setNum : function( row, col, val ){
		this.expand( row, col ).setNum( val );
	},
	setDenom : function( row, col, val ){
		this.expand( row, col ).setDenom( val );
	},

	// 確認
//	row : function(){ return this._row; },
//	col : function(){ return this._col; },
//	len : function(){ return this._len; },
	mat : function( index ){
		return this._mat[(index >= this._len) ? this._len/*番人*/ : index];
	},
	val : function( row, col ){
#ifdef DEBUG
assert( (row != undefined) && (col != undefined) );
#endif // DEBUG
		return this._mat[((row >= this._row) || (col >= this._col)) ? this._len/*番人*/ : row * this._col + col];
	},
	_val : function( row, col ){
#ifdef DEBUG
assert( (row >= 0) && (row < this._row) && (col >= 0) && (col < this._col) );
#endif // DEBUG
		return this._mat[row * this._col + col];
	},

	// 型変換
	toFloat : function( row, col ){
#ifdef DEBUG
assert( (row != undefined) && (col != undefined) );
#endif // DEBUG
		return this.val( row, col ).toFloat();
	},

	// 代入
	ass : function( r ){
		if( r instanceof _Matrix ){
			if( r._len == 1 ){
				this._resize1();
				this._mat[0].ass( r._mat[0] );
			} else {
				this._resize( r );
				for( var i = 0; i < this._len; i++ ){
					this._mat[i].ass( r._mat[i] );
				}
			}
		} else {
			this._resize1();
			this._mat[0].ass( r );
		}
		return this;
	},

	// 単項マイナス
	minus : function(){
		var a = new _Matrix( this._row, this._col );
		for( var i = 0; i < this._len; i++ ){
			a._mat[i].ass( this._mat[i].minus() );
		}
		return a;
	},

	// 加算
	add : function( r ){
		if( r instanceof _Matrix ){
			if( r._len == 1 ){
				return valueToMatrix( this._mat[0].add( r._mat[0] ) );
			}
			var i, j;
			var a = new _Matrix(
				(this._row > r._row) ? this._row : r._row,
				(this._col > r._col) ? this._col : r._col
				);
			for( i = 0; i < a._row; i++ ){
				for( j = 0; j < a._col; j++ ){
					a._val( i, j ).ass( this.val( i, j ).add( r.val( i, j ) ) );
				}
			}
			return a;
		}
		return valueToMatrix( this._mat[0].add( r ) );
	},
	addAndAss : function( r ){
		if( r instanceof _Matrix ){
			if( r._len == 1 ){
				this._resize1();
				this._mat[0].addAndAss( r._mat[0] );
			} else {
				var i, j;
				this.resize(
					(this._row > r._row) ? this._row : r._row,
					(this._col > r._col) ? this._col : r._col
					);
				for( i = 0; i < this._row; i++ ){
					for( j = 0; j < this._col; j++ ){
						this._val( i, j ).addAndAss( r.val( i, j ) );
					}
				}
			}
		} else {
			this._resize1();
			this._mat[0].addAndAss( r );
		}
		return this;
	},

	// 減算
	sub : function( r ){
		if( r instanceof _Matrix ){
			if( r._len == 1 ){
				return valueToMatrix( this._mat[0].sub( r._mat[0] ) );
			}
			var i, j;
			var a = new _Matrix(
				(this._row > r._row) ? this._row : r._row,
				(this._col > r._col) ? this._col : r._col
				);
			for( i = 0; i < a._row; i++ ){
				for( j = 0; j < a._col; j++ ){
					a._val( i, j ).ass( this.val( i, j ).sub( r.val( i, j ) ) );
				}
			}
			return a;
		}
		return valueToMatrix( this._mat[0].sub( r ) );
	},
	subAndAss : function( r ){
		if( r instanceof _Matrix ){
			if( r._len == 1 ){
				this._resize1();
				this._mat[0].subAndAss( r._mat[0] );
			} else {
				var i, j;
				this.resize(
					(this._row > r._row) ? this._row : r._row,
					(this._col > r._col) ? this._col : r._col
					);
				for( i = 0; i < this._row; i++ ){
					for( j = 0; j < this._col; j++ ){
						this._val( i, j ).subAndAss( r.val( i, j ) );
					}
				}
			}
		} else {
			this._resize1();
			this._mat[0].subAndAss( r );
		}
		return this;
	},

	// 乗算
	mul : function( r ){
		if( this._len == 1 ){
			return dupMatrix( this ).mulAndAss( r );
		}
		if( r instanceof _Matrix ){
			if( r._len == 1 ){
				var a = new _Matrix( this._row, this._col );
				for( var i = 0; i < this._len; i++ ){
					a._mat[i].ass( this._mat[i].mul( r._mat[0] ) );
				}
				return a;
			}
			var i, j, k;
			var l = this._row;
			var m = (this._col > r._row) ? this._col : r._row;
			var n = r._col;
			var t = new _Value();
			var a = new _Matrix( l, n );
			for( i = 0; i < a._row; i++ ){
				for( j = 0; j < a._col; j++ ){
					t.ass( 0.0 );
					for( k = 0; k < m; k++ ){
						t.addAndAss( this.val( i, k ).mul( r.val( k, j ) ) );
					}
					a._val( i, j ).ass( t );
				}
			}
			return a;
		}
		var a = new _Matrix( this._row, this._col );
		for( var i = 0; i < this._len; i++ ){
			a._mat[i].ass( this._mat[i].mul( r ) );
		}
		return a;
	},
	mulAndAss : function( r ){
		if( r instanceof _Matrix ){
			if( this._len == 1 ){
				if( r._len == 1 ){
					this._mat[0].mulAndAss( r._mat[0] );
				} else {
					this.ass( r.mul( this._mat[0] ) );
				}
			} else {
				this.ass( this.mul( r ) );
			}
		} else {
			if( this._len == 1 ){
				this._mat[0].mulAndAss( r );
			} else {
				for( var i = 0; i < this._len; i++ ){
					this._mat[i].mulAndAss( r );
				}
			}
		}
		return this;
	},

	// 除算
	div : function( r ){
		var a = new _Matrix( this._row, this._col );
		if( r instanceof _Matrix ){
			for( var i = 0; i < this._len; i++ ){
				a._mat[i].ass( this._mat[i].div( r._mat[0] ) );
			}
		} else {
			for( var i = 0; i < this._len; i++ ){
				a._mat[i].ass( this._mat[i].div( r ) );
			}
		}
		return a;
	},
	divAndAss : function( r ){
		if( r instanceof _Matrix ){
			if( this._len == 1 ){
				this._mat[0].divAndAss( r._mat[0] );
			} else {
				for( var i = 0; i < this._len; i++ ){
					this._mat[i].divAndAss( r._mat[0] );
				}
			}
		} else {
			if( this._len == 1 ){
				this._mat[0].divAndAss( r );
			} else {
				for( var i = 0; i < this._len; i++ ){
					this._mat[i].divAndAss( r );
				}
			}
		}
		return this;
	},

	// 剰余
	mod : function( r ){
		if( r instanceof _Matrix ){
			return valueToMatrix( this._mat[0].mod( r._mat[0] ) );
		}
		return valueToMatrix( this._mat[0].mod( r ) );
	},
	modAndAss : function( r ){
		this._resize1();
		if( r instanceof _Matrix ){
			this._mat[0].modAndAss( r._mat[0] );
		} else {
			this._mat[0].modAndAss( r );
		}
		return this;
	},

	// 等値
	equal : function( r ){
		if( r instanceof _Matrix ){
			if( (this._row != r._row) || (this._col != r._col) ){
				return false;
			}
			for( var i = 0; i < this._len; i++ ){
				if( this._mat[i].notEqual( r._mat[i] ) ){
					return false;
				}
			}
			return true;
		}
		if( this._len != 1 ){
			return false;
		}
		return this._mat[0].equal( r );
	},
	notEqual : function( r ){
		if( r instanceof _Matrix ){
			if( (this._row != r._row) || (this._col != r._col) ){
				return true;
			}
			for( var i = 0; i < this._len; i++ ){
				if( this._mat[i].notEqual( r._mat[i] ) ){
					return true;
				}
			}
			return false;
		}
		if( this._len != 1 ){
			return true;
		}
		return this._mat[0].notEqual( r );
	},

	// 転置行列
	trans : function(){
		var i, j;
		var a = new _Matrix( this._col, this._row );
		for( i = 0; i < a._row; i++ ){
			for( j = 0; j < a._col; j++ ){
				a._val( i, j ).ass( this._val( j, i ) );
			}
		}
		return a;
	}

};

function deleteMatrix( x ){
	for( var i = 0; i < x._mat.length; i++ ){
		x._mat[i] = null;
	}
	x._mat = null;
}

function dupMatrix( x ){
	var a = new _Matrix( x._row, x._col );
	for( var i = 0; i < x._len; i++ ){
		a._mat[i].ass( x._mat[i] );
	}
	return a;
}

function arrayToMatrix( x ){
	var i, j;
	var row = x.length;
	var col = x[0].length;
	for( i = 1; i < row; i++ ){
		if( x[i].length < col ){
			col = x[i].length;
		}
	}
	var a = new _Matrix( row, col );
	for( i = 0; i < row; i++ ){
		for( j = 0; j < col; j++ ){
			a._val( i, j ).ass( x[i][j] );
		}
	}
	return a;
}
function valueToMatrix( x ){
	var a = new _Matrix();
	a._mat[0].ass( x );
	return a;
}
function floatToMatrix( x ){
	var a = new _Matrix();
	a._mat[0].setFloat( x );
	return a;
}

function newMatrixArray( len ){
	var a = new Array( len );
	for( var i = 0; i < len; i++ ){
		a[i] = new _Matrix();
	}
	return a;
}
