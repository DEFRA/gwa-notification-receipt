# Process Receipt - JavaScript

> Triggers on messages in a queue containing details
> of a message's delivery status received from GOV.UK Notify.

## Detail

The function triggers on messages in an Azure Queue Storage queue that have
been added by [ReceiveReceipt](../ReceiveReceipt). The
messages are processed and added to Cosmos DB providing a record of each
message's delivery status.

The raw data received from Notify is altered in the following ways:

* Messages sent to Notify include a reference. The reference is constructed
  from the id of the message that triggered the need to send messages along
  with the receipt id in the format `messageId:receiptId`. The constituent
  parts of the reference are used to populate properties on the receipt in
  order to provide accurate reporting
* To enable the receipt status to be differentiated from an internal receipt
  status, `Notify:` is prepended to whatever status is sent from Notify
