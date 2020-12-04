"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../event/Event"));
const Utils_1 = require("../utils/Utils");
class Reload extends Event_1.default {
    constructor() {
        super({ name: "reload" });
    }
    async callback(client, server) {
        const database = client.database;
        if (!database) {
            return;
        }
        const guild = await client.getGuildFromDatabase(database, server.id);
        if (!guild || !guild.config || !guild.config.boosts || !guild.config.boosts.channel) {
            return;
        }
        const channel = server.channels.cache.get(guild.config.boosts.channel);
        if (!channel) {
            await database.guilds.updateOne({ id: guild.id }, { "$set": { "config.boosts": {} } });
            return;
        }
        let message;
        if (!guild.config.boosts.message) {
            message = await channel.send("New list");
            await database.guilds.updateOne({ id: guild.id }, { "$set": { "config.boosts.message": message.id } });
        }
        else {
            message = await channel.messages.fetch(guild.config.boosts.message);
            if (!message) {
                message = await channel.send("New list");
                await database.guilds.updateOne({ id: guild.id }, { "$set": { "config.boosts.message": message.id } });
            }
        }
        await Utils_1.pagify(guild, message);
    }
}
exports.default = Reload;
//# sourceMappingURL=Reload.js.map