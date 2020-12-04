import Event from "@event/Event";
import { Guild } from "discord.js";
import BotClient from "~/BotClient";

export default class GuildDelete extends Event {
    public constructor() {
        super({ name: "guildDelete" });
    }

    public async callback(client: BotClient, server: Guild): Promise<void> {
        const database = client.database;
        if (!database) {
            return;
        }

        const guild = await client.getGuildFromDatabase(database, server.id);
        if (!guild) {
            return;
        }

        database.guilds.updateOne({ id: guild.id }, { "$unset": { "boosters": "" } });
    }
}
