@echo off

set CPP=C:\MinGW\bin\gcc -E -P -x c

md tmp

cd src
%CPP% -I..\..\..\core\extras -I..\..\..\core -DDEBUG Main.js > ..\htdocs\All.debug.js
%CPP% -I..\..\..\core\extras -DUSE_CLIP_LIB  -DDEBUG Main.js > ..\htdocs\Main.debug.js
%CPP% -I..\..\..\core\extras -DUSE_CLIP_LIB          Main.js > ..\tmp\Main.js
cd ..

call "C:\HTML5\Microsoft Ajax Minifier\AjaxMinCommandPromptVars"
cd htdocs
del Main.js
AjaxMin -enc:in UTF-8 ..\tmp\Main.js -out Main.js
cd ..

copy ..\..\core\clip.debug.js               htdocs
copy ..\..\core\clip.js                     htdocs
copy ..\..\core\extras\_Canvas.js           htdocs
copy ..\..\core\extras\_ColorWin.js         htdocs
copy ..\..\core\extras\_DefCharInfo.js      htdocs
copy ..\..\core\extras\_DefCharInfoLarge.js htdocs
copy ..\..\core\extras\_EasyClip.js         htdocs

pause
