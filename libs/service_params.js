/**
 * Created by pedrosousabarreto@gmail.com on 15/Jan/2019.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_utils_1 = require("./string_utils");
exports.PARAM_TYPES = string_utils_1.strEnum([
    'STRING',
    'BOOL',
    'NUMBER'
]);
/***
 * ServiceParams
 * An instance of this class is required to configure a service.
 * This will act like the schema of available of parameters and feature flags for a service.
 */
class ServiceParams {
    constructor() {
        this._params = new Map();
        this._feature_flags = new Map();
    }
    add_param(srv_opt) {
        this._params.set(srv_opt.name, srv_opt);
    }
    get_param(param_name) {
        return this._params.get(param_name) || null;
    }
    get_all_params() {
        return Array.from(this._params.values());
    }
    add_feature_flag(feature_flag) {
        this._feature_flags.set(feature_flag.name.toUpperCase(), feature_flag);
    }
    get_feature_flag(feature_flag_name) {
        return this._feature_flags.get(feature_flag_name.toUpperCase()) || null;
    }
    get_all_feature_flags() {
        return Array.from(this._feature_flags.values());
    }
}
exports.ServiceParams = ServiceParams;
class ServiceParam {
    constructor(_name, _type, _default_value, _description) {
        this._name = _name;
        this._type = _type;
        this._default_value = _default_value;
        this._description = _description;
    }
    get name() { return this._name; }
    get type() { return this._type; }
    get default_value() { return this._default_value; }
    get description() { return this._description; }
}
exports.ServiceParam = ServiceParam;
class ServiceFeatureFlag {
    constructor(_name, _default_value, _description) {
        this._name = _name;
        this._default_value = _default_value;
        this._description = _description;
    }
    get name() { return this._name; }
    get default_value() { return this._default_value; }
    get description() { return this._description; }
}
exports.ServiceFeatureFlag = ServiceFeatureFlag;
//# sourceMappingURL=service_params.js.map