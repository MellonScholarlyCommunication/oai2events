# OAI2EVENTS

A bridge between [OAI-PMH](https://www.openarchives.org/pmh/) and [Event Notifications](https://www.eventnotifications.net).

## Dependencies

- [NodeJS](https://nodejs.org/en)

## Install

```
git clone https://github.com/MellonScholarlyCommunication/oai2events
yarn install
```

## Configure

The `config.jsonld` file should contain the OAI-PMH endpoints that needs to be transformed into Event Notifications.

Each OAI-PMH entry should contain the fields:

- `@id` : the baseUrl of the OAI-PMH endpoint
- `@type` : `DefaultRecordResolver` for the default implementation of a OAI-PMH record resolver
- `baseUrl` : a copy of the baseUrl of the OAI-PMH endpoint
- `recordUrlPrefix` : the record OAI-PMH prefix that is used
- `landingPagePrefix` : the prefix of the landing page of the record

The landing page will be the OAI-PMH record identifier with `recordUrlPrefix` replaced by `landingPagePrefix`.

## Run

Run the Radboud University example

```
yarn oai:radboud
```

