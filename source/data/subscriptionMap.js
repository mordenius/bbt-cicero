const SubscriptionMap = [
	{
		class: "shutdownHandler",
		storesRules: [
			{
				store: "shutdown",
				fields: ["exit"]
			}
		]
	},
	{
		class: "configController",
		storesRules: [
			{
				store: "config"
			}
		]
	},
	{
		class: "hierarchyConnection",
		storesRules: [
			{
				store: "config",
				fields: ["server"]
			}
		]
	}
];

export default SubscriptionMap;