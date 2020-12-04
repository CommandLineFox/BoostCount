"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../event/Event"));
const Utils_1 = require("../utils/Utils");
class ChannelChanged extends Event_1.default {
    constructor() {
        super({ name: "channelChanged" });
    }
    async callback(client, server, oldChannel, newChannel) {
        if (newChannel) {
            await this.loadBoosters(client, server);
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
    async loadBoosters(client, server) {
        const database = client.database;
        if (!database) {
            return;
        }
        const members = server.members.cache.filter(member => member.premiumSince !== null);
        console.log(members.size);
        for (const user of members) {
            const guild = await client.getGuildFromDatabase(database, server.id);
            if (!guild) {
                return;
            }
            const boosters = guild.boosters;
            const [id, member] = user;
            const booster = boosters.find(booster => booster.id === id);
            const amount = 1;
            const duration = Utils_1.getDuration(member);
            if (!duration || booster) {
                continue;
            }
            await database.guilds.updateOne({ id: server.id }, { "$push": { "boosters": { "id": id, "amount": amount, "duration": duration } } });
        }
    }
}
exports.default = ChannelChanged;
//# sourceMappingURL=ChannelChanged.js.map