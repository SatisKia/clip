/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */

#ifndef _MP_FROUND_H
#define _MP_FROUND_H

#define _MP_FROUND_UP			0	// ゼロから離れるように丸める
#define _MP_FROUND_DOWN			1	// ゼロに近づくように丸める
#define _MP_FROUND_CEILING		2	// 正の無限大に近づくように丸める
#define _MP_FROUND_FLOOR		3	// 負の無限大に近づくように丸める
#define _MP_FROUND_HALF_UP		4	// 四捨五入する
#define _MP_FROUND_HALF_DOWN	5	// 五捨六入する
#define _MP_FROUND_HALF_EVEN	6	// n桁で丸める場合のn桁目の数値が奇数の場合はHALF_UP、偶数の場合はHALF_DOWN
#define _MP_FROUND_HALF_DOWN2	7	// 五捨五超入する
#define _MP_FROUND_HALF_EVEN2	8	// n桁で丸める場合のn桁目の数値が奇数の場合はHALF_UP、偶数の場合はHALF_DOWN2

#endif // _MP_FROUND_H
