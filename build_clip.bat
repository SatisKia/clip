@echo off

set CPP=gcc -E -P -x c
set TMP=tmp\clip
rem set AJAXMINPATH=C:\Microsoft Ajax Minifier
if "%AJAXMINPATH%"=="" goto error

md %TMP%

cd core
%CPP% -DDEBUG math\_Complex.js math\_Fract.js math\_Math.js math\_MathEnv.js math\_Matrix.js math\_Time.js math\_Value.js mp\_MultiPrec.js mp\_abs.js mp\_add.js mp\_cmp.js mp\_div.js mp\_fadd.js mp\_fcmp.js mp\_fdigit.js mp\_fdiv.js mp\_fdiv2.js mp\_fmul.js mp\_fnum2str.js mp\_fround.js mp\_fsqrt.js mp\_fsqrt2.js mp\_fsqrt3.js mp\_fstr2num.js mp\_fsub.js mp\_ftrunc.js mp\_mul.js mp\_neg.js mp\_num2str.js mp\_set.js mp\_sqrt.js mp\_str2num.js mp\_sub.js param\_Boolean.js param\_Float.js param\_Integer.js param\_String.js param\_Void.js system\_Tm.js _Array.js _Func.js _Global.js _Graph.js _GWorld.js _Label.js _Line.js _Loop.js _Param.js _Proc.js _Token.js _Variable.js > ..\%TMP%\core.debug.js
%CPP% math\_Complex.js math\_Fract.js math\_Math.js math\_MathEnv.js math\_Matrix.js math\_Time.js math\_Value.js mp\_MultiPrec.js mp\_abs.js mp\_add.js mp\_cmp.js mp\_div.js mp\_fadd.js mp\_fcmp.js mp\_fdigit.js mp\_fdiv.js mp\_fdiv2.js mp\_fmul.js mp\_fnum2str.js mp\_fround.js mp\_fsqrt.js mp\_fsqrt2.js mp\_fsqrt3.js mp\_fstr2num.js mp\_fsub.js mp\_ftrunc.js mp\_mul.js mp\_neg.js mp\_num2str.js mp\_set.js mp\_sqrt.js mp\_str2num.js mp\_sub.js param\_Boolean.js param\_Float.js param\_Integer.js param\_String.js param\_Void.js system\_Tm.js _Array.js _Func.js _Global.js _Graph.js _GWorld.js _Label.js _Line.js _Loop.js _Param.js _Proc.js _Token.js _Variable.js > ..\%TMP%\core.tmp.js
cd ..

function %TMP%\core.debug.js %TMP%\function.debug.js
function %TMP%\core.tmp.js %TMP%\function.js

define core\_Global.h    %TMP%\global.js
define core\math\_Math.h %TMP%\math.js
define core\mp\_fround.h %TMP%\fround.js

string %TMP%\core.tmp.js %TMP%\string.js %TMP%\strrep.bat strrep 1 1
call %TMP%\strrep.bat > %TMP%\core.js

%CPP%            clip.js | format > %TMP%\clip.debug.js
%CPP% -DMINIFIED clip.js | format > %TMP%\clip.tmp.js

call "%AJAXMINPATH%\AjaxMinCommandPromptVars"
del %TMP%\clip.js
AjaxMin -enc:in UTF-8 %TMP%\clip.tmp.js -out %TMP%\clip.js

copy /B head.txt+%TMP%\clip.debug.js core\clip.debug.js
copy /B head.txt+%TMP%\clip.js       core\clip.js

goto end

:error
echo ŠÂ‹«•Ï”"AJAXMINPATH"‚ªİ’è‚³‚ê‚Ä‚¢‚Ü‚¹‚ñ

:end
pause
