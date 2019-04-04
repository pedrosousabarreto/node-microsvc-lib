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
    }

    info(message?: any, ...optionalParams: any[]): void {
        fluentLogger.emit('info', { message, ...optionalParams });
    }

    warn(message?: any, ...optionalParams: any[]): void {
        fluentLogger.emit('warn', { message, ...optionalParams });
    }

    error(message?: any, ...optionalParams: any[]): void {
        fluentLogger.emit('error', { message, ...optionalParams });
    }

    fatal(message?: any, ...optionalParams: any[]): void {
        fluentLogger.emit('fatal', { message, ...optionalParams });
    }

    create_child(attrs?: object): ILogger {
        if (attrs)
            this._attrs = attrs;

        return this;
    }
}
