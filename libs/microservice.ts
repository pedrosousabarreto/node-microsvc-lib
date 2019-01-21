/**
 * Created by pedro.barreto@bynder.com on 15/Jan/2019.
 */
"use strict";

import * as http from "http";
import assert from "assert";
import express from "express";
import * as Async from "async";
import * as _ from "underscore"
import * as Uuid from "uuid";


import {DiContainer} from "./di_container";
import {ServiceConfigs} from "./service_configs";
import {IDiFactory, ILogger} from "./interfaces";
import {AddressInfo} from "net";


export class Microservice extends DiContainer {
	private _express_app!: express.Application;
	private _port: number | undefined;
	private _http_server!: http.Server;
	private _configs: ServiceConfigs;
	private _logger: ILogger;

	private _run_express:boolean=true;

	constructor(configs: ServiceConfigs, logger?:ILogger) {
		super(logger);

		this._logger = (<any>logger).create_child({ class: "Microservice" });

		console.time("MicroServiceStart " + configs.instance_name);

		this._configs = configs;
		this.register_dependency("configs", this._configs);



	}

	init(callback: (err?: Error) => void) {
		// init configs
		// _init_express_app
		// _init_factories

		//do something when app is closing
		process.on('exit', () => {
			this._logger.info("Microservice exiting...");
		});

		//catches ctrl+c event
		process.on('SIGINT', ()=> {
			this._logger.info("Microservice SIGINT received - cleaning up...");
			this._destroy_factories((err:Error|undefined)=>{
				process.exit();
			});
		});

		// init configs first
		this._configs.init((err?: Error) => {
			if (err) return callback(err);

			this._run_express = this._configs.get_feature_flag_value("RUN_EXPRESS_APP");

			Async.waterfall([
				(done:Async.AsyncResultCallback<any>) => {
					if(!this._run_express)
						return done();

					// init express
					this._init_express_app.call(this, done)
				},
				(done:Async.AsyncResultCallback<any>) => {
					// init factories
					this._init_factories.call(this, done)
				}
			], (err?: Error | any) => {
				if (err)
					this._logger.error(err);

				console.timeEnd("MicroServiceStart " + this._configs.instance_name);
				callback(err);
			});
		});
	}

	private _init_express_app(callback: (err?: Error) => void) {
		this._express_app = express();

		this._port = this._configs.get_param_value("http_port");
		assert(this._port, "Invalid port for express microservice");

		this._http_server = http.createServer(this._express_app);
		this._http_server.listen(this._port, "0.0.0.0");
		this._http_server.on('error', this._http_error_handler.bind(this));

		// register express_app in the DI Container
		this.register_dependency("express_app", this._express_app);
		this.register_dependency("http_server", this._http_server);

		this._http_server.on('listening', () => {
			let addr:AddressInfo = this._http_server.address() as AddressInfo;
			// let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + JSON.stringify(addr);
			this._logger.info("Microservice listening on: %s %s:%n", addr.family, addr.address, addr.port);
			this._logger.info("Microservice PID: %d", process.pid);

			// hook health check
			this._express_app.get('/', this._health_check_handler.bind(this));

			// debug
			this._express_app.use("*", (req: express.Request, res: express.Response, next: express.NextFunction)=>{
				//console.log(`Got request - ${req.method} - ${req.originalUrl}`);

				// add a correlation id to all calls
				const correlation_id = Uuid.v4();
				res.locals["correlation_id"] = correlation_id;
				res.setHeader("X-API-correlation-id", correlation_id);

				next();
			});

			// CORS
			this._express_app.use(function(req, res, next) {
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.setHeader("Access-Control-Allow-Methods", "HEAD, GET, POST, PATCH");
				res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Requested-With");
				res.setHeader("access-control-expose-headers", "X-API-correlation-id");

				next();
			});

			callback();
		});
	}

	private _init_factories(callback: (err?: Error) => void) {
		let mod;
		let factories = _.keys(this._factories);
		Async.forEachLimit(factories, 1,
			(factory_name, next) => {
				this._logger.info("Microservice initializing factory: %s", factory_name);
				mod = this.get(factory_name);
				mod.init.call(mod, next);
			},
			(err?: any) => {
				if (err)
					this._logger.error(err);
				callback(err);
			}
		);
	}

	private _destroy_factories(callback: (err?: Error) => void) {
		let mod:IDiFactory;
		let factories = _.keys(this._factories);

		Async.forEachLimit(factories, 1,
			(factory_name, next) => {
				this._logger.info("Microservice destroying factory: %s", factory_name);
				mod = this.get(factory_name);
				mod.destroy.call(mod, next);
			},
			(err?: any) => {
				if (err)
					this._logger.error(err, "Microservice SIGINT cleanup error");
				else
					this._logger.info("Microservice SIGINT cleanup completed successfully, exiting...");
				callback(err);
			}
		);
	}

	private _http_error_handler(error: Error | any) {
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

	private _health_check_handler(req: express.Request, res: express.Response, next: express.NextFunction) {
		// TODO add overrideable custom handler
		res.send("ok");
	}
}


