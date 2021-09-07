function _Complex(n,t){this._re=n==undefined?0:n;this._im=t==undefined?0:t}function getComplex(n,t,i){t.set(n._re);i.set(n._im)}function setComplex(n,t,i){return n._re=t,n._im=i,n}function dupComplex(n){return new _Complex(n._re,n._im)}function floatToComplex(n){return new _Complex(n,0)}function _radToAng(n){return complexIsRad()?n:n*complexAngCoef()/_PI}function _angToRad(n){return complexIsRad()?n:n*_PI/complexAngCoef()}function fsin(n){return _SIN(_angToRad(n))}function fcos(n){return _COS(_angToRad(n))}function ftan(n){return _TAN(_angToRad(n))}function fasin(n){return _radToAng(_ASIN(n))}function facos(n){return _radToAng(_ACOS(n))}function fatan(n){return _radToAng(_ATAN(n))}function fatan2(n,t){return _radToAng(_ATAN2(n,t))}function fsinh(n){if(_ABS(n)>_EPS5){var t=_EXP(n);return(t-1/t)/2}return n*(1+n*n/6)}function fcosh(n){var t=_EXP(n);return(t+1/t)/2}function ftanh(n){return n>_EPS5?2/(1+_EXP(-2*n))-1:n<-_EPS5?1-2/(_EXP(2*n)+1):n*(1-n*n/3)}function fasinh(n){return n>_EPS5?_LOG(_SQRT(n*n+1)+n):n<-_EPS5?-_LOG(_SQRT(n*n+1)-n):n*(1-n*n/6)}function facosh(n){return _LOG(n+_SQRT(n*n-1))}function fatanh(n){return _ABS(n)>_EPS5?_LOG((1+n)/(1-n))*.5:n*(1+n*n/3)}function _MathEnv(){this._complex_ang_type=0;this._complex_israd=!0;this._complex_ang_coef=_PI;this._complex_isreal=!1;this._complex_err=!1;this._fract_err=!1;this._matrix_err=!1;this._time_fps=30;this._time_err=!1;this._value_type=0}function setMathEnv(n){_math_env=n}function setComplexAngType(n){_math_env._complex_ang_type=n;_math_env._complex_israd=_math_env._complex_ang_type==0;_math_env._complex_ang_coef=_math_env._complex_ang_type==1?180:200}function complexAngType(){return _math_env._complex_ang_type}function complexIsRad(){return _math_env._complex_israd}function complexAngCoef(){return _math_env._complex_ang_coef}function setComplexIsReal(n){_math_env._complex_isreal=n}function complexIsReal(){return _math_env._complex_isreal}function clearComplexError(){_math_env._complex_err=!1}function setComplexError(){_math_env._complex_err=!0}function complexError(){return _math_env._complex_err}function clearFractError(){_math_env._fract_err=!1}function setFractError(){_math_env._fract_err=!0}function fractError(){return _math_env._fract_err}function clearMatrixError(){_math_env._matrix_err=!1}function setMatrixError(){_math_env._matrix_err=!0}function matrixError(){return _math_env._matrix_err}function setTimeFps(n){_math_env._time_fps=n}function timeFps(){return _math_env._time_fps}function clearTimeError(){_math_env._time_err=!1}function setTimeError(){_math_env._time_err=!0}function timeError(){return _math_env._time_err}function setValueType(n){_math_env._value_type=n}function valueType(){return _math_env._value_type}function clearValueError(){clearComplexError();clearFractError();clearTimeError()}function valueError(){return complexError()||fractError()||timeError()}function dft(n,t,i,r){for(var s=6.2831853071795862/t,f,o,e,u=t-1;u>=0;u--)for(o=s*u,n[u]=new _Complex,f=0;f<r;f++)e=o*f,n[u]._re+=i[f]*_COS(e),n[u]._im-=i[f]*_SIN(e)}function idft(n,t,i,r){for(var s=6.2831853071795862/t,f,o,e,u=t-1;u>=0;u--){for(o=s*u,n[u]=0,f=0;f<r;f++)e=o*f,n[u]+=i[f]._re*_COS(e)-i[f]._im*_SIN(e);n[u]/=t}}function conv(n,t,i,r,u,f){var o=[],s=[],e;for(dft(o,t,i,r),dft(s,t,u,f),e=t-1;e>=0;e--)o[e].mulAndAss(s[e]);idft(n,t,o,t)}function mul(n,t,i){var e,o,s,r,h,f,u,c;if(t=mp.clone(t),i=mp.clone(i),e=!1,t[0]<0&&i[0]>=0&&(e=!0),i[0]<0&&t[0]>=0&&(e=!0),o=mp.getLen(t),s=mp.getLen(i),o==0||s==0){n[0]=0;return}for(r=o+s,h=[],conv(h,r,t.slice(1),o,i.slice(1),s),n[r]=0,f=0,n[0]=0,u=1;u<r;u++)c=_INT(h[u-1]+.5)+f,n[u]=_MOD(c,_MP_ELEMENT),f=_DIV(c,_MP_ELEMENT);n[u]=f;mp.setLen(n,f!=0?r:r-1,e)}function consoleBreak(){return _console_break}function _Console(n){window.onConsoleUpdate==undefined&&(window.onConsoleUpdate=function(){});this._id=n;this._div=document.getElementById(this._id);this._html="";this._blankLine="";this._maxLen=0;this._color="";this._lastColor="";this._bold=!1;this._italic=!1;this._lock=!1;this._needUpdate=!1}function onConsoleUpdate(){}function printBold(n){con.setBold(!0);con.println(n);con.setBold(!1)}function printBlue(n){con.setColor("0000ff");con.println(n);con.setColor()}function _Error(){window.onError==undefined&&(window.onError=function(){});this._message=new String;this._name=new String;this._description=new String;this._number=new String;this._file=new String;this._line=new String;this._column=new String;this._stack=new String}function catchError(n){var t=new _Error;t._message=n.message;t._name=n.name;n.description&&(t._description=n.description);n.number&&(t._number=""+n.number);n.fileName&&(t._file=n.fileName);n.lineNumber&&(t._line=""+n.lineNumber);n.columnNumber&&(t._column=""+n.columnNumber);n.stack&&(t._stack=n.stack);onError(t)}function clip_onerror(n,t,i){var r=new _Error;return r._message=n,r._file=t,r._line=i,onError(r),!0}function _String(n){this._str=n==undefined?"":n==null?null:""+n}function newStringArray(n){for(var i=new Array(n),t=0;t<n;t++)i[t]=new _String;return i}function onError(n){con.setColor("ff0000");con.println("<b>message:<\/b> "+n.message());con.println("<b>name:<\/b> "+n.name());con.println("<b>description:<\/b> "+n.description());con.println("<b>number:<\/b> "+n.number());con.println("<b>file:<\/b> "+n.file());con.println("<b>line:<\/b> "+n.line());con.println("<b>column:<\/b> "+n.column());var t=new _String(n.stack());t.escape().replaceNewLine(consoleBreak());con.println("<b>stack:<\/b> "+t.str());con.setColor()}function pi_out5(n,i,r){var o=_DIV(_LOG(n),_LOG(2)),u=[],f,e;if(start==0){mp.set(a,mp.F("1"));switch(r){case 0:mp.fsqrt3(u,mp.F("2"),n);break;case 1:mp.fsqrt(u,mp.F("2"),n);break;default:mp.fsqrt2(u,mp.F("2"),n,r)}mp.fdiv(b,mp.F("1"),u,n);mp.fdiv(t,mp.F("1"),mp.F("4"),n);mp.set(p,mp.F("1"))}for(f=[],e=0;e<i;e++){mp.fadd(u,a,b);mp.fmul(f,u,mp.F("0.5"),n);mp.fmul(u,a,b,n);switch(r){case 0:mp.fsqrt3(b,u,n);break;case 1:mp.fsqrt(b,u,n);break;default:mp.fsqrt2(b,u,n,r)}mp.fsub(u,a,f);mp.fmul(u,u,u,n);mp.fmul(u,p,u,n);mp.fsub(t,t,u);mp.fmul(p,mp.F("2"),p,n);mp.set(a,f);start++}return mp.fadd(u,a,b),mp.fmul(u,u,u,n),mp.fmul(f,mp.F("4"),t,n),mp.fdiv2(pi,u,f,n),start<o}function round(n,t){for(var r,u,i=0;i<=8;i++)con.print("<td>"),r=[],mp.fset(r,mp.F(n)),mp.fround(r,t,i),u=mp.fnum2str(r,t),u.charAt(0)!="-"&&con.print("&nbsp;"),con.print(u+"<\/td>")}function main(n){con=new _Console(n);setMathEnv(new _MathEnv);mp=new _MultiPrec;con.lock();try{testSqrt(1e3);testRound1();testRound2()}catch(t){catchError(t)}con.unlock()}function testSqrt(n){for(var u,f,r,i,t=0;t<=7;t++){t!=0&&con.println();switch(t){case 0:con.print("fsqrt3: ");break;case 1:con.print("fsqrt: ");break;case 7:con.print("fsqrt2 order=4 dft: ");break;default:con.print("fsqrt2 order="+t+": ")}if(u=(new Date).getTime(),start=0,t==7)for(mp.mul=mul;pi_out5(n,1,4););else while(pi_out5(n,1,t));if(con.println(""+((new Date).getTime()-u)+" ms"),f=mp.fnum2str(pi,n),r=f.split("."),con.println(r[0]+"."),r[1])for(i=0;i<r[1].length;i+=100)con.println(r[1].substring(i,i+100))}con.println()}function testRound1(){con.print("<table border='1' cellspacing='1' cellpadding='4'>");con.print("<tr>");con.print("<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<\/td>");con.print("<td>UP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<\/td>");con.print("<td>DOWN&nbsp;&nbsp;&nbsp;<\/td>");con.print("<td>CEILING<\/td>");con.print("<td>FLOOR&nbsp;&nbsp;<\/td>");con.print("<td>H_UP&nbsp;&nbsp;&nbsp;<\/td>");con.print("<td>H_DOWN&nbsp;<\/td>");con.print("<td>H_EVEN&nbsp;<\/td>");con.print("<td>H_DOWN2<\/td>");con.print("<td>H_EVEN2<\/td>");con.print("<\/tr>");con.print("<tr><td>&nbsp;5.501<\/td>");round("5.501",0);con.print("<\/tr>");con.print("<tr><td>&nbsp;5.5<\/td>");round("5.5",0);con.print("<\/tr>");con.print("<tr><td>&nbsp;2.501<\/td>");round("2.501",0);con.print("<\/tr>");con.print("<tr><td>&nbsp;2.5<\/td>");round("2.5",0);con.print("<\/tr>");con.print("<tr><td>&nbsp;1.6<\/td>");round("1.6",0);con.print("<\/tr>");con.print("<tr><td>&nbsp;1.1<\/td>");round("1.1",0);con.print("<\/tr>");con.print("<tr><td>&nbsp;1.0<\/td>");round("1.0",0);con.print("<\/tr>");con.print("<tr><td>-1.0<\/td>");round("-1.0",0);con.print("<\/tr>");con.print("<tr><td>-1.1<\/td>");round("-1.1",0);con.print("<\/tr>");con.print("<tr><td>-1.6<\/td>");round("-1.6",0);con.print("<\/tr>");con.print("<tr><td>-2.5<\/td>");round("-2.5",0);con.print("<\/tr>");con.print("<tr><td>-2.501<\/td>");round("-2.501",0);con.print("<\/tr>");con.print("<tr><td>-5.5<\/td>");round("-5.5",0);con.print("<\/tr>");con.print("<tr><td>-5.501<\/td>");round("-5.501",0);con.print("<\/tr>");con.print("<\/table>");con.println()}function testRound2(){var u=[],r,t,n,i;for(mp.fsqrt(u,mp.F("2"),45),r=[],n=0;n<45;n++)for(t=mp.fnum2str(u,45),con.setColor("0000ff"),con.print(t.substring(0,n+3)),con.setColor(),con.println(t.substring(n+3)),i=0;i<=8;i++){mp.fset(r,u);mp.fround(r,n,i);t=mp.fnum2str(r,n);switch(i){case _MP_FROUND_UP:con.print("UP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");break;case _MP_FROUND_DOWN:con.print("DOWN&nbsp;&nbsp;&nbsp;");break;case _MP_FROUND_CEILING:con.print("CEILING");break;case _MP_FROUND_FLOOR:con.print("FLOOR&nbsp;&nbsp;");break;case _MP_FROUND_HALF_UP:con.print("H_UP&nbsp;&nbsp;&nbsp;");break;case _MP_FROUND_HALF_DOWN:con.print("H_DOWN&nbsp;");break;case _MP_FROUND_HALF_EVEN:con.print("H_EVEN&nbsp;");break;case _MP_FROUND_HALF_DOWN2:con.print("H_DOWN2");break;case _MP_FROUND_HALF_EVEN2:con.print("H_EVEN2")}con.println("&nbsp;"+t)}con.println()}var mp,_EPS5=.001,_SQRT05=.70710678118654757,_PI,_math_env,_console_break,con;_Complex.prototype={angToAng:function(n,t){if(n!=t)switch(n){case 0:this.mulAndAss(t==1?180:200);this.divAndAss(_PI);break;case 1:this.mulAndAss(t==0?_PI:200);this.divAndAss(180);break;case 2:this.mulAndAss(t==0?_PI:180);this.divAndAss(200)}},setReal:function(n){this._re=n},setImag:function(n){this._im=n},polar:function(n,t){t=_angToRad(t);this._re=n*_COS(t);this._im=n*_SIN(t)},real:function(){return this._re},imag:function(){return this._im},toFloat:function(){return this._re},ass:function(n){return n instanceof _Complex?(this._re=n._re,this._im=n._im):(this._re=n,this._im=0),this},minus:function(){return new _Complex(-this._re,-this._im)},add:function(n){return n instanceof _Complex?new _Complex(this._re+n._re,this._im+n._im):new _Complex(this._re+n,this._im)},addAndAss:function(n){return n instanceof _Complex?(this._re+=n._re,this._im+=n._im):this._re+=n,this},sub:function(n){return n instanceof _Complex?new _Complex(this._re-n._re,this._im-n._im):new _Complex(this._re-n,this._im)},subAndAss:function(n){return n instanceof _Complex?(this._re-=n._re,this._im-=n._im):this._re-=n,this},mul:function(n){return n instanceof _Complex?n._im==0?new _Complex(this._re*n._re,this._im*n._re):new _Complex(this._re*n._re-this._im*n._im,this._re*n._im+this._im*n._re):new _Complex(this._re*n,this._im*n)},mulAndAss:function(n){if(n instanceof _Complex)if(n._im==0)this._re*=n._re,this._im*=n._re;else{var t=this._re*n._re-this._im*n._im;this._im=this._re*n._im+this._im*n._re;this._re=t}else this._re*=n,this._im*=n;return this},div:function(n){var t,i;return n instanceof _Complex?n._im==0?new _Complex(this._re/n._re,this._im/n._re):_ABS(n._re)<_ABS(n._im)?(t=n._re/n._im,i=n._re*t+n._im,new _Complex((this._re*t+this._im)/i,(this._im*t-this._re)/i)):(t=n._im/n._re,i=n._re+n._im*t,new _Complex((this._re+this._im*t)/i,(this._im-this._re*t)/i)):new _Complex(this._re/n,this._im/n)},divAndAss:function(n){if(n instanceof _Complex)if(n._im==0)this._re/=n._re,this._im/=n._re;else if(_ABS(n._re)<_ABS(n._im)){var t=n._re/n._im,i=n._re*t+n._im,r=(this._re*t+this._im)/i;this._im=(this._im*t-this._re)/i;this._re=r}else{var t=n._im/n._re,i=n._re+n._im*t,r=(this._re+this._im*t)/i;this._im=(this._im-this._re*t)/i;this._re=r}else this._re/=n,this._im/=n;return this},mod:function(n){if(n instanceof _Complex){if(n._im==0)return new _Complex(this._re%n._re,this._im%n._re);var t=dupComplex(this);return t.divAndAss(n),t._re=_INT(t._re),t._im=_INT(t._im),t.mulAndAss(n),this.sub(t)}return new _Complex(this._re%n,this._im%n)},modAndAss:function(n){if(n instanceof _Complex)if(n._im==0)this._re=this._re%n._re,this._im=this._im%n._re;else{var t=dupComplex(this);t.divAndAss(n);t._re=_INT(t._re);t._im=_INT(t._im);t.mulAndAss(n);this.subAndAss(t)}else this._re=this._re%n,this._im=this._im%n;return this},equal:function(n){return n instanceof _Complex?this._re==n._re&&this._im==n._im:this._re==n&&this._im==0},notEqual:function(n){return n instanceof _Complex?this._re!=n._re||this._im!=n._im:this._re!=n||this._im!=0},fabs:function(){var n;return this._re==0?_ABS(this._im):this._im==0?_ABS(this._re):_ABS(this._re)<_ABS(this._im)?(n=this._re/this._im,_ABS(this._im)*_SQRT(1+n*n)):(n=this._im/this._re,_ABS(this._re)*_SQRT(1+n*n))},farg:function(){return fatan2(this._im,this._re)},fnorm:function(){return this._re*this._re+this._im*this._im},conjg:function(){return new _Complex(this._re,-this._im)},sin:function(){if(this._im==0)return floatToComplex(fsin(this._re));var n=_angToRad(this._re),t=_angToRad(this._im);return new _Complex(_SIN(n)*fcosh(t),_COS(n)*fsinh(t))},cos:function(){if(this._im==0)return floatToComplex(fcos(this._re));var n=_angToRad(this._re),t=_angToRad(this._im);return new _Complex(_COS(n)*fcosh(t),-_SIN(n)*fsinh(t))},tan:function(){if(this._im==0)return floatToComplex(ftan(this._re));var t=_angToRad(this._re)*2,i=_angToRad(this._im)*2,n=_COS(t)+fcosh(i);return n==0&&setComplexError(),new _Complex(_SIN(t)/n,fsinh(i)/n)},asin:function(){if(this._im==0)if(this._re<-1||this._re>1){if(complexIsReal())return setComplexError(),floatToComplex(fasin(this._re))}else return floatToComplex(fasin(this._re));var t=new _Complex(0,1),n=t.minus().mul(t.mul(this).add(this.sqr().minus().add(1).sqrt()).log());return n._re=_radToAng(n._re),n._im=_radToAng(n._im),n},acos:function(){if(this._im==0)if(this._re<-1||this._re>1){if(complexIsReal())return setComplexError(),floatToComplex(facos(this._re))}else return floatToComplex(facos(this._re));var t=new _Complex(0,1),n=t.mul(this.sub(t.mul(this.sqr().minus().add(1).sqrt())).log());return n._re=_radToAng(n._re),n._im=_radToAng(n._im),n},atan:function(){var t,i,n;return this._im==0?floatToComplex(fatan(this._re)):(t=new _Complex(-this._re,1-this._im),t.equal(0)&&setComplexError(),i=new _Complex(0,1),n=i.mul(i.add(this).div(t).log()).mul(.5),n._re=_radToAng(n._re),n._im=_radToAng(n._im),n)},sinh:function(){return this._im==0?floatToComplex(fsinh(this._re)):new _Complex(fsinh(this._re)*_COS(this._im),fcosh(this._re)*_SIN(this._im))},cosh:function(){return this._im==0?floatToComplex(fcosh(this._re)):new _Complex(fcosh(this._re)*_COS(this._im),fsinh(this._re)*_SIN(this._im))},tanh:function(){if(this._im==0)return floatToComplex(ftanh(this._re));var t=this._re*2,i=this._im*2,n=fcosh(t)+_COS(i);return n==0&&setComplexError(),new _Complex(fsinh(t)/n,_SIN(i)/n)},asinh:function(){return this._im==0?floatToComplex(fasinh(this._re)):this.add(this.sqr().add(1).sqrt()).log()},acosh:function(){if(this._im==0)if(this._re<1){if(complexIsReal())return setComplexError(),floatToComplex(facosh(this._re))}else return floatToComplex(facosh(this._re));return this.add(this.sqr().sub(1).sqrt()).log()},atanh:function(){if(this._im==0)if(this._re<=-1||this._re>=1){if(complexIsReal())return setComplexError(),floatToComplex(fatanh(this._re))}else return floatToComplex(fatanh(this._re));var n=new _Complex(1-this._re,-this._im);return n.equal(0)&&setComplexError(),this.add(1).div(n).log().mul(.5)},ceil:function(){return new _Complex(_CEIL(this._re),_CEIL(this._im))},floor:function(){return new _Complex(_FLOOR(this._re),_FLOOR(this._im))},exp:function(){if(this._im==0)return floatToComplex(_EXP(this._re));var n=_EXP(this._re);return new _Complex(n*_COS(this._im),n*_SIN(this._im))},exp10:function(){if(this._im==0)return floatToComplex(_EXP(this._re/_NORMALIZE));var n=this._im/_NORMALIZE,t=_EXP(this._re/_NORMALIZE);return new _Complex(t*_COS(n),t*_SIN(n))},log:function(){if(this._im==0)if(this._re<=0){if(complexIsReal())return setComplexError(),floatToComplex(_LOG(this._re))}else return floatToComplex(_LOG(this._re));return new _Complex(_LOG(this.fabs()),_ATAN2(this._im,this._re))},log10:function(){if(this._im==0)if(this._re<=0){if(complexIsReal())return setComplexError(),floatToComplex(_LOG(this._re)*_NORMALIZE)}else return floatToComplex(_LOG(this._re)*_NORMALIZE);return new _Complex(_LOG(this.fabs())*_NORMALIZE,_ATAN2(this._im,this._re)*_NORMALIZE)},pow:function(n){return n instanceof _Complex?n._im==0?this._im==0?floatToComplex(_POW(this._re,n._re)):this.log().mul(n._re).exp():this._im==0?n.mul(_LOG(this._re)).exp():this.log().mul(n).exp():this._im==0?floatToComplex(_POW(this._re,n)):this.log().mul(n).exp()},sqr:function(){return this._im==0?floatToComplex(this._re*this._re):new _Complex(this._re*this._re-this._im*this._im,this._re*this._im+this._im*this._re)},sqrt:function(){var n;if(this._im==0)if(this._re<0){if(complexIsReal())return setComplexError(),floatToComplex(_SQRT(this._re))}else return floatToComplex(_SQRT(this._re));return this._re>=0?(n=_SQRT(this.fabs()+this._re),new _Complex(_SQRT05*n,_SQRT05*this._im/n)):this._im>=0?(n=_SQRT(this.fabs()-this._re),new _Complex(_SQRT05*this._im/n,_SQRT05*n)):(n=_SQRT(this.fabs()-this._re),new _Complex(-_SQRT05*this._im/n,-_SQRT05*n))}};_PI=3.1415926535897931;_console_break="<br>";_Console.prototype={setMaxBlankLine:function(n){this._blankLine="";for(var t=0;t<=n;t++)this._blankLine+=_console_break},setMaxLen:function(n){this._maxLen=n},setColor:function(n){this._color=n==undefined?"":n},setBold:function(n){this._bold=n},setItalic:function(n){this._italic=n},lock:function(){this._lock=!0;this._needUpdate=!1},unlock:function(){this._lock=!1;this._needUpdate&&(this._update(),this._needUpdate=!1)},_update:function(){if(this._lock){this._needUpdate=!0;return}if(this._maxLen>0)while(this._html.length>this._maxLen){var n=this._html.indexOf(_console_break);if(n<0)break;this._html=this._html.slice(n+_console_break.length)}this._div.innerHTML=this._html;this._html.length>0&&onConsoleUpdate(this._id)},_add:function(n){n.length>0&&(this._bold&&(this._html.slice(-4)=="<\/b>"?this._html=this._html.substring(0,this._html.length-4):this._html+="<b>"),this._italic&&(this._html.slice(-4)=="<\/i>"?this._html=this._html.substring(0,this._html.length-4):this._html+="<i>"),this._color.length>0&&(this._html.slice(-7)=="<\/span>"&&this._color==this._lastColor?this._html=this._html.substring(0,this._html.length-7):this._html+="<span style='color:#"+this._color+"'>",this._lastColor=this._color),this._html+=n,this._color.length>0&&(this._html+="<\/span>"),this._italic&&(this._html+="<\/i>"),this._bold&&(this._html+="<\/b>"))},clear:function(){this._html="";this._update()},newLine:function(){this._html.length>=_console_break.length&&this._html.slice(-_console_break.length)!=_console_break&&(this._html+=_console_break,this._update())},print:function(n){n!=undefined&&(this._add(n),this._update())},println:function(n){var t=!1;n!=undefined&&(this._add(n),t=!0);this._blankLine.length>0&&this._html.length>=this._blankLine.length?this._html.slice(-this._blankLine.length)!=this._blankLine&&(this._html+=_console_break,t=!0):(this._html+=_console_break,t=!0);t&&this._update()},scrollBottom:function(){this._div.scrollTop=this._div.scrollHeight}};_Error.prototype={message:function(){return this._message},name:function(){return this._name},description:function(){return this._description},number:function(){return this._number},file:function(){return this._file},line:function(){return this._line},column:function(){return this._column},stack:function(){return this._stack}};_String.prototype={set:function(n){return this._str=n==null?null:""+n,this},add:function(n){return n!=null&&(this._str==null?this.set(n):this._str+=""+n),this},str:function(){return this._str==null?"":this._str},isNull:function(){return this._str==null},replace:function(n,t){var r=n.length,i,u,f;if(r>0)for(i=0;i<this.str().length;)this.str().substring(i,r)==n?(u=i>0?this.str().substring(0,i):"",f=r<this.str().length?this.str().slice(r):"",this.set(u+t+f),i+=t.length,r+=t.length):(i++,r++);return this},replaceMulti:function(n,t){for(;;){var i=this.str();if(this.replace(n,t),i==this.str())break}return this},replaceNewLine:function(n){return this.replace("\r\n","\n"),this.replace("\r","\n"),n!=undefined&&this.replace("\n",n),this},escape:function(){return this.replace("&","&amp;"),this.replace("<","&lt;"),this.replace(">","&gt;"),this.replace('"',"&quot;"),this.replace(" ","&nbsp;"),this},unescape:function(){return this.replace("&lt;","<"),this.replace("&gt;",">"),this.replace("&quot;",'"'),this.replace("&nbsp;"," "),this.replace("&amp;","&"),this}};var pi=[],a=[],b=[],t=[],p=[],start