"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../event/Event"));
class ChannelChanged extends Event_1.default {
    constructor() {
        super({ name: "channelChanged" });
    }
    async callback(client, server, oldChannel, newChannel) {
        if (newChannel) {
            client.emit("reload", server);
        }
        if (oldChannel) {
            const database = client.database;
            if (!database) {
                return;
            }
            const guild = await client.getGuildFromDatabase(database, server.id);
            if (!guild || !guild.config.boosts || !guild.config.boosts.channel || !guild.config.boosts.message) {
                return;
            }
            const channel = server.channels.cache.get(oldChannel);
            if (!channel) {
                return;
            }
            const message = await channel.messages.fetch(guild.config.boosts.message);
            if (!message) {
                return;
            }
            await message.delete();
        }
    }
}
exports.default = ChannelChanged;
//# sourceMappingURL=ChannelChanged.js.map