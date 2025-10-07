@echo off
chcp 65001 >nul
cd /d "D:\OneDrive - Double K OU\Web-Dev\Витрины\shapeai.co.uk"
echo Current directory: %CD%
echo.
echo Git status:
git status
echo.
echo Git log (last 5 commits):
git log --oneline -5
echo.
echo Git remote:
git remote -v
pause