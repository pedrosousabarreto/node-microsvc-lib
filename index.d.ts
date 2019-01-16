
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