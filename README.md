docker compose -f both.yml up -d


docker compose -f kafka.yml up -d


docker system prune --volumes
docker network prune
docker system prune -a --volumes -f

12ab

# Solution2



cd reactapp
npm install react-router-dom
npm install @mui/material
npm install @emotion/react @emotion/styled
npm install @mui/icons-material @material-ui/core
npm install @mui/material @emotion/react @emotion/styled @mui/styles
npm install @material-ui/icons
npm install xlsx
npm install react-beautiful-dnd --legacy-peer-deps
npm install --legacy-peer-deps

npm -g install kafkajs
npm -g i @keycloak/keycloak-admin-client

docker compose -f docker-compose.yml up -d

docker system prune

docker system prune --volumes

docker builder prune

docker buildx prune

docker image prune -a

docker system prune -a --volumes




choco install openssl.light -y
choco uninstall openssl.light -y