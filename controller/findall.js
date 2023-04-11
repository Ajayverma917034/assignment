import tryCatch from "./utils/tryCatch.js"

import fs from 'fs';
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
                    });
            });
    });



export const getAll = tryCatch(async (req, res) => {
    res.status(201).json({ success: true, result: { books, magazines } })
})
export const findByInSorted = tryCatch(async (req, res) => {
    const allItems = [...books, ...magazines];
    const sortedItems = allItems.sort((a, b) => a.title.localeCompare(b.title));
    res.status(201).json({ success: true, result: { sortedItems } })
})


export const findByEmail = tryCatch(async (req, res) => {
    const email = req.body.email;
    const booksByAuthor = books.filter(item => {
        const author = authors.find(authorItem => authorItem.id === item.author_id);
        return author && author.email === email;
    });
    const magazinesByAuthor = magazines.filter(item => {
        const author = authors.find(authorItem => authorItem.id === item.author_id);
        return author && author.email === email;
    });
    if (booksByAuthor.length > 0 || magazinesByAuthor.length > 0)
        res.status(201).json({ success: true, result: { booksByAuthor, magazinesByAuthor } })
    else
        res.status(201).json({ success: false, res: {} })
})

export const findByIsbn = tryCatch(async (req, res) => {
    const isbn = req.body.isbn;
    // console.log(isbn)
    const booksByAuthor = books.find(item => item.isbn === isbn);
    const magazinesByAuthor = magazines.find(item => item.issn === isbn);
    // console.log(booksByAuthor)
    if (booksByAuthor)
        res.status(201).json({ success: true, result: { booksByAuthor } })
    else if (magazinesByAuthor)
        res.status(201).json({ success: true, result: { booksByAuthor: magazinesByAuthor } })
    else
        res.status(201).json({ success: false, res: {} })
})

export const AddData = tryCatch(async (req, res) => {
    const { bookData, magazine } = req.body;

    books.push(bookData);
    magazines.push(magazine);
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
            res.status(201).json({ success: true, result: { allItems, message: 'New Book and Magazine added and data exported to AllItems.csv' } })
            // console.log('New Book and Magazine added and data exported to AllItems.csv');
        })
        .catch((err) => {
            res.status(201).json({ success: true, result: { allItems, message: 'Error exporting data to CSV:' } })
            console.error('Error exporting data to CSV:', err);
        });
})



