import fs from 'fs'
import csv from 'csv-parser'
import createCsvWriter2 from 'csv-writer'
const createCsvWriter = createCsvWriter2.createObjectCsvWriter;

// Step 1: Read CSV data
const authors = [];
const books = [];
const magazines = [];

// Read Authors CSV
fs.createReadStream('authors.csv')
    .pipe(csv())
    .on('data', (row) => {
        authors.push(row);
    })
    .on('end', () => {
        // Read Books CSV
        fs.createReadStream('Books.csv')
            .pipe(csv({}))
            .on('data', (row) => {
                books.push(row);
            })
            .on('end', () => {
                // Read Magazines CSV
                fs.createReadStream('magazines.csv')
                    .pipe(csv())
                    .on('data', (row) => {
                        magazines.push(row);
                    })
                    .on('end', () => {
                        // Call methods after reading all CSV data
                        printBooksAndMagazines();
                        addBookAndMagazineAndExportToCSV({
                            id: '6',
                            title: 'New Book',
                            author_id: '1',
                            isbn: '9781234567890',
                            genre: 'Fiction'
                        }, {
                            id: '6',
                            title: 'New Magazine',
                            author_id: '2',
                            issn: '1234-5678',
                            publisher: 'New Publisher'
                        });

                    });
            });
    });

// fs.createReadStream('authors.csv').pipe(csv({})).on('data', (data) => authors.push(data)).on('end', () => {
//     console.log(authors);
// })

// Step 2: Print out all books and magazines
export const printAllBooksAndMagazines = () => {
    console.log('All Books and Magazines:');
    console.log('----------------------------------------------');
    console.log('Books:');
    console.log(books);
    console.log('----------------------------------------------');
    console.log('Magazines:');
    console.log(magazines);
    console.log('----------------------------------------------');
    console.log('Authors:');
    console.log(authors);
}

// Step 3: Find a book or magazine by its ISBN
export const findBookOrMagazineByISBN = (isbn) => {
    const book = books.find(item => item.isbn === isbn);
    const magazine = magazines.find(item => item.issn === isbn);

    if (book) {
        console.log(`Book with ISBN ${isbn}:`);
        console.log(book);
    } else if (magazine) {
        console.log(`Magazine with ISSN ${isbn}:`);
        console.log(magazine);
    } else {
        console.log(`No book or magazine found with ISBN/ISSN ${isbn}.`);
    }
}

// Step 4: Find all books and magazines by author's email
export const findBooksAndMagazinesByAuthorEmail = (email) => {
    const booksByAuthor = books.filter(item => {
        const author = authors.find(authorItem => authorItem.id === item.author_id);
        return author && author.email === email;
    });

    const magazinesByAuthor = magazines.filter(item => {
        const author = authors.find(authorItem => authorItem.id === item.author_id);
        return author && author.email === email;
    });

    if (booksByAuthor.length > 0 || magazinesByAuthor.length > 0) {
        console.log(`Books and Magazines by author with email ${email}:`);
        console.log('Books:');
        console.log(booksByAuthor);
        console.log('Magazines:');
        console.log(magazinesByAuthor);
    } else {
        console.log(`No books or magazines found for author with email ${email}.`);
    }
}

// Step 5: Print out all books and magazines sorted by title
export const printBooksAndMagazinesSortedByTitle = () => {
    const allItems = [...books, ...magazines];
    const sortedItems = allItems.sort((a, b) => a.title.localeCompare(b.title));

    console.log('Books and Magazines sorted by title:');
    console.log('----------------------------------------------');
    console.log(sortedItems);
}

// Step 6: Add a book and a magazine to the data structure and export it to a new CSV file
export const addBookAndMagazineAndExportToCSV = (newBook, newMagazine) => {
    books.push(newBook);
    magazines.push(newMagazine);

    const allItems = [...books, ...magazines];
    const csvWriter = createCsvWriter({
        path: 'AllItems.csv',
        header: [
            { id: 'id', title: 'ID' },
            { id: 'title', title: 'Title' },
            { id: 'author_id', title: 'Author_ID' },
            { id: 'isbn', title: 'ISBN' },
            { id: 'genre', title: 'Genre' },
            { id: 'issn', title: 'ISSN' },
            { id: 'publisher', title: 'Publisher' }
        ]
    });

    csvWriter.writeRecords(allItems)
        .then(() => {
            console.log('New Book and Magazine added and data exported to AllItems.csv');
        })
        .catch((err) => {
            console.error('Error exporting data to CSV:', err);
        });
}

// Test case for printing all books and magazines
// it('should print all books and magazines', () => {
//     const library = new Library(); // Create a new instance of the Library class

//     // Add some books and magazines to the library
//     library.addBook({
//         bookId: '1',
//         title: 'The Catcher in the Rye',
//         authorId: '1',
//         ISBN: '9780316769174',
//         genre: 'Fiction'
//     });
//     library.addMagazine({
//         magazineId: '1',
//         title: 'National Geographic',
//         authorId: '1',
//         ISSN: '0027-9358',
//         category: 'Science & Nature'
//     });

//     // Capture the output of the printAllBooksAndMagazines method
//     let output = '';
//     console.log = (msg) => {
//         output += msg;
//     };

//     library.printAllBooksAndMagazines(); // Call the method

//     // Assert that the output contains the expected book and magazine information
//     assert.ok(output.includes('Title: The Catcher in the Rye, Author: John Doe, ISBN: 9780316769174, Genre: Fiction'));
//     assert.ok(output.includes('Title: National Geographic, Author: John Doe, ISSN: 0027-9358, Category: Science & Nature'));
// });

// // Test case for finding a book or magazine by its ISBN
// it('should find a book or magazine by its ISBN', () => {
//   const library = new Library(); // Create a new instance of the Library class

//   // Add some books and magazines to the library
//   library.addBook({
//     bookId: '1',
//     title: 'The Catcher in the Rye',
//     authorId: '1',
//     ISBN: '9780316769174',
//     genre: 'Fiction'
//   });
//   library.addMagazine({
//     magazineId: '1',
//     title: 'National Geographic',
//     authorId: '1',
//     ISSN: '0027-9358',
//     category: 'Science & Nature'
//   });

//   const book = library.findBookOrMagazineByISBN('9780316769174'); // Call the method

//   // Assert that the returned book object matches the expected book object
//   assert.deepStrictEqual(book, {
//     bookId: '1',
//     title: 'The Catcher in the Rye',
//     authorId: '1',
//     ISBN: '9780316769174',
//     genre: 'Fiction'
//   });
// });

