#! /usr/bin/env node
console.log("I` your butler. Happy to serve you!")

var program = require('commander');
var sh = require("shelljs");
var cwd = sh.pwd();
var download = require('download-git-repo');
const fs = require('fs-extra');

var Q = require('q');

var util = require('util'),
    spawn = require('child_process').spawn;


program
    .version('0.0.1')
    .option('-i, --install', 'Install angular seed')
    .option('-s, --start', 'Start App')
    .option('-a, --add [target]', 'Add target/kits')
    .parse(process.argv);


if (program.install) {
    console.log(":::: Install shift to " + cwd);

    downloadSeed()
        .then(installSeedDependencies)
        .then(function () {
            console.log("::::: All Done");
        });
}


if (program.start) {
    console.log("Programm start ", program.start)
    if (program.start.length === 0) {
        start().then(function () {
            console.log("Started");
        })
    } else if (program.start[0] === 'electron') {
        start().then(function () {
            electronWatch();
        });
    }
}


if (program.add) {
    console.log(program.add[0]);
    if (program.add[0] === 'electron-starter') {
        addElectronStarter();
    }

    if (program.add[0] === 'electron') {
        console.log(':::::: Add Electron ');
        addElectron()
            .then(function () {
                addElectronDep().then(function () {
                    console.log("Electron added");
                });

            });
    }
}


function downloadSeed() {
    console.log("::::: Download Seed");
    var deferred = Q.defer();
    download('github:mgechev/angular-seed', cwd.toString(), function (err) {
        if (err) return console.log("Error downloading!");
        deferred.resolve();
    });
    return deferred.promise;
}


function addElectronDep() {
    console.log("::::: Install Seed Deps");
    var deferred = Q.defer();
    var ls = spawn('npm', ['install', 'electron', '--save', 'dev']);
    ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data.toString());
    });

    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString());
    });

    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code.toString());
        deferred.resolve();
    });
    return deferred.promise;
}


function addElectron() {
    console.log("::::: Download Electron");
    var deferred = Q.defer();
    download('github:BenjaminDobler/angular-seed-electron-addon', cwd.toString(), function (err) {
        if (err) return console.log("Error downloading electron!");
        deferred.resolve();
    });
    return deferred.promise;

}

function installSeedDependencies() {
    console.log("::::: Install Seed Deps");
    var deferred = Q.defer();
    var ls = spawn('npm', ['install']);
    ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data.toString());
    });

    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString());
    });

    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code.toString());
        deferred.resolve();
    });
    return deferred.promise;
}


function start() {
    console.log("::::: Start Seed");
    var deferred = Q.defer();
    var ls = spawn('npm', ['run', 'start']);
    ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data.toString());
        if (data.toString().indexOf('Serving files from') != -1) {
            deferred.resolve();
        }
    });

    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString());
    });


    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code.toString());

    });
    return deferred.promise;
}


function electronWatch() {
    console.log("::::: Start Seed");
    var deferred = Q.defer();
    var ls = spawn('electron', ['electron/src/electron.main.live.js']);
    ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data.toString());
    });

    ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString());
    });


    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code.toString());

    });
    return deferred.promise;

}


function addElectronStarter() {
    //angular-seed-electron-starter
    var deferred = Q.defer();


    download('github:BenjaminDobler/angular-seed-electron-starter', cwd.toString() + '/tmp', function (err) {
        if (err) return console.log("Error downloading electron!");


        var source = cwd.toString() + '/tmp/src/client';
        var destination = cwd.toString() + '/src/client';
        fs.copy(source, destination, {overwrite: true}, function (err) {
            if (err) return console.error(err)
            console.log("success!")
        });


        deferred.resolve();
    });
    return deferred.promise;
}


function addCordova() {
    // detect if we`re in a seed directory

    // detect if cordova is installed


}




