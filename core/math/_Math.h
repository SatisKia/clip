/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#ifndef _CLIP_MATH_H
#define _CLIP_MATH_H

// 角度の単位の種類
#define _ANG_TYPE_RAD	0	// ラジアン
#define _ANG_TYPE_DEG	1	// 度
#define _ANG_TYPE_GRAD	2	// グラジアン

// 型
#define _VALUE_TYPE_COMPLEX	0	// 複素数型
#define _VALUE_TYPE_FRACT	1	// 分数型
#define _VALUE_TYPE_TIME	2	// 時間型

// _SIGNED、_UNSIGNED用
#define _UMAX_8		256
#define _UMAX_16	65536
#define _UMAX_24	16777216
#define _UMAX_32	4294967296

// _SIGNED用
#define _SMIN_8		-128
#define _SMAX_8		 127
#define _SMIN_16	-32768
#define _SMAX_16	 32767
#define _SMIN_32	-2147483648
#define _SMAX_32	 2147483647

#endif // _CLIP_MATH_H
