const fs = require("fs");

const GROUPS_CONF_FILE = __dirname + "/../conf/groups.conf";

function buildTreeFromArray(groups, commands, parent, tree) {
    tree = typeof tree !== 'undefined' ? tree : [];
    parent = typeof parent !== 'undefined' ? parent : { id: undefined };

    var subgroups = groups.filter((group) => group.parentId == parent.id);

    if (subgroups.length) {
        if (parent.id == undefined) {
            tree = subgroups;
        } else {
            parent['subgroups'] = subgroups
        }
        subgroups.forEach((subgroup) => {
            subgroup.commands = commands.filter(command => command.groupId === subgroup.id);
            buildTreeFromArray(groups, commands, subgroup)
        });
    }

    return tree;
}

class GroupsService {
    constructor(commandsService) {
        this.commandsService = commandsService;
    }

    getAllGroups() {
        const groupsConfiguration = JSON.parse(fs.readFileSync(GROUPS_CONF_FILE, 'utf-8'));
        const allCommands = this.commandsService.getAllCommandsBasicInfo();
        return buildTreeFromArray(groupsConfiguration.groups, allCommands);
    }
};

module.exports = GroupsService;