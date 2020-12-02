import Event from "@event/Event";
import { GuildMember, TextChannel } from "discord.js";
import BotClient from "~/BotClient";

export default class GuildMemberUpdate extends Event {
    public constructor() {
        super({ name: "guildMemberUpdate" });
    }

    public async callback(client: BotClient, oldMember: GuildMember, newMember: GuildMember): Promise<void> {
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

        const channel = newMember.guild.channels.cache.get(guild.config.boosts.channel) as TextChannel;
        if (!channel) {
            return;
        }

        if (!guild.config.boosts.message) {
            const message = await channel.send("New list");
            await database.guilds.updateOne({ id: guild.id }, { "$set": { "config.boosts.message": message.id } });
        }

    }
}
