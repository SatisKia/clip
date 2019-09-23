/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#ifndef _CLIP_GLOBAL_H
#define _CLIP_GLOBAL_H

/*
 * パラメータ関連
 */

#define _CLIP_MODE_FLOAT		0x0010
#define _CLIP_MODE_COMPLEX		0x0020
#define _CLIP_MODE_FRACT		0x0040
#define _CLIP_MODE_TIME			0x0080
#define _CLIP_MODE_INT			0x0100
#define _CLIP_MODE_E_FLOAT		0x0010//(_CLIP_MODE_FLOAT   | 0)
#define _CLIP_MODE_F_FLOAT		0x0011//(_CLIP_MODE_FLOAT   | 1)
#define _CLIP_MODE_G_FLOAT		0x0012//(_CLIP_MODE_FLOAT   | 2)
#define _CLIP_MODE_E_COMPLEX	0x0020//(_CLIP_MODE_COMPLEX | 0)
#define _CLIP_MODE_F_COMPLEX	0x0021//(_CLIP_MODE_COMPLEX | 1)
#define _CLIP_MODE_G_COMPLEX	0x0022//(_CLIP_MODE_COMPLEX | 2)
#define _CLIP_MODE_I_FRACT		0x0040//(_CLIP_MODE_FRACT   | 0)	// Improper FRACTion
#define _CLIP_MODE_M_FRACT		0x0041//(_CLIP_MODE_FRACT   | 1)	// Mixed FRACTion
#define _CLIP_MODE_H_TIME		0x0080//(_CLIP_MODE_TIME    | 0)
#define _CLIP_MODE_M_TIME		0x0081//(_CLIP_MODE_TIME    | 1)
#define _CLIP_MODE_S_TIME		0x0082//(_CLIP_MODE_TIME    | 2)
#define _CLIP_MODE_F_TIME		0x0083//(_CLIP_MODE_TIME    | 3)
#define _CLIP_MODE_S_CHAR		0x0100//(_CLIP_MODE_INT     | 0)	// Signed
#define _CLIP_MODE_U_CHAR		0x0101//(_CLIP_MODE_INT     | 1)	// Unsigned
#define _CLIP_MODE_S_SHORT		0x0102//(_CLIP_MODE_INT     | 2)	// Signed
#define _CLIP_MODE_U_SHORT		0x0103//(_CLIP_MODE_INT     | 3)	// Unsigned
#define _CLIP_MODE_S_LONG		0x0104//(_CLIP_MODE_INT     | 4)	// Signed
#define _CLIP_MODE_U_LONG		0x0105//(_CLIP_MODE_INT     | 5)	// Unsigned

#define _CLIP_DEFMODE	_CLIP_MODE_G_FLOAT

#define _CLIP_DEFFPS	30.0

#define _CLIP_MINPREC	0
#define _CLIP_DEFPREC	6

#define _CLIP_MINRADIX	2
#define _CLIP_MAXRADIX	36
#define _CLIP_DEFRADIX	10

/*
 * 識別コード
 */

#define _CLIP_CODE_MASK			0x1F
#define _CLIP_CODE_VAR_MASK		0x20
#define _CLIP_CODE_ARRAY_MASK	0x40

#define _CLIP_CODE_TOP			0	// (

#define _CLIP_CODE_VARIABLE		0x21//(1 | _CLIP_CODE_VAR_MASK)	// 変数
#define _CLIP_CODE_AUTO_VAR		0x22//(2 | _CLIP_CODE_VAR_MASK)	// 動的変数
#define _CLIP_CODE_GLOBAL_VAR	0x23//(3 | _CLIP_CODE_VAR_MASK)	// グローバル変数

#define _CLIP_CODE_ARRAY		0x44//(4 | _CLIP_CODE_ARRAY_MASK)	// 配列
#define _CLIP_CODE_AUTO_ARRAY	0x45//(5 | _CLIP_CODE_ARRAY_MASK)	// 動的配列
#define _CLIP_CODE_GLOBAL_ARRAY	0x46//(6 | _CLIP_CODE_ARRAY_MASK)	// グローバル配列

