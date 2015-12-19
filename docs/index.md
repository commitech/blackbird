# Welcome to Blackbird API Documentation

This documentation will lead you on how to use Blackbird API. With Blackbird API, you can get access to NUSSU commIT duty website data in machine-readable JSON format.

To access the data you just send a GET request (unless otherwise specified for some API) to address [Blackbird location]/api/v1/{methodName} with method-specific parameters. Each method description has an example URL.

Each method call returns a JSON-object with three possible fields: `status`, `comment` and `result`.
* Status is either `OK` or `FAILED`.
* If status is `FAILED` then comment contains the reason why the request failed. If status is `OK`, then there is no comment.
* If status is `OK` then result contains method-dependent JSON-element which will be described for each method separately. If status is `FAILED`, then there is no result.