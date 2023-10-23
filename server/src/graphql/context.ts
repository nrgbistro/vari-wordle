import type { ApolloServer } from "@apollo/server";
import {
	WordDataSource,
	UserDataSource,
	userConverter,
	wordConverter,
} from "./datasources/firestore";
import { firestore } from "firebase";

export class ContextValue {
	public dataSources: {
		wordsData: WordDataSource;
		usersData: UserDataSource;
	};

	constructor({ server }: { server: ApolloServer<ContextValue> }) {
		const { cache } = server;
		const userCollection = firestore
			.collection("userData")
			.withConverter(userConverter);
		const wordCollection = firestore
			.collection("wordBank")
			.withConverter(wordConverter);
		this.dataSources = {
			wordsData: new WordDataSource(wordCollection, { cache }),
			usersData: new UserDataSource(userCollection, { cache }),
		};
	}
}
