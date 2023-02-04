const crypto = require('crypto');

class ApiAuthenticationService {
    constructor(token) {
        this.token = token;
    }

    validateToken() {
        if (!this.token || this.token === "") {
            throw new Error("API token has not been configured.");
        }
    }

    isAuthenticated(requestContent, signature) {
        const actualSignature = crypto.createHmac("sha1", this.token).update(requestContent.toString()).digest("hex");
        return signature.replace(/^sha1=/, "") === actualSignature;
    }
};

module.exports = ApiAuthenticationService;