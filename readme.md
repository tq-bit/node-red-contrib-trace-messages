# Node Red message trace

This module adds a debug node to your node-red instance. It will trace messages and their properties as they flow through your app.

By default, it tracks the `msg.payload` and `msg.topic` properties. You can add custom properties as well.

The node was designed to make debugging complex flows easier. It works well together with [jsoncrack](https://jsoncrack.com/editor) to visualize what nodes a message passes and how its properties change.

If you aren't a developer, but familiar with ChatGPT, you can use the following prompt to have the famous AI explain possible issues to you:

> You are a Javascript developer responsible for a data pipeline. I will provide you an array of objects and your task will be to explain what properties in the object's 'message' property change and how they might affect downstream nodes. If they a downstream node, add the emjoy '❗' in front of the explanation. If they affect several donwstream nodes, add the emjoy '⚠️' in front of the explanation. Each object has a 'sourceNode'. When providing explanations, assume that the sourceNode's name describes a possible logical applied to the message object.
