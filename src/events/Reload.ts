import Event from "@event/Event";
import { Guild, TextChannel } from "discord.js";
import BotClient from "~/BotClient";
import { pagify } from "~/utils/Utils";

export default class Reload extends Event {
    public constructor() {
        super({ name: "reload" });
    }

    public async callback(client: BotClient, server: Guild): Promise<void> {
        const database = client.database;
        if (!database) {
            return;
        }

        const guild = await client.getGuildFromDatabase(database, server.id);
        if (!guild || !guild.config || !guild.config.boosts || !guild.config.boosts.channel) {
            return;
        }

        const channel = server.channels.cache.get(guild.config.boosts.channel) as TextChannel;
        if (!channel) {
            await database.guilds.updateOne({ id: guild.id }, { "$set": { "config.boosts": {} } });
            return;
        }

        let message;
        if (!guild.config.boosts.message) {
            message = await channel.send("New list");
            await database.guilds.updateOne({ id: guild.id }, { "$set": { "config.boosts.message": message.id } });
        } else {
            message = await channel.messages.fetch(guild.config.boosts.message);
            if (!message) {
                message = await channel.send("New list");
                await database.guilds.updateOne({ id: guild.id }, { "$set": { "config.boosts.message": message.id } });
            }
        }

        await pagify(guild, message);
    }
}
