import io from "socket.io-client";
import ControllerStateStore from "redux-store-controller";
import EventHandler from "~/monitor/eventHandler";
import HierarchyMessageHandler from "./hierarchyMessageHandler";

class HierarchyConnection extends ControllerStateStore {
	constructor(options) {
		super(options);
		this.server = options.server;
		this.io = null;
	}

	stateDidInit() {
		this.changeHandler();
	}

	stateDidUpdate() {
		this.changeHandler();
	}

	changeHandler() {
		if (this.state.server == null) this.closeConnection();
		else this.openConnection();
	}

	openConnection() {
		if (this.io instanceof io) return;
		this.io = io(`ws://${this.state.server}/`);

		let handler = null;

		this.io.on("connect", () => {
			handler = new HierarchyMessageHandler({
				stores: this.stores,
				server: this.server,
				parent: this
			});

			handler.init();

			EventHandler.event({
				type: "log",
				message: `Connected to server ${this.state.server}`
			});
		});

		this.io.on("disconnect", reason => {
			handler = null;
			EventHandler.event({
				type: reason === "io client disconnect" ? "log" : "warn",
				message: `Disconnect from server ${this.state
					.server} by reason: ${reason}`
			});
		});
	}

	closeConnection() {
		if (this.io == null) return;
		this.io.close();
		this.io = null;
	}
}

export default HierarchyConnection;
