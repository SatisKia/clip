@echo off

set CPP=gcc -E -P -x c -I..\..\..\core
rem set AJAXMINPATH=C:\Microsoft Ajax Minifier
if "%AJAXMINPATH%"=="" goto error

cd src
%CPP% Main.js > ..\htdocs\Main.debug.js
cd ..

call "%AJAXMINPATH%\AjaxMinCommandPromptVars"
cd htdocs
del Main.js
AjaxMin -enc:in UTF-8 Main.debug.js -out Main.js
cd ..

copy ..\..\core\mp\mp.debug.js htdocs
copy ..\..\core\mp\mp.js       htdocs

goto end

:error
echo 環境変数"AJAXMINPATH"が設定されていません

:end
pause
