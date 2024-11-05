@echo off
cls
set tag=%1
if "%tag%"=="" (set /p tag="tag (empty for latest): ")
if "%tag%"=="" (set tag=latest)
set image=reactapp:%tag%
cls
echo Building image %image%...

REM Use the correct build context path
docker build -f "../reactapp/Dockerfile" --force-rm -t %image% "../reactapp"

if errorlevel 1 (
    echo Failed to build the image. Exiting...
    pause
    exit /b 1
)

echo Pushing image %image%...
docker push %image%

pause
