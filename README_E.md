# clip.js

It is an engine for calculation processing in the CLIP language.

For the CLIP language, see test/core/htdocs/language_e.html.

## core/clip.js, core/clip.debug.js

Contains all source content except the core/extras folder.

## How to build

Please set the environment variable "AJAXMINPATH" in advance.

When build_clip.bat is executed, clip.js and clip.debug.js will be generated under the core folder.

The following tools are required separately for building.

### MinGW

Used as a UTF-8 compatible C preprocessor.

### Microsoft Ajax Minifier

A tool for compressing and obfuscating JavaScript code.

## Test

### test/math

Numerical calculation test program.

### test/core

CLIP interpreter. Please set the environment variable "SKCOMMONPATH" in advance to build.

## core/extras

A group of utility files that can be embedded in HTML with script tags.

## core/extras/easyclip.js, core/extras/easyclip.debug.js

It provides the ability to easily run the CLIP engine from JavaScript.

It contains the following objects:
- _Canvas (core/extras/_Canvas.js)
- _EasyCanvas (core/extras/_EasyCanvas.js)
- _EasyClip (core/extras/_EasyClip.js)
- _StringUtil (core/extras/_StringUtil.js)

_EasyClip object usage sample core/extras/test.html, core/extras/test2.html, and core/extras/test3.html are placed.

### Overwriting variables / functions

```javascript
/*
 * For _EasyClip
 */

window.loopMax = 65536; // Maximum number of loops

// for getArrayTokenString function
window.arrayTokenStringSpace = "&nbsp;";
window.arrayTokenStringBreak = "<br>";

/*
 * For _Proc
 */

window.assertProc = function( num, func ){
    // Returns true if processing is stopped when assertion fails
    return false;
};
window.errorProc = function( err, num, func, token ){
    // The following is an example of generating a string
    var str = (((err & _CLIP_PROC_WARN) != 0) ? "warning:" : "error:") + intToString( err, 16, 4 ) + " line:" + num;
};

window.printAnsMatrix = function( param, array/*_Token*/ ){
    // The following is an example of generating a string
    var str = curClip().getArrayTokenString( param, array, 0 );
};
window.printAnsComplex = function( real, imag ){
    // The following is an example of generating a string
    var str = real + imag;
};
window.printWarn = function( warn, num, func ){
    // The following is an example of generating a string
    var str = "warning: ";
    if( (func != null) && (func.length > 0) ){
        str += func + ": ";
    }
    if( num > 0 ){
        str += "line:" + num + " ";
    }
    str += warn;
};
window.printError = function( error, num, func ){
    // The following is an example of generating a string
    var str = "error: ";
    if( (func != null) && (func.length > 0) ){
        str += func + ": ";
    }
    if( num > 0 ){
        str += "line:" + num + " ";
    }
    str += error;
};

window.doCommandClear = function(){
    // Function called when command :clear is executed
};
window.doCommandPrint = function( topPrint, flag ){
    // Functions called when the commands :print / :println are executed
    // When command :print, false is passed to flag, and when command :println, true is passed to flag.
    // The following is an example of generating a string
    var str = "";
    var cur = topPrint;
    while( cur != null ){
        if( cur.string() != null ){
            var tmp = new _String( cur.string() );
            tmp.escape().replaceNewLine( "<br>" );
            str += tmp.str();
        }
        cur = cur.next();
    }
    if( flag ){
        str += "<br>";
    }
};
window.doCommandScan = function( topScan, proc, param ){
    // Function called when command :scan is executed
    // The following is an example of displaying the character input dialog
    var defString = new String();
    var newString = new String();
    var cur = topScan;
    while( cur != null ){
        defString = cur.getDefString( proc, param );
        newString = prompt( cur.title(), defString );
        if( (newString == null) || (newString.length == 0) ){
            newString = defString;
        }
        cur.setNewValue( newString, proc, param );
        cur = cur.next();
    }
};
window.doCommandGWorld = function( width, height ){
    // Function called when command :gworld is executed
};
```

When operating the _EasyClip object inside the overwrite function, get the _EasyClip object as follows.

```javascript
var clip = curClip();
```

When manipulating the _Canvas object inside the overwrite function, get the _Canvas object as follows.

```javascript
var canvas = curCanvas();
```

### Object construction

```javascript
var clip = new _EasyClip();
```

### Set a value for a variable

```javascript
clip.setValue( 'a', 12.345 ); // @a in CLIP
clip.setComplex( 'b', 12.3, 4.5 ); // @b in CLIP
clip.setFract( 'c', -1, 3 ); // @c in CLIP
```

### Set values ​​in the array

