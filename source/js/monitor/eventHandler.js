import Logger from "~/services/logger";
import ErrorHandler from "./errorHandler";

class EventHandler extends ErrorHandler {
	static event(data) {
		switch (data.type) {
			case "connection":
				Logger.connect(data.message);
				break;
			case "message":
				Logger.message(data.message);
				break;
			case "warn":
				Logger.warn(data.message);
				break;
			case "log":
			default:
				Logger.log(data.message);
				break;
		}
	}
}

export default EventHandler;
