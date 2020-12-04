"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../event/Event"));
class ChannelDelete extends Event_1.default {
    constructor() {
        super({ name: "channelDelete" });
    }
    async callback(client, channel) {
        const database = client.database;
        if (!database) {
            return;
        }
        const guild = await client.getGuildFromDatabase(database, channel.guild.id);
        if (!guild || !guild.config.boosts || !guild.config.boosts.channel) {
            return;
        }
        if (channel.id === guild.config.boosts.channel) {
            await database.guilds.updateOne({ id: guild.id }, { "$set": { "config.boosts": {} } });
        }
    }
}
exports.default = ChannelDelete;
//# sourceMappingURL=ChannelDelete.js.map