#define _CLIP_CODE_CONSTANT		7	// 定数
#define _CLIP_CODE_LABEL		8	// ラベル
#define _CLIP_CODE_COMMAND		9	// コマンド
#define _CLIP_CODE_STATEMENT	10	// 文
#define _CLIP_CODE_OPERATOR		11	// 演算子
#define _CLIP_CODE_FUNCTION		12	// 関数
#define _CLIP_CODE_EXTFUNC		13	// 外部関数

#define _CLIP_CODE_PROC_END		14

#define _CLIP_CODE_NULL			14/*_CLIP_CODE_PROC_END*/

#define _CLIP_CODE_END			15	// )

#define _CLIP_CODE_ARRAY_TOP	16	// {
#define _CLIP_CODE_ARRAY_END	17	// }

#define _CLIP_CODE_MATRIX		18	// 行列
#define _CLIP_CODE_STRING		19	// 文字列

#define _CLIP_CODE_SEPARATOR	20	// 
#define _CLIP_CODE_COMMENT		21	// コメント

#define _CLIP_CODE_PARAM_ANS	22	// &
#define _CLIP_CODE_PARAM_ARRAY	23	// []

#define _CLIP_CODE_SE			24	// 単一式

/*
 * 演算子の種類
 */

#define _CLIP_OP_INCREMENT		0	// [++]
#define _CLIP_OP_DECREMENT		1	// [--]
#define _CLIP_OP_COMPLEMENT		2	// [~]
#define _CLIP_OP_NOT			3	// [!]
#define _CLIP_OP_MINUS			4	// [-]
#define _CLIP_OP_PLUS			5	// [+]

#define _CLIP_OP_UNARY_END		6

#define _CLIP_OP_POSTFIXINC		6/*_CLIP_OP_UNARY_END*/	// ++
#define _CLIP_OP_POSTFIXDEC		7						// --

#define _CLIP_OP_MUL			8	// *
#define _CLIP_OP_DIV			9	// /
#define _CLIP_OP_MOD			10	// %

#define _CLIP_OP_ADD			11	// +
#define _CLIP_OP_SUB			12	// -

#define _CLIP_OP_SHIFTL			13	// <<
#define _CLIP_OP_SHIFTR			14	// >>

#define _CLIP_OP_LESS			15	// <
#define _CLIP_OP_LESSOREQ		16	// <=
#define _CLIP_OP_GREAT			17	// >
#define _CLIP_OP_GREATOREQ		18	// >=

#define _CLIP_OP_EQUAL			19	// ==
#define _CLIP_OP_NOTEQUAL		20	// !=

#define _CLIP_OP_AND			21	// &

#define _CLIP_OP_XOR			22	// ^

#define _CLIP_OP_OR				23	// |

#define _CLIP_OP_LOGAND			24	// &&

#define _CLIP_OP_LOGOR			25	// ||

#define _CLIP_OP_CONDITIONAL	26	// ?

#define _CLIP_OP_ASS			27	// =
#define _CLIP_OP_MULANDASS		28	// *=
#define _CLIP_OP_DIVANDASS		29	// /=
#define _CLIP_OP_MODANDASS		30	// %=
#define _CLIP_OP_ADDANDASS		31	// +=
#define _CLIP_OP_SUBANDASS		32	// -=
#define _CLIP_OP_SHIFTLANDASS	33	// <<=
#define _CLIP_OP_SHIFTRANDASS	34	// >>=
#define _CLIP_OP_ANDANDASS		35	// &=
#define _CLIP_OP_ORANDASS		36	// |=
#define _CLIP_OP_XORANDASS		37	// ^=

#define _CLIP_OP_COMMA			38	// ,

#define _CLIP_OP_POW			39	// **
#define _CLIP_OP_POWANDASS		40	// **=

/*
 * 関数の種類
 */

#define _CLIP_FUNC_DEFINED	0
#define _CLIP_FUNC_INDEXOF	1

#define _CLIP_FUNC_ISINF	2
#define _CLIP_FUNC_ISNAN	3

#define _CLIP_FUNC_RAND		4
#define _CLIP_FUNC_TIME		5
#define _CLIP_FUNC_MKTIME	6
#define _CLIP_FUNC_TM_SEC	7
#define _CLIP_FUNC_TM_MIN	8
#define _CLIP_FUNC_TM_HOUR	9
#define _CLIP_FUNC_TM_MDAY	10
#define _CLIP_FUNC_TM_MON	11
#define _CLIP_FUNC_TM_YEAR	12
#define _CLIP_FUNC_TM_WDAY	13
#define _CLIP_FUNC_TM_YDAY	14
#define _CLIP_FUNC_TM_XMON	15
#define _CLIP_FUNC_TM_XYEAR	16

