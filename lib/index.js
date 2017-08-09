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
        console.log('===================================================');
        commander
            .version('1.0.1')
            .option('-m, mode [name]', 'Change mode (cli or seed)')
            .option('-n, new [name]', 'Create a new project')
            .option('-a, add [name]', 'Add an addon')
            .option('-s, serve [name]', 'Serve the app')
            .option('-b, build [name]', 'Build the app')
            .parse(process.argv);
        if (commander.mode)
            this.setMode();
        if (commander.new)
            this.initProject();
        if (commander.add)
            this.addAddon();
        if (commander.serve)
            this.serveApp();
        if (commander.build)
            this.buildApp();
    }
    Butler.prototype.setMode = function () {
        console.log('Mode = ', commander.mode);
        this.config.data.mode = commander.mode;
        this.config.writeConfig();
    };
    Butler.prototype.initProject = function () {
        console.log('Butler says: "Let`s create an angular project! Should be fun!"');
        console.log('Project Name = ', commander.new);
        this.cli.new(commander.new).then(function () {
            process.chdir(process.cwd() + '/' + commander.new);
        });
    };
    Butler.prototype.addAddon = function () {
        this.electronAddon.add();
    };
    Butler.prototype.serveApp = function () {
        var _this = this;
        this.cli.serve()
            .then(function (cliProcess) {
            if (commander.serve === 'electron') {
                return _this.electronAddon.electronWatch();
            }
        });
    };
    Butler.prototype.buildApp = function () {
        var _this = this;
        console.log('Build!');
        this.cli.build().then(function () {
            console.log('CLI Budone');
            if (commander.build === 'electron') {
                _this.electronAddon.build();
            }
        });
    };
    Butler.prototype.cleanup = function () {
        this.cli.cleanup();
    };
    return Butler;
}());
var butler = new Butler();
var cleanExit = function () {
    process.exit();
};
process.on('SIGINT', cleanExit); // catch ctrl-c
process.on('SIGTERM', cleanExit); // catch kill
process.on('exit', function () {
    butler.cleanup();
});
