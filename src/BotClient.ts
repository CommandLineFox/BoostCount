import { Client, ClientOptions, User, Guild, GuildMember } from "discord.js";
import configTemplate from "~/Config";
import { IFunctionType } from "~/ConfigHandler";
import { Database } from "@database/Database";
import { Guild as GuildModel } from "@models/Guild";
import CommandHandler from "@command/CommandHandler";
import EventHandler from "@event/EventHandler";

type configTemplate = typeof configTemplate;

export default class MyntClient extends Client {
    public readonly config: { [key in keyof configTemplate]: IFunctionType<configTemplate[key]> };
    public readonly database?: Database;
    public timer?: NodeJS.Timeout;

    public constructor(config: { [key in keyof configTemplate]: IFunctionType<configTemplate[key]> }, database?: Database, options?: ClientOptions) {
        super(options);
        this.config = config;
        this.database = database;
        new EventHandler(this);
        this.once("ready", () => {
            new CommandHandler(this);
        });
    }

    public async getGuildFromDatabase(database: Database, id: string): Promise<GuildModel | null> {
        let guild = await database!.guilds.findOne({ id: id });
        if (!guild) {
            const newGuild = new GuildModel({ id: id });
            await database!.guilds.insertOne(newGuild);
            guild = await database!.guilds.findOne({ id: id });
        }

        return guild;
    }

    public async getMember(argument: string, guild: Guild): Promise<GuildMember | undefined> {
        if (!argument) {
            return;
        }

        const regex = argument.match(/^((?<username>.+?)#(?<discrim>\d{4})|<?@?!?(?<id>\d{16,18})>?)$/);
        if (regex && regex.groups) {
            if (regex.groups.username) {
                return (await guild.members.fetch({ query: regex.groups.username, limit: 1 })).first();
            } else if (regex.groups.id) {
                return guild.members.fetch(regex.groups.id);
            }
        }

        return (await guild.members.fetch({ query: argument, limit: 1 })).first();
    }

    public async isMod(member: GuildMember, guild: Guild): Promise<boolean> {
        if (this.isAdmin(member)) {
            return true;
        }

        const guildModel = await this.database?.guilds.findOne({ id: guild.id });
        if (!guildModel) {
            return false;
        }

        const staff = guildModel.config.staff;
        if (!staff) {
            return false;
        }

        if (staff.length === 0) {
            return false;
        }

        let mod = false;
        staff.forEach(id => {
            if (member.roles.cache.some(role => role.id === id)) {
                mod = true;
            }
        });

        return mod;
    }

    public isAdmin(member: GuildMember): boolean {
        return member.permissions.has("ADMINISTRATOR");

    }

    public isOwner(user: User): boolean {
        return this.config.owners.includes(user.id);
    }

    public async getPrefix(guild?: Guild): Promise<string> {
        if (guild) {
            const guildDb = await this.database?.guilds.findOne({ id: guild.id });
            if (!guildDb) {
                return this.config.prefix;
            }

            if (guildDb.config.prefix) {
                return guildDb.config.prefix;
            }
        }
        return this.config.prefix;
    }
}
