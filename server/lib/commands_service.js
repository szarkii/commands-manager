const fs = require("fs");

const COMMANDS_CONF_FILE = __dirname + "/../conf/commands.conf";

class CommandsService {
    getAllCommandsBasicInfo() {
        const commandsConfiguration = JSON.parse(fs.readFileSync(COMMANDS_CONF_FILE, 'utf-8'));
        
        return (commandsConfiguration.commands || [])
            .map(command => ({ id: command.id, name: command.name, groupId: command.groupId }));
    }
}

module.exports = CommandsService;