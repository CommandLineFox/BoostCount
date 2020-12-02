import CommandEvent from "@command/CommandEvent";
import { Guild } from "@models/Guild";
import { Database } from "@database/Database";
import { DisplayData } from "@utils/Types";

export async function databaseCheck(database: Database, guild: Guild, option: string): Promise<void> {
    switch (option.toLowerCase()) {
        case "boosts": {
            if (!guild.config.boosts) {
                await database.guilds.updateOne({ id: guild.id }, { "$set": { "config.boosts": {} } });
            }
            break;
        }
    }
}

export async function displayData(event: CommandEvent, guild: Guild, type: DisplayData, specific?: boolean): Promise<any> {
    const client = event.client;

    if (!specific) {
        switch (type.toLowerCase()) {
            case "prefix": {
                return guild.config.prefix ?? client.config.prefix;
            }

            case "channel": {
                return guild.config.boosts?.channel ? `<#${guild.config.boosts.channel}>` : "Not set";
            }
        }
    } else {
        switch (type.toLowerCase()) {
            case "prefix": {
                await event.send(`The prefix is currently set to \`${guild.config.prefix ?? client.config.prefix}\``);
                break;
            }

            case "channel": {
                if (!guild.config.boosts?.channel) {
                    await event.send("The channel for the boost list is not set.");
                    return;
                }

                await event.send(`The channel for updates is currently set to <#${guild.config.boosts.channel}>.`);
            }
        }
    }
    return;
}
