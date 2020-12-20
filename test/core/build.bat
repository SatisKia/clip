@echo off

rem set SKCOMMONPATH=C:\git\SatisKia\common
if "%SKCOMMONPATH%"=="" goto error
set CPP=gcc -E -P -x c -I%SKCOMMONPATH% -I..\..\..\core\extras
rem set AJAXMINPATH=C:\Microsoft Ajax Minifier
if "%AJAXMINPATH%"=="" goto error

md tmp

cd src
%CPP% -I..\..\..\core -DDEBUG Main.js > ..\htdocs\All.debug.js
%CPP% -DUSE_CLIP_LIB  -DDEBUG Main.js > ..\htdocs\Main.debug.js
%CPP% -DUSE_CLIP_LIB          Main.js > ..\tmp\Main.js
cd ..

call "%AJAXMINPATH%\AjaxMinCommandPromptVars"
cd htdocs
del Main.js
AjaxMin -enc:in UTF-8 ..\tmp\Main.js -out Main.js
cd ..

copy ..\..\core\clip.debug.js htdocs
copy ..\..\core\clip.js       htdocs

call extras

goto end

:error
echo ŠÂ‹«•Ï”"SKCOMMONPATH"‚Ü‚½‚Í"AJAXMINPATH"‚ªİ’è‚³‚ê‚Ä‚¢‚Ü‚¹‚ñ
pause

:end
