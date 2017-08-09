//---------------------------------
//	Примечание:
//-----
//	При формировании строки лога использовать формат
//	Logger.log('Class.method: '+err);
//-----
//	Class - файл/класс из которого происходит обращение к логгеру
//	method - метод/функция, при выполнении которой формируется лог
//	err - описание ошибки/тело лога.
//	_________________________________

import fs from "fs";
import mkdirp from "mkdirp";
import moment from "moment";

class Logger {
	// eslint-disable-next-line
	init() {
		return new Promise((resolve, reject) => {
			Logger.checkDir(true).then(resolve).catch(reject);
		});
	}

	static connect(data) {
		Logger.writeLog("connect", data);
	}

	static message(data) {
		Logger.writeLog("message", data);
	}

	static log(data) {
		Logger.writeLog("log", data);
	}

	static warn(data) {
		Logger.writeLog("warn", data);
	}

	static error(data) {
		Logger.writeLog("error", data);
	}

	static writeLog(type, data) {
		const d = moment();
		const file = `./log/cicero/${d.format("MM-YYYY")}/${type}.log`;
		const message = `\r\n ${d.format("DD/MM/YYYY HH:mm:ss")} ${data}`;

		Logger.checkDir()
			.then(() => {
				fs.appendFile(file, message, err => {
					if (err) throw new Error(`Logger.${type} error: ${err}`);
				});
			})
			.catch(global.console.log);
	}

	static checkDir(home = false) {
		let dir = "./log/cicero/";
		dir += home ? `` : `/${moment().format("MM-YYYY")}`;

		return new Promise((resolve, reject) => {
			fs.exists(dir, exists => {
				if (exists) resolve();
				mkdirp(dir, err => (err ? reject(err) : resolve()));
			});
		});
	}
}

export default Logger;
