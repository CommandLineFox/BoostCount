import Event from "@event/Event";
import { Guild } from "discord.js";
import BotClient from "~/BotClient";

export default class HandleTimers extends Event {
    public constructor() {
        super({ name: "handleTimers" });
    }

    public async callback(client: BotClient): Promise<void> {
        const database = client.database;
        if (!database) {
            return;
        }
        const servers = [] as Guild[];
        const guilds = client.guilds.cache;
        for (const serverData of guilds) {
            const [id, server] = serverData;
            const guild = await client.getGuildFromDatabase(database, id);
            if (!guild || !guild.config.timer || !guild.config.boosts || !guild.config.boosts.channel) {
                continue;
            }

            servers.push(server);

            client.timer = setInterval(() => {
                for (const server of servers) {
                    client.emit("reload", server);
                }
            }, 3600000);
        }
    }
}
