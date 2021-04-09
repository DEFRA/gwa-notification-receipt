# GWA Notification Receipt

> An [Azure Function app](https://azure.microsoft.com/en-gb/services/functions/)
> for receiving callbacks from
> [GOV.UK Notify](https://www.notifications.service.gov.uk/)

The app exposes an HTTP endpoint where Notify can POST a callback to. The
message is checked for correct authorization, added to a queue for processing
before updating a collection is Cosmos DB.

## Functions

The app is made up of a number of functions, each function is explained in more
detail in its' own README:

* [MessageReceiptHttpTrigger](MessageReceiptHttpTrigger/README.md)
* [MessageReceiptQueueTrigger](MessageReceiptQueueTrigger/README.md)
