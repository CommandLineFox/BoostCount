"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../event/Event"));
class HandleTimers extends Event_1.default {
    constructor() {
        super({ name: "handleTimers" });
    }
    async callback(client) {
        const database = client.database;
        if (!database) {
            return;
        }
        const servers = [];
        const guilds = client.guilds.cache;
        for (const serverData of guilds) {
            const [id, server] = serverData;
            const guild = await client.getGuildFromDatabase(database, id);
            if (!guild || !guild.config.timer || !guild.config.boosts || !guild.config.boosts.channel) {
                continue;
            }
            servers.push(server);
            client.timer = setInterval(() => {
                for (const server of servers) {
                    client.emit("reload", server);
                }
            }, 3600000);
        }
    }
}
exports.default = HandleTimers;
//# sourceMappingURL=HandleTimers.js.map