"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var ButlerConfig = (function () {
    function ButlerConfig() {
        this.data = {};
        this.readConfig();
    }
    ButlerConfig.prototype.writeConfig = function () {
        fs_1.writeFileSync('./butler.config.json', JSON.stringify(this.data));
    };
    ButlerConfig.prototype.readConfig = function () {
        try {
            var configString = fs_1.readFileSync('./butler.config.json', 'utf8');
            if (configString) {
                this.data = JSON.parse(configString);
            }
        }
        catch (e) {
            this.data = {
                mode: 'cli'
            };
        }
    };
    return ButlerConfig;
}());
exports.ButlerConfig = ButlerConfig;
