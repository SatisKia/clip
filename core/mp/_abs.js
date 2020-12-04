_MultiPrec.prototype.abs = function( rop/*Array*/, op/*Array*/ ){
	if( op == undefined ){	// パラメータが1つの場合
		rop[0] = _ABS( rop[0] );
		return;
	}

	this._copy( op, 1, rop, 1, this._getLen( op ) );
	rop[0] = _ABS( op[0] );
};
