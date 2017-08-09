import findIndex from "lodash/findIndex";
import set from "lodash/set";
import has from "lodash/has";
import EventHandler from "~/monitor/eventHandler";
import ResendHandler from "./resendHandler";

class MessageHandler {
	constructor(options) {
		this.stores = options.stores;
		this.config = this.stores.config.getStore;
		this.server = options.server;

		this.socket = options.socket;
		this.id = this.socket.id;
		this.name = null;
		this.group = null;

		this.handlers();
	}

	handlers() {
		this.socket.on("message", data => {
			if (this.config.log.message) this.logMessage(data);

			switch (data.event) {
				case "SHUTDOWN":
					this.shutdown();
					break;
				case "INTRO":
					this.greeting(data);
					break;
				case "SEND_ON":
					this.resend(data);
					break;
				default:
					this.notSupportedCall(data);
					break;
			}
		});
	}

	shutdown() {
		if (this.name == null) {
			EventHandler.error(
				`Attempt to initialize system shutdown from ${this.socket.handshake
					.address}`
			);
			return;
		}

		EventHandler.event({
			type: "log",
			message: `Shutdown initiated from ${this.name}`
		});

		this.stores.shutdown.set({ exit: true });
	}

	greeting(data) {
		this.name = data.name;
		this.group = has(data.group) ? data.group : null;
		const s = this.stores.sockets.getStore;
		const index = findIndex(s, { id: this.id });
		set(s, [index, "module"], this.name);
		set(s, [index, "group"], this.group);
		this.stores.sockets.set(s);

		if (typeof this.group === "string") this.socket.join(this.group);

		EventHandler.event({
			type: "connection",
			message: `Connection identified ${this.id}: ${this.name} in group: ${this
				.group}`
		});
	}

	notSupportedCall(data) {
		EventHandler.event({
			type: "message",
			message: `Received not supported event "${data.event}" in message from Name: ${this
				.name} Connection: ${this.id} IP: ${this.socket.handshake.address}`
		});
	}

	resend(data) {
		if (this.name == null) {
			EventHandler.error(
				`Attempt to send on data from unidentified connection: ${this.socket
					.handshake.address}`
			);
			return;
		}

		let postman = new ResendHandler({
			message: data,
			stores: this.stores,
			server: this.server,
			sender: `${this.name} / ${this.id}`
		});
		postman.send().then(() => {
			postman = null;
		});
	}

	logMessage(data) {
		const message =
			typeof data === "object" ? JSON.stringify(data) : String(data);
		EventHandler.event({
			type: "message",
			message: `Name: ${this.name} Connection: ${this.id} IP: ${this.socket
				.handshake.address} \r\n --- ${message}`
		});
	}
}

export default MessageHandler;
