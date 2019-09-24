//window.dispCache;		// 起動時にキャッシュ内容を表示するかどうか
//window.conMaxLen;		// コンソールの最大文字数
//window.retAssertProc;	// アサートに失敗した時に処理を停止するかどうか
//window.loopMax;		// ループ回数上限
//window.dispLoopCount;	// ループ回数表示レベル（0～2）
//window.useStorage;	// ストレージを使用するかどうか
//window.lockGUpdate;

var testFlag = false;	// テスト表示するかどうか

var traceLevel = 0;	// トレース・レベル（0～3）
var traceString = new String();

#define PROFILE_PREFIX	"_CLIP_"

// 外部関数
var extFuncFile = new Array();
var extFuncData = new Array();

#ifdef DEBUG
#define _TRY	try {
#define _CATCH	} catch( e ){ catchError( e ); }
#else
#define _TRY
#define _CATCH
#endif // DEBUG

#ifndef USE_CLIP_LIB

#include "math\_Complex.js"
#include "math\_Fract.js"
#include "math\_Math.js"
#include "math\_Matrix.js"
#include "math\_Time.js"
#include "math\_Value.js"

#include "param\_Boolean.js"
#include "param\_Float.js"
#include "param\_Integer.js"
#include "param\_String.js"
#include "param\_Void.js"

#include "system\_Tm.js"

#include "_Global.h"

#include "_Array.js"
#include "_Func.js"
#include "_Global.js"
#include "_Graph.js"
#include "_GWorld.js"
#include "_Label.js"
#include "_Line.js"
#include "_Loop.js"
#include "_Param.js"
#include "_Proc.js"
#include "_Token.js"
#include "_Variable.js"

#endif // USE_CLIP_LIB

#include "_ColorWin.js"
#include "_DefCharInfo.js"
#include "_DefCharInfoLarge.js"

#include "_Css.js"

// プリファレンス
#include "_Cookie.js"
#include "_Storage.js"
#include "_Preference.js"
var preference;

// コンソール
#include "_Console.js"
var con;
function onConsoleUpdate( id ){
	// 一番下までスクロール
	con.scrollBottom();
}

// エラー
#include "_Error.js"
function onError( e ){
	con.newLine();

	con.setColor( "ff0000" );

	con.println( "<b>message:</b> " + e.message() );
	con.println( "<b>name:</b> " + e.name() );
	con.println( "<b>description:</b> " + e.description() );
	con.println( "<b>number:</b> " + e.number() );
	con.println( "<b>file:</b> " + e.file() );
	con.println( "<b>line:</b> " + e.line() );
	con.println( "<b>column:</b> " + e.column() );

	var tmp = new _String( e.stack() );
	tmp.escape().replaceNewLine( consoleBreak() );
	con.println( "<b>stack:</b> " + tmp.str() );

	con.setColor();
}

// キャンバス
#include "_Canvas.js"
var canvas;
function canvasClear(){
	var rgbColor = gWorldBgColor();
	canvas.setColor( (rgbColor & 0xFF0000) >> 16, (rgbColor & 0x00FF00) >> 8, rgbColor & 0x0000FF );
	canvas.fill( 0, 0, canvas.width(), canvas.height() );
}
function canvasSetColor( bgrColor ){
	canvas.setColor( bgrColor & 0x0000FF, (bgrColor & 0x00FF00) >> 8, (bgrColor & 0xFF0000) >> 16 );
}
function canvasPut( x, y ){
	canvas.put( x, y );
}
function canvasFill( x, y, w, h ){
	canvas.fill( x, y, w, h );
}
function canvasLine( x1, y1, x2, y2 ){
	canvas.line( x1, y1, x2, y2 );
}

// ファイル選択
#include "_InputFile.js"
var inputFile;
var inputFileImage = null;
function drawInputFileImage( w/*_Integer*/, h/*_Integer*/ ){
	var width  = topProc.gWorld().width ();
	var height = topProc.gWorld().height();
	if( (width > 0) && (height > 0) ){
		if( (inputFileImage.width <= width) && (inputFileImage.height <= height) ){
			width  = inputFileImage.width;
			height = inputFileImage.height;
		} else if( inputFileImage.width / inputFileImage.height < width / height ){
			width = _INT( inputFileImage.width * height / inputFileImage.height );
		} else {
			height = _INT( inputFileImage.height * width / inputFileImage.width );
		}
		w.set( width  );
		h.set( height );
		canvas.drawImage( inputFileImage, width, height );
		return canvas.imageData( width, height ).data;
	}
	return null;
}
function onInputFileLoadImage( name, image ){
	inputFileImage = image;

	var w = new _Integer();
	var h = new _Integer();
	var data = drawInputFileImage( w, h );
	if( data != null ){
		var width  = w.val();
		var height = h.val();

		con.setBold( true );
		con.println( "[" + name + "]" );
		if( (width != inputFileImage.width) || (height != inputFileImage.height) ){
			con.print( "" + inputFileImage.width + "x" + inputFileImage.height + " -&gt; " );
		}
		con.println( "" + width + "x" + height );
		con.setBold( false );

		var x, y, r, g, b;
		var i = 0;
		for( y = 0; y < height; y++ ){
			for( x = 0; x < width; x++ ){
				r = data[i++];
				g = data[i++];
				b = data[i++];
				i++;
				topProc.gWorld().putColor( x, y, doFuncGColor( (r << 16) + (g << 8) + b ) );
			}
		}

		gUpdate( topProc.gWorld() );
	}
}
function doCommandGGet24Begin( w/*_Integer*/, h/*_Integer*/ ){
	if( inputFileImage != null ){
		return drawInputFileImage( w, h );
	}
	return null;
}
function doCommandGGet24End(){
	gUpdate( topProc.gWorld() );
}

// 計算エラー情報管理
#include "_ProcError.js"
var procError;
var silentErr = false;

// エディタ
#include "_Editor.js"
var editor;
var selFunc;
var curFunc;

// ファイル出力
#include "_WriteFile.js"

// カスタム・コマンド
#define _CLIP_COMMAND_CUSTOM_ENV		 _CLIP_COMMAND_CUSTOM
#define _CLIP_COMMAND_CUSTOM_LIST		(_CLIP_COMMAND_CUSTOM + 1)
#define _CLIP_COMMAND_CUSTOM_LISTD		(_CLIP_COMMAND_CUSTOM + 2)
#define _CLIP_COMMAND_CUSTOM_EXTFUNC	(_CLIP_COMMAND_CUSTOM + 3)
#define _CLIP_COMMAND_CUSTOM_USAGE		(_CLIP_COMMAND_CUSTOM + 4)
#define _CLIP_COMMAND_CUSTOM_ENGLISH	(_CLIP_COMMAND_CUSTOM + 5)
#define _CLIP_COMMAND_CUSTOM_JAPANESE	(_CLIP_COMMAND_CUSTOM + 6)
#define _CLIP_COMMAND_CUSTOM_TEST		(_CLIP_COMMAND_CUSTOM + 7)
#define _CLIP_COMMAND_CUSTOM_TRACE		(_CLIP_COMMAND_CUSTOM + 8)

var topProc;
var topParam;

var needGUpdate = false;

var addExtFuncList = false;

#define LANG_JAPANESE	0
#define LANG_ENGLISH	1
var englishFlag = false;

