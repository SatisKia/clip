(function( window, undefined ){

var document = window.document;

#ifdef MINIFIED
#include "tmp\string.js"
#include "tmp\core.js"	// 重要：function.jsの前に行うこと！
#include "tmp\function.js"
#else
#include "tmp\core.debug.js"	// 重要：function.debug.jsの前に行うこと！
#include "tmp\function.debug.js"
#endif // MINIFIED

#include "tmp\global.js"
#include "tmp\math.js"

})( window );
