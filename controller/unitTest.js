import Library from './Library.js'
import assert from 'assert' // Import the Node.js assert module for assertions
// Test case for printing all books and magazines
it('should print all books and magazines', () => {
    const library = new Library(); // Create a new instance of the Library class

    // Add some books and magazines to the library
    library.addBook({
        bookId: '1',
        title: 'The Catcher in the Rye',
        authorId: '1',
        ISBN: '9780316769174',
        genre: 'Fiction'
    });
    library.addMagazine({
        magazineId: '1',
        title: 'National Geographic',
        authorId: '1',
        ISSN: '0027-9358',
        category: 'Science & Nature'
    });

    // Capture the output of the printAllBooksAndMagazines method
    let output = '';
    console.log = (msg) => {
        output += msg;
    };

    library.printAllBooksAndMagazines(); // Call the method

    // Assert that the output contains the expected book and magazine information
    assert.ok(output.includes('Title: The Catcher in the Rye, Author: John Doe, ISBN: 9780316769174, Genre: Fiction'));
    assert.ok(output.includes('Title: National Geographic, Author: John Doe, ISSN: 0027-9358, Category: Science & Nature'));
});
