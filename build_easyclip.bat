@echo off

set CPP=gcc -E -P -x c
set TMP=tmp\easyclip
rem set AJAXMINPATH=C:\Microsoft Ajax Minifier

md %TMP%

cd core\extras
%CPP% _Canvas.js _EasyCanvas.js _EasyClip.js _StringUtil.js > ..\..\%TMP%\core.debug.js
cd ..\..

function %TMP%\core.debug.js %TMP%\function.js

string %TMP%\core.debug.js %TMP%\string.js %TMP%\strrep.bat strrep 1 1
call %TMP%\strrep.bat > %TMP%\core.js

%CPP%            easyclip.js | format > %TMP%\easyclip.debug.js
%CPP% -DMINIFIED easyclip.js | format > %TMP%\easyclip.tmp.js

call "%AJAXMINPATH%\AjaxMinCommandPromptVars"
del %TMP%\easyclip.js
AjaxMin -enc:in UTF-8 %TMP%\easyclip.tmp.js -out %TMP%\easyclip.js

copy /B head.txt+%TMP%\easyclip.debug.js core\extras\easyclip.debug.js
copy /B head.txt+%TMP%\easyclip.js       core\extras\easyclip.js

pause
