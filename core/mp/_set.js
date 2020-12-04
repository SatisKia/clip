_MultiPrec.prototype.set = function( rop/*Array*/, op/*Array*/ ){
	this._copy( op, 0, rop, 0, this._getLen( op ) + 1 );
};
