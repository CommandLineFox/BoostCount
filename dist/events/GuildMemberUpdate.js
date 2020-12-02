"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../event/Event"));
class GuildMemberUpdate extends Event_1.default {
    constructor() {
        super({ name: "guildMemberUpdate" });
    }
    async callback(client, oldMember, newMember) {
        const database = client.database;
        if (!database) {
            return;
        }
        const guild = await client.getGuildFromDatabase(database, oldMember.guild.id);
        if (!guild || !guild.config || !guild.config.boosts) {
            return;
        }
        if (!guild.config.boosts.channel) {
            return;
        }
        const channel = newMember.guild.channels.cache.get(guild.config.boosts.channel);
        if (!channel) {
            return;
        }
        if (!guild.config.boosts.message) {
            const message = await channel.send("New list");
            await database.guilds.updateOne({ id: guild.id }, { "$set": { "config.boosts.message": message.id } });
        }
    }
}
exports.default = GuildMemberUpdate;
//# sourceMappingURL=GuildMemberUpdate.js.map