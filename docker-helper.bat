@echo off
REM Docker Compose Helper Script for Windows
REM This script simplifies common Docker operations

setlocal enabledelayedexpansion

if "%1"=="" (
	echo.
	echo Docker Helper Commands:
	echo.
	echo Usage: docker-helper.bat [command]
	echo.
	echo Commands:
	echo   start        - Start MongoDB and MSSQL
	echo   stop         - Stop databases (keeps data)
	echo   restart      - Restart all services
	echo   logs         - View real-time logs
	echo   clean        - Remove containers and volumes
	echo   rebuild      - Rebuild and start fresh
	echo   status       - Show running containers
	echo   help         - Show this help message
	echo.
	goto:eof
)

if "%1"=="start" (
	echo Starting Docker containers...
	docker-compose up -d
	echo.
	echo Containers started!
	echo MongoDB: localhost:27017
	echo Mongo Express: http://localhost:8081
	echo MSSQL: localhost:1433
	goto:eof
)

if "%1"=="stop" (
	echo Stopping Docker containers...
	docker-compose stop
	goto:eof
)

if "%1"=="restart" (
	echo Restarting Docker containers...
	docker-compose restart
	goto:eof
)

if "%1"=="logs" (
	docker-compose logs -f
	goto:eof
)

if "%1"=="clean" (
	echo WARNING: This will remove all containers and data volumes!
	set /p confirm="Are you sure? (y/n): "
	if /i "!confirm!"=="y" (
		docker-compose down -v
		echo Cleaned!
	) else (
		echo Cancelled.
	)
	goto:eof
)

if "%1"=="rebuild" (
	echo WARNING: This will remove all containers and data!
	set /p confirm="Are you sure? (y/n): "
	if /i "!confirm!"=="y" (
		docker-compose down -v
		docker-compose build --no-cache
		docker-compose up -d
		echo Rebuilt and started!
	) else (
		echo Cancelled.
	)
	goto:eof
)

if "%1"=="status" (
	docker ps --filter "name=mongodb\|mssql\|mongo-express"
	goto:eof
)

if "%1"=="help" (
	echo.
	echo Docker Helper Commands:
	echo.
	echo Usage: docker-helper.bat [command]
	echo.
	echo Commands:
	echo   start        - Start MongoDB and MSSQL
	echo   stop         - Stop databases (keeps data)
	echo   restart      - Restart all services
	echo   logs         - View real-time logs
	echo   clean        - Remove containers and volumes
	echo   rebuild      - Rebuild and start fresh
	echo   status       - Show running containers
	echo   help         - Show this help message
	echo.
	goto:eof
)

echo Unknown command: %1
echo Run "docker-helper.bat help" for available commands
