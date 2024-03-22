const http = require("http");
const fs = require("fs");

const Logger = require("./lib/logger.js");
const UserAuthenticationService = require("./lib/user_authentication_service.js");
const ApiAuthenticationService = require("./lib/api_authentication_service.js");
const GroupsService = require("./lib/groups_service.js");
const CommandExecuteService = require("./lib/command_execute_service.js");
const ConfigurationService = require("./lib/configuration_service");
const CommandsService = require("./lib/commands_service");
const RequestValidateService = require("./lib/request_validate_service");

const INDEX_PATH = __dirname + "/html/index.html";
const SCRIPTS_DIR_PATH = __dirname + "/scripts";

const SIGNATURE_HEADER = "x-hub-signature";

const Configuration = new ConfigurationService(process.argv[2]).getConfiguration();

// With no dependencies
const logger = new Logger();
const userAuthenticationService = new UserAuthenticationService();
const apiAuthenticationService = new ApiAuthenticationService(Configuration.api.token);
const commandsService = new CommandsService();
const requestValidateService = new RequestValidateService();

// With dependecies
const groupsService = new GroupsService(commandsService);
const commandExecuteService = new CommandExecuteService(SCRIPTS_DIR_PATH, logger);

async function getRequestContent(request) {
    return new Promise((resolve) => {
        let requestData = "";

        request.on("data", chunk => {
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

    try {
        if (request.url.startsWith("/groups")) {
            if (request.method === "GET") {
                if (request.url === "/groups") {
                    response.writeHead(200, { "Content-Type": "text/json" });
                    response.write(JSON.stringify(groupsService.getAllGroups()));
                }
                else if (request.url === "/groups&tree") {
                    response.writeHead(200, { "Content-Type": "text/json" });
                    response.write(JSON.stringify(groupsService.getAllGroupsTree()));
                }
            }

            if (request.method === "PUT") {
                const requestContent = JSON.parse(await getRequestContent(request));

                if (requestContent.name) {
                    groupsService.addGroup(requestContent);
                    response.writeHead(200);
                } else {
                    response.writeHead(422, { "Content-Type": "text/plain" });
                    response.write("Group name is required.");
                }
            }

            if (request.method === "POST") {
                const requestContent = JSON.parse(await getRequestContent(request));

                if (requestContent.id && requestContent.name) {
                    groupsService.editGroup(requestContent);
                    response.writeHead(200);
                } else {
                    response.writeHead(422, { "Content-Type": "text/plain" });
                    response.write("Group ID and name is required.");
                }
            }

            if (request.method === "DELETE") {
                // TODO validate ID
                const id = request.url.replace("/groups/", "");
                groupsService.deleteGroup(id);
                response.writeHead(200);
            }

            response.end();
            return;
        }

        if (request.url.startsWith("/commands")) {
            if (request.method === "PUT") {
                const requestContent = JSON.parse(await getRequestContent(request));
                requestValidateService.validateRequiredFields(requestContent, ["name", "script", "groupId"]);
                commandsService.addCommand(requestContent);
                response.writeHead(200);
            }

            if (request.method === "GET" && request.url.endsWith("/execute")) {
                const commandId = request.url.replace("/commands/", "").replace("/execute", "");
                // TODO Validation

                response.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive'
                });

                let cnt = 0;

                const commandProcess = commandExecuteService.executeAsync("test");
                commandProcess.stdout.on("data", data => {
                    logger.info(`stdout:\n${data}`);
                    const id = new Date().getTime();

                    const event = {
                        name: 'message',
                        data: cnt,
                        id: cnt
                    };

                    cnt++;

                    const eventString = `event: ${event.name}\ndata: ${event.data}\nid: ${event.id}\n\n`;
                    console.log(eventString)
                    response.write(eventString);
                });

                commandProcess.stderr.on("data", (data) => {
                    logger.error(`stdout: ${data}`);
                });

                commandProcess.on("exit", code => {
                    console.log(`Process ended with ${code}`);
                    response.writeHead(code === 0 ? 200 : 500);
                    response.end();
                });

                return;

                const res = response;
                // Set the response headers
                res.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive'
                });
                // Create a counter variable
                let counter = 0;
                // Create an interval function that sends an event every second
                const interval = setInterval(() => {
                    // Increment the counter
                    counter++;
                    // Create an event object with name, data, and id properties
                    const event = {
                        name: 'message',
                        data: `Hello, this is message number ${counter}`,
                        id: counter
                    };
                    // Convert the event object to a string
                    const eventString = `event: ${event.name}\ndata: ${event.data}\nid: ${event.id}\n\n`;
                    // Write the event string to the response stream
                    res.write(eventString);
                    // End the response stream after 10 events
                    if (counter === 10) {
                        clearInterval(interval);
                        res.end();
                    }
                }, 1000);

                return;



                // response.writeHead(200, {
                //     "Content-Type": "text/event-stream",
                //     "Cache-Control": "no-cache"
                // ,
                // "Connection": "keep-alive"
                // });

                // let clientAvailable = true;
                // request.on("close", () => {
                //     clientAvailable = false;
                // });

                const clientId = new Date().getTime();

                // logger.info(await commandExecuteService.execute(commandId));

                // response.write("id: " + clientId + "\n");
                // response.write("data: " + "aaaaa" + "\n\n");;
                response.header('Cache-Control', 'no-cache');
                response.header('Content-Type', 'text/event-stream');
                setInterval(() => {
                    response.write('data: ' + new Date().toISOString() + '\n\n');
                }, 1000);

                // response.writeHead(200);
                // response.end();

                return;

                const process = commandExecuteService.executeAsync("test");
                commandProcess.stdout.on("data", data => {
                    logger.info(`stdout:\n${data}`);
                    response.write("id: " + clientId + "\n");
                    response.write("data: " + data + "\n\n");
                });
                commandProcess.stderr.on("data", (data) => {
                    logger.error(`stdout: ${data}`);
                });
                commandProcess.on("exit", code => {
                    console.log(`Process ended with ${code}`);
                    response.writeHead(code === 0 ? 200 : 500);
                    response.end();
                });

                return;
            }

            if (request.method === "GET") {
                const commandId = request.url.replace("/commands/", "");
                // TODO Validate

                const command = commandsService.getCommandDetails(commandId);

                if (command) {
                    response.writeHead(200, { "Content-Type": "text/json" });
                    response.write(JSON.stringify(command));
                } else {
                    response.writeHead(404);
                }
            }

            response.end();
            return;
        }

        response.writeHead(404);
        response.end();

    } catch (e) {
        // TODO Diffrentiate if input or server error
        response.writeHead(422, { "Content-Type": "text/plain" });
        response.write(e.message);
        response.end();
    }
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
