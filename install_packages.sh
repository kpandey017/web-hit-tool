Xvfb -ac :99 -screen 0 1280x1024x16 &
export DISPLAY=:99
node /home/notadmin/web-hit-tool/index.js
