import io from "socket.io-client";
import ip from "ip";
import Config from "@/config.default.json";

let conn = null;

function connect(){
	conn = io(`ws://${ip.address()}:${Config.port}/`);

	conn.on("connect", () => {
		global.console.log({
			type: "log",
			message: `Connected to server`
		});
	});

	conn.on("disconnect", reason => {
		global.console.log({
			type: reason === "io client disconnect" ? "log" : "warn",
			message: `Disconnect from server by reason: ${reason}`
		});
	});
}

connect();




setTimeout(() => { conn.close(); conn = null}, 2000);
setTimeout(() => { connect() }, 4000);