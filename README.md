
ffmpeg -rtsp_transport tcp -stimeout 5000000 -rtsp_flags prefer_tcp -fflags +genpts \
-i "rtsp://172.19.128.5:9090/playback?cameraid=1000279$1$0$1&begintime=1747987772&endtime=1747987788&type=2&substream=0&recordtype=1" \
-c:v libx264 -preset ultrafast -tune zerolatency -crf 30 -g 50 -pix_fmt yuv420p -an \
-movflags +frag_keyframe+empty_moov -f mp4 -y output1.mp4






docker system prune --volumes



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



