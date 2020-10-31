/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */
(function(n,t){function k(){this._color_r=0;this._color_g=0;this._color_b=0;this._color_a=255;this._font="";this._stroke_width=1}function h(n){r=n}function c(n){n==t?(this._canvas=f.createElement(tt),this._create=!0):(this._canvas=f.getElementById(n),this._create=!1);this._context=this._canvas.getContext(it);this._resetContext()}function d(){this._su=new v;var r=this;n.gWorldClear==t&&(n.gWorldClear=function(n,t){var r=i()._canvas;r.setColorRGB(gWorldBgColor());r.fill(0,0,r.width(),r.height());r.setColorBGR(i()._palette[t]);r.fill(0,0,n._width,n._height);r.setColorBGR(i()._palette[n._color])});n.gWorldSetColor==t&&(n.gWorldSetColor=function(n,t){i()._canvas.setColorBGR(i()._palette[t])});n.gWorldPutColor==t&&(n.gWorldPutColor=function(n,t,r,u){var f=i()._canvas;f.setColorBGR(i()._palette[u]);f.put(t,r);f.setColorBGR(i()._palette[n._color])});n.gWorldPut==t&&(n.gWorldPut=function(n,t,r){i()._canvas.put(t,r)});n.gWorldFill==t&&(n.gWorldFill=function(n,t,r,u,f){i()._canvas.fill(t,r,u,f)});n.gWorldLine==t&&(n.gWorldLine=function(n,t,r,u,f){i()._canvas.line(t,r,u,f)});n.gWorldTextColor==t&&(n.gWorldTextColor=function(n,t,u,f,e,o){o&&(u-=r._su.stringWidth(t));var s=i()._canvas;s.setColorBGR(i()._palette[e]);s.drawString(t,u,f+2);s.setColorBGR(i()._palette[n._color])})}function g(n){a=n}function i(){return a}function vt(){return a._canvas}function nt(){n.loopMax==t&&(n.loopMax=65536);n.arrayTokenStringSpace==t&&(n.arrayTokenStringSpace="&nbsp;");n.arrayTokenStringBreak==t&&(n.arrayTokenStringBreak="<br>");n.mainProc==t&&(n.mainProc=function(n,t,i,r,u,f){var e=u.mainLoop(i,f,r,t);return resetProcLoopCount(),e});n.doFuncGColor==t&&(n.doFuncGColor=function(n){return doFuncGColorBGR(n,i()._palette)});n.doFuncGColor24==t&&(n.doFuncGColor24=function(n){return _RGB2BGR(i()._palette[n])});n.doFuncEval==t&&(n.doFuncEval=function(n,t,i,r,u){return n.doFuncEval(t,i,r,u)});n.doCommandGColor==t&&(n.doCommandGColor=function(n,t){i()._palette[n]=_RGB2BGR(t)});n.doCommandGPut24==t&&(n.doCommandGPut24=function(n,t,r){i()._canvas.setColorRGB(r);i()._canvas.put(n,t)});n.doCommandGPut24End==t&&(n.doCommandGPut24End=function(){i()._canvas.setColorBGR(i()._palette[procGWorld()._color])});n.doCommandGGet24Begin==t&&(n.doCommandGGet24Begin=function(n,t){var r=procGWorld()._width,u=procGWorld()._height;return r>0&&u>0?(n.set(r),t.set(u),i()._canvas.imageData(r,u).data):null});n.doCommandPlot==t&&(n.doCommandPlot=function(n,t,i,r,u,f){var o=new _Proc(t._mode,n._printAssert,n._printWarn,!1),e=new _Param(n._curLine._num,t,!0);e._enableCommand=!1;e._enableStat=!1;n.doCommandPlot(o,e,i,r,u,f);e.end();o.end()});n.doCommandRePlot==t&&(n.doCommandRePlot=function(n,t,i,r,u,f){var o=new _Proc(t._mode,n._printAssert,n._printWarn,!1),e=new _Param(n._curLine._num,t,!0);e._enableCommand=!1;e._enableStat=!1;n.doCommandRePlot(o,e,i,r,u,f);e.end();o.end()});defGWorldFunction();defProcFunction();setDefineValue();this._procEnv=new _ProcEnv;setProcEnv(this._procEnv);this._proc=new _Proc(_PROC_DEF_PARENT_MODE,_PROC_DEF_PRINT_ASSERT,_PROC_DEF_PRINT_WARN,!1);this._proc._printAns=!1;setProcWarnFlowFlag(!0);setProcTraceFlag(!1);setProcLoopMax(loopMax);this._param=new _Param;this._param._enableCommand=!0;this._param._enableOpPow=!1;this._param._enableStat=!0;setGlobalParam(this._param);srand(time());rand();this._palette=null;this._canvasEnv=null;this._canvas=null}function v(){this._fontSize=0;this._fontFamily="";this._text=f.createElement(ct);this._textStyle=lt;this._text.style.cssText=this._textStyle;f.body.appendChild(this._text);this._h="";this._e=""}var f=n.document,tt="canvas",it="2d",rt="left",ut="bottom",ft="width",et="height",ot="rgb(",e=",",y=")",st="rgba(",p="px ",o=" ",u="'",l="i",ht="+",s="-",ct="span",lt="visibility:hidden;position:absolute;left:0;top:0",at=";font:",w="igm",b="　",r,a;c.prototype={element:function(){return this._canvas},context:function(){return this._context},_resetContext:function(){this._context.textAlign=rt;this._context.textBaseline=ut;this._setColor();this._setFont();this._setStrokeWidth()},setSize:function(n,t){this._create?(this._canvas.width=n,this._canvas.height=t):(this._canvas.setAttribute(ft,""+n),this._canvas.setAttribute(et,""+t));this._resetContext()},left:function(){if(this._create)return 0;for(var n=this._canvas,t=0;n;)t+=n.offsetLeft,n=n.offsetParent;return t},top:function(){if(this._create)return 0;for(var n=this._canvas,t=0;n;)t+=n.offsetTop,n=n.offsetParent;return t},width:function(){return parseInt(this._canvas.width)},height:function(){return parseInt(this._canvas.height)},_setColor:function(){var n;n=r._color_a==255?ot+r._color_r+e+r._color_g+e+r._color_b+y:st+r._color_r+e+r._color_g+e+r._color_b+e+r._color_a/255+y;this._context.fillStyle=n;this._context.strokeStyle=n},setColor:function(n,i,u,f){f==t&&(f=255);(n!=r._color_r||i!=r._color_g||u!=r._color_b||f!=r._color_a)&&(r._color_r=n,r._color_g=i,r._color_b=u,r._color_a=f,this._setColor())},setColorRGB:function(n){this.setColor((n&16711680)>>16,(n&65280)>>8,n&255)},setColorBGR:function(n){this.setColor(n&255,(n&65280)>>8,(n&16711680)>>16)},_setFont:function(){r._font.length>0&&(this._context.font=r._font)},setFont:function(n,t){r._font=""+n+p+(t.indexOf(o)>=0?u+t+u:t);this._setFont()},_setStrokeWidth:function(){this._context.lineWidth=r._stroke_width},setStrokeWidth:function(n){r._stroke_width=n;this._setStrokeWidth()},clearClip:function(){this._context.restore();this._resetContext()},setClip:function(n,t,i,r){!this._context.clip||(this.clearClip(),this._context.save(),this._context.beginPath(),this._context.moveTo(n,t),this._context.lineTo(n+i,t),this._context.lineTo(n+i,t+r),this._context.lineTo(n,t+r),this._context.closePath(),this._context.clip())},clear:function(n,i,r,u){n==t&&i==t&&r==t&&u==t?this._canvas.width=this._canvas.width:r==t&&u==t?this._context.clearRect(n,i,1,1):this._context.clearRect(n,i,r,u);this._resetContext()},put:function(n,t){this._context.fillRect(n,t,1,1)},fill:function(n,t,i,r){this._context.fillRect(n,t,i,r)},line:function(n,i,r,u,f){this._context.beginPath();f==t?(this._context.moveTo(n+.5,i+.5),this._context.lineTo(r+.5,u+.5)):(this._context.moveTo((n+.5)*f,(i+.5)*f),this._context.lineTo((r+.5)*f,(u+.5)*f));this._context.stroke();this._context.closePath()},rect:function(n,i,r,u,f){f==t?this._context.strokeRect(n+.5,i+.5,r,u):this._context.strokeRect((n+.5)*f,(i+.5)*f,r*f,u*f)},circle:function(n,t,i){this._context.beginPath();this._context.arc(n,t,i,0,Math.PI*2,!1);this._context.stroke()},drawString:function(n,t,i){!this._context.fillText||this._context.fillText(n,t,i)},drawImage:function(n,t,i){t==n.width&&i==n.height?this._context.drawImage(n,0,0):this._context.drawImage(n,0,0,n.width,n.height,0,0,t,i)},imageData:function(n,t){return this._context.getImageData(0,0,n,t)}};d.prototype={setFont:function(n,t,i){n.setFont(t,i);this._su.setFont(t,i)}};nt.prototype={_setEnv:function(){g(this);setProcEnv(this._procEnv);this._canvasEnv!=null&&h(this._canvasEnv)},proc:function(){return this._setEnv(),this._proc},param:function(){return this._setEnv(),this._param},canvas:function(){return this._setEnv(),this._canvas},gWorld:function(){return this._setEnv(),procGWorld()},setValue:function(n,t){return this._setEnv(),this._param.setVal(_CHAR(n),t,!1),this},setComplex:function(n,t,i){this._setEnv();var r=_CHAR(n);return this._param.setReal(r,t,!1),this._param.setImag(r,i,!1),this},setFract:function(n,t,i){this._setEnv();var r=_CHAR(n),u=t<0&&i>=0||t>=0&&i<0;return this._param.fractSetMinus(r,u,!1),this._param.setNum(r,_ABS(t),!1),this._param.setDenom(r,_ABS(i),!1),this._param.fractReduce(r,!1),this},setVector:function(n,t){return this._setEnv(),this._param._array.setVector(_CHAR(n),t,t.length),this},setComplexVector:function(n,t,i){return this._setEnv(),this._param._array.setComplexVector(_CHAR(n),t,i,t.length<i.length?t.length:i.length),this},setFractVector:function(n,t,i){return this._setEnv(),this._param._array.setFractVector(_CHAR(n),t,i,t.length<i.length?t.length:i.length),this},setMatrix:function(n,t){return this._setEnv(),t instanceof _Matrix||(t=arrayToMatrix(t)),this._param._array.setMatrix(_CHAR(n),t,!1),this},setComplexMatrix:function(n,t,i){return this._setEnv(),this._param._array.setComplexMatrix(_CHAR(n),arrayToMatrix(t),arrayToMatrix(i),!1),this},setFractMatrix:function(n,t,i){return this._setEnv(),this._param._array.setFractMatrix(_CHAR(n),arrayToMatrix(t),arrayToMatrix(i),!1),this},setArrayValue:function(n,t,i){this._setEnv();for(var r=0;r<t.length;r++)t[r]-=this._param._base;return t[t.length]=-1,this._param._array.set(_CHAR(n),t,t.length-1,i,!1),this},setArrayComplex:function(n,t,i,r){this._setEnv();var u=new _Value;return u.setReal(i),u.setImag(r),this.setArrayValue(n,t,u),this},setArrayFract:function(n,t,i,r){this._setEnv();var u=new _Value,f=i<0&&r>=0||i>=0&&r<0;return u.fractSetMinus(f),u.setNum(_ABS(i)),u.setDenom(_ABS(r)),u.fractReduce(),this._param.fractReduce(_CHAR(n),!1),this.setArrayValue(n,t,u),this},setString:function(n,t){return this._setEnv(),this._proc.strSet(this._param._array,_CHAR(n),t),this},getAnsValue:function(){return this._setEnv(),this._param.val(0)},getAnsMatrix:function(){return this._setEnv(),this._param._array._mat[0]},getAnsMatrixString:function(n){return this._setEnv(),this.getArrayTokenString(this._param,this._param._array.makeToken(new _Token,0),n)},getValue:function(n){return this._setEnv(),this._param.val(_CHAR(n))},getComplexString:function(n){var i=new String,t=this.getValue(n);return _ISZERO(t.imag())?""+t.real():_ISZERO(t.real())?""+t.imag()+l:t.imag()>0?""+t.real()+ht+t.imag()+l:""+t.real()+t.imag()+l},getFractString:function(n,t){var r=new String,i=this.getValue(n);return t&&i.denom()!=0&&_DIV(i.num(),i.denom())!=0?_MOD(i.num(),i.denom())!=0?(r=i.fractMinus()?s:"",r+=""+_DIV(i.num(),i.denom()),r+="」"+_MOD(i.num(),i.denom()),r+="」"+i.denom()):r=(i.fractMinus()?s:"")+(""+_DIV(i.num(),i.denom())):r=i.denom()==0?""+i.toFloat():i.denom()==1?(i.fractMinus()?s:"")+(""+i.num()):(i.fractMinus()?s:"")+(""+i.num()+"」"+i.denom()),r},getArray:function(n,i){this._setEnv();var u=[],f=-1,r=[],o,e,s=this._param._array.makeToken(new _Token,_CHAR(n));for(s.beginGetToken();s.getToken();)if(o=getCode(),e=getToken(),o==_CLIP_CODE_ARRAY_TOP)r[++f]=0;else if(o==_CLIP_CODE_ARRAY_END)r[--f]++;else if(o==_CLIP_CODE_CONSTANT){if(i==t||i==f+1){f>0&&(u[r[0]]instanceof Array||(u[r[0]]=[]));f>1&&(u[r[0]][r[1]]instanceof Array||(u[r[0]][r[1]]=[]));f>2&&(u[r[0]][r[1]][r[2]]instanceof Array||(u[r[0]][r[1]][r[2]]=[]));switch(f){case 0:u[r[0]]instanceof Array||(u[r[0]]=e.toFloat());break;case 1:u[r[0]][r[1]]instanceof Array||(u[r[0]][r[1]]=e.toFloat());break;case 2:u[r[0]][r[1]][r[2]]instanceof Array||(u[r[0]][r[1]][r[2]]=e.toFloat());break;case 3:u[r[0]][r[1]][r[2]][r[3]]instanceof Array||(u[r[0]][r[1]][r[2]][r[3]]=e.toFloat())}}r[f]++}return u},getArrayTokenString:function(n,t,i){this._setEnv();var s=new _Token,f,r,o,u=new String,e=!1;for(t.beginGetToken();t.getToken();){if(r=getCode(),o=getToken(),e){if(r==_CLIP_CODE_ARRAY_TOP)for(u+=arrayTokenStringBreak,f=0;f<i;f++)u+=arrayTokenStringSpace;e=!1}u+=s.tokenString(n,r,o);u+=arrayTokenStringSpace;r==_CLIP_CODE_ARRAY_TOP&&(i+=2);r==_CLIP_CODE_ARRAY_END&&(i-=2,e=!0)}return u},getArrayString:function(n,t){return this._setEnv(),this.getArrayTokenString(this._param,this._param._array.makeToken(new _Token,_CHAR(n)),t)},getString:function(n){return this._setEnv(),this._proc.strGet(this._param._array,_CHAR(n))},setMode:function(n){return this._setEnv(),this._param.setMode(n),this},setPrec:function(n){return this._setEnv(),this._param.setPrec(n),this},setFps:function(n){return this._setEnv(),this._param.setFps(n),this},setRadix:function(n){return this._setEnv(),this._param.setRadix(n),this},setAngType:function(n){return this._setEnv(),this._proc.setAngType(n,!1),this},setCalculator:function(n){return this._setEnv(),this._param._calculator=n,this},setBase:function(n){return this._setEnv(),this._param._base=n!=0?1:0,this},setAnsFlag:function(n){return this._setEnv(),this._proc._printAns=n,this},setAssertFlag:function(n){return this._setEnv(),this._proc.setAssertFlag(n),this},setWarnFlag:function(n){return this._setEnv(),this._proc.setWarnFlag(n),this},commandGWorld:function(n,t){return this._setEnv(),doCommandGWorld(n,t),procGWorld().create(n,t,!0),this},commandWindow:function(n,t,i,r){return this._setEnv(),doCommandWindow(n,t,i,r),procGWorld().setWindowIndirect(n,t,i,r),this},commandGClear:function(n){return this._setEnv(),procGWorld().clear(n),this},commandGColor:function(n){return this._setEnv(),procGWorld().setColor(n),this},commandGPut:function(n){this._setEnv();for(var r=procGWorld(),i,t=0;t<r._height;t++)for(i=0;i<r._width;i++)r.putColor(i,t,t<n.length?i<n[t].length?n[t][i]:0:0);return this},commandGPut24:function(n){this._setEnv();var r=procGWorld(),i,t;for(doCommandGPut24Begin(),t=0;t<r._height;t++)for(i=0;i<r._width;i++)doCommandGPut24(i,t,t<n.length?i<n[t].length?n[t][i]:0:0);return doCommandGPut24End(),this},commandGGet:function(){var t,n,i;this._setEnv();var r=procGWorld(),u=r._width,f=r._height;if(u>0&&f>0){for(i=new Array(f),n=0;n<f;n++)for(i[n]=new Array(u),t=0;t<u;t++)i[n][t]=r.get(t,n);return i}return null},commandGGet24:function(){var r,u,f,n,h,c,l,t,e;this._setEnv();var o=new _Integer,s=new _Integer,i=doCommandGGet24Begin(o,s);if(i!=null&&(r=o._val,u=s._val,r>0&&u>0)){for(t=0,e=new Array(u),n=0;n<u;n++)for(e[n]=new Array(r),f=0;f<r;f++)h=i[t++],c=i[t++],l=i[t++],t++,e[n][f]=(h<<16)+(c<<8)+l;return doCommandGGet24End(),e}return null},procLine:function(n){return this._setEnv(),initProcLoopCount(),this._proc.processLoop(n,this._param)},procScript:function(t){var i,r;return this._setEnv(),i=n.getExtFuncDataDirect,n.getExtFuncDataDirect=function(){return t},initProcLoopCount(),r=this._proc.mainLoop("",this._param,null,null),n.getExtFuncDataDirect=i,r},newPalette:function(){return this._palette==null&&(this._palette=new Array(256)),this},setPalette:function(n){this.newPalette();for(var t=0;t<256;t++)this._palette[t]=n[t];return this},setPaletteColor:function(n,t){return this._palette[n]=t,this},paletteColor:function(n){return this._palette[n]},_useCanvas:function(){this._canvasEnv==null&&(this._canvasEnv=new k);h(this._canvasEnv)},setCanvas:function(n){return this._useCanvas(),this._canvas=new c(n),this._canvas},createCanvas:function(n,t){return this._useCanvas(),this._canvas=new c,this._canvas.setSize(n,t),this._canvas},resizeCanvas:function(n,t){return h(this._canvasEnv),this._canvas.setSize(n,t),this._canvas},updateCanvas:function(n){this._setEnv();n==t&&(n=1);this._canvas.setColorRGB(gWorldBgColor());this._canvas.fill(0,0,this._canvas.width(),this._canvas.height());for(var u=procGWorld(),o=u._image,s=u._offset,h=u._width,c=u._height,i,f,e,r=0;r<c;r++)for(f=r*s,e=r*n,i=0;i<h;i++)this._canvas.setColorBGR(this._palette[o[f+i]]),this._canvas.fill(i*n,e,n,n);return this._canvas},createImage:function(r,u,e,o){var l=n.doCommandGWorld,h,s,c;return n.doCommandGWorld=function(n,t){i().createCanvas(n,t)},h=this.procScript(r),n.doCommandGWorld=l,h==_CLIP_PROC_END&&(s=this.updateCanvas(),c=f.getElementById(u),c.src=e==t?s.element().toDataURL():o==t?s.element().toDataURL(e):s.element().toDataURL(e,o)),h}};v.prototype={setFont:function(n,t){this._fontSize=n;this._fontFamily=t.indexOf(o)>=0?u+t+u:t;this._text.style.cssText=this._textStyle+at+this._fontSize+p+this._fontFamily},stringWidth:function(n){this._text.innerHTML=u;var t=this._text.offsetWidth;return n=n.replace(new RegExp("<",w),"&lt;"),n=n.replace(new RegExp(">",w),"&gt;"),this._text.innerHTML=u+n+u,this._text.offsetWidth-t*2},fontHeight:function(){return this._fontSize},trim:function(n){for(var u="",r=0,i,t=0;t<n.length;t++){if(n.charAt(t)!=o&&n.charAt(t)!=b)break;r++}if(r<n.length){for(i=n.length-1,t=i;t>=0;t--){if(n.charAt(t)!=o&&n.charAt(t)!=b)break;i--}u=n.substring(r,i+1)}return u},truncate:function(n,t,i){var r,u;if(this.stringWidth(n)<=t)return n;for(t-=this.stringWidth(i),r="",u=0;u<n.length;u++)if(r+=n.charAt(u),this.stringWidth(r)>t&&r.length>1){r=r.substring(0,r.length-1);break}return r+i},setHeadWrap:function(n){this._h=n},setEndWrap:function(n){this._e=n},wrap:function(n,t){var i=[],f,r=0,u;for(i[r]="",u=0;u<n.length;u++)if(i[r]+=n.charAt(u),this.stringWidth(i[r])>t){if(i[r].length>1){if(i[r]=i[r].substring(0,i[r].length-1),u--,this._h.length>0)for(;;)if(u+1<n.length)if(f=n.charAt(u+1),this._h.indexOf(f)>=0)i[r]+=f,u++;else break;else break;if(this._e.length>0)for(;;)if(i[r].length>1)if(f=i[r].charAt(i[r].length-1),this._e.indexOf(f)>=0)i[r]=i[r].substring(0,i[r].length-1),u--;else break;else break}r++;i[r]=""}return i}};n._CanvasEnv=k;n.setCanvasEnv=h;n._Canvas=c;n._EasyCanvas=d;n.setClip=g;n.curClip=i;n.curCanvas=vt;n._EasyClip=nt;n._StringUtil=v})(window)