#define _CLIP_FUNC_A2D		17
#define _CLIP_FUNC_A2G		18
#define _CLIP_FUNC_A2R		19
#define _CLIP_FUNC_D2A		20
#define _CLIP_FUNC_D2G		21
#define _CLIP_FUNC_D2R		22
#define _CLIP_FUNC_G2A		23
#define _CLIP_FUNC_G2D		24
#define _CLIP_FUNC_G2R		25
#define _CLIP_FUNC_R2A		26
#define _CLIP_FUNC_R2D		27
#define _CLIP_FUNC_R2G		28

#define _CLIP_FUNC_SIN		29
#define _CLIP_FUNC_COS		30
#define _CLIP_FUNC_TAN		31
#define _CLIP_FUNC_ASIN		32
#define _CLIP_FUNC_ACOS		33
#define _CLIP_FUNC_ATAN		34
#define _CLIP_FUNC_ATAN2	35
#define _CLIP_FUNC_SINH		36
#define _CLIP_FUNC_COSH		37
#define _CLIP_FUNC_TANH		38
#define _CLIP_FUNC_ASINH	39
#define _CLIP_FUNC_ACOSH	40
#define _CLIP_FUNC_ATANH	41
#define _CLIP_FUNC_EXP		42
#define _CLIP_FUNC_EXP10	43
#define _CLIP_FUNC_LN		44
#define _CLIP_FUNC_LOG		45
#define _CLIP_FUNC_LOG10	46
#define _CLIP_FUNC_POW		47
#define _CLIP_FUNC_SQR		48
#define _CLIP_FUNC_SQRT		49
#define _CLIP_FUNC_CEIL		50
#define _CLIP_FUNC_FLOOR	51
#define _CLIP_FUNC_ABS		52
#define _CLIP_FUNC_LDEXP	53
#define _CLIP_FUNC_FREXP	54
#define _CLIP_FUNC_MODF		55

#define _CLIP_FUNC_INT		56
#define _CLIP_FUNC_REAL		57
#define _CLIP_FUNC_IMAG		58
#define _CLIP_FUNC_ARG		59
#define _CLIP_FUNC_NORM		60
#define _CLIP_FUNC_CONJG	61
#define _CLIP_FUNC_POLAR	62

#define _CLIP_FUNC_NUM		63
#define _CLIP_FUNC_DENOM	64

#define _CLIP_FUNC_ROW		65
#define _CLIP_FUNC_COL		66
#define _CLIP_FUNC_TRANS	67

#define _CLIP_FUNC_GWIDTH	68
#define _CLIP_FUNC_GHEIGHT	69
#define _CLIP_FUNC_GCOLOR	70
#define _CLIP_FUNC_GCOLOR24	71
#define _CLIP_FUNC_GCX		72
#define _CLIP_FUNC_GCY		73
#define _CLIP_FUNC_WCX		74
#define _CLIP_FUNC_WCY		75
#define _CLIP_FUNC_GGET		76
#define _CLIP_FUNC_WGET		77
#define _CLIP_FUNC_GX		78
#define _CLIP_FUNC_GY		79
#define _CLIP_FUNC_WX		80
#define _CLIP_FUNC_WY		81

#define _CLIP_FUNC_CALL		82
#define _CLIP_FUNC_EVAL		83

/*
 * 文の種類
 */

#define _CLIP_STAT_START		0
#define _CLIP_STAT_END			1
#define _CLIP_STAT_END_INC		2
#define _CLIP_STAT_END_DEC		3
#define _CLIP_STAT_ENDEQ		4
#define _CLIP_STAT_ENDEQ_INC	5
#define _CLIP_STAT_ENDEQ_DEC	6

#define _CLIP_STAT_DO			7
#define _CLIP_STAT_UNTIL		8

#define _CLIP_STAT_WHILE		9
#define _CLIP_STAT_ENDWHILE		10

#define _CLIP_STAT_FOR			11
#define _CLIP_STAT_FOR2			12
#define _CLIP_STAT_NEXT			13

#define _CLIP_STAT_FUNC			14
#define _CLIP_STAT_ENDFUNC		15

