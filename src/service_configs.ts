/**
 * Created by pedrosousabarreto@gmail.com on 15/Jan/2019.
 */

"use strict";

/*
* to be passed to a server constructor
* - needs to be fed a IConfigsProvider and a ServiceParams
* */
import * as uuid from "uuid";
import {PARAM_TYPES, ParamType, ServiceFeatureFlag, ServiceParam, ServiceParams, ServiceSecret} from "./service_params";
import {IConfigsProvider} from "./interfaces";
import * as path from "path";

export class ServiceConfigs {
	private _conf_files_dir_path!:string;
	private _service_params!: ServiceParams;
	private _configs_provider: IConfigsProvider | null;
	private _service_params_values: Map<string, any>;
	private _service_feature_flags_values: Map<string, boolean>;
	private _service_secret_values: Map<string, any>;
	private _solution_name: string;
	private _env: string;
	private _app_name: string;
	private _app_version: string;
	private _app_api_prefix: string;
	private _app_api_version: string;
	// computed
	private _dev_mode: boolean;
	private _app_full_name: string;
	private _app_full_name_version: string;
	private _app_base_url: string;
	private _instance_id: string;
	private _instance_name: string;

	// getters
	get env() {
		return this._env;
	}

	get solution_name() {
		return this._solution_name;
	}

	get app_name() {
		return this._app_name;
	}

	get app_version() {
		return this._app_version;
	}

	get app_api_prefix() {
		return this._app_api_prefix;
	}

	get app_api_version() {
		return this._app_api_version;
	}

	// computed
	get dev_mode() {
		return this._dev_mode;
	}

	get app_full_name() {
		return this._app_full_name;
	}

	get app_full_name_version() {
		return this._app_full_name_version;
	}

	get app_base_url() {
		return this._app_base_url;
	}

	get instance_id() {
		return this._instance_id;
	}

	get instance_name() {
		return this._instance_name;
	}

	constructor(base_config_path:string, base_configs: AppBaseConfigs, configs_provider: IConfigsProvider | null) {
		this._conf_files_dir_path = base_config_path;

		this._configs_provider = configs_provider;

		this._service_params_values = new Map<string, any>();
		this._service_feature_flags_values = new Map<string, boolean>();
		this._service_secret_values = new Map<string, any>();

		this._env = base_configs.env;
		this._solution_name = base_configs.solution_name;
		this._app_name = base_configs.app_name;
		this._app_version = base_configs.app_version;
		this._app_api_prefix = base_configs.app_api_prefix;
		this._app_api_version = base_configs.app_api_version;

		//computed props
		this._dev_mode = this._env.toUpperCase().startsWith("DEV");
		// common computed
		this._app_full_name = this._solution_name + "__" + this._env + "__" + this._app_name;
		this._app_full_name_version = this._app_full_name + "__" + this._app_version;

		if (this._app_api_prefix)
			this._app_base_url = this._app_api_prefix + "/api" + (this._app_api_version ? `/v${this._app_api_version}` : "");
		else
			this._app_base_url = "/";

		// instance specific
		this._instance_id = uuid.v4();
		this._instance_name = this._app_full_name_version + "__" + this._instance_id;

		// load the param.js file
		this._try_load_params_file();

		// check if overrides is enabled and an override file exists and if so, apply it
		this._service_params.override_from_env_file(this._conf_files_dir_path, base_configs);

		// always load the default params and feature flags from the params
		this._load_default_params();
		this._load_default_feature_flags();
		this._load_default_secrets();
	}

	// get everything it needs and prepare the object to be used
	init(callback: (err?: Error) => void) {
		// create an internal structure with values of params and feature_flags
		// so get_param_value  and get_feature_flag_value can work

		if (this._configs_provider == null){
			this._override_from_envvars();
			return callback();
		}

		const keys: string[] = Array.from(this._service_params_values.keys()).concat(
			Array.from(this._service_feature_flags_values.keys()),
			Array.from(this._service_secret_values.keys())
		);

		// go to consul or whatever configuration service
		this._configs_provider.init(keys, (err?: Error) => {
			// TODO log

			this._override_from_serviceprovider();

			this._override_from_envvars();
			callback(err);
		});
	}

	get_param_value(name: string): any {
		return this._service_params_values.get(name) || null;
	}

	get_feature_flag_value(name: string): boolean {
		return this._service_feature_flags_values.get(name) || false;
	}


