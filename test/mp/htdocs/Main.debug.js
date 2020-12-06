





function _String( str ){
 this._str = (str == undefined) ? "" : ((str == null) ? null : "" + str);
}

_String.prototype = {
 set : function( str ){
  this._str = (str == null) ? null : "" + str;
  return this;
 },
 add : function( str ){
  if( str != null ){
   if( this._str == null ){
    this.set( str );
   } else {
    this._str += "" + str;
   }
  }
  return this;
 },
 str : function(){
  return (this._str == null) ? "" : this._str;
 },
 isNull : function(){
  return (this._str == null);
 },
 replace : function( word, replacement ){
  var end = word.length;
  if( end > 0 ){
   var top = 0;
   while( top < this.str().length ){
    if( this.str().substring( top, end ) == word ){
     var forward = (top > 0) ? this.str().substring( 0, top ) : "";
     var after = (end < this.str().length) ? this.str().slice( end ) : "";
     this.set( forward + replacement + after );
     top += replacement.length;
     end += replacement.length;
    } else {
     top++;
     end++;
    }
   }
  }
  return this;
 },
 replaceNewLine : function( replacement ){
  this.replace( "\r\n", "\n" );
  this.replace( "\r" , "\n" );
  if( replacement != undefined ){
   this.replace( "\n", replacement );
  }
  return this;
 },
 escape : function(){
  this.replace( "&" , "&amp;" );
  this.replace( "<" , "&lt;" );
  this.replace( ">" , "&gt;" );
  this.replace( "\"", "&quot;" );
  this.replace( " " , "&nbsp;" );
  return this;
 },
 unescape : function(){
  this.replace( "&lt;" , "<" );
  this.replace( "&gt;" , ">" );
  this.replace( "&quot;", "\"" );
  this.replace( "&nbsp;", " " );
  this.replace( "&amp;" , "&" );
  return this;
 }
};

function newStringArray( len ){
 var a = new Array( len );
 for( var i = 0; i < len; i++ ){
  a[i] = new _String();
 }
 return a;
}
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
}
function printBold( s ){
 con.setBold( true );
 con.println( s );
 con.setBold( false );
}
function printBlue( s ){
 con.setColor( "0000ff" );
 con.println( s );
 con.setColor();
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
var mp;
var pi = new Array();
var a = new Array();
var b = new Array();
var n = new Array();
var p = new Array();
var t = new Array();
var tt = new Array();
var u = new Array();
var start;
function pi_out5( prec, count, order ){
 var N = _DIV( _LOG( prec ), _LOG( 2 ) );
 if( start == 0 ){
  mp.set( a, mp.F( "1" ) );
  switch( order ){
  case 0 : mp.fsqrt3( tt, mp.F( "2" ), prec ); break;
  case 1 : mp.fsqrt ( tt, mp.F( "2" ), prec ); break;
  default: mp.fsqrt2( tt, mp.F( "2" ), prec, order ); break;
  }
  mp.fdiv( b, mp.F( "1" ), tt, prec );
  mp.fdiv( t, mp.F( "1" ), mp.F( "4" ), prec );
  mp.set( p, mp.F( "1" ) );
 }
 for( var i = 0; i < count; i++ ){
  mp.fadd( tt, a, b );
  mp.fmul( n, tt, mp.F( "0.5" ), prec );
  mp.fmul( tt, a, b, prec );
  switch( order ){
  case 0 : mp.fsqrt3( b, tt, prec ); break;
  case 1 : mp.fsqrt ( b, tt, prec ); break;
  default: mp.fsqrt2( b, tt, prec, order ); break;
  }
  mp.fsub( tt, a, n );
  mp.fmul( tt, tt, tt, prec );
  mp.fmul( tt, p, tt, prec );
  mp.fsub( t, t, tt );
  mp.fmul( p, mp.F( "2" ), p, prec );
  mp.set( a, n );
  start++;
 }
 mp.fadd( tt, a, b );
 mp.fmul( tt, tt, tt, prec );
 mp.fmul( u, mp.F( "4" ), t, prec );
 mp.fdiv2( pi, tt, u, prec );
 return (start < N);
}
function main( id ){
 con = new _Console( id );
 mp = new _MultiPrec();
 for( var order = 0; order <= 6; order++ ){
  if( order != 0 ){
   con.println();
  }
  switch( order ){
  case 0 : con.print( "fsqrt3: " ); break;
  case 1 : con.print( "fsqrt: " ); break;
  default: con.print( "fsqrt2 order=" + order + ": " ); break;
  }
  var time = (new Date()).getTime();
  start = 0;
  while( pi_out5( 1000, 1, order ) ){}
  con.println( "" + ((new Date()).getTime() - time) + " ms" );
  var str = mp.fnum2str( pi );
  var tmp = str.split( "." );
  con.println( tmp[0] + "." );
  if( tmp[1] ){
   for( var i = 0; i < tmp[1].length; i += 100 ){
    con.println( tmp[1].substring( i, i + 100 ) );
   }
  }
 }
}
