#!/bin/bash
cmd /k docker compose -f both.yml up -d
cmd /k docker compose -f kafka.yml up -d
cmd /k docker compose -f portainer.yml up -d

REM  