// iOS10でダブルタップを防ぐ
var lastTouchEnd = 0;

function main( divId, canvasId, inputFileId, editorId ){
	var i;

	var userAgent = window.navigator.userAgent;
	if( (userAgent.indexOf( "Android" ) != -1) || (userAgent.indexOf( "iPad" ) != -1) ){
		document.getElementById( "clip_loadextfunc" ).style.display = "none";
		document.getElementById( "command_pc" ).style.display = "none";

		if( userAgent.indexOf( "iPad" ) != -1 ){
			// iOS10で複数指で拡大縮小が出来てしまうのを防ぐ
			document.documentElement.addEventListener( "touchstart", function( e ){
				if( e.touches.length > 1 ){
					e.preventDefault();
				}
			}, true );

			// iOS10でダブルタップを防ぐ
			document.documentElement.addEventListener( "touchend", function( e ){
				var now = (new Date()).getTime();
				if( now - lastTouchEnd <= 500 ){
					e.preventDefault();
				}
				lastTouchEnd = now;
			}, true );

			useStorage = false;
		}
	}

	// プリファレンス
	preference = new _Preference( useStorage );

	// コンソール
	con = new _Console( divId );
	con.setMaxBlankLine( 1 );
	con.setMaxLen( conMaxLen );

	// 文字情報を登録する
	regGWorldDefCharInfo();
	regGWorldDefCharInfoLarge();

	// システムの背景色（canvasClearより前に設定）
	regGWorldBgColor( 0xC0C0C0 );

	// キャンバス
	canvas = new _Canvas( canvasId );
	canvasClear();

	// ファイル選択コントロール
	inputFile = new _InputFile( inputFileId );

	// 計算エラー情報管理クラス
	procError = new _ProcError();

	// 計算処理メイン・クラスを生成する
	topProc = new _Proc( _PROC_DEF_PARENT_MODE, _PROC_DEF_PRINT_ASSERT, _PROC_DEF_PRINT_WARN, _PROC_DEF_GUPDATE_FLAG );
	topProc.setAnsFlag( true );
	setProcWarnFlowFlag( true );
	setProcTraceFlag( traceLevel > 0 );
	setProcLoopMax( loopMax );

	// 計算パラメータ・クラスを生成する
	topParam = new _Param();
	topParam.setEnableCommand( true );
	topParam.setEnableStat( true );
	setGlobalParam( topParam );

	// カスタム・コマンドの登録
	regCustomCommand( "env"     , _CLIP_COMMAND_CUSTOM_ENV      );
	regCustomCommand( "list"    , _CLIP_COMMAND_CUSTOM_LIST     );
	regCustomCommand( "listd"   , _CLIP_COMMAND_CUSTOM_LISTD    );
	regCustomCommand( "extfunc" , _CLIP_COMMAND_CUSTOM_EXTFUNC  );
	regCustomCommand( "usage"   , _CLIP_COMMAND_CUSTOM_USAGE    );
	regCustomCommand( "english" , _CLIP_COMMAND_CUSTOM_ENGLISH  );
	regCustomCommand( "japanese", _CLIP_COMMAND_CUSTOM_JAPANESE );
	regCustomCommand( "test"    , _CLIP_COMMAND_CUSTOM_TEST     );
	regCustomCommand( "trace"   , _CLIP_COMMAND_CUSTOM_TRACE    );

	// 乱数を初期化する
	srand( time() );
	rand();

	if( dispCache ){
		if( canUseStorage() ){
			var num = storageNum();
			con.println( "<b>Storage: " + num + "</b>" );
			for( i = 0; i < num; i++ ){
				var key = getStorageKey( i );
				con.print( "<b>[" + key + "]</b> " );
				con.println( (new _String( getStorage( key, "" ) )).escape().str() );
			}
		}
		if( canUseCookie() ){
			var num = cookieNum();
			con.println( "<b>Cookie: " + num + "</b>" );
			for( i = 0; i < num; i++ ){
				var key = getCookieKey( i );
				con.print( "<b>[" + key + "]</b> " );
				con.println( (new _String( getCookie( key, "" ) )).escape().str() );
			}
		}
	}

	loadExtFuncFile();

	// エディタ
	editor = new _Editor( editorId );

	// エディタのタブ幅
	var tabWidth = parseInt( preference.get( PROFILE_PREFIX + "EDITOR_Tab", "4" ) );
	if( tabWidth < 0 ){
		tabWidth = 0;
	}
	document.getElementById( "tab_width" ).value = "" + tabWidth;
	cssSetPropertyValue( ".textarea_func", "tab-size", "" + tabWidth );

	// スマート
	var smart = (parseInt( preference.get( PROFILE_PREFIX + "EDITOR_Smart", "1" ) ) == 1);
	document.getElementById( "check_smart" ).checked = smart;
	setEditorSmartFlag( smart );

	// エディタの現在の関数
	selFunc = parseInt( preference.get( PROFILE_PREFIX + "EDITOR_SelFunc", "0" ) );
	var select = document.getElementById( "select_func" );
	for( i = 0; i < select.options.length; i++ ){
		select.options[i].selected = (i == selFunc) ? true : false;
	}
	curFunc = select.options[selFunc].value;
	loadFunc();

	updateSelectFunc();

	con.println( "CLIP Copyright (C) SatisKia" );

	englishFlag = (parseInt( preference.get( PROFILE_PREFIX + "ENV_Language", "" + LANG_JAPANESE ) ) == LANG_ENGLISH);
	updateLanguage();
}

function doShowConsole(){
	saveFunc();

	document.getElementById( "button_console" ).innerHTML = "<img src='icon1.png' width='20' height='20'>";
	document.getElementById( "button_editor"  ).innerHTML = "<img src='icon7.png' width='16' height='16'>";

	document.getElementById( "clip_editor"  ).style.display = "none";
	document.getElementById( "clip_console" ).style.display = "block";
}
function doShowEditor(){
	document.getElementById( "button_console" ).innerHTML = "<img src='icon1.png' width='16' height='16'>";
	document.getElementById( "button_editor"  ).innerHTML = "<img src='icon7.png' width='20' height='20'>";

	document.getElementById( "clip_console" ).style.display = "none";
	document.getElementById( "clip_editor"  ).style.display = "block";
}

function proc(){
	var line = "" + document.getElementById( "input0" ).value;

	if( line.length > 0 ){
		doShowConsole();

		procError.delAll();

		con.newLine();
		con.println( "<b>&gt;</b>" + line );
		con.lock();

		if( lockGUpdate ){
			needGUpdate = false;
		}

_TRY
		initProcLoopCount();
		if( testFlag ){
			topProc.testProcessLoop( line, topParam );
		}
		topProc.processLoop( line, topParam );
_CATCH

		if( lockGUpdate && needGUpdate ){
			gUpdate( topProc.gWorld() );
			needGUpdate = false;
		}

		if( (dispLoopCount > 0) && ((procLoopCount() > 0) || (procLoopTotal() > 0)) ){
			con.newLine();
			con.setColor( "0000ff" );
			if( procLoopCount() > 0 ){
				if( dispLoopCount > 1 ){
					con.println( "loop " + procLoopCount() );
				}
				resetProcLoopCount();
			}
			if( procLoopCountMax() > 0 ){
				con.println( "max loop " + procLoopCountMax() );
			}
			if( procLoopTotal() > 0 ){
				con.println( "total loop " + procLoopTotal() );
			}
			con.setColor();
		}

		con.unlock();

		if( !procError.isError() ){
			// ログを記録する
			addLogExpr();
		}
	}

	document.getElementById( "input0" ).value = "";
}

