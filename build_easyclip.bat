@echo off

set CPP=C:\MinGW\bin\gcc -E -P -x c
set TMP=tmp\easyclip
set TMPROOT=..\..

md %TMP%

cd core\extras
%CPP% _Canvas.js _EasyCanvas.js _EasyClip.js _StringUtil.js > ..\..\%TMP%\core.debug.js
cd ..\..

function %TMP%\core.debug.js %TMP%\function.js

cd %TMP%
%TMPROOT%\string core.debug.js string.js strrep.bat %TMPROOT%\strrep 1 1
call strrep.bat > core.js
cd %TMPROOT%

%CPP% easyclip.js | format > %TMP%\easyclip.debug.js
%CPP% -DMINIFIED easyclip.js | format > %TMP%\easyclip.tmp.js

call "C:\HTML5\Microsoft Ajax Minifier\AjaxMinCommandPromptVars"
cd %TMP%
del easyclip.js
AjaxMin -enc:in UTF-8 easyclip.tmp.js -out easyclip.js
cd %TMPROOT%

copy /B head.txt+%TMP%\easyclip.debug.js core\extras\easyclip.debug.js
copy /B head.txt+%TMP%\easyclip.js       core\extras\easyclip.js

pause
