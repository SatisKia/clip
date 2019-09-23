@echo off

set CPP=C:\MinGW\bin\gcc -E -P -x c

md tmp

cd core
%CPP% -DDEBUG _Array.js _Func.js _Global.js _Graph.js _GWorld.js _Label.js _Line.js _Loop.js _Param.js _Proc.js _Token.js _Variable.js math\_Complex.js math\_Fract.js math\_Math.js math\_Matrix.js math\_Time.js math\_Value.js param\_Boolean.js param\_Float.js param\_Integer.js param\_String.js param\_Void.js system\_Tm.js > ..\tmp\tmp1.debug.js
%CPP% _Array.js _Func.js _Global.js _Graph.js _GWorld.js _Label.js _Line.js _Loop.js _Param.js _Proc.js _Token.js _Variable.js math\_Complex.js math\_Fract.js math\_Math.js math\_Matrix.js math\_Time.js math\_Value.js param\_Boolean.js param\_Float.js param\_Integer.js param\_String.js param\_Void.js system\_Tm.js > ..\tmp\tmp1.js
cd ..

function tmp\tmp1.debug.js tmp\function.debug.js
function tmp\tmp1.js tmp\function.js

define core\_Global.h    tmp\define1.js
define core\math\_Math.h tmp\define2.js

cd tmp
..\string tmp1.js string.js strrep.bat ..\strrep 1 1
call strrep.bat > tmp2.js
cd ..

%CPP% clip.js | format > tmp\clip.debug.js
%CPP% -DMINIFIED clip.js | format > tmp\tmp3.js

call "C:\HTML5\Microsoft Ajax Minifier\AjaxMinCommandPromptVars"
cd tmp
del clip.js
AjaxMin -enc:in UTF-8 tmp3.js -out clip.js
cd ..

copy /B head.txt+tmp\clip.debug.js core\clip.debug.js
copy /B head.txt+tmp\clip.js       core\clip.js

pause
