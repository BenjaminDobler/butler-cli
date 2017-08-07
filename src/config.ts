



import {readFileSync, writeFileSync} from 'fs';

export class ButlerConfig {



    public data:any = {};

    constructor() {
        this.readConfig();
    }

    public writeConfig() {
        writeFileSync('./butler.config.json', JSON.stringify(this.data));
    }

    private readConfig() {
        try {
            var configString = readFileSync('./butler.config.json', 'utf8')
            if (configString) {
                this.data = JSON.parse(configString);
            }
        } catch (e) {
            this.data = {
                mode: 'cli'
            }
        }
    }


}