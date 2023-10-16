const process = require("process");
const childProcess = require("child_process");

// similar to: https://github.com/moxystudio/node-cross-spawn
function spawn(command, params) {
    const isWindows = process.platform === "win32";
    const result = childProcess.spawnSync(isWindows ? command + ".cmd" : command, params, {
      stdio: "inherit",
    });
    if (result.error) {
      console.error(result.error);
      process.exit(1);
    }
    if (result.status !== 0) {
      console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${params.join(" ")}`);
      process.exit(1);
    }
}

module.exports = {
    spawn
}