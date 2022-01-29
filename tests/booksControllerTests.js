const { send, json } = require('express/lib/response');
const should = require('should');
const sinon = require('sinon');
// ** we don't need an instance of mocha - bcs it will be run inside the mocha framework
const booksController = require('../controllers/booksController');

describe('Book Controller Tests:', () => {
  describe('Post', () => {
    it('should not allow an empty title on post', () => {
      const Book = function (book) {this.save = () => {}} // JavaScript is not type safe language | so this funciton doesn't need to do anything

      const req = {
        body: {
          authoer: 'Jon'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      }

      const controller = booksController(Book);
      controller.post(req, res);
      res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`)
      res.send.calledWith('Title is required').should.equal(true);
    });
  });
});
