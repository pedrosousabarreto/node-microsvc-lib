"use strict";

import { IConfigsProvider } from "../interfaces";
import AWS = require("aws-sdk");

export class AWSSecretProvider implements IConfigsProvider {
  private _solution_name: string;
  private _role_arn: string;
  private _role_session_name: string;
  private _region: string;
  private _kvs: any;
  private _secret_name: string;

  public get solution_name(): string {
    return this._solution_name;
  }

  constructor(
    solution_name: string,
    role_arn: string,
    role_session_name: string,
    region: string
  ) {
    this._solution_name = solution_name;
    this._role_arn = role_arn;
    this._role_session_name = role_session_name;
    this._region = region;
    this._kvs = {};
    this._secret_name = solution_name;
  }

  init(keys: string[], callback: (err?: Error) => void): void {
    this._fetch_all_from_aws_secrets_manager(keys, callback);
  }

  get_value(key_name: string): string | null {
    return this._kvs[key_name] || null;
  }

  private _fetch_all_from_aws_secrets_manager(
    keys: string[],
    callback: (err?: Error) => void
  ) {
    let sts = new AWS.STS({});

    let role_params = {
      RoleArn: this._role_arn,
      RoleSessionName: this._role_session_name
    };
    sts.assumeRole(role_params, (err, data) => {
      if (err) {
        // an error occurred
        console.log(err, err.stack);
        return callback(err);
      }
      // successful response
      else console.log(data);
      let secrets_manager = new AWS.SecretsManager({
        region: this._region,
        ...data.Credentials
      });
      const secrets = this._get_secrets(secrets_manager, this._secret_name);
      keys.forEach((key: string) => {
        if (key in secrets) {
          this._kvs[key] = secrets[key];
        }
      });
      callback();
    });
  }

  private _get_secrets(
    secrets_manager: AWS.SecretsManager,
    secret_id: string
  ): any {
    var secrets = {};
    secrets_manager.getSecretValue({ SecretId: secret_id }, function(
      err,
      secret_data
    ) {
      if (err)
        // an error occurred
        console.log(err, err.stack);
      // successful response
      else console.log(secret_data);
      secrets = JSON.parse(String(secret_data.SecretString));
    });
    return secrets;
  }
}
