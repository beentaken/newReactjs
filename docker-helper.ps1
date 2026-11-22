#!/usr/bin/env pwsh
# Docker Compose Helper Script for PowerShell
# This script simplifies common Docker operations

param(
	[string]$Command = ""
)

function Show-Help {
	Write-Host ""
	Write-Host "Docker Helper Commands:" -ForegroundColor Cyan
	Write-Host ""
	Write-Host "Usage: ./docker-helper.ps1 -Command <command>" -ForegroundColor Yellow
	Write-Host ""
	Write-Host "Commands:" -ForegroundColor Green
	Write-Host "  start        - Start MongoDB and MSSQL"
	Write-Host "  stop         - Stop databases (keeps data)"
	Write-Host "  restart      - Restart all services"
	Write-Host "  logs         - View real-time logs"
	Write-Host "  clean        - Remove containers and volumes"
	Write-Host "  rebuild      - Rebuild and start fresh"
	Write-Host "  status       - Show running containers"
	Write-Host "  help         - Show this help message"
	Write-Host ""
}

if ([string]::IsNullOrEmpty($Command)) {
	Show-Help
	exit 0
}

switch ($Command.ToLower()) {
	"start" {
		Write-Host "Starting Docker containers..." -ForegroundColor Yellow
		docker-compose up -d
		Write-Host ""
		Write-Host "Containers started!" -ForegroundColor Green
		Write-Host "MongoDB: localhost:27017"
		Write-Host "Mongo Express: http://localhost:8081"
		Write-Host "MSSQL: localhost:1433"
		break
	}

	"stop" {
		Write-Host "Stopping Docker containers..." -ForegroundColor Yellow
		docker-compose stop
		Write-Host "Done!" -ForegroundColor Green
		break
	}

	"restart" {
		Write-Host "Restarting Docker containers..." -ForegroundColor Yellow
		docker-compose restart
		Write-Host "Done!" -ForegroundColor Green
		break
	}

	"logs" {
		docker-compose logs -f
		break
	}

	"clean" {
		Write-Host "WARNING: This will remove all containers and data volumes!" -ForegroundColor Red
		$confirm = Read-Host "Are you sure? (y/n)"
		if ($confirm -eq "y") {
			docker-compose down -v
			Write-Host "Cleaned!" -ForegroundColor Green
		} else {
			Write-Host "Cancelled." -ForegroundColor Yellow
		}
		break
	}

	"rebuild" {
		Write-Host "WARNING: This will remove all containers and data!" -ForegroundColor Red
		$confirm = Read-Host "Are you sure? (y/n)"
		if ($confirm -eq "y") {
			Write-Host "Removing old containers..." -ForegroundColor Yellow
			docker-compose down -v
			Write-Host "Building images..." -ForegroundColor Yellow
			docker-compose build --no-cache
			Write-Host "Starting services..." -ForegroundColor Yellow
			docker-compose up -d
			Write-Host "Rebuilt and started!" -ForegroundColor Green
		} else {
			Write-Host "Cancelled." -ForegroundColor Yellow
		}
		break
	}

	"status" {
		docker ps --filter "name=mongodb|mssql|mongo-express"
		break
	}

	"help" {
		Show-Help
		break
	}

	default {
		Write-Host "Unknown command: $Command" -ForegroundColor Red
		Write-Host "Run './docker-helper.ps1 -Command help' for available commands" -ForegroundColor Yellow
	}
}
