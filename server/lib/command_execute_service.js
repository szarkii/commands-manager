const { exec, spawn } = require("child_process");

class CommandExecuteService {
    constructor(scriptsDir, logger) {
        this.scriptsDir = scriptsDir;
        this.logger = logger;
    }

    async executeSync(commandId) {
        const scriptPath = `${this.scriptsDir}/${commandId}.sh`;

        return new Promise((resolve) => {
            exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
                if (error) {
                    this.logger.error("Command error occurred, output:\n" + error);
                } else {
                    this.logger.info("Command finished, output:\n" + stdout);
                    resolve(stdout);
                }
            });
        });
    }

    executeAsync(commandId) {
        const scriptPath = `${this.scriptsDir}/${commandId}.sh`;
        return spawn("bash", [scriptPath]);
    }
};

module.exports = CommandExecuteService;