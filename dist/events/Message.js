"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../event/Event"));
class MessageEvent extends Event_1.default {
    constructor() {
        super({ name: "message" });
    }
    async callback(client, message) {
        const database = client.database;
        if (!message.guild || !database) {
            return;
        }
        const guild = await client.getGuildFromDatabase(database, message.guild.id);
        const boostMessages = ["USER_PREMIUM_GUILD_SUBSCRIPTION", "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1", "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2", "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3"];
        if (!guild || !guild.config.includeAmount || !boostMessages.includes(message.type) || !guild.boosters || guild.boosters.length === 0) {
            return;
        }
        const booster = guild.boosters.find(booster => booster.id === message.author.id);
        if (!booster) {
            return;
        }
        const count = message.content ? 1 : parseInt(message.content);
        if (!booster.amount) {
            booster.amount = count;
        }
        else {
            booster.amount += count;
        }
        await database.guilds.updateOne({ id: guild.id, "boosters.id": booster.id }, { "$set": { "boosters.$": booster } });
        client.emit("reload", message.guild);
    }
}
exports.default = MessageEvent;
//# sourceMappingURL=Message.js.map