import moment from "moment";
import remove from "lodash/remove";
import findIndex from "lodash/findIndex";
import set from "lodash/set";
import EventHandler from "~/monitor/eventHandler";
import MessageHandler from "./messageHandler";

class SocketHandler extends MessageHandler {
	handlers() {
		EventHandler.event({
			type: "connection",
			message: `${this.id} was connected`
		});

		super.handlers();

		this.socket.on("disconnecting", this.disconnectHandler.bind(this));
		this.socket.on("error", this.errorHandler.bind(this));

		this.stores.sockets.set([...this.stores.sockets.getStore,
			{
				id: this.id,
				module: null,
				group: null,
				ip: this.socket.handshake.address,
				active: true,
				lastConnetion: moment().format("X")
			}
		]);
	}

	disconnectHandler(reason) {
		EventHandler.event({
			type: "connection",
			message: `Connection with ${this.name ||
				this.id} was disconnected with the reason: ${reason}`
		});

		const s = this.stores.sockets.getStore;
		const index = findIndex(s, { id: this.id });
		if (s[index].name == null) remove(s, { id: this.id });
		else {
			set(s, [index, "module"], this.name);
			set(s, [index, "group"], this.group);
			set(s, [index, "active"], false);
			set(s, [index, "lastConnetion"], moment().format("X"));
		}

		this.stores.sockets.set(s);
	}

	errorHandler(err) {
		EventHandler.error(
			`SocketHandler: WebSocket ${this.name || this.id} catch error: ${err}`
		);
	}
}

export default SocketHandler;
