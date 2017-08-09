import Resend from "~/network/common/resend";
import EventHandler from "~/monitor/eventHandler";

class ResendHandler extends Resend {
	appendSenderHeader() {
		this.message.headers.from = this.sender;
	}

	async send() {
		try {
			this.appendSenderHeader();
			await super.send();
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

export default ResendHandler;