#define _CLIP_STAT_LOOP_END		16

#define _CLIP_STAT_IF			16/*_CLIP_STAT_LOOP_END*/
#define _CLIP_STAT_ELIF			17
#define _CLIP_STAT_ELSE			18
#define _CLIP_STAT_ENDIF		19

#define _CLIP_STAT_SWITCH		20
#define _CLIP_STAT_CASE			21
#define _CLIP_STAT_DEFAULT		22
#define _CLIP_STAT_ENDSWI		23
#define _CLIP_STAT_BREAKSWI		24

#define _CLIP_STAT_CONTINUE		25
#define _CLIP_STAT_BREAK		26
#define _CLIP_STAT_CONTINUE2	27
#define _CLIP_STAT_BREAK2		28

#define _CLIP_STAT_ASSERT		29
#define _CLIP_STAT_RETURN		30
#define _CLIP_STAT_RETURN2		31
#define _CLIP_STAT_RETURN3		32

/*
 * コマンドの種類
 */

#define _CLIP_COMMAND_NULL			0

#define _CLIP_COMMAND_EFLOAT		1
#define _CLIP_COMMAND_FFLOAT		2
#define _CLIP_COMMAND_GFLOAT		3
#define _CLIP_COMMAND_ECOMPLEX		4
#define _CLIP_COMMAND_FCOMPLEX		5
#define _CLIP_COMMAND_GCOMPLEX		6
#define _CLIP_COMMAND_PREC			7

#define _CLIP_COMMAND_IFRACT		8
#define _CLIP_COMMAND_MFRACT		9

#define _CLIP_COMMAND_HTIME			10
#define _CLIP_COMMAND_MTIME			11
#define _CLIP_COMMAND_STIME			12
#define _CLIP_COMMAND_FTIME			13
#define _CLIP_COMMAND_FPS			14

#define _CLIP_COMMAND_SCHAR			15
#define _CLIP_COMMAND_UCHAR			16
#define _CLIP_COMMAND_SSHORT		17
#define _CLIP_COMMAND_USHORT		18
#define _CLIP_COMMAND_SLONG			19
#define _CLIP_COMMAND_ULONG			20
#define _CLIP_COMMAND_SINT			21
#define _CLIP_COMMAND_UINT			22
#define _CLIP_COMMAND_RADIX			23

#define _CLIP_COMMAND_PTYPE			24

#define _CLIP_COMMAND_RAD			25
#define _CLIP_COMMAND_DEG			26
#define _CLIP_COMMAND_GRAD			27

#define _CLIP_COMMAND_ANGLE			28

#define _CLIP_COMMAND_ANS			29
#define _CLIP_COMMAND_ASSERT		30
#define _CLIP_COMMAND_WARN			31

#define _CLIP_COMMAND_PARAM			32
#define _CLIP_COMMAND_PARAMS		33

#define _CLIP_COMMAND_DEFINE		34
#define _CLIP_COMMAND_ENUM			35
#define _CLIP_COMMAND_UNDEF			36
#define _CLIP_COMMAND_VAR			37
#define _CLIP_COMMAND_ARRAY			38
#define _CLIP_COMMAND_LOCAL			39
#define _CLIP_COMMAND_GLOBAL		40
#define _CLIP_COMMAND_LABEL			41
#define _CLIP_COMMAND_PARENT		42

#define _CLIP_COMMAND_REAL			43
#define _CLIP_COMMAND_IMAG			44

#define _CLIP_COMMAND_NUM			45
#define _CLIP_COMMAND_DENOM			46

#define _CLIP_COMMAND_MAT			47
#define _CLIP_COMMAND_TRANS			48

#define _CLIP_COMMAND_SRAND			49
#define _CLIP_COMMAND_LOCALTIME		50

#define _CLIP_COMMAND_CLEAR			51
#define _CLIP_COMMAND_ERROR			52
#define _CLIP_COMMAND_PRINT			53
#define _CLIP_COMMAND_PRINTLN		54
#define _CLIP_COMMAND_SPRINT		55
#define _CLIP_COMMAND_SCAN			56

