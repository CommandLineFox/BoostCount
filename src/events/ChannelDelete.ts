import Event from "@event/Event";
import { GuildChannel } from "discord.js";
import BotClient from "~/BotClient";

export default class ChannelDelete extends Event {
    public constructor() {
        super({ name: "channelDelete" });
    }

    public async callback(client: BotClient, channel: GuildChannel): Promise<void> {
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
