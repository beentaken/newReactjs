#!/bin/bash
docker compose -f both.yml up -d
docker compose -f kafka.yml up -d
docker compose -f portainer.yml up -d
docker compose -f mq.yml up -d

# cmd /k docker compose -f kafka.yml up -d