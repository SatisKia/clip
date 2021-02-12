# clip.js

[English version is here](./README_E.md)

CLIP言語による計算処理のエンジンです。

CLIP言語については、test/core/htdocs/language.htmlを参照してください。

----------

- [clip.js](#clip)
- [easyclip.js](#easyclip)
- [mp.js](#mp)

----------

## <a id="clip"> core/clip.js, core/clip.debug.js

core/extrasフォルダを除く全てのソース内容が含まれています。

## ビルド方法

事前に環境変数"AJAXMINPATH"の設定を行ってください。

build_clip.batを実行しますと、coreフォルダ下にclip.jsとclip.debug.jsが生成されます。

ビルドには別途、次のツールが必要です。

### MinGW

UTF-8対応Cプリプロセッサとして使用します。

### Microsoft Ajax Minifier

JavaScriptコードの圧縮・難読化ツールです。

## テスト

### test/math

数値計算テストプログラムです。

### test/core

CLIPインタープリタです。ビルドするには事前に環境変数"SKCOMMONPATH"の設定を行ってください。

## core/extras

HTMLにscriptタグで埋め込むことができるユーティリティ・ファイル群です。

----------

## <a id="easyclip"> core/extras/easyclip.js, core/extras/easyclip.debug.js

CLIPエンジンをJavaScriptから簡単に実行する機能を提供します。

以下のオブジェクトが含まれます。
- _Canvas（core/extras/_Canvas.js）
- _EasyCanvas（core/extras/_EasyCanvas.js）
- _EasyClip（core/extras/_EasyClip.js）
- _StringUtil（core/extras/_StringUtil.js）

_EasyClipオブジェクトの使用サンプルとして、core/extras/test.html、core/extras/test2.html、core/extras/test3.htmlを置いています。

### 変数・関数の上書き

```javascript
/*
 * _EasyClip用
 */

window.loopMax = 65536; // ループ回数上限

// getArrayTokenString関数用
window.arrayTokenStringSpace = "&nbsp;";
window.arrayTokenStringBreak = "<br>";

/*
 * _Proc用
 */

window.assertProc = function( num, func ){
    // アサートに失敗した時に処理を停止する場合trueを返す
    return false;
};
window.errorProc = function( err, num, func, token ){
    // 以下は文字列を生成する例
    var str = (((err & _CLIP_PROC_WARN) != 0) ? "warning:" : "error:") + intToString( err, 16, 4 ) + " line:" + num;
};

window.printAnsComplex = function( real, imag ){
    // 以下は文字列を生成する例
    var str = real + imag;
};
window.printAnsMultiPrec = function( str ){
};
window.printAnsMatrix = function( param, array/*_Token*/ ){
    // 以下は文字列を生成する例
    var str = curClip().getArrayTokenString( param, array, 0 );
};
window.printWarn = function( warn, num, func ){
    // 以下は文字列を生成する例
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
    // 以下は文字列を生成する例
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
    // コマンド:clear実行時に呼ばれる関数
};
window.doCommandPrint = function( topPrint, flag ){
    // コマンド:print、:println実行時に呼ばれる関数
    // コマンド:print時はflagにfalseが、コマンド:println時はflagにtrueが渡される
    // 以下は文字列を生成する例
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
    // コマンド:scan実行時に呼ばれる関数
    // 以下は文字入力ダイアログを表示する例
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
    // コマンド:gworld実行時に呼ばれる関数
};
```

上書き関数の内部で_EasyClipオブジェクト操作する場合、次のように_EasyClipオブジェクトを取得します。

```javascript
var clip = curClip();
```

上書き関数の内部で_Canvasオブジェクト操作する場合、次のように_Canvasオブジェクトを取得します。

```javascript
var canvas = curCanvas();
```

### オブジェクトの構築

```javascript
var clip = new _EasyClip();
```

### 変数に値を設定する

```javascript
clip.setValue( 'a', 12.345 ); // CLIPでの@a
clip.setComplex( 'b', 12.3, 4.5 ); // CLIPでの@b
clip.setFract( 'c', -123, 45 ); // CLIPでの@c
clip.setMultiPrec( 'a', array/*Array*/ ); // CLIPでの@@a
```

### 配列に値を設定する

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

### 変数の値を確認する

```javascript
var value = clip.getValue( 'a' ).toFloat();
var value = clip.getValue( 'b' ).real();
var value = clip.getValue( 'b' ).imag();
var isMinus = clip.getValue( 'c' ).fractMinus();
var value = clip.getValue( 'c' ).num();
var value = clip.getValue( 'c' ).denom();
var array = clip.getMultiPrec( 'a' ); // Arrayオブジェクト
var string = clip.getComplexString( 'b' );
var string = clip.getFractString( 'c', false ); // Improper
var string = clip.getFractString( 'c', true ); // Mixed
var string = clip.getMultiPrecString( 'a' );
```

getValue関数の戻り値は_Valueオブジェクトなので、toFloat、real、imag、fractMinus、num、denom関数以外の関数も使えます。

### 配列の値を確認する

```javascript
var array = clip.getArray( 'a' ); // Forcibly convert to JavaScript Array
var array = clip.getArray( 'a', 1 ); // One-dimensional element
var array = clip.getArray( 'a', 2 ); // Two-dimensional element
var array = clip.getArray( 'a', N ); // N-dimensional element
var string = "@@d = " + clip.getArrayString( 'd', 6 );
var string = clip.getString( 's' );
```

getArray関数で取得したArrayオブジェクトをJSON.stringifyに渡すことでも文字列に変換できます。

### 計算結果の値を確認する

```javascript
var value = clip.getAnsValue().toFloat();
var value = clip.getAnsValue().real();
var value = clip.getAnsValue().imag();
var isMinus = clip.getAnsValue().fractMinus();
var value = clip.getAnsValue().num();
var value = clip.getAnsValue().denom();
var array = clip.getAnsMultiPrec(); // Arrayオブジェクト
var matrix = clip.getAnsMatrix(); // _Matrixオブジェクト
var string = "Ans = " + clip.getAnsMatrixString( 6 );
var string = clip.getAnsMultiPrecString( 'a' );
```

getAnsValue関数の戻り値は_Valueオブジェクトなので、toFloat、real、imag、fractMinus、num、denom関数以外の関数も使えます。

### 各種設定

CLIPの設定系コマンドをJavaScriptから直接実行する関数群です。

**型の指定**

```javascript
clip.setMode( mode, param1, param2 );
```

| `mode` | 意味 | `param1` | `param2` |
| --- | --- | --- | --- |
| _CLIP_MODE_E_FLOAT | 倍精度浮動小数点型(指数表記) | 表示精度 | - |
| _CLIP_MODE_F_FLOAT | 倍精度浮動小数点型(小数点表記) | 表示精度 | - |
| _CLIP_MODE_G_FLOAT | 倍精度浮動小数点型 | 表示精度 | - |
| _CLIP_MODE_E_COMPLEX | 複素数型(指数表記) | 表示精度 | - |
| _CLIP_MODE_F_COMPLEX | 複素数型(小数点表記) | 表示精度 | - |
| _CLIP_MODE_G_COMPLEX | 複素数型 | 表示精度 | - |
| _CLIP_MODE_I_FRACT | 分数型 | - | - |
| _CLIP_MODE_M_FRACT | 帯分数型 | - | - |
| _CLIP_MODE_H_TIME | 時間型(時) | 秒間フレーム数 | - |
| _CLIP_MODE_M_TIME | 時間型(分) | 秒間フレーム数 | - |
| _CLIP_MODE_S_TIME | 時間型(秒) | 秒間フレーム数 | - |
| _CLIP_MODE_F_TIME | 時間型(フレーム) | 秒間フレーム数 | - |
| _CLIP_MODE_S_CHAR | 符号付き8ビット整数型 | 基数 | - |
| _CLIP_MODE_U_CHAR | 符号なし8ビット整数型 | 基数 | - |
| _CLIP_MODE_S_SHORT | 符号付き16ビット整数型 | 基数 | - |
| _CLIP_MODE_U_SHORT | 符号なし16ビット整数型 | 基数 | - |
| _CLIP_MODE_S_LONG | 符号付き32ビット整数型 | 基数 | - |
| _CLIP_MODE_U_LONG | 符号なし32ビット整数型 | 基数 | - |
| _CLIP_MODE_F_MULTIPREC | 多倍長浮動小数点数型 | 精度 | 丸めモード |
| _CLIP_MODE_I_MULTIPREC | 多倍長整数型 | 精度 | 丸めモード |

| 丸めモード | 意味 |
| --- | --- |
| up | ゼロから離れるように丸める |
| down | ゼロに近づくように丸める |
| ceiling | 正の無限大に近づくように丸める |
| floor | 負の無限大に近づくように丸める |
| h_up | 四捨五入する |
| h_down | 五捨六入する |
| h_even | `param1`桁目の数値が奇数の場合はh_up、偶数の場合はh_down |
| h_down2 | 五捨五超入する |
| h_even2 | `param1`桁目の数値が奇数の場合はh_up、偶数の場合はh_down2 |

`param1`、`param2`は省略できます。

_EasyClipオブジェクト構築直後：_CLIP_MODE_G_FLOAT

**浮動小数点数の表示精度**（CLIPでの:precコマンド）

```javascript
clip.setPrec( prec );
```

_EasyClipオブジェクト構築直後：6

**秒間フレーム数**（CLIPでの:fpsコマンド）

```javascript
clip.setFps( fps );
```

_EasyClipオブジェクト構築直後：30.0

**整数における基数**（CLIPでの:radixコマンド）

```javascript
clip.setRadix( radix );
```

_EasyClipオブジェクト構築直後：10

**角度の単位指定**

```javascript
clip.setAngType( type );
```

| `type` | 意味 |
| --- | --- |
| _ANG_TYPE_RAD | ラジアン |
| _ANG_TYPE_DEG | 度 |
| _ANG_TYPE_GRAD | グラジアン |

_EasyClipオブジェクト構築直後：_ANG_TYPE_RAD

**電卓モード指定**（CLIPでの:calculatorコマンド）

```javascript
clip.setCalculator( flag );
```

_EasyClipオブジェクト構築直後：false

**配列の添字の下限指定**（CLIPでの:baseコマンド）

```javascript
clip.setBase( base );
```

| `base` | 意味 |
| --- | --- |
| 0 | 0オリジン |
| 1 | 1オリジン |

_EasyClipオブジェクト構築直後：0

**計算結果を返すかどうかを指定**（CLIPでの:ansコマンド）

```javascript
clip.setAnsFlag( flag );
```

_EasyClipオブジェクト構築直後：false

**診断メッセージ有効かどうかを指定**（CLIPでの:assertコマンド）

```javascript
clip.setAssertFlag( flag );
```

_EasyClipオブジェクト構築直後：false

**警告メッセージ有効かどうかを指定**（CLIPでの:warnコマンド）

```javascript
clip.setWarnFlag( flag );
```

_EasyClipオブジェクト構築直後：true

### コマンド

一部のCLIPコマンドをJavaScriptから直接実行する関数を用意しています。

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
var array = clip.commandGGet(); // 取得できなかった場合null
```

```javascript
var array = clip.commandGGet24(); // 取得できなかった場合null
```

### 計算

```javascript
var ret = clip.procLine( line/*String*/ ); // 正常終了時、_CLIP_PROC_ENDが返る
```

```javascript
var ret = clip.procScript( script/*Array*/ ); // 正常終了時、_CLIP_PROC_ENDが返る
```

### カラー・パレット

```javascript
clip.newPalette();
```

```javascript
clip.setPalette( bgrColorArray );
```

```javascript
// 以下はグレースケール・パレットを設定する例
var bgrColor;
for( var i = 0; i < 256; i++ ){
    bgrColor = (i << 16) + (i << 8) + i;
    clip.setPaletteColor( i, bgrColor );
}
```

```javascript
var bgrColor = clip.paletteColor( index );
```

### キャンバス

```javascript
var canvas = clip.setCanvas( id ); // _Canvasオブジェクトが返る
```

```javascript
var canvas = clip.createCanvas( width, height ); // _Canvasオブジェクトが返る
```

```javascript
clip.resizeCanvas( width, height );
```

```javascript
clip.updateCanvas();
clip.updateCanvas( scale ); // scaleを指定すると、_GWorldオブジェクト内のイメージ・メモリが拡大描画される
```

```javascript
var canvas = clip.canvas(); // _Canvasオブジェクト
```

### イメージを構築して表示する

```javascript
var ret = clip.createImage( script/*Array*/, id, type, encoderOptions ); // 正常終了時、_CLIP_PROC_ENDが返る
```

`id`はimg要素のid

`type`は画像フォーマットを示すDOMString。指定しなかった場合、デフォルトのフォーマット形式は"image/png"

`encoderOptions`は0から1の間のNumberで示す、"image/jpeg"や"image/webp"のような非可逆圧縮を使う画像フォーマットの画質。デフォルト値は0.92

### _EasyCanvasオブジェクトを使用する
 
_EasyCanvasオブジェクトを構築すると、以降、CLIPのグラフィックス命令が直接キャンバスに描画されるようになり、updateCanvas関数を呼ぶ必要がなくなります。
 
```javascript
var easyCanvas = new _EasyCanvas();
```

```javascript
easyCanvas.setFont( canvas/*_Canvas*/, size, family );
```

### その他

- _Procオブジェクトから呼び出されるprintAnsMatrix関数の実装に使う関数

```javascript
var string = clip.getArrayTokenString( param, array/*_Token*/, indent );
```

printAnsMatrix関数のパラメータのparam、arrayをそのまま渡すことができます。

- _EasyClipオブジェクト内に唯一存在する計算処理メイン・クラスである_Procオブジェクトを取得する

```javascript
var proc = clip.proc();
```

- _EasyClipオブジェクト内に唯一存在する計算パラメータ・クラスである_Paramオブジェクトを取得する

```javascript
var param = clip.param();
```

- _EasyClipオブジェクト内に唯一存在する_GWorldオブジェクトを取得する

```javascript
var gWorld = clip.gWorld();
```

- CLIPエンジン内に唯一存在する_MultiPrecオブジェクトを取得する

```javascript
var mp = procMultiPrec();
```

----------

## <a id="mp"> core/mp/mp.js, core/mp/mp.debug.js

多倍長演算用オブジェクト_MultiPrec

### _MultiPrecオブジェクトのコンストラクタ

```javascript
_MultiPrec()
```

### 定数の定義メソッド

**多倍長整数**

```javascript
I( str )
```

Arrayオブジェクトを返します。

定数が未定義の場合には定義が追加され、定義済みの場合は定義されているものが返されます。

**多倍長浮動小数点数**

```javascript
F( str )
```

Arrayオブジェクトを返します。

定数が未定義の場合には定義が追加され、定義済みの場合は定義されているものが返されます。

### 多倍長整数演算メソッド

**文字列を多倍長整数に変換する**

```javascript
str2num( n/*Array*/, s )
```

**多倍長整数を文字列に変換する**

```javascript
num2str( n/*Array*/ )
```

Stringオブジェクトを返します。

**代入**

```javascript
set( rop/*Array*/, op/*Array*/ )
```

**大小比較**

```javascript
cmp( a/*Array*/, b/*Array*/ )
```

`a`が`b`よりも大きい場合は正の値、小さい場合は負の値、等しい場合はゼロの値を返します。

**加算**

```javascript
add( ret/*Array*/, a/*Array*/, b/*Array*/ )
```

**減算**

```javascript
sub( ret/*Array*/, a/*Array*/, b/*Array*/ )
```

**乗算**

```javascript
mul( ret/*Array*/, a/*Array*/, b/*Array*/ )
```

**除算**

```javascript
div( q/*Array*/, a/*Array*/, b/*Array*/, r/*Array*/ )
```

商`q`と余り`r`を得ます。
除数`b`が0のときはtrueを返します。

`r`は省略できます。

**符号反転**

```javascript
neg( rop/*Array*/, op/*Array*/ )
```

`op`は省略できます。

**絶対値**

```javascript
abs( rop/*Array*/, op/*Array*/ )
```

`op`は省略できます。

**平方根**

```javascript
sqrt( x/*Array*/, a/*Array*/ )
```

`a`が負の値の場合trueを返します。

### 多倍長浮動小数点数演算メソッド

**文字列を多倍長浮動小数点数に変換する**

```javascript
fstr2num( n/*Array*/, s )
```

**多倍長浮動小数点数を文字列に変換する**

```javascript
fnum2str( n/*Array*/ )
```

Stringオブジェクトを返します。

**代入**

```javascript
fset( rop/*Array*/, op/*Array*/ )
```

**大小比較**

```javascript
fcmp( a/*Array*/, b/*Array*/ )
```

`a`が`b`よりも大きい場合は正の値、小さい場合は負の値、等しい場合はゼロの値を返します。

**加算**

```javascript
fadd( ret/*Array*/, a/*Array*/, b/*Array*/ )
```

**減算**

```javascript
fsub( ret/*Array*/, a/*Array*/, b/*Array*/ )
```

**乗算**

```javascript
fmul( ret/*Array*/, a/*Array*/, b/*Array*/, prec )
```

**除算**

```javascript
fdiv( ret/*Array*/, a/*Array*/, b/*Array*/, prec )
fdiv2( ret/*Array*/, a/*Array*/, b/*Array*/, prec, digit/*_Integer*/ )
```

除数`b`が0のときはtrueを返します。
`digit`には、被除数`a`の整数部の桁数が格納されます。

`digit`は省略できます。

**符号反転**

```javascript
fneg( rop/*Array*/, op/*Array*/ )
```

`op`は省略できます。

**絶対値**

```javascript
fabs( rop/*Array*/, op/*Array*/ )
```

`op`は省略できます。

**小数点以下の切り捨て**

```javascript
ftrunc( rop/*Array*/, op/*Array*/ )
```

**平方根**

```javascript
fsqrt( ret/*Array*/, a/*Array*/, prec )
fsqrt2( ret/*Array*/, a/*Array*/, prec, order )
fsqrt3( ret/*Array*/, a/*Array*/, prec )
```

`a`が負の値の場合trueを返します。

**整数部の桁数**

```javascript
fdigit( a/*Array*/ )
```

**丸め演算**

```javascript
fround( a/*Array*/, prec, mode )
```

| `mode` | 意味 |
| --- | --- |
| _MP_FROUND_UP | ゼロから離れるように丸める |
| _MP_FROUND_DOWN | ゼロに近づくように丸める |
| _MP_FROUND_CEILING | 正の無限大に近づくように丸める |
| _MP_FROUND_FLOOR | 負の無限大に近づくように丸める |
| _MP_FROUND_HALF_UP | 四捨五入する |
| _MP_FROUND_HALF_DOWN | 五捨六入する |
| _MP_FROUND_HALF_EVEN | `prec`桁目の数値が奇数の場合は_MP_FROUND_HALF_UP、偶数の場合は_MP_FROUND_HALF_DOWN |
| _MP_FROUND_HALF_DOWN2 | 五捨五超入する |
| _MP_FROUND_HALF_EVEN2 | `prec`桁目の数値が奇数の場合は_MP_FROUND_HALF_UP、偶数の場合は_MP_FROUND_HALF_DOWN2 |

`mode`を省略すると、_MP_FROUND_HALF_EVENの動作になります。
