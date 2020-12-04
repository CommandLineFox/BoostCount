import CommandEvent from "@command/CommandEvent";
import { Guild } from "@models/Guild";
import { Database } from "@database/Database";
import { DisplayData } from "@utils/Types";
import { MessageEmbed } from "discord.js";

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
    const database = client.database;

    if (!specific) {
        switch (type.toLowerCase()) {
            case "prefix": {
                return guild.config.prefix ?? client.config.prefix;
            }

            case "staff": {
                const mods = guild?.config.staff;
                if (!mods || mods.length === 0) {
                    return "There is no staff roles.";
                }

                let list = "";
                for (const mod of mods) {
                    const role = event.guild.roles.cache.get(mod);
                    if (!role) {
                        await database?.guilds.updateOne({ id: guild.id }, { "$pull": { "config.roles.moderator": mod } });
                    } else {
                        list += `${role.name}\n`;
                    }
                }

                return list;
            }

            case "channel": {
                return guild.config.boosts?.channel ? `<#${guild.config.boosts.channel}>` : "Not set";
            }

            case "amount": {
                return guild.config.includeAmount ? "Included" : "Excluded";
            }
        }
    } else {
        switch (type.toLowerCase()) {
            case "prefix": {
                await event.send(`The prefix is currently set to \`${guild.config.prefix ?? client.config.prefix}\``);
                break;
            }


            case "staff": {
                const mods = guild?.config.staff;
                if (!mods || mods.length === 0) {
                    await event.send("There is no staff roles.");
                    return;
                }

                const embed = new MessageEmbed()
                    .setTitle("The following roles are staff roles:")
                    .setColor("#61e096")
                    .setFooter(`Requested by ${event.author.tag}`, event.author.displayAvatarURL());

                let list = "";
                for (const mod of mods) {
                    const role = event.guild.roles.cache.get(mod);
                    if (!role) {
                        await database?.guilds.updateOne({ id: guild.id }, { "$pull": { "config.roles.moderator": mod } });
                    } else {
                        list += `${role.name}\n`;
                    }
                }

                embed.setDescription(list);
                await event.send({ embed: embed });
                break;
            }


            case "channel": {
                if (!guild.config.boosts?.channel) {
                    await event.send("The channel for the boost list is not set.");
                    return;
                }

                await event.send(`The channel for updates is currently set to <#${guild.config.boosts.channel}>.`);
                break;
            }

            case "amount": {
                if (!guild.config.includeAmount) {
                    await event.send("The amount of boosts is excluded.");
                    return;
                }

                await event.send("The amount of boosts is included.");
                break;
            }
        }
    }
    return;
}
