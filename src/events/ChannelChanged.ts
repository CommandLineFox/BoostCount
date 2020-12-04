import Event from "@event/Event";
import { Guild, TextChannel } from "discord.js";
import BotClient from "~/BotClient";
import { getDuration } from "@utils/Utils";

export default class ChannelChanged extends Event {
    public constructor() {
        super({ name: "channelChanged" });
    }

    public async callback(client: BotClient, server: Guild, oldChannel: string, newChannel: string): Promise<void> {
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

    private async loadBoosters(client: BotClient, server: Guild) {
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
            const duration = getDuration(member);

            if (!duration || booster) {
                continue;
            }

            await database.guilds.updateOne({ id: server.id }, { "$push": { "boosters": { "id": id, "amount": amount, "duration": duration } } });
        }
    }
}
