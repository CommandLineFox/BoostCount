"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayData = exports.databaseCheck = void 0;
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
    if (!specific) {
        switch (type.toLowerCase()) {
            case "prefix": {
                return (_a = guild.config.prefix) !== null && _a !== void 0 ? _a : client.config.prefix;
            }
            case "channel": {
                return ((_b = guild.config.boosts) === null || _b === void 0 ? void 0 : _b.channel) ? `<#${guild.config.boosts.channel}>` : "Not set";
            }
        }
    }
    else {
        switch (type.toLowerCase()) {
            case "prefix": {
                await event.send(`The prefix is currently set to \`${(_c = guild.config.prefix) !== null && _c !== void 0 ? _c : client.config.prefix}\``);
                break;
            }
            case "channel": {
                if (!((_d = guild.config.boosts) === null || _d === void 0 ? void 0 : _d.channel)) {
                    await event.send("The channel for the boost list is not set.");
                    return;
                }
                await event.send(`The channel for updates is currently set to <#${guild.config.boosts.channel}>.`);
            }
        }
    }
    return;
}
exports.displayData = displayData;
//# sourceMappingURL=CommandUtils.js.map