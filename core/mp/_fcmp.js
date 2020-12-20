/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 多倍長浮動小数点数同士の大小比較
// aがbよりも大きい場合は正の値、小さい場合は負の値、等しい場合はゼロの値
_MultiPrec.prototype.fcmp = function( a/*Array*/, b/*Array*/ ){
	a = this._clone( a );
	b = this._clone( b );
	this._matchPrec( a, b );
	return this.cmp( a, b );
};
