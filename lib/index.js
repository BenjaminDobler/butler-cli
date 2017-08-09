#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander = require("commander");
var config_1 = require("./config");
var cli_1 = require("./cli");
var electron_1 = require("./electron");
var Butler = (function () {
    function Butler() {
        this.config = new config_1.ButlerConfig();
        this.cli = new cli_1.Cli();
        this.electronAddon = new electron_1.ElectronAddon();
        console.log('Butler says: "I`m your butler! Happy to serve you!"');
        console.log('===================================');
        commander
            .version('1.0.1')
            .option('-m, mode [name]', 'Change mode (cli or seed)')
            .option('-m, new [name]', 'Create a new project')
            .option('-m, add [name]', 'Add an addon')
            .option('-m, serve [name]', 'Serve the app')
            .parse(process.argv);
        if (commander.mode)
            this.setMode();
        if (commander.new)
            this.initProject();
        if (commander.add)
            this.addAddon();
        if (commander.serve)
            this.serveApp();
        console.log("Args ", commander.args);
    }
    Butler.prototype.setMode = function () {
        this.config.data.mode = commander.mode[0];
        this.config.writeConfig();
    };
    Butler.prototype.initProject = function () {
        console.log('Butler says: "Let`s create a angular project! Should be fun!"');
        this.cli.initProject(commander.new[0]);
    };
    Butler.prototype.addAddon = function () {
        this.electronAddon.add();
    };
    Butler.prototype.serveApp = function () {
        var _this = this;
        this.cli.startCli()
            .then(function (cliProcess) {
            return _this.electronAddon.electronWatch();
        });
        //this.electronAddon.electronWatch();
    };
    Butler.prototype.cleanup = function () {
        this.cli.cleanup();
    };
    return Butler;
}());
var butler = new Butler();
var cleanExit = function () { process.exit(); };
process.on('SIGINT', cleanExit); // catch ctrl-c
process.on('SIGTERM', cleanExit); // catch kill
process.on('exit', function () {
    butler.cleanup();
});
