import io from "socket.io-client";
import ip from "ip";
import Config from "@/config.default.json";

const conn = io(`ws://${ip.address()}:${Config.port}/`);

conn.on("connect", () => {
	global.console.log(`Connected, conn1`);
	setTimeout(() => { conn.emit("message", { event: "INTRO", name: "conn1" }) }, 1000);
	setTimeout(() => { conn.close()}, 5000);
});

conn.on("message", message => {
	global.console.log(message)
})
//
// conn.on("reconnect_attempt", cnt => {
// 	console.log(cnt);
// });
//
const conn2 = io(`ws://192.168.10.2:${Config.port}/`);
//
conn2.on("connect", () => {
	global.console.log(`Connected, conn2`);
	setTimeout(() => { conn2.emit("message", { event: "INTRO", name: "conn2" }) }, 2000);
	setTimeout(() => { conn2.emit("message", { event: "SEND_ON", headers: {to: "conn1"}, message: 'hi' }) }, 2000);
// 	// setTimeout(() => { conn2.emit("message", { event: "SEND_ON", name: "conn2" }) }, 3000);
// 	// setTimeout(() => { conn2.emit("message", { event: "SHUTDOWN" }) }, 10000);
// 	setTimeout(() => { process.exit() }, 10000);
});
