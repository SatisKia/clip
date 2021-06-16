var testFlag = false;
var traceLevel = 0;
var traceString = new String();
var extFuncFile = new Array();
var extFuncData = new Array();
function cssGetPropertyValue( selector, property ){
 var i, j;
 var value = new String();
 var styleSheets = document.styleSheets;
 var styleSheet;
 var rules;
 var rule;
 for( i = 0; i < styleSheets.length; i++ ){
  styleSheet = styleSheets[i];
  rules = styleSheet.rules || styleSheet.cssRules;
  for( j = 0; j < rules.length; j++ ){
   rule = rules[j];
   if( rule.selectorText == selector ){
    value = rule.style.getPropertyValue( property );
   }
  }
 }
 return value;
}
function cssSetPropertyValue( selector, property, value ){
 var i, j;
 var styleSheets = document.styleSheets;
 var styleSheet;
 var rules;
 var rule;
 for( i = 0; i < styleSheets.length; i++ ){
  styleSheet = styleSheets[i];
  rules = styleSheet.rules || styleSheet.cssRules;
  for( j = 0; j < rules.length; j++ ){
   rule = rules[j];
   if( rule.selectorText == selector ){
    rule.style.setProperty( property, value );
   }
  }
 }
}
var _css_display_none = null;
var _css_display_block = null;
function cssLockStyleDisplay(){
 _css_display_none = new Array();
 _css_display_block = new Array();
}

function cssSetStyleDisplay( element, flag ){
 if( _css_display_none == null ){
  element.style.display = flag ? "block" : "none";
 } else if( flag ){
  _css_display_block[_css_display_block.length] = element;
 } else {
  _css_display_none[_css_display_none.length] = element;
 }
}
function cssSetStyleDisplayById( id, flag ){
 cssSetStyleDisplay( document.getElementById( id ), flag );
}