```javascript
clip.setVector( 'a', [1,2,3,4,5,6] ); // @@a{1 2 3 4 5 6}
clip.setComplexVector( 'b', [1,0,2], [0,1,1] ); // @@b{1 i 2\+i}
clip.setFractVector( 'c', [1,-1], [3,3] );
clip.setMatrix( 'd', [[1,2,3],[4,5,6],[7,8,9]] ); // @@d{{1 2 3}{4 5 6}{7 8 9}}
clip.setComplexMatrix( 'e', [[3,2],[2,5]], [[0,1],[-1,0]] ); // @@e{{3 2\+i}{2\-i 5}}
clip.setFractMatrix( 'f', [[1,-1],[-2,2]], [[3,3],[3,3]] );
clip.setMatrix( 'g', matrix/*_Matrix*/ );
clip.setArrayValue( 'h', [0, 0], 12 ); // @@h 0 0
clip.setArrayValue( 'h', [0, 1], 34 ); // @@h 0 1
clip.setArrayValue( 'h', [1, 0], 56 ); // @@h 1 0
clip.setArrayValue( 'h', [1, 1], 78 ); // @@h 1 1
clip.setArrayComplex( 'i', [0], 12.3, 4.5 ); // @@i 0
clip.setArrayFract( 'j', [2], 3, 7 ); // @@j 2
clip.setString( 's', "Hello World!!" );
```

### Check the value of the variable

```javascript
var value = clip.getValue( 'a' ).toFloat();
var value = clip.getValue( 'b' ).real();
var value = clip.getValue( 'b' ).imag();
var isMinus = clip.getValue( 'c' ).fractMinus();
var value = clip.getValue( 'c' ).num();
var value = clip.getValue( 'c' ).denom();
var string = clip.getComplexString( 'b' );
var string = clip.getFractString( 'c', false ); // Improper
var string = clip.getFractString( 'c', true ); // Mixed
```

Since the return value of the getValue function is a _Value object, you can use functions other than the toFloat, real, imag, fractMinus, num, and denom functions.

### Check the values ​​in the array

```javascript
var array = clip.getArray( 'a' ); // Forcibly convert to JavaScript Array
var array = clip.getArray( 'a', 1 ); // One-dimensional element
var array = clip.getArray( 'a', 2 ); // Two-dimensional element
var array = clip.getArray( 'a', N ); // N-dimensional element
var string = "@@d = " + clip.getArrayString( 'd', 6 );
var string = clip.getString( 's' );
```

You can also convert it to a string by passing the Array object obtained by the getArray function to JSON.stringify.

### Check the value of the calculation result

```javascript
var value = clip.getAnsValue().toFloat();
var value = clip.getAnsValue().real();
var value = clip.getAnsValue().imag();
var isMinus = clip.getAnsValue().fractMinus();
var value = clip.getAnsValue().num();
var value = clip.getAnsValue().denom();
var matrix = clip.getAnsMatrix(); // _Matrix object
var string = "Ans = " + clip.getAnsMatrixString( 6 );
```

Since the return value of the getAnsValue function is a _Value object, you can use functions other than the toFloat, real, imag, fractMinus, num, and denom functions.

### various settings

A group of functions that execute CLIP setting commands directly from JavaScript.

**Type specification**

```javascript
clip.setMode( mode );
```

| mode | meaning |
| --- | --- |
| _CLIP_MODE_E_FLOAT | Double precision floating point type (exponential notation) |
| _CLIP_MODE_F_FLOAT | Double precision floating point type (decimal point notation) |
| _CLIP_MODE_G_FLOAT | Double precision floating point type |
| _CLIP_MODE_E_COMPLEX | Complex type (exponential notation) |
| _CLIP_MODE_F_COMPLEX | Complex type (decimal point notation) |
| _CLIP_MODE_G_COMPLEX | Complex type |
| _CLIP_MODE_I_FRACT | Fractional type |
| _CLIP_MODE_M_FRACT | Band Fractional Type |
| _CLIP_MODE_H_TIME | Time type (hour) |
| _CLIP_MODE_M_TIME | Time type (minutes) |
| _CLIP_MODE_S_TIME | Time type (seconds) |
| _CLIP_MODE_F_TIME | Time type (frame) |
| _CLIP_MODE_S_CHAR | Signed 8-bit integer type |
| _CLIP_MODE_U_CHAR | Unsigned 8-bit integer type |
| _CLIP_MODE_S_SHORT | Signed 16-bit integer type |
| _CLIP_MODE_U_SHORT | Unsigned 16-bit integer type |
| _CLIP_MODE_S_LONG | Signed 32-bit integer type |
| _CLIP_MODE_U_LONG | Unsigned 32-bit integer type |

Immediately after building the _EasyClip object: _CLIP_MODE_G_FLOAT

**Floating point display accuracy** (:prec command in CLIP)

```javascript
clip.setPrec( prec );
```

