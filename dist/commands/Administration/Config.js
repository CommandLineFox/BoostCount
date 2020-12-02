"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
const discord_js_1 = require("discord.js");
const CommandUtils_1 = require("../../utils/CommandUtils");
const Utils_1 = require("../../utils/Utils");
class Config extends Command_1.default {
    constructor() {
        super({
            name: "Config",
            triggers: ["config", "cfg", "setup"],
            description: "Configures various settings for the guild",
            group: Groups_1.Administration,
            botPermissions: ["EMBED_LINKS", "MANAGE_ROLES"]
        });
    }
    async run(event) {
        const client = event.client;
        const database = client.database;
        const guild = await client.getGuildFromDatabase(database, event.guild.id);
        if (!guild) {
            return;
        }
        const [subcommand, option, args] = Utils_1.splitArguments(event.argument, 3);
        if (!subcommand) {
            await displayAllSettings(event, guild);
            return;
        }
        switch (subcommand.toLowerCase()) {
            case "prefix": {
                await prefixSettings(event, option, args, guild);
                break;
            }
            case "boosts":
            case "channel": {
                await boostChannelSettings(event, option, args, guild);
            }
        }
    }
}
exports.default = Config;
async function prefixSettings(event, option, args, guild) {
    const client = event.client;
    const database = client.database;
    if (!option) {
        await CommandUtils_1.displayData(event, guild, "prefix", true);
        return;
    }
    switch (option.toLowerCase()) {
        case "set": {
            if (args.length > 5) {
                await event.send("The prefix can be up to 5 characters.");
                break;
            }
            if (args === guild.config.prefix) {
                await event.send(`"The prefix is already set to ${args}`);
                break;
            }
            await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild === null || guild === void 0 ? void 0 : guild.id }, { "$set": { "config.prefix": args } }));
            await event.send(`The prefix has been set to \`${args}\``);
            break;
        }
        case "reset": {
            if (!guild.config.prefix) {
                await event.send("The prefix is already set to the default one.");
                break;
            }
            await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild === null || guild === void 0 ? void 0 : guild.id }, { "$unset": { "config.prefix": "" } }));
            await event.send(`The prefix has been set to \`${client.config.prefix}\``);
            break;
        }
    }
}
async function boostChannelSettings(event, option, args, guild) {
    var _a, _b;
    const client = event.client;
    const database = client.database;
    await CommandUtils_1.databaseCheck(database, guild, "boosts");
    if (!option) {
        await CommandUtils_1.displayData(event, guild, "channel", true);
        return;
    }
    switch (option.toLowerCase()) {
        case "set": {
            if (!args) {
                await event.send("You need to specify the channel");
                break;
            }
            const channel = event.guild.channels.cache.find(channel => channel.name === args || channel.id === args || `<#${channel.id}>` === args);
            if (!channel) {
                await event.send("Couldn't find the channel you're looking for.");
                break;
            }
            if (((_a = guild.config.boosts) === null || _a === void 0 ? void 0 : _a.channel) === channel.id) {
                await event.send("The booster list channel is already set to the same one.");
                break;
            }
            await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild === null || guild === void 0 ? void 0 : guild.id }, { "$set": { "config.boosts.channel": channel.id } }));
            await event.send(`The booster list channel has been set to <#${channel.id}>`);
            break;
        }
        case "remove": {
            if (!((_b = guild.config.boosts) === null || _b === void 0 ? void 0 : _b.channel)) {
                await event.send("The booster list channel has already been removed.");
                break;
            }
            await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild === null || guild === void 0 ? void 0 : guild.id }, { "$unset": { "config.boosts.channel": "" } }));
            await event.send("The booster list channel has been removed.");
            break;
        }
    }
}
async function displayAllSettings(event, guild) {
    const embed = new discord_js_1.MessageEmbed()
        .setTitle("The current settings for this server:")
        .addField("Prefix", await CommandUtils_1.displayData(event, guild, "prefix"), true)
        .addField("Booster list", await CommandUtils_1.displayData(event, guild, "channel"), true)
        .setColor("#61e096")
        .setFooter(`Requested by ${event.author.tag}`, event.author.displayAvatarURL());
    await event.send({ embed: embed });
}
//# sourceMappingURL=Config.js.map