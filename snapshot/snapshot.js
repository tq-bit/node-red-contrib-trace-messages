'use strict';

function handleNodeSnapshot(RED, node, ev) {
	node.send({
		_msgid: RED.util.generateId(),
		topic: 'snapshot',
		transaction: `${ev.msg._msgid}`,
		payload: {
			id: `${ev.msg._msgid}-${ev.source.id}-${ev.source.port}`,
			node: `${ev.source.node.type}-${ev.source.node.name || ev.source.node.id}`,
			createdAt: new Date().getTime(),
			msg: ev.msg,
		}
	});
}

module.exports = function (RED) {
	function Snapshot(config) {
		RED.nodes.createNode(this, config);

		this.name = config.name;
		this.ignore = config.ignore?.split(',').map((nodeType) => nodeType.trim()) || [];

		RED.hooks.add('preDeliver', (ev) => {
			// This is an 'emergency quit' to prevent propagation of 'preDeliver' events from nodes that come after snapshot or transaction
			if (['snapshot', 'transaction', ...this.ignore].includes(ev?.source?.node?.type)) {
				ev.msg.__isTransactionPreDeliver = true
			}

			// If it is hit, ignore the message
			if(!ev.msg.__isTransactionPreDeliver) {
				handleNodeSnapshot(RED, this, ev);
			}
		});
	}
	RED.nodes.registerType('snapshot', Snapshot);
};
