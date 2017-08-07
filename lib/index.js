#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander = require("commander");
var config_1 = require("./config");
var cli_1 = require("./cli");
var Butler = (function () {
    function Butler() {
        this.config = new config_1.ButlerConfig();
        this.cli = new cli_1.Cli();
        console.log('Butler started - mode = ' + this.config.data.mode);
        commander
            .version('1.0.1')
            .option('-p, --peppers', 'Add peppers')
            .option('-P, --pineapple', 'Add pineapple')
            .option('-m, --mode [name]', 'Add pineapple')
            .option('-m, --new [name]', 'Add pineapple')
            .parse(process.argv);
        if (commander.peppers)
            console.log('  - peppers');
        if (commander.pineapple)
            console.log('  - pineapple');
        if (commander.bbqSauce)
            console.log('  - bbq');
        if (commander.mode)
            this.setMode();
        if (commander.new)
            this.initProject();
    }
    Butler.prototype.setMode = function () {
        this.config.data.mode = commander.mode[0];
        this.config.writeConfig();
    };
    Butler.prototype.initProject = function () {
        this.cli.initProject(commander.new[0]);
    };
    return Butler;
}());
new Butler();