#define _CLIP_COMMAND_GWORLD		57
#define _CLIP_COMMAND_GCLEAR		58
#define _CLIP_COMMAND_GCOLOR		59
#define _CLIP_COMMAND_GFILL			60
#define _CLIP_COMMAND_GMOVE			61
#define _CLIP_COMMAND_GTEXT			62
#define _CLIP_COMMAND_GTEXTL		63
#define _CLIP_COMMAND_GLINE			64
#define _CLIP_COMMAND_GPUT			65
#define _CLIP_COMMAND_GGET			66
#define _CLIP_COMMAND_GGET24		67
#define _CLIP_COMMAND_GUPDATE		68

#define _CLIP_COMMAND_WINDOW		69
#define _CLIP_COMMAND_WFILL			70
#define _CLIP_COMMAND_WMOVE			71
#define _CLIP_COMMAND_WTEXT			72
#define _CLIP_COMMAND_WTEXTL		73
#define _CLIP_COMMAND_WLINE			74
#define _CLIP_COMMAND_WPUT			75
#define _CLIP_COMMAND_WGET			76

#define _CLIP_COMMAND_RECTANGULAR	77
#define _CLIP_COMMAND_PARAMETRIC	78
#define _CLIP_COMMAND_POLAR			79
#define _CLIP_COMMAND_LOGSCALE		80
#define _CLIP_COMMAND_NOLOGSCALE	81
#define _CLIP_COMMAND_PLOT			82
#define _CLIP_COMMAND_REPLOT		83

#define _CLIP_COMMAND_CALCULATOR	84

#define _CLIP_COMMAND_INCLUDE		85

#define _CLIP_COMMAND_BASE			86

#define _CLIP_COMMAND_NAMESPACE		87

#define _CLIP_COMMAND_DUMP			88
#define _CLIP_COMMAND_LOG			89

#define _CLIP_COMMAND_CUSTOM		90

/*
 * 単一式の種類
 */

#define _CLIP_SE_NULL			0

#define _CLIP_SE_INCREMENT		1
#define _CLIP_SE_DECREMENT		2
#define _CLIP_SE_NEGATIVE		3

#define _CLIP_SE_COMPLEMENT		4
#define _CLIP_SE_NOT			5
#define _CLIP_SE_MINUS			6

#define _CLIP_SE_SET			7

#define _CLIP_SE_MUL			8
#define _CLIP_SE_DIV			9
#define _CLIP_SE_MOD			10
#define _CLIP_SE_ADD			11
#define _CLIP_SE_SUB			12
#define _CLIP_SE_POW			13
#define _CLIP_SE_SHIFTL			14
#define _CLIP_SE_SHIFTR			15
#define _CLIP_SE_AND			16
#define _CLIP_SE_OR				17
#define _CLIP_SE_XOR			18

#define _CLIP_SE_LESS			19
#define _CLIP_SE_LESSOREQ		20
#define _CLIP_SE_GREAT			21
#define _CLIP_SE_GREATOREQ		22
#define _CLIP_SE_EQUAL			23
#define _CLIP_SE_NOTEQUAL		24
#define _CLIP_SE_LOGAND			25
#define _CLIP_SE_LOGOR			26

#define _CLIP_SE_MUL_A			27
#define _CLIP_SE_DIV_A			28
#define _CLIP_SE_MOD_A			29
#define _CLIP_SE_ADD_A			30
#define _CLIP_SE_SUB_A			31
#define _CLIP_SE_POW_A			32
#define _CLIP_SE_SHIFTL_A		33
#define _CLIP_SE_SHIFTR_A		34
#define _CLIP_SE_AND_A			35
#define _CLIP_SE_OR_A			36
#define _CLIP_SE_XOR_A			37

#define _CLIP_SE_LESS_A			38
#define _CLIP_SE_LESSOREQ_A		39
#define _CLIP_SE_GREAT_A		40
#define _CLIP_SE_GREATOREQ_A	41
#define _CLIP_SE_EQUAL_A		42
#define _CLIP_SE_NOTEQUAL_A		43
#define _CLIP_SE_LOGAND_A		44
#define _CLIP_SE_LOGOR_A		45

#define _CLIP_SE_CONDITIONAL	46

#define _CLIP_SE_SET_FALSE		47
#define _CLIP_SE_SET_TRUE		48
#define _CLIP_SE_SET_ZERO		49

