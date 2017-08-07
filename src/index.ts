#! /usr/bin/env node


import * as commander from 'commander';
import {ButlerConfig} from './config';
import {Cli} from './cli';

class Butler {

    private config: ButlerConfig = new ButlerConfig();
    private cli:Cli = new Cli();

    constructor() {

        console.log('Butler started - mode = ' + this.config.data.mode);

        commander
            .version('1.0.1')
            .option('-p, --peppers', 'Add peppers')
            .option('-P, --pineapple', 'Add pineapple')
            .option('-m, --mode [name]', 'Add pineapple')
            .option('-m, --new [name]', 'Add pineapple')
            .parse(process.argv);

        if (commander.peppers) console.log('  - peppers');
        if (commander.pineapple) console.log('  - pineapple');
        if (commander.bbqSauce) console.log('  - bbq');
        if (commander.mode) this.setMode();
        if (commander.new) this.initProject();
    }

    private setMode() {
        this.config.data.mode = commander.mode[0];
        this.config.writeConfig();
    }

    private initProject() {
        this.cli.initProject(commander.new[0]);
    }





}


new Butler();