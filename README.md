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


 ffmpeg -rtsp_transport tcp -i rtsp://xxxxx:xxxx@xxxx:xxx/Streaming/Channels/102  -c copy -movflags +frag_keyframe+empty_moov -f mp4 -y output.mp4

 ffmpeg -rtsp_transport tcp -i "rtsp://xxxxx:xxxx@xxxx:xxx/Streaming/Channels/102" ^
-c:v libx264 -preset ultrafast -tune zerolatency ^
-movflags +frag_keyframe+empty_moov -f mp4 -y output.mp4

ffmpeg -rtsp_transport tcp -i "rtsp://xxxxx:xxxx@xxxx:xxx/Streaming/Channels/102" ^
-c:v libx264 -preset ultrafast -tune zerolatency ^
-movflags +frag_keyframe+empty_moov -f mp4 -y output.mp4

ffmpeg -rtsp_transport tcp -stimeout 10000000 -i "rtsp://admin:User@123@10.128.3.1:554/Streaming/Channels/102" ^
-c:v libx264 -preset ultrafast -tune zerolatency ^
-movflags +frag_keyframe+empty_moov -f mp4 -y output.mp4

ffmpeg -rtsp_transport tcp -i "rtsp://admin:User@123@10.128.3.1:554/cam/playback?channel=1&starttime=20240521T080000Z&endtime=20240521T083000Z" ^
-c:v libx264 -preset ultrafast -tune zerolatency ^
-movflags +frag_keyframe+empty_moov -f mp4 -y output.mp4

0:00:10.000000 convert to timesanp
