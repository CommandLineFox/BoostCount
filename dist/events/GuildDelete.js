"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../event/Event"));
class GuildDelete extends Event_1.default {
    constructor() {
        super({ name: "guildDelete" });
    }
    async callback(client, server) {
        const database = client.database;
        if (!database) {
            return;
        }
        const guild = await client.getGuildFromDatabase(database, server.id);
        if (!guild) {
            return;
        }
        database.guilds.updateOne({ id: guild.id }, { "$unset": { "boosters": "" } });
    }
}
exports.default = GuildDelete;
//# sourceMappingURL=GuildDelete.js.map