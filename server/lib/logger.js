function getFormattedTime() {
    return new Date().toISOString().replace("T", " ").replace("Z", "");
}

class Logger {
    info(message) {
        console.info(`[INFO] ${getFormattedTime()} ${message}`);
    }

    error(message) {
        console.error(`[ERRO] ${getFormattedTime()} ${message}`);
    }
}

module.exports = Logger;