import filter from "lodash/filter";
import has from "lodash/has";
import EventHandler from "~/monitor/eventHandler";

class Resend {
	constructor(options) {
		this.title = "message";
		this.receiver = null;
		this.sender = options.sender;
		this.message = options.message;

		this.stores = options.stores;
		this.server = options.server;
	}

	parseHeaders() {
		if (has(this.message, "headers")) {
			if (typeof this.message.headers === "object") {
				if (
					has(this.message.headers, "to") &&
					typeof this.message.headers.to === "string"
				)
					return true;
				throw new Error(`The recipient of the message is not listed`);
			} else throw new Error(`Incorrect format message headers`);
		} else throw new Error(`Message headers missing`);
	}

	parseMessage() {
		if (has(this.message, "message")) return true;
		throw new Error(`Message is empty`);
	}

	findReceiver() {
		try {
			const sockets = this.stores.sockets.getStore;
			const receiver = filter(sockets, {
				module: this.message.headers.to
			});
			const id = receiver[0].id;
			this.receiver = this.server.io.sockets.sockets[id];
		} catch (e) {
			throw new Error(`The recipient of the message is disconnected`);
		}
	}

	customTitle() {
		const message =
			typeof this.message === "object"
				? JSON.stringify(this.message)
				: String(this.message);
		if (has(this.message, "title")) {
			if (typeof this.message.title === "string")
				this.title = this.message.title;
			else
				EventHandler.event({
					type: "warn",
					message: `Resend warning \r\n --- Sender: ${this
						.sender} \r\n --- Message: ${message} \r\n --- Warning: Message title specified but has invalid format: ${typeof this
						.message.title}`
				});
		}
	}

	async send() {
		try {
			this.parseHeaders();
			this.parseMessage();
			this.findReceiver();
			this.customTitle();
			this.receiver.emit(this.title, this.message);
		} catch (e) {
			const message =
				typeof this.message === "object"
					? JSON.stringify(this.message)
					: String(this.message);
			EventHandler.event({
				type: "warn",
				message: `Resend error \r\n --- Sender: ${this
					.sender} \r\n --- Message: ${message} \r\n --- Error: ${e}`
			});
		}
	}
}

export default Resend;
