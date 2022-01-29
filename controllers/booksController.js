function booksController(Book) {
    function post (req, res) {
        const book = new Book(req.body); // we need bodyParser for this
        console.log(`adding a book ${book}`);
        if (!req.body.title) { // ERROR HANDLING
            res.status(400);
            return res.send('Title is required');
        }
        // saving in DB
        book.save();
        // res.status(201).json(book); // wouldn't work for the test
        res.status(201);
        res.json(book);
    };
    function get(req, res) {
        const { query } = req; // const query = req.query;       NOW you can add querys to your path ?genre=Historical%20Fiction  BUT this accepts also nimporte quoi ?adfad=adad and gives an empty list
        /*
            To fix that issue;

            const query = {};

            if (req.query.genre) {
                query.genre = req.query.genre;
            }

        */
        // const response = {Hello: "This is your book"};
        Book.find(query, (err, books) => {  // *************************** we adding return statements to avoid sending err and book at the same time ***********
            if(err) {
                return res.send(err); // sending the error back if existed
            }

            // implementing HATEOAS
            const returnBooks = books.map((book) => {
                const newBook = book.toJSON();
                newBook.links = {};
                newBook.links.self = `http://${req.headers.host}/api/books/${book._id}`;
                return newBook;
            });
            // return res.json(books);
            return res.json(returnBooks);

        });
    }
    return {post, get}; // REVEALING MODULE PATTERN
}

module.exports = booksController;