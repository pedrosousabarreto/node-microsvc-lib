/**
 * Created by pedrosousabarreto@gmail.com on 01/Feb/2019.
 */


"use strict";
import "mocha";
import {expect} from "chai"
import * as async from "async";
import * as uuid from "uuid";
import {Microservice} from "../microservice";
import {ILogger} from "../interfaces";
import {ConsoleLogger} from "../console_logger";
import {ServiceConfigs} from "../service_configs";
const http = require('http');

import {HealthCheck} from "./factories/health_check";
import {ServerResponse} from "http";


describe('main', () => {
	let app:Microservice;
	let logger:ILogger;
	let configs:ServiceConfigs;

	const start_time = Date.now();
	configs = require("./config/config");
	logger = new ConsoleLogger();

	// create microservice app, no init yet
	app = new Microservice(configs, logger);

	app.register_dependency("logger", logger);
	app.register_dependency("test_dep", {key:"abc", value: 123});

	// register factories, order matters
	// app.register_factory("request_logger", RequestLogger);
	app.register_factory("health_check", HealthCheck);


	process.on("uncaughtException", (err:Error)=>{
		logger.fatal(err);
	});


	before((done) => {
		app.init((err?: Error) => {
			expect(err).to.not.exist;

			if (err){
				console.error(err);
				done(err);
			}

			done();
		});
	});

	after((done)=>{
		// @ts-ignore
		async.parallel([
			app.destroy.bind(app)
		], (err?: Error) => {
			expect(err).to.not.exist;

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

			expect(test_dep).to.exist;
			expect(logger_dep).to.exist;
			done();
		});

		it("dependency does not exist", (done) => {
			try {
				const non_existing_dep = app.get("non_existing_dep");
				expect(non_existing_dep).to.not.exist;
			}catch(e){
				expect(e).to.exist;
			}

			done();
		});

	});

	describe("express app", ()=>{
		it("heath_check", (done)=>{

			http.get('http://localhost:3000/_health_check', (res: ServerResponse)=> {
				expect(res.statusCode).to.be.eq(200);
				done();
			});
		});

		it("non existent path", (done)=>{

			http.get('http://localhost:3000/non_existing', (res: ServerResponse)=> {
				expect(res.statusCode).to.be.eq(404);
				done();
			});
		});
	});


});

