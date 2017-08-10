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
        console.log('===================================================');

        commander
            .version('1.0.1')
            .option('-m, mode [name]', 'Change mode (cli or seed)')
            .option('-n, new [name]', 'Create a new project')
            .option('-a, add [name]', 'Add an addon')
            .option('-s, serve [name]', 'Serve the app')
            .option('-b, build [name]', 'Build the app')
            .parse(process.argv);


        if (commander.mode) this.setMode();
        if (commander.new) this.initProject();
        if (commander.add) this.addAddon();
        if (commander.serve) this.serveApp();
        if (commander.build) this.buildApp();

    }

    private setMode() {
        console.log('Mode = ', commander.mode);
        this.config.data.mode = commander.mode;
        this.config.writeConfig();
    }

    private initProject() {
        console.log('Butler says: "Let`s create an angular project! Should be fun!"');
        console.log('Project Name = ', commander.new);
        this.cli.new(commander.new).then(()=>{
            process.chdir(process.cwd() + '/' + commander.new);
        });
    }

    private addAddon() {
        this.electronAddon.add();
    }

    private serveApp() {
        this.cli.serve()
            .then((cliProcess) => {
                if (commander.serve === 'electron') {
                    return this.electronAddon.electronWatch();
                }
            })
    }

    private buildApp() {
        console.log('Build!');
        this.cli.build().then(() => {
            console.log('CLI Budone');
            if (commander.build === 'electron') {
                this.electronAddon.build();
            }
        });
    }

    public cleanup() {
        this.cli.cleanup();
    }

}


let butler = new Butler();


var cleanExit = function () {
    process.exit()
};
process.on('SIGINT', cleanExit); // catch ctrl-c
process.on('SIGTERM', cleanExit); // catch kill

process.on('exit', function () {
    butler.cleanup();
});