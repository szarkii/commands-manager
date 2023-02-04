const fs = require("fs");
const _ = require("./lodash");

const DEFAULT_CONFIGURATION_FILE_PATH = __dirname + "/../server.conf";

const DEFAULT_CONFIGURATION = {
    "api": {
        "enabled": true,
        "port": 8080,
        "token": null
    },
    "gui": {
        "enabled": true,
        "port": 8080
    }
};

function createConfigurationFile(configurationFilePath) {
    fs.writeFileSync(configurationFilePath, JSON.stringify(DEFAULT_CONFIGURATION));
}

class ConfigurationService {
    constructor(configurationFilePath) {
        this.configurationFilePath = configurationFilePath || DEFAULT_CONFIGURATION_FILE_PATH;
    }

    getConfiguration() {
        if (!fs.existsSync(this.configurationFilePath)) {
            createConfigurationFile(this.configurationFilePath);
            return DEFAULT_CONFIGURATION;
        }

        const customConfiguration = JSON.parse(fs.readFileSync(this.configurationFilePath, 'utf-8'));
        return _.merge(DEFAULT_CONFIGURATION, customConfiguration);
    }
};

module.exports = ConfigurationService;