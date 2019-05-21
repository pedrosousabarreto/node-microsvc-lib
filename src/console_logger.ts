/**
 * Created by pedrosousabarreto@gmail.com on 15/Jan/2019.
 */
'use strict';

import { ILogger, LogLevels, MessageType } from './interfaces';

export class ConsoleLogger implements ILogger {
  private _attrs: object = {};

  private buildMessage(
    message: string,
    level: LogLevels,
    correlationId?: string,
  ) {
    if (typeof message !== 'string') {
      return message;
    }
    const newMessage: MessageType = {
      correlation_id: correlationId,
      log_level: level,
      message,
    };
    return newMessage
  }

  debug(message?: any, correlationId?: string, ...optionalParams: any[]): void {
    const newMessage = this.buildMessage(
      message,
      LogLevels.DEBUG,
      correlationId,
    );
    console.log.apply(this, [newMessage, ...optionalParams]);
  }

  info(message?: any, correlationId?: string, ...optionalParams: any[]): void {
    const newMessage = this.buildMessage(
      message,
      LogLevels.INFO,
      correlationId,
    );
    console.info.apply(this, [newMessage, ...optionalParams]);
  }

  warn(message?: any, correlationId?: string, ...optionalParams: any[]): void {
    const newMessage = this.buildMessage(
      message,
      LogLevels.WARN,
      correlationId,
    );
    console.warn.apply(this, [newMessage, ...optionalParams]);
  }

  error(message?: any, correlationId?: string, ...optionalParams: any[]): void {
    const newMessage = this.buildMessage(
      message,
      LogLevels.ERROR,
      correlationId,
    );
    console.error.apply(this, [newMessage, ...optionalParams]);
  }

  fatal(message?: any, correlationId?: string, ...optionalParams: any[]): void {
    const newMessage = this.buildMessage(
      message,
      LogLevels.FATAL,
      correlationId,
    );
    console.error.apply(this, [newMessage, ...optionalParams]);
  }

  create_child(attrs?: object): ILogger {
    if (attrs) this._attrs = attrs;

    return this;
  }
}
