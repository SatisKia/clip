# clip.js

CLIPインタープリタ用の計算処理エンジンです。

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

### オブジェクトの構築

```javascript
var clip = new _EasyClip();
```

### 変数に値を設定する

```javascript
clip.setValue( 'a', 12.345 ); // CLIPでの@a
clip.setComplex( 'b', 12.3, 4.5 ); // CLIPでの@b
```

### 配列に値を設定する

```javascript
clip.setMatrix( 'a', [[1,2,3],[4,5,6],[7,8,9]] ); // CLIPでの@@a
clip.setArrayValue( 'b', [0, 0], 12 ); // CLIPでの@@b 0 0
clip.setArrayValue( 'b', [0, 1], 34 ); // CLIPでの@@b 0 1
clip.setArrayValue( 'b', [1, 0], 56 ); // CLIPでの@@b 1 0
clip.setArrayValue( 'b', [1, 1], 78 ); // CLIPでの@@b 1 1
clip.setString( 's', "Hello World!!" ); // CLIPでの@@s
```

### 計算結果の値を確認する

```javascript
var value = clip.getAnsValue().toFloat();
var real = clip.getAnsValue().real();
var imag = clip.getAnsValue().imag();
var matrix = clip.getAnsMatrix(); // _Matrixオブジェクト
```

```javascript
var string = "Ans = " + clip.getAnsMatrixString( 6 );
```

getAnsValue関数の戻り値は_Valueオブジェクトなので、toFloat、real、imag関数以外の関数も使えます。

### 変数の値を確認する

```javascript
var value = clip.getValue( 'a' ).toFloat();
var real = clip.getValue( 'b' ).real();
var imag = clip.getValue( 'b' ).imag();
```

```javascript
var string = clip.getComplexString( 'b' );
```

getValue関数の戻り値は_Valueオブジェクトなので、toFloat、real、imag関数以外の関数も使えます。

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

```javascript
clip.setPrec( prec );
```

```javascript
clip.setFps( fps );
```

```javascript
clip.setRadix( radix );
```

```javascript
clip.setAngType( type );
```

| type | 意味 |
| --- | --- |
| _ANG_TYPE_RAD | ラジアン |
| _ANG_TYPE_DEG | 度 |
| _ANG_TYPE_GRAD | グラジアン |

```javascript
clip.setCalculator( flag );
```

```javascript
clip.setBase( base );
```

| base | 意味 |
| --- | --- |
| 0 | 0オリジン |
| 1 | 1オリジン |

```javascript
clip.setAssertFlag( flag );
```

```javascript
clip.setWarnFlag( flag );
```

### コマンド

一部のCLIPコマンドをJavaScriptから直接実行する関数を用意しています。

```javascript
clip.commandGWorld( width, height );
```

```javascript
clip.commandWindow( left, bottom, right, top );
```

```javascript
clip.commandGClear( color );
```

```javascript
clip.commandGColor( color );
```

```javascript
clip.commandGPut( array/*Array*/ );
```

```javascript
clip.commandGPut24( array/*Array*/ );
```

```javascript
var tmp = new _Void();
clip.commandGGet( tmp/*_Void*/ );
var array = tmp.obj();
```

```javascript
var tmp = new _Void();
clip.commandGGet24( tmp/*_Void*/ );
var array = tmp.obj();
```

### 計算

```javascript
var ret = clip.procLine( line/*String*/ );
```

```javascript
var ret = clip.procScript( script/*Array*/ );
```

### キャンバス

```javascript
clip.setCanvas( id );
```

```javascript
clip.updateCanvas();
```

### その他

```javascript
var string = clip.getArrayTokenString( param, array/*_Token*/, indent );
```

_Procオブジェクトから呼び出されるprintAnsMatrix関数の実装で使う場合、関数のパラメータのparam、arrayをそのまま渡すことができます。