function doClearFuncCache(){
	topProc.clearAllFuncCache();
}

function doClearStorage(){
	if( canUseStorage() ){
		document.getElementById( "button_storage_clear" ).disabled = true;
		clearStorage( PROFILE_PREFIX + "TMP_" );
		location.replace( "index.html" );
	}
}

function doClearCookie(){
	if( canUseCookie() ){
		document.getElementById( "button_cookie_clear" ).disabled = true;
		clearCookie( PROFILE_PREFIX + "TMP_" );
		location.replace( "index.html" );
	}
}

function makeExtFuncData( data, disp ){
	// 末尾の改行を取り除く
	var dataLen = data.length;
	while( dataLen > 0 ){
		if( !isCharEnter( data, dataLen - 1 ) ){
			break;
		}
		dataLen--;
	}
	data = data.substr( 0, dataLen );

	if( disp ){
		var string = new _String( data );
		string.escape();
		string.replace( "\r\n", "<span style='color:#0000FF'>\\r\\n</span>" + consoleBreak() );
		string.replace( "\r"  , "<span style='color:#0000FF'>\\r</span>"    + consoleBreak() );
		string.replace( "\n"  , "<span style='color:#0000FF'>\\n</span>"    + consoleBreak() );
		con.println( string.str() );
	}

	var data2 = new _String( data );
	data2.replaceNewLine();
	if( data2.str().indexOf( "\n" ) < 0 ){
		var tmp = new Array();
		tmp[0] = data2.str();
		return tmp;
	}
	var data3 = data2.str().split( "\n" );

	// 先頭の空白を取り除く
	for( var i = 0; i < data3.length; i++ ){
		for( var j = 0; j < data3[i].length; j++ ){
			if( !isCharSpace( data3[i], j ) && (data3[i].charAt( j ) != '\t') ){
				data3[i] = data3[i].slice( j );
				break;
			}
		}
	}

	return data3;
}
function loadExtFuncFile(){
	var i;

	preference.beginRead( PROFILE_PREFIX + "TMP_LOADCEF_" );
	for( i = 0; ; i++ ){
		file = preference.read();
		if( file.length == 0 ){
			break;
		}
		extFuncFile[i] = file;
	}
	preference.endRead();

	for( i = 0; i < extFuncFile.length; i++ ){
		var data = preference.get( PROFILE_PREFIX + "TMP_" + extFuncFile[i], "" );
		if( data.length > 0 ){
			if( dispCache ){
				con.println( "<b>[" + ((useStorage && canUseStorage()) ? "storage" : "cookie") + " " + extFuncFile[i] + "]</b>" );
			}

			extFuncData[i] = makeExtFuncData( data, dispCache );

			if( dispCache ){
				if( englishFlag ) con.println( "<b>" + extFuncData[i].length + " lines</b>" );
				else              con.println( "<b>" + extFuncData[i].length + "行</b>" );
			}
		}
	}
}
function onInputFileLoad( func, data ){
	var i;

	// 外部関数キャッシュのクリア
	topProc.clearFuncCache( func );

	var name = "/" + func + ".cef";

	var index = extFuncFile.length;
	for( i = 0; i < extFuncFile.length; i++ ){
		if( extFuncFile[i] == name ){
			index = i;
			break;
		}
	}
	con.println( "<b>[" + ((index == extFuncFile.length) ? "new" : "update") + " " + name + "]</b>" );
	extFuncFile[index] = name;
	extFuncData[index] = makeExtFuncData( data, true );
	if( englishFlag ) con.println( "<b>" + extFuncData[index].length + " lines</b>" );
	else              con.println( "<b>" + extFuncData[index].length + "行</b>" );

	data = "";
	for( i = 0; i < extFuncData[index].length; i++ ){
		if( i != 0 ) data += "\n";
		data += extFuncData[index][i];
	}

	preference.beginWrite();
	for( i = 0; i < extFuncFile.length; i++ ){
		preference.write( extFuncFile[i] );
	}
	preference.endWrite( PROFILE_PREFIX + "TMP_LOADCEF_" );

	preference.set( PROFILE_PREFIX + "TMP_" + extFuncFile[index], data );
}
function onInputFileLoadEnd( num ){
	if( englishFlag ) con.println( "<b>Completed.</b>" );
	else              con.println( "<b>完了しました</b>" );
}
function extFuncName( str ){
	var top = str.lastIndexOf( "/" );
	if( top >= 0 ){
		top++;
		var end = str.lastIndexOf( ".cef" );
		if( end >= 0 ){
			return str.substring( top, end );
		}
	}
	return "";
}
function getExtFuncDataDirect( func ){
	if( (func.charAt( 0 ) == "!") && (func.length == 2) ){
		return makeExtFuncData( getFunc( func.charAt( 1 ) ), true );
	}
	return null;
}
function getExtFuncDataNameSpace( func ){
	for( var i = 0; i < extFuncFile.length; i++ ){
		if( extFuncName( extFuncFile[i] ) == func ){
			if( i < extFuncData.length ){
				return extFuncData[i];
			}
		}
	}
	return null;
}

function mainProc( parentProc, func, childParam, funcParam, parentParam ){
	var ret;

	// 親プロセスの環境を受け継いで、子プロセスを実行する
	var childProc = new _Proc( parentParam.mode(), parentProc.assertFlag(), parentProc.warnFlag(), parentProc.gUpdateFlag() );
_TRY
	ret = childProc.mainLoop( func, childParam, funcParam, parentParam );
_CATCH
	if( (dispLoopCount > 0) && (procLoopCount() > 0) ){
		if( dispLoopCount > 1 ){
			con.newLine();
			con.setColor( "0000ff" );
			if( childParam._funcName != null ){
				con.print( childParam._funcName + ": " );
			}
			con.println( "loop " + procLoopCount() );
			con.setColor();
		}
		resetProcLoopCount();
	}
	childProc.end();

	return ret;
}
function mainProcCache( parentProc, func, internal, childParam, funcParam, parentParam ){
	var ret;

	// 親プロセスの環境を受け継いで、子プロセスを実行する
	var childProc = new _Proc( parentParam.mode(), parentProc.assertFlag(), parentProc.warnFlag(), parentProc.gUpdateFlag() );
_TRY
	if( internal ){
		parentProc.initInternalProc( childProc, func, childParam, parentParam );
	}
	ret = childProc.mainLoop( func, childParam, funcParam, parentParam );
_CATCH
	if( (dispLoopCount > 0) && (procLoopCount() > 0) ){
		if( dispLoopCount > 1 ){
			con.newLine();
			con.setColor( "0000ff" );
			if( childParam._funcName != null ){
				con.print( childParam._funcName + ": " );
			}
			con.println( "loop " + procLoopCount() );
			con.setColor();
		}
		resetProcLoopCount();
	}
	childProc.end();

	return ret;
}
function assertProc( num, func ){
	con.newLine();
	if( (func != null) && (func.length > 0) ){
		con.print( func + ": " );
	}
	if( num > 0 ){
		if( englishFlag ) con.print( "Line " + num + ": " );
		else              con.print( "" + num + "行: " );
	}
	if( englishFlag ) con.println( "Error " + intToString( _CLIP_ERR_ASSERT, 16, 4 ) + ": Failed to assert." );
	else              con.println( "エラー(" + intToString( _CLIP_ERR_ASSERT, 16, 4 ) + "): アサートに失敗しました" );
	return retAssertProc;
}
function getErrorString( err, num, func, token ){
	var string = new String();
	var error  = getProcErrorDefString( err, token, topParam.isCalculator(), englishFlag );
	if( error.length > 0 ){
		if( (num > 0) && (func != null) && (func.length > 0) ){
			if( englishFlag ) string += func + ": Line " + num + ": ";
			else              string += func + ": " + num + "行: ";
		}
		if( englishFlag ) string += (((err & _CLIP_PROC_WARN) != 0) ? "Warning" : "Error") + " " + intToString( err, 16, 4 ) + ": " + error;
		else              string += (((err & _CLIP_PROC_WARN) != 0) ? "警告" : "エラー") + "(" + intToString( err, 16, 4 ) + "): " + error;
	}
	return string;
}
function errorProc( err, num, func, token ){
	if( silentErr ){
		if( err >= _CLIP_ERR_START ){
			procError.add( err, num, func, token );
		}
	} else {
		var string = getErrorString( err, num, func, token );
		if( string.length > 0 ){
			con.newLine();
			con.println( string );
		}
	}
}

