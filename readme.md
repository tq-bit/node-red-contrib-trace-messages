# Node Red message trace

This module adds two debug nodes to your node-red instance. Both are meant to create a trace from how the message went through your flows. This is especially useful when trying to debug bigger flows.

The idea is as follows:

- Each time a message starts to flow, a transaction is created
- This transaction starts with the first node the message passes and ends with the final one
- Each time, right before the message is passed ahead to the next node, a snapshot is created
- This snapshot shows the current state of the flow right before the message was passed ahead
- By looking at transactions and snapshots, you can see how the message went through your flows

By looking at these transactions and snapshots, you're able to keep track of your flow's state.

## Node

![](.github/assets/demo.png)

### Usage

Depending on your needs, draw one or both nodes into your flow. Each time a `preDeliver` hook is triggered, they will start to create a snapshot or build up a transaction

- The `snapshot` node will send one message every time any node sends a message
- The `transaction` will send once a flow ends. This means when a node has no next node connected to it.

You can either analyze these messages one by one or use a dedicated software to store and display them.

### Example transaction

<details>
<summary>Click to expand</summary>

<pre>
<code>{
  "id": "7638d6e34cedd04a",
  "msgid": "798279120a2bc4d2",
  "start": 1706291131979,
  "end": 1706291132056,
  "steps": [
    {
      "node": "inject-d5534eb0c652c49b",
      "createdAt": 1706291131979,
      "snapshotId": "798279120a2bc4d2-d5534eb0c652c49b-0"
    },
    {
      "node": "function-Set message topic",
      "createdAt": 1706291131980,
      "snapshotId": "798279120a2bc4d2-e720ad3fda390317-0"
    },
    {
      "node": "function-Set message payload",
      "createdAt": 1706291131980,
      "snapshotId": "798279120a2bc4d2-061d8e72a9f3b7da-0"
    },
    {
      "node": "function-Set msg.tray props",
      "createdAt": 1706291131980,
      "snapshotId": "798279120a2bc4d2-6d2ea66d942a61ab-0"
    },
    {
      "node": "http request-Make HTTP Request",
      "createdAt": 1706291132056,
      "snapshotId": "798279120a2bc4d2-5213280d268d46ee-0"
    }
  ]
}
</code>
</pre>
</details>

### Example Snapshot

<details>
<summary>Click to expand</summary>

<pre>
<code>{
  "id": "798279120a2bc4d2-5213280d268d46ee-0",
  "node": "http request-Make HTTP Request",
  "createdAt": 1706291132056,
  "msg": {
    "_msgid": "798279120a2bc4d2",
    "payload": "{\n  \"userId\": 1,\n  \"id\": 1,\n  \"title\": \"delectus aut autem\",\n  \"completed\": false\n}",
    "topic": "Trace me",
    "tray": [
      "One",
      "Two",
      "Three"
    ],
    "statusCode": 200,
    "headers": {
      "date": "Fri, 26 Jan 2024 17:45:32 GMT",
      "content-type": "application/json; charset=utf-8",
      "content-length": "83",
      "connection": "keep-alive",
      "report-to": "{\"group\":\"heroku-nel\",\"max_age\":3600,\"endpoints\":[{\"url\":\"https://nel.heroku.com/reports?ts=1699752124&sid=e11707d5-02a7-43ef-b45e-2cf4d2036f7d&s=skaKxrbiIhywhXvbeO7mNJqywVneznPNDj4G0m%2BwPzs%3D\"}]}",
      "reporting-endpoints": "heroku-nel=https://nel.heroku.com/reports?ts=1699752124&sid=e11707d5-02a7-43ef-b45e-2cf4d2036f7d&s=skaKxrbiIhywhXvbeO7mNJqywVneznPNDj4G0m%2BwPzs%3D",
      "nel": "{\"report_to\":\"heroku-nel\",\"max_age\":3600,\"success_fraction\":0.005,\"failure_fraction\":0.05,\"response_headers\":[\"Via\"]}",
      "x-powered-by": "Express",
      "x-ratelimit-limit": "1000",
      "x-ratelimit-remaining": "999",
      "x-ratelimit-reset": "1699752164",
      "vary": "Origin, Accept-Encoding",
      "access-control-allow-credentials": "true",
      "cache-control": "max-age=43200",
      "pragma": "no-cache",
      "expires": "-1",
      "x-content-type-options": "nosniff",
      "etag": "W/\"53-hfEnumeNh6YirfjyjaujcOPPT+s\"",
      "via": "1.1 vegur",
      "cf-cache-status": "HIT",
      "age": "19415",
      "accept-ranges": "bytes",
      "server": "cloudflare",
      "cf-ray": "84ba91f7489b040c-FRA",
      "alt-svc": "h3=\":443\"; ma=86400",
      "x-node-red-request-node": "7e83e64c"
    },
    "responseUrl": "https://jsonplaceholder.typicode.com/todos/1",
    "redirectList": [],
    "retry": 0
  }
}
</code>
</pre>
</details>

## Support and Feedback

If you encounter any issues or have any feedback regarding the Node-RED SSE Package, please feel free to open an issue on the package's [GitHub repository](https://github.com/tq-bit/node-red-contrib-trace-messages). I appreciate your feedback and will do my best to address any problems or feature requests.

## License

The Node-RED SSE Package is released under the Apache 2.0 license. Please refer to the `license` file in the package repository for more information.