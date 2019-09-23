/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

function _Preference( useStorage ){
	this.s = (useStorage && canUseStorage());
	this.c = canUseCookie();
}

// プリファレンス
_Preference.prototype = {
	num : function(){
		if( this.s ){
			return storageNum();
		} else if( this.c ){
			return cookieNum();
		}
		return 0;
	},
	getKey : function( index ){
		if( this.s ){
			return getStorageKey( index );
		} else if( this.c ){
			return getCookieKey( index );
		}
		return null;
	},
	get : function( key, defValue ){
		if( this.s ){
			return getStorage( key, defValue );
		} else if( this.c ){
			return getCookie( key, defValue );
		}
		return defValue;
	},
	set : function( key, value ){
		if( this.s ){
			setStorage( key, value );
		} else if( this.c ){
			setCookie( key, value );
		}
	},
	clear : function( prefix ){
		if( this.s ){
			clearStorage( prefix );
		} else if( this.c ){
			clearCookie( prefix );
		}
	},
	beginRead : function( key ){
		if( this.s ){
			beginStorageRead( key );
		} else if( this.c ){
			beginCookieRead( key );
		}
	},
	read : function(){
		if( this.s ){
			return storageRead();
		} else if( this.c ){
			return cookieRead();
		}
		return "";
	},
	endRead : function(){
		if( this.s ){
			endStorageRead();
		} else if( this.c ){
			endCookieRead();
		}
	},
	beginWrite : function(){
		if( this.s ){
			beginStorageWrite();
		} else if( this.c ){
			beginCookieWrite();
		}
	},
	write : function( str ){
		if( this.s ){
			storageWrite( str );
		} else if( this.c ){
			cookieWrite( str );
		}
	},
	endWrite : function( key ){
		if( this.s ){
			endStorageWrite( key );
		} else if( this.c ){
			endCookieWrite( key );
		}
	}
};
