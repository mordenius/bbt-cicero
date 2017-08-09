import { StoreController } from "redux-store-controller";
import ConfigController from "~/configuration/configController";
import Logger from "~/services/logger";
import ServerSocket from "~/network/serverSocket";
import ShutdownHandler from "~/services/shutdownHandler";
import StoreList from "./storeList";
import SubscriptionMap from "./subscriptionMap";

const LoaderList = [
	{
		step: 0,
		parts: [
			{
				name: "storeList",
				type: "data",
				controller: StoreList
			},
			{
				name: "subscriptionMap",
				type: "data",
				controller: SubscriptionMap
			},
			{
				name: "stores",
				type: "class",
				controller: StoreController,
				params: ["storeList", "subscriptionMap"]
			},
			{
				name: "configController",
				type: "init",
				controller: ConfigController,
				params: ["stores", "selfName"]
			},
			{
				name: "logger",
				type: "init",
				controller: Logger,
				params: ["stores"]
			}
		]
	},
	{
		step: 1,
		parts: [
			{
				name: "server",
				type: "init",
				controller: ServerSocket,
				params: ["stores"]
			}
		]
	},
	{
		step: 2,
		parts: [
			{
				name: "shutdownHandler",
				type: "class",
				controller: ShutdownHandler,
				params: ["stores", "selfName", "server"]
			}
		]
	}
];

export default LoaderList;
