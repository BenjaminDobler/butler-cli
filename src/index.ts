#! /usr/bin/env node


import * as commander from 'commander';
import {ButlerConfig} from './config';
import {Cli} from './cli';
import {ElectronAddon} from './electron';

class Butler {

    private config: ButlerConfig = new ButlerConfig();
    private cli: Cli = new Cli();
    private electronAddon: ElectronAddon = new ElectronAddon();

    constructor() {

        console.log('Butler says: "I`m your butler! Happy to serve you!"');
        console.log('===================================');

        commander
            .version('1.0.1')
            .option('-m, mode [name]', 'Change mode (cli or seed)')
            .option('-m, new [name]', 'Create a new project')
            .option('-m, add [name]', 'Add an addon')
            .option('-m, serve [name]', 'Serve the app')
            .parse(process.argv);


        if (commander.mode) this.setMode();
        if (commander.new) this.initProject();
        if (commander.add) this.addAddon();
        if (commander.serve) this.serveApp();


        console.log("Args ", commander.args);
    }

    private setMode() {
        this.config.data.mode = commander.mode[0];
        this.config.writeConfig();
    }

    private initProject() {
        console.log('Butler says: "Let`s create a angular project! Should be fun!"');
        this.cli.initProject(commander.new[0]);
    }

    private addAddon() {
        this.electronAddon.add();
    }

    private serveApp() {
        this.cli.startCli()
            .then((cliProcess)=>{
                return this.electronAddon.electronWatch();
            })


        //this.electronAddon.electronWatch();
    }

    public cleanup() {
        this.cli.cleanup();
    }


}


let butler = new Butler();


var cleanExit = function() { process.exit() };
process.on('SIGINT', cleanExit); // catch ctrl-c
process.on('SIGTERM', cleanExit); // catch kill

process.on('exit', function() {
    butler.cleanup();
});