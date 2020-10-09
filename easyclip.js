(function( window, undefined ){

var document = window.document;

#ifdef MINIFIED
#include "tmp\easyclip\string.js"
#include "tmp\easyclip\core.js"	// 重要：function.jsの前に行うこと！
#include "tmp\easyclip\function.js"
#else
#include "tmp\easyclip\core.debug.js"	// 重要：function.jsの前に行うこと！
#include "tmp\easyclip\function.js"
#endif // MINIFIED

})( window );
