import Command from "@command/Command";
import { Moderation } from "~/Groups";
import CommandEvent from "@command/CommandEvent";

export default class Ping extends Command {
    public constructor() {
        super({
            name: "Reload",
            triggers: ["reload", "refresh"],
            description: "Forces a reload of the booster list",
            group: Moderation
        });
    }

    public run(event: CommandEvent): void {
        const client = event.client;
        const guild = event.guild;

        client.emit("reload", guild);
        event.send("Reloaded the list.");
    }
}
