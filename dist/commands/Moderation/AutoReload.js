"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
class Ping extends Command_1.default {
    constructor() {
        super({
            name: "AutoReload",
            triggers: ["auto", "autoreload", "autorefresh"],
            description: "Sets or removes a timer for automatic refreshing.",
            group: Groups_1.Moderation
        });
    }
    async run(event) {
        const client = event.client;
        const database = client.database;
        if (!database) {
            return;
        }
        const guild = event.guild;
        const model = await client.getGuildFromDatabase(database, guild.id);
        if (!model) {
            return;
        }
        if (!model.config.boosts || !model.config.boosts.channel) {
            event.send("There's no list for me to refresh.");
            return;
        }
        const argument = event.argument;
        switch (argument.split(/\s/, 1)[0].trim().toLowerCase()) {
            case "start": {
                if (model.config.timer) {
                    event.send("I'm already refreshing the list.");
                    break;
                }
                await database.guilds.updateOne({ id: model.id }, { "$set": { "config.timer": true } });
                event.send("I will refresh the list every hour.");
                break;
            }
            case "stop": {
                if (!model.config.timer) {
                    event.send("I'm not refreshing the list.");
                    break;
                }
                model.config.timer = undefined;
                await database.guilds.updateOne({ id: model.id }, { "$unset": { "config.timer": "" } });
                event.send("I will no longer refresh the list every hour.");
                break;
            }
            default: {
                event.send("Valid subcommands are `start` and `stop`.");
                break;
            }
        }
        client.emit("handleTimers");
    }
}
exports.default = Ping;
//# sourceMappingURL=AutoReload.js.map