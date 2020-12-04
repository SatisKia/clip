// 多倍長浮動小数点数同士の減算
_MultiPrec.prototype.fsub = function( ret/*Array*/, a/*Array*/, b/*Array*/ ){
	a = this._clone( a );
	b = this._clone( b );
	var p = this._matchPrec( a, b );
	this.sub( ret, a, b );
	this._setPrec( ret, p );
};