#define _CLIP_SE_LOOPSTART		50
#define _CLIP_SE_LOOPEND		51
#define _CLIP_SE_LOOPEND_INC	52
#define _CLIP_SE_LOOPEND_DEC	53
#define _CLIP_SE_LOOPENDEQ		54
#define _CLIP_SE_LOOPENDEQ_INC	55
#define _CLIP_SE_LOOPENDEQ_DEC	56
#define _CLIP_SE_CONTINUE		57
#define _CLIP_SE_BREAK			58
#define _CLIP_SE_RETURN			59
#define _CLIP_SE_RETURN_ANS		60

#define _CLIP_SE_FUNC			61

/*
 * エラー・コード
 */

#define _CLIP_NO_ERR					0x00						// 正常終了
#define _CLIP_LOOP_STOP					0x01						//
#define _CLIP_LOOP_CONT					0x02						//
#define _CLIP_PROC_SUB_END				0x03						//
#define _CLIP_PROC_END					0x04						//

#define _CLIP_ERR_START					0x100

#define _CLIP_LOOP_ERR					0x100/*_CLIP_ERR_START*/

#define _CLIP_LOOP_ERR_NULL				0x100//(_CLIP_LOOP_ERR | 0x00)		// トークンがありません
#define _CLIP_LOOP_ERR_COMMAND			0x101//(_CLIP_LOOP_ERR | 0x01)		// コマンドはサポートされていません
#define _CLIP_LOOP_ERR_STAT				0x102//(_CLIP_LOOP_ERR | 0x02)		// 制御構造はサポートされていません

#define _CLIP_PROC_WARN					0x1000

#define _CLIP_PROC_WARN_ARRAY			0x1000//(_CLIP_PROC_WARN | 0x00)	// 配列の要素番号が負の値です
#define _CLIP_PROC_WARN_DIV				0x1001//(_CLIP_PROC_WARN | 0x01)	// ゼロで除算しました
#define _CLIP_PROC_WARN_UNDERFLOW		0x1002//(_CLIP_PROC_WARN | 0x02)	// アンダーフローしました
#define _CLIP_PROC_WARN_OVERFLOW		0x1003//(_CLIP_PROC_WARN | 0x03)	// オーバーフローしました
#define _CLIP_PROC_WARN_ASIN			0x1004//(_CLIP_PROC_WARN | 0x04)	// 関数asinの引数が-1から1の範囲外になりました
#define _CLIP_PROC_WARN_ACOS			0x1005//(_CLIP_PROC_WARN | 0x05)	// 関数acosの引数が-1から1の範囲外になりました
#define _CLIP_PROC_WARN_ACOSH			0x1006//(_CLIP_PROC_WARN | 0x06)	// 関数acoshの引数が1未満の値になりました
#define _CLIP_PROC_WARN_ATANH			0x1007//(_CLIP_PROC_WARN | 0x07)	// 関数atanhの引数が-1以下または1以上の値になりました
#define _CLIP_PROC_WARN_LOG				0x1008//(_CLIP_PROC_WARN | 0x08)	// 関数logの引数が0または負の値になりました
#define _CLIP_PROC_WARN_LOG10			0x1009//(_CLIP_PROC_WARN | 0x09)	// 関数log10の引数が0または負の値になりました
#define _CLIP_PROC_WARN_SQRT			0x100A//(_CLIP_PROC_WARN | 0x0A)	// 関数sqrtの引数が負の値になりました
#define _CLIP_PROC_WARN_FUNCTION		0x100B//(_CLIP_PROC_WARN | 0x0B)	// 関数の引数が無効です
#define _CLIP_PROC_WARN_RETURN			0x100C//(_CLIP_PROC_WARN | 0x0C)	// returnで値を返すことができません
#define _CLIP_PROC_WARN_DEAD_TOKEN		0x100D//(_CLIP_PROC_WARN | 0x0D)	// 実行されないトークンです
#define _CLIP_PROC_WARN_SE_RETURN		0x100E//(_CLIP_PROC_WARN | 0x0E)	// $RETURN_Aで値を返すことができません

#define _CLIP_ERROR						0x2000

#define _CLIP_ERR_TOKEN					0x2000//(_CLIP_ERROR | 0x00)		// 指定番号のトークンがありません
#define _CLIP_ERR_ASSERT				0x2001//(_CLIP_ERROR | 0x01)		// アサートに失敗しました

#define _CLIP_PROC_ERR					0x2100//(_CLIP_ERROR | 0x100)