Immediately after building the _EasyClip object: 6

**Frames per second** (:fps command in CLIP)

```javascript
clip.setFps( fps );
```

Immediately after building the _EasyClip object: 30.0

**Radix in integer** (:radix command in CLIP)

```javascript
clip.setRadix( radix );
```

Immediately after building the _EasyClip object: 10

**Angle unit specification**

```javascript
clip.setAngType( type );
```

| type | meaning |
| --- | --- |
| _ANG_TYPE_RAD | Radian |
| _ANG_TYPE_DEG | Degree |
| _ANG_TYPE_GRAD | Grazian |

Immediately after building the _EasyClip object: _ANG_TYPE_RAD

**Calculator mode specification** (:calculator command in CLIP)

```javascript
clip.setCalculator( flag );
```

Immediately after building the _EasyClip object: false

**Specify the lower limit of array subscripts** (:base command in CLIP)

```javascript
clip.setBase( base );
```

| base | meaning |
| --- | --- |
| 0 | 0 Origin |
| 1 | 1 origin |

Immediately after building the _EasyClip object: 0

**Specify whether to return the calculation result** (:ans command in CLIP)

```javascript
clip.setAnsFlag( flag );
```

Immediately after building the _EasyClip object: false

**Specify whether diagnostic message is valid** (:assert command in CLIP)

```javascript
clip.setAssertFlag( flag );
```

Immediately after building the _EasyClip object: false

**Specify whether the warning message is valid** (:warn command in CLIP)

```javascript
clip.setWarnFlag( flag );
```

_EasyClip Immediately after object construction: true

### Command

We provide a function that executes some CLIP commands directly from JavaScript.

```javascript
clip.commandGWorld( width, height );
```

```javascript
clip.commandWindow( left, bottom, right, top );
```

```javascript
clip.commandGClear( index );
```

```javascript
clip.commandGColor( index );
```

```javascript
clip.commandGPut( array/*Array*/ );
```

```javascript
clip.commandGPut24( array/*Array*/ );
```

```javascript
var array = clip.commandGGet(); // null if could not be obtained
```

```javascript
var array = clip.commandGGet24(); // null if could not be obtained
```

### Calculation

```javascript
var ret = clip.procLine( line/*String*/ ); // Returns _CLIP_PROC_END on successful completion
```

```javascript
var ret = clip.procScript( script/*Array*/ ); // Returns _CLIP_PROC_END upon normal completion
```

### Color palette

```javascript
clip.newPalette();
```

```javascript
clip.setPalette( bgrColorArray );
```

```javascript
// Below is an example of setting a grayscale palette
var bgrColor;
for( var i = 0; i < 256; i++ ){
    bgrColor = (i << 16) + (i << 8) + i;
    clip.setPaletteColor( i, bgrColor );
}
```

```javascript
var bgrColor = clip.paletteColor( index );
```

### Canvas

```javascript
var canvas = clip.setCanvas( id ); // _Canvas object is returned
```

```javascript
var canvas = clip.createCanvas( width, height ); // _Canvas object is returned
```

```javascript
clip.resizeCanvas( width, height );
```

```javascript
clip.updateCanvas();
clip.updateCanvas( scale ); // If scale is specified, the image memory in the _GWorld object will be enlarged and drawn.
```

```javascript
var canvas = clip.canvas(); // _Canvas object
```

### Build and display an image

```javascript
vvar ret = clip.createImage( script/*Array*/, id, type, encoderOptions ); // Returns _CLIP_PROC_END upon normal completion
```

ʻid` is the id of the img element

`type` is a DOMString that indicates the image format. If not specified, the default format is "image/png"

ʻencoderOptions` is the image quality of an image format that uses lossy compression, such as "image/jpeg" or "image/webp", indicated by a number between 0 and 1. The default value is 0.92

### Use the _EasyCanvas object

After building the _EasyCanvas object, CLIP graphics instructions will now be drawn directly on the canvas, eliminating the need to call the updateCanvas function.

```javascript
var easyCanvas = new _EasyCanvas();
```

```javascript
easyCanvas.setFont( canvas/*_Canvas*/, size, family );
```

### Other

- Function used to implement the printAnsMatrix function called from the _Proc object

```javascript
var string = clip.getArrayTokenString( param, array/*_Token*/, indent );
```

You can pass the parameters param and array of the printAnsMatrix function as they are.

- Get the _Proc object, which is the only computational main class that exists in the _EasyClip object.

```javascript
var proc = clip.proc();
```

- Get the _Param object, which is the only calculated parameter class that exists in the _EasyClip object.

```javascript
var param = clip.param();
```

- Get the only _GWorld object that exists inside the _EasyClip object

```javascript
var gWorld = clip.gWorld();
```
