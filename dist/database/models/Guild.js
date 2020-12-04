"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guild = void 0;
const bson_1 = require("bson");
class Guild {
    constructor(data) {
        var _a, _b;
        this._id = new bson_1.ObjectId();
        this.id = data.id;
        this.config = (_a = data.config) !== null && _a !== void 0 ? _a : {};
        this.boosters = (_b = data.boosters) !== null && _b !== void 0 ? _b : [];
    }
}
exports.Guild = Guild;
//# sourceMappingURL=Guild.js.map