/**
 * Created by pedro.barreto@bynder.com on 15/Jan/2019.
 */
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const assert_1 = __importDefault(require("assert"));
const express_1 = __importDefault(require("express"));
const Async = __importStar(require("async"));
const _ = __importStar(require("underscore"));
const Uuid = __importStar(require("uuid"));
const di_container_1 = require("./di_container");
class Microservice extends di_container_1.DiContainer {
    constructor(configs, logger) {
        super(logger);
        this._run_express = true;
        this._logger = logger.create_child({ class: "Microservice" });
        console.time("MicroServiceStart " + configs.instance_name);
        this._configs = configs;
        this.register_dependency("configs", this._configs);
    }
    init(callback) {
        // init configs
        // _init_express_app
        // _init_factories
        //do something when app is closing
        process.on('exit', () => {
            this._logger.info("Microservice exiting...");
        });
        //catches ctrl+c event
        process.on('SIGINT', () => {
            this._logger.info("Microservice SIGINT received - cleaning up...");
            this._destroy_factories((err) => {
                process.exit();
            });
        });
        // init configs first
        this._configs.init((err) => {
            if (err)
                return callback(err);
            this._run_express = this._configs.get_feature_flag_value("RUN_EXPRESS_APP");
            Async.waterfall([
                (done) => {
                    if (!this._run_express)
                        return done();
                    // init express
                    this._init_express_app.call(this, done);
                },
                (done) => {
                    // init factories
                    this._init_factories.call(this, done);
                }
            ], (err) => {
                if (err)
                    this._logger.error(err);
                console.timeEnd("MicroServiceStart " + this._configs.instance_name);
                callback(err);
            });
        });
    }
    _init_express_app(callback) {
        this._express_app = express_1.default();
        this._port = this._configs.get_param_value("http_port");
        assert_1.default(this._port, "Invalid port for express microservice");
        this._http_server = http.createServer(this._express_app);
        this._http_server.listen(this._port, "0.0.0.0");
        this._http_server.on('error', this._http_error_handler.bind(this));
        // register express_app in the DI Container
        this.register_dependency("express_app", this._express_app);
        this._http_server.on('listening', () => {
            let addr = this._http_server.address();
            // let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + JSON.stringify(addr);
            this._logger.info("Microservice listening on: %s %s:%n", addr.family, addr.address, addr.port);
            this._logger.info("Microservice PID: %d", process.pid);
            // hook health check
            this._express_app.get('/', this._health_check_handler.bind(this));
            // debug
            this._express_app.use("*", (req, res, next) => {
                //console.log(`Got request - ${req.method} - ${req.originalUrl}`);
                // add a correlation id to all calls
                const correlation_id = Uuid.v4();
                res.locals["correlation_id"] = correlation_id;
                res.setHeader("X-API-correlation-id", correlation_id);
                next();
            });
            // CORS
            this._express_app.use(function (req, res, next) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Methods", "HEAD, GET, POST, PATCH");
                res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Requested-With");
                res.setHeader("access-control-expose-headers", "X-API-correlation-id");
                next();
            });
            callback();
        });
    }
    _init_factories(callback) {
        let mod;
        let factories = _.keys(this._factories);
        Async.forEachLimit(factories, 1, (factory_name, next) => {
            this._logger.info("Microservice initializing factory: %s", factory_name);
            mod = this.get(factory_name);
            mod.init.call(mod, next);
        }, (err) => {
            if (err)
                this._logger.error(err);
            callback(err);
        });
    }
    _destroy_factories(callback) {
        let mod;
        let factories = _.keys(this._factories);
        Async.forEachLimit(factories, 1, (factory_name, next) => {
            this._logger.info("Microservice destroying factory: %s", factory_name);
            mod = this.get(factory_name);
            mod.destroy.call(mod, next);
        }, (err) => {
            if (err)
                this._logger.error(err, "Microservice SIGINT cleanup error");
            else
                this._logger.info("Microservice SIGINT cleanup completed successfully, exiting...");
            callback(err);
        });
    }
    _http_error_handler(error) {
        if (error["syscall"] !== 'listen')
            throw error;
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                this._logger.fatal(this._port + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                this._logger.fatal(this._port + ' is already in use');
                process.exit(1);
                break;
            default:
                this._logger.fatal("unkown error - ", error);
                throw error;
        }
    }
    _health_check_handler(req, res, next) {
        // TODO add overrideable custom handler
        res.send("ok");
    }
}
exports.Microservice = Microservice;
