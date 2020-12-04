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
            name: "Reload",
            triggers: ["reload", "refresh"],
            description: "Forces a reload of the booster list",
            group: Groups_1.Moderation
        });
    }
    run(event) {
        const client = event.client;
        const guild = event.guild;
        client.emit("reload", guild);
        event.send("Reloaded the list.");
    }
}
exports.default = Ping;
//# sourceMappingURL=Reload.js.map