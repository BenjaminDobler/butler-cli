import * as path from 'path';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import {spawn} from 'child_process';
import * as process from 'process';
import * as npm from 'npm';


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


    public electronWatch(): Promise<void>  {
        console.log("::::: Electron Watch");
        var nodeModulesPath = process.cwd.toString() + '/electron/src/node_modules';
        return new Promise((resolve, reject)=>{
            let isMac = /^darwin/.test(process.platform);
            let ls;
            if (isMac) {
                ls = spawn('./node_modules/.bin/electron', ['electron/electron.main.live.js', '-port', 4200 + '', '-nodeModules', nodeModulesPath]);
            } else {
                ls = spawn('node_modules/electron/dist/electron', ['electron/electron.main.live.js', '-port', 4200+'', '-nodeModules', nodeModulesPath]);
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


    /*
    public electronWatch() {
        console.log("::::: Electron Watch");
        var nodeModulesPath = cwd.toString() + '/electron/src/node_modules';
        var deferred = Q.defer();
        var ls = spawn('electron', ['electron/src/electron.main.live.js', '-port', 4200, '-nodeModules', nodeModulesPath]);
        ls.stdout.on('data', function (data) {
            log(data.toString(), true);
        });

        ls.stderr.on('data', function (data) {
            log(data.toString(), true);
        });


        ls.on('exit', function (code) {
            log('child process exited with code ' + code.toString());

        });
        return deferred.promise;
    }
    */


}