const fs = require('fs-extra');
const path = require('path');
const prompts = require('prompts');
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const {appDirectory} = require('../config/paths');
const {spawn} = require("../lib")

const files = [
    'config/paths.js',
    'config/webpack.config.dev.js',
    'config/webpack.config.prod.js',
    'scripts/build.js',
    'scripts/start.js',
  ];

function getGitStatus() {
    try {
      let stdout = execSync(`git status --porcelain`, {
        stdio: ['pipe', 'pipe', 'ignore'],
      }).toString();
      return stdout.trim();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

function tryGitAdd(appPath) {
    try {
        spawn('git', ['add', path.join(appPath, 'config'), path.join(appPath, 'scripts')]);
      return true;
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

function verifyAbsent(file) {
    if (fs.existsSync(path.join(appDirectory, file))) {
        console.error(chalk.red(`file '${file}' already exists in your app folder. We cannot continue as you would lose all the changes in that file or directory. Please move or delete it (maybe make a copy for backup) and run this command again.`));
        process.exit(1);
    }
}

prompts({
    type: 'confirm',
    name: 'shouldEject',
    message: 'Are you sure you want to eject? This action is permanent.',
    initial: false,
}).then(answer => {
    if (!answer.shouldEject) {
        console.info(chalk.cyan('Close call! Eject operation canceled.'));
        return;
    }

    const gitStatus = getGitStatus();
    if (gitStatus) {
        console.error(`
${chalk.red('This git repository has untracked files or uncommitted changes:')}
${gitStatus
.split('\n')
.map(line => line.match(/ .*/g)[0].trim())
.join('\n')}
${chalk.red('Remove untracked files, stash or commit any changes, and try again.')}`);
        process.exit(1);
    }

    console.info('Ejecting...');

    files.forEach(verifyAbsent);

    console.info(chalk.cyan(`Copying files into ${appDirectory}`));

    files.forEach(file => {
        fs.createFileSync(path.join(appDirectory, file));
        const content = fs.readFileSync("config/paths.js", 'utf8');
        console.info(`Adding ${chalk.cyan(file)} to the project`);
        fs.writeFileSync(file, content);
    });


    console.info(chalk.green('Ejected successfully!'));

    if (tryGitAdd(appPath)) {
        console.info(chalk.cyan('Staged ejected files for commit.'));
      }
})
