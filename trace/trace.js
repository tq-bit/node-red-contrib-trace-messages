const path = require('path');

function deepCompareObjects(a, b, path = '') {
	const results = [];
	const checkTypeHasChanged = (a, b) => {
		const aIsArray = Array.isArray(a);
		const bIsArray = Array.isArray(b);
		if (aIsArray !== bIsArray) {
			return true;
		}
		return typeof a !== typeof b;
	};

	const checkValueHasChanged = (a, b) => {
		return typeof a === 'object' ? JSON.stringify(a) !== JSON.stringify(b) : a !== b;
	};

	// Filter out duplicate values by the property 'propertyPath'
	const removeDuplicates = (arr) => {
		return arr.filter((o_n, index, self) => {
			return index === self.findIndex((o_m) => o_m.propertyPath === o_n.propertyPath);
		});
	};

	const handleObjectComparison = (key) => {
		const previousValue = a?.[key];
		const currentValue = b?.[key];
		const propertyPath = path ? `${path}.${key}` : key;

		// New Property check
		const propertyRemoved = !!previousValue && typeof currentValue === 'undefined';
		const propertyAddedOrRemoved = a?.hasOwnProperty(key) && !b?.hasOwnProperty(key) || true;

		// Type checks
		const typeHasChanged = checkTypeHasChanged(previousValue, currentValue);
		const previousType = Array.isArray(previousValue) ? 'array' : typeof previousValue;
		const currentType = Array.isArray(currentValue) ? 'array' : typeof currentValue;

		// Value checks
		const valueHasChanged = checkValueHasChanged(previousValue, currentValue);

		results.push({
			propertyAddedOrRemoved,
			propertyAdded,
			propertyRemoved,
			typeHasChanged,
			valueHasChanged,
			propertyPath,
			previousType,
			currentType,
			previousValue,
			currentValue,
		});

		if (typeof currentValue === 'object' && typeof previousValue === 'object') {
			results.push(...deepCompareObjects(previousValue, currentValue, propertyPath));
		}
	};

	for (let key in a) {
		handleObjectComparison(key);
	}

	for (let key in b) {
		handleObjectComparison(key);
	}

	return removeDuplicates(results);
}

function handleNodeTrace(node, ev) {
	function getMessageId(ev) {
		return ev.msg?._msgid;
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
		const traceListWithDelta = traceList.map((traceListItem, index, self) => {
			if (index === 0) {
				return traceListItem;
			}

			const previousTraceListItem = self[index - 1];
			return {
				...traceListItem,
				delta: deepCompareObjects(previousTraceListItem.message, traceListItem.message),
			};
		});
		const traceMap = traceListWithDelta.reduce((previous, current, index) => {
			previous[index] = current;
			return previous;
		}, {});
		const msg = { payload: { traceList: traceListWithDelta, traceMap } };
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

	function sendFile(res, filename) {
		// Use the right function depending on Express 3.x/4.x
		if (res.sendFile) {
			res.sendFile(filename);
		} else {
			res.sendfile(filename);
		}
	}

	RED.httpAdmin.get('/trace/ui/index.html', (req, res) => {
		const filename = path.join(__dirname, 'client', 'dist', 'index.html');
		sendFile(res, filename);
	});

	RED.httpAdmin.get('/trace/ui/assets/*', (req, res) => {
		const filename = path.join(__dirname, 'client', 'dist', 'assets', req.params[0]);
		sendFile(res, filename);
	});

	RED.nodes.registerType('trace', Trace);
};
