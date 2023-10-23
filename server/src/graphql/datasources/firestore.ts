import type { Timestamp } from "firebase-admin/firestore";
import { FirestoreDataSource } from "apollo-datasource-firestore";

export interface UserDoc {
	// a string id value is required for entities using this library.
	// It will be used for the firestore document ID but not stored in the document in firestore.
	readonly id: string;
	readonly collection: "users";
	// the createdAt and updatedAt timestamps stored by firestore natively are
	// available as properties as well
	readonly createdAt: Timestamp;
	readonly updatedAt: Timestamp;
	name: string;
	groupId: number;
}

export interface WordDoc {
	readonly id: string;
	readonly collection: "posts";
	// the createdAt and updatedAt timestamps stored by firestore natively are
	// available as properties as well
	readonly createdAt: Timestamp;
	readonly updatedAt: Timestamp;
	word: string;
	count: number;
}

export class UserDataSource extends FirestoreDataSource<UserDoc> {}
export class WordDataSource extends FirestoreDataSource<WordDoc> {}
export class DevWordDataSource extends FirestoreDataSource<WordDoc> {}

export const userConverter = {
	toFirestore: function (user: UserDoc) {
		// Convert a UserDoc object into a Firestore document
		return { ...user };
	},
	fromFirestore: function (
		snapshot: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
	) {
		const data = snapshot.data();
		// Convert a Firestore document into a UserDoc object
		return data as UserDoc;
	},
};

export const wordConverter = {
	toFirestore: function (words: WordDoc) {
		return { ...words };
	},
	fromFirestore: function (
		snapshot: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
	) {
		const data = snapshot.data();
		// Convert a Firestore document into a UserDoc object
		return data as WordDoc;
	},
};
