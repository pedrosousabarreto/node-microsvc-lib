/**
 * Created by pedro.barreto@bynder.com on 15/Jan/2019.
 */
"use strict";

import {ILogger} from "./interfaces";

export class ConsoleLogger implements ILogger {
	private _attrs:object = {};

	debug(message?: any, ...optionalParams: any[]): void{

		console.log.apply(this, [message, ...optionalParams]);
	}

	info(message?: any, ...optionalParams: any[]): void{
		console.info.apply(this, [message, ...optionalParams]);
	}

	warn(message?: any, ...optionalParams: any[]): void{
		console.warn.apply(this, [message, ...optionalParams]);
	}

	error(message?: any, ...optionalParams: any[]): void{
		console.error.apply(this, [message, ...optionalParams]);
	}

	fatal(message?: any, ...optionalParams: any[]): void{
		console.error.apply(this, [message, ...optionalParams]);
	}

	create_child(attrs?: object): ILogger {
		if(attrs)
			this._attrs = attrs;

		return this;
	}
}
