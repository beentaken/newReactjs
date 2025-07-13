docker compose -f both.yml up -d

docker system prune --volumes



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

docker compose -f docker-compose.yml up -d







✅ 1. Safe Cleanup (Unused Containers, Networks, Images, and Cache)

bash

Copy

Edit

docker system prune

Removes:



Stopped containers



Unused networks



Dangling images



Build cache



⚠️ 2. Cleanup + Volumes (Persistent Data Will Be Lost)

bash

Copy

Edit

docker system prune --volumes

Same as above, plus volumes — use only if you don’t need stored data.



🧱 3. Clear All Build Cache

bash

Copy

Edit

docker builder prune

For BuildKit/multi-platform builds:



bash

Copy

Edit

docker buildx prune

🪣 4. Remove All Unused Images

bash

Copy

Edit

docker image prune -a

Deletes all images not used by any container (even if tagged).



💣 5. Full Reset (Everything Not Actively Used)

bash

Copy

Edit

docker system prune -a --volumes

Removes:



All unused containers, networks, images (used or not), build cache, and volumes



🔴 Use with extreme caution: You may lose important data if any volume or image was still needed.





