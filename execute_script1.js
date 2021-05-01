const { execSync } = require('child_process');
// stderr is sent to stdout of parent process
// you can set options.stdio if you want it to go elsewhere
const { spawnSync} = require('child_process');
const child = spawnSync(["xvfb-run -a --server-args=' - screen 0 1280x800x24 - ac - nolisten tcp - dpi 96 + extension RANDR' node /home/notadmin/web-hit-tool/index.js &"] );
console.error('error', child.error);
console.log('stdout ', child.stdout);
console.error('stderr ', child.stderr);
