# clip.js

CLIP言語による計算処理のエンジンです。

CLIP言語については、test/core/htdocs/language.htmlを参照してください。

## core/clip.js、core/clip.debug.js

core/extrasフォルダを除く全てのソース内容が含まれています。

## ビルド方法

build.batを実行しますと、coreフォルダ下にclip.jsとclip.debug.jsが生成されます。

ビルドには別途、次のツールが必要です。

### MinGW

UTF-8対応Cプリプロセッサとして使用します。

### Microsoft Ajax Minifier

JavaScriptコードの圧縮・難読化ツールです。

## テスト

### test/math

数値計算テストプログラムです。

### test/core

CLIPインタープリタです。

## core/extras/_EasyClip.js

CLIPエンジンをJavaScriptから簡単に実行する機能を提供するオブジェクトです。

_EasyClipオブジェクトの使用サンプルとして、core/extras/test.htmlを置いています。

### 変数・関数の上書き

```javascript
/*
 * _EasyClip用
 */

window.loopMax = 65536; // ループ回数上限

// getArrayTokenString関数用
window.arrayTokenStringSpace = "&nbsp;";
window.arrayTokenStringBreak = "<br>";

window.canvasSetColor = function( canvas/*_Canvas*/, index ){
    // キャンバスの現在色をインデックスのカラーに設定する処理を記述する
};

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

window.printAnsMatrix = function( param, array/*_Token*/ ){
    // 以下は文字列を生成する例
    var str = _clip.getArrayTokenString( param, array, 0 );
};
window.printAnsComplex = function( real, imag ){
    // 以下は文字列を生成する例
    var str = real + imag;
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
};
window.doCommandScan = function( topScan, proc, param ){
    // コマンド:scan実行時に呼ばれる関数
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
var canvas = curClip()._canvas;
```

### オブジェクトの構築

```javascript
var clip = new _EasyClip();
```

### 変数に値を設定する

```javascript
clip.setValue( 'a', 12.345 ); // CLIPでの@a
clip.setComplex( 'b', 12.3, 4.5 ); // CLIPでの@b
clip.setFract( 'c', 1, 3 ); // CLIPでの@c
```

### 配列に値を設定する

```javascript
clip.setMatrix( 'a', [[1,2,3],[4,5,6],[7,8,9]] ); // CLIPでの@@a
clip.setArrayValue( 'b', [0, 0], 12 ); // CLIPでの@@b 0 0
clip.setArrayValue( 'b', [0, 1], 34 ); // CLIPでの@@b 0 1
clip.setArrayValue( 'b', [1, 0], 56 ); // CLIPでの@@b 1 0
clip.setArrayValue( 'b', [1, 1], 78 ); // CLIPでの@@b 1 1
clip.setArrayComplex( 'c', [0], 12.3, 4.5 ); // CLIPでの@@c 0
clip.setArrayFract( 'd', [2], 3, 7 ); // CLIPでの@@d 2
clip.setString( 's', "Hello World!!" ); // CLIPでの@@s
```

### 計算結果の値を確認する

```javascript
var value = clip.getAnsValue().toFloat();
var real = clip.getAnsValue().real();
var imag = clip.getAnsValue().imag();
var matrix = clip.getAnsMatrix(); // _Matrixオブジェクト
```

getAnsValue関数の戻り値は_Valueオブジェクトなので、toFloat、real、imag関数以外の関数も使えます。

```javascript
var string = "Ans = " + clip.getAnsMatrixString( 6 );
```

### 変数の値を確認する

```javascript
var value = clip.getValue( 'a' ).toFloat();
var real = clip.getValue( 'b' ).real();
var imag = clip.getValue( 'b' ).imag();
```

getValue関数の戻り値は_Valueオブジェクトなので、toFloat、real、imag関数以外の関数も使えます。

```javascript
var string = clip.getComplexString( 'b' );
```

### 配列の値を確認する

```javascript
var array = clip.getArray( 'a' );
var array2 = clip.getArray( 'a', 1 ); // 一次元要素のみを取り出す
var array3 = clip.getArray( 'a', 2 ); // 二次元要素のみを取り出す
var array4 = clip.getArray( 'a', n ); // n次元要素のみを取り出す
```

```javascript
var string = "@@b = " + clip.getArrayString( 'b', 6 );
```

getArray関数で取得したArrayオブジェクトをJSON.stringifyに渡すことでも文字列に変換できます。

```javascript
var string = clip.getString( 's' );
```

### 各種設定