function cssUnlockStyleDisplay(){
 var i;
 for( i = 0; i < _css_display_none.length; i++ ){
  _css_display_none[i].style.display = "none";
 }
 for( i = 0; i < _css_display_block.length; i++ ){
  _css_display_block[i].style.display = "block";
 }
 _css_display_none = null;
 _css_display_block = null;
}
function canUseCookie(){
 return navigator.cookieEnabled;
}
var _cookie_expires = "Tue, 01 Jan 2030 00:00:00 GMT";
function setExpiresDate( date ){
 _cookie_expires = (new Date( currentTimeMillis() + date * 86400000 )).toGMTString();
}
function _getCookieArray(){
 return document.cookie.split( ";" );
}
function _getCookieParam( cookie ){
 var param = cookie.split( "=" );
 param[0] = param[0].replace( new RegExp( "^\\s+" ), "" );
 return param;
}
function cookieNum(){
 if( document.cookie.length == 0 ){
  return 0;
 }
 return _getCookieArray().length;
}
function getCookieKey( index ){
 if( document.cookie.length == 0 ){
  return "";
 }
 var cookie = _getCookieArray();
 if( index >= cookie.length ){
  return "";
 }
 var param = _getCookieParam( cookie[index] );
 return param[0];
}
function getCookie( key, defValue ){
 var cookie = _getCookieArray();
 for( var i = 0; i < cookie.length; i++ ){
  var param = _getCookieParam( cookie[i] );
  if( param[0] == key ){
   return unescape( param[1] );
  }
 }
 return defValue;
}
function setCookie( key, value ){
 if( value == null ){
  value = "";
 }
 var expires = _cookie_expires;
 if( value.length == 0 ){
  var date = new Date();
  date.setTime( 0 );
  expires = date.toGMTString();
 }
 document.cookie = key + "=" + escape( value ) + "; expires=" + expires;
}
function clearCookie( prefix ){
 var cookie = _getCookieArray();
 for( var i = cookie.length - 1; i >= 0; i-- ){
  var param = _getCookieParam( cookie[i] );
  if( (prefix == undefined) || (param[0].indexOf( prefix ) == 0) ){
   setCookie( param[0], "" );
  }
 }
}
var _cookie_val;
var _cookie_s;
var _cookie_str;
function beginCookieRead( key ){
 _cookie_val = getCookie( key, "" );
 _cookie_s = 0;
}
function cookieRead(){
 if( _cookie_s >= _cookie_val.length ){
  _cookie_str = "";
 } else {
  var e = _cookie_val.indexOf( "&", _cookie_s );
  if( e < 0 ){
   e = _cookie_val.length;
  }
  _cookie_str = _cookie_val.substring( _cookie_s, e );
  _cookie_s = e + 1;
 }
 return unescape( _cookie_str );
}
function endCookieRead(){
 _cookie_val = "";
 _cookie_str = "";
}
function beginCookieWrite(){
 _cookie_val = "";
}
function cookieWrite( str ){
 if( _cookie_val.length > 0 ){
  _cookie_val += "&";
 }
 _cookie_val += escape( str );
}
function endCookieWrite( key ){
 setCookie( key, _cookie_val );
 _cookie_val = "";
}
function canUseStorage(){
 try {
  return window.localStorage != null;
 } catch( e ){}
 return false;
}
function storageNum(){
 return window.localStorage.length;
}
function getStorageKey( index ){
 if( index >= storageNum() ){
  return "";
 }
 return window.localStorage.key( index );
}
function getStorage( key, defValue ){
 var value = window.localStorage.getItem( key );
 return (value == null) ? defValue : value;
}
function setStorage( key, value ){
 if( (value != null) && (value.length > 0) ){
  window.localStorage.setItem( key, value );
 } else {
  window.localStorage.removeItem( key );
 }
}
function clearStorage( prefix ){
 if( prefix == undefined ){
  window.localStorage.clear();
 } else {
  var num = storageNum();
  var key;
  for( var i = num - 1; i >= 0; i-- ){
   key = getStorageKey( i );
   if( (prefix == undefined) || (key.indexOf( prefix ) == 0) ){
    setStorage( key, null );
   }
  }
 }
}
var _storage_val;
var _storage_s;
var _storage_str;
function beginStorageRead( key ){
 _storage_val = getStorage( key, "" );
 _storage_s = 0;
}
function storageRead(){
 if( _storage_s >= _storage_val.length ){
  _storage_str = "";
 } else {
  var e = _storage_val.indexOf( "&", _storage_s );
  if( e < 0 ){
   e = _storage_val.length;
  }
  _storage_str = _storage_val.substring( _storage_s, e );
  _storage_s = e + 1;
 }
 return unescape( _storage_str );
}
function endStorageRead(){
 _storage_val = "";
 _storage_str = "";
}
function beginStorageWrite(){
 _storage_val = "";
}
function storageWrite( str ){
 if( _storage_val.length > 0 ){
  _storage_val += "&";
 }
 _storage_val += escape( str );
}
function endStorageWrite( key ){
 setStorage( key, _storage_val );
 _storage_val = "";
}
function _Preference( useStorage ){
 this.s = (useStorage && canUseStorage());
 this.c = canUseCookie();
}
_Preference.prototype = {
 num : function(){
  if( this.s ){
   return storageNum();
  } else if( this.c ){
   return cookieNum();
  }
  return 0;
 },
 getKey : function( index ){
  if( this.s ){
   return getStorageKey( index );
  } else if( this.c ){
   return getCookieKey( index );
  }
  return null;
 },
 get : function( key, defValue ){
  if( this.s ){
   return getStorage( key, defValue );
  } else if( this.c ){
   return getCookie( key, defValue );
  }
  return defValue;
 },
 set : function( key, value ){
  if( this.s ){
   setStorage( key, value );
  } else if( this.c ){
   setCookie( key, value );
  }
 },
 clear : function( prefix ){
  if( this.s ){
   clearStorage( prefix );
  } else if( this.c ){
   clearCookie( prefix );
  }
 },
 beginRead : function( key ){
  if( this.s ){
   beginStorageRead( key );
  } else if( this.c ){
   beginCookieRead( key );
  }
 },
 read : function(){
  if( this.s ){
   return storageRead();
  } else if( this.c ){
   return cookieRead();
  }
  return "";
 },
 endRead : function(){
  if( this.s ){
   endStorageRead();
  } else if( this.c ){
   endCookieRead();
  }
 },
 beginWrite : function(){
  if( this.s ){
   beginStorageWrite();
  } else if( this.c ){
   beginCookieWrite();
  }
 },
 write : function( str ){
  if( this.s ){
   storageWrite( str );
  } else if( this.c ){
   cookieWrite( str );
  }
 },
 endWrite : function( key ){
  if( this.s ){
   endStorageWrite( key );
  } else if( this.c ){
   endCookieWrite( key );
  }
 }
};
var preference;
var input;
var _console_break = "<br>";
function consoleBreak(){
 return _console_break;
}
function _Console( id ){
 if( window.onConsoleUpdate == undefined ) window.onConsoleUpdate = function( id ){};
 this._id = id;
 this._div = document.getElementById( this._id );
 this._html = "";
 this._blankLine = "";
 this._maxLen = 0;
 this._color = "";
 this._lastColor = "";
 this._bold = false;
 this._italic = false;
 this._lock = false;
 this._needUpdate = false;
}
_Console.prototype = {
 setMaxBlankLine : function( num ){
  this._blankLine = "";
  for( var i = 0; i <= num; i++ ){
   this._blankLine += _console_break;
  }
 },
 setMaxLen : function( len ){
  this._maxLen = len;
 },
 setColor : function( color ){
  this._color = (color == undefined) ? "" : color;
 },
 setBold : function( f ){
  this._bold = f;
 },
 setItalic : function( f ){
  this._italic = f;
 },
 lock : function(){
  this._lock = true;
  this._needUpdate = false;
 },
 unlock : function(){
  this._lock = false;
  if( this._needUpdate ){
   this._update();
   this._needUpdate = false;
  }
 },
 _update : function(){
  if( this._lock ){
   this._needUpdate = true;
   return;
  }
  if( this._maxLen > 0 ){
   while( this._html.length > this._maxLen ){
    var index = this._html.indexOf( _console_break );
    if( index < 0 ){
     break;
    }
    this._html = this._html.slice( index + _console_break.length );
   }
  }
  this._div.innerHTML = this._html;
  if( this._html.length > 0 ){
   onConsoleUpdate( this._id );
  }
 },
 _add : function( str ){
  if( str.length > 0 ){
   if( this._bold ){
    if( this._html.slice( -4 ) == "</b>" ){
     this._html = this._html.substring( 0, this._html.length - 4 );
    } else {
     this._html += "<b>";
    }
   }
   if( this._italic ){
    if( this._html.slice( -4 ) == "</i>" ){
     this._html = this._html.substring( 0, this._html.length - 4 );
    } else {
     this._html += "<i>";
    }
   }
   if( this._color.length > 0 ){
    if( (this._html.slice( -7 ) == "</span>") && (this._color == this._lastColor) ){
     this._html = this._html.substring( 0, this._html.length - 7 );
    } else {
     this._html += "<span style='color:#" + this._color + "'>";
    }
    this._lastColor = this._color;
   }
   this._html += str;
   if( this._color.length > 0 ){
    this._html += "</span>";
   }
   if( this._italic ){
    this._html += "</i>";
   }
   if( this._bold ){
    this._html += "</b>";
   }
  }
 },
 clear : function(){
  this._html = "";
  this._update();
 },
 newLine : function(){
  if( this._html.length >= _console_break.length ){
   if( this._html.slice( -_console_break.length ) != _console_break ){
    this._html += _console_break;
    this._update();
   }
  }
 },
 print : function( str ){
  if( str != undefined ){
   this._add( str );
   this._update();
  }
 },
 println : function( str ){
  var needUpdate = false;
  if( str != undefined ){
   this._add( str );
   needUpdate = true;
  }
  if( (this._blankLine.length > 0) && (this._html.length >= this._blankLine.length) ){
   if( this._html.slice( -this._blankLine.length ) != this._blankLine ){
    this._html += _console_break;
    needUpdate = true;
   }
  } else {
   this._html += _console_break;
   needUpdate = true;
  }
  if( needUpdate ){
   this._update();
  }
 },
 scrollBottom : function(){
  this._div.scrollTop = this._div.scrollHeight;
 }
};
var con;
function onConsoleUpdate( id ){
 con.scrollBottom();
}
function _Error(){
 if( window.onError == undefined ) window.onError = function( e ){};
 this._message = new String();
 this._name = new String();
 this._description = new String();
 this._number = new String();
 this._file = new String();
 this._line = new String();
 this._column = new String();
 this._stack = new String();
}
_Error.prototype = {
 message : function(){
  return this._message;
 },
 name : function(){
  return this._name;
 },
 description : function(){
  return this._description;
 },
 number : function(){
  return this._number;
 },
 file : function(){
  return this._file;
 },
 line : function(){
  return this._line;
 },
 column : function(){
  return this._column;
 },
 stack : function(){
  return this._stack;
 }
};
function catchError( e ){
 var _e = new _Error();
 _e._message = e.message;
 _e._name = e.name;
 if( e.description ) _e._description = e.description;
 if( e.number ) _e._number = "" + e.number;
 if( e.fileName ) _e._file = e.fileName;
 if( e.lineNumber ) _e._line = "" + e.lineNumber;
 if( e.columnNumber ) _e._column = "" + e.columnNumber;
 if( e.stack ) _e._stack = e.stack;
 onError( _e );
}
function clip_onerror( message, url, line ){
 var e = new _Error();
 e._message = message;
 e._file = url;
 e._line = line;
 onError( e );
 return true;
}
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
var _canvas_env;
function _CanvasEnv(){
 this._color_r = 0;
 this._color_g = 0;
 this._color_b = 0;
 this._color_a = 255;
 this._font = "";
 this._stroke_width = 1.0;
}
function setCanvasEnv( env ){
 _canvas_env = env;
}
function _Canvas( id ){
 if( id == undefined ){
  this._canvas = document.createElement( "canvas" );
  this._create = true;
 } else {
  this._canvas = document.getElementById( id );
  this._create = false;
 }
 this._context = this._canvas.getContext( "2d" );
 this._resetContext();
}
_Canvas.prototype = {
 element : function(){
  return this._canvas;
 },
 context : function(){
  return this._context;
 },
 _resetContext : function(){
  this._context.textAlign = "left";
  this._context.textBaseline = "bottom";
  this._setColor();
  this._setFont();
  this._setStrokeWidth();
 },
 setSize : function( width, height ){
  if( this._create ){
   this._canvas.width = width;
   this._canvas.height = height;
  } else {
   this._canvas.setAttribute( "width" , "" + width );
   this._canvas.setAttribute( "height", "" + height );
  }
  this._resetContext();
 },
 left : function(){
  if( this._create ){
   return 0;
  }
  var e = this._canvas;
  var left = 0;
  while( e ){
   left += e.offsetLeft;
   e = e.offsetParent;
  }
  return left;
 },
 top : function(){
  if( this._create ){
   return 0;
  }
  var e = this._canvas;
  var top = 0;
  while( e ){
   top += e.offsetTop;
   e = e.offsetParent;
  }
  return top;
 },
 width : function(){
  return parseInt( this._canvas.width );
 },
 height : function(){
  return parseInt( this._canvas.height );
 },
 _setColor : function(){
  var color;
  if( _canvas_env._color_a == 255 ){
   color = "rgb(" + _canvas_env._color_r + "," + _canvas_env._color_g + "," + _canvas_env._color_b + ")";
  } else {
   color = "rgba(" + _canvas_env._color_r + "," + _canvas_env._color_g + "," + _canvas_env._color_b + "," + (_canvas_env._color_a / 255.0) + ")";
  }
  this._context.fillStyle = color;
  this._context.strokeStyle = color;
 },
 setColor : function( r, g, b, a ){
  if( a == undefined ){
   a = 255;
  }
  if( (r != _canvas_env._color_r) || (g != _canvas_env._color_g) || (b != _canvas_env._color_b) || (a != _canvas_env._color_a) ){
   _canvas_env._color_r = r;
   _canvas_env._color_g = g;
   _canvas_env._color_b = b;
   _canvas_env._color_a = a;
   this._setColor();
  }
 },
 setColorRGB : function( rgb ){
  this.setColor( (rgb & 0xFF0000) >> 16, (rgb & 0x00FF00) >> 8, rgb & 0x0000FF );
 },
 setColorBGR : function( bgr ){
  this.setColor( bgr & 0x0000FF, (bgr & 0x00FF00) >> 8, (bgr & 0xFF0000) >> 16 );
 },
 _setFont : function(){
  if( _canvas_env._font.length > 0 ){
   this._context.font = _canvas_env._font;
  }
 },
 setFont : function( size, family ){
  _canvas_env._font = "" + size + "px " + ((family.indexOf( " " ) >= 0) ? "'" + family + "'" : family);
  this._setFont();
 },
 _setStrokeWidth : function(){
  this._context.lineWidth = _canvas_env._stroke_width;
 },
 setStrokeWidth : function( width ){
  _canvas_env._stroke_width = width;
  this._setStrokeWidth();
 },
 clearClip : function()
 {
  this._context.restore();
  this._resetContext();
 },
 setClip : function( x, y, width, height )
 {
  if( !!this._context.clip )
  {
   this.clearClip();
   this._context.save();
   this._context.beginPath();
   this._context.moveTo( x, y );
   this._context.lineTo( x + width, y );
   this._context.lineTo( x + width, y + height );
   this._context.lineTo( x, y + height );
   this._context.closePath();
   this._context.clip();
  }
 },
 clear : function( x, y, w, h ){
  if( (x == undefined) && (y == undefined) && (w == undefined) && (h == undefined) ){
   this._canvas.width = this._canvas.width;
  } else if( (w == undefined) && (h == undefined) ){
   this._context.clearRect( x, y, 1, 1 );
  } else {
   this._context.clearRect( x, y, w, h );
  }
  this._resetContext();
 },
 put : function( x, y ){
  this._context.fillRect( x, y, 1, 1 );
 },
 fill : function( x, y, w, h ){
  this._context.fillRect( x, y, w, h );
 },
 line : function( x1, y1, x2, y2, scale ){
  this._context.beginPath();
  if( scale == undefined ){
   this._context.moveTo( x1 + 0.5, y1 + 0.5 );
   this._context.lineTo( x2 + 0.5, y2 + 0.5 );
  } else {
   this._context.moveTo( (x1 + 0.5) * scale, (y1 + 0.5) * scale );
   this._context.lineTo( (x2 + 0.5) * scale, (y2 + 0.5) * scale );
  }
  this._context.stroke();
  this._context.closePath();
 },
 rect : function( x, y, w, h, scale ){
  if( scale == undefined ){
   this._context.strokeRect( x + 0.5, y + 0.5, w, h );
  } else {
   this._context.strokeRect( (x + 0.5) * scale, (y + 0.5) * scale, w * scale, h * scale );
  }
 },
 circle : function( cx, cy, r ){
  this._context.beginPath();
  this._context.arc( cx, cy, r, 0.0, Math.PI * 2.0, false );
  this._context.stroke();
 },
 drawString : function( str, x, y ){
  if( !!this._context.fillText ){
   this._context.fillText( str, x, y );
  }
 },
 drawImage : function( image, w, h ){
  if( (w == image.width) && (h == image.height) ){
   this._context.drawImage( image, 0, 0 );
  } else {
   this._context.drawImage( image, 0, 0, image.width, image.height, 0, 0, w, h );
  }
 },
 imageData : function( w, h ){
  return this._context.getImageData( 0, 0, w, h );
 }
};
var canvas;
var canvasScale = 1;
var canvasMinScale = 1;
var canvasMinSize = 128;
function canvasSetSize( width, height ){
 if( (width <= 0) || (height <= 0) ){
  canvas.setSize( 1, 1 );
  var div1 = document.getElementById( "gworld_buttonarea" );
  div1.style.display = "none";
  var div2 = document.getElementById( "gworld_canvasarea" );
  div2.style.width = "1px";
  div2.style.height = "1px";
  div2.style.display = "none";
  var div3 = document.getElementById( "body" );
  div3.style.width = "640px";
 } else {
  var div1 = document.getElementById( "body" );
  div1.style.width = "" + (640 + width + 2 + 5) + "px";
  var div2 = document.getElementById( "gworld_canvasarea" );
  div2.style.width = "" + width + "px";
  div2.style.height = "" + height + "px";
  div2.style.display = "block";
  var div3 = document.getElementById( "gworld_buttonarea" );
  div3.style.display = "block";
  canvas.setSize( width, height );
 }
}
function canvasZoomIn(){
 if( canvasScale < canvasMinScale + 2 ){
  canvasScale++;
  canvas.setStrokeWidth( canvasScale );
  canvasSetSize( procGWorld()._width * canvasScale, procGWorld()._height * canvasScale );
  gUpdate( procGWorld() );
 }
}
function canvasZoomOut(){
 if( canvasScale > canvasMinScale ){
  canvasScale--;
  canvas.setStrokeWidth( canvasScale );
  canvasSetSize( procGWorld()._width * canvasScale, procGWorld()._height * canvasScale );
  gUpdate( procGWorld() );
 }
}
function canvasClear(){
 canvas.setColorRGB( gWorldBgColor() );
 canvas.fill( 0, 0, canvas.width(), canvas.height() );
}
function canvasSetColor( bgrColor ){
 canvas.setColorBGR( bgrColor );
}
function canvasPut( x, y ){
 canvas.fill( x * canvasScale, y * canvasScale, canvasScale, canvasScale );
}
function canvasFill( x, y, w, h ){
 canvas.fill( x * canvasScale, y * canvasScale, w * canvasScale, h * canvasScale );
}
function canvasLine( x1, y1, x2, y2 ){
 canvas.line( x1, y1, x2, y2, canvasScale );
}
var _input_file_cnt;
var _input_file_num;
function canUseFile(){
 return (window.FileReader && window.FileList && window.File);
}
function _InputFile( id, mode ){
 if( window.onInputFileLoadImage == undefined ) window.onInputFileLoadImage = function( name, image ){};
 if( window.onInputFileLoad == undefined ) window.onInputFileLoad = function( func, data ){};
 if( window.onInputFileLoadEnd == undefined ) window.onInputFileLoadEnd = function( num ){};
 this._input = document.getElementById( id );
 if( mode == undefined ){
  mode = 0;
 }
 switch( mode ){
 case 0:
  this._input.addEventListener( "change", _onInputFileChange, false );
  break;
 case 1:
  this._input.addEventListener( "change", _onInputFileChangeExtfunc, false );
  break;
 case 2:
  this._input.addEventListener( "change", _onInputFileChangeImage, false );
  break;
 }
}
_InputFile.prototype = {
 element : function(){
  return this._input;
 }
};
function _onInputFileChangeExtfunc( e ){
 var files = e.target.files;
 if( files.length == 0 ){
  return;
 }
 _input_file_cnt = 0;
 _input_file_num = files.length;
 for( var i = 0; i < files.length; i++ ){
  var file = files.item( i );
  var reader = new FileReader();
  reader.onload = (function( f ){
   return function( e ){
    if( f.name.indexOf( ".cef" ) > 0 ){
     var j;
     var data = e.target.result;
     var func = f.name.substring( 0, f.name.indexOf( ".cef" ) );
     var top;
     for( top = 0; top < data.length; top++ ){
      if( !isCharSpace( data, top ) && (data.charAt( top ) != '\t') ){
       break;
      }
     }
     var tmp = data.substring( top, top + 11 );
     if( tmp.toLowerCase() == "#!namespace" ){
      var data2 = new _String( data );
      var data3 = data2.replaceNewLine().str();
      if( data3.indexOf( "\n" ) < 0 ){
       data3 += "\n";
      }
      var nameSpace = new String();
      for( j = top + 11; ; j++ ){
       if( !isCharSpace( data3, j ) && (data3.charAt( j ) != '\t') ){
        break;
       }
      }
      if( j > top + 11 ){
       for ( ; ; j++ ){
        var chr = data3.charAt( j );
        if( isCharSpace( data3, j ) || (chr == '\t') || (chr == '\n') ){
         break;
        }
        nameSpace += chr;
       }
       if( nameSpace.length > 0 ){
        func = nameSpace + ":" + func;
       }
      }
     }
     onInputFileLoad( func, data );
     _input_file_cnt++;
     if( _input_file_cnt >= _input_file_num ){
      onInputFileLoadEnd( _input_file_cnt );
     }
    }
   };
  })( file );
  reader.readAsText( file );
 }
}
function _onInputFileChangeImage( e ){
 var files = e.target.files;
 if( files.length == 0 ){
  return true;
 }
 if( files[0].type.indexOf( "image/" ) == 0 ){
  var name = files[0].name;
  var reader = new FileReader();
  reader.onload = function(){
   var image = new Image();
   image.onload = function(){
    onInputFileLoadImage( name, image );
   };
   image.src = reader.result;
  };
  reader.readAsDataURL( files[0] );
  return true;
 }
 return false;
}
function _onInputFileChange( e ){
 if( _onInputFileChangeImage( e ) ){
  return;
 }
 _onInputFileChangeExtfunc( e );
}
var inputFile;
function drawInputFileImage( image, w , h ){
 var width = procGWorld()._width;
 var height = procGWorld()._height;
 if( (width > 0) && (height > 0) ){
  if( (image.width <= width) && (image.height <= height) ){
   width = image.width;
   height = image.height;
  } else if( image.width / image.height < width / height ){
   width = _INT( image.width * height / image.height );
  } else {
   height = _INT( image.height * width / image.width );
  }
  w.set( width );
  h.set( height );
  canvas.drawImage( image, width, height );
  return canvas.imageData( width, height ).data;
 }
 return null;
}
function onInputFileLoadImage( name, image ){
 var w = new _Integer();
 var h = new _Integer();
 var data = drawInputFileImage( image, w, h );
 if( data != null ){
  var width = w._val;
  var height = h._val;
  con.setBold( true );
  con.println( "[" + name + "]" );
  if( (width != image.width) || (height != image.height) ){
   con.print( "" + image.width + "x" + image.height + " -&gt; " );
  }
  con.println( "" + width + "x" + height );
  con.setBold( false );
 }
}
function doCommandGGet24Begin( w , h ){
 var width = procGWorld()._width;
 var height = procGWorld()._height;
 if( (width > 0) && (height > 0) ){
  w.set( width );
  h.set( height );
  return canvas.imageData( width, height ).data;
 }
 return null;
}
function doCommandGGet24End(){
}
function __ProcError(){
 this._err = 0;
 this._num = 0;
 this._func = new String();
 this._token = new String();
 this._before = null;
 this._next = null;
}
function _ProcError(){
 this._top = null;
 this._end = null;
 this._num = 0;
}
_ProcError.prototype = {
 add : function( err, num, func, token ){
  var cur = this._top;
  while( true ){
   if( cur == null ){
    break;
   }
   if(
    (cur._err == err ) &&
    (cur._num == num ) &&
    (cur._func == func ) &&
    (cur._token == token)
   ){
    return;
   }
   cur = cur._next;
  }
  var tmp = new __ProcError();
  if( this._top == null ){
   this._top = tmp;
   this._end = tmp;
  } else {
   tmp._before = this._end;
   this._end._next = tmp;
   this._end = tmp;
  }
  tmp._err = err;
  tmp._num = num;
  tmp._func = func;
  tmp._token = token;
  this._num++;
 },
 delAll : function(){
  this._top = null;
  this._num = 0;
 },
 get : function( index, err , num , func , token ){
  var tmp = 0;
  var cur = this._top;
  while( true ){
   if( cur == null ){
    return false;
   }
   if( tmp == index ){
    break;
   }
   tmp++;
   cur = cur._next;
  }
  err .set( cur._err );
  num .set( cur._num );
  func .set( cur._func );
  token.set( cur._token );
  return true;
 },
 num : function(){
  return this._num;
 },
 isError : function(){
  var cur = this._top;
  while( cur != null ){
   if( (cur._err & _CLIP_PROC_WARN) == 0 ){
    return true;
   }
   cur = cur._next;
  }
  return false;
 }
};
function getProcErrorDefString( err, token, isCalculator, isEnglish ){
 var error = new String();
 switch( err ){
 case _CLIP_PROC_WARN_ARRAY:
  if( isEnglish ) error = "Array element number is negative.";
  else error = "配列の要素番号が負の値です";
  break;
 case _CLIP_PROC_WARN_DIV:
  if( isEnglish ) error = "Divide by zero.";
  else error = "ゼロで除算しました";
  break;
 case _CLIP_PROC_WARN_UNDERFLOW:
  if( isEnglish ) error = "Underflowed.";
  else error = "アンダーフローしました";
  break;
 case _CLIP_PROC_WARN_OVERFLOW:
  if( isEnglish ) error = "Overflow occurred.";
  else error = "オーバーフローしました";
  break;
 case _CLIP_PROC_WARN_ASIN:
  if( isEnglish ) error = "Argument of \"asin\" is out of the range of -1 to 1.";
  else error = "asinの引数が-1から1の範囲外になりました";
  break;
 case _CLIP_PROC_WARN_ACOS:
  if( isEnglish ) error = "Argument of \"acos\" is out of the range of -1 to 1.";
  else error = "acosの引数が-1から1の範囲外になりました";
  break;
 case _CLIP_PROC_WARN_ACOSH:
  if( isEnglish ) error = "Argument of \"acosh\" now has value less than 1.";
  else error = "acoshの引数が1未満の値になりました";
  break;
 case _CLIP_PROC_WARN_ATANH:
  if( isEnglish ) error = "The argument of \"atanh\" is less than or equal to -1 or 1 or more.";
  else error = "atanhの引数が-1以下または1以上の値になりました";
  break;
 case _CLIP_PROC_WARN_LOG:
  if( isEnglish ) error = "Argument of \"" + (isCalculator ? "ln" : "log") + "\" is 0 or negative value.";
  else error = (isCalculator ? "ln" : "log") + "の引数が0または負の値になりました";
  break;
 case _CLIP_PROC_WARN_LOG10:
  if( isEnglish ) error = "Argument of \"" + (isCalculator ? "log" : "log10") + "\" has become 0 or negative value.";
  else error = (isCalculator ? "log" : "log10") + "の引数が0または負の値になりました";
  break;
 case _CLIP_PROC_WARN_SQRT:
  if( isEnglish ) error = "Argument of \"sqrt\" has a negative value.";
  else error = "sqrtの引数が負の値になりました";
  break;
 case _CLIP_PROC_WARN_FUNCTION:
  if( isEnglish ) error = "Invalid argument for \"" + token + "\".";
  else error = token + "の引数が無効です";
  break;
 case _CLIP_PROC_WARN_RETURN:
  if( isEnglish ) error = "\"return\" can not return a value.";
  else error = "returnで値を返すことができません";
  break;
 case _CLIP_PROC_WARN_DEAD_TOKEN:
  if( isEnglish ) error = "Token is not executed.";
  else error = "実行されないトークンです";
  break;
 case _CLIP_PROC_WARN_SE_RETURN:
  if( isEnglish ) error = "\"$RETURN_A\" can not return a value.";
  else error = "$RETURN_Aで値を返すことができません";
  break;
 case _CLIP_LOOP_ERR_NULL:
  if( isEnglish ) error = "There is no token.";
  else error = "トークンがありません";
  break;
 case _CLIP_LOOP_ERR_COMMAND:
  if( isEnglish ) error = "Command not supported.";
  else error = "コマンドはサポートされていません";
  break;
 case _CLIP_LOOP_ERR_STAT:
  if( isEnglish ) error = "Control structure is not supported.";
  else error = "制御構造はサポートされていません";
  break;
 case _CLIP_PROC_ERR_UNARY:
  if( isEnglish ) error = "\"" + token + "\": Unary operator expression is incorrect.";
  else error = token + ":単項演算子表現が間違っています";
  break;
 case _CLIP_PROC_ERR_OPERATOR:
  if( isEnglish ) error = "\"" + token + "\": Operator expression is wrong.";
  else error = token + ":演算子表現が間違っています";
  break;
 case _CLIP_PROC_ERR_ARRAY:
  if( isEnglish ) error = "\"" + token + "\": Array representation is incorrect.";
  else error = token + ":配列表現が間違っています";
  break;
 case _CLIP_PROC_ERR_FUNCTION:
  if( isEnglish ) error = "Argument of function \"" + token + "\" is wrong.";
  else error = "関数" + token + "の引数が間違っています";
  break;
 case _CLIP_PROC_ERR_LVALUE:
  if( isEnglish ) error = "The left side of \"" + token + "\" must be a variable or an array.";
  else error = token + "の左辺は変数または配列でなければなりません";
  break;
 case _CLIP_PROC_ERR_RVALUE:
  if( isEnglish ) error = "The right side of \"" + token + "\" must be a variable or an array.";
  else error = token + "の右辺は変数または配列でなければなりません";
  break;
 case _CLIP_PROC_ERR_RVALUE_NULL:
  if( isEnglish ) error = "There is no right side of \"" + token + "\".";
  else error = token + "の右辺がありません";
  break;
 case _CLIP_PROC_ERR_CONDITIONAL:
  if( isEnglish ) error = "Two constant or variable are not specified on the right side of the ternary operator \"" + token + "\".";
  else error = "三項演算子" + token + "の右辺に定数または変数が2個指定されていません";
  break;
 case _CLIP_PROC_ERR_EXTFUNC:
  if( isEnglish ) error = "Execution of the external function \"" + token.slice( 1 ) + "\" was interrupted.";
  else error = "外部関数" + token.slice( 1 ) + "の実行が中断されました";
  break;
 case _CLIP_PROC_ERR_USERFUNC:
  if( isEnglish ) error = "Execution of function \"" + token + "\" was interrupted.";
  else error = "関数" + token + "の実行が中断されました";
  break;
 case _CLIP_PROC_ERR_CONSTANT:
  if( isEnglish ) error = "\"" + token + "\": Constant expression is wrong.";
  else error = token + ":定数表現が間違っています";
  break;
 case _CLIP_PROC_ERR_STRING:
  if( isEnglish ) error = "\"" + token + "\": String representation is incorrect.";
  else error = token + ":文字列表現が間違っています";
  break;
 case _CLIP_PROC_ERR_COMPLEX:
  if( isEnglish ) error = "\"" + token + "\": Wrong complex number representation.";
  else error = token + ":複素数表現が間違っています";
  break;
 case _CLIP_PROC_ERR_FRACT:
  if( isEnglish ) error = "\"" + token + "\": Fractional representation is incorrect.";
  else error = token + ":分数表現が間違っています";
  break;
 case _CLIP_PROC_ERR_ASS:
  if( isEnglish ) error = "Assignment to a constant by \"" + token + "\" is invalid.";
  else error = token + "による定数への代入は無効です";
  break;
 case _CLIP_PROC_ERR_CALL:
  if( isEnglish ) error = "Function call failed.";
  else error = "関数呼び出しに失敗しました";
  break;
 case _CLIP_PROC_ERR_EVAL:
  if( isEnglish ) error = "Execution of evaluation was interrupted.";
  else error = "evalの実行が中断されました";
  break;
 case _CLIP_PROC_ERR_MULTIPREC:
  if( isEnglish ) error = "\"" + token + "\": Multi-precision expression is wrong.";
  else error = token + ":多倍長数表現が間違っています";
  break;
 case _CLIP_PROC_ERR_STAT_IF:
  if( isEnglish ) error = "\"" + token + "\" too many nests.";
  else error = token + "のネスト数が多すぎます";
  break;
 case _CLIP_PROC_ERR_STAT_ENDIF:
  if( isEnglish ) error = "There is no \"if\" corresponding to \"" + token + "\".";
  else error = token + "に対応するifがありません";
  break;
 case _CLIP_PROC_ERR_STAT_SWITCH:
  if( isEnglish ) error = "\"" + token + "\" too many nests.";
  else error = token + "のネスト数が多すぎます";
  break;
 case _CLIP_PROC_ERR_STAT_ENDSWI:
  if( isEnglish ) error = "There is no \"switch\" corresponding to \"" + token + "\".";
  else error = token + "に対応するswitchがありません";
  break;
 case _CLIP_PROC_ERR_STAT_UNTIL:
  if( isEnglish ) error = "No \"do\" corresponding to \"" + token + "\".";
  else error = token + "に対応するdoがありません";
  break;
 case _CLIP_PROC_ERR_STAT_ENDWHILE:
  if( isEnglish ) error = "There is no \"while\" corresponding to \"" + token + "\".";
  else error = token + "に対応するwhileがありません";
  break;
 case _CLIP_PROC_ERR_STAT_FOR_CON:
  if( isEnglish ) error = "No condition part in \"" + token + "\".";
  else error = token + "における条件部がありません";
  break;
 case _CLIP_PROC_ERR_STAT_FOR_EXP:
  if( isEnglish ) error = "There is no update expression in \"" + token + "\".";
  else error = token + "における更新式がありません";
  break;
 case _CLIP_PROC_ERR_STAT_NEXT:
  if( isEnglish ) error = "There is no \"for\" corresponding to \"" + token + "\".";
  else error = token + "に対応するforがありません";
  break;
 case _CLIP_PROC_ERR_STAT_CONTINUE:
  if( isEnglish ) error = "\"" + token + "\" is invalid.";
  else error = token + "は無効です";
  break;
 case _CLIP_PROC_ERR_STAT_BREAK:
  if( isEnglish ) error = "\"" + token + "\" is invalid.";
  else error = token + "は無効です";
  break;
 case _CLIP_PROC_ERR_STAT_FUNC:
  if( isEnglish ) error = "Too many functions.";
  else error = "関数の数が多すぎます";
  break;
 case _CLIP_PROC_ERR_STAT_FUNC_NEST:
  if( isEnglish ) error = "Function can not be defined in function.";
  else error = "関数内で関数は定義できません";
  break;
 case _CLIP_PROC_ERR_STAT_ENDFUNC:
  if( isEnglish ) error = "There is no \"func\" corresponding to \"" + token + "\".";
  else error = token + "に対応するfuncがありません";
  break;
 case _CLIP_PROC_ERR_STAT_FUNCNAME:
  if( isEnglish ) error = "\"" + token + "\": Function name is invalid.";
  else error = token + ":関数名は無効です";
  break;
 case _CLIP_PROC_ERR_STAT_FUNCPARAM:
  if( isEnglish ) error = "\"" + token + "\": Label can not be set for function argument.";
  else error = token + ":関数の引数にラベル設定できません";
  break;
 case _CLIP_PROC_ERR_STAT_LOOP:
  if( isEnglish ) error = "Number of loops exceeded the upper limit.";
  else error = "ループ回数オーバーしました";
  break;
 case _CLIP_PROC_ERR_COMMAND_NULL:
  if( isEnglish ) error = "The command is incorrect.";
  else error = "コマンドが間違っています";
  break;
 case _CLIP_PROC_ERR_COMMAND_PARAM:
  if( isEnglish ) error = "The argument of the command \"" + token.slice( 1 ) + "\" is incorrect.";
  else error = "コマンド" + token.slice( 1 ) + "の引数が間違っています";
  break;
 case _CLIP_PROC_ERR_COMMAND_DEFINE:
  if( isEnglish ) error = "\"" + token + "\" has already been defined.";
  else error = token + "は既に定義されています";
  break;
 case _CLIP_PROC_ERR_COMMAND_UNDEF:
  if( isEnglish ) error = "\"" + token + "\" is not defined.";
  else error = token + "は定義されていません";
  break;
 case _CLIP_PROC_ERR_COMMAND_PARAMS:
  if( isEnglish ) error = "You can only specify up to 10 arguments for the command \"" + token.slice( 1 ) + "\".";
  else error = "コマンド" + token.slice( 1 ) + "の引数は10個までしか指定できません";
  break;
 case _CLIP_PROC_ERR_COMMAND_RADIX:
  if( isEnglish ) error = "Command \"" + token.slice( 1 ) + "\" is invalid.";
  else error = "コマンド" + token.slice( 1 ) + "は無効です";
  break;
 case _CLIP_PROC_ERR_FUNC_OPEN:
  if( isEnglish ) error = "The external function \"" + token.slice( 1 ) + "\" can not be opened.";
  else error = "外部関数" + token.slice( 1 ) + "がオープンできません";
  break;
 case _CLIP_PROC_ERR_FUNC_PARANUM:
  if( isEnglish ) error = "Up to 10 arguments of external function can be specified.";
  else error = "外部関数の引数は10個までしか指定できません";
  break;
 case _CLIP_PROC_ERR_FUNC_PARACODE:
  if( isEnglish ) error = "\"token\": The argument of the external function must be a constant, variable or array name.";
  else error = token + ":外部関数の引数は定数、変数または配列名でなければなりません";
  break;
 case _CLIP_PROC_ERR_SE_NULL:
  if( isEnglish ) error = "The single expression is incorrect.";
  else error = "単一式が間違っています";
  break;
 case _CLIP_PROC_ERR_SE_OPERAND:
  if( isEnglish ) error = "Operand of the single expression is incorrect.";
  else error = "単一式のオペランドが間違っています";
  break;
 case _CLIP_PROC_ERR_SE_LOOPEND:
  if( isEnglish ) error = "No \"$LOOPSTART\" corresponding to \"$LOOPEND\".";
  else error = "$LOOPENDに対応する$LOOPSTARTがありません";
  break;
 case _CLIP_PROC_ERR_SE_LOOPCONT:
  if( isEnglish ) error = "No \"$LOOPSTART\" corresponding to \"$LOOPCONT\".";
  else error = "$LOOPCONTに対応する$LOOPSTARTがありません";
  break;
 case _CLIP_PROC_ERR_SE_CONTINUE:
  if( isEnglish ) error = "\"$CONTINUE\" is invalid.";
  else error = "$CONTINUEは無効です";
  break;
 case _CLIP_PROC_ERR_SE_BREAK:
  if( isEnglish ) error = "\"$BREAK\" is invalid.";
  else error = "$BREAKは無効です";
  break;
 }
 return error;
}
var procError;
var silentErr = false;
var _editor_cursor_pos = 0;
var _editor_text = "";
var _editor_smart = true;
function setEditorSmartFlag( flag ){
 _editor_smart = flag;
}
function editorSmartFlag(){
 return _editor_smart;
}
function _Editor( id ){
 if( window.onEditorUpdateText == undefined ) window.onEditorUpdateText = function( len ){};
 this._textarea = document.getElementById( id );
 this._textarea.addEventListener( "input", _onEditorInput, false );
 this._textarea.addEventListener( "keydown", _onEditorKeyDown, false );
}
_Editor.prototype = {
 element : function(){
  return this._textarea;
 },
 text : function(){
  return this._textarea.value;
 },
 setText : function( text ){
  this._textarea.value = text;
  _editor_cursor_pos = this._textarea.selectionStart;
  _editor_text = this._textarea.value;
 }
};
function _onEditorInput( e ){
 var elem = e.target;
 var pos = elem.selectionStart;
 if( _editor_smart && (pos > 0) && (pos != _editor_cursor_pos) ){
  var val = elem.value;
  if( val.length > _editor_text.length ){
   if( isCharSpace( val, pos - 1 ) ){
    if( (pos == 1) || (val.charAt( pos - 2 ) == '\t') ){
     elem.value = val.substr( 0, pos - 1 ) + "\t" + val.slice( pos );
     elem.setSelectionRange( pos, pos );
    } else if( val.charAt( pos - 2 ) == '\n' ){
     var i;
     for( i = pos - 3; i >= 0; i-- ){
      if( val.charAt( i ) == '\n' ){
       break;
      }
     }
     i++;
     var tmp = "";
     while( val.charAt( i ) == '\t' ){
      tmp += "\t";
      i++;
     }
     if( tmp.length == 0 ){
      tmp = "\t";
     }
     elem.value = val.substr( 0, pos - 1 ) + tmp + val.slice( pos );
     elem.setSelectionRange( pos - 1 + tmp.length, pos - 1 + tmp.length );
    }
   } else if( val.charAt( pos - 1 ) == '\n' ){
    var i;
    for( i = pos - 2; i >= 0; i-- ){
     if( val.charAt( i ) == '\n' ){
      break;
     }
    }
    i++;
    var tmp = "";
    while( val.charAt( i ) == '\t' ){
     tmp += "\t";
     i++;
    }
    elem.value = val.substr( 0, pos ) + tmp + val.slice( pos );
    elem.setSelectionRange( pos + tmp.length, pos + tmp.length );
   }
  }
 }
 _editor_cursor_pos = elem.selectionStart;
 _editor_text = elem.value;
 onEditorUpdateText( _editor_text.length );
}
function _onEditorKeyDown( e ){
 var elem = e.target;
 if( e.keyCode == 9 ){
  e.preventDefault();
  var val = elem.value;
  var pos = elem.selectionStart;
  if( _editor_smart && (pos > 0) && (val.charAt( pos - 1 ) == '\n') ){
   var i;
   for( i = pos - 2; i >= 0; i-- ){
    if( val.charAt( i ) == '\n' ){
     break;
    }
   }
   i++;
   var tmp = "";
   while( val.charAt( i ) == '\t' ){
    tmp += "\t";
    i++;
   }
   if( tmp.length == 0 ){
    tmp = "\t";
   }
   elem.value = val.substr( 0, pos ) + tmp + val.slice( pos );
   elem.setSelectionRange( pos + tmp.length, pos + tmp.length );
  } else {
   elem.value = val.substr( 0, pos ) + "\t" + val.slice( pos );
   elem.setSelectionRange( pos + 1, pos + 1 );
  }
  _editor_text = elem.value;
  onEditorUpdateText( _editor_text.length );
 }
 _editor_cursor_pos = elem.selectionStart;
}
var editor;
var selFunc;
var curFunc;
function canUseWriteFile(){
 return (window.navigator.userAgent.toLowerCase().indexOf( "chrome" ) != -1);
}
function writeFile( name, text ){
 if( window.onWriteFileEnd == undefined ) window.onWriteFileEnd = function( fileEntry ){};
 var size = encodeURI( text ).replace( new RegExp( "%..", "g" ), "*" ).length;
 webkitRequestFileSystem( TEMPORARY, size, function( fs ){
  fs.root.getFile( name, { create: true }, function( fileEntry ){
   fileEntry.createWriter( function( fileWriter ){
    fileWriter.onwriteend = function( e ){
     onWriteFileEnd( fileEntry );
    };
    fileWriter.onerror = function( e ){};
    fileWriter.write( new Blob( [text], { type: "text/plain" } ) );
   }, function( e ){} );
  }, function( e ){} );
 }, function( e ){} );
}
var topProc;
var topParam;
var needGUpdate = false;
var addExtFuncList = false;
var englishFlag = false;
var lastTouchEnd = 0;
function main( inputId, divId, canvasId, inputFileId, editorId ){
 var i;
 defGWorldFunction();
 defProcFunction();
 var userAgent = window.navigator.userAgent;
 if( (userAgent.indexOf( "Android" ) != -1) || (userAgent.indexOf( "iPad" ) != -1) ){
  document.getElementById( "clip_loadextfunc" ).style.display = "none";
  document.getElementById( "command_pc" ).style.display = "none";
  if( userAgent.indexOf( "iPad" ) != -1 ){
   document.documentElement.addEventListener( "touchstart", function( e ){
    if( e.touches.length > 1 ){
     e.preventDefault();
    }
   }, true );
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
 preference = new _Preference( useStorage );
 input = document.getElementById( inputId );
 con = new _Console( divId );
 con.setMaxBlankLine( 1 );
 con.setMaxLen( conMaxLen );
 regGWorldDefCharInfo( 0 );
 regGWorldDefCharInfoLarge( 1 );
 regGWorldBgColor( 0xC0C0C0 );
 setCanvasEnv( new _CanvasEnv() );
 canvas = new _Canvas( canvasId );
 canvasClear();
 inputFile = new _InputFile( inputFileId );
 procError = new _ProcError();
 setDefineValue();
 setProcEnv( new _ProcEnv() );
 topProc = new _Proc( _PROC_DEF_PARENT_MODE, _PROC_DEF_PARENT_MP_PREC, _PROC_DEF_PARENT_MP_ROUND, true, _PROC_DEF_PRINT_ASSERT, _PROC_DEF_PRINT_WARN, _PROC_DEF_GUPDATE_FLAG );
 setProcWarnFlowFlag( true );
 setProcTraceFlag( traceLevel > 0 );
 setProcLoopMax( loopMax );
 topParam = new _Param();
 setGlobalParam( topParam );
 initProc();
 regCustomCommand( "env" );
 regCustomCommand( "list" );
 regCustomCommand( "listd" );
 regCustomCommand( "extfunc" );
 regCustomCommand( "usage" );
 regCustomCommand( "english" );
 regCustomCommand( "japanese" );
 regCustomCommand( "test" );
 regCustomCommand( "trace" );
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
 editor = new _Editor( editorId );
 var tabWidth = parseInt( preference.get( "_CLIP_" + "EDITOR_Tab", "4" ) );
 if( tabWidth < 0 ){
  tabWidth = 0;
 }
 document.getElementById( "tab_width" ).value = "" + tabWidth;
 cssSetPropertyValue( ".textarea_func", "tab-size", "" + tabWidth );
 var smart = (parseInt( preference.get( "_CLIP_" + "EDITOR_Smart", "1" ) ) == 1);
 document.getElementById( "check_smart" ).checked = smart;
 setEditorSmartFlag( smart );
 selFunc = parseInt( preference.get( "_CLIP_" + "EDITOR_SelFunc", "0" ) );
 var select = document.getElementById( "select_func" );
 for( i = 0; i < select.options.length; i++ ){
  select.options[i].selected = (i == selFunc) ? true : false;
 }
 curFunc = select.options[selFunc].value;
 loadFunc();
 updateSelectFunc();
 con.println( "CLIP Copyright (C) SatisKia" );
 englishFlag = (parseInt( preference.get( "_CLIP_" + "ENV_Language", "" + 0 ) ) == 1);
 updateLanguage();
}
function doShowConsole(){
 saveFunc();
 document.getElementById( "button_console" ).innerHTML = "<img src='icon1.png' width='20' height='20'>";
 document.getElementById( "button_editor" ).innerHTML = "<img src='icon7.png' width='16' height='16'>";
 document.getElementById( "clip_editor" ).style.display = "none";
 document.getElementById( "clip_console" ).style.display = "block";
}
function doShowEditor(){
 document.getElementById( "button_console" ).innerHTML = "<img src='icon1.png' width='16' height='16'>";
 document.getElementById( "button_editor" ).innerHTML = "<img src='icon7.png' width='20' height='20'>";
 document.getElementById( "clip_console" ).style.display = "none";
 document.getElementById( "clip_editor" ).style.display = "block";
}
function proc(){
 var line = "" + input.value;
 if( line.length > 0 ){
  doShowConsole();
  con.newLine();
  con.println( "<b>&gt;</b>" + line );
  con.lock();
  if( lockGUpdate ){
   needGUpdate = false;
  }
try {
  initProcLoopCount();
  if( testFlag ){
   topProc.testProcessLoop( line, topParam );
  }
  topProc.processLoop( line, topParam );
} catch( e ){ catchError( e ); }
  if( lockGUpdate && needGUpdate ){
   gUpdate( procGWorld() );
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
 }
 input.value = "";
}
function doClearFuncCache(){
 topProc.clearAllFuncCache();
}
function doClearStorage(){
 if( canUseStorage() ){
  document.getElementById( "button_storage_clear" ).disabled = true;
  clearStorage( "_CLIP_" + "TMP_" );
  location.replace( "index.html" );
 }
}
function doClearCookie(){
 if( canUseCookie() ){
  document.getElementById( "button_cookie_clear" ).disabled = true;
  clearCookie( "_CLIP_" + "TMP_" );
  location.replace( "index.html" );
 }
}
function makeExtFuncData( data, disp ){
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
  string.replace( "\r" , "<span style='color:#0000FF'>\\r</span>" + consoleBreak() );
  string.replace( "\n" , "<span style='color:#0000FF'>\\n</span>" + consoleBreak() );
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
 preference.beginRead( "_CLIP_" + "TMP_LOADCEF_" );
 for( i = 0; ; i++ ){
  file = preference.read();
  if( file.length == 0 ){
   break;
  }
  extFuncFile[i] = file;
 }
 preference.endRead();
 for( i = 0; i < extFuncFile.length; i++ ){
  var data = preference.get( "_CLIP_" + "TMP_" + extFuncFile[i], "" );
  if( data.length > 0 ){
   if( dispCache ){
    con.println( "<b>[" + ((useStorage && canUseStorage()) ? "storage" : "cookie") + " " + extFuncFile[i] + "]</b>" );
   }
   extFuncData[i] = makeExtFuncData( data, dispCache );
   if( dispCache ){
    if( englishFlag ) con.println( "<b>" + extFuncData[i].length + " lines</b>" );
    else con.println( "<b>" + extFuncData[i].length + "行</b>" );
   }
  }
 }
}
function onInputFileLoad( func, data ){
 var i;
 func = func.toLowerCase();
 topProc.clearFuncCache( func );
 var name = "/" + func + ".cef";
 var index = extFuncFile.length;
 for( i = 0; i < extFuncFile.length; i++ ){
  if( extFuncFile[i].toLowerCase() == name ){
   name = extFuncFile[i];
   index = i;
   break;
  }
 }
 con.println( "<b>[" + ((index == extFuncFile.length) ? "new" : "update") + " " + name + "]</b>" );
 extFuncFile[index] = name;
 extFuncData[index] = makeExtFuncData( data, true );
 if( englishFlag ) con.println( "<b>" + extFuncData[index].length + " lines</b>" );
 else con.println( "<b>" + extFuncData[index].length + "行</b>" );
 data = "";
 for( i = 0; i < extFuncData[index].length; i++ ){
  if( i != 0 ) data += "\n";
  data += extFuncData[index][i];
 }
 preference.beginWrite();
 for( i = 0; i < extFuncFile.length; i++ ){
  preference.write( extFuncFile[i] );
 }
 preference.endWrite( "_CLIP_" + "TMP_LOADCEF_" );
 preference.set( "_CLIP_" + "TMP_" + extFuncFile[index], data );
}
function onInputFileLoadEnd( num ){
 if( englishFlag ) con.println( "<b>Completed.</b>" );
 else con.println( "<b>完了しました</b>" );
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
  if( extFuncName( extFuncFile[i] ).toLowerCase() == func.toLowerCase() ){
   if( i < extFuncData.length ){
    return extFuncData[i];
   }
  }
 }
 return null;
}
function mainProc( parentProc, parentParam, func, funcParam, childProc, childParam ){
 var ret;
try {
 ret = childProc.mainLoop( func, childParam, funcParam, parentParam );
} catch( e ){ catchError( e ); }
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
 return ret;
}
function assertProc( num, func ){
 con.newLine();
 if( (func != null) && (func.length > 0) ){
  con.print( func + ": " );
 }
 if( num > 0 ){
  if( englishFlag ) con.print( "Line " + num + ": " );
  else con.print( "" + num + "行: " );
 }
 if( englishFlag ) con.println( "Error " + intToString( _CLIP_ERR_ASSERT, 16, 4 ) + ": Failed to assert." );
 else con.println( "エラー(" + intToString( _CLIP_ERR_ASSERT, 16, 4 ) + "): アサートに失敗しました" );
 return retAssertProc;
}
function getErrorString( err, num, func, token ){
 var string = new String();
 var error = getProcErrorDefString( err, token, topParam._calculator, englishFlag );
 if( error.length > 0 ){
  if( (func != null) && (func.length > 0) ){
   string += func + ": ";
  }
  if( num > 0 ){
   if( englishFlag ) string += "Line " + num + ": ";
   else string += "" + num + "行: ";
  }
  if( englishFlag ) string += (((err & _CLIP_PROC_WARN) != 0) ? "Warning" : "Error") + " " + intToString( err, 16, 4 ) + ": " + error;
  else string += (((err & _CLIP_PROC_WARN) != 0) ? "警告" : "エラー") + "(" + intToString( err, 16, 4 ) + "): " + error;
 }
 return string;
}
function errorProc( err, num, func, token ){
 if( silentErr ){
  procError.add( err, num, func, token );
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
 case _CLIP_CODE_TOP: string = "TOP"; break;
 case _CLIP_CODE_VARIABLE: string = "VARIABLE"; break;
 case _CLIP_CODE_AUTO_VAR: string = "AUTO_VAR"; break;
 case _CLIP_CODE_GLOBAL_VAR: string = "GLOBAL_VAR"; break;
 case _CLIP_CODE_ARRAY: string = "ARRAY"; break;
 case _CLIP_CODE_AUTO_ARRAY: string = "AUTO_ARRAY"; break;
 case _CLIP_CODE_GLOBAL_ARRAY: string = "GLOBAL_ARRAY"; break;
 case _CLIP_CODE_CONSTANT: string = "CONSTANT"; break;
 case _CLIP_CODE_MULTIPREC: string = "MULTIPREC"; break;
 case _CLIP_CODE_LABEL: string = "LABEL"; break;
 case _CLIP_CODE_COMMAND: string = "COMMAND"; break;
 case _CLIP_CODE_STATEMENT: string = "STATEMENT"; break;
 case _CLIP_CODE_OPERATOR: string = "OPERATOR"; break;
 case _CLIP_CODE_FUNCTION: string = "FUNCTION"; break;
 case _CLIP_CODE_EXTFUNC: string = "EXTFUNC"; break;
 case _CLIP_CODE_NULL: string = "NULL"; break;
 case _CLIP_CODE_END: string = "END"; break;
 case _CLIP_CODE_ARRAY_TOP: string = "ARRAY_TOP"; break;
 case _CLIP_CODE_ARRAY_END: string = "ARRAY_END"; break;
 case _CLIP_CODE_MATRIX: string = "MATRIX"; break;
 case _CLIP_CODE_STRING: string = "STRING"; break;
 case _CLIP_CODE_PARAM_ANS: string = "PARAM_ANS"; break;
 case _CLIP_CODE_PARAM_ARRAY: string = "PARAM_ARRAY"; break;
 case _CLIP_CODE_SE: string = "SE"; break;
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
 var code;
 var token;
 line.beginGetToken();
 var i = 0;
 while( line.getTokenParam( param ) ){
  code = getCode();
  token = getToken();
  if( i == 0 ){
   traceString += string;
  } else {
   traceString += " ";
  }
  traceString += procToken().tokenString( param, code, token );
  if( traceLevel >= 2 ){
   if( traceLevel == 3 ){
    if( code == _CLIP_CODE_LABEL ){
     for( var j = 0; j < token.length; j++ ){
      traceString += "," + token.charCodeAt( j );
     }
    }
   }
   traceString += "(" + codeString( code ) + ")";
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
 var code;
 var token;
 line.beginGetToken();
 var i = 0;
 while( line.getTokenParam( param ) ){
  code = getCode();
  token = getToken();
  if( i == 0 ){
   con.print( string );
  } else {
   con.print( " " );
  }
  con.print( procToken().tokenString( param, code, token ) );
  if( traceLevel >= 2 ){
   con.setColor( "0000ff" );
   if( traceLevel == 3 ){
    if( code == _CLIP_CODE_LABEL ){
     for( var j = 0; j < token.length; j++ ){
      con.print( "," + token.charCodeAt( j ) );
     }
    }
   }
   con.print( "(" + codeString( code ) + ")" );
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
function getArrayTokenString( param, array , indent, sp, br ){
 var i;
 var code;
 var token;
 var string = new String();
 var enter = false;
 array.beginGetToken();
 while( array.getToken() ){
  code = getCode();
  token = getToken();
  if( enter ){
   if( code == _CLIP_CODE_ARRAY_TOP ){
    string += br;
    for( i = 0; i < indent; i++ ){
     string += sp;
    }
   }
   enter = false;
  }
  string += procToken().tokenString( param, code, token );
  string += sp;
  if( code == _CLIP_CODE_ARRAY_TOP ){
   indent += 2;
  }
  if( code == _CLIP_CODE_ARRAY_END ){
   indent -= 2;
   enter = true;
  }
 }
 return string;
}
function printMatrix( param, array , indent ){
 con.println( getArrayTokenString( param, array, indent, "&nbsp;", consoleBreak() ) );
}
function printAnsComplex( real, imag ){
 con.newLine();
 con.setBold( true );
 con.println( real + imag );
 con.setBold( false );
}
function printAnsMultiPrec( str ){
 con.newLine();
 con.setBold( true );
 con.setColor( "0000ff" );
 con.println( str );
 con.setColor();
 con.setBold( false );
}
function printAnsMatrix( param, array ){
 con.newLine();
 con.setBold( true );
 printMatrix( param, array, 0 );
 con.setBold( false );
}
function printWarn( warn, num, func ){
 con.newLine();
 if( (func != null) && (func.length > 0) ){
  con.print( func + ": " );
 }
 if( num > 0 ){
  if( englishFlag ) con.print( "Line " + num + ": " );
  else con.print( "" + num + "行: " );
 }
 if( englishFlag ) con.println( "Warning: " + warn );
 else con.println( "警告: " + warn );
}
function printError( error, num, func ){
 con.newLine();
 if( (func != null) && (func.length > 0) ){
  con.print( func + ": " );
 }
 if( num > 0 ){
  if( englishFlag ) con.print( "Line " + num + ": " );
  else con.print( "" + num + "行: " );
 }
 if( englishFlag ) con.println( "Error: " + error );
 else con.println( "エラー: " + error );
}
function doFuncGColor( rgb ){
 return doFuncGColorBGR( rgb, COLOR_WIN );
}
function doFuncGColor24( index ){
 return _RGB2BGR( COLOR_WIN[index] );
}
function doFuncEval( parentProc, childProc, childParam, string, value ){
 var ret;
try {
 ret = parentProc.doFuncEval( childProc, childParam, string, value );
} catch( e ){ catchError( e ); }
 return ret;
}
function doCommandClear(){
 con.clear();
}
function doCommandPrint( topPrint, flag ){
 con.setColor( "ff00ff" );
 var cur = topPrint;
 while( cur != null ){
  if( cur._string != null ){
   var tmp = new _String( cur._string );
   tmp.escape().replaceNewLine( consoleBreak() );
   con.print( tmp.str() );
  }
  cur = cur._next;
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
  if( cur._string != null ){
   traceString += cur._string;
  }
  cur = cur._next;
 }
 traceString += "\n";
}
function doCommandScan( topScan, proc, param ){
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
  cur = cur._next;
 }
}
function doCommandGWorld( width, height ){
 if( (width < canvasMinSize) || (height < canvasMinSize) ){
  canvasScale = _CEIL( canvasMinSize / ((width < height) ? width : height) );
 } else {
  canvasScale = 1;
 }
 canvasMinScale = canvasScale;
 canvas.setStrokeWidth( canvasScale );
 canvasSetSize( width * canvasScale, height * canvasScale );
}
function gWorldClear( gWorld, color ){
 if( lockGUpdate ){
  needGUpdate = true;
  return;
 }
 canvasClear();
 canvasSetColor( COLOR_WIN[color] );
 canvasFill( 0, 0, gWorld._width, gWorld._height );
 canvasSetColor( COLOR_WIN[gWorld._color] );
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
 if( topProc._gUpdateFlag ){
  canvasSetColor( COLOR_WIN[color] );
  canvasPut( x, y );
  canvasSetColor( COLOR_WIN[gWorld._color] );
 }
}
function gWorldPut( gWorld, x, y ){
 if( lockGUpdate ){
  needGUpdate = true;
  return;
 }
 if( topProc._gUpdateFlag ){
  canvasPut( x, y );
 }
}
function gWorldFill( gWorld, x, y, w, h ){
 if( lockGUpdate ){
  needGUpdate = true;
  return;
 }
 if( topProc._gUpdateFlag ){
  canvasFill( x, y, w, h );
 }
}
function gWorldLine( gWorld, x1, y1, x2, y2 ){
 if( lockGUpdate ){
  needGUpdate = true;
  return;
 }
 if( topProc._gUpdateFlag ){
  canvasLine( x1, y1, x2, y2 );
 }
}
function gWorldTextColor( gWorld, text, x, y, color, right ){
 if( lockGUpdate ){
  needGUpdate = true;
  return;
 }
}
function doCommandGColor( index, rgb ){
 COLOR_WIN[index] = _RGB2BGR( rgb );
 needGUpdate = true;
}
function doCommandGPut24( x, y, rgb ){
 canvas.setColorRGB( rgb );
 canvasPut( x, y );
}
function doCommandGPut24End(){
 canvasSetColor( COLOR_WIN[procGWorld()._color] );
 needGUpdate = false;
}
function gUpdate( gWorld ){
 canvasClear();
 var image = gWorld._image;
 var offset = gWorld._offset;
 var width = gWorld._width;
 var height = gWorld._height;
 var x, y, yy, sy;
 for( y = 0; y < height; y++ ){
  yy = y * offset;
  sy = y * canvasScale;
  for( x = 0; x < width; x++ ){
   canvasSetColor( COLOR_WIN[image[yy + x]] );
   canvas.fill( x * canvasScale, sy, canvasScale, canvasScale );
  }
 }
 canvasSetColor( COLOR_WIN[gWorld._color] );
}
function doCommandGUpdate( gWorld ){
 if( lockGUpdate ){
  needGUpdate = true;
  return;
 }
 gUpdate( gWorld );
}
function doCommandPlot( parentProc, childProc, childParam, graph, start, end, step ){
try {
 parentProc.doCommandPlot( childProc, childParam, graph, start, end, step );
} catch( e ){ catchError( e ); }
}
function doCommandRePlot( parentProc, childProc, childParam, graph, start, end, step ){
try {
 parentProc.doCommandRePlot( childProc, childParam, graph, start, end, step );
} catch( e ){ catchError( e ); }
}
function doCommandUsage( topUsage ){
 if( !addExtFuncList ){
  con.setColor( "ff00ff" );
 }
 var cur = topUsage;
 while( cur != null ){
  if( cur._string != null ){
   con.print( (new _String( cur._string )).escape().str() );
   if( addExtFuncList ){
    break;
   }
   con.println();
  }
  cur = cur._next;
 }
 if( !addExtFuncList ){
  con.setColor();
 }
}
function doCommandDumpVar( param, index ){
 var real = new _String();
 var imag = new _String();
 var label;
 var string = "";
 procToken().valueToString( param, param.val( index ), real, imag );
 if( (label = param._var._label._label[index]) != null ){
  string = label;
  if( param._var._label._flag[index] != _LABEL_MOVABLE ){
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
  if( param._array._label._flag[index] != _LABEL_MOVABLE ){
   string += "(@@" + String.fromCharCode( index ) + ")";
  }
 } else {
  string = "@@" + String.fromCharCode( index );
 }
 string += " ";
 traceString += string + getArrayTokenString( param, array, string.length, " ", "\n" );
 traceString += "\n";
}
function _customCommandLanguage( _this, param, code, token, flag ){
 englishFlag = flag;
 if( englishFlag ){
  con.print( "Change English mode. " );
 } else {
  con.print( "Change Japanese mode. " );
 }
 updateLanguage();
 preference.set( "_CLIP_" + "ENV_Language", englishFlag ? "" + 1 : "" + 0 );
 return _CLIP_NO_ERR;
}
function _customCommandEnv( _this, param, code, token ){
 con.setColor( "0000ff" );
 con.println( "calculator " + (param._calculator ? "TRUE" : "FALSE") );
 con.println( (param._base == 0) ? "zero-based" : "one-based" );
 switch( param._mode & _CLIP_MODE_MASK ){
 case _CLIP_MODE_E_FLOAT: con.print( "efloat" ); break;
 case _CLIP_MODE_F_FLOAT: con.print( "float" ); break;
 case _CLIP_MODE_G_FLOAT: con.print( "gfloat" ); break;
 case _CLIP_MODE_E_COMPLEX: con.print( "ecomplex" ); break;
 case _CLIP_MODE_F_COMPLEX: con.print( "complex" ); break;
 case _CLIP_MODE_G_COMPLEX: con.print( "gcomplex" ); break;
 case _CLIP_MODE_I_FRACT: con.print( "fract" ); break;
 case _CLIP_MODE_M_FRACT: con.print( "mfract" ); break;
 case _CLIP_MODE_H_TIME: con.print( "htime" ); break;
 case _CLIP_MODE_M_TIME: con.print( "mtime" ); break;
 case _CLIP_MODE_S_TIME: con.print( "time" ); break;
 case _CLIP_MODE_F_TIME: con.print( "ftime" ); break;
 case _CLIP_MODE_S_CHAR: con.print( "char" ); break;
 case _CLIP_MODE_U_CHAR: con.print( "uchar" ); break;
 case _CLIP_MODE_S_SHORT: con.print( "short" ); break;
 case _CLIP_MODE_U_SHORT: con.print( "ushort" ); break;
 case _CLIP_MODE_S_LONG: con.print( "long" ); break;
 case _CLIP_MODE_U_LONG: con.print( "ulong" ); break;
 }
 con.print( ", " ); con.print( "fps " + param._fps );
 con.print( ", " ); con.print( "prec " + param._prec );
 con.print( ", " ); con.print( "radix " + param._radix );
 con.print( ", " );
 var type = new _Integer();
 var updateFlag = new _Boolean();
 _this.getAngType( type, updateFlag );
 switch( type._val ){
 case _ANG_TYPE_RAD: con.print( "rad" ); break;
 case _ANG_TYPE_DEG: con.print( "deg" ); break;
 case _ANG_TYPE_GRAD: con.print( "grad" ); break;
 }
 con.println();
 if( param.isMultiPrec() ){
  switch( param._mode ){
  case _CLIP_MODE_F_MULTIPREC: con.print( "mfloat" ); break;
  case _CLIP_MODE_I_MULTIPREC: con.print( "mint" ); break;
  }
  con.print( ", " ); con.print( "prec " + param._mpPrec );
  con.print( ", " );
  switch( param._mpRound ){
  case _MP_FROUND_UP: con.print( "up" ); break;
  case _MP_FROUND_DOWN: con.print( "down" ); break;
  case _MP_FROUND_CEILING: con.print( "ceiling" ); break;
  case _MP_FROUND_FLOOR: con.print( "floor" ); break;
  case _MP_FROUND_HALF_UP: con.print( "h_up" ); break;
  case _MP_FROUND_HALF_DOWN: con.print( "h_down" ); break;
  case _MP_FROUND_HALF_EVEN: con.print( "h_even" ); break;
  case _MP_FROUND_HALF_DOWN2: con.print( "h_down2" ); break;
  case _MP_FROUND_HALF_EVEN2: con.print( "h_even2" ); break;
  }
  con.println();
 }
 con.print( "assert " + (_this._printAssert ? "TRUE" : "FALSE") );
 con.print( ", " ); con.print( "warn " + (_this._printWarn ? "TRUE" : "FALSE") );
 con.println();
 var left = procGWorld().wndPosX( 0 );
 var top = procGWorld().wndPosY( 0 );
 var right = procGWorld().wndPosX( procGWorld()._width );
 var bottom = procGWorld().wndPosY( procGWorld()._height );
 con.println( "gworld " + procGWorld()._width + " " + procGWorld()._height );
 con.println( "window " + left + " " + bottom + " " + right + " " + top );
 switch( procGraph().mode() ){
 case _GRAPH_MODE_RECT: con.print( "rectangular" ); break;
 case _GRAPH_MODE_PARAM: con.print( "parametric" ); break;
 case _GRAPH_MODE_POLAR: con.print( "polar" ); break;
 }
 con.print( ", " );
 if( procGraph().isLogScaleX() ){
  con.print( "logscale x " + procGraph().logBaseX() );
 } else {
  con.print( "nologscale x" );
 }
 con.print( ", " );
 if( procGraph().isLogScaleY() ){
  con.print( "logscale y " + procGraph().logBaseY() );
 } else {
  con.print( "nologscale y" );
 }
 con.println();
 con.setColor();
 return _CLIP_NO_ERR;
}
function _customCommandList( _this, param, code, token, detail ){
 var newCode;
 var newToken;
 if( _this._curLine._token.getTokenParam( param ) ){
  newCode = getCode();
  newToken = getToken();
  if( (newCode & _CLIP_CODE_ARRAY_MASK) != 0 ){
   if( newCode == _CLIP_CODE_GLOBAL_ARRAY ){
    param = globalParam();
   }
   var index = _this.arrayIndexIndirect( param, newCode, newToken );
   var array = new _Token();
   var label;
   var string = "";
   param._array.makeToken( array, index );
   if( (label = param._array._label._label[index]) != null ){
    string = label;
    if( param._array._label._flag[index] != _LABEL_MOVABLE ){
     string += "(@@" + String.fromCharCode( index ) + ")";
    } else if( detail ){
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
   return _CLIP_NO_ERR;
  } else if( newCode == _CLIP_CODE_EXTFUNC ){
   var func = new _String( newToken );
   var data = _this.getExtFuncData( func, null );
   if( data != null ){
    con.setColor( "0000ff" );
    for( var i = 0; i < data.length; i++ ){
     con.println( (new _String( data[i] )).escape().str() );
    }
    con.setColor();
    return _CLIP_NO_ERR;
   }
  }
 } else {
  var index;
  var real = new _String();
  var imag = new _String();
  var label;
  con.setColor( "0000ff" );
  if( param.isMultiPrec() ){
   for( var step = 0; step < 4; step++ ){
    var tmp = new Array();
    var i = 0;
    for( index = 0; index < 256; index++ ){
     if( index == 0 ){
      if( step == 0 ){
       if( (label = param._array._label._label[index]) != null ){
        tmp[i] = label + "(@@:0)=" + _this.mpNum2Str( param, param._array._mp[index] );
        i++;
       } else if( param._array._mp[index].length > 0 ){
        tmp[i] = "@@:0=" + _this.mpNum2Str( param, param._array._mp[index] );
        i++;
       }
      }
     } else if( (index >= _CHAR_CODE_0) && (index <= _CHAR_CODE_9) ){
      if( step == 1 ){
       if( (label = param._array._label._label[index]) != null ){
        tmp[i] = label + "(@@" + String.fromCharCode( index ) + ")=" + _this.mpNum2Str( param, param._array._mp[index] );
        i++;
       } else if( param._array._mp[index].length > 0 ){
        tmp[i] = "@@" + String.fromCharCode( index ) + "=" + _this.mpNum2Str( param, param._array._mp[index] );
        i++;
       }
      }
     } else {
      if( step == 2 ){
       if( (label = param._array._label._label[index]) != null ){
        if( param._array._label._flag[index] == _LABEL_MOVABLE ){
         if( detail ){
          tmp[i] = label + "(@@:" + index + ")=" + _this.mpNum2Str( param, param._array._mp[index] );
         } else {
          tmp[i] = label + "=" + _this.mpNum2Str( param, param._array._mp[index] );
         }
         i++;
        }
       }
      }
      if( step == 3 ){
       if( (label = param._array._label._label[index]) != null ){
        if( param._array._label._flag[index] != _LABEL_MOVABLE ){
         tmp[i] = label + "(@@" + String.fromCharCode( index ) + ")=" + _this.mpNum2Str( param, param._array._mp[index] );
         i++;
        }
       } else if( param._array._mp[index].length > 0 ){
        tmp[i] = "@@" + String.fromCharCode( index ) + "=" + _this.mpNum2Str( param, param._array._mp[index] );
        i++;
       }
      }
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
  }
  for( var step = 0; step < 4; step++ ){
   var tmp = new Array();
   var i = 0;
   for( index = 0; index < 256; index++ ){
    if( index == 0 ){
     if( step == 0 ){
      if( (label = param._var._label._label[index]) != null ){
       procToken().valueToString( param, param.val( index ), real, imag );
       tmp[i] = label + "(@:0)=" + real.str() + imag.str();
       i++;
      } else if( !(param.isZero( index )) ){
       procToken().valueToString( param, param.val( index ), real, imag );
       tmp[i] = "@:0=" + real.str() + imag.str();
       i++;
      }
     }
    } else if(
     (index == _CHAR_CODE_EX) ||
     ((index >= _CHAR_CODE_0) && (index <= _CHAR_CODE_9))
    ){
     if( step == 1 ){
      if( (label = param._var._label._label[index]) != null ){
       procToken().valueToString( param, param.val( index ), real, imag );
       tmp[i] = label + "(@" + String.fromCharCode( index ) + ")=" + real.str() + imag.str();
       i++;
      } else if( !(param.isZero( index )) ){
       procToken().valueToString( param, param.val( index ), real, imag );
       tmp[i] = "@" + String.fromCharCode( index ) + "=" + real.str() + imag.str();
       i++;
      }
     }
    } else {
     if( step == 2 ){
      if( (label = param._var._label._label[index]) != null ){
       if( param._var._label._flag[index] == _LABEL_MOVABLE ){
        procToken().valueToString( param, param.val( index ), real, imag );
        if( detail ){
         tmp[i] = label + "(@:" + index + ")=" + real.str() + imag.str();
        } else {
         tmp[i] = label + "=" + real.str() + imag.str();
        }
        i++;
       }
      }
     }
     if( step == 3 ){
      if( (label = param._var._label._label[index]) != null ){
       if( param._var._label._flag[index] != _LABEL_MOVABLE ){
        procToken().valueToString( param, param.val( index ), real, imag );
        tmp[i] = label + "(@" + String.fromCharCode( index ) + ")=" + real.str() + imag.str();
        i++;
       }
      } else if( !(param.isZero( index )) ){
       procToken().valueToString( param, param.val( index ), real, imag );
       tmp[i] = "@" + String.fromCharCode( index ) + "=" + real.str() + imag.str();
       i++;
      }
     }
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
  return _CLIP_NO_ERR;
 }
 return _CLIP_PROC_ERR_COMMAND_NULL;
}
function _customCommandExtfunc( _this, param, code, token ){
 var i, j;
 addExtFuncList = true;
 con.setColor( "0000ff" );
 var tmp = new Array();
 for( i = 0, j = 0; i < extFuncData.length; i++ ){
  var name = extFuncName( extFuncFile[i] );
  if( name.length > 0 ){
   tmp[j] = name.toLowerCase();
   j++;
  }
 }
 tmp.sort( function( a, b ){
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
   _this.usage( tmp[i], param, false );
   con.println();
  }
 }
 con.setColor();
 addExtFuncList = false;
 return _CLIP_NO_ERR;
}
function _customCommandUsage( _this, param, code, token ){
 var newToken;
 if( _this._curLine._token.getToken() ){
  newToken = getToken();
  if( getCode() == _CLIP_CODE_EXTFUNC ){
   _this.usage( newToken, param, true );
   return _CLIP_NO_ERR;
  }
 }
 return _CLIP_PROC_ERR_COMMAND_NULL;
}
function _customCommandTest( _this, param, code, token ){
 var value = new _ProcVal();
 if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
  testFlag = (_INT( value.mat().toFloat( 0, 0 ) ) != 0);
  return _CLIP_NO_ERR;
 }
 return _CLIP_PROC_ERR_COMMAND_NULL;
}
function _customCommandTrace( _this, param, code, token ){
 var value = new _ProcVal();
 if( _this._const( param, code, token, value ) == _CLIP_NO_ERR ){
  if( (traceLevel > 0) && (traceString.length > 0) ){
   if( canUseWriteFile() ){
    writeFile( "clip_trace_" + time() + ".log", traceString );
   }
  }
  traceString = "";
  traceLevel = _INT( value.mat().toFloat( 0, 0 ) );
  setProcTraceFlag( traceLevel > 0 );
  return _CLIP_NO_ERR;
 }
 return _CLIP_PROC_ERR_COMMAND_NULL;
}
function doCustomCommand( _this, param, code, token ){
 var command = customCommandName( token );
 if( command == "english" || command == "japanese" ){
  return _customCommandLanguage( _this, param, code, token, command == "english" );
 } else if( command == "env" ){
  return _customCommandEnv( _this, param, code, token );
 } else if( command == "list" || command == "listd" ){
  return _customCommandList( _this, param, code, token, command == "listd" );
 } else if( command == "extfunc" ){
  return _customCommandExtfunc( _this, param, code, token );
 } else if( command == "usage" ){
  return _customCommandUsage( _this, param, code, token );
 } else if( command == "test" ){
  return _customCommandTest( _this, param, code, token );
 } else if( command == "trace" ){
  return _customCommandTrace( _this, param, code, token );
 }
 return _CLIP_PROC_ERR_COMMAND_NULL;
}
function onWriteFileEnd( fileEntry ){
 con.println( "<b>[" + fileEntry.fullPath + "]</b>" );
}
function onStartPlot(){
 setProcTraceFlag( false );
 silentErr = true;
}
function onEndPlot(){
 setProcTraceFlag( traceLevel > 0 );
 silentErr = false;
 var err = new _Integer();
 var num = new _Integer();
 var func = new _String();
 var token = new _String();
 for( var i = 0; i < procError.num(); i++ ){
  procError.get( i, err, num, func, token );
  errorProc( err._val, num._val, func.str(), token.str() );
 }
 procError.delAll();
}
function onStartRePlot(){
 onStartPlot();
}
function onEndRePlot(){
 onEndPlot();
}
function updateLanguage(){
 document.getElementById( "button_cache_clear" ).innerHTML = englishFlag ? "Clear cache" : "外部関数ｷｬｯｼｭのｸﾘｱ";
 document.getElementById( "button_storage_clear" ).innerHTML = englishFlag ? "Clear storage" : "ｽﾄﾚｰｼﾞのｸﾘｱ";
 document.getElementById( "button_cookie_clear" ).innerHTML = englishFlag ? "Clear cookie" : "Cookieのｸﾘｱ";
 document.getElementById( "button_callfunc" ).innerHTML = "&nbsp;" + (englishFlag ? "Call" : "呼び出し") + "&nbsp;";
 document.getElementById( "button_savefunc" ).innerHTML = "&nbsp;" + (englishFlag ? "Save to memory" : "メモリ保存") + "&nbsp;";
 document.getElementById( "button_savecanvas" ).innerHTML = "&nbsp;" + (englishFlag ? "Download" : "ダウンロード") + "&nbsp;";
 document.getElementById( "static_tab" ).innerHTML = (englishFlag ? "Tab width" : "Tab幅") + "&nbsp;";
 document.getElementById( "static_smart" ).innerHTML = englishFlag ? "Smart" : "スマート";
 document.getElementById( "static_command_env" ).innerHTML = englishFlag ? "List environment" : "環境の一覧";
 document.getElementById( "static_command_list_var" ).innerHTML = englishFlag ? "List variables" : "変数の一覧";
 document.getElementById( "static_command_print_array_help" ).innerHTML = englishFlag ? "List elements of array" : "配列の要素一覧";
 document.getElementById( "static_command_list_extfunc" ).innerHTML = englishFlag ? "List external functions" : "外部関数の一覧";
 document.getElementById( "static_command_print_usage" ).innerHTML = englishFlag ? "Print usage of external function" : "外部関数の使用法表示";
 document.getElementById( "static_command_trace" ).innerHTML = englishFlag ? "Trace level" : "トレース・レベル";
 if( englishFlag ){
  document.getElementById( "lang_japanese" ).style.display = "none";
  document.getElementById( "lang_english" ).style.display = "block";
  con.println( "Type &apos;:japanese&apos; to Japanese mode." );
 } else {
  document.getElementById( "lang_english" ).style.display = "none";
  document.getElementById( "lang_japanese" ).style.display = "block";
  con.println( "Type &apos;:english&apos; to English mode." );
 }
}
var needSaveFunc = false;
function onEditorUpdateText( len ){
 document.getElementById( "static_len" ).innerHTML = "" + len;
 needSaveFunc = true;
 document.getElementById( "clip_savefunc" ).style.display = "block";
}
function getFunc( chr ){
 return preference.get( "_CLIP_" + "!" + chr, "" );
}
function setFunc( chr, text ){
 preference.set( "_CLIP_" + "!" + chr, text );
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
 preference.set( "_CLIP_" + "EDITOR_SelFunc", "" + selFunc );
}
function callFunc(){
 saveFunc();
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
 preference.set( "_CLIP_" + "EDITOR_Tab", "" + tabWidth );
}
function doCheckSmart(){
 setEditorSmartFlag( document.getElementById( "check_smart" ).checked );
 preference.set( "_CLIP_" + "EDITOR_Smart", "" + (editorSmartFlag() ? 1 : 0) );
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
 var data = canvas.element().toDataURL( "image/png" ).replace( "image/png", "image/octet-stream" );
 window.open( data, "save" );
}
