@echo off
rem Windows build wrapper: this machine denies deletion of esbuild temp files in
rem %TEMP%, so point TEMP at a workspace-local directory before building.
setlocal
set "TEMP=%~dp0.tmp"
set "TMP=%~dp0.tmp"
if not exist "%TEMP%" mkdir "%TEMP%"
call pnpm build
