const fs = require("fs");

const GROUPS_CONF_FILE = __dirname + "/../conf/groups.conf";

function buildTreeFromArray(groups, parent, tree) {
    tree = typeof tree !== 'undefined' ? tree : [];
    parent = typeof parent !== 'undefined' ? parent : { id: undefined };

    var subgroups = groups.filter((group) => group.parentId == parent.id);

    if (subgroups.length) {
        if (parent.id == undefined) {
            tree = subgroups;
        } else {
            parent['subgroups'] = subgroups
        }
        subgroups.forEach((subgroup) => buildTreeFromArray(groups, subgroup));
    }

    return tree;
}

class GroupsService {
    getAllGroups() {
        const groupsConfiguration = JSON.parse(fs.readFileSync(GROUPS_CONF_FILE,'utf-8'));
        console.log(groupsConfiguration);
        return buildTreeFromArray(groupsConfiguration.groups);
    }
};

module.exports = GroupsService;