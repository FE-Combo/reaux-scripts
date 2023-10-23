const fs = require("fs-extra");
const path = require("path");
const prompts = require("prompts");
const chalk = require("chalk");
const { appDirectory, resolveOwn, resolveApp } = require("../config/paths");
const { getGitStatus, tryGitAdd, tryYarn, tryNpm } = require("node-wiz");
const os = require("os");

const files = ["config/paths.js", "config/webpack.config.dev.js", "config/webpack.config.prod.js", "scripts/build.js", "scripts/dev.js"];

function verifyAbsent(file) {
  if (fs.existsSync(path.join(appDirectory, file))) {
    console.error(chalk.red(`file '${file}' already exists in your app folder. We cannot continue as you would lose all the changes in that file or directory. Please move or delete it (maybe make a copy for backup) and run this command again.`));
    process.exit(1);
  }
}

prompts({
  type: "confirm",
  name: "shouldEject",
  message: "Are you sure you want to eject? This action is permanent.",
  initial: false,
}).then((answer) => {
  if (!answer.shouldEject) {
    console.info(chalk.cyan("Close call! Eject operation canceled."));
    return;
  }

  const gitStatus = getGitStatus();
  if (gitStatus) {
    console.error(`
${chalk.red("This git repository has untracked files or uncommitted changes:")}
${gitStatus
  .split("\n")
  .map((line) => line.match(/ .*/g)[0].trim())
  .join("\n")}
${chalk.red("Remove untracked files, stash or commit any changes, and try again.")}`);
    process.exit(1);
  }

  console.info("Ejecting...");

  files.forEach(verifyAbsent);

  console.info(chalk.cyan(`Copying files into ${appDirectory}`));

  files.forEach((file) => {
    let content = fs.readFileSync(path.join(resolveOwn("."), file), "utf8");
    if (content.match(/\/\/ @remove-file-on-eject/)) {
      return;
    }
    if (content.match(/\/\/ @remove-on-eject-begin/)) {
      content = content.replace(/\/\/ @remove-on-eject-begin([\s\S]*?)\/\/ @remove-on-eject-end/gm, "").replace(/-- @remove-on-eject-begin([\s\S]*?)-- @remove-on-eject-end/gm, "");
    }
    fs.createFileSync(path.join(appDirectory, file));
    console.info(`Adding ${chalk.cyan(file)} to the project`);
    fs.writeFileSync(file, content);
  });

  const ownPackage = require(resolveOwn("package.json"));
  const appPackage = require(resolveApp("package.json"));

  console.info(chalk.cyan("Updating the dependencies."));

  const ownPackageName = ownPackage.name;

  if (appPackage.devDependencies) {
    if (appPackage.devDependencies[ownPackageName]) {
      console.info(`Removing ${chalk.cyan(ownPackageName)} from devDependencies`);
      delete appPackage.devDependencies[ownPackageName];
    }
  }

  if (appPackage.dependencies) {
    if (appPackage.dependencies[ownPackageName]) {
      console.info(`Removing ${chalk.cyan(ownPackageName)} from dependencies`);
      delete appPackage.dependencies[ownPackageName];
    }
  }

  Object.keys(ownPackage.dependencies).forEach((key) => {
    if (["prompts"].includes(key)) {
      return;
    }
    console.info(`Adding ${chalk.cyan(key)} to dependencies`);
    if (!appPackage.devDependencies) {
      appPackage.devDependencies = {};
    }
    appPackage.devDependencies[key] = ownPackage.dependencies[key];
  });

  // Sort the devDependencies.
  const unsortedDevDependencies = appPackage.devDependencies;
  appPackage.devDependencies = {};
  Object.keys(unsortedDevDependencies)
    .sort()
    .forEach((key) => (appPackage.devDependencies[key] = unsortedDevDependencies[key]));

  console.info(chalk.cyan("Updating the scripts"));

  delete appPackage.scripts["eject"];

  ["dev", "build"].forEach((key) => {
    const binKey = "rs";
    const regex = new RegExp(binKey + " (\\w+)", "g");
    if (regex.test(appPackage.scripts[key])) {
      appPackage.scripts[key] = appPackage.scripts[key].replace(regex, "node scripts/$1.js");

      console.info(`Replacing ${chalk.cyan(`"${binKey} ${key}"`)} with ${chalk.cyan(`"node scripts/${key}.js"`)}`);

      fs.removeSync(path.join(appDirectory, "node_modules", ".bin", binKey));
      fs.removeSync(path.join(appDirectory, "node_modules", "reaux-scripts"));
    }
  });

  fs.writeFileSync(path.join(appDirectory, "package.json"), JSON.stringify(appPackage, null, 2) + os.EOL);

  if (fs.existsSync(resolveApp("yarn.lock"))) {
    console.info(chalk.cyan("Running yarn..."));
    tryYarn();
  } else {
    console.info(chalk.cyan("Running npm install..."));
    tryNpm()
  }

  console.info(chalk.green("Ejected successfully!"));

  if (tryGitAdd(appDirectory)) {
    console.info(chalk.cyan("Staged ejected files for commit."));
  }
});
