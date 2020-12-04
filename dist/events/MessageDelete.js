"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../event/Event"));
class MessageDelete extends Event_1.default {
    constructor() {
        super({ name: "messageDelete" });
    }
    async callback(client, message) {
        if (!message.author.bot) {
            return;
        }
        const database = client.database;
        if (!message.guild || !database) {
            return;
        }
        const guild = await client.getGuildFromDatabase(database, message.guild.id);
        if (!guild || !guild.config.boosts || !guild.config.boosts.channel || !guild.config.boosts.message) {
            return;
        }
        if (message.id === guild.config.boosts.message) {
            await database.guilds.updateOne({ id: guild.id }, { "$unset": { "config.boosts.message": "" } });
        }
    }
}
exports.default = MessageDelete;
//# sourceMappingURL=MessageDelete.js.map