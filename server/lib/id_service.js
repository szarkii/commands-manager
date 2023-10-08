const crypto = require("crypto");

class IdService {
    generateUniqueId(basename, otherIds) {
        const maxAttempts = 100;
        let escapedBasename = deleteIllegalUriCharacters(basename).toLowerCase();
        let idToTest = escapedBasename;

        for (let i = 0; i < maxAttempts; i++) {
            if (!otherIds.includes(idToTest)) {
                return idToTest;
            }

            idToTest = escapedBasename + "-" + this.generateRandomId();
        }

        throw new Error("Cannot create an unique identifier. Tried " + maxAttempts + " times.");
    }

    generateRandomId(limitCharacters = 6) {
        return crypto.randomUUID().replace(/-.*/, "").substring(0, limitCharacters);
    }
}

function deleteIllegalUriCharacters(value) {
    return value.replace(/[^a-zA-Z0-9-_]/g, "");
}

module.exports = IdService;