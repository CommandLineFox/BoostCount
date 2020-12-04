"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDuration = exports.pagify = exports.splitArguments = void 0;
const discord_js_1 = require("discord.js");
function splitArguments(argument, amount) {
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
exports.splitArguments = splitArguments;
async function pagify(model, message) {
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
        const collector = message.createReactionCollector((reaction) => ["⬅️", "➡️"].includes(reaction.name));
        let current = 0;
        collector.on("collect", reaction => {
            message.reactions.removeAll()
                .then(async () => {
                if (reaction.emoji.name === "⬅️") {
                    current -= 25;
                }
                else {
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
exports.pagify = pagify;
async function generateEmbed(boosters, position, server, model) {
    const current = boosters.slice(position, position + 25);
    const embed = new discord_js_1.MessageEmbed()
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
        }
        else {
            embed.addField(user, `Duration: ${duration}`, true);
        }
    }
    return embed;
}
function getDuration(member) {
    const date = member.premiumSince;
    if (!date) {
        return;
    }
    const now = new Date();
    const years = (now.getFullYear() - date.getFullYear()) * 12;
    const duration = now.getMonth() - date.getMonth() + years;
    return duration;
}
exports.getDuration = getDuration;
//# sourceMappingURL=Utils.js.map