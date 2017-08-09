import Resend from "~/network/common/resend";
import EventHandler from "~/monitor/eventHandler";

class HierarchyMessageHandler {
	constructor(options) {
		this.stores = options.stores;
		this.parent = options.parent;
		this.server = options.server;
		this.config = this.stores.config.getStore;
	}

	init() {
		this.parent.in.emit("message", {
			event: "INTRO",
			name: this.parent.io.id,
			group: "child"
		});

		this.parent.io.on("message", data => {
			if (this.config.log.message) HierarchyMessageHandler.logMessage(data);

			switch (data.event) {
				case "SEND_ON":
					this.resend(data);
					break;
				default:
					HierarchyMessageHandler.notSupportedCall(data);
					break;
			}
		});
	}

	static notSupportedCall(data) {
		EventHandler.event({
			type: "message",
			message: `Received not supported event "${data.event}" in message from parent`
		});
	}

	resend(data) {
		let postman = new Resend({
			message: data,
			stores: this.stores,
			server: this.server,
			sender: "Parent"
		});
		postman.send().then(() => {
			postman = null;
		});
	}

	static logMessage(data) {
		const message =
			typeof data === "object" ? JSON.stringify(data) : String(data);
		EventHandler.event({
			type: "message",
			message: `Parent message \r\n --- ${message}`
		});
	}
}

export default HierarchyMessageHandler;
