# Message Receipt Queue Trigger - JavaScript

> Triggers on messages in a queue containing details
> of a message's delivery status received from GOV.UK Notify.

## Detail

The function triggers on messages an Azure Queue Storage queue that have been
added by [MessageReceiptHttpTrigger](../MessageReceiptHttpTrigger). The
messages are processed and added to Cosmos DB providing a record of each
message's delivery status.
