function handleNodeTrace(node, ev) {
	function getMessageId(ev) {
		return ev.msg._msgid;
	}

	function getSourceNode(ev) {
		const { type, name, id } = ev.source.node;
		return { id, type, name };
	}

	function getDestNode(ev) {
		const { type, name, id } = ev.destination.node;
		return { id, type, name };
	}

	function getHasNextNode(ev) {
		return ev.destination.node._wireCount > 0;
	}

	function getMessage(ev) {
		const { topic, payload } = ev.msg;

		// Add topic and payload to message
		const message = {
			topic,
			payload,
		};

		// Append extra properties to be traced if there are any
		if (node.extraMessagePropsToBeTraced.length > 0) {
			node.extraMessagePropsToBeTraced.forEach((propertyToBeTraced) => {
				message[propertyToBeTraced] = ev.msg[propertyToBeTraced] || null;
			});
		}

		return message;
	}

	const messageTraceId = getMessageId(ev);
	const destNode = getDestNode(ev);
	const sourceNode = getSourceNode(ev);
	const hasNextNode = getHasNextNode(ev);
	const message = getMessage(ev);

	// Init message trace hash if it does not exist yet
	if (!node.trace[messageTraceId]) {
		node.trace[messageTraceId] = {
			traceList: [],
		};
	}

	// Add to the current message trace list
	node.trace[messageTraceId].traceList.push({
		sourceNode,
		destNode,
		message,
	});

	// If no next node is known, send the current message trace
	if (!hasNextNode) {
		const { traceList } = node.trace[messageTraceId];
		const traceMap = traceList.reduce((previous, current, index) => {
			previous[index] = current;
			return previous;
		}, {})
		const msg = { payload: { traceList, traceMap } };
		node.send(msg);
		delete node.trace[messageTraceId];
	}
}

module.exports = function (RED) {
	function Trace(config) {
		RED.nodes.createNode(this, config);

		this.name = config.name;
		this.extraMessagePropsToBeTraced =
			config.extraMessagePropsToBeTraced?.split(',').map((prop) => prop.trim()) || [];
		this.trace = {};
		RED.hooks.add('preDeliver', (ev) => {
			if (ev?.source?.node?.type !== 'trace') {
				handleNodeTrace(this, ev);
			}
		});
	}
	RED.nodes.registerType('trace', Trace);
};
