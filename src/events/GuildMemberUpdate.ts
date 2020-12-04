import Event from "@event/Event";
import { GuildMember } from "discord.js";
import BotClient from "~/BotClient";
import { getDuration } from "~/utils/Utils";

export default class GuildMemberUpdate extends Event {
    public constructor() {
        super({ name: "guildMemberUpdate" });
    }

    public async callback(client: BotClient, oldMember: GuildMember, newMember: GuildMember): Promise<void> {
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
            const duration = getDuration(newMember);
            if (!duration) {
                return;
            }

            await database.guilds.updateOne({ id: server.id }, { "$push": { "boosters": { "id": id, "amount": amount, "duration": duration } } });
        } else if (oldMember.premiumSince && !newMember.premiumSince) {
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
