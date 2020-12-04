// 多倍長整数同士の大小比較
// aがbよりも大きい場合は正の値、小さい場合は負の値、等しい場合はゼロの値
_MultiPrec.prototype.cmp = function( a/*Array*/, b/*Array*/ ){
	if( a[0] < 0 && b[0] >= 0 ){ return -1; }
	if( b[0] < 0 && a[0] >= 0 ){ return  1; }
	var k = (a[0] < 0 && b[0] < 0) ? -1 : 1;

	var la = this._getLen( a );
	var lb = this._getLen( b );

	var aa, bb;
	for( var i = (la > lb) ? la : lb; i > 0; i-- ){
		aa = (i <= la) ? a[i] : 0;
		bb = (i <= lb) ? b[i] : 0;
		if( aa != bb ){ return (aa - bb) * k; }
	}

	return 0;
};
