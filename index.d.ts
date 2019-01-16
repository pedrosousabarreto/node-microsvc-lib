import {strEnum} from "./libs/string_utils";

export as namespace NodeMicroSvcLib;

export interface Dictionary<T> { [key: string]: T; }
export type IterableCollection<T> = T[] | IterableIterator<T> | Dictionary<T>


export interface ILogger {
	debug(message?: any, ...optionalParams: any[]): void;
	info(message?: any, ...optionalParams: any[]): void;
	warn(message?: any, ...optionalParams: any[]): void;
	error(message?: any, ...optionalParams: any[]): void;
	fatal(message?: any, ...optionalParams: any[]): void;

	create_child(attrs?:object):ILogger;
}

export interface IDiFactory {
	name: string;
	init(callback: (err?: Error) => void):void;
	destroy(callback:(err?:Error)=>void):void;
}

export interface IConfigsProvider{
	// TODO complete IConfigsProvider
}


declare class ConsoleLogger implements ILogger {
	debug(message?: any, ...optionalParams: any[]): void;
	info(message?: any, ...optionalParams: any[]): void;
	warn(message?: any, ...optionalParams: any[]): void;
	error(message?: any, ...optionalParams: any[]): void;
	fatal(message?: any, ...optionalParams: any[]): void;
	create_child(attrs?: object): ILogger;
}


declare class DiContainer {
	constructor(logger?:ILogger);
	register_factory(name: string, factory: any):void;
	register_dependency(name: string, dep: any) :void;
	has(name: string):boolean;
	get(name: string): any;
}


declare class Microservice extends DiContainer {
	constructor(configs: ServiceConfigs, logger?:ILogger);
	init(callback: (err?: Error) => void):void;
}

declare class AppBaseConfigs{
	solution_name: string;
	env:string;
	app_name:string;
	app_version:string;
	app_api_prefix:string;
	app_api_version:string;
}

declare class ServiceConfigs{
	constructor(service_params: ServiceParams, configs_provider:IConfigsProvider | null, base_configs:AppBaseConfigs);

	init(callback:(err?:Error)=>void):void;

	// getters
	readonly env:string;
	readonly solution_name:string;
	readonly app_name:string;
	readonly app_version:string;
	readonly app_api_prefix:string;
	readonly app_api_version:string;
	// computed
	readonly dev_mode:boolean;
	readonly app_full_name:string;
	readonly app_full_name_version:string;
	readonly app_base_url:string;
	readonly instance_id:string;
	readonly instance_name:string;

	get_param_value(name:string):any;
	get_feature_flag_value(name:string):boolean;
}


declare class ServiceParams{
	constructor()

	add_param(srv_opt:ServiceParam):void;
	get_param(param_name:string):ServiceParam | null;
	get_all_params():Array<ServiceParam>;

	add_feature_flag(feature_flag:ServiceFeatureFlag):void;
	get_feature_flag(feature_flag_name:string):ServiceFeatureFlag | null;
	get_all_feature_flags():Array<ServiceFeatureFlag>;
}

declare enum PARAM_TYPES {
	STRING = "STRING",
	BOOL = "BOOL",
	NUMBER = "NUMBER"
}


declare type ParamType= 'STRING' | 'BOOL' | 'NUMBER';

declare class ServiceParam{
	constructor(name:string, type:ParamType, default_value:any, description:string);

	readonly name:string;
	readonly type:ParamType;
	readonly default_value:any;
	readonly description:string;
}

declare class ServiceFeatureFlag{
	constructor(name:string, default_value:boolean, description:string);

	readonly name:string;
	readonly default_value:boolean;
	readonly description:string;
}
