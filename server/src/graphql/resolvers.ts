const resolvers = {
	Query: {
		getWord: (_: any, __: any, dataSources: any) => {
			console.log(dataSources.dataSources.wordsData.collection);
			return "dataSources.dataSources.wordsData.collection";
		},
	},
};

export default resolvers;
