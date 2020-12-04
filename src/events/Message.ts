import Event from "@event/Event";
import { Message } from "discord.js";
import BotClient from "~/BotClient";

export default class MessageEvent extends Event {
    public constructor() {
        super({ name: "message" });
    }

    public async callback(client: BotClient, message: Message): Promise<void> {
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
        } else {
            booster.amount += count;
        }

        await database.guilds.updateOne({ id: guild.id, "boosters.id": booster.id }, { "$set": { "boosters.$": booster } });
        client.emit("reload", message.guild);
    }
}
