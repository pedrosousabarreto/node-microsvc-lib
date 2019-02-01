/**
 * Created by pedrosousabarreto@gmail.com on 01/Feb/2019.
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
require("mocha");
const chai_1 = require("chai");
const async = __importStar(require("async"));
const microservice_1 = require("../libs/microservice");
const console_logger_1 = require("../libs/console_logger");
const http = require('http');
const health_check_1 = require("./factories/health_check");
describe('main', () => {
    let app;
    let logger;
    let configs;
    const start_time = Date.now();
    configs = require("./config/config");
    logger = new console_logger_1.ConsoleLogger();
    // create microservice app, no init yet
    app = new microservice_1.Microservice(configs, logger);
    app.register_dependency("logger", logger);
    app.register_dependency("test_dep", { key: "abc", value: 123 });
    // register factories, order matters
    // app.register_factory("request_logger", RequestLogger);
    app.register_factory("health_check", health_check_1.HealthCheck);
    process.on("uncaughtException", (err) => {
        logger.fatal(err);
    });
    before((done) => {
        app.init((err) => {
            chai_1.expect(err).to.not.exist;
            if (err) {
                console.error(err);
                done(err);
            }
            done();
        });
    });
    after((done) => {
        // @ts-ignore
        async.parallel([
            app.destroy.bind(app)
        ], (err) => {
            chai_1.expect(err).to.not.exist;
            if (err)
                console.error(err);
            else
                console.log("---all destroys done");
            done(err);
        });
    });
    describe("di container", () => {
        it("dependency exists", (done) => {
            const test_dep = app.get("test_dep");
            const logger_dep = app.get("logger");
            chai_1.expect(test_dep).to.exist;
            chai_1.expect(logger_dep).to.exist;
            done();
        });
        it("dependency does not exist", (done) => {
            try {
                const non_existing_dep = app.get("non_existing_dep");
                chai_1.expect(non_existing_dep).to.not.exist;
            }
            catch (e) {
                chai_1.expect(e).to.exist;
            }
            done();
        });
    });
    describe("express app", () => {
        it("heath_check", (done) => {
            http.get('http://localhost:3000/_health_check', (res) => {
                chai_1.expect(res.statusCode).to.be.eq(200);
                done();
            });
        });
        it("non existent path", (done) => {
            http.get('http://localhost:3000/non_existing', (res) => {
                chai_1.expect(res.statusCode).to.be.eq(404);
                done();
            });
        });
    });
});
//# sourceMappingURL=index.js.map