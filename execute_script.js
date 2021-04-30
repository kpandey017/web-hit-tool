
const { execSync } = require('child_process');
// stderr is sent to stdout of parent process
// you can set options.stdio if you want it to go elsewhere

//const stdout = execSync('Xvfb -ac :99 -screen 0 1280x1024x16 &');
const stdout1 = execSync('export DISPLAY=:99');
const stdout2 = execSync('node /home/notadmin/web-hit-tool/index.js');
