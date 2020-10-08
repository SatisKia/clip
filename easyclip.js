(function( window, undefined ){

var document = window.document;

#ifdef MINIFIED
#include "tmp_easyclip\string.js"
#include "tmp_easyclip\core.js"	// 重要：function.jsの前に行うこと！
#include "tmp_easyclip\function.js"
#else
#include "tmp_easyclip\core.debug.js"	// 重要：function.jsの前に行うこと！
#include "tmp_easyclip\function.js"
#endif // MINIFIED

})( window );
