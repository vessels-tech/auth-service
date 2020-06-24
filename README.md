# Auth Service (Work in Progress)
[![Git Commit](https://img.shields.io/github/last-commit/mojaloop/auth-service.svg?style=flat)](https://github.com/mojaloop/auth-service/commits/master)
[![Git Releases](https://img.shields.io/github/release/mojaloop/auth-service.svg?style=flat)](https://github.com/mojaloop/auth-service/releases)
[![Npm Version](https://img.shields.io/npm/v/@mojaloop/auth-service.svg?style=flat)](https://www.npmjs.com/package/@mojaloop/auth-service)
[![NPM Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@mojaloop/auth-service.svg?style=flat)](https://www.npmjs.com/package/@mojaloop/auth-service)
[![CircleCI](https://circleci.com/gh/mojaloop/auth-service.svg?style=svg)](https://circleci.com/gh/mojaloop/auth-service)

Mojaloop central AuthZ + AuthN service. Currently for FIDO implementation in a Mojaloop switch.

## Overview

- [Documentation](./docs/README.md)

## Setup

### Clone repo
```bash
git clone git@github.com:mojaloop/AuthService.git
```

### Improve local DNS resolver
Add the `127.0.0.1   auth-service.local` entry in your `/etc/hosts` so the _auth-service_ is reachable on `http://auth-service.local:4004`. Elsewhere use `http://localhost:4004`

### Install service dependencies
```bash
cd auth-service
npm ci
```

### Run local dockerized _auth-service_
```bash
npm run docker:build
npm run docker:run
```

To check the auth-service health visit [http://auth-service.local:4004/health](http://auth-service.local:4004/health)

### Run locally with database in `docker-compose` 

```bash
docker-compose up -d mysql
npm run start
```

### Updating the OpenApi (Swagger) spec

To reduce the amount of copy/paste across Mojaloop repositories, we are testing out a new approach to keeping our OpenAPI files up to date.

In our repo, we keep a `template.yaml` file, which, when combined with our [common api snippets](https://github.com/mojaloop/api-snippets), will render our `swagger.json` file for this project.

> **Note:** Make sure the `swagger.json` file _is_ in git, to protect from the common snippets being modified, and possibly injecting nasty surprises at build time.

```bash

./node_modules/.bin/multi-file-swagger -o yaml api.yaml > src/interface/swagger.json
```