#define _CLIP_PROC_ERR_UNARY			0x2100//(_CLIP_PROC_ERR | 0x00)		// 単項演算子表現が間違っています
#define _CLIP_PROC_ERR_OPERATOR			0x2101//(_CLIP_PROC_ERR | 0x01)		// 演算子表現が間違っています
#define _CLIP_PROC_ERR_ARRAY			0x2102//(_CLIP_PROC_ERR | 0x02)		// 配列表現が間違っています
#define _CLIP_PROC_ERR_FUNCTION			0x2103//(_CLIP_PROC_ERR | 0x03)		// 関数の引数が間違っています
#define _CLIP_PROC_ERR_LVALUE			0x2104//(_CLIP_PROC_ERR | 0x04)		// 左辺は変数または配列でなければなりません
#define _CLIP_PROC_ERR_RVALUE			0x2105//(_CLIP_PROC_ERR | 0x05)		// 右辺は変数または配列でなければなりません
#define _CLIP_PROC_ERR_RVALUE_NULL		0x2106//(_CLIP_PROC_ERR | 0x06)		// 右辺がありません
#define _CLIP_PROC_ERR_CONDITIONAL		0x2107//(_CLIP_PROC_ERR | 0x07)		// 三項演算子の右辺に定数または変数が2個指定されていません
#define _CLIP_PROC_ERR_EXTFUNC			0x2108//(_CLIP_PROC_ERR | 0x08)		// 外部関数の実行が中断されました
#define _CLIP_PROC_ERR_USERFUNC			0x2109//(_CLIP_PROC_ERR | 0x09)		// ユーザー定義関数の実行が中断されました
#define _CLIP_PROC_ERR_CONSTANT			0x210A//(_CLIP_PROC_ERR | 0x0A)		// 定数表現が間違っています
#define _CLIP_PROC_ERR_STRING			0x210B//(_CLIP_PROC_ERR | 0x0B)		// 文字列表現が間違っています
#define _CLIP_PROC_ERR_COMPLEX			0x210C//(_CLIP_PROC_ERR | 0x0C)		// 複素数表現が間違っています
#define _CLIP_PROC_ERR_FRACT			0x210D//(_CLIP_PROC_ERR | 0x0D)		// 分数表現が間違っています
#define _CLIP_PROC_ERR_ASS				0x210E//(_CLIP_PROC_ERR | 0x0E)		// 定数への代入は無効です
#define _CLIP_PROC_ERR_CALL				0x210F//(_CLIP_PROC_ERR | 0x0F)		// 関数呼び出しに失敗しました

#define _CLIP_PROC_ERR_STAT_IF			0x2120//(_CLIP_PROC_ERR | 0x20)		// ifのネスト数が多すぎます
#define _CLIP_PROC_ERR_STAT_ENDIF		0x2121//(_CLIP_PROC_ERR | 0x21)		// endifに対応するifがありません
#define _CLIP_PROC_ERR_STAT_SWITCH		0x2122//(_CLIP_PROC_ERR | 0x22)		// switchのネスト数が多すぎます
#define _CLIP_PROC_ERR_STAT_ENDSWI		0x2123//(_CLIP_PROC_ERR | 0x23)		// endswiに対応するswitchがありません
#define _CLIP_PROC_ERR_STAT_UNTIL		0x2124//(_CLIP_PROC_ERR | 0x24)		// untilに対応するdoがありません
#define _CLIP_PROC_ERR_STAT_ENDWHILE	0x2125//(_CLIP_PROC_ERR | 0x25)		// endwhileに対応するwhileがありません
#define _CLIP_PROC_ERR_STAT_FOR_CON		0x2126//(_CLIP_PROC_ERR | 0x26)		// forにおける条件部がありません
#define _CLIP_PROC_ERR_STAT_FOR_EXP		0x2127//(_CLIP_PROC_ERR | 0x27)		// forにおける更新式がありません
#define _CLIP_PROC_ERR_STAT_NEXT		0x2128//(_CLIP_PROC_ERR | 0x28)		// nextに対応するforがありません
#define _CLIP_PROC_ERR_STAT_CONTINUE	0x2129//(_CLIP_PROC_ERR | 0x29)		// continueは無効です
#define _CLIP_PROC_ERR_STAT_BREAK		0x212A//(_CLIP_PROC_ERR | 0x2A)		// breakは無効です
#define _CLIP_PROC_ERR_STAT_FUNC		0x212B//(_CLIP_PROC_ERR | 0x2B)		// 関数の数が多すぎます
#define _CLIP_PROC_ERR_STAT_FUNC_NEST	0x212C//(_CLIP_PROC_ERR | 0x2C)		// 関数内で関数は定義できません
#define _CLIP_PROC_ERR_STAT_ENDFUNC		0x212D//(_CLIP_PROC_ERR | 0x2D)		// endfuncに対応するfuncがありません
#define _CLIP_PROC_ERR_STAT_FUNCNAME	0x212E//(_CLIP_PROC_ERR | 0x2E)		// 関数名は無効です
#define _CLIP_PROC_ERR_STAT_FUNCPARAM	0x212F//(_CLIP_PROC_ERR | 0x2F)		// 関数の引数にラベル設定できません
#define _CLIP_PROC_ERR_STAT_LOOP		0x2130//(_CLIP_PROC_ERR | 0x30)		// ループ回数オーバーしました

