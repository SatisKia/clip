/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 代入
_MultiPrec.prototype.set = function( rop/*Array*/, op/*Array*/ ){
	this._copy( op, 0, rop, 0, this.getLen( op ) + 1 );
};
