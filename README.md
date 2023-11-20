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

## Demo

Run the Radboud University demo

```
yarn oai:radboud
```

## Documentation

The oai2event bridge will create for every record in an OAI-PMH response a ActivityStreams2 event notification in output directory (by default `out`).

Start a new conversion by running the `dist/client.js` script with an OAI-PMH baseurl:

```
node dist/client.js <baseurl>
```

The OAI-PMH parameters can be set with:

- `--metadataPrefix` : the default metadata prefix is `oai_dc`
- `--from` : the default date is yesterday
- `--until`
- `--setSpec`

Dates can also be specified using an minimum and maximum offset:

- `--offset` : the from offset in days
- `--offset2` : the util offset in days

The maximum number of records can be to be transformed can be set with:

- `--max` : the maximum number of records per oai2events run to transform
- `--max-no-del` : the maximum number of non-deleted records per oai2events run to transform

The contents of the Event Notifications can be configures with using JSON configuration files:

- `config/context.json`
- `config/actor.json` 
- `config/origin.json`
- `config/target.json`

The `config/type_map.json` defines for which type of OAI-PMH events a particular Event Notification is created:

- `new` : all OAI-PMH records that are discovered the first time by oai2events
- `update` : all OAI-PMH records known by oai2events that were updated since last harvest
- `delete` : all OAI-PMH records that were marked as deleted

The cache of known OAI-PMH records is in `cache.db` this can be set with the `--database` parameter.

In normal operation the oai2event scripts can be run as a cron script for periodical incremental transformation of OAI-PMH records into event notifications.