/**
 * Created by pedrosousabarreto@gmail.com on 15/Jan/2019.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_logger_1 = require("./console_logger");
class DiContainer {
    constructor(logger) {
        this._dependencies = {};
        this._factories = {};
        if (!logger)
            this._di_logger = new console_logger_1.ConsoleLogger().create_child({ class: "DiContainer2" });
        else
            this._di_logger = logger.create_child({ class: "DiContainer2" });
    }
    register_factory(name, factory) {
        this._check_duplicate_name(name);
        // TODO check that it implements IDiFactory
        this._di_logger.info("DI Container - registering factory: %s", name);
        this._factories[name] = factory;
    }
    register_dependency(name, dep) {
        this._check_duplicate_name(name);
        this._di_logger.info("DI Container - registering dependency: %s", name);
        this._dependencies[name] = dep;
    }
    ;
    has(name) {
        return (this._dependencies[name] || this._factories[name]);
    }
    get(name) {
        name = name.trim();
        if (!this._dependencies[name]) {
            const uninitialised_factory = this._factories[name];
            if (uninitialised_factory) {
                this._di_logger.info("DI Container - injecting factory: %s", name);
                this._dependencies[name] = this._inject(uninitialised_factory);
            }
            if (!this._dependencies[name])
                throw new Error("DI Container - cannot find module: " + name);
        }
        return this._dependencies[name];
    }
    _check_duplicate_name(name) {
        if (!this.has(name))
            return;
        const err = new Error(`Di Container - already has an object named ${name}`);
        this._di_logger.fatal(err);
        throw err;
    }
    _inject(factory) {
        // @ts-ignore
        let ctor = factory.prototype.constructor.toString();
        let args_list = ctor.match(/constructor\s?\(([^)]*)\)/).splice(1)[0];
        if (!args_list)
            return new factory();
        // args_list = args_list.replace(" ", "");
        let args_array = args_list.split(",");
        if (args_array.length <= 0)
            return new factory();
        // map them to the dependencies/factories
        let args = args_array.map((dependency) => {
            return this.get(dependency);
        });
        // instantiate and return
        return new factory(...args);
    }
}
exports.DiContainer = DiContainer;
function getArgs(func) {
    // First match everything inside the function argument parens.
    // @ts-ignore
    var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
    // Split the arguments string into an array comma delimited.
    return args.split(',').map(function (arg) {
        // Ensure no inline comments are parsed and trim the whitespace.
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function (arg) {
        // Ensure no undefined values are added.
        return arg;
    });
}
//# sourceMappingURL=di_container.js.map