/**
 * Created by pedro.barreto@bynder.com on 15/Jan/2019.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConsoleLogger {
    constructor() {
        this._attrs = {};
    }
    debug(message, ...optionalParams) {
        console.log.apply(this, [message, ...optionalParams]);
    }
    info(message, ...optionalParams) {
        console.info.apply(this, [message, ...optionalParams]);
    }
    warn(message, ...optionalParams) {
        console.warn.apply(this, [message, ...optionalParams]);
    }
    error(message, ...optionalParams) {
        console.error.apply(this, [message, ...optionalParams]);
    }
    fatal(message, ...optionalParams) {
        console.error.apply(this, [message, ...optionalParams]);
    }
    create_child(attrs) {
        if (attrs)
            this._attrs = attrs;
        return this;
    }
}
exports.ConsoleLogger = ConsoleLogger;
