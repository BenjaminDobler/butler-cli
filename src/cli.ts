import {ChildProcess, spawn} from 'child_process';

export class Cli {

    public cliProcess: ChildProcess;

    initProject(projectName: string) {
        return new Promise((resolve, reject) => {
            var ls: ChildProcess = spawn('ng', ['new', projectName], { shell: true });
            ls.stdout.on('data', function (data) {
                console.log('stdout: ' + data.toString(), true);
            });

            ls.stderr.on('data', function (data) {
                console.log('stderr: ' + data.toString(), true);
            });

            ls.on('exit', function (code) {
                console.log('child process exited with code ' + code.toString());
                resolve();
            });
        });

    }


    public startCli(): Promise<ChildProcess> {
        console.log('::::: Start CLI');
        return new Promise((resolve, reject) => {
            this.cliProcess = spawn('ng', ['serve'],{ shell: true });
            this.cliProcess.stdout.on('data', function (data) {
                console.log('cli stdout: ' + data.toString(), true);
                if (data.toString().indexOf('Compiled successfully') != -1) {
                    resolve(this.cliProcess);
                }
            });

            this.cliProcess.stderr.on('data', function (data) {
                console.log('stderr: ' + data.toString());
            });


            this.cliProcess.on('exit', function (code) {
                console.log('child process exited with code ' + code.toString());

            });
        });
    }

    cleanup() {
        console.log('Cleanup cli');
        if (this.cliProcess) {
            this.cliProcess.kill();
        }
    }


}