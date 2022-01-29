const should = require('should');

const request = require('supertest');
const mongoose = require('mongoose');


process.env.ENV = 'Test';
const expressApp = require('../app.js');

const Book = mongoose.model('Book');
const agent = request.agent(expressApp);

describe('Book Crud Test', () => {
  it('should allow a book to be posted and return read and _id', (done) => {
    const bookPost = {title: 'My Book', author: 'Jon', genre: 'finction'};

    agent.post('/api/books')
      .send(bookPost)
      .expect(201)
      .end((err, results) => {
        // console.log(results);
        results.body.read.should.equal(false);
        console.log(results.body);
        results.body.should.have.property('_id');
        done(); // let supertest know this test is done
      });
  });

  afterEach((done)=> {
    Book.deleteMany({}).exec();
    done();
  });

  after((done)=>{
    mongoose.connection.close();
    expressApp.server.close(done());
  });
});

/*
unit testing with Mocka
building controllers for your routes
mock objects with Sinon.js
integration tests with Supertest
*/