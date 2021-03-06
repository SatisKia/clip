/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 絶対値
_MultiPrec.prototype.abs = function( rop/*Array*/, op/*Array*/ ){
	if( op == undefined ){	// パラメータが1つの場合
		rop[0] = _ABS( rop[0] );
		return;
	}

	this._copy( op, 1, rop, 1, this.getLen( op ) );
	rop[0] = _ABS( op[0] );
};
