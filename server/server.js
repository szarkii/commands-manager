const http = require("http");
const fs = require("fs");

const Logger = require("./lib/logger.js");
const UserAuthenticationService = require("./lib/user_authentication_service.js");
const ApiAuthenticationService = require("./lib/api_authentication_service.js");
const GroupsService = require("./lib/groups_service.js");
const CommandExecuteService = require("./lib/command_execute_service.js");
const ConfigurationService = require("./lib/configuration_service");

const INDEX_PATH = __dirname + "/html/index.html";
const SCRIPTS_DIR_PATH = __dirname + "/scripts";

const SIGNATURE_HEADER = "x-hub-signature";

const Configuration = new ConfigurationService(process.argv[2]).getConfiguration();

const logger = new Logger();
const userAuthenticationService = new UserAuthenticationService();
const apiAuthenticationService = new ApiAuthenticationService(Configuration.api.token);
const groupsService = new GroupsService();
const commandExecuteService = new CommandExecuteService(SCRIPTS_DIR_PATH, logger);

async function getRequestContent(request) {
    return new Promise((resolve) => {
        let requestData = "";

        request.on("data", chunk => {
            console.log(chunk);
            requestData += chunk.toString();
        });

        request.on("end", () => {
            resolve(requestData);
        });
    });
}

const apiServer = async (request, response) => {
    const requestContent = await getRequestContent(request);
    const token = request.headers[SIGNATURE_HEADER];

    if (!apiAuthenticationService.isAuthenticated(requestContent, token)) {
        response.writeHead(401);
        response.end();
        return;
    }

    if (request.url === "/") {
        response.writeHead(200);
        response.write("Commands Manager API works.");
        response.end();
        return;
    }

    if (request.url.startsWith("/api/execute") && ["GET", "POST"].includes(request.method)) {
        const commandId = request.url.split("/")[3];
        // TODO Validation, mapping from ID to file

        const output = await commandExecuteService.executeSync(commandId);
        response.writeHead(200);
        response.write(output);
        response.end();
        return;
    }

    response.writeHead(404);
    response.end();
};

const guiServer = async (request, response) => {
    if (request.url === "/") {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(fs.readFileSync(INDEX_PATH));
        response.end();
        return;
    }

    if (!userAuthenticationService.isAuthenticated(request)) {
        response.writeHead(401);
        response.end();
        return;
    }

    if (request.url.startsWith("/groups")) {
        if (request.method === 'GET') {
            response.writeHead(200, { "Content-Type": "text/json" });
            response.write(JSON.stringify(groupsService.getAllGroups()));
        }

        response.end();
        return;
    }

    if (request.url.startsWith("/execute") && request.method === 'GET') {
        // TODO Implement
        return;

        const commandId = request.url.split("/")[2];
        // TODO Validation

        // if (request.method === 'GET') {
        // response.writeHead(200);
        // }

        response.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        });

        let clientAvailable = true;
        request.on("close", () => {
            clientAvailable = false;
        });

        const clientId = (new Date()).toLocaleTimeString();

        // logger.info(await commandExecuteService.execute(commandId));
        const process = commandExecuteService.execute(commandId);
        process.stdout.on("data", data => {
            logger.info(`stdout:\n${data}`);
            response.write("id: " + clientId + "\n");
            response.write("data: " + data + "\n\n");
        });
        process.stderr.on("data", (data) => {
            logger.error(`stdout: ${data}`);
        });
        process.on("exit", code => {
            console.log(`Process ended with ${code}`);
            response.writeHead(code === 0 ? 200 : 500);
            response.end();
        });

        return;
    }

    response.writeHead(404);
    response.end();
};

const server = async (request, response) => {
    if (request.port === Configuration.api.port) {
        apiServer(request, response);
    } else {
        guiServer(request, response);
    }
};

if (Configuration.api.enabled && Configuration.gui.enabled && Configuration.api.port === Configuration.gui.port) {
    apiAuthenticationService.validateToken();

    http.createServer(server).listen(Configuration.api.port, () => {
        logger.info("API and GUI server running at 0.0.0.0:" + Configuration.api.port);
    });
} else {
    if (Configuration.api.enabled) {
        apiAuthenticationService.validateToken();

        http.createServer(apiServer).listen(Configuration.api.port, () => {
            logger.info("API server running at 0.0.0.0:" + Configuration.api.port);
        });
    }

    if (Configuration.gui.enabled) {
        http.createServer(guiServer).listen(Configuration.gui.port, () => {
            logger.info("GUI server running at 0.0.0.0:" + Configuration.gui.port);
        });
    }
}
