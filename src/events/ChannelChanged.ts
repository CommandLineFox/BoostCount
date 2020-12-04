import Event from "@event/Event";
import { Guild, TextChannel } from "discord.js";
import BotClient from "~/BotClient";

export default class ChannelChanged extends Event {
    public constructor() {
        super({ name: "channelChanged" });
    }

    public async callback(client: BotClient, server: Guild, oldChannel: string, newChannel: string): Promise<void> {
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

            const channel = server.channels.cache.get(oldChannel) as TextChannel;
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