CLIPの設定系コマンドをJavaScriptから直接実行する関数群です。

```javascript
clip.setMode( mode );
```

| mode | 意味 |
| --- | --- |
| _CLIP_MODE_E_FLOAT | 倍精度浮動小数点型(指数表記) |
| _CLIP_MODE_F_FLOAT | 倍精度浮動小数点型(小数点表記) |
| _CLIP_MODE_G_FLOAT | 倍精度浮動小数点型 |
| _CLIP_MODE_E_COMPLEX | 複素数型(指数表記) |
| _CLIP_MODE_F_COMPLEX | 複素数型(小数点表記) |
| _CLIP_MODE_G_COMPLEX | 複素数型 |
| _CLIP_MODE_I_FRACT | 分数型 |
| _CLIP_MODE_M_FRACT | 帯分数型 |
| _CLIP_MODE_H_TIME | 時間型(時) |
| _CLIP_MODE_M_TIME | 時間型(分) |
| _CLIP_MODE_S_TIME | 時間型(秒) |
| _CLIP_MODE_F_TIME | 時間型(フレーム) |
| _CLIP_MODE_S_CHAR | 符号付き8ビット整数型 |
| _CLIP_MODE_U_CHAR | 符号なし8ビット整数型 |
| _CLIP_MODE_S_SHORT | 符号付き16ビット整数型 |
| _CLIP_MODE_U_SHORT | 符号なし16ビット整数型 |
| _CLIP_MODE_S_LONG | 符号付き32ビット整数型 |
| _CLIP_MODE_U_LONG | 符号なし32ビット整数型 |

_EasyClipオブジェクト構築直後：_CLIP_MODE_G_FLOAT

```javascript
clip.setPrec( prec );
```

_EasyClipオブジェクト構築直後：6

```javascript
clip.setFps( fps );
```

_EasyClipオブジェクト構築直後：30.0

```javascript
clip.setRadix( radix );
```

_EasyClipオブジェクト構築直後：10

```javascript
clip.setAngType( type );
```

| type | 意味 |
| --- | --- |
| _ANG_TYPE_RAD | ラジアン |
| _ANG_TYPE_DEG | 度 |
| _ANG_TYPE_GRAD | グラジアン |

_EasyClipオブジェクト構築直後：_ANG_TYPE_RAD

```javascript
clip.setCalculator( flag );
```

_EasyClipオブジェクト構築直後：false

```javascript
clip.setBase( base );
```

| base | 意味 |
| --- | --- |
| 0 | 0オリジン |
| 1 | 1オリジン |

_EasyClipオブジェクト構築直後：0

```javascript
clip.setAnsFlag( flag );
```

_EasyClipオブジェクト構築直後：false

```javascript
clip.setAssertFlag( flag );
```

_EasyClipオブジェクト構築直後：false

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
var ret = clip.procLine( line/*String*/ ); // 正常終了時、_CLIP_PROC_ENDが返ってくる
```

```javascript
var ret = clip.procScript( script/*Array*/ ); // 正常終了時、_CLIP_PROC_ENDが返ってくる
```

### カラー・パレット

```javascript
clip.setPalette( bgrColorArray );
```

_EasyClipオブジェクト内の配列_paletteを参照・操作できます。

### キャンバス

```javascript
var canvas = clip.setCanvas( id ); // _Canvasオブジェクト
```

```javascript
var canvas = clip.createCanvas( width, height ); // _Canvasオブジェクト
```

```javascript
var canvas = clip.resizeCanvas( width, height ); // _Canvasオブジェクト
```

```javascript
var canvas = clip.updateCanvas(); // _Canvasオブジェクト
clip.updateCanvas( scale ); // _GWorldオブジェクト内のイメージ・メモリを拡大描画
```

```javascript
var canvas = clip.canvas(); // _Canvasオブジェクト
```

### その他

```javascript
var string = clip.getArrayTokenString( param, array/*_Token*/, indent );
```

_Procオブジェクトから呼び出されるprintAnsMatrix関数の実装で使う場合、関数のパラメータのparam、arrayをそのまま渡すことができます。

```javascript
var proc = clip.proc();
```

_EasyClipオブジェクト内に唯一存在する計算処理メイン・クラスである_Procオブジェクト。

```javascript
var param = clip.param();
```

_EasyClipオブジェクト内に唯一存在する計算パラメータ・クラスである_Paramオブジェクト。

```javascript
var gWorld = clip.gWorld();
```

_EasyClipオブジェクト内に唯一存在する_GWorldオブジェクト。
