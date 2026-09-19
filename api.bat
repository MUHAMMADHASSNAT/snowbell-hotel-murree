@echo off
set PATH=%~dp0.tools\node\node-v22.19.0-win-x64;%PATH%
cd /d %~dp0backend
if not exist node_modules npm install
npm run dev
