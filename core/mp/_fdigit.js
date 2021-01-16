/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

// 整数部の桁数
_MultiPrec.prototype.fdigit = function( a/*Array*/ ){
	var l = this.getLen( a );
	if( l == 0 ){
		return 0;
	}

	var k = 10;
	var i;
	for( i = 1; i <= _MP_DIGIT; i++ ){
		if( a[l] < k ){ break; }
		k *= 10;
	}
	var d = (l - 1) * _MP_DIGIT + i;

	return d - this.getPrec( a );
};
