(function( window, undefined ){

var document = window.document;

#ifdef MINIFIED
#include "tmp_clip\string.js"
#include "tmp_clip\core.js"	// 重要：function.jsの前に行うこと！
#include "tmp_clip\function.js"
#else
#include "tmp_clip\core.debug.js"	// 重要：function.debug.jsの前に行うこと！
#include "tmp_clip\function.debug.js"
#endif // MINIFIED

#include "tmp_clip\global.js"
#include "tmp_clip\math.js"

})( window );