function codeString( code ){
	var string = new String();
	switch( code ){
	case _CLIP_CODE_TOP:          string = "TOP"; break;
	case _CLIP_CODE_VARIABLE:     string = "VARIABLE"; break;
	case _CLIP_CODE_AUTO_VAR:     string = "AUTO_VAR"; break;
	case _CLIP_CODE_GLOBAL_VAR:   string = "GLOBAL_VAR"; break;
	case _CLIP_CODE_ARRAY:        string = "ARRAY"; break;
	case _CLIP_CODE_AUTO_ARRAY:   string = "AUTO_ARRAY"; break;
	case _CLIP_CODE_GLOBAL_ARRAY: string = "GLOBAL_ARRAY"; break;
	case _CLIP_CODE_CONSTANT:     string = "CONSTANT"; break;
	case _CLIP_CODE_LABEL:        string = "LABEL"; break;
	case _CLIP_CODE_COMMAND:      string = "COMMAND"; break;
	case _CLIP_CODE_STATEMENT:    string = "STATEMENT"; break;
	case _CLIP_CODE_OPERATOR:     string = "OPERATOR"; break;
	case _CLIP_CODE_FUNCTION:     string = "FUNCTION"; break;
	case _CLIP_CODE_EXTFUNC:      string = "EXTFUNC"; break;
	case _CLIP_CODE_NULL:         string = "NULL"; break;
	case _CLIP_CODE_END:          string = "END"; break;
	case _CLIP_CODE_ARRAY_TOP:    string = "ARRAY_TOP"; break;
	case _CLIP_CODE_ARRAY_END:    string = "ARRAY_END"; break;
	case _CLIP_CODE_MATRIX:       string = "MATRIX"; break;
	case _CLIP_CODE_STRING:       string = "STRING"; break;
	case _CLIP_CODE_SEPARATOR:    string = "SEPARATOR"; break;
	case _CLIP_CODE_COMMENT:      string = "COMMENT"; break;
	case _CLIP_CODE_PARAM_ANS:    string = "PARAM_ANS"; break;
	case _CLIP_CODE_PARAM_ARRAY:  string = "PARAM_ARRAY"; break;
	default:
		string = "" + code;
		break;
	}
	return string;
}
function printTrace( param, line, num, comment, skipFlag ){
	var string = new String();
	if( param._funcName != null ){
		string += "" + param._funcName + ":";
	}
	if( param._fileFlag ){
		string += "" + num + ": ";
	}
	if( skipFlag ){
		string += "SKIP ";
	}
	var code  = new _Integer();
	var token = new _Void();
	line.beginGetToken();
	var i = 0;
	while( line.getTokenParam( param, code, token ) ){
		if( i == 0 ){
			traceString += string;
		} else {
			traceString += " ";
		}

		traceString += (new _Token()).tokenString( param, code.val(), token.obj() );

		if( traceLevel >= 2 ){
			if( traceLevel == 3 ){
				if( code.val() == _CLIP_CODE_LABEL ){
					for( var j = 0; j < token.obj().length; j++ ){
						traceString += "," + token.obj().charCodeAt( j );
					}
				}
			}
			traceString += "(" + codeString( code.val() ) + ")";
		}

		i++;
	}
	if( comment != null ){
		if( i == 0 ){
			traceString += string;
		} else {
			traceString += " ";
		}

		traceString += "#" + comment;
	}
	if( (i > 0) || (comment != null) ){
		traceString += "\n";
	}
}
function printTest( param, line, num, comment ){
	var string = new String();
	if( param._funcName != null ){
		string += "" + param._funcName + ":";
	}
	if( param._fileFlag ){
		string += "" + num + ": ";
	}
	var code  = new _Integer();
	var token = new _Void();
	line.beginGetToken();
	var i = 0;
	while( line.getTokenParam( param, code, token ) ){
		if( i == 0 ){
			con.print( string );
		} else {
			con.print( " " );
		}

		con.print( (new _Token()).tokenString( param, code.val(), token.obj() ) );

		if( traceLevel >= 2 ){
			con.setColor( "0000ff" );
			if( traceLevel == 3 ){
				if( code.val() == _CLIP_CODE_LABEL ){
					for( var j = 0; j < token.obj().length; j++ ){
						con.print( "," + token.obj().charCodeAt( j ) );
					}
				}
			}
			con.print( "(" + codeString( code.val() ) + ")" );
			con.setColor();
		}

		i++;
	}
	if( comment != null ){
		if( i == 0 ){
			con.print( string );
		}

		con.setColor( "007f00" );
		con.print( " #" + (new _String( comment )).escape().str() );
		con.setColor();
	}
	if( (i > 0) || (comment != null) ){
		con.println();
	}
}
function getMatrixString( param, array, indent, sp, br ){
	var _token = new _Token();

	var i;
	var code   = new _Integer();
	var token  = new _Void();
	var string = new String();
	var enter  = false;

	array.beginGetToken();
	while( array.getToken( code, token ) ){
		if( enter ){
			if( code.val() == _CLIP_CODE_ARRAY_TOP ){
				string += br;
				for( i = 0; i < indent; i++ ){
					string += sp;
				}
			}
			enter = false;
		}
		string += _token.tokenString( param, code.val(), token.obj() );
		string += sp;
		if( code.val() == _CLIP_CODE_ARRAY_TOP ){
			indent += 2;
		}
		if( code.val() == _CLIP_CODE_ARRAY_END ){
			indent -= 2;
			enter = true;
		}
	}

	return string;
}
function printMatrix( param, array, indent ){
	con.println( getMatrixString( param, array, indent, "&nbsp;", consoleBreak() ) );
}
function printAnsMatrix( param, array ){
	con.setBold( true );
	printMatrix( param, array, 0 );
	con.setBold( false );
}
function printAnsComplex( real, imag ){
	con.setBold( true );
	con.println( real + imag );
	con.setBold( false );
}
function printWarn( warn ){
	con.newLine();
	if( englishFlag ) con.println( "Warning: " + warn );
	else              con.println( "警告: " + warn );
}
function printError( error ){
	con.newLine();
	if( englishFlag ) con.println( "Error: " + error );
	else              con.println( "エラー: " + error );
}

