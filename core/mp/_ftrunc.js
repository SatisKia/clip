/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 小数点以下の切り捨て
_MultiPrec.prototype.ftrunc = function( rop/*Array*/, op/*Array*/ ){
	op = this.clone( op );
	var p = this.getPrec( op );
	var n = _INT( p / _MP_DIGIT );
	if( n > 0 ){
		p -= n * _MP_DIGIT;
		this._fdiv( op, n );
	}
	var k = new Array();
	this._fcoef( k, p );
	this.div( rop, op, k );
};
