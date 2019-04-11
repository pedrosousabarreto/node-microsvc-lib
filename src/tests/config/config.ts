/**
 * Created by pedrosousabarreto@gmail.com on 15/Jan/2019.
 */


"use strict";

import {ServiceConfigs, AppBaseConfigs} from "../../service_configs";
import {HashicorpVaultProvider} from "../../config_providers/hashicorp_vault";
import {AWSSecretsManagerProvider} from "../../config_providers/aws_secrets_manager";
import {IConfigsProvider} from "../../index";

let app_base_confs = new AppBaseConfigs();
app_base_confs.env = process.env.APP_ENV || 'dev_local';
app_base_confs.solution_name = "my_solution";
app_base_confs.app_name = "my_app";
app_base_confs.app_version = "0.0.1";
app_base_confs.app_api_prefix = "";
app_base_confs.app_api_version = "1";

let provider:IConfigsProvider|null = null;

	/*
	* inject these env vars:
	*
	* AWS_ACCESS_KEY_ID
	* AWS_SECRET_ACCESS_KEY
	* AWS_SESSION_TOKEN
	*
	* */
//
// const aws_secrets_manager_provider = new AWSSecretsManagerProvider(
// 	app_base_confs.solution_name,
// 	"development/app/key_name",
// 	"eu-central-1",
// 	{
// 		accessKeyId: process.env["AWS_ACCESS_KEY_ID"] || "",
// 		secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"] || "",
// 		sessionToken: process.env["AWS_SESSION_TOKEN"] || ""
// 	}
// );



//
// const vault_url = "http://localhost:8200";
// const vault_token = "myroot";
// const vault_provider = new HashicorpVaultProvider(app_base_confs.solution_name, app_base_confs.app_name, vault_url, vault_token);


// exports a ServiceConfigs instance
export = new ServiceConfigs(__dirname, app_base_confs, provider);
// export = new ServiceConfigs(svc_params, aws_secrets_manager_provider, app_base_confs);
// export = new ServiceConfigs(svc_params, vault_provider, app_base_confs);