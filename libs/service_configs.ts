/**
 * Created by pedrosousabarreto@gmail.com on 15/Jan/2019.
 */
"use strict";

/*
* to be passed to a server constructor
* - needs to be fed a IConfigsProvider and a ServiceParams
* */
import * as uuid from "uuid";
import {ServiceFeatureFlag, ServiceParam, ServiceParams} from "./service_params";

import {IConfigsProvider} from "./interfaces";

export class ServiceConfigs{
	private _service_params: ServiceParams;
	private _configs_provider: IConfigsProvider | null;
	private _service_params_values: Map<string,any>;
	private _service_feature_flags_values: Map<string,boolean>;
	private _solution_name:string;
	private _env:string;
	private _app_name:string;
	private _app_version:string;
	private _app_api_prefix:string;
	private _app_api_version:string;
	// computed
	private _dev_mode:boolean;
	private _app_full_name:string;
	private _app_full_name_version:string;
	private _app_base_url:string;
	private _instance_id:string;
	private _instance_name:string;




	constructor(service_params: ServiceParams, configs_provider:IConfigsProvider | null, base_configs:AppBaseConfigs){
		this._service_params = service_params;
		this._configs_provider = configs_provider;

		this._service_params_values = new Map<string, any>();
		this._service_feature_flags_values = new Map<string, boolean>();

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
		this._app_full_name_version = this._app_full_name +"__" + this._app_version;
		this._app_base_url = "/api/v" + this._app_api_version + (this._app_api_prefix ? "/" + this._app_api_prefix : "");

		// instance specific
		this._instance_id = uuid.v4();
		this._instance_name = this._app_full_name_version + "__" + this._instance_id;


		// what we can init already
		this._service_params.get_all_params().forEach((param:ServiceParam)=>{
			if(process.env.hasOwnProperty(param.name.toUpperCase()) && process.env[param.name.toUpperCase()])
				this._service_params_values.set(param.name, process.env[param.name.toUpperCase()]);
			else
				this._service_params_values.set(param.name, param.default_value);
		});

		this._service_params.get_all_feature_flags().forEach((feature_flag:ServiceFeatureFlag)=>{
			if(process.env.hasOwnProperty(feature_flag.name))
				this._service_feature_flags_values.set(feature_flag.name, (process.env[feature_flag.name]==="true" || process.env[feature_flag.name]==="1") );
			else
				this._service_feature_flags_values.set(feature_flag.name, feature_flag.default_value);
		});

	}

	// get everything it needs and prepare the object to be used
	init(callback:(err?:Error)=>void){
		// create an internal structure with values of params and feature_flags
		// so get_param_value  and get_feature_flag_value can work

		// go to consul or whatever configuration service

		return callback();
	}

	// getters
	get env(){ return this._env; }
	get solution_name(){ return this._solution_name; }
	get app_name(){ return this._app_name; }
	get app_version(){ return this._app_version; }
	get app_api_prefix(){ return this._app_api_prefix; }
	get app_api_version(){ return this._app_api_version; }
	// computed
	get dev_mode(){ return this._dev_mode; }
	get app_full_name(){ return this._app_full_name; }
	get app_full_name_version(){ return this._app_full_name_version; }
	get app_base_url(){ return this._app_base_url; }
	get instance_id(){ return this._instance_id; }
	get instance_name(){ return this._instance_name; }


	get_param_value(name:string):any{
		return this._service_params_values.get(name) || null;
	}

	get_feature_flag_value(name:string):boolean{
		return this._service_feature_flags_values.get(name) || false;
	}

}


export class AppBaseConfigs{
	solution_name!: string;
	env!:string;
	app_name!:string;
	app_version!:string;
	app_api_prefix!:string;
	app_api_version!:string;
}