function doFuncGColor( rgb ){
	var i, j;
	var r = (rgb & 0xFF0000) >> 16;
	var g = (rgb & 0x00FF00) >> 8;
	var b =  rgb & 0x0000FF;
	var rr, gg, bb;
	var d, tmp;
	for( i = 0, j = -1; i < 256; i++ ){
		rr =  COLOR_WIN[i] & 0x0000FF;
		gg = (COLOR_WIN[i] & 0x00FF00) >> 8;
		bb = (COLOR_WIN[i] & 0xFF0000) >> 16;
		tmp = Math.abs( rr - r ) + Math.abs( gg - g ) + Math.abs( bb - b );
		if( (j < 0) || (tmp < d) ){
			j = i;
			d = tmp;
		}
	}
	return j;
}
function doFuncGColor24( index ){
	return ((COLOR_WIN[index] & 0x0000FF) << 16) + (COLOR_WIN[index] & 0x00FF00) + ((COLOR_WIN[index] & 0xFF0000) >> 16);
}
function doFuncEval( parentProc, parentParam, string, value ){
	var ret;

	// 親プロセスの環境を受け継いで、子プロセスを実行する
	var childProc = new _Proc( parentParam.mode(), parentProc.assertFlag(), parentProc.warnFlag(), parentProc.gUpdateFlag() );
	var childParam = new _Param( parentParam, true );
	childParam.setEnableCommand( false );
	childParam.setEnableStat( false );
_TRY
	ret = parentProc.doFuncEval( childProc, childParam, string, value );
_CATCH
	childParam.end();
	childProc.end();

	return ret;
}

