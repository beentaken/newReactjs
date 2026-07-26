@echo off

start cmd /k docker compose -f both.yml up -d
start cmd /k docker compose -f kafka.yml up -d
start cmd /k docker compose -f portainer.yml up -d
start cmd /k docker compose -f mq.yml up -d
start cmd /k docker compose -f s3.yml up -d
REM Done