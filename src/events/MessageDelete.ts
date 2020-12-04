import Event from "@event/Event";
import { Message } from "discord.js";
import BotClient from "~/BotClient";

export default class MessageDelete extends Event {
    public constructor() {
        super({ name: "messageDelete" });
    }

    public async callback(client: BotClient, message: Message): Promise<void> {
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
