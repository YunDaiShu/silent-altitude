@echo off
rem Windows dev wrapper: esbuild cannot delete its temp files in %TEMP% on this
rem machine, so point TEMP at a workspace-local directory before starting vite.
setlocal
set "TEMP=%~dp0.tmp"
set "TMP=%~dp0.tmp"
if not exist "%TEMP%" mkdir "%TEMP%"
call pnpm dev %*
