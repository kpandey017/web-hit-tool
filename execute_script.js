const { exec } = require('child_process');
exec("xvfb-run -a --server-args=' - screen 0 1280x800x24 - ac - nolisten tcp - dpi 96 + extension RANDR' node /home/notadmin/web-hit-tool/index.js &", (err, stdout, stderr) => {
  if (err) {
    //some err occurred
    console.error(err)
  } else {
   // the *entire* stdout and stderr (buffered)
   console.log(`stdout: ${stdout}`);
   console.log(`stderr: ${stderr}`);
  }
});
