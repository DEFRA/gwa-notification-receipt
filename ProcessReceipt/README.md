# Process Receipt - JavaScript

> Triggers on messages in a queue containing details
> of a message's delivery status received from GOV.UK Notify.

## Detail

The function triggers on messages in an Azure Queue Storage queue that have
been added by [ReceiveReceipt](../ReceiveReceipt). The
messages are processed and added to Cosmos DB providing a record of each
message's delivery status. To enable the receipt status to be differentiated
from an internal receipt status, `Notify:` is prepended to whatever status is
sent from Notify.
