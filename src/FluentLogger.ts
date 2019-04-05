/**
 * Created by pedrosousabarreto@gmail.com on 15/Jan/2019.
 */
"use strict";

import fluentLogger from 'fluent-logger';

import {ILogger} from "./interfaces";

export class FluentLogger implements ILogger {
    private _attrs: object = {};

    debug(message?: any, ...optionalParams: any[]): void {
        console.log.apply(this, [message, ...optionalParams]);
        fluentLogger.emit('debug', { message, ...optionalParams });
    }

    info(message?: any, ...optionalParams: any[]): void {
        console.info.apply(this, [message, ...optionalParams]);
        fluentLogger.emit('info', { message, ...optionalParams });
    }

    warn(message?: any, ...optionalParams: any[]): void {
        console.warn.apply(this, [message, ...optionalParams]);
        fluentLogger.emit('warn', { message, ...optionalParams });
    }

    error(message?: any, ...optionalParams: any[]): void {
        console.error.apply(this, [message, ...optionalParams]);
        fluentLogger.emit('error', { message, ...optionalParams });
    }

    fatal(message?: any, ...optionalParams: any[]): void {
        console.error.apply(this, [message, ...optionalParams]);
        fluentLogger.emit('fatal', { message, ...optionalParams });
    }

    create_child(attrs?: object): ILogger {
        if (attrs)
            this._attrs = attrs;

        return this;
    }
}
