# Message Receipt HTTP Trigger - JavaScript

> Provide a callback URL for GOV.UK Notify to POST message receipts to.

## Detail

An HTTP endpoint that can be POSTed to with details of a message's delivery
status. The function takes the body, adds it to a queue and responds to
the request with a 200.
