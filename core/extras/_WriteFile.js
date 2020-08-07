/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

function canUseWriteFile(){
	return (window.navigator.userAgent.toLowerCase().indexOf( "chrome" ) != -1);
}

// ファイル出力
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
