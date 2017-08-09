import { ControllerStateStore } from "redux-store-controller";
import EventHandler from "~/monitor/eventHandler";

class ShutdownHandler extends ControllerStateStore {
	constructor(options) {
		super({ stores: options.stores, name: options.name });
		this.config = this.stores.config.getStore;
		this.server = options.server;
	}

	stateDidUpdate() {
		if (!this.state.exit) return;
		this.shutdown();
	}

	shutdown() {
		EventHandler.event({ type: "log", message: `Scheduled shutdown after ~${this.config.shutdownDelay}ms` });
		this.serverClose()
			.catch(ShutdownHandler.errorHandler)
			.then(this.exit.bind(this));
	}

	serverClose() {
		return new Promise((resolve, reject) => {
			try {
				EventHandler.event({ type: "log", message: `Scheduled webSocket server shutdown` });
				this.server.io.close(resolve);
			} catch (e) {
				reject(e);
			}
		});
	}

	exit() {
		setTimeout(process.exit, this.config.shutdownDelay);
	}

	static errorHandler(err) {
		EventHandler.error(`ShutdownHandler: ${err}`);
	}
}

export default ShutdownHandler;
