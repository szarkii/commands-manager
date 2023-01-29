const http = require("http");
const fs = require("fs");

const Logger = require("./lib/logger.js");
const AuthenticationService = require("./lib/authentication_service.js");
const GroupsService = require("./lib/groups_service.js");
const CommandExecuteService = require("./lib/command_execute_service.js");

const SERVER_DEFAULT_PORT = 8080;

const INDEX_PATH = __dirname + "/html/index.html";
const SCRIPTS_DIR_PATH = __dirname + "/scripts";
// TODO: Add override configuration

const SERVER_PORT = process.argv[2] || SERVER_DEFAULT_PORT;

const logger = new Logger();
const authenticationService = new AuthenticationService();
const groupsService = new GroupsService();
const commandExecuteService = new CommandExecuteService(SCRIPTS_DIR_PATH, logger);

http.createServer(async function (request, response) {
    if (request.url === "/") {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(fs.readFileSync(INDEX_PATH));
        response.end();
        return;
    }

    if (!authenticationService.isAuthenticated(request)) {
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

    if (request.url.startsWith("/api/execute") && request.method === 'GET') {
        const commandId = request.url.split("/")[3];
        // TODO Validation

        const output = await commandExecuteService.executeSync(commandId);
        response.writeHead(200);
        response.write(output);
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
}).listen(SERVER_PORT, () => {
    logger.info("Server running at 0.0.0.0:" + SERVER_PORT);
});