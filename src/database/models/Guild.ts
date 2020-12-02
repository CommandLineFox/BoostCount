import { ObjectId } from "bson";

export interface GuildBoosts {
    channel?: string;
    message?: string;
}

export interface GuildConfig {
    prefix?: string;
    boosts?: GuildBoosts;
}

export interface GuildDoc {
    id: string;
    config?: GuildConfig;
}

export class Guild implements GuildDoc {
    public _id: ObjectId;
    public id: string;
    public config: GuildConfig;

    public constructor(data: GuildDoc) {
        this._id = new ObjectId();
        this.id = data.id;
        this.config = data.config ?? {};
    }
}
