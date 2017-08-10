import * as path from 'path';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import {spawn} from 'child_process';
import * as process from 'process';
import * as npm from 'npm';
import * as electronBuilder from 'electron-builder';


export class ElectronAddon {


    public add() {
        this.addElectronAddon();
        this.addElectronPackage();
        this.installPackages();
    }

    public addElectronAddon() {
        console.log('adding electron.main.live.js');
        var targetDir = './electron';
        if (!existsSync(targetDir)) {
            mkdirSync(targetDir);
        }
        let sourcePath = path.join(__dirname, '..', 'resources', 'electron', 'electron.main.live.js');
        let targetPath = path.join(targetDir, 'electron.main.live.js');
        let template = readFileSync(sourcePath, 'utf-8');
        writeFileSync(targetPath, template);

        sourcePath = path.join(__dirname, '..', 'resources', 'electron', 'electron.main.js');
        targetPath = path.join(targetDir, 'electron.main.js');
        template = readFileSync(sourcePath, 'utf-8');
        writeFileSync(targetPath, template);

        this.updatePackageJson();
    }

    public addElectronPackage() {
        console.log('adding electron package.json');
        var targetDir = './electron';
        if (!existsSync(targetDir)) {
            mkdirSync(targetDir);
        }
        let sourcePath = path.join(__dirname, '..', 'resources', 'electron', 'package.json');
        let targetPath = path.join(targetDir, 'package.json');
        let template = readFileSync(sourcePath, 'utf-8');
        writeFileSync(targetPath, template);
    }

    private installPackages() {
        console.log('installing required packages');
        this.npmInstall(['electron', '@types/node', '@types/electron'], true)
            .then(() => {
                console.log('Finished installing electron packages')
            }, () => {
                console.log('Error installing required electrin packages');

                process.exit(1);
            });
    }

    private npmInstall(packages: string[], dev: boolean): Promise<void> {
        console.log('running npm install');
        let options = dev ? {'save-dev': true} : {'save': true};
        return new Promise<void>((resolve, reject) => {
            npm.load(options, (error) => {
                npm.commands.install(packages, (error, data) => {
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
    }


    public electronWatch(): Promise<void> {
        console.log('::::: Electron Watch');
        var nodeModulesPath = process.cwd.toString() + '/electron/src/node_modules';
        return new Promise((resolve, reject) => {
            let isMac = /^darwin/.test(process.platform);
            let ls;
            if (isMac) {
                ls = spawn('./node_modules/.bin/electron', ['electron/electron.main.live.js', '-port', 4200 + '', '-nodeModules', nodeModulesPath]);
            } else {
                ls = spawn('node_modules/electron/dist/electron', ['electron/electron.main.live.js', '-port', 4200 + '', '-nodeModules', nodeModulesPath]);
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

    }


    public build() {
        this.copyElectronMain();
        this.changeBasePath();
        this.runElectronPacker();
    }

    public copyElectronMain() {
        let sourcePath = path.join('.', 'electron', 'electron.main.js');
        let targetPath = path.join('.', 'dist', 'electron.js');
        let template = readFileSync(sourcePath, 'utf-8');
        writeFileSync(targetPath, template);
    }


    public changeBasePath() {
        let indexHtmlPath = path.join('dist', 'index.html');
        let indexHtml = readFileSync(indexHtmlPath, 'utf-8');
        let updatedIndexHtml = indexHtml.replace('<base href="/">', '<base href="./">');
        writeFileSync(indexHtmlPath, updatedIndexHtml);
        console.log('finished preparing index.html');
    }


    public runElectronPacker() {
        console.log('running electron-builder build');
        let targets = undefined;
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

            let result = electronBuilder.build({targets: targets});
            console.log('finished electron-builder build');
            return result;
        }
        catch (error) {
            console.log('electron-builder build failed');
            console.log(error);
            process.exit(1);
        }

    }


    private readPackageJson() {
        console.log('reading Package.json');
        let string = readFileSync('package.json', 'utf-8');
        console.log('finished reading package.json');
        return JSON.parse(string);
    }

    private writePackageJson(packageJson: any) {
        console.log('updating package.json');
        writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
        console.log('finished updating package.json');
    }


    public updatePackageJson() {
        let packageJson: any = this.readPackageJson();
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
    }

}