/**
 * Created by pedrosousabarreto@gmail.com on 15/Jan/2019.
 */
"use strict";
const service_params_1 = require("../../libs/service_params");
let params = new service_params_1.ServiceParams();
params.add_param(new service_params_1.ServiceParam("http_port", service_params_1.PARAM_TYPES.NUMBER, 3000, "http port for the service to listen on"));
params.add_param(new service_params_1.ServiceParam("ext_base_url", service_params_1.PARAM_TYPES.STRING, "https://localhost", "external base url, ex: https://localhost:443"));
params.add_param(new service_params_1.ServiceParam("kafka_conn_string", service_params_1.PARAM_TYPES.STRING, "localhost:9092", "kafka broker connection string - ex: 127.0.0.1:9092"));
params.add_param(new service_params_1.ServiceParam("position_cmds_topic", service_params_1.PARAM_TYPES.STRING, "PositionCommands", "topic for position commands"));
// Examples:
//
// params.add_param(new ServiceParam("redis_conn_str", PARAM_TYPES.STRING,
// 	"redis://localhost:6379", "redis connection string"));
//
// params.add_param(new ServiceParam("kafka_test_cmds_topic", PARAM_TYPES.STRING, "test_cmds", "topic for test commands"));
//
// params.add_param(new ServiceParam("kafka_conn_string", PARAM_TYPES.STRING,
// 	"localhost:9092", "kafka broker connection string"));
//
// params.add_param(new ServiceParam("mongodb_conn_string", PARAM_TYPES.STRING,
// 	"mongodb://localhost:27017/test?replicaSet=rs",
// 	"mongo db connection string"
// ));
params.add_feature_flag(new service_params_1.ServiceFeatureFlag("RUN_EXPRESS_APP", true, "start the express application"));
module.exports = params;
//# sourceMappingURL=params.js.map