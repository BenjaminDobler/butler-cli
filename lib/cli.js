"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var Cli = (function () {
    function Cli() {
    }
    Cli.prototype.initProject = function (projectName) {
        return new Promise(function (resolve, reject) {
            var ls = child_process_1.spawn('ng', ['new', projectName], { shell: true });
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
    };
    Cli.prototype.startCli = function () {
        var _this = this;
        console.log('::::: Start CLI');
        return new Promise(function (resolve, reject) {
            _this.cliProcess = child_process_1.spawn('ng', ['serve'], { shell: true });
            _this.cliProcess.stdout.on('data', function (data) {
                console.log('cli stdout: ' + data.toString(), true);
                if (data.toString().indexOf('Compiled successfully') != -1) {
                    resolve(this.cliProcess);
                }
            });
            _this.cliProcess.stderr.on('data', function (data) {
                console.log('stderr: ' + data.toString());
            });
            _this.cliProcess.on('exit', function (code) {
                console.log('child process exited with code ' + code.toString());
            });
        });
    };
    Cli.prototype.cleanup = function () {
        console.log('Cleanup cli');
        if (this.cliProcess) {
            this.cliProcess.kill();
        }
    };
    return Cli;
}());
exports.Cli = Cli;
