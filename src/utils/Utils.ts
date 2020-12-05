import { Guild, GuildMember, Message, MessageEmbed, ReactionEmoji } from "discord.js";
import { Booster, Guild as GuildModel } from "@models/Guild";
import BotClient from "~/BotClient";

export function splitArguments(argument: string, amount: number): string[] {
    const args = [];
    let element = "";
    let index = 0;

    while (index < argument.length) {
        if (args.length < amount - 1) {
            if (argument[index].match(/\s/)) {
                if (element.trim().length > 0) {
                    args.push(element.trim());
                }

                element = "";
            }
        }
        element += argument[index];
        index++;
    }

    if (element.trim().length > 0) {
        args.push(element.trim());
    }

    return args;
}

export async function pagify(model: GuildModel, message: Message): Promise<void> {
    const boosters = model.boosters;
    if (!boosters || boosters.length === 0) {
        message.edit("There are no boosters");
        return;
    }

    const guild = message.guild;
    if (!guild) {
        return;
    }

    message.edit("", await generateEmbed(boosters, 0, guild, model))
        .then(message => {
            if (boosters.length <= 25) {
                return;
            }

            message.react("➡️");
            const collector = message.createReactionCollector((reaction: ReactionEmoji) => ["⬅️", "➡️"].includes(reaction.name));

            let current = 0;
            collector.on("collect", reaction => {
                message.reactions.removeAll()
                    .then(async () => {
                        if (reaction.emoji.name === "⬅️") {
                            current -= 25;
                        } else {
                            current += 25;
                        }

                        message.edit(await generateEmbed(boosters, current, guild, model));
                        if (current !== 0) {
                            await message.react("⬅️");
                        }

                        if (current + 25 < boosters.length) {
                            await message.react("➡️");
                        }
                    });
            });
        });
}

async function generateEmbed(boosters: Booster[], position: number, server: Guild, model: GuildModel): Promise<MessageEmbed> {
    const current = boosters.slice(position, position + 25);
    const embed = new MessageEmbed()
        .setTitle("The list of current boosters:");
    for (const booster of current) {
        const member = await server.members.fetch(booster.id);
        if (!member) {
            continue;
        }
        const user = member.user.tag;
        const amount = booster.amount;
        const duration = booster.duration;
        if (model.config.includeAmount) {
            embed.addField(user, `Amount: ${amount}\nDuration: ${duration}`, true);
        } else {
            embed.addField(user, `Duration: ${duration}`, true);
        }
    }

    return embed;
}

export function getDuration(member: GuildMember): number | undefined {
    const date = member.premiumSince;
    if (!date) {
        return;
    }

    const now = new Date();
    const years = (now.getFullYear() - date.getFullYear()) * 12;
    let duration = now.getMonth() - date.getMonth() + years;
    if (now.getDate() > date.getDate()) {
        duration += 1;
    }

    return duration;
}

export async function loadBoosters(client: BotClient, server: Guild): Promise<void> {
    const database = client.database;
    if (!database) {
        return;
    }

    await database.guilds.updateOne({ id: server.id }, { "$set": { "boosters": [] } });
    const members = server.members.cache.filter(member => member.premiumSince !== null);
    for (const user of members) {
        const guild = await client.getGuildFromDatabase(database, server.id);
        if (!guild) {
            return;
        }

        const [id, member] = user;
        const amount = 1;
        let duration = getDuration(member);
        if (!duration) {
            duration = 0;
        }

        await database.guilds.updateOne({ id: server.id }, { "$push": { "boosters": { "id": id, "amount": amount, "duration": duration } } });
    }
}
