"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../event/Event"));
const Utils_1 = require("../utils/Utils");
class GuildMemberUpdate extends Event_1.default {
    constructor() {
        super({ name: "guildMemberUpdate" });
    }
    async callback(client, oldMember, newMember) {
        const database = client.database;
        if (!database) {
            return;
        }
        if (oldMember.premiumSince === newMember.premiumSince) {
            return;
        }
        const server = newMember.guild;
        if (!oldMember.premiumSince && newMember.premiumSince) {
            const id = newMember.id;
            const amount = 1;
            const duration = Utils_1.getDuration(newMember);
            if (!duration) {
                return;
            }
            await database.guilds.updateOne({ id: server.id }, { "$push": { "boosters": { "id": id, "amount": amount, "duration": duration } } });
        }
        else if (oldMember.premiumSince && !newMember.premiumSince) {
            const guild = await client.getGuildFromDatabase(database, server.id);
            if (!guild) {
                return;
            }
            const boosters = guild.boosters;
            if (!boosters) {
                return;
            }
            const booster = boosters.find(booster => booster.id === oldMember.id);
            await database.guilds.updateOne({ id: server.id }, { "$pull": { "boosters": booster } });
        }
        client.emit("reload", server);
    }
}
exports.default = GuildMemberUpdate;
//# sourceMappingURL=GuildMemberUpdate.js.map