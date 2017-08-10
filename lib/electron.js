"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var process = require("process");
var npm = require("npm");
var electronBuilder = require("electron-builder");
var ElectronAddon = (function () {
    function ElectronAddon() {
    }
    ElectronAddon.prototype.add = function () {
        this.addElectronAddon();
        this.addElectronPackage();
        this.installPackages();
    };
    ElectronAddon.prototype.addElectronAddon = function () {
        console.log('adding electron.main.live.js');
        var targetDir = './electron';
        if (!fs_1.existsSync(targetDir)) {
            fs_1.mkdirSync(targetDir);
        }
        var sourcePath = path.join(__dirname, '..', 'resources', 'electron', 'electron.main.live.js');
        var targetPath = path.join(targetDir, 'electron.main.live.js');
        var template = fs_1.readFileSync(sourcePath, 'utf-8');
        fs_1.writeFileSync(targetPath, template);
        sourcePath = path.join(__dirname, '..', 'resources', 'electron', 'electron.main.js');
        targetPath = path.join(targetDir, 'electron.main.js');
        template = fs_1.readFileSync(sourcePath, 'utf-8');
        fs_1.writeFileSync(targetPath, template);
        this.updatePackageJson();
    };
    ElectronAddon.prototype.addElectronPackage = function () {
        console.log('adding electron package.json');
        var targetDir = './electron';
        if (!fs_1.existsSync(targetDir)) {
            fs_1.mkdirSync(targetDir);
        }
        var sourcePath = path.join(__dirname, '..', 'resources', 'electron', 'package.json');
        var targetPath = path.join(targetDir, 'package.json');
        var template = fs_1.readFileSync(sourcePath, 'utf-8');
        fs_1.writeFileSync(targetPath, template);
    };
    ElectronAddon.prototype.installPackages = function () {
        console.log('installing required packages');
        this.npmInstall(['electron', '@types/node', '@types/electron'], true)
            .then(function () {
            console.log('Finished installing electron packages');
        }, function () {
            console.log('Error installing required electrin packages');
            process.exit(1);
        });
    };
    ElectronAddon.prototype.npmInstall = function (packages, dev) {
        console.log('running npm install');
        var options = dev ? { 'save-dev': true } : { 'save': true };
        return new Promise(function (resolve, reject) {
            npm.load(options, function (error) {
                npm.commands.install(packages, function (error, data) {
                    if (error) {
                        //console.log(chalk.red('npm install failed'));
                        //console.log(chalk.red(`packages: ${packages.join(', ')}`));
                        //console.log(error);
                        process.exit(1);
                    }
                    else {
                        console.log('finished npm install');
                        resolve();
                    }
                });
            });
        });
    };
    ElectronAddon.prototype.electronWatch = function () {
        console.log('::::: Electron Watch');
        var nodeModulesPath = process.cwd.toString() + '/electron/src/node_modules';
        return new Promise(function (resolve, reject) {
            var isMac = /^darwin/.test(process.platform);
            var ls;
            if (isMac) {
                ls = child_process_1.spawn('./node_modules/.bin/electron', ['electron/electron.main.live.js', '-port', 4200 + '', '-nodeModules', nodeModulesPath]);
            }
            else {
                ls = child_process_1.spawn('node_modules/electron/dist/electron', ['electron/electron.main.live.js', '-port', 4200 + '', '-nodeModules', nodeModulesPath]);
            }
            ls.stdout.on('data', function (data) {
                console.log(data.toString(), true);
            });
            ls.stderr.on('data', function (data) {
                console.log(data.toString(), true);
            });
            ls.on('exit', function (code) {
                console.log('child process exited with code ' + code.toString());
            });
        });
    };
    ElectronAddon.prototype.build = function () {
        this.copyElectronMain();
        this.changeBasePath();
        this.runElectronPacker();
    };
    ElectronAddon.prototype.copyElectronMain = function () {
        var sourcePath = path.join('.', 'electron', 'electron.main.js');
        var targetPath = path.join('.', 'dist', 'electron.js');
        var template = fs_1.readFileSync(sourcePath, 'utf-8');
        fs_1.writeFileSync(targetPath, template);
    };
    ElectronAddon.prototype.changeBasePath = function () {
        var indexHtmlPath = path.join('dist', 'index.html');
        var indexHtml = fs_1.readFileSync(indexHtmlPath, 'utf-8');
        var updatedIndexHtml = indexHtml.replace('<base href="/">', '<base href="./">');
        fs_1.writeFileSync(indexHtmlPath, updatedIndexHtml);
        console.log('finished preparing index.html');
    };
    ElectronAddon.prototype.runElectronPacker = function () {
        console.log('running electron-builder build');
        var targets = undefined;
        try {
            if (process.argv.indexOf('-w') > -1) {
                targets = electronBuilder.Platform.WINDOWS.createTarget();
            }
            else if (process.argv.indexOf('-l') > -1) {
                targets = electronBuilder.Platform.LINUX.createTarget();
            }
            else if (process.argv.indexOf('-m') > -1) {
                targets = electronBuilder.Platform.MAC.createTarget();
            }
            targets = electronBuilder.Platform.MAC.createTarget('dir');
            var result = electronBuilder.build({ targets: targets });
            console.log('finished electron-builder build');
            return result;
        }
        catch (error) {
            console.log('electron-builder build failed');
            console.log(error);
            process.exit(1);
        }
    };
    ElectronAddon.prototype.readPackageJson = function () {
        console.log('reading Package.json');
        var string = fs_1.readFileSync('package.json', 'utf-8');
        console.log('finished reading package.json');
        return JSON.parse(string);
    };
    ElectronAddon.prototype.writePackageJson = function (packageJson) {
        console.log('updating package.json');
        fs_1.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
        console.log('finished updating package.json');
    };
    ElectronAddon.prototype.updatePackageJson = function () {
        var packageJson = this.readPackageJson();
        packageJson.main = './dist/electron.js';
        packageJson.build = {
            files: ['dist/**/*'],
            directories: {
                output: 'dist-packaged'
            }
        };
        if (!packageJson.hasOwnProperty('author')) {
            packageJson.author = 'Butler :-)';
        }
        if (!packageJson.hasOwnProperty('description')) {
            packageJson.description = 'Please provide a description';
        }
        this.writePackageJson(packageJson);
        console.log('finished preparing package.json');
    };
    return ElectronAddon;
}());
exports.ElectronAddon = ElectronAddon;
