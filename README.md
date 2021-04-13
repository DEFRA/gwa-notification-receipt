# GWA Notification Receipt

> An [Azure Function app](https://azure.microsoft.com/en-gb/services/functions/)
> for receiving callbacks from
> [GOV.UK Notify](https://www.notifications.service.gov.uk/)

The app exposes an HTTP endpoint where Notify can POST a callback to. The
message is checked for correct authorization, added to a queue for processing
before updating a collection is Cosmos DB.

## Functions

The app is made up of a number of functions, each function is explained in more
detail in its' own README:

* [MessageReceiptHttpTrigger](MessageReceiptHttpTrigger/README.md)
* [MessageReceiptQueueTrigger](MessageReceiptQueueTrigger/README.md)

## Development

The best place to start for an overall view of how JavaScript Functions work in
Azure is the
[Azure Functions JavaScript developer guide](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=v2).
From there follow the appropriate link to the documentation specific to
your preferred development environment i.e.
[Visual Studio Code](https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-node)
or
[command line](https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-node?tabs=azure-cli%2Cbrowser).

The documentation within this repo assumes the `command line` setup has been
completed, specifically for
[Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).

## Running Locally

To start the function app run `func start`.

### Pre-requisites

The app uses Azure Storage queues. When working locally
[Azurite](https://github.com/Azure/Azurite) can be used to emulate storage.
Follow the
[instructions](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azurite)
for your preferred installation option.

The app uses Cosmos DB. Whilst an emulator can be
[installed locally](https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator?tabs=cli%2Cssl-netstd21)
the effort involved is significant in comparison to using the real thing. On
this basis it is advisable to use a real Cosmos DB instance.

The app uses `local.settings.json` for local development.
[example.local.settings.json](example.local.settings.json) can be used as the
basis as it contains all required env vars with the exception of secrets which
have been removed. The connection string for Azurite is included.

## Notify Set Up

The app receives message receipts from Notify. Getting set up on Notify is
straight forward, simply follow the
[documentation](https://www.notifications.service.gov.uk/using-notify/get-started).

A callback needs to be set up for the service created in Notify, additional
information in the
[documentation](https://docs.notifications.service.gov.uk/rest-api.html#callbacks).
The callback requires a bearer token be set along with the callback URL.

### Callback URL

In order to test the function it would ideally be deployed so that Notify can
access the URL. There are options available to expose localhost to the internet
such as [ngrok](https://ngrok.com/) and
[localtunnel](https://localtunnel.github.io/www/), however, deploying the
function is simple, more robust and safer.

HTTP Azure Functions can be set to require a
[key for access](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=csharp#authorization-keys).
The callback URL set in Notify needs to include the key for the function.

### Bearer token

Notify requires a bearer token to be set. It is used in the
[Authorization header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization).
The function checks the header is the expected value as set in the env var
`NOTIFY_BEARER_HEADER`. Note that the check is against the full header value,
no manipulation of it takes place for simplicity.

## License

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT
LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and
applications when using this information.

> Contains public sector information licensed under the Open Government license
> v3

### About the license

The Open Government Licence (OGL) was developed by the Controller of Her
Majesty's Stationery Office (HMSO) to enable information providers in the
public sector to license the use and re-use of their information under a common
open licence.

It is designed to encourage use and re-use of information freely and flexibly,
with only a few conditions.
