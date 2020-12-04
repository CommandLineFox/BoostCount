"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayData = exports.databaseCheck = void 0;
const discord_js_1 = require("discord.js");
async function databaseCheck(database, guild, option) {
    switch (option.toLowerCase()) {
        case "boosts": {
            if (!guild.config.boosts) {
                await database.guilds.updateOne({ id: guild.id }, { "$set": { "config.boosts": {} } });
            }
            break;
        }
    }
}
exports.databaseCheck = databaseCheck;
async function displayData(event, guild, type, specific) {
    var _a, _b, _c, _d;
    const client = event.client;
    const database = client.database;
    if (!specific) {
        switch (type.toLowerCase()) {
            case "prefix": {
                return (_a = guild.config.prefix) !== null && _a !== void 0 ? _a : client.config.prefix;
            }
            case "staff": {
                const mods = guild === null || guild === void 0 ? void 0 : guild.config.staff;
                if (!mods || mods.length === 0) {
                    return "There is no staff roles.";
                }
                let list = "";
                for (const mod of mods) {
                    const role = event.guild.roles.cache.get(mod);
                    if (!role) {
                        await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild.id }, { "$pull": { "config.roles.moderator": mod } }));
                    }
                    else {
                        list += `${role.name}\n`;
                    }
                }
                return list;
            }
            case "channel": {
                return ((_b = guild.config.boosts) === null || _b === void 0 ? void 0 : _b.channel) ? `<#${guild.config.boosts.channel}>` : "Not set";
            }
            case "amount": {
                return guild.config.includeAmount ? "Included" : "Excluded";
            }
        }
    }
    else {
        switch (type.toLowerCase()) {
            case "prefix": {
                await event.send(`The prefix is currently set to \`${(_c = guild.config.prefix) !== null && _c !== void 0 ? _c : client.config.prefix}\``);
                break;
            }
            case "staff": {
                const mods = guild === null || guild === void 0 ? void 0 : guild.config.staff;
                if (!mods || mods.length === 0) {
                    await event.send("There is no staff roles.");
                    return;
                }
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle("The following roles are staff roles:")
                    .setColor("#61e096")
                    .setFooter(`Requested by ${event.author.tag}`, event.author.displayAvatarURL());
                let list = "";
                for (const mod of mods) {
                    const role = event.guild.roles.cache.get(mod);
                    if (!role) {
                        await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild.id }, { "$pull": { "config.roles.moderator": mod } }));
                    }
                    else {
                        list += `${role.name}\n`;
                    }
                }
                embed.setDescription(list);
                await event.send({ embed: embed });
                break;
            }
            case "channel": {
                if (!((_d = guild.config.boosts) === null || _d === void 0 ? void 0 : _d.channel)) {
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
exports.displayData = displayData;
//# sourceMappingURL=CommandUtils.js.map