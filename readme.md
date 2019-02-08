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

## Pre-requisites for contributing
NVM - Node Version Manager - https://github.com/creationix/nvm
 ```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```

After NVM is installed, execute this to download and install the correct node version:
```bash
nvm install 10.15.0
```
