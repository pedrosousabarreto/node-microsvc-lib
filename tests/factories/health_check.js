/**
 * Created by pedrosousabarreto@gmail.com on 15/Jan/2019.
 */
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const my_path = "/_health_check";
class HealthCheck {
    constructor(configs, express_app, logger) {
        this._name = "HealthCheck";
        this._configs = configs;
        this._express_app = express_app;
        this._logger = logger;
    }
    get name() {
        return this._name;
    }
    ;
    init(callback) {
        this._logger.info("%s initialising...", this.name);
        this._inject_routes((err) => {
            if (err) {
                this._logger.error(err, this.name + " Error initializing");
                return callback(err);
            }
            this._logger.info("%s initialised", this.name);
            callback();
        });
    }
    destroy(callback) {
        this._logger.info("%s - destroying...", this.name);
        callback();
    }
    _inject_routes(callback) {
        this._logger.info("%s initialising routes...", this.name);
        let router = express.Router();
        router.get(my_path, this._health_check_handler.bind(this));
        this._express_app.use(this._configs.app_base_url, router);
        // respond immediately - this is being called from some init() fn
        callback(undefined);
    }
    _health_check_handler(req, res, next) {
        // TODO add overrideable custom handler
        res.status(200).json({ status: "ok" });
    }
}
exports.HealthCheck = HealthCheck;
//# sourceMappingURL=health_check.js.map