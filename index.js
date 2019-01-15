/**
 * Created by pedro.barreto@bynder.com on 15/Jan/2019.
 */
"use strict";

const interfaces = require("./libs/interfaces");

const service_configs = require("./libs/service_configs");
const service_params = require("./libs/service_params");

exports.ILogger = interfaces.ILogger;
exports.IDiFactory = interfaces.IDiFactory;

exports.ConsoleLogger = require("./libs/console_logger").ConsoleLogger;
exports.DiContainer = require("./libs/di_container").DiContainer;
exports.Microservice = require("./libs/microservice").Microservice;

exports.ServiceConfigs = service_configs.ServiceConfigs;
exports.AppBaseConfigs = service_configs.AppBaseConfigs;

exports.PARAM_TYPES = service_params.PARAM_TYPES;
exports.ServiceParams = service_params.ServiceParams;
exports.ServiceParam = service_params.ServiceParam;
exports.ServiceFeatureFlag = service_params.ServiceFeatureFlag;
