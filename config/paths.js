const path = require("path");
const {currentWorkingDirectory} = require("node-wiz");

const sourceDir = process.env.SOURCE_DIR || "src"

function resolveApp(relativePath) {
  return path.resolve(currentWorkingDirectory, relativePath);
}
// @remove-on-eject-begin
const ownDirectory = path.resolve(__dirname, "..");

function resolveOwn(relativePath) {
  return path.resolve(ownDirectory, relativePath);
}
// @remove-on-eject-end
module.exports = {
  resolveApp,
  appDirectory: currentWorkingDirectory,
  appEntry: resolveApp(`${sourceDir}/index`),
  appUtils: resolveApp(`${sourceDir}/utils`),
  appComponents: resolveApp(`${sourceDir}/components`),
  appModules: resolveApp(`${sourceDir}/modules`),
  appHtml: resolveApp("public/index.html"),
  appPackageJson: resolveApp("package.json"),
  appPublic: resolveApp("public"),
  appDist: resolveApp("dist"),
};
// @remove-on-eject-begin
module.exports = {
  resolveApp,
  resolveOwn,
  appDirectory: currentWorkingDirectory,
  appEntry: resolveApp(`${sourceDir}/index`),
  appUtils: resolveApp(`${sourceDir}/utils`),
  appComponents: resolveApp(`${sourceDir}/components`),
  appModules: resolveApp(`${sourceDir}/modules`),
  appHtml: resolveApp("public/index.html"),
  appPackageJson: resolveApp("package.json"),
  appPublic: resolveApp("public"),
  appDist: resolveApp("dist"),
};
// @remove-on-eject-end
