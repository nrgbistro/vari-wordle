import gql from "graphql-tag";

const typeDefs = gql`
	type Query {
		getWord: String
	}

	type Word {
		word: String
		count: Int
	}
`;

export default typeDefs;
