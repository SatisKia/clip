/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 符号反転
_MultiPrec.prototype.neg = function( rop/*Array*/, op/*Array*/ ){
	if( op == undefined ){	// パラメータが1つの場合
		rop[0] = -rop[0];
		return;
	}

	this._copy( op, 1, rop, 1, this._getLen( op ) );
	rop[0] = -op[0];
};
