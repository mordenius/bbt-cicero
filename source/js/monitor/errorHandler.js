import Logger from "~/services/logger";

class ErrorHandler {
	static error(data) {
		Logger.error(ErrorHandler.errorToString(data));
	}

	static errorToString(err) {
		return err instanceof Error ? err.message : ErrorHandler.toString(err);
	}

	static toString(err) {
		return typeof err === "object" ? JSON.stringify(err) : String(err);
	}
}

export default ErrorHandler;
