@echo off
set PATH=%~dp0.tools\node\node-v22.19.0-win-x64;%PATH%
echo Starting backend and frontend...
start "Snowbell API" cmd /k "cd /d %~dp0backend && set PATH=%~dp0.tools\node\node-v22.19.0-win-x64;%PATH% && if not exist node_modules npm install && npm run dev"
start "Snowbell Web" cmd /k "cd /d %~dp0frontend && set PATH=%~dp0.tools\node\node-v22.19.0-win-x64;%PATH% && if not exist node_modules npm install && npm run dev"
echo.
echo Website:  http://localhost:5173
echo API:      http://localhost:5000/api/health
echo Admin:    http://localhost:5173/admin/login
echo.
pause
