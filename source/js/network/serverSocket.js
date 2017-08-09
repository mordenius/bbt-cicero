import io from "socket.io";
import EventHandler from "~/monitor/eventHandler";
import SocketHandler from "./socketHandler";
import HierarchyConnection from "./hierarchy/hierarchyConnection";

class ServerSocket {
	constructor(options) {
		this.stores = options.stores;
		this.config = this.stores.config.getStore;
		this.parent = null;
		this.io = null;
	}

	init() {
		return new Promise((resolve, reject) => {
			this.parentConnect();
			this.startServer()
				.then(this.handler.bind(this))
				.then(resolve)
				.catch(reject);
		});
	}

	parentConnect() {
		this.parent = new HierarchyConnection({
			stores: this.stores,
			name: "hierarchyConnection",
			server: this
		});
	}

	startServer() {
		return new Promise((resolve, reject) => {
			try {
				this.io = io(this.config.port);
				EventHandler.event({
					type: "log",
					message: `ServerSocket->init(): WebSocket Server Started.`
				});
				resolve();
			} catch (e) {
				EventHandler.error(`ServerSocket->init(): ${e}`);
				reject();
			}
		});
	}

	handler() {
		this.io.on("error", err => {
			EventHandler.error(`ServerSocket: WebSocket catch error: ${err}`);
		});

		this.io.on("connect", s => {
			const param = {
				stores: this.stores,
				socket: s,
				server: this
			};
			let conn = new SocketHandler(param);

			global.console.log(Object.keys(this.io.sockets.sockets));

			conn.socket.on("disconnect", () => {
				conn = null;
			});
		});
	}
}

export default ServerSocket;
