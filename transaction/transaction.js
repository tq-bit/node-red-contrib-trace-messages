'use strict';

function handleNodeTransaction(RED, node, ev) {
	try {
		// Init trace for this message
		if (!node.transactions[ev.msg?._msgid]) {
			const transactionId = RED.util.generateId()
			node.transactions[ev.msg?._msgid] = {
				_msgid: transactionId,
				topic: 'transaction',
				payload: {
					id: transactionId,
					msgid: `${ev.msg?._msgid}`,
					start: new Date().getTime(),
					end: null,
					steps: [],
				}
			}
		}

		// Add step for each 'preDeliver' event
		node.transactions[ev.msg?._msgid].payload.steps.push({
			node: `${ev.source.node.type}-${ev.source.node.name || ev.source.node.id}`,
			createdAt: new Date().getTime(),
			snapshotId: `${ev.msg._msgid}-${ev.source.id}-${ev.source.port}`
		})

		// If no next node is recognized, send the message
		if (ev.destination.node._wireCount == 0) {
			node.send(node.transactions[ev.msg?._msgid]);
			node.transactions[ev.msg?._msgid].payload.end = new Date().getTime();
			delete node.transactions[ev.msg?._msgid];
		}
	} catch (error) {
		RED.log.error(error);
	}
}

module.exports = function (RED) {
	function Transaction(config) {
		RED.nodes.createNode(this, config);

		this.name = config.name;
		this.ignore = config.ignore?.split(',').map((nodeType) => nodeType.trim()) || [];
		this.transactions = {}

		RED.hooks.add('preDeliver', (ev) => {
			// This is an 'emergency quit' to prevent propagation of 'preDeliver' events from nodes that come after snapshot or transaction
			if (['snapshot', 'transaction', ...this.ignore].includes(ev?.source?.node?.type)) {
				ev.msg.__isTransactionPreDeliver = true
			}

			// If it is hit, ignore the message
			if(!ev.msg.__isTransactionPreDeliver) {
				handleNodeTransaction(RED, this, ev);
			}

		});
	}
	RED.nodes.registerType('transaction', Transaction);
};
