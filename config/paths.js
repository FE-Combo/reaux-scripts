const path = require("path");
const fs = require("fs-extra");
const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

function resolveOwn(relativePath) {
  return path.resolve(__dirname, '..', relativePath);
}

module.exports = {
  resolveApp,
  resolveOwn,
  appDirectory,
  ownDirectory: resolveOwn("."),
  appEntry: resolveApp("src/index"),
  appUtils: resolveApp("src/utils"),
  appComponents: resolveApp("src/components"),
  appModules: resolveApp("src/modules"),
  appHtml: resolveApp("public/index.html"),
  appPackageJson: resolveApp("package.json"),
  appPublic: resolveApp("public"),
  appDist: resolveApp("dist"),
}