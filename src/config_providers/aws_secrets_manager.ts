"use strict";

import {IConfigsProvider} from "../interfaces";
import AWS = require("aws-sdk");
import {AWSError, SecretsManager} from "aws-sdk";
import * as assert from "assert";



export class AWSSecretsManagerProvider implements IConfigsProvider {
	private _solution_name: string;
	private _region: string;
	private _kvs: Map<string, string>;
	private _secret_name: string;
	private _aws_creds: IAWSCredentials;

	public get solution_name(): string {
		return this._solution_name;
	}

	constructor(solution_name: string, secret_name: string, region: string, aws_creds:IAWSCredentials) {
		this._kvs = new Map<string, string>();

		this._solution_name = solution_name;
		this._region = region;
		this._secret_name = secret_name;
		this._aws_creds = aws_creds;

		assert.ok(this._region);
		assert.ok(this._secret_name);
		assert.ok(this._aws_creds.accessKeyId);
		assert.ok(this._aws_creds.secretAccessKey);
		// assert.ok(this._aws_creds.sessionToken); // this is optional
	}

	init(keys: string[], callback: (err?: Error) => void): void {
		this._fetch_all_from_aws_secrets_manager(keys, callback);
	}

	get_value(key_name: string): string | null {
		return this._kvs.get(key_name) || null;
	}

	private _fetch_all_from_aws_secrets_manager(keys: string[], callback: (err?: Error) => void) {

		const creds = new AWS.Credentials(this._aws_creds.accessKeyId, this._aws_creds.secretAccessKey, this._aws_creds.sessionToken);
		const secrets_manager = new AWS.SecretsManager({region: this._region, credentials: creds});

		secrets_manager.getSecretValue(
			{SecretId: this._secret_name},
			(err: AWSError, secret_data: SecretsManager.Types.GetSecretValueResponse) => {
				if (err)
					return callback(err);

				try {
					// successful response
					const secrets = JSON.parse(String(secret_data.SecretString));

					keys.forEach((key: string) => {
						if (key in secrets) {
							this._kvs.set(key, secrets[key]);
						}
					});
					callback();
				} catch (e) {
					callback(e);
				}

			}
		);

	}
}


export interface IAWSCredentials{
	accessKeyId:string;
	secretAccessKey:string;
	sessionToken?:string;
}