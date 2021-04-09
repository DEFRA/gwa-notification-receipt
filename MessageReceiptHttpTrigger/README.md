# Message Receipt HTTP Trigger - JavaScript

> Provides a callback URL for GOV.UK Notify to POST message receipts to.

## Detail

An HTTP endpoint to be POST'ed to with details of a message's delivery
status. The function will check the request for a valid
[Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)
header. If authorization is successful the message will be added to a queue.

Possible responses:

| Status Code                                                         | Reason                                                                  |
| -----------                                                         | ------                                                                  |
| [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) | Request has been processed successfully                                 |
| [401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401) | Authorization header has not been sent                                  |
| [403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403) | Authorization header has been sent but doesn't match the expected value |
| [500](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500) | There has been an unexpected problem encountered during execution       |
