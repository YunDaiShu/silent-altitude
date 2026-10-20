@echo off
rem Build a double-clickable single-file version (silent-altitude.html).
setlocal
set "TEMP=%~dp0.tmp"
set "TMP=%~dp0.tmp"
if not exist "%TEMP%" mkdir "%TEMP%"
node scripts\build-single.mjs
