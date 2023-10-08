const fs = require("fs");
const IdService = require("./id_service");

const COMMANDS_CONF_FILE = __dirname + "/../conf/commands.conf";

class CommandsService {
    constructor() {
        this.idService = new IdService();
    }

    getAllCommandsBasicInfo() {
        const commandsConfiguration = getCommandsConfiguration();
        
        return (commandsConfiguration.commands || [])
            .map(command => ({ id: command.id, name: command.name, groupId: command.groupId }));
    }

    addCommand(commandData) {
        const commandsConfiguration = getCommandsConfiguration();
        const id = this.idService.generateUniqueId(
            commandData.name,
            commandsConfiguration.commands.map(command => command.id)
        );
        const command = {
            id,
            name: commandData.name,
            script: commandData.script,
            groupId: commandData.groupId
        };

        commandsConfiguration.commands.push(command);
        saveCommandsConfiguration(commandsConfiguration);
    }
}

function getCommandsConfiguration() {
    return JSON.parse(fs.readFileSync(COMMANDS_CONF_FILE, 'utf-8'));
}

function saveCommandsConfiguration(configuration) {
    fs.writeFileSync(COMMANDS_CONF_FILE, JSON.stringify(configuration), 'utf-8');
}

module.exports = CommandsService;