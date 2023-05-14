const fs = require("fs");
const _ = require("./lodash");
const crypto = require("crypto");

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

function getGroupsConfiguration() {
    return JSON.parse(fs.readFileSync(GROUPS_CONF_FILE, 'utf-8'));
}

function saveGroupsConfiguration(configuration) {
    fs.writeFileSync(GROUPS_CONF_FILE, JSON.stringify(configuration), 'utf-8');
}

function generateGroupId(allGroups, groupName) {
    const idsToCheck = [
        deleteIllegalUriCharacters(groupName),
        ...generateRandomGroupIds(100)
    ];
    const existingIds = allGroups.map(group => group.id);
    const newId = _.difference(idsToCheck, existingIds)[0];

    if (!newId) {
        throw new Error("Cannot create group ID.");
    }

    return newId;
}

function deleteIllegalUriCharacters(value) {
    return value.replace(/[^a-zA-Z0-9-_]/g, "");
}

/** 8 characters random numbers, e.g.: 47e23295 */
function generateRandomGroupIds(idsNumber) {
    return Array(idsNumber)
        .fill(0)
        .map(() => crypto.randomUUID().replace(/-.*/, ""));
}

class GroupsService {
    constructor(commandsService) {
        this.commandsService = commandsService;
    }

    getAllGroups() {
        return getGroupsConfiguration().groups;
    }

    getAllGroupsTree() {
        const groupsConfiguration = getGroupsConfiguration();
        const allCommands = this.commandsService.getAllCommandsBasicInfo();
        return buildTreeFromArray(groupsConfiguration.groups, allCommands);
    }

    addGroup(groupData) {
        const groupsConfiguration = getGroupsConfiguration();
        const group = {
            id: generateGroupId(groupsConfiguration.groups, groupData.name),
            parentId: groupData.parentId,
            name: groupData.name
        }
        groupsConfiguration.groups.push(group);
        saveGroupsConfiguration(groupsConfiguration);
    }

    editGroup(groupData) {
        const groupsConfiguration = getGroupsConfiguration();
        const index = _.findIndex(groupsConfiguration.groups, (group) => group.id === groupData.id);
        if (index >= 0) {
            groupsConfiguration.groups[index] = groupData;
            saveGroupsConfiguration(groupsConfiguration);
        }
    }
};

module.exports = GroupsService;