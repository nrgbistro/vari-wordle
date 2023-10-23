interface Book {
	id: string;
	title: string;
	author: string;
}

class BookDataSource {
	books: Book[]; // Sample data for demonstration

	constructor() {
		// Sample data for demonstration
		this.books = [
			{
				id: "1",
				title: "Harry Potter and the Sorcerer's Stone",
				author: "J.K. Rowling",
			},
			{ id: "2", title: "To Kill a Mockingbird", author: "Harper Lee" },
		];
	}

	// Fetch all books
	getBooks() {
		return this.books;
	}

	// Fetch a book by ID
	getBookById(id: string) {
		return this.books.find((book) => book.id === id);
	}
}

module.exports = BookDataSource;