function doCommandClear(){
	con.clear();
}
function doCommandPrint( topPrint, flag ){
	con.setColor( "ff00ff" );
	var cur = topPrint;
	while( cur != null ){
		if( cur.string() != null ){
			var tmp = new _String( cur.string() );
			tmp.escape().replaceNewLine( consoleBreak() );
			con.print( tmp.str() );
		}
		cur = cur.next();
	}
	if( flag ){
		con.println();
	}
	con.setColor();
}
function skipCommandLog(){
	return (traceLevel == 0);
}
function doCommandLog( topPrint ){
	var cur = topPrint;
	while( cur != null ){
		if( cur.string() != null ){
			traceString += cur.string();
		}
		cur = cur.next();
	}
	traceString += "\n";
}
function doCommandScan( _this, topScan, param ){
	var defString = new String();
	var newString = new String();

	var cur = topScan;
	while( cur != null ){
		defString = cur.getDefString( _this, param );

		newString = prompt( cur.title(), defString );
		if( (newString == null) || (newString.length == 0) ){
			newString = defString;
		}

		cur.setNewValue( newString, _this, param );

		cur = cur.next();
	}
}
function doCommandGWorld( gWorld, width, height ){
	if( (width <= 0) || (height <= 0) ){
		var canvas = document.getElementById( "canvas0" );
		canvas.setAttribute( "width" , "1" );
		canvas.setAttribute( "height", "1" );

		var div1 = document.getElementById( "savecanvas" );
		div1.style.display = "none";

		var div2 = document.getElementById( "gworld" );
		div2.style.width   = "1px";
		div2.style.height  = "1px";
		div2.style.display = "none";

		var div3 = document.getElementById( "body" );
		div3.style.width = "640px";
	} else {
		var div1 = document.getElementById( "body" );
		div1.style.width = "" + (640 + width + 2 + 5) + "px";

		var div2 = document.getElementById( "gworld" );
		div2.style.width   = "" + width  + "px";
		div2.style.height  = "" + height + "px";
		div2.style.display = "block";

		var div3 = document.getElementById( "savecanvas" );
		div3.style.display = "block";

		var canvas = document.getElementById( "canvas0" );
		canvas.setAttribute( "width" , "" + width  );
		canvas.setAttribute( "height", "" + height );
	}

	gWorld.create( width, height, true );
}
function doCommandWindow( gWorld, left, bottom, right, top ){
	gWorld.setWindowIndirect( left, bottom, right, top );
}
function gWorldClear( gWorld, color ){
	if( lockGUpdate ){
		needGUpdate = true;
		return;
	}
	canvasClear();
	canvasSetColor( COLOR_WIN[color] );
	canvasFill( 0, 0, gWorld.width(), gWorld.height() );
	canvasSetColor( COLOR_WIN[gWorld.color()] );
}
function gWorldSetColor( gWorld, color ){
	if( lockGUpdate ){
		return;
	}
	canvasSetColor( COLOR_WIN[color] );
}
function gWorldPutColor( gWorld, x, y, color ){
	if( lockGUpdate ){
		needGUpdate = true;
		return;
	}
	if( topProc.gUpdateFlag() ){
		canvasSetColor( COLOR_WIN[color] );
		canvasPut( x, y );
		canvasSetColor( COLOR_WIN[gWorld.color()] );
	}
}
function gWorldPut( gWorld, x, y ){
	if( lockGUpdate ){
		needGUpdate = true;
		return;
	}
	if( topProc.gUpdateFlag() ){
		canvasPut( x, y );
	}
}
function gWorldFill( gWorld, x, y, w, h ){
	if( lockGUpdate ){
		needGUpdate = true;
		return;
	}
	if( topProc.gUpdateFlag() ){
		canvasFill( x, y, w, h );
	}
}
function gWorldLine( gWorld, x1, y1, x2, y2 ){
	if( lockGUpdate ){
		needGUpdate = true;
		return;
	}
	if( topProc.gUpdateFlag() ){
		canvasLine( x1, y1, x2, y2 );
	}
}
function doCommandGColor( color, rgb ){
	COLOR_WIN[color] = ((rgb & 0x0000FF) << 16) + (rgb & 0x00FF00) + ((rgb & 0xFF0000) >> 16);
	needGUpdate = true;
}
function gUpdate( gWorld ){
	canvasClear();

	var image  = gWorld.image ();
	var offset = gWorld.offset();
	var width  = gWorld.width ();
	var height = gWorld.height();
	var x, y, yy;
	for( y = 0; y < height; y++ ){
		yy = y * offset;
		for( x = 0; x < width; x++ ){
			canvasSetColor( COLOR_WIN[image[yy + x]] );
			canvasPut( x, y );
		}
	}
	canvasSetColor( COLOR_WIN[gWorld.color()] );
}
function doCommandGUpdate( gWorld ){
	if( lockGUpdate ){
		needGUpdate = true;
		return;
	}
	gUpdate( gWorld );
}
function doCommandPlot( parentProc, parentParam, graph, start, end, step ){
	// 親プロセスの環境を受け継いで、子プロセスを実行する
	var childProc = new _Proc( parentParam.mode(), parentProc.assertFlag(), parentProc.warnFlag(), false/*グラフィック画面更新OFF*/ );
	var childParam = new _Param( parentParam, true );
	childParam.setEnableCommand( false );
	childParam.setEnableStat( false );
_TRY
	parentProc.doCommandPlot( childProc, childParam, graph, start, end, step );
_CATCH
	childParam.end();
	childProc.end();
}
function doCommandRePlot( parentProc, parentParam, graph, start, end, step ){
	// 親プロセスの環境を受け継いで、子プロセスを実行する
	var childProc = new _Proc( parentParam.mode(), parentProc.assertFlag(), parentProc.warnFlag(), false/*グラフィック画面更新OFF*/ );
	var childParam = new _Param( parentParam, true );
	childParam.setEnableCommand( false );
	childParam.setEnableStat( false );
_TRY
	parentProc.doCommandRePlot( childProc, childParam, graph, start, end, step );
_CATCH
	childParam.end();
	childProc.end();
}
function doCommandUsage( topUsage ){
	if( !addExtFuncList ){
		con.setColor( "ff00ff" );
	}
	var cur = topUsage;
	while( cur != null ){
		if( cur.string() != null ){
			con.print( (new _String( cur.string() )).escape().str() );
			if( addExtFuncList ){
				break;
			}
			con.println();
		}
		cur = cur.next();
	}
	if( !addExtFuncList ){
		con.setColor();
	}
}
function doCommandDumpVar( param, index ){
	var _token = new _Token();

	var real = new _String();
	var imag = new _String();
	var label;
	var string = "";

	_token.valueToString( param, param.val( index ), real, imag );

	if( (label = param._var._label._label[index]) != null ){
		string = label;
		if( param._var._label.flag( index ) != _LABEL_MOVABLE ){
			string += "(@" + String.fromCharCode( index ) + ")";
		}
	} else {
		string = "@" + String.fromCharCode( index );
	}

	traceString += string + "=" + real.str() + imag.str();
	traceString += "\n";
}
function doCommandDumpArray( param, index ){
	var array = new _Token();
	var label;
	var string = "";

	param._array.makeToken( array, index );

	if( (label = param._array._label._label[index]) != null ){
		string = label;
		if( param._array._label.flag( index ) != _LABEL_MOVABLE ){
			string += "(@@" + String.fromCharCode( index ) + ")";
		}
	} else {
		string = "@@" + String.fromCharCode( index );
	}
	string += " ";

	traceString += string + getMatrixString( param, array, string.length, " ", "\n" );
	traceString += "\n";
}
function doCustomCommand( _this, param, code, token ){
	switch( token ){
	case _CLIP_COMMAND_CUSTOM_ENGLISH:
	case _CLIP_COMMAND_CUSTOM_JAPANESE:
		englishFlag = (token == _CLIP_COMMAND_CUSTOM_ENGLISH) ? true : false;

		if( englishFlag ){
			con.print( "Change English mode. " );
		} else {
			con.print( "Change Japanese mode. " );
		}

		updateLanguage();

		preference.set( PROFILE_PREFIX + "ENV_Language", englishFlag ? "" + LANG_ENGLISH : "" + LANG_JAPANESE );

		break;
	case _CLIP_COMMAND_CUSTOM_ENV:
		{
			con.setColor( "0000ff" );

			con.println( "calculator " + (param.isCalculator() ? "TRUE" : "FALSE") );

			con.println( (param.base() == 0) ? "zero-based" : "one-based" );

			switch( param.mode() ){
			case _CLIP_MODE_E_FLOAT:   con.print( "efloat"   ); break;
			case _CLIP_MODE_F_FLOAT:   con.print( "float"    ); break;
			case _CLIP_MODE_G_FLOAT:   con.print( "gfloat"   ); break;
			case _CLIP_MODE_E_COMPLEX: con.print( "ecomplex" ); break;
			case _CLIP_MODE_F_COMPLEX: con.print( "complex"  ); break;
			case _CLIP_MODE_G_COMPLEX: con.print( "gcomplex" ); break;
			case _CLIP_MODE_I_FRACT:   con.print( "fract"    ); break;
			case _CLIP_MODE_M_FRACT:   con.print( "mfract"   ); break;
			case _CLIP_MODE_H_TIME:    con.print( "htime"    ); break;
			case _CLIP_MODE_M_TIME:    con.print( "mtime"    ); break;
			case _CLIP_MODE_S_TIME:    con.print( "time"     ); break;
			case _CLIP_MODE_F_TIME:    con.print( "ftime"    ); break;
			case _CLIP_MODE_S_CHAR:    con.print( "char"     ); break;
			case _CLIP_MODE_U_CHAR:    con.print( "uchar"    ); break;
			case _CLIP_MODE_S_SHORT:   con.print( "short"    ); break;
			case _CLIP_MODE_U_SHORT:   con.print( "ushort"   ); break;
			case _CLIP_MODE_S_LONG:    con.print( "long"     ); break;
			case _CLIP_MODE_U_LONG:    con.print( "ulong"    ); break;
			}
			con.print( ", " ); con.print( "fps " + param.fps() );
			con.print( ", " ); con.print( "prec " + param.prec() );
			con.print( ", " ); con.print( "radix " + param.radix() );
			con.print( ", " );
			var type       = new _Integer();
			var updateFlag = new _Boolean();
			_this.getAngType( type, updateFlag );
			switch( type.val() ){
			case _ANG_TYPE_RAD:  con.print( "rad"  ); break;
			case _ANG_TYPE_DEG:  con.print( "deg"  ); break;
			case _ANG_TYPE_GRAD: con.print( "grad" ); break;
			}
			con.println();

			con.print( "assert " + (_this.assertFlag() ? "TRUE" : "FALSE") );
			con.print( ", " ); con.print( "warn "    + (_this.warnFlag()    ? "TRUE" : "FALSE") );
//			con.print( ", " ); con.print( "gupdate " + (_this.gUpdateFlag() ? "TRUE" : "FALSE") );
			con.println();

			var left   = _this.gWorld().wndPosX( 0                       );
			var top    = _this.gWorld().wndPosY( 0                       );
			var right  = _this.gWorld().wndPosX( _this.gWorld().width () );
			var bottom = _this.gWorld().wndPosY( _this.gWorld().height() );
			con.println( "gworld " + _this.gWorld().width() + " " + _this.gWorld().height() );
			con.println( "window " + left + " " + bottom + " " + right + " " + top );

			switch( _this.graph().mode() ){
			case _GRAPH_MODE_RECT:  con.print( "rectangular" ); break;
			case _GRAPH_MODE_PARAM: con.print( "parametric"  ); break;
			case _GRAPH_MODE_POLAR: con.print( "polar"       ); break;
			}
			con.print( ", " );
			if( _this.graph().isLogScaleX() ){
				con.print( "logscale x " + _this.graph().logBaseX() );
			} else {
				con.print( "nologscale x" );
			}
			con.print( ", " );
			if( _this.graph().isLogScaleY() ){
				con.print( "logscale y " + _this.graph().logBaseY() );
			} else {
				con.print( "nologscale y" );
			}
			con.println();

			con.setColor();
		}
		break;
	case _CLIP_COMMAND_CUSTOM_LIST:
	case _CLIP_COMMAND_CUSTOM_LISTD:
		{
			var newCode  = new _Integer();
			var newToken = new _Void();
			if( _this.curLine().getTokenParam( param, newCode, newToken ) ){
				if( (newCode.val() & _CLIP_CODE_ARRAY_MASK) != 0 ){
					if( newCode.val() == _CLIP_CODE_GLOBAL_ARRAY ){
						param = globalParam();
					}

					var index = _this.arrayIndexIndirect( param, newCode.val(), newToken.obj() );
					var array = new _Token();
					var label;
					var string = "";

					param._array.makeToken( array, index );

					if( (label = param._array._label._label[index]) != null ){
						string = label;
						if( param._array._label.flag( index ) != _LABEL_MOVABLE ){
							string += "(@@" + String.fromCharCode( index ) + ")";
						} else if( token == _CLIP_COMMAND_CUSTOM_LISTD ){
							string += "(@@:" + index + ")";
						}
					} else {
						string = "@@" + String.fromCharCode( index );
					}
					string += " ";

					con.setColor( "0000ff" );
					con.print( string );
					printMatrix( param, array, string.length );
					con.setColor();

					break;
				} else if( newCode.val() == _CLIP_CODE_EXTFUNC ){
					var func = new _String( newToken.obj() );
					var data = _this.getExtFuncData( func, null );
					if( data != null ){
						con.setColor( "0000ff" );
						for( var i = 0; i < data.length; i++ ){
							con.println( (new _String( data[i] )).escape().str() );
						}
						con.setColor();

						break;
					}
				}
			} else {
				var _token = new _Token();

				var index;
				var real = new _String();
				var imag = new _String();
				var label;

				con.setColor( "0000ff" );
				for( var step = 0; step < 4; step++ ){
					var tmp = new Array();
					var i = 0;
					for( index = 0; index < 256; index++ ){
						switch( index ){
						case 0:
							if( step == 3 ){
								if( (label = param._var._label._label[index]) != null ){
									_token.valueToString( param, param.val( index ), real, imag );
									tmp[i] = label + "(@)=" + real.str() + imag.str();
									i++;
								} else if( !(param.isZero( index )) ){
									_token.valueToString( param, param.val( index ), real, imag );
									tmp[i] = "@ =" + real.str() + imag.str();
									i++;
								}
							}
							break;
						case _CHAR_CODE_EX:
						case _CHAR_CODE_0:
						case _CHAR_CODE_1:
						case _CHAR_CODE_2:
						case _CHAR_CODE_3:
						case _CHAR_CODE_4:
						case _CHAR_CODE_5:
						case _CHAR_CODE_6:
						case _CHAR_CODE_7:
						case _CHAR_CODE_8:
						case _CHAR_CODE_9:
							if( step == 1 ){
								if( (label = param._var._label._label[index]) != null ){
									_token.valueToString( param, param.val( index ), real, imag );
									tmp[i] = label + "(@" + String.fromCharCode( index ) + ")=" + real.str() + imag.str();
									i++;
								} else if( !(param.isZero( index )) ){
									_token.valueToString( param, param.val( index ), real, imag );
									tmp[i] = "@" + String.fromCharCode( index ) + "=" + real.str() + imag.str();
									i++;
								}
							}
							break;
						default:
							if( step == 0 ){
								if( (label = param._var._label._label[index]) != null ){
									if( param._var._label.flag( index ) == _LABEL_MOVABLE ){
										_token.valueToString( param, param.val( index ), real, imag );
										if( token == _CLIP_COMMAND_CUSTOM_LISTD ){
											tmp[i] = label + "(@:" + index + ")=" + real.str() + imag.str();
										} else {
											tmp[i] = label + "=" + real.str() + imag.str();
										}
										i++;
									}
								}
							}
							if( step == 2 ){
								if( (label = param._var._label._label[index]) != null ){
									if( param._var._label.flag( index ) != _LABEL_MOVABLE ){
										_token.valueToString( param, param.val( index ), real, imag );
										tmp[i] = label + "(@" + String.fromCharCode( index ) + ")=" + real.str() + imag.str();
										i++;
									}
								} else if( !(param.isZero( index )) ){
									_token.valueToString( param, param.val( index ), real, imag );
									tmp[i] = "@" + String.fromCharCode( index ) + "=" + real.str() + imag.str();
									i++;
								}
							}
							break;
						}
					}
					tmp.sort( function( a, b ){
						a = a.toLowerCase();
						b = b.toLowerCase();
						if( a < b ){
							return -1;
						} else if( a > b ){
							return 1;
						}
						return 0;
					} );
					for( i = 0; i < tmp.length; i++ ){
						con.println( tmp[i] );
					}
				}
				con.setColor();

				break;
			}
		}
		return _CLIP_PROC_ERR_COMMAND_NULL;
	case _CLIP_COMMAND_CUSTOM_EXTFUNC:
		{
			var i, j;

			addExtFuncList = true;

			con.setColor( "0000ff" );

			var tmp = new Array();
			for( i = 0, j = 0; i < extFuncData.length; i++ ){
				var name = extFuncName( extFuncFile[i] );
				if( name.length > 0 ){
					tmp[j] = name;
					j++;
				}
			}
			tmp.sort( function( a, b ){
				a = a.toLowerCase();
				b = b.toLowerCase();
				if( a < b ){
					return -1;
				} else if( a > b ){
					return 1;
				}
				return 0;
			} );
			for( i = 0; i < tmp.length; i++ ){
				if( tmp[i].indexOf( ".inc" ) >= 0 ){
					con.println( "<i>" + tmp[i] + "</i>" );
				} else {
					con.print( tmp[i] + "&nbsp;-&nbsp;" );
					_this.usage( tmp[i], param, false/*キャッシュOFF*/ );
					con.println();
				}
			}

			con.setColor();

			addExtFuncList = false;

			break;
		}
		return _CLIP_PROC_ERR_COMMAND_NULL;
	case _CLIP_COMMAND_CUSTOM_USAGE:
		{
			var newCode  = new _Integer();
			var newToken = new _Void();
			if( _this.curLine().getToken( newCode, newToken ) ){
				if( newCode.val() == _CLIP_CODE_EXTFUNC ){
					_this.usage( newToken.obj(), param, true/*キャッシュON*/ );
					break;
				}
			}
		}
		return _CLIP_PROC_ERR_COMMAND_NULL;
	case _CLIP_COMMAND_CUSTOM_TEST:
		{
			var value = new _Matrix();
			if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
				testFlag = (_INT( value.toFloat( 0, 0 ) ) != 0);
				break;
			}
		}
		return _CLIP_PROC_ERR_COMMAND_NULL;
	case _CLIP_COMMAND_CUSTOM_TRACE:
		{
			var value = new _Matrix();
			if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
				if( (traceLevel > 0) && (traceString.length > 0) ){
					if( canUseWriteFile() ){
						writeFile( "clip_trace_" + time() + ".log", traceString );
					}
				}
				traceString = "";

				traceLevel = _INT( value.toFloat( 0, 0 ) );
				setProcTraceFlag( traceLevel > 0 );

				break;
			}
		}
		return _CLIP_PROC_ERR_COMMAND_NULL;
	default:
		return _CLIP_PROC_ERR_COMMAND_NULL;
	}
	return _CLIP_NO_ERR;
}

