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


var homedir = require('os').homedir();
var projectName = ';'

var mode = 'seed';


var config = {
    mode: 'seed'
}

try {
    var configString = fs.readFileSync(homedir + '/.butlerrc', 'utf8')
    if (configString) {
        config = JSON.parse(configString);
    }
}catch(e) {

}


function saveConfig() {
    fs.writeFileSync(homedir + '/.butlerrc', JSON.stringify(config));
}


program
    .version('0.0.1')
    .option('-i, --init', 'Install angular seed')
    .option('-s, --start', 'Start App')
    .option('-a, --add [target]', 'Add target/kits')
    .option('-m, --mode [target]', 'Add target/kits')
    .parse(process.argv);


if (program.init) {
    log("Installing seed for you at " + cwd);
    projectName = program.init[0];
    if (config.mode === 'seed') {
        initSeed();
    } else if(config.mode === 'cli') {
        initCli();
    }
}


if (program.start) {
    console.log("::::: BUTLER says: 'Programm start ", program.start)
    if (program.start.length === 0) {
        start();
    } else if (program.start[0] === 'electron') {
        start()
            .then(electronWatch);
    }
}




function start() {
    if (config.mode === 'seed') {
        return startSeed()
    } else {
        return startCli();
    }
}

function startElectron() {

}








if (program.add) {
    console.log(program.add[0]);
    if (program.add[0] === 'electron-starter') {
        addElectronStarter();
    }

    if (program.add[0] === 'electron') {
        log('Add Electron');
        addElectron()
            .then(function () {
                addElectronDep().then(function () {
                    log("Electron added");
                });

            });
    }
}


if (program.mode) {
    console.log("Current Mode", config.mode);
    console.log('Mode ', program.mode);
    config.mode = program.mode[0];
    saveConfig();
}



function initSeed() {
    createProjectDir()
        .then(downloadSeed)
        .then(installSeedDependencies)
        .then(function () {
            log("All Done");
        });
}

function createProjectDir() {
    var deferred = Q.defer();
    fs.mkdirSync(process.cwd()+'/' + projectName, 0744);
    deferred.resolve();
    return deferred.promise;
}

function initCli() {
    setupCliProject()
        .then(changeToWs)
}

function changeToWs() {
    var deferred = Q.defer();
    process.chdir(process.cwd()+'/' + projectName);
    deferred.resolve();
    return deferred.promise;
}


function setupCliProject() {
    log("::::: Init CLI");
    var deferred = Q.defer();
    var ls = spawn('ng', ['new', projectName]);
    ls.stdout.on('data', function (data) {
        log('stdout: ' + data.toString(), true);
    });

    ls.stderr.on('data', function (data) {
        log('stderr: ' + data.toString(), true);
    });

    ls.on('exit', function (code) {
        log('child process exited with code ' + code.toString());
        deferred.resolve();
    });
    return deferred.promise;
}



function downloadSeed() {
    log("Download Seed");
    var deferred = Q.defer();
    download('github:mgechev/angular-seed', cwd.toString(), function (err) {
        if (err) return log("Error downloading!");
        deferred.resolve();
    });
    return deferred.promise;
}


function addElectronDep() {
    log("Install Seed Deps");
    var deferred = Q.defer();
    var ls = spawn('npm', ['install', 'electron', '-g']);
    ls.stdout.on('data', function (data) {
        log('stdout: ' + data.toString(), true);
    });

    ls.stderr.on('data', function (data) {
        log('stderr: ' + data.toString(), true);
    });

    ls.on('exit', function (code) {
        log('child process exited with code ' + code.toString(), true);
        deferred.resolve();
    });
    return deferred.promise;
}


function addElectron() {
    log("Download Electron");
    var deferred = Q.defer();
    download('github:BenjaminDobler/angular-seed-electron-addon', cwd.toString(), function (err) {
        if (err) return log("Error downloading electron!");
        deferred.resolve();
    });
    return deferred.promise;

}

function installSeedDependencies() {
    log("::::: Install Seed Deps");
    var deferred = Q.defer();
    var ls = spawn('npm', ['install', '--cache-min 999999999']);
    ls.stdout.on('data', function (data) {
        log('stdout: ' + data.toString(), true);
    });

    ls.stderr.on('data', function (data) {
        log('stderr: ' + data.toString(), true);
    });

    ls.on('exit', function (code) {
        log('child process exited with code ' + code.toString());
        deferred.resolve();
    });
    return deferred.promise;
}


function startSeed() {
    console.log("::::: Start Seed");
    var deferred = Q.defer();
    var ls = spawn('npm', ['run', 'start']);
    ls.stdout.on('data', function (data) {
        log('stdout: ' + data.toString(), true);
        if (data.toString().indexOf('Serving files from') != -1) {
            deferred.resolve();
        }
    });

    ls.stderr.on('data', function (data) {
        log('stderr: ' + data.toString());
    });


    ls.on('exit', function (code) {
        log('child process exited with code ' + code.toString());

    });
    return deferred.promise;
}


function startCli() {
    console.log("::::: Start Seed");
    var deferred = Q.defer();
    var ls = spawn('ng', ['serve']);
    ls.stdout.on('data', function (data) {
        log('stdout: ' + data.toString(), true);
        if (data.toString().indexOf('Serving files from') != -1) {
            deferred.resolve();
        }
    });

    ls.stderr.on('data', function (data) {
        log('stderr: ' + data.toString());
    });


    ls.on('exit', function (code) {
        log('child process exited with code ' + code.toString());

    });
    return deferred.promise;
}


function electronWatch() {
    console.log("::::: Start Seed");
    var deferred = Q.defer();
    var ls = spawn('electron', ['electron/src/electron.main.live.js']);
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


function addElectronStarter() {
    //angular-seed-electron-starter
    var deferred = Q.defer();


    download('github:BenjaminDobler/angular-seed-electron-starter', cwd.toString() + '/tmp', function (err) {
        if (err) return log("Error downloading electron!");


        var source = cwd.toString() + '/tmp/src/client';
        var destination = cwd.toString() + '/src/client';
        fs.copy(source, destination, {overwrite: true}, function (err) {
            if (err) return console.error(err)
            log("Success!")
        });


        deferred.resolve();
    });
    return deferred.promise;
}


function addCordova() {
    // detect if we`re in a seed directory

    // detect if cordova is installed


}


function log(message, rep) {
    if (!rep) {
        console.log(":::: BUTLER says '" + message + "'");
    } else {
        printProgress(message);
    }
}


function printProgress(progress) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(progress + '%');
}




