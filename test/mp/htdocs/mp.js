/*
 * CLIP
 * Copyright (C) SatisKia. All rights reserved.
 */
(function(n,t){function sr(n){rt=n}function hr(){return rt=dt(rt*1103515245+12345,4294967296),e(rt/((ct+1)*2),ct+1)}function f(n){return n<0?lt(n):d(n)}function u(n,t){return n<0?lt(n/t):d(n/t)}function e(n,t){return n<0?(n=-f(n),-(n-d(n/t)*t)):(n=f(n),n-d(n/t)*t)}function cr(n,t){return n*v(2,t)}function lr(n,t){return u(n,v(2,t))}function g(n,t){return(u(n,65536)&u(t,65536))*65536+(n&65535&t&65535)}function ar(n,t){return(u(n,65536)|u(t,65536))*65536+(n&65535|t&65535)}function vr(n,t){return(u(n,65536)^u(t,65536))*65536+(n&65535^t&65535)}function yr(n,t,i,r){return(n=e(n,t),n>r)?n-t:n<i?n+t:n}function dt(n,t){return(n=e(n,t),n<0)?n+t:n}function pr(n,t){var r=n.toString(),i,u,e;return r.indexOf(nt)>=0||r.indexOf(tt)>=0?i=1:(u=r.split(st),i=u[1]?v(10,u[1].length):1),e=f(n),t.set(e),(n*i-e*i)/i}function wr(n){var r=!1,t,i;for(n<0&&(r=!0,n=0-n),t=1,i=2;i<=n;i++)t*=i;return r?-t:t}function s(n){return n.charCodeAt(0)}function at(n){return Number.isFinite(n)?!1:!0}function y(n){return Number.isNaN(n)}function gt(n){return y(n)||n!=0?!1:!0}function vt(n,t){return t==0?h(n)<ht*4:h((t-n)/t)<ht*4}function nu(n,t){var r,i;if(n._row!=t._row||n._col!=t._col)return!1;for(r=n._len,i=0;i<r;i++)if(!vt(n.mat(i).toFloat(),t.mat(i).toFloat())||!vt(n.mat(i).imag(),t.mat(i).imag()))return!1;return!0}function tu(n){var t,i,r,u;if(at(n)||y(n)||gt(n))return 0;for(i=0,t=0;;t++){if(r=n*v(10,t),u=f(r),r-u==0)break;u==0&&i++}return i==0?t+f(kt(h(n))*bt):t-i}function iu(n){var t,i,r;if(at(n)||y(n))return 0;for(t=0;;t++)if(i=n*v(10,t),r=f(i),i-r==0)break;return t}function ni(n,t){if(y(n))return n;if(y(t))return t;n=f(n);t=f(t);for(var i;t!=0;)i=e(n,t),n=t,t=i;return n}function ru(n,t){if(y(n))return n;if(y(t))return t;n=f(n);t=f(t);var i=ni(n,t);return i==0?0:n*t/i}function uu(n,t,i){for(var u=0,r=t,f=!1;r<n.length;){switch(u){case 0:(n.charAt(r)=="+"||n.charAt(r)=="-")&&r++;u++;break;case 1:case 3:case 5:n.charCodeAt(r)>=c&&n.charCodeAt(r)<=ut?r++:u++;break;case 2:n.charAt(r)=="."?(r++,u=3):u=4;break;case 4:if(n.charAt(r)=="e"||n.charAt(r)=="E"){if(n.charCodeAt(r+1)>=c&&n.charCodeAt(r+1)<=ut){r++;u=5;break}if(n.charAt(r+1)=="+"||n.charAt(r+1)=="-"){r+=2;u=5;break}}case 6:f=!0}if(f)break}return i.set(r),parseFloat(n.substring(t,r))}function fu(n,t,i,r){var e=0,u=t,o=!1,f,s;for(n.charAt(u)=="+"?u++:n.charAt(u)=="-"&&(o=!0,u++),s=r>10?10:r;u<n.length;)if(f=n.charCodeAt(u),e*=r,f>=c&&f<c+s)e+=f-c,u++;else if(f>=ft&&f<ft+(r-10))e+=10+(f-ft),u++;else if(f>=et&&f<et+(r-10))e+=10+(f-et),u++;else break;return i.set(u),o?-e:e}function yt(n){var t=n,f="",r=n.indexOf(nt),u,i;if(r<0&&(r=n.indexOf(tt)),r>=0&&(t=n.substring(0,r),f=n.slice(r)),u=t.indexOf(st),u>=0){for(i=t.length;i>u;){if(t.charAt(i-1)!="0"&&t.charAt(i-1)!=".")break;i--}t=t.substr(0,i)}return t+f}function eu(n,i){var r;return i==t?r=n.toExponential():(i<0&&(i=0),i>20&&(i=20),r=n.toExponential(i)),yt(r)}function ou(n,i){var r;return i==t?(r=n.toFixed(),(r.indexOf(nt)>=0||r.indexOf(tt)>=0)&&(r=n.toExponential())):(i<0&&(i=0),i>20&&(i=20),r=n.toFixed(i),(r.indexOf(nt)>=0||r.indexOf(tt)>=0)&&(r=n.toExponential(i))),yt(r)}function ti(n,i){var r;return i==t?r=n.toPrecision():(i<1&&(i=1),i>21&&(i=21),r=n.toPrecision(i)),yt(r)}function su(n,t){var i=ti(n,t);return i.indexOf(st)<0&&(i+=si),i}function hu(n,i,r){var c,s,f,h,o;if(y(n))return n.toString();for((r==t||r<=0)&&(r=1),c=hi,s=n<0,s&&(n=-n),f="";n!=0;)f+=c.charAt(e(n,i)),n=u(n,i);for(o=f.length;o<r;o++)f+=w;for(s&&(f+=ci),h="",o=f.length-1;o>=0;o--)h+=f.charAt(o);return h}function ot(n){this._val=n==t?0:f(n)}function cu(n){for(var i=new Array(n),t=0;t<n;t++)i[t]=new ot;return i}function i(){this._CONST=[];this._FCONST=[];this.fabs=this.abs;this.fneg=this.neg;this.fset=this.set}var nt="e",tt="E",st=".",wt="number",si=".0",hi="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",w="0",ci="-",p="_",a="1",li="0.5",ai="2",vi="3",yi="8",pi="5",wi="16",bi="35",ki="128",di="63",gi="256",ht=22204460492503131e-32,bt=.43429448190325182,ct=32767,h=Math.abs,nr=Math.acos,tr=Math.asin,ir=Math.atan,rr=Math.atan2,lt=Math.ceil,ur=Math.cos,fr=Math.exp,d=Math.floor,kt=Math.log,v=Math.pow,er=Math.sin,it=Math.sqrt,or=Math.tan,rt=1,c=s("0"),ut=s("9"),ft=s("a"),br=s("z"),et=s("A"),kr=s("Z"),dr=s("!"),gr=s(":");Number.isFinite=Number.isFinite||function(n){return typeof n===wt&&isFinite(n)};Number.isNaN=Number.isNaN||function(n){return typeof n===wt&&isNaN(n)};ot.prototype={set:function(n){return this._val=f(n),this},add:function(n){return this._val+=f(n),this},val:function(){return this._val}};var r=4,o=v(10,r),b=4294967295,l=b+1,ii=0,ri=1,ui=2,fi=3,ei=4,oi=5,pt=6;i.prototype.CONST=function(n){return this._CONST[p+n]==t&&(this._CONST[p+n]=[],this.str2num(this._CONST[p+n],n)),this._CONST[p+n]};i.prototype.FCONST=function(n){return this._FCONST[p+n]==t&&(this._FCONST[p+n]=[],this.fstr2num(this._FCONST[p+n],n)),this._FCONST[p+n]};i.prototype._getLen=function(n){return f(h(n[0]/l))};i.prototype._setLen=function(n,t){var i=g(h(n[0]),b);t==0?(n[0]=l+i,n[1]=0):n[0]=(h(t)*l+i)*(t<0?-1:1)};i.prototype._getPrec=function(n){return g(h(n[0]),b)};i.prototype._setPrec=function(n,t){var i=f(h(n[0]/l));i==0?(n[0]=l+t,n[1]=0):n[0]=(i*l+t)*(n[0]<0?-1:1)};i.prototype._fmul=function(n,t){var i=f(t/r),u,e;return i>0&&(u=f(h(n[0]/l)),this._copy(n,1,n,i+1,u),this._fill(0,n,1,i),e=g(h(n[0]),b),n[0]=((u+i)*l+e)*(n[0]<0?-1:1)),t-i*r};i.prototype._fdiv=function(n,t){var i=f(h(n[0]/l)),r;this._copy(n,t+1,n,1,i-t);i-=t;r=g(h(n[0]),b);i==0?(n[0]=l+r,n[1]=0):n[0]=(i*l+r)*(n[0]<0?-1:1)};i.prototype._fcoef=function(n,t){var i=u(t,r)+1;n[i]=v(10,e(t,r));this._fill(0,n,1,i-1);n[0]=i*l};i.prototype._matchPrec=function(n,t){var i=this._getPrec(n),r=this._getPrec(t),e=i,f,u;return i<r?((f=this._fmul(n,r-i))>0&&(u=[],this._fcoef(u,f),this.mul(n,n,u)),this._setPrec(n,r),e=r):r<i&&((f=this._fmul(t,i-r))>0&&(u=[],this._fcoef(u,f),this.mul(t,t,u)),this._setPrec(t,i)),e};i.prototype._clone=function(n){for(var i=[],t=0;t<n.length;t++)i[t]=n[t];return i};i.prototype._copy=function(n,t,i,r,u){n=this._clone(n);for(var f=0;f<u;f++)i[r+f]=n[t+f]};i.prototype._fill=function(n,t,i,r){for(var u=0;u<r;u++)t[i+u]=n};i.prototype._strlen=function(n){for(var t=0;;t++)if(n[t]==0)break;return t};i.prototype._j2cstr=function(n){for(var i=[],t=0;t<n.length;t++)i[t]=n.charCodeAt(t);return i[t]=0,i};i.prototype._c2jstr=function(n){for(var i=new String,t=0;;t++){if(n[t]==0)break;i+=String.fromCharCode(n[t])}return i};i.prototype.abs=function(n,i){if(i==t){n[0]=h(n[0]);return}this._copy(i,1,n,1,this._getLen(i));n[0]=h(i[0])};i.prototype.add=function(n,t,i){var u;if(t=this._clone(t),i=this._clone(i),t[0]<0&&i[0]>=0){t[0]=-t[0];this.sub(n,i,t);return}if(t[0]>=0&&i[0]<0){i[0]=-i[0];this.sub(n,t,i);return}var c=t[0]<0&&i[0]<0?-1:1,e=this._getLen(t),s=this._getLen(i),f=e>=s?e:s;n[f+1]=0;var h=0,l=0,a=0,r=0;for(u=1;u<=f;u++)u<=e&&(r+=t[++l]),u<=s&&(r+=i[++a]),r<o?(n[++h]=r,r=0):(n[++h]=r-o,r=1);r!=0&&(n[++h]=r,f++);this._setLen(n,f*c)};i.prototype.cmp=function(n,t){var i;if(n[0]<0&&t[0]>=0)return-1;if(t[0]<0&&n[0]>=0)return 1;var o=n[0]<0&&t[0]<0?-1:1,r=this._getLen(n),u=this._getLen(t),f,e;for(i=r>u?r:u;i>0;i--)if(f=i<=r?n[i]:0,e=i<=u?t[i]:0,f!=e)return(f-e)*o;return 0};i.prototype._mul1=function(n,t,i){n[t[0]+1]=0;var r,c,s,f,h;for(r=0,c=0,s=0,f=0;f<t[0];f++)h=t[++c]*i+r,n[++s]=e(h,o),r=u(h,o);n[++s]=r;n[0]=f;r>0&&n[0]++};i.prototype._div1=function(n,t,i){n[0]=t[0];var r,h,c,f,s;for(r=0,h=t[0],c=n[0],f=t[0];f>0;f--)s=o*r+t[h--],n[c--]=u(s,i),r=e(s,i);return n[n[0]]==0&&n[0]--,r};i.prototype._sub1=function(n,t,i,r){var u,f;for(u=0,f=r,r=0;r<f;)n[++i]-=t[++r]+u,u=0,n[i]<0&&(n[i]+=o,u=1);while(n[i]==0)i--;n[0]=i};i.prototype.div=function(n,i,r,f){var y,w,b,l,p,a,d,k,h,v,s,c,e;if(i=this._clone(i),r=this._clone(r),f==t&&(f=[]),y=1,i[0]<0&&r[0]>=0&&(y=-1),r[0]<0&&i[0]>=0&&(y=-1),w=i[0]<0?-1:1,i[0]=this._getLen(i),r[0]=this._getLen(r),n[0]=0,f[0]=0,r[0]==0||r[0]==1&&r[1]==0)return!0;if(i[0]==0||i[0]==1&&i[1]==0)return!1;if(i[0]<r[0])return this._copy(i,0,f,0,i[0]+1),l=f[0],f[0]=0,this._setLen(f,l*w),!1;if(r[0]==1)return e=0,d=this._div1(n,i,r[1]),d>0?(f[e++]=1,f[e]=d):f[e]=0,b=n[0],n[0]=0,this._setLen(n,b*y),l=f[0],f[0]=0,this._setLen(f,l*w),!1;for((p=u(o,r[r[0]]+1))>1&&(this._mul1(i,this._clone(i),p),this._mul1(r,this._clone(r),p)),n[0]=i[0]-r[0]+1,k=n[0];k>0;k--)n[k]=0;for(h=r[0];(v=i[0])>=h;){if(i[i[0]]>=r[r[0]]){for(s=i[0],c=r[0];c>0;s--,c--)if(i[s]!=r[c])break;if(c==0){i[0]-=r[0];n[v-h+1]++;continue}else if(i[s]>r[c]){this._sub1(i,r,v-h,c);n[v-h+1]++;continue}a=o-1}else a=u(o*i[i[0]]+i[i[0]-1],r[r[0]]);if(v==h)break;for(;;){if(a==1){r[r[0]+1]=0;this._sub1(i,r,i[0]-r[0]-1,r[0]);break}for(this._mul1(f,r,a),s=i[0],e=f[0];e>0;s--,e--)if(i[s]!=f[e])break;if(e==0){i[0]-=f[0];break}else if(i[s]>f[e]){this._sub1(i,f,i[0]-f[0],e);break}else a--}n[v-h]=a}return n[n[0]]==0&&n[0]--,p>1?this._div1(f,i,p):this._copy(i,0,f,0,i[0]+1),b=n[0],n[0]=0,this._setLen(n,b*y),l=f[0],f[0]=0,this._setLen(f,l*w),!1};i.prototype.fadd=function(n,t,i){t=this._clone(t);i=this._clone(i);var r=this._matchPrec(t,i);this.add(n,t,i);this._setPrec(n,r)};i.prototype.fcmp=function(n,t){return n=this._clone(n),t=this._clone(t),this._matchPrec(n,t),this.cmp(n,t)};i.prototype.fdigit=function(n){var i=this._getLen(n),u,t,f;if(i==0)return 0;for(u=10,t=1;t<=r;t++){if(n[i]<u)break;u*=10}return f=(i-1)*r+t,f-this._getPrec(n)};i.prototype.fdiv=function(n,t,i,u){var o,e,l,s;t=this._clone(t);i=this._clone(i);for(var h=this._matchPrec(t,i),s=i[0]<0?-1:1,c=this._getLen(i),f=c;f>0;f--)if(i[f]!=0)break;return f==0?!0:(f!=c&&(h-=(c-f)*r,this._setPrec(t,h),this._setPrec(i,h),this._setLen(i,f*s)),o=[],e=[],this.div(o,t,i,e),l=this._fmul(o,u),this._fmul(e,u),l>0&&(s=[],this._fcoef(s,l),this.mul(o,o,s),this.mul(e,e,s)),this.div(e,e,i),this.add(n,o,e),this._setPrec(n,u),!1)};i.prototype.fdiv2=function(n,i,u,e,o){var p,v,a,c,b,l,w;i=this._clone(i);u=this._clone(u);o==t&&(o=new ot);for(var k=this._getPrec(i),y=this._getLen(i),l=10,s=1;s<=r;s++){if(i[y]<l)break;l*=10}o.set((y-1)*r+s-k);e<o.val()&&(e=o.val());p=[];v=[];this._setLen(v,1);v[1]=1;for(var h=this._matchPrec(v,u),l=u[0]<0?-1:1,y=this._getLen(u),s=y;s>0;s--)if(u[s]!=0)break;return s==0?!0:(s!=y&&(h-=(y-s)*r,this._setPrec(v,h),this._setPrec(u,h),this._setLen(u,s*l)),a=[],c=[],this.div(a,v,u,c),h=e*2+1,b=this._fmul(a,h),this._fmul(c,h),b>0&&(l=[],this._fcoef(l,b),this.mul(a,a,l),this.mul(c,c,l)),this.div(c,c,u),this._getLen(i)==1&&i[1]==1)?(this.add(n,a,c),i[0]<0&&(n[0]=-n[0]),this._setPrec(n,h),!1):(this.add(p,a,c),this._setPrec(p,h),this.mul(n,i,p),h+=k,w=f((h-(e+r))/r),w>0&&(h-=w*r,this._fdiv(n,w)),this._setPrec(n,h),!1)};i.prototype.fmul=function(n,t,i,u){t=this._clone(t);i=this._clone(i);this.mul(n,t,i);var e=this._getPrec(t)+this._getPrec(i),o=f((e-(u+r))/r);o>0&&(e-=o*r,this._fdiv(n,o));this._setPrec(n,e)};i.prototype._fnum2str=function(n,t){var u,e,r,i,f,o;for(t=this._clone(t),u=this._getPrec(t),e=[],this._num2str(e,t),r=this._strlen(e),i=r-1;i>0;i--)if(e[i]!=c)break;if(u-=r-(i+1),u<0&&(i-=u,u=0),r=i+1,f=0,o=0,e[0]==s("-")&&(n[f++]=e[o++],r--),r<=u&&(n[f++]=c),r<u)for(n[f++]=s("."),i=0;i<u-r;i++)n[f++]=c;for(i=0;i<r;i++)i==r-u&&(n[f++]=s(".")),n[f++]=e[o++];n[f]=0};i.prototype.fnum2str=function(n,i){if(i==t){var r=[];return this._fnum2str(r,n),this._c2jstr(r)}return this._fnum2str(n,i),n};i.prototype._froundGet=function(n,t){var f=this._getLen(n),i=1+u(t,r);return i>f?0:e(u(n[i],pow(10,e(t,r))),10)};i.prototype._froundSet=function(n,t,i){var c=1+u(t,r),o=n[c],s=0,h=1,f;for(t=e(t,r),f=0;f<r;f++)f==t?s+=i*h:f>t&&(s+=e(o,10)*h),o=u(o,10),h*=10;n[c]=s};i.prototype._froundZero=function(n,t){this._fill(0,n,1,u(t,r))};i.prototype._froundUp=function(n,t){for(var i=this._getLen(n),f;;){if(f=this._froundGet(n,t)+1,this._froundSet(n,t,e(f,10)),f<10)break;t++;1+u(t,r)>i&&(i++,this._setLen(n,i*(n[0]<0?-1:1)),n[i]=0)}};i.prototype.fround=function(n,i,r){var o=this._getPrec(n)-i,f,u;if(!(o<1)){f=this._froundGet(n,o-1);u=!1;r==t&&(r=pt);switch(r){case ii:f>0&&(u=!0);break;case ui:n[0]>0&&f>0&&(u=!0);break;case fi:n[0]<0&&f>0&&(u=!0);break;case ei:f>4&&(u=!0);break;case oi:f>5&&(u=!0);break;case pt:e(this._froundGet(n,o),2)==1?f>4&&(u=!0):f>5&&(u=!0)}u?(this._froundZero(n,o),this._froundUp(n,o)):(this._froundZero(n,o-1),this._froundSet(n,o-1,0))}};i.prototype.fround2=function(n,t,i){var f=this._getPrec(n)-t,h,o,s;if(!(f<1)){if(h=this._froundGet(n,f-1),o=!1,i&&e(this._froundGet(n,f),2)==1&&h>4)o=!0;else if(h>5)o=!0;else if(h==5&&f>1)if(s=1+u(f-1,r),e(n[s],v(10,e(f-1,r)))!=0)o=!0;else for(s--;s>0;s--)if(n[s]!=0){o=!0;break}o?(this._froundZero(n,f),this._froundUp(n,f)):(this._froundZero(n,f-1),this._froundSet(n,f-1,0))}};i.prototype.fsqrt=function(n,t,i){if(t=this._clone(t),this.fcmp(t,this.FCONST(w))>0){var f=[],r=[],u=[];this.fcmp(t,this.FCONST(a))>0?this.set(r,t):this.set(r,this.FCONST(a));do this.set(f,r),this.fdiv2(u,t,r,i),this.fadd(u,u,r),this.fmul(u,u,this.FCONST(li),i),this.set(r,u);while(this.fcmp(r,f)<0);return this.set(n,f),!1}return this.set(n,this.FCONST(w)),this.fcmp(t,this.FCONST(w))!=0};i.prototype.fsqrt2=function(n,t,i,r){if(t=this._clone(t),this.fcmp(t,this.FCONST(w))>0){var o=[],e=[],s=[],h=[],c=[],l=[],v=[],y=[],p=[],u=[],f=[];this.fcmp(t,this.FCONST(a))>0?(this.fdiv(u,this.FCONST(a),t,i),this.set(f,u)):this.set(f,this.FCONST(a));this.fmul(u,f,f,i);this.fmul(u,t,u,i);this.fsub(e,this.FCONST(a),u);this.set(o,this.FCONST(a));this.fdiv(s,this.FCONST(a),this.FCONST(ai),i);r>=3&&this.fdiv(h,this.FCONST(vi),this.FCONST(yi),i);r>=4&&this.fdiv(c,this.FCONST(pi),this.FCONST(wi),i);r>=5&&this.fdiv(l,this.FCONST(bi),this.FCONST(ki),i);r==6&&this.fdiv(v,this.FCONST(di),this.FCONST(gi),i);do{switch(r){case 6:this.set(u,v);break;case 5:this.set(u,l);break;case 4:this.set(u,c);break;case 3:this.set(u,h);break;default:this.set(u,s)}switch(r){case 6:this.fmul(u,e,u,i);this.fadd(u,l,u);case 5:this.fmul(u,e,u,i);this.fadd(u,c,u);case 4:this.fmul(u,e,u,i);this.fadd(u,h,u);case 3:this.fmul(u,e,u,i);this.fadd(u,s,u)}this.fmul(u,e,u,i);this.fmul(u,f,u,i);this.fadd(f,f,u);this.set(o,e);this.fmul(u,f,f,i);this.fmul(u,t,u,i);this.fsub(e,this.FCONST(a),u);this.abs(y,e);this.abs(p,o)}while(this.fcmp(y,p)<0);return this.fmul(n,t,f,i),!1}return this.set(n,this.FCONST(w)),this.fcmp(t,this.FCONST(w))!=0};i.prototype.fsqrt3=function(n,t,i){var o,f,s,e,c;return t=this._clone(t),o=i*2-this._getPrec(t),o>0?(f=this._fmul(t,o))>0&&(e=[],this._fcoef(e,f),this.mul(t,t,e)):o<0&&(f=h(o),(s=u(f,r))>0&&(f-=s*r,this._fdiv(t,s)),e=[],this._fcoef(e,f),this.div(t,t,e)),t[this._getLen(t)]==0&&this._setLen(t,this._getLen(t)-1),c=this.sqrt(n,t),this._setPrec(n,i),c};i.prototype.fstr2num=function(n,t){var r,h;t=t instanceof Array?this._clone(t):this._j2cstr(t);for(var f=this._strlen(t),l=0,u=0,e=!1,o=[],i=0;i<f;i++)if(t[i]==s("e")||t[i]==s("E")){u!=0&&(u-=f-i);i++;t[i]==s("-")?(e=!0,i++):(e=!1,t[i]==s("+")&&i++);break}else t[i]==s(".")?u=f-(i+1):o[l++]=t[i];for(o[l]=0,this.str2num(n,o),r=0;i<f;i++)r=r*10+(t[i]-c);e?(u+=r,r=0):u>=r?(u-=r,r=0):(r-=u,u=0);this._setPrec(n,u);r>0&&(h=[],this._fcoef(h,r),this.fmul(n,n,h,u))};i.prototype.fsub=function(n,t,i){t=this._clone(t);i=this._clone(i);var r=this._matchPrec(t,i);this.sub(n,t,i);this._setPrec(n,r)};i.prototype.ftrunc=function(n,t){var i,u,e;t=this._clone(t);i=this._getPrec(t);u=f(i/r);u>0&&(i-=u*r,this._fdiv(t,u));e=[];this._fcoef(e,i);this.div(n,t,e)};i.prototype._mul1n=function(n,t,i,r){n[r+1]=0;var f,l,s,h,c;for(f=0,l=0,s=0,h=0;h<r;h++)c=t[++l]*i+f,n[++s]=e(c,o),f=u(c,o);return n[++s]=f,f};i.prototype.mul=function(n,t,i){var l,r,f,s,y,a,h,c,v;if(t=this._clone(t),i=this._clone(i),l=1,t[0]<0&&i[0]>=0&&(l=-1),i[0]<0&&t[0]>=0&&(l=-1),r=this._getLen(t),f=this._getLen(i),r==0||f==0){n[0]=0;return}if(r==1)s=this._mul1n(n,i,t[1],f);else if(f==1)s=this._mul1n(n,t,i[1],r);else for(this._fill(0,n,1,r+f),a=0,c=1;c<=f;c++){for(s=0,a++,h=1,y=0;h<=r;h++)v=t[++y]*i[a]+n[h+c-1]+s,n[h+c-1]=e(v,o),s=u(v,o);n[h+c-1]=s}this._setLen(n,(s!=0?r+f:r+f-1)*l)};i.prototype.neg=function(n,i){if(i==t){n[0]=-n[0];return}this._copy(i,1,n,1,this._getLen(i));n[0]=-i[0]};i.prototype._num2str=function(n,t){var a,i,v,h,l,f,o;if(t=this._clone(t),a=t[0]<0,t[0]=this._getLen(t),t[0]==0){n[0]=c;n[1]=0;return}for(i=-1,v=0,h=t[0];h>0;h--)for(f=t[++v],l=0;l<r;l++)n[++i]=e(f,10)+c,f=u(f,10);while(n[i]==c)if(--i<0){i=0;break}for(a&&(n[++i]=s("-")),n[i+1]=0,o=0;o<i;)f=n[o],n[o++]=n[i],n[i--]=f};i.prototype.num2str=function(n,i){if(i==t){var r=[];return this._num2str(r,n),this._c2jstr(r)}return this._num2str(n,i),n};i.prototype.set=function(n,t){this._copy(t,0,n,0,this._getLen(t)+1)};i.prototype.sqrt=function(n,t){var h,i,r,a,v,c,s,l;if(t=this._clone(t),this._setLen(n,0),t[0]<0)return!0;if(h=this._getLen(t),h==0)return!1;if(h==1)return this._setLen(n,1),n[1]=f(it(t[1])),!1;if(h==2)return this._setLen(n,1),n[1]=f(it(t[2]*o+t[1])),!1;for(i=u(h+1,2),r=[],r[i+1]=0,this._fill(0,n,1,i),this._fill(0,r,1,i),this._setLen(n,i),this._setLen(r,i),a=(i-1)*2+1,v=t[a],e(h,2)==0&&(v+=t[a+1]*o),n[i]=f(it(v)),r[i]=n[i]+n[i],r[i]>=o&&(r[i]-=o,r[i+1]=1,this._setLen(r,i+1)),c=[],this.mul(c,n,n),this.sub(t,t,c),i--,s=[],l=[];;){for(this.div(s,t,r,l),i>1&&this._fill(0,s,1,i-1),this._getLen(s)>i&&(s[i]=o-1,this._setLen(s,i));;){if(this.add(l,r,s),this.mul(c,l,s),this.cmp(c,t)<=0)break;s[i]--}if(n[i]=s[i],i==1)break;this.add(r,l,s);this.sub(t,t,c);i--}return!1};i.prototype.str2num=function(n,t){var f,i,r,u;for(t=t instanceof Array?this._clone(t):this._j2cstr(t),f=t[0]==s("-")?1:0,i=f;t[i]>=c&&t[i]<=ut;)i++;if(i==0){n[0]=0;return}r=0;k=1;u=0;do r+=(t[--i]-c)*k,k*=10,k==o&&(n[++u]=r,r=0,k=1);while(i>f);k>1&&(n[++u]=r);this._setLen(n,f==1?-u:u)};i.prototype._sub=function(n,t,i){var e=this._getLen(t),s=this._getLen(i);n[e]=0;for(var f=0,h=0,c=0,r=0,u=1;u<=e;u++)r+=t[++h],u<=s&&(r-=i[++c]),r>=0?(n[++f]=r,r=0):(n[++f]=r+o,r=-1);while(--u>0)if(n[f--]!=0)break;this._setLen(n,u)};i.prototype.sub=function(n,t,i){if(t=this._clone(t),i=this._clone(i),t[0]<0&&i[0]>=0){i[0]=-i[0];this.add(n,t,i);return}if(t[0]>=0&&i[0]<0){i[0]=-i[0];this.add(n,t,i);return}if(t[0]<0&&i[0]<0){t[0]=-t[0];i[0]=-i[0];this.sub(n,i,t);return}this.cmp(t,i)<0?(this._sub(n,i,t),n[0]=-n[0]):this._sub(n,t,i)};n._DBL_EPSILON=ht;n._NORMALIZE=bt;n._RAND_MAX=ct;n._ABS=h;n._ACOS=nr;n._ASIN=tr;n._ATAN=ir;n._ATAN2=rr;n._CEIL=lt;n._COS=ur;n._EXP=fr;n._FLOOR=d;n._LOG=kt;n._POW=v;n._SIN=er;n._SQRT=it;n._TAN=or;n.srand=sr;n.rand=hr;n._INT=f;n._DIV=u;n._MOD=e;n._SHIFTL=cr;n._SHIFTR=lr;n._AND=g;n._OR=ar;n._XOR=vr;n._SIGNED=yr;n._UNSIGNED=dt;n._MODF=pr;n._FACTORIAL=wr;n._CHAR=s;n._CHAR_CODE_0=c;n._CHAR_CODE_9=ut;n._CHAR_CODE_LA=ft;n._CHAR_CODE_LZ=br;n._CHAR_CODE_UA=et;n._CHAR_CODE_UZ=kr;n._CHAR_CODE_EX=dr;n._CHAR_CODE_COLON=gr;n._ISINF=at;n._ISNAN=y;n._ISZERO=gt;n._APPROX=vt;n._APPROX_M=nu;n._EPREC=tu;n._FPREC=iu;n._GCD=ni;n._LCM=ru;n.stringToFloat=uu;n.stringToInt=fu;n.floatToExponential=eu;n.floatToFixed=ou;n.floatToString=ti;n.floatToStringPoint=su;n.intToString=hu;n._Integer=ot;n.newIntegerArray=cu;n._MP_DIGIT=r;n._MP_ELEMENT=o;n._MP_PREC_MASK=b;n._MP_LEN_COEF=l;n._MP_FROUND_UP=ii;n._MP_FROUND_DOWN=ri;n._MP_FROUND_CEILING=ui;n._MP_FROUND_FLOOR=fi;n._MP_FROUND_HALF_UP=ei;n._MP_FROUND_HALF_DOWN=oi;n._MP_FROUND_HALF_EVEN=pt;n._MultiPrec=i})(window)