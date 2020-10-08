@echo off

set CPP=C:\MinGW\bin\gcc -E -P -x c
set TMP=tmp_clip

md %TMP%

cd core
%CPP% -DDEBUG math\_Complex.js math\_Fract.js math\_Math.js math\_MathEnv.js math\_Matrix.js math\_Time.js math\_Value.js param\_Boolean.js param\_Float.js param\_Integer.js param\_String.js param\_Void.js system\_Tm.js _Array.js _Func.js _Global.js _Graph.js _GWorld.js _Label.js _Line.js _Loop.js _Param.js _Proc.js _Token.js _Variable.js > ..\%TMP%\core.debug.js
%CPP% math\_Complex.js math\_Fract.js math\_Math.js math\_MathEnv.js math\_Matrix.js math\_Time.js math\_Value.js param\_Boolean.js param\_Float.js param\_Integer.js param\_String.js param\_Void.js system\_Tm.js _Array.js _Func.js _Global.js _Graph.js _GWorld.js _Label.js _Line.js _Loop.js _Param.js _Proc.js _Token.js _Variable.js > ..\%TMP%\core.tmp.js
cd ..

function %TMP%\core.debug.js %TMP%\function.debug.js
function %TMP%\core.tmp.js %TMP%\function.js

define core\_Global.h    %TMP%\global.js
define core\math\_Math.h %TMP%\math.js

cd %TMP%
..\string core.tmp.js string.js strrep.bat ..\strrep 1 1
call strrep.bat > core.js
cd ..

%CPP% clip.js | format > %TMP%\clip.debug.js
%CPP% -DMINIFIED clip.js | format > %TMP%\clip.tmp.js

call "C:\HTML5\Microsoft Ajax Minifier\AjaxMinCommandPromptVars"
cd %TMP%
del clip.js
AjaxMin -enc:in UTF-8 clip.tmp.js -out clip.js
cd ..

copy /B head.txt+%TMP%\clip.debug.js core\clip.debug.js
copy /B head.txt+%TMP%\clip.js       core\clip.js

pause
