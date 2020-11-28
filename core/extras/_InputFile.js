/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

var _input_file_cnt;
var _input_file_num;

function canUseFile(){
	return (window.FileReader && window.FileList && window.File);
}

// ファイル選択コントロール
function _InputFile( id ){
	if( window.onInputFileLoadImage == undefined ) window.onInputFileLoadImage = function( name, image ){};
	if( window.onInputFileLoad == undefined ) window.onInputFileLoad = function( func, data ){};
	if( window.onInputFileLoadEnd == undefined ) window.onInputFileLoadEnd = function( num ){};

	this._input = document.getElementById( id );

	this._input.addEventListener( "change", _onInputFileChange, false );
}

_InputFile.prototype = {
	element : function(){
		return this._input;
	}
};

function _onInputFileChange( e ){
	var files = e.target.files;
	if( files.length == 0 ){
		return;
	}

	// 画像ファイル
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
		return;
	}

	// 外部関数ファイル
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
