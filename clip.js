(function( window, undefined ){

var document = window.document;

#ifdef MINIFIED
#include "tmp\clip\string.js"
#include "tmp\clip\core.js"	// 重要：function.jsの前に行うこと！
#include "tmp\clip\function.js"
#else
#include "tmp\clip\core.debug.js"	// 重要：function.debug.jsの前に行うこと！
#include "tmp\clip\function.debug.js"
#endif // MINIFIED

#include "tmp\clip\global.js"
#include "tmp\clip\math.js"

})( window );