	get_secret_value(name: string): string {
		return this._service_secret_values.get(name) || null;
	}

	// for now use: https://hub.docker.com/_/vault as the ref implementation


	private _try_load_params_file(){
		// const caller_file = GetCallerFile();
		// const caller_path = path.dirname(caller_file);
		const filename = path.resolve(this._conf_files_dir_path, "params");

		try{
			const params_obj = require(filename);
			this._service_params = params_obj;
		}catch(e){
			throw new Error(`params.js file not found - one is required in path ${this._conf_files_dir_path}`);
		}

	}

	private _load_default_params() {
		// what we can init already
		this._service_params.get_all_params().forEach((param: ServiceParam) => {
			this._service_params_values.set(param.name, param.default_value);
		});
	}

	private _load_default_feature_flags() {
		this._service_params.get_all_feature_flags().forEach((feature_flag: ServiceFeatureFlag) => {
			this._service_feature_flags_values.set(feature_flag.name, feature_flag.default_value);
		});
	}

	private _load_default_secrets() {
		this._service_params.get_all_secrets().forEach((secret: ServiceSecret) => {
			this._service_secret_values.set(secret.name, secret.default_value);
		});
	}

	private _override_from_envvars(): void {
		this._service_params.get_all_params().forEach((param: ServiceParam) => {
			if (process.env.hasOwnProperty(param.name.toUpperCase()) && process.env[param.name.toUpperCase()])
				this._service_params_values.set(param.name, this._convert_from_string(process.env[param.name.toUpperCase()] || "", param.type));
		});

		this._service_params.get_all_feature_flags().forEach((feature_flag: ServiceFeatureFlag) => {
			if (process.env.hasOwnProperty(feature_flag.name.toUpperCase()))
				this._service_feature_flags_values.set(feature_flag.name, this._convert_from_string(process.env[feature_flag.name.toUpperCase()] || "", PARAM_TYPES.BOOL));
			// this._service_feature_flags_values.set(feature_flag.name,  (process.env[feature_flag.name] === "true" || process.env[feature_flag.name] === "1"));
		});

		this._service_params.get_all_secrets().forEach((secret: ServiceSecret) => {
			if (process.env.hasOwnProperty(secret.name.toUpperCase()) && process.env[secret.name.toUpperCase()])
				this._service_secret_values.set(secret.name, process.env[secret.name.toUpperCase()]);
		});
	}


	private _override_from_serviceprovider(): void {

		this._service_params.get_all_params().forEach((param: ServiceParam) => {
			// @ts-ignore
			const val_str = this._configs_provider.get_value(param.name);

			if (val_str)
				this._service_params_values.set(param.name, this._convert_from_string(val_str, param.type));
		});

		this._service_params.get_all_feature_flags().forEach((feature_flag: ServiceFeatureFlag) => {
			// @ts-ignore
			const val_str = this._configs_provider.get_value(feature_flag.name);

			if (val_str)
				this._service_feature_flags_values.set(feature_flag.name, this._convert_from_string(val_str, PARAM_TYPES.BOOL));
		});

		this._service_params.get_all_secrets().forEach((secret: ServiceSecret) => {
			// @ts-ignore
			const val_str = this._configs_provider.get_value(secret.name);

			if (val_str)
				this._service_params_values.set(secret.name, this._convert_from_string(val_str, PARAM_TYPES.STRING));
		});
	}

	private _convert_from_string(value: string, destination_type: ParamType): any {
		switch (destination_type) {
			case PARAM_TYPES.STRING:
				return value;
				break;
			case PARAM_TYPES.INT_NUMBER:
				try {
					const num = Number.parseInt(value);
					return num;
				} catch (e) {
					return null;
				}
				return value;
				break;
			case PARAM_TYPES.FLOAT_NUMBER:
				try {
					const num = Number.parseFloat(value)
					return num;
				} catch (e) {
					return null;
				}
				return value;
				break;
			case PARAM_TYPES.BOOL:
				try {
					const bool_value = value.toLowerCase() == "true" || value == "1" ? true : false
					return bool_value;
				} catch (e) {
					return null;
				}
				return value;
				break;
			default:
				return value;
				break;
		}
	}

}


export class AppBaseConfigs {
	solution_name!: string;
	env!: string;
	app_name!: string;
	app_version!: string;
	app_api_prefix!: string;
	app_api_version!: string;
}