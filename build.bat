@echo off

set CPP=C:\MinGW\bin\gcc -E -P -x c

md tmp

cd core
%CPP% -DDEBUG math\_Complex.js math\_Fract.js math\_Math.js math\_MathEnv.js math\_Matrix.js math\_Time.js math\_Value.js param\_Boolean.js param\_Float.js param\_Integer.js param\_String.js param\_Void.js system\_Tm.js _Array.js _Func.js _Global.js _Graph.js _GWorld.js _Label.js _Line.js _Loop.js _Param.js _Proc.js _Token.js _Variable.js > ..\tmp\core.debug.js
%CPP% math\_Complex.js math\_Fract.js math\_Math.js math\_MathEnv.js math\_Matrix.js math\_Time.js math\_Value.js param\_Boolean.js param\_Float.js param\_Integer.js param\_String.js param\_Void.js system\_Tm.js _Array.js _Func.js _Global.js _Graph.js _GWorld.js _Label.js _Line.js _Loop.js _Param.js _Proc.js _Token.js _Variable.js > ..\tmp\core.tmp.js
cd ..

function tmp\core.debug.js tmp\function.debug.js
function tmp\core.tmp.js tmp\function.js

define core\_Global.h    tmp\global.js
define core\math\_Math.h tmp\math.js

cd tmp
..\string core.tmp.js string.js strrep.bat ..\strrep 1 1
call strrep.bat > core.js
cd ..

%CPP% clip.js | format > tmp\clip.debug.js
%CPP% -DMINIFIED clip.js | format > tmp\clip.tmp.js

call "C:\HTML5\Microsoft Ajax Minifier\AjaxMinCommandPromptVars"
cd tmp
del clip.js
AjaxMin -enc:in UTF-8 clip.tmp.js -out clip.js
cd ..

copy /B head.txt+tmp\clip.debug.js core\clip.debug.js
copy /B head.txt+tmp\clip.js       core\clip.js

pause
