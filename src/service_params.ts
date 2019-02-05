/**
 * Created by pedrosousabarreto@gmail.com on 15/Jan/2019.
 */
"use strict";

import {strEnum} from "./string_utils";

export const PARAM_TYPES = strEnum([
	'STRING',
	'BOOL',
	'NUMBER'
]);

/** type from string enum */
export type ParamType = keyof typeof PARAM_TYPES;

/***
 * ServiceParams
 * An instance of this class is required to configure a service.
 * This will act like the schema of available of parameters and feature flags for a service.
 */

export class ServiceParams{
	private _params:Map<string, ServiceParam>;
	private _feature_flags:Map<string, ServiceFeatureFlag>;

	constructor(){
		this._params = new Map<string, ServiceParam>();
		this._feature_flags = new Map<string, ServiceFeatureFlag>();
	}

	add_param(srv_opt:ServiceParam){
		this._params.set(srv_opt.name, srv_opt);
	}

	get_param(param_name:string):ServiceParam | null{
		return this._params.get(param_name) || null;
	}

	get_all_params():Array<ServiceParam>{
		return Array.from(this._params.values());
	}

	add_feature_flag(feature_flag:ServiceFeatureFlag){
		this._feature_flags.set(feature_flag.name.toUpperCase(), feature_flag);
	}

	get_feature_flag(feature_flag_name:string):ServiceFeatureFlag | null{
		return this._feature_flags.get(feature_flag_name.toUpperCase()) || null;
	}

	get_all_feature_flags():Array<ServiceFeatureFlag>{
		return Array.from(this._feature_flags.values());
	}

}

export class ServiceParam{
	constructor(private _name:string, private _type:ParamType, private _default_value:any, private _description:string){}

	get name():string{ return this._name;}
	get type():ParamType{ return this._type;}
	get default_value():any{ return this._default_value;}
	get description():string{ return this._description;}
}

export class ServiceFeatureFlag{
	constructor(private _name:string, private _default_value:boolean, private _description:string){}

	get name():string{ return this._name; }
	get default_value():boolean{ return this._default_value; }
	get description():string{ return this._description; }
}
