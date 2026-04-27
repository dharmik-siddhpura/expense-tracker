@echo off
echo ========================================
echo   Expense Tracker - Starting Backend
echo ========================================
echo.
echo Backend running at: http://localhost:8080
echo Frontend: Open frontend/index.html with Live Server in VS Code
echo.
echo Demo login:
echo   Email   : demo@expense.com
echo   Password: demo1234
echo.
echo Press Ctrl+C to stop the server.
echo ========================================
cd /d "%~dp0backend"
mvn spring-boot:run
pause
