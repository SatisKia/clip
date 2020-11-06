@echo off

rem set SKCOMMONPATH=C:\git\SatisKia\common
set CPP=gcc -E -P -x c -I%SKCOMMONPATH% -I..\..\..\core\extras
rem set AJAXMINPATH=C:\Microsoft Ajax Minifier

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