function onWriteFileEnd( fileEntry ){
	con.println( "<b>[" + fileEntry.fullPath + "]</b>" );
}

function onStartPlot(){
	procError.delAll();

	setProcTraceFlag( false );
	silentErr = true;
}
function onEndPlot(){
	setProcTraceFlag( traceLevel > 0 );
	silentErr = false;

	var err   = new _Integer();
	var num   = new _Integer();
	var func  = new _String();
	var token = new _String();
	var string;
	for( var i = 0; i < procError.num(); i++ ){
		procError.get( i, err, num, func, token );
		string = getErrorString( err.val(), num.val(), func.str(), token.str() );
		if( string.length > 0 ){
			con.newLine();
			con.println( string );
		}
	}
}
function onStartRePlot(){
	onStartPlot();
}
function onEndRePlot(){
	onEndPlot();
}

function addLogExpr(){
}

function updateLanguage(){
	document.getElementById( "button_cache_clear"   ).innerHTML = "&nbsp;&nbsp;" + (englishFlag ? "Clear cache" : "外部関数ｷｬｯｼｭのｸﾘｱ") + "&nbsp;&nbsp;";
	document.getElementById( "button_storage_clear" ).innerHTML = "&nbsp;&nbsp;" + (englishFlag ? "Clear storage" : "ｽﾄﾚｰｼﾞのｸﾘｱ") + "&nbsp;&nbsp;";
	document.getElementById( "button_cookie_clear"  ).innerHTML = "&nbsp;&nbsp;" + (englishFlag ? "Clear cookie" : "Cookieのｸﾘｱ") + "&nbsp;&nbsp;";
	document.getElementById( "button_callfunc"      ).innerHTML = "&nbsp;&nbsp;" + (englishFlag ? "Call" : "呼び出し") + "&nbsp;&nbsp;";
	document.getElementById( "button_savefunc"      ).innerHTML = "&nbsp;&nbsp;" + (englishFlag ? "Save to memory" : "メモリ保存") + "&nbsp;&nbsp;";
	document.getElementById( "button_savecanvas"    ).innerHTML = "&nbsp;&nbsp;" + (englishFlag ? "Download" : "ダウンロード") + "&nbsp;&nbsp;";
	document.getElementById( "static_tab"           ).innerHTML = (englishFlag ? "Tab width" : "Tab幅") + ":&nbsp;";
	document.getElementById( "static_smart"         ).innerHTML = englishFlag ? "Smart" : "スマート";

	document.getElementById( "static_command_env"              ).innerHTML = englishFlag ? "List environment" : "環境の一覧";
	document.getElementById( "static_command_list_var"         ).innerHTML = englishFlag ? "List variables" : "変数の一覧";
	document.getElementById( "static_command_print_array_help" ).innerHTML = englishFlag ? "List elements of array" : "配列の要素一覧";
	document.getElementById( "static_command_list_extfunc"     ).innerHTML = englishFlag ? "List external functions" : "外部関数の一覧";
	document.getElementById( "static_command_print_usage"      ).innerHTML = englishFlag ? "Print usage of external function" : "外部関数の使用法表示";
	document.getElementById( "static_command_trace"            ).innerHTML = englishFlag ? "Trace level" : "トレース・レベル";

	if( englishFlag ){
		document.getElementById( "lang_japanese" ).style.display = "none";
		document.getElementById( "lang_english"  ).style.display = "block";

		con.println( "Type &apos;:japanese&apos; to Japanese mode." );
	} else {
		document.getElementById( "lang_english"  ).style.display = "none";
		document.getElementById( "lang_japanese" ).style.display = "block";

		con.println( "Type &apos;:english&apos; to English mode." );
	}
}

