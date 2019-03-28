"use strict";

import {IConfigsProvider} from "../interfaces";
import AWS = require("aws-sdk");
import {AWSError, SecretsManager} from "aws-sdk";

export class AWSSecretsManagerProvider implements IConfigsProvider {
	private _solution_name:string;
	private _role_arn: string;
	private _role_session_name: string;
	private _region: string;
	private _kvs: Map<string, string>;
	private _secret_name: string;

	public get solution_name(): string {
		return this._solution_name;
	}

	constructor(solution_name:string, secret_name: string, role_arn: string, role_session_name: string, region: string) {
		this._solution_name = solution_name;
		this._role_arn = role_arn;
		this._role_session_name = role_session_name;
		this._region = region;
		this._kvs = new Map<string, string>();
		this._secret_name = secret_name;
	}

	init(keys: string[], callback: (err?: Error) => void): void {
		this._fetch_all_from_aws_secrets_manager(keys, callback);
	}

	get_value(key_name: string): string | null {
		return this._kvs.get(key_name) || null;
	}

	private _fetch_all_from_aws_secrets_manager(keys: string[], callback: (err?: Error) => void	) {
		// const sts = new AWS.STS({});
		//
		// const params = {
		// 	DurationSeconds: 3600,
		// 	SerialNumber: "YourMFASerialNumber",
		// 	TokenCode: "123456"
		// };
		//
		// sts.getSessionToken(params, function(err, data) {});


		const role_params = {
			RoleArn: this._role_arn,
			RoleSessionName: this._role_session_name
		};

		// sts.assumeRole(role_params, (err:AWSError, data:AWS.STS.AssumeRoleResponse) => {
		// 	if (err)
		// 		return callback(err);
		//
		// 	// successful response

		const accessKeyId:string = process.env["AWS_ACCESS_KEY_ID"] || "";
		const secretAccessKey:string = process.env["AWS_SECRET_ACCESS_KEY"] || "";
		const sessionToken:string = process.env["AWS_SESSION_TOKEN"] || "";
		const creds = new AWS.Credentials(accessKeyId, secretAccessKey, sessionToken);


			const secrets_manager = new AWS.SecretsManager({region: this._region, credentials: creds});

			let secrets: any = {};

			secrets_manager.getSecretValue(
				{SecretId: this._secret_name},
				(err:AWSError, secret_data:SecretsManager.Types.GetSecretValueResponse) => {
					if (err)
						return callback(err);

					try {
						// successful response
						secrets = JSON.parse(String(secret_data.SecretString));

						keys.forEach((key: string) => {
							if (key in secrets) {
								this._kvs.set(key, secrets[key]);
							}
						});
						callback();
					}catch(e){
						callback(e);
					}

				}
			);

		// });
	}
}
