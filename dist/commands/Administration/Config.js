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
            case "staff": {
                staffSettings(event, option, args, guild);
                break;
            }
            case "boosts":
            case "channel": {
                await boostChannelSettings(event, option, args, guild);
                break;
            }
            case "amount": {
                await amountSettings(event, option, guild);
                break;
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
async function staffSettings(event, option, args, guild) {
    var _a, _b;
    const database = event.client.database;
    await CommandUtils_1.databaseCheck(database, guild, "staff");
    if (!option) {
        await CommandUtils_1.displayData(event, guild, "staff", true);
        return;
    }
    if (!args) {
        await event.send("You need to specify a role.");
        return;
    }
    const role = event.guild.roles.cache.find(role => role.id === args || role.name === args || `<@&${role.id}>` === args);
    if (!role) {
        await event.send("Couldn't find the role you're looking for.");
        return;
    }
    switch (option.toLowerCase()) {
        case "add": {
            if ((_a = guild.config.staff) === null || _a === void 0 ? void 0 : _a.includes(role.id)) {
                await event.send("The specified role is already a staff role.");
                break;
            }
            await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild.id }, { "$push": { "config.staff": role.id } }));
            await event.send(`Added \`${role.name}\` as a staff role.`);
            break;
        }
        case "remove": {
            if (!((_b = guild.config.staff) === null || _b === void 0 ? void 0 : _b.includes(role.id))) {
                await event.send("The specified role isn't a staff role.");
                break;
            }
            await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild.id }, { "$pull": { "config.staff": role.id } }));
            await event.send(`\`${role.name}\` is no longer a staff role.`);
            break;
        }
    }
}
async function boostChannelSettings(event, option, args, guild) {
    var _a, _b, _c;
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
            client.emit("channelChanged", event.guild, (_b = guild.config.boosts) === null || _b === void 0 ? void 0 : _b.channel, channel.id);
            await event.send(`The booster list channel has been set to <#${channel.id}>`);
            break;
        }
        case "remove": {
            if (!((_c = guild.config.boosts) === null || _c === void 0 ? void 0 : _c.channel)) {
                await event.send("The booster list channel has already been removed.");
                break;
            }
            client.emit("channelChanged", event.guild, guild.config.boosts.channel, undefined);
            await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild === null || guild === void 0 ? void 0 : guild.id }, { "$set": { "config.boosts": {} } }));
            await event.send("The booster list channel has been removed.");
            break;
        }
    }
}
async function amountSettings(event, option, guild) {
    const client = event.client;
    const database = client.database;
    if (!option) {
        await CommandUtils_1.displayData(event, guild, "amount", true);
        return;
    }
    switch (option.toLowerCase()) {
        case "enable": {
            if (guild.config.includeAmount) {
                await event.send("Amount is already included.");
                break;
            }
            await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild === null || guild === void 0 ? void 0 : guild.id }, { "$set": { "config.includeAmount": true } }));
            await event.send("Amount of boosts is now included.");
            break;
        }
        case "disable": {
            if (!guild.config.includeAmount) {
                await event.send("Amount is already excluded.");
                break;
            }
            await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({ id: guild === null || guild === void 0 ? void 0 : guild.id }, { "$unset": { "config.includeAmount": "" } }));
            await event.send("Amount of boosts is now excluded.");
            break;
        }
    }
}
async function displayAllSettings(event, guild) {
    const embed = new discord_js_1.MessageEmbed()
        .setTitle("The current settings for this server:")
        .addField("Prefix", await CommandUtils_1.displayData(event, guild, "prefix"), true)
        .addField("Staff", await CommandUtils_1.displayData(event, guild, "staff"), true)
        .addField("Booster list", await CommandUtils_1.displayData(event, guild, "channel"), true)
        .addField("Amount", await CommandUtils_1.displayData(event, guild, "amount"), true)
        .setColor("#61e096")
        .setFooter(`Requested by ${event.author.tag}`, event.author.displayAvatarURL());
    await event.send({ embed: embed });
}
//# sourceMappingURL=Config.js.map