// エディタ関連
var needSaveFunc = false;
function onEditorUpdateText( len ){
	document.getElementById( "static_len" ).innerHTML = "" + len;

	needSaveFunc = true;
	document.getElementById( "clip_savefunc" ).style.display = "block";
}
function getFunc( chr ){
	return preference.get( PROFILE_PREFIX + "!" + chr, "" );
}
function setFunc( chr, text ){
	preference.set( PROFILE_PREFIX + "!" + chr, text );

	// 外部関数キャッシュのクリア
	topProc.clearFuncCache( "!" + chr );
}
function loadFunc(){
	var text = getFunc( String.fromCharCode( curFunc ) );
	editor.setText( text );

	document.getElementById( "static_len" ).innerHTML = "" + text.length;
}
function saveFunc(){
	if( needSaveFunc ){
		var chr = String.fromCharCode( curFunc );

		var text = editor.text();
		setFunc( chr, "" + text );

		var len = text.length;
		var savedLen = getFunc( chr ).length;
		if( len != savedLen ){
			var imax = len - savedLen;
			for( var i = 1; i <= imax; i++ ){
				text = text.substring( 0, len - i );
				setFunc( chr, "" + text );
				savedLen = getFunc( chr ).length;
				if( text.length == savedLen ){
					break;
				}
			}
		}
		if( len != savedLen ){
			document.getElementById( "static_len" ).innerHTML = "" + len + " (" + (len - savedLen) + " over)";
		}

		updateSelectFunc1( document.getElementById( "select_func" ), curFunc - 97 );

		needSaveFunc = false;
		document.getElementById( "clip_savefunc" ).style.display = "none";
	}
}
function doChangeFunc( select ){
	saveFunc();

	selFunc = select.selectedIndex;
	curFunc = select.options[selFunc].value;

	loadFunc();

	preference.set( PROFILE_PREFIX + "EDITOR_SelFunc", "" + selFunc );
}
function callFunc(){
	saveFunc();

	var input = document.getElementById( "input0" );
	var val = input.value;
	var pos = input.selectionStart;

	var tmp = "!!" + String.fromCharCode( curFunc ) + " ";
	input.value = val.substr( 0, pos ) + tmp + val.slice( pos );
	input.setSelectionRange( pos + tmp.length, pos + tmp.length );
	input.focus();
}
function onChangeTabWidth(){
	var tabWidth = parseInt( document.getElementById( "tab_width" ).value );
	if( tabWidth < 0 ){
		tabWidth = 0;
		document.getElementById( "tab_width" ).value = "" + tabWidth;
	}
	cssSetPropertyValue( ".textarea_func", "tab-size", "" + tabWidth );

	preference.set( PROFILE_PREFIX + "EDITOR_Tab", "" + tabWidth );
}
function doCheckSmart(){
	setEditorSmartFlag( document.getElementById( "check_smart" ).checked );

	preference.set( PROFILE_PREFIX + "EDITOR_Smart", "" + (editorSmartFlag() ? 1 : 0) );
}

function updateSelectFunc1( select, i ){
	var index = 97 + i;
	var data = getFunc( String.fromCharCode( index ) );
	if( data.length == 0 ){
		select.options[i].innerHTML = "" + String.fromCharCode( index );
	} else {
		select.options[i].innerHTML = "" + String.fromCharCode( index ) + "&nbsp;&nbsp;" + makeExtFuncData( data, false )[0];
	}
}
function updateSelectFunc(){
	var select = document.getElementById( "select_func" );
	for( var i = 0; i < 26; i++ ){
		updateSelectFunc1( select, i );
	}
}

function saveCanvas(){
	var canvas = document.getElementById( "canvas0" );
	var data = canvas.toDataURL( "image/png" ).replace( "image/png", "image/octet-stream" );
	window.open( data, "save" );
}