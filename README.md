# clip.js

「CLIP」とは、C言語ライクな演算子、ANSI数学関数、制御文を解釈できる、計算処理を目的としたインタープリタの総称です。「CLIP言語」は、そのインタープリタ用の記述言語です。本jsは、CLIPインタープリタ用の計算処理エンジンです。

## ビルド方法

build.batを実行しますと、coreフォルダ下にclip.jsとclip.debug.jsが生成されます。

ビルドには別途、次のツールが必要です。

### MinGW

UTF-8対応Cプリプロセッサとして使用します。

### Microsoft Ajax Minifier

JavaScriptコードの圧縮・難読化ツールです。

## テスト

### math

数値計算テストプログラムです。

### core

CLIPインタープリタです。
