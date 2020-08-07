/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Math.h"

var _PI = 3.14159265358979323846264;	// 円周率

var _math_env;
function _MathEnv(){
	// _Complex用
	this._complex_ang_type = _ANG_TYPE_RAD;	// 角度の単位の種類
	this._complex_israd    = true;			// 角度の単位の種類がラジアンかどうかのフラグ
	this._complex_ang_coef = _PI;			// ラジアンから現在の単位への変換用係数
	this._complex_isreal   = false;			// 実数計算を行うかどうかのフラグ
	this._complex_err      = false;			// エラーが起こったかどうかのフラグ

	// _Fract用
	this._fract_err = false;	// エラーが起こったかどうかのフラグ

	// _Matrix用
	this._matrix_err = false;	// エラーが起こったかどうかのフラグ

	// _Time用
	this._time_fps = 30.0;	// 秒間フレーム数（グローバル）
	this._time_err = false;	// エラーが起こったかどうかのフラグ

	// _Value用
	this._value_type = _VALUE_TYPE_COMPLEX;	// 型（グローバル）
}
function setMathEnv( env/*_MathEnv*/ ){
	_math_env = env;
}

/*
 * _Complex用
 */

function setComplexAngType( angType ){
	_math_env._complex_ang_type = angType;
	_math_env._complex_israd    = (_math_env._complex_ang_type == _ANG_TYPE_RAD);
	_math_env._complex_ang_coef = (_math_env._complex_ang_type == _ANG_TYPE_DEG) ? 180.0 : 200.0;
}
function complexAngType(){
	return _math_env._complex_ang_type;
}
function complexIsRad(){
	return _math_env._complex_israd;
}
function complexAngCoef(){
	return _math_env._complex_ang_coef;
}

function setComplexIsReal( isReal ){
	_math_env._complex_isreal = isReal;
}
function complexIsReal(){
	return _math_env._complex_isreal;
}

function clearComplexError(){
	_math_env._complex_err = false;
}
function setComplexError(){
	_math_env._complex_err = true;
}
function complexError(){
	return _math_env._complex_err;
}

/*
 * _Fract用
 */

function clearFractError(){
	_math_env._fract_err = false;
}
function setFractError(){
	_math_env._fract_err = true;
}
function fractError(){
	return _math_env._fract_err;
}

/*
 * _Matrix用
 */

function clearMatrixError(){
	_math_env._matrix_err = false;
}
function setMatrixError(){
	_math_env._matrix_err = true;
}
function matrixError(){
	return _math_env._matrix_err;
}

/*
 * _Time用
 */

function setTimeFps( fps ){
	_math_env._time_fps = fps;
}
function timeFps(){
	return _math_env._time_fps;
}

function clearTimeError(){
	_math_env._time_err = false;
}
function setTimeError(){
	_math_env._time_err = true;
}
function timeError(){
	return _math_env._time_err;
}

/*
 * _Value用
 */

function setValueType( type ){
	_math_env._value_type = type;
}
function valueType(){
	return _math_env._value_type;
}

function clearValueError(){
	clearComplexError();
	clearFractError();
	clearTimeError();
}
function valueError(){
	return complexError() || fractError() || timeError();
}
