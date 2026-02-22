docker compose -f both.yml up -d


docker compose -f kafka.yml up -d


docker system prune --volumes
docker network prune
docker system prune -a --volumes -f

12ab

# Solution2



cd reactapp
npm install --legacy-peer-deps


npm install react-router-dom
npm install @mui/material
npm install @emotion/react @emotion/styled
npm install @mui/icons-material @material-ui/core
npm install @mui/material @emotion/react @emotion/styled @mui/styles
npm install @material-ui/icons
npm install xlsx
npm install react-beautiful-dnd --legacy-peer-deps



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

powershell
New-Item -ItemType Directory -Path "$env:APPDATA\ASP.NET\https" -Force
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"
openssl pkcs12 -export -out myapp.pfx -inkey key.pem -in cert.pem -password pass:password123

dotnet dev-certs https -t
dotnet dev-certs https --clean
copy  the cert in "C:\Users\xxxx\AppData\Roaming\ASP.NET\https" into https folder of react app

docker exec -it mssql bash
docker exec -it mssql -u root -p

cd /opt/mssql-tools18/bin
bash entrypoint.sh 
dos2unix entrypoint.sh 
docker exec -it mssql /opt/mssql-tools18/bin/sqlcmd


# Set password as variable (using single quotes)
PASSWORD='YourStrong!Passw0rd'

# Then use the variable
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$PASSWORD"
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$PASSWORD" -C -i /docker-entrypoint-initdb.d/init.sql




# API ui
http://localhost:7048/swagger/index.html