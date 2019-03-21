# node-microsvc-lib
[![Git Commit](https://img.shields.io/github/last-commit/pedrosousabarreto/node-microsvc-lib.svg?style=flat)](https://github.com/pedrosousabarreto/node-microsvc-lib/commits/master)
[![Npm Version](https://img.shields.io/npm/v/node-microsvc-lib.svg?style=flat)](https://www.npmjs.com/package/node-microsvc-lib)
[![NPM Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/node-microsvc-lib.svg?style=flat)](https://www.npmjs.com/package/node-microsvc-lib)



## Installation

```bash
npm install node-microsvc-lib --save
```

## Usage

Creating a microservice app:
 ```javascript
// app.ts

import {Microservice, ConsoleLogger} from "node-microsvc-lib";

// factories/modules
import {RequestLogger} from "./factories/request_logger";
import {HealthCheck} from "./factories/health_check";
import {TestRestCtrl} from "./factories/rest_service";

// configs
import configs = require("./config/config");

const logger = new ConsoleLogger();

// create microservice appv
const app = new Microservice(configs, logger);

app.register_dependency("logger", logger);

app.register_factory("request_logger", RequestLogger);
app.register_factory("test_rest_ctrl", TestRestCtrl);
app.register_factory("health_check", HealthCheck);

process.on("uncaughtException", (err:Error)=>{
   logger.fatal(err);
});

app.init((err?: Error) => {
   if (err)
      return logger.error(err);

   logger.info("APP STARTED");
 });

```

## How configuration works

The *Microservice* instance expects a *ServiceConfigs* instance. 
This *ServiceConfigs* instance requires an instance of *ServiceParams*, an (optional) instance of *IConfigsProvider* and an instance of *AppBaseConfigs* 

Three sets of configuration values exist: 
- Parameters - that can be of type STRING, BOOL, INT_NUMBER or FLOAT_NUMBER;
- Feature Flags - always of boolean type;
- Secrets - always of string type.

### ServiceConfigs *(Required)*
This is the object that the *Microservice* requires to source all its runtime configs.

### ServiceParams *(Required)*
The definition of params, feature flags and secrets required by the service and their default values.

### IConfigsProvider *(Optional)*
Optional instance that fetches all config values from an external service such as consul or hashicorp vault. 

### Load order / precedence
The order of loading:
1. **params.js file** - ServiceParams instance gets loaded along with the default values;
2. **params.ENV_NAME.js file** - the one that overrides values in ServiceParams per env - **if LOCAL_OVERRIDES env var is set**;
3. **IConfigsProvider** - if a correspondent key name exists the value from the provider overrides the current one;
4. **Environment vars** - all parameters can be overridden by passing an uppercase env var with the param key name 

In summary, env vars always win (if defined).

## Pre-requisites for contributing
NVM - Node Version Manager - https://github.com/creationix/nvm
 ```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```

After NVM is installed, execute this to download and install the correct node version:
```bash
nvm install 10.15.0
```
