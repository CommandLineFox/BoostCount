import {PermissionResolvable} from "discord.js";
import CommandEvent from "@command/CommandEvent";
import Group from "@command/Group";

interface CommandOptions {
    readonly name: string;
    readonly triggers: string[];
    readonly description: string;
    readonly botPermissions?: PermissionResolvable;
    readonly userPermissions?: PermissionResolvable;
    readonly group: Group;
    readonly guildOnly?: boolean;
    readonly modOnly?: boolean;
    readonly adminOnly?: boolean;
    readonly ownerOnly?: boolean;
    readonly disabled?: boolean;
}

export default abstract class Command implements CommandOptions {
    public readonly name: string;
    public readonly triggers: string[];
    public readonly description: string;
    public readonly botPermissions: PermissionResolvable;
    public readonly userPermissions: PermissionResolvable;
    public readonly group: Group;
    public readonly guildOnly?: boolean;
    public readonly modOnly?: boolean;
    public readonly adminOnly?: boolean;
    public readonly ownerOnly?: boolean;
    public readonly disabled?: boolean;

    protected constructor(options: CommandOptions) {
        this.name = options.name;
        this.triggers = options.triggers;
        this.description = options.description;
        this.botPermissions = options.botPermissions ?? [];
        this.userPermissions = options.userPermissions ?? [];
        this.group = options.group;
        this.modOnly = this.group.modOnly ?? options.modOnly ?? false;
        this.adminOnly = this.group.adminOnly ?? options.adminOnly ?? false;
        this.guildOnly = this.group.guildOnly ?? options.guildOnly ?? false;
        this.ownerOnly = this.group.ownerOnly ?? options.ownerOnly ?? false;
        this.disabled = this.group.disabled ?? options.disabled ?? false;
    }

    public async execute(event: CommandEvent): Promise<void> {
        if (this.ownerOnly && !event.client.isOwner(event.author)) {
            await event.reply("you do not own me!");
            return;
        }

        if (this.guildOnly && !event.isFromGuild) {
            await event.reply("this command can only be used in servers.");
            return;
        }

        if (event.isFromGuild) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const missingBotPermission = event.textChannel?.permissionsFor(event.guild.me!)?.missing(this.botPermissions);
            if (!missingBotPermission) {
                await event.reply("I am not allowed to run this command.");
                return;
            }

            const missingUserPermission = event.textChannel?.permissionsFor(event.member)?.missing(this.userPermissions);
            if (!missingUserPermission) {
                await event.reply("you are not allowed to run this command.");
                return;
            }
        }

        try {
            this.run(event);
        } catch (error) {
            console.log(error);
        }
    }

    protected abstract run(event: CommandEvent): void;
}
