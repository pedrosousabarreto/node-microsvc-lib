/**
 * Created by pedrosousabarreto@gmail.com on 15/Jan/2019.
 */

"use strict";


import {ServiceParams, ServiceParam, PARAM_TYPES, ServiceFeatureFlag, ServiceSecret} from "../../service_params";

let params = new ServiceParams();


params.add_param(new ServiceParam("http_port",
	PARAM_TYPES.INT_NUMBER, 3000,
	"http port for the service to listen on"));

params.add_param(new ServiceParam("ext_base_url", PARAM_TYPES.STRING,
	"https://localhost", "external base url, ex: https://localhost:443"));

params.add_param(new ServiceParam("kafka_conn_string", PARAM_TYPES.STRING,
	"localhost:9092", "kafka broker connection string - ex: 127.0.0.1:9092"));

params.add_param(new ServiceParam("position_cmds_topic", PARAM_TYPES.STRING,
	"PositionCommands", "topic for position commands"));

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

params.add_feature_flag(new ServiceFeatureFlag("RUN_EXPRESS_APP",
	true, "start the express application"));

params.add_secret(new ServiceSecret("secret1", null, "db password example"));

export = params;