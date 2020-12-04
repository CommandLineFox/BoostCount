import { ObjectId } from "bson";

export interface Booster {
    id: string;
    amount: number;
    duration: number;
}

export interface GuildBoosts {
    channel?: string;
    message?: string;
}

export interface GuildConfig {
    prefix?: string;
    boosts?: GuildBoosts;
    staff?: string[];
    includeAmount?: boolean;
}

export interface GuildDoc {
    id: string;
    config?: GuildConfig;
    boosters?: Booster[];
}

export class Guild implements GuildDoc {
    public _id: ObjectId;
    public id: string;
    public config: GuildConfig;
    public boosters: Booster[];

    public constructor(data: GuildDoc) {
        this._id = new ObjectId();
        this.id = data.id;
        this.config = data.config ?? {};
        this.boosters = data.boosters ?? [];
    }
}
