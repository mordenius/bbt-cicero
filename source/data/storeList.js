const StoreList = [
	{
		name: "config",
		options: {
			initState: null
		}
	},
	{
		name: "sockets",
		options: {
			initState: []
		}
	},
	{
		name: "shutdown",
		options: {
			initState: { exit: false }
		}
	}
];

export default StoreList;
