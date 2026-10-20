@echo off
rem Rebuild everything after editing site.config.js or swapping media files:
rem   dist\            -> for deployment
rem   silent-altitude.html -> double-clickable single file
setlocal
set "TEMP=%~dp0.tmp"
set "TMP=%~dp0.tmp"
if not exist "%TEMP%" mkdir "%TEMP%"
call pnpm build || goto :fail
node scripts\build-single.mjs || goto :fail
echo.
echo Done: dist\ and silent-altitude.html are up to date.
exit /b 0
:fail
echo.
echo Build failed - see the messages above.
exit /b 1
