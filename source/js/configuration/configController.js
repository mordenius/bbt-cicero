import fs from "fs";
import mkdirp from "mkdirp";
import { ControllerStateStore } from "redux-store-controller";
import Config from "@/config.default.json";

class ConfigController extends ControllerStateStore {
	constructor(options) {
		super({
			stores: options.stores,
			name: "configController"
		});

		this.path = "./build/config/";
	}

	init() {
		return new Promise(resolve => {
			this.open()
				.then(this.parse.bind(this))
				.then(this.remember.bind(this))
				.catch(err => {
					this.defaultConfig(err);
				})
				.then(resolve);
		});
	}

	open() {
		return new Promise((resolve, reject) => {
			try {
				const config = JSON.parse(
					fs.readFileSync(`${this.path}cicero.config.json`, "utf8")
				);
				resolve(config);
			} catch (e) {
				reject(e);
			}
		});
	}

	static parse(config = null) {
		return config;
	}

	remember(config) {
		this.stores.config.set(config);
	}

	save() {
		fs.writeFileSync(`${this.path}cicero.config.json`, JSON.stringify(this.state), "utf8");
	}

	stateDidUpdate() {
		this.parse();
		this.checkDir().then(this.save.bind(this)).catch(process.exit);
	}

	defaultConfig(err = null) {
		global.console.log(`CONFIG PROBLEM: ${err}`);
		if (err.code !== "ENOENT") process.exit();
		this.remember(Config);
	}

	checkDir() {
		return new Promise((resolve, reject) => {
			fs.exists(this.path, exists => {
				if (exists) resolve();
				mkdirp(this.path, err => (err ? reject(err) : resolve()));
			});
		});
	}
}

export default ConfigController;
