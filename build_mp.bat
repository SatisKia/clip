@echo off

set CPP=gcc -E -P -x c
set TMP=tmp\mp
rem set AJAXMINPATH=C:\Microsoft Ajax Minifier
if "%AJAXMINPATH%"=="" goto error

md %TMP%

cd core\mp
%CPP% ..\math\_Math.js ..\param\_Integer.js _MultiPrec.js _abs.js _add.js _cmp.js _div.js _fadd.js _fcmp.js _fdigit.js _fdiv.js _fdiv2.js _fmul.js _fnum2str.js _fround.js _fsqrt.js _fsqrt2.js _fsqrt3.js _fstr2num.js _fsub.js _ftrunc.js _mul.js _neg.js _num2str.js _set.js _sqrt.js _str2num.js _sub.js > ..\..\%TMP%\core.debug.js
cd ..\..

function %TMP%\core.debug.js %TMP%\function.js

define core\mp\_fround.h %TMP%\fround.js

string %TMP%\core.debug.js %TMP%\string.js %TMP%\strrep.bat strrep 1 1
call %TMP%\strrep.bat > %TMP%\core.js

%CPP%            mp.js | format > %TMP%\mp.debug.js
%CPP% -DMINIFIED mp.js | format > %TMP%\mp.tmp.js

call "%AJAXMINPATH%\AjaxMinCommandPromptVars"
del %TMP%\mp.js
AjaxMin -enc:in UTF-8 %TMP%\mp.tmp.js -out %TMP%\mp.js

copy /B head.txt+%TMP%\mp.debug.js core\mp\mp.debug.js
copy /B head.txt+%TMP%\mp.js       core\mp\mp.js

goto end

:error
echo 環境変数"AJAXMINPATH"が設定されていません

:end
pause
