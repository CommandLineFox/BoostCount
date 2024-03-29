import Command from "@command/Command";
import { Moderation } from "~/Groups";
import CommandEvent from "@command/CommandEvent";

export default class Ping extends Command {
    public constructor() {
        super({
            name: "AutoReload",
            triggers: ["auto", "autoreload", "autorefresh"],
            description: "Sets or removes a timer for automatic refreshing.",
            group: Moderation
        });
    }

    public async run(event: CommandEvent): Promise<void> {
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
