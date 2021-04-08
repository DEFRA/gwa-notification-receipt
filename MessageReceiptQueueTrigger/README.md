# Message Receipt Queue Trigger - JavaScript

> Respond to messages in Azure Queue Storage containing the details of a
> message receipt received from GOV.UK Notify.

## Detail

A message is added a storage queue, triggering the function. The message
contains the information from the receipt sent by GOV.UK Notify. The function
updates the DB with the appropriate details.
