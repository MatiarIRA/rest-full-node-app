const express = require('express');
const booksController = require('../controllers/booksController');

// routes funciton gets a Book model and return a bookRouter
function routes(Book) {
  const bookRouter = express.Router();
  const controller = booksController(Book);
  bookRouter.route('/books')
    .post(controller.post)
    .get(controller.get);
    // res.json(response); // sending a response back | res.send sends only texts | res.rend renders smth
/*
as we saw that while implementing get and put and patch we were repeating ourselves! cause each of them would need to find a book by Id and then do some stuff and then return
to avoid that we wil use a middleware.
Middleware interupt the request and do some modification on it and then let it pass throw to the route.
code writing in order matters here.
using the middleware here to find the book by id and add it into the request
*/
bookRouter.use('/books/:bookId', (req, res, next) => {
  Book.findById(req.params.bookId, (err, book) => { 
    if(err) {
        return res.send(err);
    }
    if(book) {
      req.book = book;
      return next();
    }
    return res.sendStatus(404);
  });
});

/*
bookRouter.route('/books/:bookId')
    .get((req, res) => {
        Book.findById(req.params.bookId, (err, book) => { // CHANGE BOOKS TO BOOK
            if(err) {
                return res.send(err); // sending the error back if existed
            }
            return res.json(book);

        });
        // res.json(response); // sending a response back | res.send sends only texts | res.rend renders smth
    })
    .put((req, res) => {
      Book.findById(req.params.bookId, (err, book) => { // CHANGE BOOKS TO BOOK
        if(err) {
            return res.send(err); // sending the error back if existed
        }
        book.author = req.body.author;
        book.title = req.body.title;
        book.read = req.body.read;
        book.genre = req.body.genre;
        console.log(`replacing a book ${book}`);
        // saving in DB
        book.save();
        return res.status(201).json(book);
      })
    });
    */
  bookRouter.route('/books/:bookId')
    .get((req, res) => {
        // adding HATEOAS
        const returnBook = req.book.toJSON();
        returnBook.links = {};
        const genre = req.book.genre.replace(' ', '%20');
        returnBook.links.FilterByThisGenre= `http://${req.headers.host}/api/books/?genre=${genre}`
        res.json(returnBook);
    })
    .put((req, res) => {
      // pulling book out of the req
      const { book } = req;
      book.author = req.body.author;
      book.title = req.body.title;
      book.read = req.body.read;
      book.genre = req.body.genre;
      console.log(`replacing a book ${book}`);
      // saving in DB
      req.book.save((err) => { // make it ASYNC by passing a CALLBACK!!!! catching err
        if(err) {
          return res.send(err);
        }
        return res.status(201).json(book);
      });
    })
    .patch((req, res) => {
      // pulling book out of the req
      const { book } = req;
      if(req.body._id) { // we don't want to update the ID so we just delete it.
        delete req.body._id; 
      }
      /*
        For patch we should check each field if the filed exists we do the update.
        but using `if` statement for each field is silly!! so we do it this way instead
      */
      Object.entries(req.body).forEach(item => {
        const key = item[0];
        const value = item[1];
        book[key] = value;
      });
      req.book.save((err) => { // make it ASYNC by passing a CALLBACK!!!! catching err
        if(err) {
          return res.send(err);
        }
        return res.json(book);
      });
    })
    .delete((req, res) => {
      req.book.remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204 );
      });

    });

    return bookRouter;
}

module.exports = routes;

/*
Test

- Unit Testing with Mocha
- Building controllers for your routes
- Mock objects with Sinon.js
- Integration test with Supertest
*/