#define _CLIP_PROC_ERR_COMMAND_NULL		0x2140//(_CLIP_PROC_ERR | 0x40)		// コマンドが間違っています
#define _CLIP_PROC_ERR_COMMAND_PARAM	0x2141//(_CLIP_PROC_ERR | 0x41)		// コマンドの引数が間違っています
#define _CLIP_PROC_ERR_COMMAND_DEFINE	0x2142//(_CLIP_PROC_ERR | 0x42)		// ラベルは既に定義されています
#define _CLIP_PROC_ERR_COMMAND_UNDEF	0x2143//(_CLIP_PROC_ERR | 0x43)		// ラベルは定義されていません
#define _CLIP_PROC_ERR_COMMAND_PARAMS	0x2144//(_CLIP_PROC_ERR | 0x44)		// コマンドの引数は10個までしか指定できません

#define _CLIP_PROC_ERR_FUNC_OPEN		0x2160//(_CLIP_PROC_ERR | 0x60)		// 外部関数がオープンできません
#define _CLIP_PROC_ERR_FUNC_PARANUM		0x2161//(_CLIP_PROC_ERR | 0x61)		// 外部関数の引数は10個までしか指定できません
#define _CLIP_PROC_ERR_FUNC_PARACODE	0x2162//(_CLIP_PROC_ERR | 0x62)		// 外部関数の引数は定数、変数または配列名でなければなりません

#define _CLIP_PROC_ERR_SE_NULL			0x2180//(_CLIP_PROC_ERR | 0x80)		// 単一式が間違っています
#define _CLIP_PROC_ERR_SE_OPERAND		0x2181//(_CLIP_PROC_ERR | 0x81)		// 単一式のオペランドが間違っています
#define _CLIP_PROC_ERR_SE_LOOPEND		0x2182//(_CLIP_PROC_ERR | 0x82)		// $LOOPENDに対応する$LOOPSTARTがありません
#define _CLIP_PROC_ERR_SE_CONTINUE		0x2183//(_CLIP_PROC_ERR | 0x83)		// $CONTINUEは無効です
#define _CLIP_PROC_ERR_SE_BREAK			0x2184//(_CLIP_PROC_ERR | 0x84)		// $BREAKは無効です

// グラフの種類
#define _GRAPH_MODE_RECT	0	// 直交座標モード
#define _GRAPH_MODE_PARAM	1	// 媒介変数モード
#define _GRAPH_MODE_POLAR	2	// 極座標モード

// ラベルの状態
#define _LABEL_UNUSED	0	// 未使用状態
#define _LABEL_USED		1	// 使用状態
#define _LABEL_MOVABLE	2	// 動的変数・配列

// 計算クラス用
#define _PROC_DEF_PARENT_MODE	_CLIP_DEFMODE
#define _PROC_DEF_PRINT_ASSERT	false
#define _PROC_DEF_PRINT_WARN	true
#define _PROC_DEF_GUPDATE_FLAG	true

// 空白文字
#define _CHAR_CODE_SPACE	0xA0

// エスケープ文字
#define _CHAR_UTF8_YEN	'¥'/*0xC2A5*/

// 不正な配列の要素番号
#define _INVALID_ARRAY_INDEX	0xFFFFFFFF/*ULONG_MAX*/

#include "math\_Math.h"

#endif // _CLIP_GLOBAL_H
