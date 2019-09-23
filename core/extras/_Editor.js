/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

var _editor_cursor_pos = 0;
var _editor_text       = "";

// スマート
var _editor_smart = true;
function setEditorSmartFlag( flag ){
	_editor_smart = flag;
}
function editorSmartFlag(){
	return _editor_smart;
}

// エディタ
function _Editor( id ){
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
		_editor_text       = this._textarea.value;
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

//function onEditorUpdateText( len ){}
