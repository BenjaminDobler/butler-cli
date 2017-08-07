



import {ChildProcess, spawn} from 'child_process';

export class Cli {


    initProject(projectName:string) {
        return new Promise((resolve, reject)=>{
            var ls:ChildProcess = spawn('ng', ['new', projectName]);
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


}